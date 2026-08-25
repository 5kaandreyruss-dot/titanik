# CONTENT_GUIDE — Authoring content without touching the engine

All content lives under `lib/content/**` as typed TS modules, validated by zod schemas in
`lib/content/schema.ts` and aggregated by `lib/content/index.ts` into a `ContentRegistry`
loaded once at server start. **Adding an NPC/location/item/event never requires changing
`lib/engine/**`.**

## Directory layout

```
lib/content/
  schema.ts          zod schemas for every content type
  index.ts            loads + validates + exposes getContentRegistry()
  npcs/*.ts            one file per NPC (or small group)
  locations/*.ts
  items/*.ts
  dialogues/*.ts       dialogue trees, keyed by npcId
  events/*.ts
  endings/*.ts
  achievements/*.ts
  characterArchetypes.ts
  names.ts             era-appropriate name pools
```

## Conventions

- IDs: `snake_case`, globally unique per content type, stable forever (referenced by saved
  `GameRunState`) — never rename/reuse an id once shipped.
- Every content object is a plain literal exported as `const`, collected by an `all*()`
  function per folder (e.g. `export const allNpcs = [halloway, ashford, ...]`).
- No logic in content files beyond simple derived arrays — no conditionals that branch game
  rules (that belongs in the engine reading generic `Condition`/`Consequence` structures).

## Condition / Consequence model (spec #72)

```ts
type Condition =
  | { type: 'timeAfter'; minutes: number }
  | { type: 'timeBefore'; minutes: number }
  | { type: 'flag'; key: string; equals?: boolean | number | string }
  | { type: 'relationshipAtLeast'; npcId: string; dimension: RelationshipDimension; value: number }
  | { type: 'hasKnowledge'; id: string }
  | { type: 'hasItem'; id: string }
  | { type: 'locationIs'; id: string }
  | { type: 'npcAlive'; id: string }
  | { type: 'eventCompleted'; id: string }
  | { type: 'not'; condition: Condition };

type Consequence =
  | { type: 'addKnowledge'; id: string }
  | { type: 'changeRelationship'; npcId: string; dimension: RelationshipDimension; delta: number }
  | { type: 'moveNpc'; npcId: string; locationId: string }
  | { type: 'unlockLocation'; id: string }
  | { type: 'lockLocation'; id: string }
  | { type: 'addItem'; id: string; quantity?: number }
  | { type: 'removeItem'; id: string; quantity?: number }
  | { type: 'setFlag'; key: string; value: boolean | number | string }
  | { type: 'changeShipState'; key: ShipStateKey; delta: number }
  | { type: 'triggerEvent'; id: string }
  | { type: 'advanceTime'; minutes: number }
  | { type: 'killNpc'; id: string }
  | { type: 'rescuePerson'; id: string }
  | { type: 'endRun'; endingId: string };
```

Every NPC dialogue choice, event, and ending is defined declaratively using these two
unions. The engine (`lib/engine/events.ts`, `dialogue.ts`, `endings.ts`) contains one
generic evaluator/applier each — content never needs new engine code for new combinations.

## Adding a new NPC (example flow)

1. Create `lib/content/npcs/mrsAshford.ts` exporting an `NpcDefinition`.
2. Create `lib/content/dialogues/mrsAshford.ts` exporting `DialogueTree` keyed by node id,
   referencing Conditions/Consequences only.
3. Register both in the folder's `index.ts` barrel (`allNpcs`, `allDialogues`).
4. Run `npm run validate:content` (zod + referential-integrity check) before committing.

## Content Targets (spec #62 — long-term, beyond vertical slice)

30–50 NPCs, 50+ locations, 100+ items, 100+ events, 100+ dialogue situations, 20+ story
chains, 30+ endings (10+ secret), 15+ achievements. Vertical slice ships a small fraction
of each to prove the pipeline; expansion is pure content-file addition.
