'use client'

import { useState } from 'react'

export default function CopyInstallButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = command
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full text-xs border border-[#E5E7EB] rounded px-3 py-1.5 text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316] transition-colors"
    >
      {copied ? 'Copied!' : 'Copy install command'}
    </button>
  )
}
