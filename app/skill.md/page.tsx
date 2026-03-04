import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'skill.md — Bloom',
  description: 'Machine-readable skill file for the Bloom AI agent registry.',
}

const SKILL_CONTENT = `# Bloom Skill

**Name:** bloom
**Version:** 0.1.0
**Domain:** usebloom.org

## Description

Bloom is an open registry for AI agents. This skill file describes how AI systems
can interact with the Bloom API to discover, publish, and retrieve agent definitions.

## API Endpoints

### Search agents
\`GET /api/agents?q={query}&tags={tags}&limit={limit}\`

### Get agent by slug
\`GET /api/agents/{slug}\`

### Publish agent (requires auth)
\`POST /api/agents\`
\`Authorization: Bearer {token}\`
\`Body: { name, description, readme, schema, tags, version }\`

### Toggle star on agent (requires auth)
\`POST /api/agents/{slug}/star\`

### Get registry stats
\`GET /api/stats\`

## Agent Schema Standard

Agents published to Bloom follow this JSON schema format:

\`\`\`json
{
  "name": "string",
  "version": "semver string",
  "description": "string",
  "inputs": {
    "type": "object",
    "properties": {}
  },
  "outputs": {
    "type": "object",
    "properties": {}
  },
  "capabilities": ["string"],
  "runtime": "string"
}
\`\`\`

## Search

The registry supports full-text search over agent names, descriptions, and tags.
When \`OPENAI_API_KEY\` is configured, semantic vector search via pgvector is enabled
for nearest-neighbor similarity matching.

## Authentication

Bloom uses GitHub OAuth via NextAuth.js. API routes that require authentication
check for a valid session. Session-based authentication is the primary mechanism
for browser clients. Bearer token support is available for programmatic access.

## Usage

This file is machine-readable and intended for AI agents that need to
interact with the Bloom registry programmatically.

## License

MIT — https://github.com/bloomproject666/bloom/blob/main/LICENSE
`

export default function SkillMdPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* File header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#E5E7EB]">
            <div className="font-mono text-sm text-[#6B7280] bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1.5 rounded">
              skill.md
            </div>
            <p className="text-sm text-[#6B7280]">Machine-readable skill definition for Bloom.</p>
          </div>

          {/* Rendered markdown */}
          <div className="prose">
            {SKILL_CONTENT.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1.5rem 0 0.75rem', color: '#111' }}>{line.slice(2)}</h1>
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} style={{ fontSize: '1.25rem', fontWeight: 600, margin: '1.5rem 0 0.5rem', color: '#111', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>{line.slice(3)}</h2>
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} style={{ fontSize: '1rem', fontWeight: 600, margin: '1rem 0 0.3rem', color: '#111' }}>{line.slice(4)}</h3>
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} style={{ margin: '0.25rem 0', color: '#333' }}><strong>{line.slice(2, -2)}</strong></p>
              }
              if (line.match(/^\*\*[^*]+:\*\*/)) {
                // Parse bold+rest pattern
                return <p key={i} style={{ margin: '0.25rem 0', color: '#333', lineHeight: '1.7' }} dangerouslySetInnerHTML={{
                  __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code style="background:#f5f5f5;padding:0.1em 0.35em;border-radius:3px;font-size:0.875em;font-family:IBM Plex Mono,monospace">$1</code>')
                }} />
              }
              if (line.startsWith('```json')) {
                return null
              }
              if (line.startsWith('```')) {
                return null
              }
              if (line.startsWith('`GET ') || line.startsWith('`POST ') || line.startsWith('`Authorization') || line.startsWith('`Body')) {
                return (
                  <div key={i} style={{ background: '#f5f5f5', padding: '0.4rem 0.75rem', borderRadius: '4px', fontFamily: 'IBM Plex Mono,monospace', fontSize: '0.85rem', color: '#111', margin: '0.25rem 0' }}>
                    {line.slice(1, -1)}
                  </div>
                )
              }
              if (line === '') {
                return <div key={i} style={{ height: '0.5rem' }} />
              }
              if (line.startsWith('  "') || line.startsWith('{') || line.startsWith('}') || line.startsWith('  }') || line.startsWith('  "')) {
                return (
                  <code key={i} style={{ display: 'block', background: '#111', color: '#f5f5f5', padding: '0 1.25rem', fontFamily: 'IBM Plex Mono,monospace', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {line}
                  </code>
                )
              }
              return <p key={i} style={{ margin: '0.4rem 0', color: '#333', lineHeight: '1.7' }} dangerouslySetInnerHTML={{
                __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code style="background:#f5f5f5;padding:0.1em 0.35em;border-radius:3px;font-size:0.875em;font-family:IBM Plex Mono,monospace">$1</code>')
              }} />
            })}
          </div>

          {/* Raw link */}
          <div className="mt-10 pt-6 border-t border-[#E5E7EB]">
            <a
              href="https://github.com/bloomproject666/bloom/blob/main/public/skill.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#F97316] hover:underline"
            >
              View raw on GitHub
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
