# Deployment (free tier)

Two free services are enough to run the game live: **Vercel** (hosting) and
**Neon** (serverless Postgres). Vercel can provision a Neon database for you
directly from its dashboard, so you don't need a separate Neon account.

## 1. Push the code to GitHub

Already done if you're reading this from the repo — the app is ready to deploy
as-is (`npm run build` runs `prisma migrate deploy` automatically before
`next build`, so the production database schema is created/updated on every
deploy).

## 2. Create the database

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (free).
2. In the Vercel dashboard: **Storage** → **Create Database** → choose **Neon**
   (Postgres, free tier) → create it in any region.
3. Keep this tab open; you'll copy a connection string from it in step 4.

(Alternative: create a free database directly at [neon.tech](https://neon.tech)
and skip the Vercel integration — either works, you just need a `postgresql://…`
connection string.)

## 3. Import the project into Vercel

1. **Add New...** → **Project** → select the `titanik` GitHub repository.
2. Framework preset should auto-detect as **Next.js** — leave build settings
   as default (the repo's `package.json` already defines the right build command).

## 4. Set environment variables

In the project's **Settings → Environment Variables**, add:

- `DATABASE_URL` — the connection string from your Neon database (Vercel fills
  this in automatically if you created the DB via its Storage tab in step 2).

That's the only required variable. Click **Deploy**.

## 5. First deploy

Vercel will install dependencies, run `prisma migrate deploy` (creates all
tables), then build and deploy the app. You'll get a live URL like
`https://titanik-yourname.vercel.app`.

## 6. Seed initial data (achievements catalog + admin account)

Run this once, from your local machine, pointed at the production database:

```bash
DATABASE_URL="<paste the same production connection string>" npm run db:seed
```

This creates the achievement catalog rows and an admin account (nickname
`admin`, password `changeme123` unless you override `SEED_ADMIN_NICKNAME` /
`SEED_ADMIN_PASSWORD` env vars when running the seed). **Log in and change
that password immediately** — or better, set custom `SEED_ADMIN_NICKNAME`
and `SEED_ADMIN_PASSWORD` env vars before running the seed the first time.

## Notes on the free tier

- Neon's free tier suspends the database after a period of inactivity and
  wakes it on the next request (a short cold-start delay) — fine for a demo
  or low-traffic game.
- Vercel's Hobby (free) plan is sufficient for this app's traffic; serverless
  function cold starts add a small delay to the first request after idle.
- Every subsequent `git push` to the connected branch auto-deploys and
  re-runs migrations — no manual redeploy steps needed after the first setup.
