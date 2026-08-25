# GAME DESIGN — Titanic: The Last Chance

Alternate-history survival/investigation game aboard RMS Titanic, night of Apr 14–15, 1912.
Discovery-driven, not a visual novel: the player is never told the win condition exists.

## Stats (1–10)

`strength, agility, intelligence, observation, charisma, stealth, endurance, luck, authority`

Effects (examples, not exhaustive — exact thresholds live in content, not shown to player):
- strength: force doors, physical rescues, carrying people
- agility: climbing, running from flooding, picking locks fast
- intelligence: reading technical documents, understanding the damage, repairs
- observation: spotting hidden objects/clues, noticing NPC lies
- charisma: persuasion, calming panic, romance/trust building
- stealth: sneaking into restricted areas, pickpocketing
- endurance: cold water/exhaustion resistance, staying conscious longer
- luck: modifies borderline skill checks, rare-event chance
- authority: crew/officer deference, access to restricted orders

Skill checks (`lib/engine/skillCheck.ts`): `roll = seededRandom(0..1); threshold = baseDifficulty - statBonus(stat) - luckBonus; success = roll < threshold`.
UI never prints the numeric threshold — only qualitative flavor text ("This lock looks complicated.").

## Character Archetypes (starting stat biases, not power levels)

| Archetype | Class | High stats | Notes |
|---|---|---|---|
| Engineer | 2nd/Crew | intelligence, endurance, observation | Starts near boiler rooms, knows technical jargon |
| Aristocrat | 1st | charisma, authority | Access to 1st class only areas, officers listen |
| Steward | Crew | observation, charisma, (ship knowledge = knowledge flag) | Knows crew schedules, corridors |
| Thief | 3rd | agility, stealth, observation | Starts with lockpicks, distrusted by crew |
| Mechanic | Crew | strength, intelligence, endurance | Access to engine spaces |
| Journalist | 2nd | intelligence, charisma | Starts with notebook, asks questions freely |
| Immigrant Worker | 3rd | strength, endurance | Starts in G Deck, tight-knit 3rd class network |

Each run: pick archetype (weighted random, or free-tier limited set — premium unlocks more
archetypes/campaigns per spec #33), roll stats within archetype's biased ranges (others 3-6),
assign name (era-appropriate name pool by gender/origin), starting location, 1-3 starting
items, 0-2 starting NPC relationships (e.g. Mechanic starts acquainted with another Mechanic NPC).

## World State (`GameRunState`, persisted as JSON)

```ts
interface GameRunState {
  time: { minutesSinceStart: number };        // start 1912-04-14 20:00
  currentLocationId: string;
  ship: { damage: number; flooding: number; power: number; panic: number; fire: number };
  npcs: Record<string, NpcState>;              // location, relationship, flags, alive
  relationships: Record<string, Relationship>; // trust/respect/fear/suspicion/loyalty 0-100
  inventory: InventoryItem[];
  knowledge: string[];                         // discovered Knowledge ids (character knowledge)
  discoveredLocations: string[];
  eventsCompleted: string[];
  eventsActive: string[];
  flags: Record<string, boolean | number | string>; // generic world-state flags for conditions
  rescuedPeople: string[];
  deadPeople: string[];
  log: { time: number; text: string }[];       // player-facing narrative log
  ending: string | null;
}
```

Player-level **meta knowledge** (persists across runs, separate from character knowledge) is
stored on `User`/`Discovery` — the Knowledge Archive UI shows what the account has ever
discovered, but a fresh character's `knowledge[]` always starts empty; archive entries only
tell the *player* (not the character) that something exists, they don't grant it in-run.

## Time

Start: 1912-04-14 20:00. Collision event fires at a fixed in-fiction time (23:40) IF the
player hasn't done anything to prevent it (vertical slice: collision is fixed; prevention
is future-phase content per spec #25, flagged as a long-term design target in this doc).
Action costs (minutes): short talk 3, long talk 10, move 5, search 8, lockpick 6, repair 20.

## Locations (vertical slice set — see CONTENT_GUIDE.md for full target list of 50+)

- `boat_deck`, `a_deck_promenade`, `b_deck_corridor`, `first_class_dining`,
  `c_deck_purser_office`, `engine_room_access`, `boiler_room_6`, `g_deck_thirdclass_berths`,
  `bridge_wing` (restricted). Full ship map (A–G decks, engine/boiler spaces, cargo, crew
  areas) is the long-term target; slice ships a representative vertical cut through classes.

## NPCs (vertical slice — 4)

1. **Thomas Andrews-inspired fictional analog: "Mr. Halloway"** (ship's junior architect,
   crew, knows about the damage early) — secret: suspects the ship is under-margined on
   watertight compartments.
2. **"Mrs. Ashford"** (1st class passenger) — wants help finding her missing husband.
3. **"Officer Reilly"** (crew, authority-gated dialogue) — can grant deck access.
4. **"Danny Cobb"** (3rd class, thief archetype's contact) — trades goods/information.

Each has schedule (location by time block), relationship (trust/respect/fear/suspicion/loyalty
0-100, bucketed hostile<20/distrustful<40/neutral<60/trusting<80/loyal>=80), dialogue tree,
inventory, and state flags (e.g. `halloway.warned_officer: bool`).

## Event Engine

`EventDefinition { id, trigger: Condition[], oneShot: boolean, consequences: Consequence[] }`.
Scanned after every action. Condition examples: `timeAfter(1350)`, `flag('warned_officer')`,
`relationshipAtLeast('halloway','trust',60)`, `hasKnowledge('id')`, `hasItem('id')`,
`locationIs('bridge_wing')`. Consequences: `addKnowledge`, `changeRelationship`, `moveNpc`,
`unlockLocation`, `lockLocation`, `addItem`, `removeItem`, `setFlag`, `changeShipState`,
`triggerEvent`, `advanceTime`, `killNpc`, `endRun`.

## Vertical-Slice Story Chain

1. Player explores B Deck / Boat Deck, meets Officer Reilly and Mrs. Ashford.
2. Helping Mrs. Ashford (find husband in 1st class dining) raises her trust; she mentions
   Halloway acting strange near the bridge.
3. Talking to Halloway (requires either Authority stat check, Officer Reilly's access grant,
   or stealth to sneak into `bridge_wing`) with trust ≥ 40 reveals `knowledge:iceberg_warning`.
4. **Decision point** (23:20): warn the bridge officers (uses Authority/Charisma check) or
   ignore it. This is the one major decision of the slice.
5. 23:40 collision event fires regardless (slice keeps history fixed — full prevention arc is
   future content) but ship state (`flooding` growth rate, `panic`) differs based on whether
   warning happened (earlier lifeboat prep = better rescue odds).
6. Player must reach a lifeboat or help others before `flooding` crosses thresholds.
   - **Bad ending**: `ending_drowned` — stayed too long / never got warning, ship state fatal.
   - **Good ending**: `ending_survived_helped` — reached boat deck with rescued NPC(s) after
     having warned the bridge.

## Endings (target 30+, slice ships 3)

- `ending_drowned` (negative)
- `ending_survived_alone` (neutral)
- `ending_survived_helped` (positive) — requires ≥1 rescued NPC + reaching boat deck alive
- Long-term catalog buckets per spec #26: positive (incl. "Titanic saved" chain — future
  phase, requires the full technical-intervention chain outlined in spec #25), neutral,
  negative, secret (rare condition combos, e.g. discovering a hidden crew conspiracy).

## Achievements (slice ships a handful, target 15+)

`first_run`, `first_survival`, `save_1_person`, `discover_secret` (any secret-tagged
knowledge), `explore_50_percent`.

## Difficulty Philosophy

No arbitrary random death: every death traces to a legible cause (ignored warning, ran out
of time, entered a flooding compartment, trusted the wrong NPC). Luck stat and RNG only
nudge borderline checks, never flip a clearly-failed plan into success or vice versa.
