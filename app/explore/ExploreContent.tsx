import { prisma } from '@/lib/prisma'
import AgentCard from '@/components/AgentCard'
import SearchBar from './SearchBar'
import TagFilter from './TagFilter'
import Pagination from './Pagination'

const PAGE_SIZE = 12

const ALL_TAGS = [
  'email', 'web', 'pdf', 'slack', 'code', 'data', 'calendar', 'image',
  'automation', 'api', 'nlp', 'search', 'scraping', 'notifications', 'validation'
]

async function getAgents(q?: string, tags?: string, page = 1) {
  const offset = (page - 1) * PAGE_SIZE
  const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

  const where: {
    tags?: { hasSome: string[] }
    OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
  } = {}
  if (tagList.length > 0) {
    where.tags = { hasSome: tagList }
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [agents, total] = await Promise.all([
    prisma.agent.findMany({
      where,
      include: {
        author: { select: { username: true, name: true, avatar: true } },
        _count: { select: { stars: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: offset,
    }),
    prisma.agent.count({ where }),
  ])

  return { agents, total }
}

export default async function ExploreContent({
  searchParams,
}: {
  searchParams: { q?: string; tags?: string; page?: string }
}) {
  const { q, tags, page: pageStr } = searchParams
  const page = parseInt(pageStr || '1')
  const { agents, total } = await getAgents(q, tags, page)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      {/* Page title */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#111111] mb-1">Explore agents</h1>
        <p className="text-[#6B7280] text-sm">{total} agent{total !== 1 ? 's' : ''} available</p>
      </div>

      {/* Search */}
      <div className="mb-5 sm:mb-6">
        <SearchBar defaultValue={q} />
      </div>

      {/* Tags */}
      <div className="mb-6 sm:mb-8">
        <TagFilter allTags={ALL_TAGS} selectedTags={tags ? tags.split(',') : []} currentQ={q} />
      </div>

      {/* Grid */}
      {agents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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
          <p className="text-[#6B7280]">
            {q || tags ? 'No agents match your search.' : 'No agents published yet.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          q={q}
          tags={tags}
        />
      )}
    </>
  )
}
