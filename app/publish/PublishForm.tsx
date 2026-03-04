'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/slugify'

const DEFAULT_SCHEMA = `{
  "name": "",
  "version": "0.1.0",
  "description": "",
  "inputs": {
    "type": "object",
    "properties": {}
  },
  "outputs": {
    "type": "object",
    "properties": {}
  },
  "capabilities": [],
  "runtime": "node"
}`

const DEFAULT_README = `## Overview

Describe what your agent does.

## Usage

\`\`\`json
{
  "input": "example"
}
\`\`\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | string | yes | Description here |

## Output

Describe the output format.

## License

MIT
`

export default function PublishForm({ username }: { username: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    readme: DEFAULT_README,
    schema: DEFAULT_SCHEMA,
    tags: '',
    version: '0.1.0',
  })

  const [slug, setSlug] = useState('')

  useEffect(() => {
    setSlug(slugify(form.name))
  }, [form.name])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters'
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters'
    }
    if (!form.readme.trim() || form.readme.trim().length < 20) {
      errs.readme = 'README must be at least 20 characters'
    }
    try {
      JSON.parse(form.schema)
    } catch {
      errs.schema = 'Invalid JSON — check your schema syntax'
    }
    const semver = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/
    if (!semver.test(form.version.trim())) {
      errs.version = 'Version must be valid semver (e.g. 1.0.0)'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          readme: form.readme,
          schema: form.schema,
          tags: form.tags,
          version: form.version.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ submit: data.error || 'Something went wrong' })
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/agent/${data.slug}`)
      }, 1000)
    } catch {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="border border-[#E5E7EB] rounded-lg p-8 text-center">
        <p className="text-lg font-semibold text-[#111111] mb-1">Agent published.</p>
        <p className="text-[#6B7280] text-sm">Redirecting to your agent page...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Name <span className="text-[#F97316]">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="email-dispatcher"
          className="w-full border border-[#E5E7EB] rounded px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
        />
        {slug && !errors.name && (
          <p className="mt-1 text-xs text-[#6B7280]">
            Slug: <span className="font-mono">{username}/{slug}</span>
          </p>
        )}
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Short description <span className="text-[#F97316]">*</span>
        </label>
        <input
          type="text"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Sends structured emails via SMTP on agent request"
          className="w-full border border-[#E5E7EB] rounded px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
          maxLength={280}
        />
        <p className="mt-1 text-xs text-[#9CA3AF]">{form.description.length}/280</p>
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      {/* Version + Tags row */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Version <span className="text-[#F97316]">*</span>
          </label>
          <input
            type="text"
            value={form.version}
            onChange={e => set('version', e.target.value)}
            placeholder="0.1.0"
            className="w-full border border-[#E5E7EB] rounded px-4 py-2.5 text-sm text-[#111111] font-mono placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
          />
          {errors.version && <p className="mt-1 text-xs text-red-500">{errors.version}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={e => set('tags', e.target.value)}
            placeholder="email, automation, smtp"
            className="w-full border border-[#E5E7EB] rounded px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
          />
          <p className="mt-1 text-xs text-[#9CA3AF]">Comma-separated</p>
        </div>
      </div>

      {/* README */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-[#111111]">
            README <span className="text-[#F97316]">*</span>
          </label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs text-[#F97316] hover:underline"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div className="border border-[#E5E7EB] rounded p-4 min-h-[200px] prose text-sm">
            <p className="text-[#6B7280] text-xs mb-2 font-mono uppercase tracking-wide">Preview</p>
            <div dangerouslySetInnerHTML={{ __html: form.readme.replace(/\n/g, '<br>') }} />
          </div>
        ) : (
          <textarea
            value={form.readme}
            onChange={e => set('readme', e.target.value)}
            rows={14}
            className="w-full border border-[#E5E7EB] rounded px-4 py-3 text-sm text-[#111111] font-mono placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors resize-y"
          />
        )}
        {errors.readme && <p className="mt-1 text-xs text-red-500">{errors.readme}</p>}
      </div>

      {/* JSON Schema */}
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Agent JSON Schema <span className="text-[#F97316]">*</span>
        </label>
        <textarea
          value={form.schema}
          onChange={e => set('schema', e.target.value)}
          rows={12}
          className="w-full border border-[#E5E7EB] rounded px-4 py-3 text-sm text-[#111111] font-mono placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors resize-y"
        />
        {errors.schema && <p className="mt-1 text-xs text-red-500">{errors.schema}</p>}
      </div>

      {/* Submit error */}
      {errors.submit && (
        <div className="border border-red-200 bg-red-50 rounded px-4 py-3 text-sm text-red-600">
          {errors.submit}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F97316] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#ea6a05] transition-colors disabled:opacity-60"
        >
          {loading ? 'Publishing...' : 'Publish agent'}
        </button>
        <p className="text-xs text-[#9CA3AF]">
          By publishing, you agree this agent is MIT-licensed.
        </p>
      </div>
    </form>
  )
}
