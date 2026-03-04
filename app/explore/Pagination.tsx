'use client'

import { useRouter } from 'next/navigation'

export default function Pagination({
  currentPage,
  totalPages,
  q,
  tags,
}: {
  currentPage: number
  totalPages: number
  q?: string
  tags?: string
}) {
  const router = useRouter()

  function goTo(page: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (tags) params.set('tags', tags)
    if (page > 1) params.set('page', page.toString())
    router.push(`/explore?${params.toString()}`)
  }

  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
      pages.push(i)
    }
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {pages.map((p, i) => {
        const prevPage = pages[i - 1]
        return (
          <>
            {prevPage && p - prevPage > 1 && (
              <span key={`ellipsis-${p}`} className="text-[#6B7280] text-sm px-1">...</span>
            )}
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                p === currentPage
                  ? 'bg-[#F97316] text-white border-[#F97316]'
                  : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316]'
              }`}
            >
              {p}
            </button>
          </>
        )
      })}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}
