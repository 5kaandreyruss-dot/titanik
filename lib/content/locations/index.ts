import type { LocationDefinition } from "@/lib/content/types";

export const allLocations: LocationDefinition[] = [
  {
    id: "boat_deck",
    name: { en: "Boat Deck", ru: "Шлюпочная палуба" },
    description: {
      en: "The topmost deck, lined with lifeboats swaying gently on their davits. The night air is bitterly cold and smells of the sea.",
      ru: "Самая верхняя палуба, уставленная спасательными шлюпками, тихо покачивающимися на шлюпбалках. Ночной воздух пронизывающе холоден и пахнет морем.",
    },
    deck: { en: "Boat Deck", ru: "Шлюпочная палуба" },
    exits: ["a_deck_promenade"],
    startsDiscovered: true,
    startsLocked: false,
    sceneBackground: "boat_deck_night",
    itemsPresent: ["lifebelt"],
  },
  {
    id: "a_deck_promenade",
    name: { en: "A Deck Promenade", ru: "Променад палубы A" },
    description: {
      en: "A long enclosed promenade with tall windows facing the black ocean. A few passengers stroll in evening dress.",
      ru: "Длинный застеклённый променад с высокими окнами, выходящими на чёрный океан. Несколько пассажиров в вечерних нарядах прогуливаются вдоль борта.",
    },
    deck: { en: "A Deck", ru: "Палуба A" },
    exits: ["boat_deck", "b_deck_corridor", "bridge_wing"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "a_deck_promenade",
  },
  {
    id: "bridge_wing",
    name: { en: "Bridge Wing", ru: "Крыло мостика" },
    description: {
      en: "A narrow, restricted walkway just outside the wheelhouse. Officers pace here, watching the dark horizon.",
      ru: "Узкий, закрытый для посторонних проход рядом с рулевой рубкой. Здесь расхаживают офицеры, вглядываясь в тёмный горизонт.",
    },
    deck: { en: "Bridge", ru: "Мостик" },
    exits: ["a_deck_promenade"],
    startsDiscovered: false,
    startsLocked: true,
    requiredToUnlock: [
      {
        type: "or",
        conditions: [
          { type: "flag", key: "reilly_authorized", equals: true },
          { type: "statAtLeast", stat: "authority", value: 8 },
          {
            type: "and",
            conditions: [
              { type: "hasItem", id: "lockpick_set" },
              { type: "statAtLeast", stat: "stealth", value: 6 },
            ],
          },
        ],
      },
    ],
    sceneBackground: "bridge_wing",
  },
  {
    id: "b_deck_corridor",
    name: { en: "B Deck Corridor", ru: "Коридор палубы B" },
    description: {
      en: "A quiet first-class corridor, carpeted and warm, lined with cabin doors bearing brass numbers.",
      ru: "Тихий коридор первого класса — тёплый, застеленный ковром, с рядом кают, на дверях которых блестят латунные номера.",
    },
    deck: { en: "B Deck", ru: "Палуба B" },
    exits: ["a_deck_promenade", "first_class_dining", "c_deck_purser_office", "g_deck_thirdclass_berths"],
    startsDiscovered: true,
    startsLocked: false,
    sceneBackground: "b_deck_corridor",
  },
  {
    id: "first_class_dining",
    name: { en: "First-Class Dining Saloon", ru: "Обеденный салон первого класса" },
    description: {
      en: "An opulent hall beneath a domed skylight. Waiters glide between white-clothed tables as a string quartet plays.",
      ru: "Роскошный зал под стеклянным куполом. Официанты скользят между столами, застеленными белыми скатертями, а струнный квартет играет тихую музыку.",
    },
    deck: { en: "D Deck", ru: "Палуба D" },
    exits: ["b_deck_corridor"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "dining_saloon",
  },
  {
    id: "c_deck_purser_office",
    name: { en: "Purser's Office", ru: "Каюта казначея" },
    description: {
      en: "A small office where passengers deposit valuables. Ledgers and safes line the walls.",
      ru: "Небольшая контора, куда пассажиры сдают ценности на хранение. Вдоль стен стоят гроссбухи и сейфы.",
    },
    deck: { en: "C Deck", ru: "Палуба C" },
    exits: ["b_deck_corridor", "engine_room_access"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "purser_office",
  },
  {
    id: "engine_room_access",
    name: { en: "Engine Room Access", ru: "Вход в машинное отделение" },
    description: {
      en: "A steel stairwell descending into heat and noise. The rhythmic thud of massive engines echoes upward.",
      ru: "Стальная лестница, ведущая вниз, в жар и грохот. Ритмичный стук огромных двигателей доносится наверх.",
    },
    deck: { en: "E Deck", ru: "Палуба E" },
    exits: ["c_deck_purser_office", "boiler_room_6"],
    startsDiscovered: false,
    startsLocked: false,
    restrictedToClasses: ["crew"],
    sceneBackground: "engine_access",
  },
  {
    id: "boiler_room_6",
    name: { en: "Boiler Room 6", ru: "Котельная №6" },
    description: {
      en: "Rows of roaring furnaces, coal dust hanging in the air. Trimmers move like shadows between the boilers.",
      ru: "Ряды ревущих топок, угольная пыль висит в воздухе. Кочегары движутся между котлами, точно тени.",
    },
    deck: { en: "Tank Top", ru: "Трюмная палуба" },
    exits: ["engine_room_access"],
    startsDiscovered: false,
    startsLocked: false,
    restrictedToClasses: ["crew"],
    sceneBackground: "boiler_room",
    itemsPresent: ["flashlight"],
  },
  {
    id: "g_deck_thirdclass_berths",
    name: { en: "G Deck Third-Class Berths", ru: "Каюты третьего класса, палуба G" },
    description: {
      en: "Rows of simple bunks and shared tables. Families speak in a dozen languages amid the low hum of the ship.",
      ru: "Ряды простых коек и общих столов. Семьи переговариваются на десятке языков под негромкий гул корабля.",
    },
    deck: { en: "G Deck", ru: "Палуба G" },
    exits: ["b_deck_corridor"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "thirdclass_berths",
  },
];

export const locationsById = Object.fromEntries(allLocations.map((l) => [l.id, l]));
