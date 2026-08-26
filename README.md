# AI Pet

A living AI companion you raise from an egg. Its personality forms from how
you actually talk to it, it remembers past conversations, its stats change
with how well you look after it, and it evolves over real days — down one of
several branches depending on the character it develops.

See `ARCHITECTURE.md` for the technical layout.

## Stack

Next.js (App Router) + TypeScript + React + Tailwind CSS + PostgreSQL + Prisma.
Pet chat is powered by the Claude API (`@anthropic-ai/sdk`) — without an
`ANTHROPIC_API_KEY` set, chat falls back to a small set of canned replies so
the rest of the app still works.

## Local development

```bash
cp .env.example .env         # set DATABASE_URL, optionally ANTHROPIC_API_KEY
npm install
npx prisma migrate dev
npm run dev
```

Tests: `npm run test`.

## Deployment

See `DEPLOYMENT.md` for a free-tier deployment guide (Vercel + Neon Postgres),
plus how to add the Anthropic API key so the pet can actually talk.
