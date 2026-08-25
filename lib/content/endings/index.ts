import type { EndingDefinition } from "@/lib/content/types";

export const allEndings: EndingDefinition[] = [
  {
    id: "ending_drowned",
    name: { en: "Lost to the Sea", ru: "Поглощён морем" },
    category: "negative",
    priority: 100,
    conditions: [
      { type: "shipStateAtLeast", key: "flooding", value: 80 },
      { type: "not", condition: { type: "locationIs", id: "boat_deck" } },
    ],
    epilogueText: {
      en: "The water finds you before you find a way out. The Titanic's lights flicker, then go dark.",
      ru: "Вода настигает вас раньше, чем вы находите путь наружу. Огни «Титаника» мерцают — и гаснут.",
    },
  },
  {
    id: "ending_survived_helped",
    name: { en: "Not Alone", ru: "Не в одиночестве" },
    category: "positive",
    priority: 90,
    conditions: [
      { type: "flag", key: "collision_happened", equals: true },
      { type: "locationIs", id: "boat_deck" },
      { type: "shipStateAtLeast", key: "flooding", value: 40 },
      { type: "rescuedAtLeast", count: 1 },
    ],
    epilogueText: {
      en: "You watch the great ship's final moments from the safety of a lifeboat, the Ashfords huddled together beside you. You did not save the Titanic — but you saved who you could.",
      ru: "Вы наблюдаете за последними минутами великого корабля из безопасности шлюпки, а рядом жмутся друг к другу супруги Эшфорд. Вы не спасли «Титаник» — но спасли тех, кого смогли.",
    },
  },
  {
    id: "ending_survived_alone",
    name: { en: "Every Man for Himself", ru: "Каждый сам за себя" },
    category: "neutral",
    priority: 80,
    conditions: [
      { type: "flag", key: "collision_happened", equals: true },
      { type: "locationIs", id: "boat_deck" },
      { type: "shipStateAtLeast", key: "flooding", value: 40 },
    ],
    epilogueText: {
      en: "A lifeboat is lowered with you in it. You survive the night, but the faces of those you left behind will stay with you.",
      ru: "Шлюпку с вами на борту спускают на воду. Вы переживёте эту ночь, но лица тех, кого вы оставили, будут преследовать вас ещё долго.",
    },
  },
];

export const endingsById = Object.fromEntries(allEndings.map((e) => [e.id, e]));
