import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const agent = await prisma.agent.findUnique({
      where: { slug: params.slug },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { stars: true } },
      },
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...agent,
      starCount: agent._count.stars,
    })
  } catch (error) {
    console.error('GET /api/agents/[slug] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
