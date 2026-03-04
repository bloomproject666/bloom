import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_USERS = [
  {
    githubId: '1001',
    username: 'mxstbr',
    name: 'Max Stoiber',
    avatar: 'https://avatars.githubusercontent.com/u/7525670?v=4',
  },
  {
    githubId: '1002',
    username: 'rauchg',
    name: 'Guillermo Rauch',
    avatar: 'https://avatars.githubusercontent.com/u/13041?v=4',
  },
  {
    githubId: '1003',
    username: 'sindresorhus',
    name: 'Sindre Sorhus',
    avatar: 'https://avatars.githubusercontent.com/u/170270?v=4',
  },
]

const SEED_AGENTS = [
  {
    slug: 'email-dispatcher',
    name: 'email-dispatcher',
    description: 'Sends structured emails via SMTP on agent request. Supports HTML and plain text, attachments, CC/BCC, and delivery receipts.',
    version: '1.2.0',
    tags: ['email', 'smtp', 'notifications', 'automation'],
    readme: `## Overview

\`email-dispatcher\` is a composable agent for sending emails programmatically. It accepts structured input, validates the payload, and dispatches via configurable SMTP.

## Usage

\`\`\`json
{
  "to": "user@example.com",
  "subject": "Hello from Bloom",
  "body": "Your workflow completed successfully.",
  "format": "html"
}
\`\`\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| to | string | yes | Recipient email address |
| subject | string | yes | Email subject line |
| body | string | yes | Email body content |
| format | string | no | "html" or "text" (default: "text") |
| cc | string[] | no | CC recipients |
| attachments | object[] | no | File attachments |

## Configuration

Set \`SMTP_HOST\`, \`SMTP_PORT\`, \`SMTP_USER\`, and \`SMTP_PASS\` in your environment.

## License

MIT`,
    schema: {
      name: 'email-dispatcher',
      version: '1.2.0',
      description: 'Sends structured emails via SMTP',
      inputs: {
        type: 'object',
        required: ['to', 'subject', 'body'],
        properties: {
          to: { type: 'string', format: 'email' },
          subject: { type: 'string' },
          body: { type: 'string' },
          format: { type: 'string', enum: ['html', 'text'], default: 'text' },
          cc: { type: 'array', items: { type: 'string', format: 'email' } },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          messageId: { type: 'string' },
          accepted: { type: 'array', items: { type: 'string' } },
          rejected: { type: 'array', items: { type: 'string' } },
        },
      },
      capabilities: ['email', 'smtp', 'notifications'],
      runtime: 'node',
    },
  },
  {
    slug: 'web-scraper',
    name: 'web-scraper',
    description: 'Extracts structured data from any URL. Returns clean HTML, text, links, and metadata. Supports JavaScript-rendered pages via headless browser.',
    version: '2.0.1',
    tags: ['web', 'scraping', 'data', 'automation'],
    readme: `## Overview

\`web-scraper\` fetches and parses web pages, returning structured data you can use downstream in your agent pipeline.

## Usage

\`\`\`json
{
  "url": "https://example.com/products",
  "selector": ".product-card",
  "extract": ["title", "price", "href"],
  "javascript": true
}
\`\`\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | yes | URL to scrape |
| selector | string | no | CSS selector to target elements |
| extract | string[] | no | Fields to extract from matched elements |
| javascript | boolean | no | Enable headless browser for JS pages |
| timeout | number | no | Timeout in ms (default: 10000) |

## Output

Returns an array of matched elements with extracted fields, plus page metadata (title, description, canonical URL).

## License

MIT`,
    schema: {
      name: 'web-scraper',
      version: '2.0.1',
      description: 'Extracts structured data from a given URL',
      inputs: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string', format: 'uri' },
          selector: { type: 'string' },
          extract: { type: 'array', items: { type: 'string' } },
          javascript: { type: 'boolean', default: false },
          timeout: { type: 'number', default: 10000 },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          elements: { type: 'array' },
          metadata: { type: 'object' },
          rawHtml: { type: 'string' },
          plainText: { type: 'string' },
        },
      },
      capabilities: ['scraping', 'web', 'extraction'],
      runtime: 'node',
    },
  },
  {
    slug: 'pdf-summarizer',
    name: 'pdf-summarizer',
    description: 'Returns a structured summary, key points, and extracted entities from any PDF document. Handles multi-page documents up to 200 pages.',
    version: '0.9.0',
    tags: ['pdf', 'nlp', 'data', 'automation'],
    readme: `## Overview

Pass any PDF URL or base64-encoded document to \`pdf-summarizer\` and receive a concise summary, bullet-point key findings, and extracted named entities.

## Usage

\`\`\`json
{
  "url": "https://arxiv.org/pdf/2303.08774.pdf",
  "maxLength": 500,
  "extractEntities": true
}
\`\`\`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | yes* | Public URL to the PDF |
| base64 | string | yes* | Base64-encoded PDF (alternative to url) |
| maxLength | number | no | Max summary word count (default: 300) |
| extractEntities | boolean | no | Extract names, orgs, dates (default: false) |
| language | string | no | Target language for output (default: "en") |

*One of \`url\` or \`base64\` is required.

## License

MIT`,
    schema: {
      name: 'pdf-summarizer',
      version: '0.9.0',
      description: 'Summarizes PDF documents',
      inputs: {
        type: 'object',
        properties: {
          url: { type: 'string', format: 'uri' },
          base64: { type: 'string' },
          maxLength: { type: 'number', default: 300 },
          extractEntities: { type: 'boolean', default: false },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          keyPoints: { type: 'array', items: { type: 'string' } },
          entities: { type: 'object' },
          pageCount: { type: 'number' },
          wordCount: { type: 'number' },
        },
      },
      capabilities: ['pdf', 'summarization', 'nlp'],
      runtime: 'python',
    },
  },
  {
    slug: 'slack-notifier',
    name: 'slack-notifier',
    description: 'Posts messages to any Slack channel or DM. Supports rich Block Kit formatting, file uploads, and threaded replies.',
    version: '1.0.3',
    tags: ['slack', 'notifications', 'api', 'automation'],
    readme: `## Overview

\`slack-notifier\` wraps the Slack Web API for clean, composable message delivery. Supports all Slack Block Kit elements.

## Usage

\`\`\`json
{
  "channel": "#deployments",
  "text": "Deploy successful: v1.4.2 is live.",
  "blocks": [
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*Deploy successful* :rocket:" }
    }
  ]
}
\`\`\`

## Configuration

Set \`SLACK_BOT_TOKEN\` with a bot token that has \`chat:write\` and \`files:write\` scopes.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| channel | string | yes | Channel ID or name (e.g. "#general") |
| text | string | yes | Fallback plain text content |
| blocks | array | no | Slack Block Kit blocks |
| thread_ts | string | no | Thread timestamp for replies |
| files | array | no | Files to attach |

## License

MIT`,
    schema: {
      name: 'slack-notifier',
      version: '1.0.3',
      description: 'Posts messages to Slack channels',
      inputs: {
        type: 'object',
        required: ['channel', 'text'],
        properties: {
          channel: { type: 'string' },
          text: { type: 'string' },
          blocks: { type: 'array' },
          thread_ts: { type: 'string' },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          ts: { type: 'string' },
          channel: { type: 'string' },
          message: { type: 'object' },
        },
      },
      capabilities: ['slack', 'messaging', 'notifications'],
      runtime: 'node',
    },
  },
  {
    slug: 'code-reviewer',
    name: 'code-reviewer',
    description: 'Reviews a code snippet and returns structured feedback: issues, suggestions, severity ratings, and a corrected version.',
    version: '0.4.0',
    tags: ['code', 'nlp', 'api', 'automation'],
    readme: `## Overview

\`code-reviewer\` runs automated code review, returning structured feedback categorized by type (bug, style, performance, security) and severity.

## Usage

\`\`\`json
{
  "code": "function add(a, b) { return a + b }",
  "language": "javascript",
  "checks": ["bugs", "style", "security"]
}
\`\`\`

## Output

Returns an array of \`Issue\` objects:

\`\`\`json
{
  "issues": [
    {
      "line": 1,
      "type": "style",
      "severity": "low",
      "message": "Missing semicolon",
      "suggestion": "function add(a, b) { return a + b; }"
    }
  ],
  "score": 87,
  "corrected": "function add(a, b) { return a + b; }"
}
\`\`\`

## License

MIT`,
    schema: {
      name: 'code-reviewer',
      version: '0.4.0',
      description: 'Reviews code and returns structured feedback',
      inputs: {
        type: 'object',
        required: ['code'],
        properties: {
          code: { type: 'string' },
          language: { type: 'string' },
          checks: {
            type: 'array',
            items: { type: 'string', enum: ['bugs', 'style', 'performance', 'security'] },
          },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          issues: { type: 'array' },
          score: { type: 'number', minimum: 0, maximum: 100 },
          corrected: { type: 'string' },
        },
      },
      capabilities: ['code-review', 'static-analysis', 'nlp'],
      runtime: 'python',
    },
  },
  {
    slug: 'data-validator',
    name: 'data-validator',
    description: 'Validates any JSON payload against a provided JSON Schema. Returns detailed validation errors with paths and suggestions for correction.',
    version: '1.1.0',
    tags: ['data', 'validation', 'api', 'automation'],
    readme: `## Overview

\`data-validator\` uses JSON Schema Draft-07 to validate payloads. Returns structured errors with field paths, constraint names, and human-readable messages.

## Usage

\`\`\`json
{
  "schema": {
    "type": "object",
    "required": ["name", "age"],
    "properties": {
      "name": { "type": "string" },
      "age": { "type": "number", "minimum": 0 }
    }
  },
  "data": { "name": "Alice", "age": -1 }
}
\`\`\`

## Output

\`\`\`json
{
  "valid": false,
  "errors": [
    {
      "path": "/age",
      "constraint": "minimum",
      "message": "must be >= 0",
      "value": -1
    }
  ]
}
\`\`\`

## License

MIT`,
    schema: {
      name: 'data-validator',
      version: '1.1.0',
      description: 'Validates JSON payloads against a JSON Schema',
      inputs: {
        type: 'object',
        required: ['schema', 'data'],
        properties: {
          schema: { type: 'object' },
          data: {},
          strict: { type: 'boolean', default: false },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          valid: { type: 'boolean' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                constraint: { type: 'string' },
                message: { type: 'string' },
                value: {},
              },
            },
          },
        },
      },
      capabilities: ['validation', 'json-schema', 'data'],
      runtime: 'node',
    },
  },
  {
    slug: 'calendar-scheduler',
    name: 'calendar-scheduler',
    description: 'Creates, updates, and queries calendar events via Google Calendar API or CalDAV. Handles timezone conversion automatically.',
    version: '0.6.2',
    tags: ['calendar', 'api', 'automation', 'notifications'],
    readme: `## Overview

\`calendar-scheduler\` provides a unified interface for calendar operations. Supports Google Calendar, Outlook (via CalDAV), and Apple Calendar.

## Usage

\`\`\`json
{
  "action": "create",
  "calendar": "primary",
  "event": {
    "title": "Team standup",
    "start": "2025-02-01T09:00:00",
    "end": "2025-02-01T09:30:00",
    "timezone": "America/New_York",
    "attendees": ["alice@example.com", "bob@example.com"],
    "recurrence": "RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR"
  }
}
\`\`\`

## Configuration

Set \`GOOGLE_CALENDAR_CREDENTIALS\` (JSON) or \`CALDAV_URL\` + \`CALDAV_USERNAME\` + \`CALDAV_PASSWORD\`.

## License

MIT`,
    schema: {
      name: 'calendar-scheduler',
      version: '0.6.2',
      description: 'Creates calendar events via API',
      inputs: {
        type: 'object',
        required: ['action'],
        properties: {
          action: { type: 'string', enum: ['create', 'update', 'delete', 'query'] },
          calendar: { type: 'string', default: 'primary' },
          event: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              start: { type: 'string', format: 'date-time' },
              end: { type: 'string', format: 'date-time' },
              timezone: { type: 'string' },
              attendees: { type: 'array', items: { type: 'string' } },
              recurrence: { type: 'string' },
            },
          },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          eventId: { type: 'string' },
          htmlLink: { type: 'string' },
          status: { type: 'string' },
        },
      },
      capabilities: ['calendar', 'scheduling', 'api'],
      runtime: 'node',
    },
  },
  {
    slug: 'image-classifier',
    name: 'image-classifier',
    description: 'Returns labels, confidence scores, and detected objects for any image URL or base64 input. Supports custom model fine-tuning.',
    version: '0.3.1',
    tags: ['image', 'nlp', 'api', 'data'],
    readme: `## Overview

\`image-classifier\` runs multi-label image classification, returning confidence scores for detected labels and bounding boxes for object detection.

## Usage

\`\`\`json
{
  "url": "https://example.com/photo.jpg",
  "topK": 5,
  "model": "general-v2",
  "detect": ["objects", "faces", "text"]
}
\`\`\`

## Output

\`\`\`json
{
  "labels": [
    { "name": "outdoor", "confidence": 0.97 },
    { "name": "mountain", "confidence": 0.94 },
    { "name": "snow", "confidence": 0.88 }
  ],
  "objects": [
    { "name": "person", "confidence": 0.91, "box": [120, 45, 210, 380] }
  ],
  "text": []
}
\`\`\`

## Models

- \`general-v2\` — 10,000+ label taxonomy
- \`nsfw\` — Content moderation
- \`faces\` — Face detection and attributes
- Custom fine-tuned models via model ID

## License

MIT`,
    schema: {
      name: 'image-classifier',
      version: '0.3.1',
      description: 'Returns labels and confidence scores for an image',
      inputs: {
        type: 'object',
        properties: {
          url: { type: 'string', format: 'uri' },
          base64: { type: 'string' },
          topK: { type: 'number', default: 5 },
          model: { type: 'string', default: 'general-v2' },
          detect: {
            type: 'array',
            items: { type: 'string', enum: ['objects', 'faces', 'text', 'labels'] },
          },
        },
      },
      outputs: {
        type: 'object',
        properties: {
          labels: { type: 'array' },
          objects: { type: 'array' },
          text: { type: 'array' },
          faces: { type: 'array' },
        },
      },
      capabilities: ['image-classification', 'object-detection', 'vision'],
      runtime: 'python',
    },
  },
]

async function main() {
  console.log('Seeding database...')

  // Create users
  const users = []
  for (const u of SEED_USERS) {
    const user = await prisma.user.upsert({
      where: { githubId: u.githubId },
      update: {},
      create: u,
    })
    users.push(user)
    console.log(`Created user: @${user.username}`)
  }

  // Create agents distributed across users
  for (let i = 0; i < SEED_AGENTS.length; i++) {
    const agentData = SEED_AGENTS[i]
    const author = users[i % users.length]

    const agent = await prisma.agent.upsert({
      where: { slug: agentData.slug },
      update: {},
      create: {
        ...agentData,
        downloads: Math.floor(Math.random() * 5000) + 100,
        authorId: author.id,
      },
    })
    console.log(`Created agent: ${agent.name} by @${author.username}`)

    // Add some stars
    const starCount = Math.floor(Math.random() * 40) + 5
    for (let j = 0; j < Math.min(starCount, users.length); j++) {
      const starUser = users[(i + j) % users.length]
      if (starUser.id !== author.id) {
        await prisma.star.upsert({
          where: {
            userId_agentId: { userId: starUser.id, agentId: agent.id },
          },
          update: {},
          create: { userId: starUser.id, agentId: agent.id },
        })
      }
    }
  }

  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
