import type { ItemDefinition } from "@/lib/content/types";

export const allItems: ItemDefinition[] = [
  {
    id: "pocket_watch",
    name: "Pocket Watch",
    description: "A silver pocket watch, engraved with initials that are not your own.",
    consumable: false,
    actions: ["inspect", "give", "drop"],
  },
  {
    id: "lockpick_set",
    name: "Lockpick Set",
    description: "A small leather roll of picks and tension wrenches.",
    consumable: false,
    actions: ["use", "inspect", "give", "drop"],
  },
  {
    id: "engineering_notes",
    name: "Engineering Notes",
    description: "Hand-written pages full of technical diagrams and worried annotations.",
    consumable: false,
    actions: ["inspect", "show", "give", "drop"],
  },
  {
    id: "flashlight",
    name: "Electric Torch",
    description: "A heavy brass torch, useful in the ship's darker corners.",
    consumable: false,
    actions: ["use", "inspect", "drop"],
  },
  {
    id: "lifebelt",
    name: "Lifebelt",
    description: "A cork life vest. Cumbersome, but it could save your life.",
    consumable: false,
    actions: ["use", "inspect", "give", "drop"],
  },
];

export const itemsById = Object.fromEntries(allItems.map((i) => [i.id, i]));
