import type { AchievementDefinition } from "@/lib/content/types";

export const allAchievements: AchievementDefinition[] = [
  {
    id: "first_run",
    name: { en: "First Steps", ru: "Первые шаги" },
    description: { en: "Complete your first run, whatever the outcome.", ru: "Завершите свой первый забег — независимо от исхода." },
    secret: false,
    check: ({ state }) => state.ending !== null,
  },
  {
    id: "first_survival",
    name: { en: "Survivor", ru: "Выживший" },
    description: { en: "Live to see the dawn.", ru: "Доживите до рассвета." },
    secret: false,
    check: ({ state }) =>
      state.ending === "ending_survived_alone" || state.ending === "ending_survived_helped",
  },
  {
    id: "save_1_person",
    name: { en: "A Helping Hand", ru: "Протянутая рука помощи" },
    description: { en: "Rescue at least one person.", ru: "Спасите хотя бы одного человека." },
    secret: false,
    check: ({ state }) => state.rescuedPeople.length >= 1,
  },
  {
    id: "discover_secret",
    name: { en: "Behind Closed Doors", ru: "За закрытыми дверями" },
    description: { en: "Discover the ship's hidden flaw.", ru: "Раскройте скрытый изъян корабля." },
    secret: true,
    check: ({ state }) => state.knowledge.includes("iceberg_warning"),
  },
  {
    id: "explore_50_percent",
    name: { en: "Getting to Know Her", ru: "Знакомство с кораблём" },
    description: {
      en: "Discover at least half of the ship's known locations.",
      ru: "Исследуйте не менее половины известных локаций корабля.",
    },
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
