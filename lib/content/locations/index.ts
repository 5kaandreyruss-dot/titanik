import type { LocationDefinition } from "@/lib/content/types";

export const allLocations: LocationDefinition[] = [
  {
    id: "boat_deck",
    name: "Boat Deck",
    description:
      "The topmost deck, lined with lifeboats swaying gently on their davits. The night air is bitterly cold and smells of the sea.",
    deck: "Boat Deck",
    exits: ["a_deck_promenade"],
    startsDiscovered: true,
    startsLocked: false,
    sceneBackground: "boat_deck_night",
    itemsPresent: ["lifebelt"],
  },
  {
    id: "a_deck_promenade",
    name: "A Deck Promenade",
    description:
      "A long enclosed promenade with tall windows facing the black ocean. A few passengers stroll in evening dress.",
    deck: "A Deck",
    exits: ["boat_deck", "b_deck_corridor", "bridge_wing"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "a_deck_promenade",
  },
  {
    id: "bridge_wing",
    name: "Bridge Wing",
    description:
      "A narrow, restricted walkway just outside the wheelhouse. Officers pace here, watching the dark horizon.",
    deck: "Bridge",
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
    name: "B Deck Corridor",
    description:
      "A quiet first-class corridor, carpeted and warm, lined with cabin doors bearing brass numbers.",
    deck: "B Deck",
    exits: ["a_deck_promenade", "first_class_dining", "c_deck_purser_office", "g_deck_thirdclass_berths"],
    startsDiscovered: true,
    startsLocked: false,
    sceneBackground: "b_deck_corridor",
  },
  {
    id: "first_class_dining",
    name: "First-Class Dining Saloon",
    description:
      "An opulent hall beneath a domed skylight. Waiters glide between white-clothed tables as a string quartet plays.",
    deck: "D Deck",
    exits: ["b_deck_corridor"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "dining_saloon",
  },
  {
    id: "c_deck_purser_office",
    name: "Purser's Office",
    description:
      "A small office where passengers deposit valuables. Ledgers and safes line the walls.",
    deck: "C Deck",
    exits: ["b_deck_corridor", "engine_room_access"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "purser_office",
  },
  {
    id: "engine_room_access",
    name: "Engine Room Access",
    description:
      "A steel stairwell descending into heat and noise. The rhythmic thud of massive engines echoes upward.",
    deck: "E Deck",
    exits: ["c_deck_purser_office", "boiler_room_6"],
    startsDiscovered: false,
    startsLocked: false,
    restrictedToClasses: ["crew"],
    sceneBackground: "engine_access",
  },
  {
    id: "boiler_room_6",
    name: "Boiler Room 6",
    description:
      "Rows of roaring furnaces, coal dust hanging in the air. Trimmers move like shadows between the boilers.",
    deck: "Tank Top",
    exits: ["engine_room_access"],
    startsDiscovered: false,
    startsLocked: false,
    restrictedToClasses: ["crew"],
    sceneBackground: "boiler_room",
    itemsPresent: ["flashlight"],
  },
  {
    id: "g_deck_thirdclass_berths",
    name: "G Deck Third-Class Berths",
    description:
      "Rows of simple bunks and shared tables. Families speak in a dozen languages amid the low hum of the ship.",
    deck: "G Deck",
    exits: ["b_deck_corridor"],
    startsDiscovered: false,
    startsLocked: false,
    sceneBackground: "thirdclass_berths",
  },
];

export const locationsById = Object.fromEntries(allLocations.map((l) => [l.id, l]));
