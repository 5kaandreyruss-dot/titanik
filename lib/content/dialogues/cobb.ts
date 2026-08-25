import type { DialogueTree } from "@/lib/content/types";

export const cobb: DialogueTree = {
  npcId: "cobb",
  entryNodeId: "greet",
  nodes: {
    greet: {
      id: "greet",
      npcText: "Cobb eyes you up and down. \"Looking for something? Or just lost?\"",
      choices: [
        {
          id: "smalltalk",
          text: "Just looking around.",
          npcReply: "\"Suit yourself.\"",
        },
        {
          id: "trade_watch",
          text: "I'll trade you my pocket watch for that lockpick set.",
          conditions: [
            { type: "hasItem", id: "pocket_watch" },
            { type: "not", condition: { type: "hasItem", id: "lockpick_set" } },
          ],
          consequences: [
            { type: "removeItem", id: "pocket_watch" },
            { type: "addItem", id: "lockpick_set" },
            { type: "changeRelationship", npcId: "cobb", dimension: "trust", delta: 5 },
          ],
          npcReply: "He turns the watch over, satisfied. \"Pleasure doing business.\"",
        },
        {
          id: "pickpocket",
          text: "Try to lift something off him without being noticed.",
          conditions: [{ type: "not", condition: { type: "hasItem", id: "lockpick_set" } }],
          hint: "He keeps a close eye on his belongings.",
          skillCheck: { stat: "stealth", difficulty: 7 },
          successConsequences: [
            { type: "addItem", id: "lockpick_set" },
            { type: "changeRelationship", npcId: "cobb", dimension: "suspicion", delta: 10 },
          ],
          failConsequences: [
            { type: "changeRelationship", npcId: "cobb", dimension: "trust", delta: -15 },
            { type: "changeRelationship", npcId: "cobb", dimension: "suspicion", delta: 25 },
          ],
          successNpcReply: "You slip away with the lockpick set before he notices a thing.",
          failNpcReply: "He grabs your wrist. \"Try that again and you'll regret it.\"",
        },
      ],
    },
  },
};
