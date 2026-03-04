import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalAgents, totalDevelopers, totalStars] = await Promise.all([
      prisma.agent.count(),
      prisma.user.count(),
      prisma.star.count(),
    ])

    return NextResponse.json({
      totalAgents,
      totalDevelopers,
      totalStars,
    })
  } catch (error) {
    console.error('GET /api/stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
