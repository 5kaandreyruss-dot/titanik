import type { DialogueTree } from "@/lib/content/types";

export const halloway: DialogueTree = {
  npcId: "halloway",
  entryNodeId: "greet",
  entryCandidates: [
    {
      nodeId: "reveal_ready",
      conditions: [
        { type: "locationIs", id: "bridge_wing" },
        { type: "relationshipAtLeast", npcId: "halloway", dimension: "trust", value: 40 },
        { type: "not", condition: { type: "hasKnowledge", id: "iceberg_warning" } },
      ],
    },
  ],
  nodes: {
    greet: {
      id: "greet",
      npcText: {
        en: "Halloway barely looks up from a roll of blueprints. \"Can't this wait? I have work to do.\"",
        ru: "Хэллоуэй едва отрывает взгляд от рулона чертежей. «Это не может подождать? У меня работа».",
      },
      choices: [
        {
          id: "smalltalk",
          text: { en: "Just checking in on the engines.", ru: "Просто интересуюсь, как дела с двигателями." },
          consequences: [{ type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: 2 }],
          npcReply: {
            en: "\"They're running fine. For now.\" He returns to his notes.",
            ru: "«Работают нормально. Пока что». Он снова утыкается в свои записи.",
          },
        },
        {
          id: "reassure",
          text: { en: "I won't repeat anything you tell me. You can trust me.", ru: "Я никому не передам ваши слова. Мне можно доверять." },
          conditions: [{ type: "not", condition: { type: "flag", key: "halloway_reassured", equals: true } }],
          consequences: [
            { type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: 8 },
            { type: "setFlag", key: "halloway_reassured", value: true },
          ],
          npcReply: {
            en: "He studies you for a moment, then gives a small, uncertain nod.",
            ru: "Он несколько секунд изучающе смотрит на вас, затем неуверенно кивает.",
          },
        },
        {
          id: "rude",
          text: { en: "None of your business, then.", ru: "Тогда не моё дело." },
          consequences: [{ type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: -5 }],
          npcReply: { en: "\"Suit yourself,\" he mutters, turning away.", ru: "«Как хотите», — бормочет он, отворачиваясь." },
        },
        {
          id: "press",
          text: { en: "What are you hiding?", ru: "Что вы скрываете?" },
          conditions: [
            { type: "not", condition: { type: "relationshipAtLeast", npcId: "halloway", dimension: "trust", value: 40 } },
          ],
          consequences: [{ type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: -2 }],
          npcReply: {
            en: "\"Nothing you need concern yourself with. Now, if you'll excuse me.\"",
            ru: "«Вас это не касается. А теперь прошу меня извинить».",
          },
        },
      ],
    },
    reveal_ready: {
      id: "reveal_ready",
      npcText: {
        en: "Halloway glances up and down the walkway, then leans in close. \"Since you ask... I don't think this ship can take a serious blow. Not the way they think.\"",
        ru: "Хэллоуэй оглядывает проход в обе стороны и наклоняется ближе. «Раз уж вы спрашиваете... Я не думаю, что этот корабль выдержит серьёзный удар. Не так, как они считают».",
      },
      choices: [
        {
          id: "ask_more",
          text: { en: "What do you mean? Tell me everything.", ru: "Что вы имеете в виду? Расскажите всё." },
          consequences: [
            { type: "addKnowledge", id: "iceberg_warning" },
            { type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: 5 },
          ],
          npcReply: {
            en: "\"The watertight bulkheads don't go high enough. If enough compartments flood, the bow will drag the rest of her down. I've told no one who would listen.\"",
            ru: "«Водонепроницаемые переборки недостаточно высоки. Если затопит достаточно отсеков, нос потянет за собой всё остальное. Я говорил об этом, но меня никто не слушал».",
          },
        },
      ],
    },
  },
};
