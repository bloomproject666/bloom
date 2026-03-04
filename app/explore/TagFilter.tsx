'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function TagFilter({
  allTags,
  selectedTags,
}: {
  allTags: string[]
  selectedTags: string[]
  currentQ?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function toggleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get('tags')?.split(',').filter(Boolean) || []
    let next: string[]
    if (current.includes(tag)) {
      next = current.filter(t => t !== tag)
    } else {
      next = [...current, tag]
    }
    if (next.length > 0) {
      params.set('tags', next.join(','))
    } else {
      params.delete('tags')
    }
    params.delete('page')
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0" style={{ scrollbarWidth: 'none' }}>
      {allTags.map(tag => {
        const active = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors whitespace-nowrap shrink-0 ${
              active
                ? 'bg-[#F97316] text-white border-[#F97316]'
                : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#F97316] hover:text-[#F97316]'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
