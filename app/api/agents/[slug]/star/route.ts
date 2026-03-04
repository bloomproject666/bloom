import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agent = await prisma.agent.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const existing = await prisma.star.findUnique({
      where: {
        userId_agentId: {
          userId: session.user.id,
          agentId: agent.id,
        },
      },
    })

    if (existing) {
      // Unstar
      await prisma.star.delete({
        where: {
          userId_agentId: {
            userId: session.user.id,
            agentId: agent.id,
          },
        },
      })
    } else {
      // Star
      await prisma.star.create({
        data: {
          userId: session.user.id,
          agentId: agent.id,
        },
      })
    }

    const count = await prisma.star.count({ where: { agentId: agent.id } })

    return NextResponse.json({
      starred: !existing,
      count,
    })
  } catch (error) {
    console.error('POST /api/agents/[slug]/star error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const agent = await prisma.agent.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const count = await prisma.star.count({ where: { agentId: agent.id } })

    let starred = false
    if (session?.user?.id) {
      const star = await prisma.star.findUnique({
        where: {
          userId_agentId: {
            userId: session.user.id,
            agentId: agent.id,
          },
        },
      })
      starred = !!star
    }

    return NextResponse.json({ starred, count })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
