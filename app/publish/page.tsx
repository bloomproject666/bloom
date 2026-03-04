import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PublishForm from './PublishForm'

export const metadata = {
  title: 'Publish an agent — Bloom',
}

export default async function PublishPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/publish')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#111111] mb-1">Publish an agent</h1>
            <p className="text-[#6B7280] text-sm">
              Make your agent available to developers worldwide.
            </p>
          </div>
          <PublishForm username={session.user.username} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
