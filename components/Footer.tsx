import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-sm text-[#6B7280]">
          &copy; {new Date().getFullYear()} Bloom. Open source under MIT.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/bloomproject666/bloom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors"
          >
            GitHub
          </a>
          <Link href="/skill.md" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
            skill.md
          </Link>
          <Link href="/explore" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
            Explore agents
          </Link>
        </div>
      </div>
    </footer>
  )
}
