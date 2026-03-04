import Link from 'next/link'

interface AgentCardProps {
  slug: string
  name: string
  description: string
  authorUsername: string
  tags: string[]
  starCount: number
  downloads?: number
  version: string
  createdAt?: string
}

export default function AgentCard({
  slug,
  name,
  description,
  authorUsername,
  tags,
  starCount,
  version,
}: AgentCardProps) {
  return (
    <Link
      href={`/agent/${slug}`}
      className="block border border-[#E5E7EB] rounded-lg p-5 hover:border-[#F97316] hover:shadow-sm transition-all bg-white group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold text-[#111111] group-hover:text-[#F97316] transition-colors truncate">
            {name}
          </span>
          <span className="text-xs text-[#6B7280] font-mono border border-[#E5E7EB] px-1.5 py-0.5 rounded shrink-0">
            v{version}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#6B7280] shrink-0">
          <StarIcon />
          <span>{starCount}</span>
        </div>
      </div>

      <p className="text-sm text-[#6B7280] line-clamp-2 mb-3 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-[#FFF7ED] text-[#F97316] rounded border border-[#FED7AA]"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-[#6B7280]">+{tags.length - 3}</span>
          )}
        </div>
        <span className="text-xs text-[#6B7280]">{authorUsername}</span>
      </div>
    </Link>
  )
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}
