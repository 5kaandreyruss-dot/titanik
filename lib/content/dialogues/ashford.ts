import type { DialogueTree } from "@/lib/content/types";

export const ashford: DialogueTree = {
  npcId: "ashford",
  entryNodeId: "greet",
  entryCandidates: [
    {
      nodeId: "found_him",
      conditions: [{ type: "flag", key: "found_ashford_husband", equals: true }],
    },
  ],
  nodes: {
    greet: {
      id: "greet",
      npcText: {
        en: "\"Oh, thank heavens, someone! Have you seen my husband? He went to the dining saloon over an hour ago and hasn't come back.\"",
        ru: "«О, слава богу, хоть кто-то! Вы не видели моего мужа? Он ушёл в обеденный салон больше часа назад и до сих пор не вернулся».",
      },
      choices: [
        {
          id: "help",
          text: { en: "I'll go look for him.", ru: "Я пойду поищу его." },
          conditions: [{ type: "not", condition: { type: "flag", key: "agreed_help_ashford", equals: true } }],
          consequences: [
            { type: "setFlag", key: "agreed_help_ashford", value: true },
            { type: "changeRelationship", npcId: "ashford", dimension: "trust", delta: 5 },
          ],
          npcReply: {
            en: "\"Would you? Thank you, truly. He'll be in the dining saloon, I'm sure of it.\"",
            ru: "«Правда? Спасибо вам, от всей души. Он наверняка в обеденном салоне».",
          },
        },
        {
          id: "dismiss",
          text: { en: "I'm sure he's fine. People get delayed.", ru: "Уверен, с ним всё в порядке. Люди иногда задерживаются." },
          consequences: [{ type: "changeRelationship", npcId: "ashford", dimension: "trust", delta: -3 }],
          npcReply: { en: "She wrings her hands, unconvinced.", ru: "Она нервно сжимает руки, явно не убеждённая." },
        },
        {
          id: "refuse",
          text: { en: "I can't help you right now.", ru: "Я сейчас не могу вам помочь." },
          npcReply: { en: "\"Oh... of course. I understand.\"", ru: "«Ах... ну конечно. Я понимаю»." },
        },
      ],
    },
    found_him: {
      id: "found_him",
      npcText: { en: "She looks up hopefully. \"Any word?\"", ru: "Она с надеждой поднимает взгляд. «Есть новости?»" },
      choices: [
        {
          id: "tell_found",
          text: { en: "I found him safe in the dining saloon.", ru: "Я нашёл его целым и невредимым в обеденном салоне." },
          conditions: [{ type: "not", condition: { type: "flag", key: "ashford_rescued_husband", equals: true } }],
          consequences: [
            { type: "changeRelationship", npcId: "ashford", dimension: "trust", delta: 15 },
            { type: "changeRelationship", npcId: "ashford", dimension: "loyalty", delta: 10 },
            { type: "setFlag", key: "ashford_rescued_husband", value: true },
            { type: "addKnowledge", id: "ashford_reunited" },
          ],
          npcReply: {
            en: "Her eyes fill with tears of relief. \"Thank you. I won't forget this.\"",
            ru: "Её глаза наполняются слезами облегчения. «Спасибо. Я этого не забуду».",
          },
        },
      ],
    },
  },
};
