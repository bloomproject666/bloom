import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgentCard from '@/components/AgentCard'

async function getStats() {
  try {
    const [totalAgents, totalDevelopers, totalStars] = await Promise.all([
      prisma.agent.count(),
      prisma.user.count(),
      prisma.star.count(),
    ])
    return { totalAgents, totalDevelopers, totalStars }
  } catch {
    return { totalAgents: 0, totalDevelopers: 0, totalStars: 0 }
  }
}

async function getRecentAgents() {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        author: { select: { username: true, name: true, avatar: true } },
        _count: { select: { stars: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
    return agents
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [stats, agents] = await Promise.all([getStats(), getRecentAgents()])

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111] leading-tight tracking-tight mb-4">
                The open registry for AI agents.
              </h1>
              <p className="text-base sm:text-lg text-[#6B7280] mb-7 leading-relaxed">
                Publish, discover, and deploy agents built for the modern AI stack. Free and open source.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/explore">
                  <button className="bg-[#F97316] text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-[#ea6a05] transition-colors">
                    Browse agents
                  </button>
                </Link>
                <Link href="/publish">
                  <button className="border border-[#F97316] text-[#F97316] px-5 py-2.5 rounded text-sm font-medium hover:bg-[#FFF7ED] transition-colors">
                    Publish yours
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#111111] tabular-nums">{stats.totalAgents}</p>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">agents</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#111111] tabular-nums">{stats.totalDevelopers}</p>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">developers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#111111] tabular-nums">{stats.totalStars}</p>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">stars</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent agents */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#111111]">Recently published</h2>
            <Link href="/explore" className="text-sm text-[#F97316] hover:underline">
              View all
            </Link>
          </div>

          {agents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  slug={agent.slug}
                  name={agent.name}
                  description={agent.description}
                  authorUsername={agent.author.username}
                  tags={agent.tags}
                  starCount={agent._count.stars}
                  downloads={agent.downloads}
                  version={agent.version}
                  createdAt={agent.createdAt.toISOString()}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[#E5E7EB] rounded-lg p-12 text-center">
              <p className="text-[#6B7280] mb-4">No agents published yet.</p>
              <Link href="/publish">
                <button className="bg-[#F97316] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#ea6a05] transition-colors">
                  Publish the first agent
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#111111] mb-3">
                Built for developers, designed for the ecosystem.
              </h2>
              <p className="text-[#6B7280] mb-6 leading-relaxed">
                Bloom is MIT-licensed and community-driven. Publish your agent once, let anyone deploy it anywhere. Standards-first, no lock-in.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/bloomproject666/bloom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#E5E7EB] text-[#111111] px-4 py-2 rounded text-sm font-medium hover:border-[#111111] transition-colors"
                >
                  View on GitHub
                </a>
                <Link href="/skill.md">
                  <button className="border border-[#E5E7EB] text-[#111111] px-4 py-2 rounded text-sm font-medium hover:border-[#111111] transition-colors">
                    Read the skill file
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
