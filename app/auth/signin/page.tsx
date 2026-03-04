'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#111111] hover:text-[#F97316] transition-colors">
            Bloom
          </Link>
          <p className="text-[#6B7280] mt-2 text-sm">Sign in to publish and star agents.</p>
        </div>

        <div className="border border-[#E5E7EB] rounded-lg p-6">
          <button
            onClick={() => signIn('github', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-[#111111] text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-[#222] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          By signing in, you agree to the{' '}
          <Link href="/skill.md" className="text-[#F97316] hover:underline">
            terms of use
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}
