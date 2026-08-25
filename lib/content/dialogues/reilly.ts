import type { DialogueTree } from "@/lib/content/types";

export const reilly: DialogueTree = {
  npcId: "reilly",
  entryNodeId: "greet",
  nodes: {
    greet: {
      id: "greet",
      npcText: {
        en: "Officer Reilly nods stiffly. \"Evening. Can I help you?\"",
        ru: "Офицер Рейли сдержанно кивает. «Добрый вечер. Чем могу помочь?»",
      },
      choices: [
        {
          id: "smalltalk",
          text: { en: "Just making conversation.", ru: "Просто хотел поговорить." },
          consequences: [{ type: "changeRelationship", npcId: "reilly", dimension: "respect", delta: 2 }],
          npcReply: { en: "\"Mm. Carry on, then.\"", ru: "«Хм. Что ж, продолжайте»." },
        },
        {
          id: "request_access",
          text: { en: "Requesting access to the bridge wing.", ru: "Прошу разрешения пройти на крыло мостика." },
          conditions: [{ type: "not", condition: { type: "flag", key: "reilly_authorized", equals: true } }],
          skillCheck: { stat: "authority", difficulty: 6 },
          successConsequences: [
            { type: "setFlag", key: "reilly_authorized", value: true },
            { type: "unlockLocation", id: "bridge_wing" },
            { type: "changeRelationship", npcId: "reilly", dimension: "respect", delta: 5 },
          ],
          failConsequences: [{ type: "changeRelationship", npcId: "reilly", dimension: "suspicion", delta: 5 }],
          successNpcReply: { en: "\"Very well. Don't cause trouble up there.\"", ru: "«Хорошо. Только не устраивайте там проблем»." },
          failNpcReply: {
            en: "\"Not without proper reason. That area is restricted.\"",
            ru: "«Без веской причины — нет. Эта зона закрыта».",
          },
          hint: { en: "He looks like he takes rules seriously.", ru: "Похоже, он серьёзно относится к правилам." },
        },
        {
          id: "warn_bridge",
          text: {
            en: "I need to warn the bridge — something is wrong with this ship.",
            ru: "Мне нужно предупредить мостик — с кораблём что-то не так.",
          },
          conditions: [
            { type: "hasKnowledge", id: "iceberg_warning" },
            { type: "not", condition: { type: "flag", key: "warned_bridge", equals: true } },
          ],
          consequences: [
            { type: "setFlag", key: "warned_bridge", value: true },
            { type: "changeShipState", key: "panic", delta: 5 },
            { type: "addKnowledge", id: "warning_given" },
          ],
          npcReply: {
            en: "Reilly's face pales as you explain. \"I'll relay this at once.\" He hurries off toward the bridge.",
            ru: "Пока вы объясняете, лицо Рейли бледнеет. «Я немедленно доложу об этом». Он спешит к мостику.",
          },
        },
      ],
    },
  },
};
