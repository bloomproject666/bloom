import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Bloom — The open registry for AI agents',
  description: 'Publish, discover, and deploy agents built for the modern AI stack.',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://usebloom.org'),
  openGraph: {
    title: 'Bloom — The open registry for AI agents',
    description: 'Publish, discover, and deploy agents built for the modern AI stack.',
    siteName: 'Bloom',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
