import type { AchievementDefinition } from "@/lib/content/types";

export const allAchievements: AchievementDefinition[] = [
  {
    id: "first_run",
    name: "First Steps",
    description: "Complete your first run, whatever the outcome.",
    secret: false,
    check: ({ state }) => state.ending !== null,
  },
  {
    id: "first_survival",
    name: "Survivor",
    description: "Live to see the dawn.",
    secret: false,
    check: ({ state }) =>
      state.ending === "ending_survived_alone" || state.ending === "ending_survived_helped",
  },
  {
    id: "save_1_person",
    name: "A Helping Hand",
    description: "Rescue at least one person.",
    secret: false,
    check: ({ state }) => state.rescuedPeople.length >= 1,
  },
  {
    id: "discover_secret",
    name: "Behind Closed Doors",
    description: "Discover the ship's hidden flaw.",
    secret: true,
    check: ({ state }) => state.knowledge.includes("iceberg_warning"),
  },
  {
    id: "explore_50_percent",
    name: "Getting to Know Her",
    description: "Discover at least half of the ship's known locations.",
    secret: false,
    check: ({ state }) => {
      const values = Object.values(state.locations);
      if (values.length === 0) return false;
      const discovered = values.filter((l) => l.discovered).length;
      return discovered / values.length >= 0.5;
    },
  },
];

export const achievementsById = Object.fromEntries(allAchievements.map((a) => [a.id, a]));
