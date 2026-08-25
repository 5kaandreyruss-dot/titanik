import type { EndingDefinition } from "@/lib/content/types";

export const allEndings: EndingDefinition[] = [
  {
    id: "ending_drowned",
    name: "Lost to the Sea",
    category: "negative",
    priority: 100,
    conditions: [
      { type: "shipStateAtLeast", key: "flooding", value: 80 },
      { type: "not", condition: { type: "locationIs", id: "boat_deck" } },
    ],
    epilogueText:
      "The water finds you before you find a way out. The Titanic's lights flicker, then go dark.",
  },
  {
    id: "ending_survived_helped",
    name: "Not Alone",
    category: "positive",
    priority: 90,
    conditions: [
      { type: "flag", key: "collision_happened", equals: true },
      { type: "locationIs", id: "boat_deck" },
      { type: "shipStateAtLeast", key: "flooding", value: 40 },
      { type: "rescuedAtLeast", count: 1 },
    ],
    epilogueText:
      "You watch the great ship's final moments from the safety of a lifeboat, the Ashfords huddled together beside you. You did not save the Titanic — but you saved who you could.",
  },
  {
    id: "ending_survived_alone",
    name: "Every Man for Himself",
    category: "neutral",
    priority: 80,
    conditions: [
      { type: "flag", key: "collision_happened", equals: true },
      { type: "locationIs", id: "boat_deck" },
      { type: "shipStateAtLeast", key: "flooding", value: 40 },
    ],
    epilogueText:
      "A lifeboat is lowered with you in it. You survive the night, but the faces of those you left behind will stay with you.",
  },
];

export const endingsById = Object.fromEntries(allEndings.map((e) => [e.id, e]));
