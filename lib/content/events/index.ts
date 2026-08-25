import type { EventDefinition } from "@/lib/content/types";

export const allEvents: EventDefinition[] = [
  {
    id: "event_find_ashford_husband",
    name: "Finding Mr. Ashford",
    category: "narrative",
    trigger: [
      { type: "locationIs", id: "first_class_dining" },
      { type: "flag", key: "agreed_help_ashford", equals: true },
    ],
    oneShot: true,
    consequences: [
      { type: "setFlag", key: "found_ashford_husband", value: true },
      { type: "addKnowledge", id: "ashford_husband_found" },
    ],
    logText: {
      en: "You spot Mr. Ashford at a corner table, safe and quite unaware of his wife's worry.",
      ru: "Вы замечаете мистера Эшфорда за угловым столиком — целого и невредимого, даже не подозревающего о тревоге жены.",
    },
  },
  {
    id: "event_bring_ashford_to_boats",
    name: "Ashford Family Reunited on the Boat Deck",
    category: "narrative",
    trigger: [
      { type: "locationIs", id: "boat_deck" },
      { type: "flag", key: "ashford_rescued_husband", equals: true },
      { type: "flag", key: "collision_happened", equals: true },
    ],
    oneShot: true,
    consequences: [
      { type: "rescuePerson", id: "ashford" },
      { type: "addKnowledge", id: "ashford_safe" },
    ],
    logText: {
      en: "You help Mrs. Ashford and her husband board a lifeboat together, safe at last.",
      ru: "Вы помогаете миссис Эшфорд и её мужу вместе сесть в шлюпку — наконец-то в безопасности.",
    },
  },
  {
    id: "event_collision",
    name: "Collision with the Iceberg",
    category: "historical",
    trigger: [{ type: "timeAfter", minutes: 219 }],
    oneShot: true,
    consequences: [
      { type: "changeShipState", key: "damage", delta: 40 },
      { type: "changeShipState", key: "flooding", delta: 10 },
      { type: "changeShipState", key: "power", delta: -10 },
      { type: "setFlag", key: "collision_happened", value: true },
    ],
    logText: {
      en: "A shudder runs through the ship. Somewhere below, metal screams against ice.",
      ru: "По кораблю проходит дрожь. Где-то внизу металл со скрежетом врезается в лёд.",
    },
  },
  {
    id: "event_flooding_progress_normal",
    name: "Flooding Worsens",
    category: "historical",
    trigger: [
      { type: "flag", key: "collision_happened", equals: true },
      { type: "not", condition: { type: "flag", key: "warned_bridge", equals: true } },
    ],
    oneShot: false,
    consequences: [
      { type: "changeShipState", key: "flooding", delta: 4 },
      { type: "changeShipState", key: "panic", delta: 3 },
    ],
    logText: {
      en: "Water rises somewhere below. Crew members hurry past, tight-lipped.",
      ru: "Где-то внизу прибывает вода. Мимо спешат члены экипажа с плотно сжатыми губами.",
    },
  },
  {
    id: "event_flooding_progress_warned",
    name: "Flooding Worsens (Prepared)",
    category: "historical",
    trigger: [
      { type: "flag", key: "collision_happened", equals: true },
      { type: "flag", key: "warned_bridge", equals: true },
    ],
    oneShot: false,
    consequences: [
      { type: "changeShipState", key: "flooding", delta: 2 },
      { type: "changeShipState", key: "panic", delta: 1 },
    ],
    logText: {
      en: "Water rises, but the crew already seems to know what to do.",
      ru: "Вода прибывает, но экипаж, похоже, уже знает, что делать.",
    },
  },
];

export const eventsById = Object.fromEntries(allEvents.map((e) => [e.id, e]));
