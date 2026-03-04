import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MarkdownContent from './MarkdownContent'
import StarButton from './StarButton'
import CopyInstallButton from './CopyInstallButton'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const agent = await prisma.agent.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  })
  if (!agent) return { title: 'Agent not found — Bloom' }
  return {
    title: `${agent.name} — Bloom`,
    description: agent.description,
  }
}

export default async function AgentPage({ params }: Props) {
  const [agent, session] = await Promise.all([
    prisma.agent.findUnique({
      where: { slug: params.slug },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { stars: true } },
      },
    }),
    getServerSession(authOptions),
  ])

  if (!agent) notFound()

  // Check if current user starred this agent
  let userStarred = false
  if (session?.user?.id) {
    const star = await prisma.star.findUnique({
      where: {
        userId_agentId: { userId: session.user.id, agentId: agent.id },
      },
    })
    userStarred = !!star
  }

  const installCommand = `bloom install ${agent.slug}@${agent.version}`

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_280px] gap-10">

            {/* Left column */}
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
                <Link href="/explore" className="hover:text-[#F97316] transition-colors">Agents</Link>
                <span>/</span>
                <span className="text-[#111111]">{agent.name}</span>
              </div>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-[#111111]">{agent.name}</h1>
                  <span className="text-xs font-mono border border-[#E5E7EB] px-2 py-1 rounded text-[#6B7280] mt-1">
                    v{agent.version}
                  </span>
                </div>
                <p className="text-[#6B7280] mt-2 leading-relaxed">{agent.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {agent.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/explore?tags=${tag}`}
                    className="text-xs px-2.5 py-1 bg-[#FFF7ED] text-[#F97316] rounded border border-[#FED7AA] hover:bg-[#FFEDD5] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              {/* README */}
              <div className="border-t border-[#E5E7EB] pt-8 mb-8">
                <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">README</h2>
                <MarkdownContent content={agent.readme} />
              </div>

              {/* JSON Schema */}
              <div className="border-t border-[#E5E7EB] pt-8">
                <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Agent Schema</h2>
                <pre className="bg-[#111111] text-[#f5f5f5] p-5 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
                  {JSON.stringify(agent.schema, null, 2)}
                </pre>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">

              {/* Install */}
              <div className="border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Install</p>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded px-3 py-2 font-mono text-xs text-[#111111] mb-2 break-all">
                  {installCommand}
                </div>
                <CopyInstallButton command={installCommand} />
              </div>

              {/* Stats */}
              <div className="border border-[#E5E7EB] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Stars</span>
                  <span className="text-sm font-semibold text-[#111111]">{agent._count.stars}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Downloads</span>
                  <span className="text-sm font-semibold text-[#111111]">{agent.downloads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Version</span>
                  <span className="text-xs font-mono text-[#111111]">{agent.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Published</span>
                  <span className="text-sm text-[#111111]">
                    {new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Star button */}
              <StarButton
                slug={agent.slug}
                initialCount={agent._count.stars}
                initialStarred={userStarred}
                isAuthenticated={!!session}
              />

              {/* Author */}
              <div className="border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Author</p>
                <Link href={`/u/${agent.author.username}`} className="flex items-center gap-3 group">
                  {agent.author.avatar ? (
                    <img
                      src={agent.author.avatar}
                      alt={agent.author.username}
                      className="w-9 h-9 rounded-full border border-[#E5E7EB]"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-sm font-semibold text-[#6B7280]">
                      {agent.author.username[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#111111] group-hover:text-[#F97316] transition-colors">
                      {agent.author.name || agent.author.username}
                    </p>
                    <p className="text-xs text-[#6B7280]">@{agent.author.username}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
