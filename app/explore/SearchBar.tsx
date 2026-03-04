'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue || '')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('q', value.trim())
    } else {
      params.delete('q')
    }
    params.delete('page')
    startTransition(() => {
      router.push(`/explore?${params.toString()}`)
    })
  }

  function handleClear() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Search agents by name, description, or tag..."
          className="w-full border border-[#E5E7EB] rounded px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-[#F97316] text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-[#ea6a05] transition-colors disabled:opacity-60"
      >
        Search
      </button>
    </form>
  )
}
