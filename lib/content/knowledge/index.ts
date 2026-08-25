import type { KnowledgeDefinition } from "@/lib/content/types";

export const allKnowledge: KnowledgeDefinition[] = [
  {
    id: "iceberg_warning",
    category: "Secrets",
    title: { en: "A Fatal Design Flaw", ru: "Роковой изъян в конструкции" },
    text: {
      en: "Halloway believes the watertight bulkheads do not extend high enough — if enough compartments flood, the ship could go down far faster than anyone expects.",
      ru: "Хэллоуэй считает, что водонепроницаемые переборки недостаточно высоки — если затопит достаточно отсеков, корабль может пойти ко дну гораздо быстрее, чем кто-либо ожидает.",
    },
  },
  {
    id: "warning_given",
    category: "Events",
    title: { en: "The Bridge Was Warned", ru: "Мостик был предупреждён" },
    text: {
      en: "You convinced Officer Reilly to carry your warning to the bridge before the collision.",
      ru: "Вам удалось убедить офицера Рейли передать ваше предупреждение на мостик ещё до столкновения.",
    },
  },
  {
    id: "ashford_husband_found",
    category: "People",
    title: { en: "Mr. Ashford, Found", ru: "Мистер Эшфорд найден" },
    text: {
      en: "You found Mr. Ashford safe in the first-class dining saloon.",
      ru: "Вы нашли мистера Эшфорда целым и невредимым в обеденном салоне первого класса.",
    },
  },
  {
    id: "ashford_reunited",
    category: "People",
    title: { en: "The Ashfords, Reunited", ru: "Супруги Эшфорд снова вместе" },
    text: {
      en: "You told Mrs. Ashford her husband was safe. She will not forget it.",
      ru: "Вы сообщили миссис Эшфорд, что её муж в безопасности. Она этого не забудет.",
    },
  },
  {
    id: "ashford_safe",
    category: "Events",
    title: { en: "A Family Saved", ru: "Семья спасена" },
    text: {
      en: "You helped the Ashfords board a lifeboat together.",
      ru: "Вы помогли супругам Эшфорд вместе сесть в спасательную шлюпку.",
    },
  },
];

export const knowledgeById = Object.fromEntries(allKnowledge.map((k) => [k.id, k]));
