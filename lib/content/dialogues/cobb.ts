import type { DialogueTree } from "@/lib/content/types";

export const cobb: DialogueTree = {
  npcId: "cobb",
  entryNodeId: "greet",
  nodes: {
    greet: {
      id: "greet",
      npcText: {
        en: "Cobb eyes you up and down. \"Looking for something? Or just lost?\"",
        ru: "Кобб окидывает вас взглядом с ног до головы. «Ищете что-то? Или просто заблудились?»",
      },
      choices: [
        {
          id: "smalltalk",
          text: { en: "Just looking around.", ru: "Просто осматриваюсь." },
          npcReply: { en: "\"Suit yourself.\"", ru: "«Как скажете»." },
        },
        {
          id: "trade_watch",
          text: {
            en: "I'll trade you my pocket watch for that lockpick set.",
            ru: "Обменяю свои карманные часы на этот набор отмычек.",
          },
          conditions: [
            { type: "hasItem", id: "pocket_watch" },
            { type: "not", condition: { type: "hasItem", id: "lockpick_set" } },
          ],
          consequences: [
            { type: "removeItem", id: "pocket_watch" },
            { type: "addItem", id: "lockpick_set" },
            { type: "changeRelationship", npcId: "cobb", dimension: "trust", delta: 5 },
          ],
          npcReply: { en: "He turns the watch over, satisfied. \"Pleasure doing business.\"", ru: "Он удовлетворённо крутит часы в руках. «Приятно иметь с вами дело»." },
        },
        {
          id: "pickpocket",
          text: { en: "Try to lift something off him without being noticed.", ru: "Попробовать незаметно что-нибудь у него стащить." },
          conditions: [{ type: "not", condition: { type: "hasItem", id: "lockpick_set" } }],
          hint: { en: "He keeps a close eye on his belongings.", ru: "Он внимательно следит за своими вещами." },
          skillCheck: { stat: "stealth", difficulty: 7 },
          successConsequences: [
            { type: "addItem", id: "lockpick_set" },
            { type: "changeRelationship", npcId: "cobb", dimension: "suspicion", delta: 10 },
          ],
          failConsequences: [
            { type: "changeRelationship", npcId: "cobb", dimension: "trust", delta: -15 },
            { type: "changeRelationship", npcId: "cobb", dimension: "suspicion", delta: 25 },
          ],
          successNpcReply: {
            en: "You slip away with the lockpick set before he notices a thing.",
            ru: "Вы незаметно исчезаете с набором отмычек, прежде чем он что-либо замечает.",
          },
          failNpcReply: {
            en: "He grabs your wrist. \"Try that again and you'll regret it.\"",
            ru: "Он хватает вас за запястье. «Попробуй ещё раз — пожалеешь».",
          },
        },
      ],
    },
  },
};
