import type {
  CharacterStats,
  Condition,
  Consequence,
  SocialClass,
  StatKey,
} from "@/lib/engine/types";

export interface LocationDefinition {
  id: string;
  name: string;
  description: string;
  deck: string;
  exits: string[]; // location ids reachable directly from here
  startsDiscovered: boolean;
  startsLocked: boolean;
  requiredToUnlock?: Condition[]; // if locked, conditions that auto-unlock on check
  restrictedToClasses?: SocialClass[]; // undefined = open to all
  sceneBackground: string; // asset key, e.g. "boat_deck_night"
  itemsPresent?: string[]; // item ids initially found here, pickable via TAKE_ITEM
}

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  consumable: boolean;
  actions: ("use" | "give" | "show" | "drop" | "inspect")[];
}

export interface NpcDefinition {
  id: string;
  name: string;
  age: number;
  gender: string;
  profession: string;
  socialClass: SocialClass;
  personality: string;
  goals: string;
  fears: string;
  secrets: string;
  startingLocationId: string;
  schedule: { afterMinutes: number; locationId: string }[]; // sorted ascending
  startingInventory: string[]; // item ids
  startingRelationship: Partial<Record<string, number>>; // dimension -> value, defaults 30
}

export interface DialogueChoice {
  id: string;
  text: string;
  conditions?: Condition[];
  consequences?: Consequence[];
  npcReply?: string;
  nextNodeId?: string; // continue to another node, or end dialogue if omitted
  hint?: string; // soft flavor text about difficulty, shown instead of numbers
  skillCheck?: { stat: StatKey; difficulty: number }; // 1-10 scale
  successConsequences?: Consequence[];
  failConsequences?: Consequence[];
  successNpcReply?: string;
  failNpcReply?: string;
}

export interface DialogueNode {
  id: string;
  npcText: string;
  choices: DialogueChoice[];
}

export interface DialogueTree {
  npcId: string;
  entryNodeId: string; // fallback entry
  entryCandidates?: { nodeId: string; conditions: Condition[] }[]; // checked in order, first match wins
  nodes: Record<string, DialogueNode>;
}

export interface EventDefinition {
  id: string;
  name: string;
  category: "common" | "rare" | "historical" | "narrative" | "secret";
  trigger: Condition[];
  oneShot: boolean;
  consequences: Consequence[];
  logText: string;
}

export interface EndingDefinition {
  id: string;
  name: string;
  category: "positive" | "neutral" | "negative" | "secret";
  priority: number; // higher priority wins if multiple match same tick
  conditions: Condition[];
  epilogueText: string;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  secret: boolean;
  // Evaluated against a finished GameRunState + aggregate user stats.
  check: (ctx: { state: import("@/lib/engine/types").GameRunState }) => boolean;
}

export interface CharacterArchetype {
  id: string;
  name: string;
  socialClass: SocialClass;
  description: string;
  statBias: Partial<CharacterStats>; // added on top of base rolls for these stats
  startingLocationId: string;
  startingItems: string[];
  startingRelationships: { npcId: string; dimension: string; value: number }[];
  premiumOnly?: boolean;
}

export interface KnowledgeDefinition {
  id: string;
  category: "People" | "Locations" | "Events" | "Secrets" | "Technical" | "Endings";
  title: string;
  text: string;
}
