import type { ItemDefinition } from "@/lib/content/types";

export const allItems: ItemDefinition[] = [
  {
    id: "pocket_watch",
    name: { en: "Pocket Watch", ru: "Карманные часы" },
    description: {
      en: "A silver pocket watch, engraved with initials that are not your own.",
      ru: "Серебряные карманные часы с гравировкой инициалов, которые вам не принадлежат.",
    },
    consumable: false,
    actions: ["inspect", "give", "drop"],
  },
  {
    id: "lockpick_set",
    name: { en: "Lockpick Set", ru: "Набор отмычек" },
    description: {
      en: "A small leather roll of picks and tension wrenches.",
      ru: "Небольшой кожаный чехол с отмычками и натяжными ключами.",
    },
    consumable: false,
    actions: ["use", "inspect", "give", "drop"],
  },
  {
    id: "engineering_notes",
    name: { en: "Engineering Notes", ru: "Инженерные записи" },
    description: {
      en: "Hand-written pages full of technical diagrams and worried annotations.",
      ru: "Рукописные страницы, полные технических схем и тревожных пометок.",
    },
    consumable: false,
    actions: ["inspect", "show", "give", "drop"],
  },
  {
    id: "flashlight",
    name: { en: "Electric Torch", ru: "Электрический фонарь" },
    description: {
      en: "A heavy brass torch, useful in the ship's darker corners.",
      ru: "Тяжёлый латунный фонарь, полезный в тёмных уголках корабля.",
    },
    consumable: false,
    actions: ["use", "inspect", "drop"],
  },
  {
    id: "lifebelt",
    name: { en: "Lifebelt", ru: "Спасательный жилет" },
    description: {
      en: "A cork life vest. Cumbersome, but it could save your life.",
      ru: "Пробковый спасательный жилет. Громоздкий, но способен спасти вам жизнь.",
    },
    consumable: false,
    actions: ["use", "inspect", "give", "drop"],
  },
];

export const itemsById = Object.fromEntries(allItems.map((i) => [i.id, i]));
