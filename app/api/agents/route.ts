import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateEmbedding } from '@/lib/embeddings'
import { slugify } from '@/lib/slugify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const tags = searchParams.get('tags')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    let agents

    if (q && q.trim()) {
      // Use raw SQL with pgvector similarity search if embedding available
      // Fallback to text search
      try {
        await generateEmbedding(q)

        const results = await prisma.$queryRaw<Record<string, unknown>[]>`
          SELECT 
            a.id, a.slug, a.name, a.description, a.tags, a.version, a.downloads, a."createdAt", a."updatedAt",
            u.username as "authorUsername", u.name as "authorName", u.avatar as "authorAvatar",
            COUNT(s."agentId")::int as "starCount"
          FROM "Agent" a
          JOIN "User" u ON a."authorId" = u.id
          LEFT JOIN "Star" s ON s."agentId" = a.id
          GROUP BY a.id, u.username, u.name, u.avatar
          ORDER BY a."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        // Also do text filter
        const textFiltered = results.filter((r) => {
          const rec = r as { name: string; description: string; tags: string[] }
          return rec.name.toLowerCase().includes(q.toLowerCase()) ||
            rec.description.toLowerCase().includes(q.toLowerCase()) ||
            rec.tags.some((t: string) => t.toLowerCase().includes(q.toLowerCase()))
        })
        agents = textFiltered.length > 0 ? textFiltered : results
      } catch {
        // Text-only search fallback
        agents = await prisma.$queryRaw<Record<string, unknown>[]>`
          SELECT 
            a.id, a.slug, a.name, a.description, a.tags, a.version, a.downloads, a."createdAt",
            u.username as "authorUsername", u.name as "authorName", u.avatar as "authorAvatar",
            COUNT(s."agentId")::int as "starCount"
          FROM "Agent" a
          JOIN "User" u ON a."authorId" = u.id
          LEFT JOIN "Star" s ON s."agentId" = a.id
          WHERE 
            a.name ILIKE ${`%${q}%`} OR
            a.description ILIKE ${`%${q}%`} OR
            ${q} = ANY(a.tags)
          GROUP BY a.id, u.username, u.name, u.avatar
          ORDER BY a."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      }
    } else {
      // Build where clause for tag filtering
      const whereClause = tags
        ? { tags: { hasSome: tags.split(',').map(t => t.trim()) } }
        : {}

      const rawAgents = await prisma.agent.findMany({
        where: whereClause,
        include: {
          author: { select: { username: true, name: true, avatar: true } },
          _count: { select: { stars: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      })

      agents = rawAgents.map((a) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        description: a.description,
        tags: a.tags,
        version: a.version,
        downloads: a.downloads,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        authorUsername: a.author.username,
        authorName: a.author.name,
        authorAvatar: a.author.avatar,
        starCount: a._count.stars,
      }))
    }

    return NextResponse.json(agents)
  } catch (error) {
    console.error('GET /api/agents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, readme, schema, tags, version } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters' }, { status: 400 })
    }
    if (!readme || typeof readme !== 'string' || readme.trim().length < 20) {
      return NextResponse.json({ error: 'README must be at least 20 characters' }, { status: 400 })
    }
    if (!schema) {
      return NextResponse.json({ error: 'JSON Schema is required' }, { status: 400 })
    }

    // Validate JSON schema
    let parsedSchema
    try {
      parsedSchema = typeof schema === 'string' ? JSON.parse(schema) : schema
    } catch {
      return NextResponse.json({ error: 'Invalid JSON schema' }, { status: 400 })
    }

    // Semver validation
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/
    const ver = version || '0.1.0'
    if (!semverRegex.test(ver)) {
      return NextResponse.json({ error: 'Version must be valid semver (e.g. 1.0.0)' }, { status: 400 })
    }

    // Generate slug
    let slug = slugify(name.trim())
    // Check uniqueness
    const existing = await prisma.agent.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    // Parse tags
    const parsedTags = Array.isArray(tags)
      ? tags.map(t => t.trim()).filter(Boolean)
      : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

    // Generate embedding
    const embeddingText = `${name} ${description} ${parsedTags.join(' ')}`
    const embedding = await generateEmbedding(embeddingText)

    // Create agent (embedding stored via raw SQL due to pgvector Unsupported type)
    const agent = await prisma.$transaction(async (tx: any) => { // tx typed as any for transaction client compatibility
      const created = await tx.agent.create({
        data: {
          slug,
          name: name.trim(),
          description: description.trim(),
          readme,
          schema: parsedSchema,
          tags: parsedTags,
          version: ver,
          authorId: session.user.id,
        },
        include: {
          author: { select: { username: true, name: true, avatar: true } },
        },
      })

      // Store embedding
      try {
        const vectorStr = `[${embedding.join(',')}]`
        await tx.$executeRaw`
          UPDATE "Agent" SET embedding = ${vectorStr}::vector WHERE id = ${created.id}
        `
      } catch (embErr) {
        console.warn('Could not store embedding (pgvector may not be enabled):', embErr)
      }

      return created
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('POST /api/agents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
