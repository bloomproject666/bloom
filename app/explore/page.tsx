import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ExploreContent from './ExploreContent'

export const metadata = {
  title: 'Explore agents — Bloom',
  description: 'Discover AI agents published by developers worldwide.',
}

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; tags?: string; page?: string }
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Suspense fallback={<div className="text-[#6B7280] text-sm">Loading agents...</div>}>
            <ExploreContent searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
