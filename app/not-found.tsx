import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-6xl font-bold text-[#E5E7EB] mb-4">404</p>
          <h1 className="text-xl font-semibold text-[#111111] mb-2">Page not found</h1>
          <p className="text-[#6B7280] text-sm mb-8">
            The page you are looking for does not exist.
          </p>
          <Link href="/">
            <button className="bg-[#F97316] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#ea6a05] transition-colors">
              Back to home
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
