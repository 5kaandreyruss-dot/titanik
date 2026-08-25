import type {
  CharacterStats,
  Condition,
  Consequence,
  SocialClass,
  StatKey,
} from "@/lib/engine/types";
import type { LocalizedText } from "@/lib/i18n/types";

export interface LocationDefinition {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  deck: LocalizedText;
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
  name: LocalizedText;
  description: LocalizedText;
  consumable: boolean;
  actions: ("use" | "give" | "show" | "drop" | "inspect")[];
}

export interface NpcDefinition {
  id: string;
  name: string; // proper noun, not translated
  age: number;
  gender: string;
  profession: LocalizedText;
  socialClass: SocialClass;
  personality: string; // internal authoring notes, never shown to players
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
  text: LocalizedText;
  conditions?: Condition[];
  consequences?: Consequence[];
  npcReply?: LocalizedText;
  nextNodeId?: string; // continue to another node, or end dialogue if omitted
  hint?: LocalizedText; // soft flavor text about difficulty, shown instead of numbers
  skillCheck?: { stat: StatKey; difficulty: number }; // 1-10 scale
  successConsequences?: Consequence[];
  failConsequences?: Consequence[];
  successNpcReply?: LocalizedText;
  failNpcReply?: LocalizedText;
}

export interface DialogueNode {
  id: string;
  npcText: LocalizedText;
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
  name: string; // internal authoring label, never shown to players
  category: "common" | "rare" | "historical" | "narrative" | "secret";
  trigger: Condition[];
  oneShot: boolean;
  consequences: Consequence[];
  logText: LocalizedText;
}

export interface EndingDefinition {
  id: string;
  name: LocalizedText;
  category: "positive" | "neutral" | "negative" | "secret";
  priority: number; // higher priority wins if multiple match same tick
  conditions: Condition[];
  epilogueText: LocalizedText;
}

export interface AchievementDefinition {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  secret: boolean;
  // Evaluated against a finished GameRunState + aggregate user stats.
  check: (ctx: { state: import("@/lib/engine/types").GameRunState }) => boolean;
}

export interface CharacterArchetype {
  id: string;
  name: LocalizedText;
  socialClass: SocialClass;
  description: LocalizedText;
  statBias: Partial<CharacterStats>; // added on top of base rolls for these stats
  startingLocationId: string;
  startingItems: string[];
  startingRelationships: { npcId: string; dimension: string; value: number }[];
  premiumOnly?: boolean;
}

export interface KnowledgeDefinition {
  id: string;
  category: "People" | "Locations" | "Events" | "Secrets" | "Technical" | "Endings";
  title: LocalizedText;
  text: LocalizedText;
}
