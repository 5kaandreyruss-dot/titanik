# Deployment (free tier)

Two free services are enough to run the site live: **Vercel** (hosting) and
**Neon** (serverless Postgres) — the same ones already connected from before,
nothing to redo there. The only new thing this product needs is an
**Anthropic API key** so the pet can actually talk.

## 1. Push the code to GitHub

Already done if you're reading this from the repo — the app is ready to
deploy as-is (`npm run build` runs `prisma migrate deploy` automatically
before `next build`, so the production database schema is updated on every
deploy — this deploy will drop the old game's tables and create the new
Pet/ChatMessage ones).

## 2. Environment variables

In the Vercel project's **Settings → Environment Variables**, you should
already have:

- `DATABASE_URL` — the Neon connection string (already set from before).

Add one new variable:

- `ANTHROPIC_API_KEY` — get one at [console.anthropic.com](https://console.anthropic.com):
  create an account, add a small prepaid balance (a few dollars is enough to
  start — pet chat uses the cheap Haiku model), then create an API key under
  **API Keys** and paste it in here.

Without `ANTHROPIC_API_KEY` set, the app still runs and the pet still
"talks" — just with a small set of canned fallback replies instead of a real
AI conversation.

## 3. Redeploy

Since the repo is already connected, pushing to the connected branch (or
just re-running the last deploy after adding the env var) triggers a new
build automatically. You'll get the same live URL as before.

## Notes on the free tier

- Neon's free tier suspends the database after a period of inactivity and
  wakes it on the next request (a short cold-start delay) — fine for a demo
  or low-traffic app.
- Vercel's Hobby (free) plan is sufficient for this app's traffic.
- The Anthropic API is pay-per-use, not free — but pet chat uses the cheap
  Haiku model and the app enforces a daily per-user message quota
  server-side, so cost stays bounded and predictable even with real users.
