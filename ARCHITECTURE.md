# ARCHITECTURE — AI Pet

## Stack

- Next.js 16 (App Router), TypeScript, React 19
- Tailwind CSS 4
- PostgreSQL + Prisma ORM
- Server-side sessions (signed HTTP-only cookie referencing a `Session` DB row)
- bcryptjs for password hashing
- `@anthropic-ai/sdk` for pet chat (Claude Haiku), with a zero-cost canned
  fallback when no API key is configured
- Vitest for tests

No external payment provider is wired up yet — `crystals` are tracked on
`User` but nothing currently sells them for real money.

## Layering

```
app/
  page.tsx                 Landing (logged out) or the whole pet app (logged in)
  login/ register/         Auth pages
  api/
    auth/                  register/login/logout/me
    pet/                   GET/POST pet, chat (GET history + POST message), action (feed/play/train/battle reward)
lib/
  auth/                    Session/password/validation helpers (server-only)
  db/                      Prisma client singleton
  subscription/            Premium/SubscriptionService abstraction (reused as-is)
  pet/                     PET DOMAIN LOGIC — framework-agnostic
    types.ts               Personality/stats/world types
    personality.ts         Trait vector, drift, keyword-based message classifier
    stats.ts               Feed/play/train effects, passive time decay, neglect check
    evolution.ts           Stage-by-age-and-trust rules, personality-branch naming
    battle.ts              Turn resolution + personality-weighted move suggestion
    chatLimit.ts           Daily free-message quota (ChatCounter table)
    view.ts                Builds the client-facing PetView (applies decay, computes stage)
  ai/
    petChat.ts             Builds the system prompt from personality/mood/history, calls Claude
components/
  auth/                    AuthForm (login/register)
  ui/                      Button, Panel, Modal (generic, kept from before)
  pet/
    PetRig.tsx             Layered SVG/CSS creature — idle/happy/sad/hungry/sleepy/battle moods
    PetApp.tsx              Top-level client orchestrator: onboarding vs. main screen
    Onboarding.tsx          World select -> name -> egg -> first message (seeds personality)
    ChatPanel.tsx           Message history + input, calls /api/pet/chat
    BattleModal.tsx         Turn-based mini-game against a scaled monster
    StatBar.tsx             Reusable stat bar
prisma/
  schema.prisma             User/Session/SubscriptionEvent (kept) + Pet/ChatMessage/ChatCounter (new)
```

## Key design decisions

- **No cron jobs for decay.** Hunger/energy/trust erosion since the last
  visit is computed lazily in `lib/pet/view.ts` whenever the pet is fetched,
  then persisted back — same pattern the previous project used for its
  world clock.
- **Personality drift is a local heuristic, not another AI call.**
  `classifyMessage` is a small keyword classifier so every chat message can
  nudge the trait vector without doubling the API cost per message.
- **"Ask pet to decide" in battle is also local**, weighted by the current
  personality vector — battles stay free even for heavy players; only the
  chat feature spends real tokens.
- **Chat has a daily quota** (`lib/pet/chatLimit.ts`) enforced server-side
  via a `ChatCounter` row, separate from premium status, so API spend stays
  bounded regardless of client behavior.
