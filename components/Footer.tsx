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
          <a
            href="https://x.com/usebloom_org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors flex items-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </a>
          <Link href="/skill.md" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
            skill.md
          </Link>
          <Link href="/explore" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
            Explore
          </Link>
        </div>
      </div>
    </footer>
  )
}
