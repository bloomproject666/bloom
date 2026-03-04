'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

interface Props {
  slug: string
  initialCount: number
  initialStarred: boolean
  isAuthenticated: boolean
}

export default function StarButton({ slug, initialCount, initialStarred, isAuthenticated }: Props) {
  const [starred, setStarred] = useState(initialStarred)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleStar() {
    if (!isAuthenticated) {
      signIn('github')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/agents/${slug}/star`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setStarred(data.starred)
        setCount(data.count)
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleStar}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded border text-sm font-medium transition-colors disabled:opacity-60 ${
        starred
          ? 'bg-[#FFF7ED] border-[#F97316] text-[#F97316]'
          : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316]'
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={starred ? '#F97316' : 'none'}
        stroke={starred ? '#F97316' : 'currentColor'}
        strokeWidth="2"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
      <span>{starred ? 'Starred' : 'Star'} {count > 0 && `(${count})`}</span>
    </button>
  )
}
