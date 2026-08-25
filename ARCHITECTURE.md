# ARCHITECTURE — Titanic: The Last Chance

## Stack

- Next.js 15 (App Router), TypeScript, React 19
- Tailwind CSS 4
- PostgreSQL + Prisma ORM
- Server-side sessions (signed HTTP-only cookie referencing a `Session` DB row)
- bcryptjs for password hashing
- Vitest for tests

No external payment/auth providers yet. Everything server-authoritative.

## Layering

```
app/                      Next.js routes (UI + API route handlers)
  (site)/                 Public/menu pages (login, register, menu, profile...)
  api/                    Route handlers — thin controllers only
lib/
  auth/                   Session/password/auth helpers (server-only)
  db/                     Prisma client singleton
  engine/                 GAME ENGINE — all gameplay logic, framework-agnostic
    state.ts              WorldState shape + reducers
    time.ts               Clock advancement
    skillCheck.ts         Stat-based resolution
    movement.ts           Location transitions
    dialogue.ts           Dialogue graph walker
    events.ts             Condition -> action -> consequence engine
    inventory.ts          Item ops
    relationships.ts      NPC relationship ops
    endings.ts            Ending resolution
    run.ts                Orchestrates a turn: applies an Action to a GameRunState
  content/                Static game content (data, NOT React) — see CONTENT_GUIDE.md
    npcs/ locations/ items/ dialogues/ events/ endings/ achievements/
    index.ts              Aggregates + validates content into a ContentRegistry
  subscription/           Premium/SubscriptionService abstraction
  runLimit/               Free-run daily-limit service (server-enforced)
components/               React UI components (presentation only, no game rules)
prisma/
  schema.prisma
  seed.ts                 Seeds ItemDefinition/NPC/Location/Achievement content mirrors (optional cache) + admin/demo user
tests/                    Vitest unit/integration tests
```

**Rule:** `lib/engine/**` never imports React/Next. `app/**` and `components/**` never
implement gameplay rules — they call the engine. `lib/content/**` is pure data + light
validation, imported by the engine.

## Game Engine Design

The engine is a pure(-ish) state-transition system:

```
applyAction(content: ContentRegistry, state: GameRunState, action: PlayerAction, rng: SeededRNG)
  -> { state: GameRunState, effects: EngineEffect[] }
```

- `GameRunState` is the single source of truth (see GAME_DESIGN.md "World State").
  It is serialized to `GameRun.stateJson` (Postgres `Json`) after every action.
- `PlayerAction` is one discrete player intent: `MOVE`, `TALK_START`, `DIALOGUE_CHOOSE`,
  `INSPECT`, `TAKE_ITEM`, `USE_ITEM`, `GIVE_ITEM`, `WAIT`, `WAKE_EVENT_CHECK`.
- Every action:
  1. validates preconditions against current state (server-side, never trusts client stat/time claims — client only sends the action + choice id);
  2. resolves any skill check via `skillCheck.ts` using `SeededRNG` derived from `GameRun.seed` + a monotonic action counter (reproducible, not client-suppliable);
  3. advances `GameRunState.time` per the action's time cost;
  4. runs the **event engine** (`events.ts`) which scans all `EventDefinition`s whose trigger conditions are newly satisfied and applies their consequences (state patches);
  5. checks ending conditions (`endings.ts`) — if any `EndingDefinition` matches and is highest-priority, the run is finalized;
  6. returns the new state + a list of human-readable `effects` for the UI to render (toast log), and persists.
- `SeededRNG`: xorshift32 seeded from `GameRun.seed` (stored at run creation, itself derived from crypto-random). Every random draw is logged as `(counter, purpose)` so it's reproducible for debugging/analytics.

### Why server-authoritative

All mutations happen in API route handlers under `app/api/game/**`, which load the
`GameRun` row (owned by the session user), run `applyAction`, persist the resulting
`stateJson`, and return only the *new state + effects* to the client. The client never
sends stat values, dice results, or timestamps that matter — only the action + choice id.

## Database

See `prisma/schema.prisma` for the authoritative schema. Summary of entities:

- **Identity/session**: `User`, `Session`
- **Subscription**: fields on `User` (`isPremium`, `premiumUntil`) + `SubscriptionEvent` log
- **Run tracking**: `GameRun` (one row per playthrough, holds `stateJson` snapshot + seed + status), `RunCounter` (per-user per-day counter for free-run limit, server-side)
- **Content mirrors** (optional, mostly content lives in code under `lib/content`, DB stores only *player-specific* progress):
  - `PlayerAchievement` (unlock records), `Achievement` (catalog, seeded)
  - `Discovery` (knowledge archive entries unlocked per-run/per-user)
  - `LeaderboardEntry` (materialized per finished run, for fast queries)
- **Content catalog tables** used mainly for admin visibility + potential future data-driven authoring: `NpcDefinition`, `LocationDefinition`, `ItemDefinitionRow`, `EndingDefinitionRow`, `EventDefinitionRow` — thin, mostly `id/version` synced from `lib/content` at boot via seed; gameplay reads content from the in-memory registry, not these tables, to avoid a DB round trip per skill check. These tables exist for admin/reporting only.

Rationale for "content in code, not DB": requirement #39 demands adding an NPC must not
require rewriting the engine — but it's fine (and much faster/simpler) for content to be
TS/JSON modules loaded at server boot into an in-memory `ContentRegistry`, validated with
zod. The DB stores **player progress against that content** (by stable string IDs), not
the content itself. This avoids a content-authoring admin UI in the vertical slice while
still cleanly separating content from engine.

## Auth & Sessions

- Registration: nickname (unique, 3-20 chars) + password (bcrypt, cost 12).
- Session: random 32-byte token, stored hashed in `Session` table with `expiresAt`;
  cookie holds the raw token (HTTP-only, `SameSite=Lax`, `Secure` in prod).
- `lib/auth/session.ts`: `getSession()`, `requireUser()`, `createSession()`, `destroySession()`.
- Route protection: `middleware.ts` guards `/app/**` game/profile pages; API handlers call
  `requireUser()` themselves (defense in depth).

## Free-run limit

`lib/runLimit/index.ts`: on `POST /api/game/runs` (create new run), within a DB transaction:
1. Load user; if `isPremium && premiumUntil > now` → unlimited, skip.
2. Else count `GameRun` rows for user with `createdAt >= startOfUTCDay` — if `>= 2`, reject 403.
3. Otherwise create the `GameRun` row inside the same transaction (atomic — prevents race
   where two parallel requests both pass the count check).

This is enforced purely server-side; no cookies/localStorage counters.

## Premium / SubscriptionService

`lib/subscription/index.ts` exports `SubscriptionService`:
```
isPremium(user): boolean
activate(userId, until, source): void       // admin-only for now
deactivate(userId): void                    // admin-only for now
```
No payment provider integrated. `/premium` page shows "Premium is coming soon" and,
for ADMIN users, a form to grant premium to a nickname (testing hook per spec #69/#70).

## Content Pipeline

See CONTENT_GUIDE.md. Content authors add TS objects under `lib/content/*`; `lib/content/index.ts`
validates uniqueness of IDs and referential integrity (e.g. a dialogue's `nextNodeId` must
exist) at server boot — throws loudly in dev, logs+drops broken entries in prod.

## Testing

Vitest covers: password hashing, session lifecycle, run-limit enforcement, engine
transitions (movement, inventory, dialogue conditions, event consequences, skill checks,
endings), achievement unlocking. See `tests/`.

## Roadmap

See "Development Phases" in the spec; tracked informally via commits. Current phase is
recorded in README.md "Status" section.
