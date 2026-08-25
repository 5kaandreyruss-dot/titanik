import type { CharacterArchetype } from "@/lib/content/types";

export const allArchetypes: CharacterArchetype[] = [
  {
    id: "engineer",
    name: "Engineer",
    socialClass: "second",
    description: "A trained engineer travelling second class, comfortable among machinery.",
    statBias: { intelligence: 3, endurance: 2, observation: 2 },
    startingLocationId: "b_deck_corridor",
    startingItems: ["flashlight"],
    startingRelationships: [{ npcId: "halloway", dimension: "respect", value: 15 }],
  },
  {
    id: "aristocrat",
    name: "Aristocrat",
    socialClass: "first",
    description: "A well-connected first-class passenger, used to being listened to.",
    statBias: { charisma: 3, authority: 3 },
    startingLocationId: "a_deck_promenade",
    startingItems: ["pocket_watch"],
    startingRelationships: [{ npcId: "ashford", dimension: "trust", value: 10 }],
  },
  {
    id: "steward",
    name: "Steward",
    socialClass: "crew",
    description: "Ship's crew, knows the corridors and schedules better than most passengers.",
    statBias: { observation: 2, charisma: 2, intelligence: 1 },
    startingLocationId: "b_deck_corridor",
    startingItems: [],
    startingRelationships: [{ npcId: "reilly", dimension: "respect", value: 10 }],
  },
  {
    id: "thief",
    name: "Thief",
    socialClass: "third",
    description: "Travelling on borrowed papers, with quick hands and quicker instincts.",
    statBias: { agility: 3, stealth: 3, observation: 1 },
    startingLocationId: "g_deck_thirdclass_berths",
    startingItems: ["pocket_watch"],
    startingRelationships: [{ npcId: "cobb", dimension: "trust", value: 15 }],
  },
  {
    id: "mechanic",
    name: "Mechanic",
    socialClass: "crew",
    description: "A ship's mechanic, strong-armed and technically minded.",
    statBias: { strength: 3, intelligence: 2, endurance: 2 },
    startingLocationId: "engine_room_access",
    startingItems: [],
    startingRelationships: [{ npcId: "halloway", dimension: "trust", value: 15 }],
  },
];

export const archetypesById = Object.fromEntries(allArchetypes.map((a) => [a.id, a]));
