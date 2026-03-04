'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/logo.jpg"
            alt="Bloom logo"
            className="w-7 h-7 rounded-sm"
          />
          <span className="text-xl font-bold tracking-tight text-[#111111] group-hover:text-[#F97316] transition-colors">
            Bloom
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link href="/explore" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
            Explore
          </Link>
          <Link href="/skill.md" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
            Docs
          </Link>
          <a
            href="https://github.com/bloomproject666/bloom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors"
          >
            GitHub
          </a>

          {session ? (
            <div className="flex items-center gap-3 relative">
              <Link href="/publish">
                <button className="text-sm bg-[#F97316] text-white px-3 py-1.5 rounded hover:bg-[#ea6a05] transition-colors font-medium">
                  Publish
                </button>
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111111] transition-colors"
              >
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.username || session.user.name || ''}
                    className="w-7 h-7 rounded-full border border-[#E5E7EB]"
                  />
                )}
                <span className="hidden sm:block">{session.user.username || session.user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 bg-white border border-[#E5E7EB] rounded-lg shadow-sm py-1 min-w-[160px]" style={{zIndex: 100}}>
                  <Link
                    href={`/u/${session.user.username}`}
                    className="block px-4 py-2 text-sm text-[#111111] hover:bg-[#F5F5F5] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-[#6B7280] hover:bg-[#F5F5F5] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn('github')}
              className="text-sm border border-[#F97316] text-[#F97316] px-3 py-1.5 rounded hover:bg-[#FFF7ED] transition-colors font-medium"
            >
              Sign in with GitHub
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
