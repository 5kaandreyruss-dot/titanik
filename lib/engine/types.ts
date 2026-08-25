// Core types shared by the game engine and content definitions.
// This module has zero framework dependencies (no React/Next/Prisma).

import type { LocalizedText } from "@/lib/i18n/types";

export type StatKey =
  | "strength"
  | "agility"
  | "intelligence"
  | "observation"
  | "charisma"
  | "stealth"
  | "endurance"
  | "luck"
  | "authority";

export const ALL_STATS: StatKey[] = [
  "strength",
  "agility",
  "intelligence",
  "observation",
  "charisma",
  "stealth",
  "endurance",
  "luck",
  "authority",
];

export type CharacterStats = Record<StatKey, number>;

export type RelationshipDimension = "trust" | "respect" | "fear" | "suspicion" | "loyalty";

export const ALL_RELATIONSHIP_DIMENSIONS: RelationshipDimension[] = [
  "trust",
  "respect",
  "fear",
  "suspicion",
  "loyalty",
];

export type Relationship = Record<RelationshipDimension, number>;

export type ShipStateKey = "damage" | "flooding" | "power" | "panic" | "fire";

export type ShipState = Record<ShipStateKey, number>;

export type SocialClass = "first" | "second" | "third" | "crew";

// ---------------------------------------------------------------------------
// Condition / Consequence model (see CONTENT_GUIDE.md)
// ---------------------------------------------------------------------------

export type Condition =
  | { type: "timeAfter"; minutes: number }
  | { type: "timeBefore"; minutes: number }
  | { type: "flag"; key: string; equals?: boolean | number | string }
  | {
      type: "relationshipAtLeast";
      npcId: string;
      dimension: RelationshipDimension;
      value: number;
    }
  | { type: "hasKnowledge"; id: string }
  | { type: "hasItem"; id: string }
  | { type: "locationIs"; id: string }
  | { type: "npcAlive"; id: string }
  | { type: "npcDead"; id: string }
  | { type: "eventCompleted"; id: string }
  | { type: "statAtLeast"; stat: StatKey; value: number }
  | { type: "shipStateAtLeast"; key: ShipStateKey; value: number }
  | { type: "rescuedAtLeast"; count: number }
  | { type: "and"; conditions: Condition[] }
  | { type: "or"; conditions: Condition[] }
  | { type: "not"; condition: Condition };

export type Consequence =
  | { type: "addKnowledge"; id: string }
  | {
      type: "changeRelationship";
      npcId: string;
      dimension: RelationshipDimension;
      delta: number;
    }
  | { type: "moveNpc"; npcId: string; locationId: string }
  | { type: "unlockLocation"; id: string }
  | { type: "lockLocation"; id: string }
  | { type: "addItem"; id: string; quantity?: number }
  | { type: "removeItem"; id: string; quantity?: number }
  | { type: "setFlag"; key: string; value: boolean | number | string }
  | { type: "changeShipState"; key: ShipStateKey; delta: number }
  | { type: "triggerEvent"; id: string }
  | { type: "advanceTime"; minutes: number }
  | { type: "killNpc"; id: string }
  | { type: "rescuePerson"; id: string }
  | { type: "endRun"; endingId: string };

// ---------------------------------------------------------------------------
// Run-time (persisted) state
// ---------------------------------------------------------------------------

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface NpcRuntimeState {
  locationId: string;
  alive: boolean;
  flags: Record<string, boolean | number | string>;
}

export interface LocationRuntimeState {
  discovered: boolean;
  locked: boolean;
  itemsPresent: string[];
}

export interface LogEntry {
  time: number;
  text: LocalizedText;
}

export interface GameRunState {
  time: { minutesSinceStart: number };
  currentLocationId: string;
  ship: ShipState;
  npcs: Record<string, NpcRuntimeState>;
  relationships: Record<string, Relationship>;
  inventory: InventoryItem[];
  knowledge: string[];
  locations: Record<string, LocationRuntimeState>;
  eventsCompleted: string[];
  eventsActive: string[];
  flags: Record<string, boolean | number | string>;
  rescuedPeople: string[];
  deadPeople: string[];
  log: LogEntry[];
  ending: string | null;
  activeDialogue: { npcId: string; nodeId: string } | null;
  stats: CharacterStats;
  characterName: string;
  characterGender: string;
  characterArchetypeId: string;
  socialClass: SocialClass;
  rngCounter: number;
}

// ---------------------------------------------------------------------------
// Player actions (client -> server intent only; no numeric/authoritative data)
// ---------------------------------------------------------------------------

export type PlayerAction =
  | { type: "MOVE"; targetLocationId: string }
  | { type: "LOOK_AROUND" }
  | { type: "TALK_START"; npcId: string }
  | { type: "DIALOGUE_CHOOSE"; npcId: string; choiceId: string }
  | { type: "INSPECT"; targetId: string }
  | { type: "TAKE_ITEM"; itemId: string }
  | { type: "USE_ITEM"; itemId: string; targetId?: string }
  | { type: "GIVE_ITEM"; itemId: string; npcId: string }
  | { type: "WAIT"; minutes: number };

export interface EngineEffect {
  kind: "log" | "relationship" | "item" | "knowledge" | "location" | "ending" | "error";
  text: LocalizedText;
}

export interface EngineResult {
  state: GameRunState;
  effects: EngineEffect[];
}
