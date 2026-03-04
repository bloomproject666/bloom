# Bloom

The open registry for AI agents. Publish, discover, and deploy agents built for the modern AI stack.

**Live:** [https://usebloom.org](https://usebloom.org)

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + pgvector |
| ORM | Prisma |
| Auth | NextAuth.js (GitHub OAuth) |
| Styling | Tailwind CSS |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/bloomproject666/bloom
cd bloom

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

Open [https://usebloom.org](https://usebloom.org) to see the app.

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/bloom
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://usebloom.org
GITHUB_CLIENT_ID=your-github-app-client-id
GITHUB_CLIENT_SECRET=your-github-app-client-secret
OPENAI_API_KEY=optional-for-semantic-search
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/agents | List/search agents |
| GET | /api/agents/:slug | Get agent by slug |
| POST | /api/agents | Publish agent (auth required) |
| POST | /api/agents/:slug/star | Toggle star (auth required) |
| GET | /api/stats | Registry statistics |

## License

MIT
