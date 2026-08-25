import type { KnowledgeDefinition } from "@/lib/content/types";

export const allKnowledge: KnowledgeDefinition[] = [
  {
    id: "iceberg_warning",
    category: "Secrets",
    title: "A Fatal Design Flaw",
    text: "Halloway believes the watertight bulkheads do not extend high enough — if enough compartments flood, the ship could go down far faster than anyone expects.",
  },
  {
    id: "warning_given",
    category: "Events",
    title: "The Bridge Was Warned",
    text: "You convinced Officer Reilly to carry your warning to the bridge before the collision.",
  },
  {
    id: "ashford_husband_found",
    category: "People",
    title: "Mr. Ashford, Found",
    text: "You found Mr. Ashford safe in the first-class dining saloon.",
  },
  {
    id: "ashford_reunited",
    category: "People",
    title: "The Ashfords, Reunited",
    text: "You told Mrs. Ashford her husband was safe. She will not forget it.",
  },
  {
    id: "ashford_safe",
    category: "Events",
    title: "A Family Saved",
    text: "You helped the Ashfords board a lifeboat together.",
  },
];

export const knowledgeById = Object.fromEntries(allKnowledge.map((k) => [k.id, k]));
