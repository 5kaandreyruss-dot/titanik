import type { CharacterArchetype } from "@/lib/content/types";

export const allArchetypes: CharacterArchetype[] = [
  {
    id: "engineer",
    name: { en: "Engineer", ru: "Инженер" },
    socialClass: "second",
    description: {
      en: "A trained engineer travelling second class, comfortable among machinery.",
      ru: "Дипломированный инженер, путешествующий вторым классом, чувствует себя как дома среди механизмов.",
    },
    statBias: { intelligence: 3, endurance: 2, observation: 2 },
    startingLocationId: "b_deck_corridor",
    startingItems: ["flashlight"],
    startingRelationships: [{ npcId: "halloway", dimension: "respect", value: 15 }],
  },
  {
    id: "aristocrat",
    name: { en: "Aristocrat", ru: "Аристократ" },
    socialClass: "first",
    description: {
      en: "A well-connected first-class passenger, used to being listened to.",
      ru: "Хорошо знакомый пассажир первого класса, привыкший, что его слушают.",
    },
    statBias: { charisma: 3, authority: 3 },
    startingLocationId: "a_deck_promenade",
    startingItems: ["pocket_watch"],
    startingRelationships: [{ npcId: "ashford", dimension: "trust", value: 10 }],
  },
  {
    id: "steward",
    name: { en: "Steward", ru: "Стюард" },
    socialClass: "crew",
    description: {
      en: "Ship's crew, knows the corridors and schedules better than most passengers.",
      ru: "Член экипажа, знающий коридоры и расписания корабля лучше большинства пассажиров.",
    },
    statBias: { observation: 2, charisma: 2, intelligence: 1 },
    startingLocationId: "b_deck_corridor",
    startingItems: [],
    startingRelationships: [{ npcId: "reilly", dimension: "respect", value: 10 }],
  },
  {
    id: "thief",
    name: { en: "Thief", ru: "Вор" },
    socialClass: "third",
    description: {
      en: "Travelling on borrowed papers, with quick hands and quicker instincts.",
      ru: "Путешествует по чужим документам, с ловкими руками и ещё более ловкими инстинктами.",
    },
    statBias: { agility: 3, stealth: 3, observation: 1 },
    startingLocationId: "g_deck_thirdclass_berths",
    startingItems: ["pocket_watch"],
    startingRelationships: [{ npcId: "cobb", dimension: "trust", value: 15 }],
  },
  {
    id: "mechanic",
    name: { en: "Mechanic", ru: "Механик" },
    socialClass: "crew",
    description: {
      en: "A ship's mechanic, strong-armed and technically minded.",
      ru: "Судовой механик — крепкий физически и технически подкованный.",
    },
    statBias: { strength: 3, intelligence: 2, endurance: 2 },
    startingLocationId: "engine_room_access",
    startingItems: [],
    startingRelationships: [{ npcId: "halloway", dimension: "trust", value: 15 }],
  },
];

export const archetypesById = Object.fromEntries(allArchetypes.map((a) => [a.id, a]));
