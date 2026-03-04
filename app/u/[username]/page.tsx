import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgentCard from '@/components/AgentCard'

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `@${params.username} — Bloom`,
    description: `Agents published by ${params.username} on Bloom.`,
  }
}

export default async function UserProfilePage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      agents: {
        include: {
          _count: { select: { stars: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) notFound()

  // Total stars across all agents
  const totalStars = user.agents.reduce((sum: number, a: typeof user.agents[0]) => sum + a._count.stars, 0)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">

          {/* Profile header */}
          <div className="flex items-start gap-5 mb-10 pb-10 border-b border-[#E5E7EB]">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded-full border border-[#E5E7EB]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-2xl font-bold text-[#6B7280]">
                {user.username[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[#111111]">{user.name || user.username}</h1>
              <p className="text-sm text-[#6B7280] mb-3">@{user.username}</p>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-lg font-bold text-[#111111]">{user.agents.length}</span>
                  <span className="text-sm text-[#6B7280] ml-1.5">agent{user.agents.length !== 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#111111]">{totalStars}</span>
                  <span className="text-sm text-[#6B7280] ml-1.5">star{totalStars !== 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-sm text-[#6B7280]">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Agents */}
          <div>
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-5">
              Published agents
            </h2>

            {user.agents.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.agents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    slug={agent.slug}
                    name={agent.name}
                    description={agent.description}
                    authorUsername={user.username}
                    tags={agent.tags}
                    starCount={agent._count.stars}
                    downloads={agent.downloads}
                    version={agent.version}
                    createdAt={agent.createdAt.toISOString()}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-[#E5E7EB] rounded-lg p-10 text-center">
                <p className="text-[#6B7280] text-sm">No agents published yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
