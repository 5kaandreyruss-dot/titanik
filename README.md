# Titanic: The Last Chance

Atmospheric, replayable browser game set aboard RMS Titanic, night of April 14–15, 1912.
Alternate history: explore, talk, investigate, make decisions, suffer consequences — and
maybe discover how to change the ship's fate.

See `ARCHITECTURE.md` (technical design), `GAME_DESIGN.md` (game rules/content design),
`CONTENT_GUIDE.md` (how to add content).

## Stack

Next.js (App Router) + TypeScript + React + Tailwind CSS + PostgreSQL + Prisma.

## Local development

```bash
cp .env.example .env         # set DATABASE_URL
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Tests: `npm run test`. Content validation: `npm run validate:content`.

## Deployment

See `DEPLOYMENT.md` for a free-tier deployment guide (Vercel + Neon Postgres).

## Status

Phase 1-4 in progress: architecture, auth, engine core, vertical slice (one ship section,
4 NPCs, branching dialogue, one major decision, 3 endings). See task list / commits for
current progress. Content set will expand incrementally after the slice is verified
end-to-end (register → play → ending → stats).
