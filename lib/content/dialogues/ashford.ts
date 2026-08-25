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
      npcText:
        "\"Oh, thank heavens, someone! Have you seen my husband? He went to the dining saloon over an hour ago and hasn't come back.\"",
      choices: [
        {
          id: "help",
          text: "I'll go look for him.",
          conditions: [{ type: "not", condition: { type: "flag", key: "agreed_help_ashford", equals: true } }],
          consequences: [
            { type: "setFlag", key: "agreed_help_ashford", value: true },
            { type: "changeRelationship", npcId: "ashford", dimension: "trust", delta: 5 },
          ],
          npcReply: "\"Would you? Thank you, truly. He'll be in the dining saloon, I'm sure of it.\"",
        },
        {
          id: "dismiss",
          text: "I'm sure he's fine. People get delayed.",
          consequences: [{ type: "changeRelationship", npcId: "ashford", dimension: "trust", delta: -3 }],
          npcReply: "She wrings her hands, unconvinced.",
        },
        {
          id: "refuse",
          text: "I can't help you right now.",
          npcReply: "\"Oh... of course. I understand.\"",
        },
      ],
    },
    found_him: {
      id: "found_him",
      npcText: "She looks up hopefully. \"Any word?\"",
      choices: [
        {
          id: "tell_found",
          text: "I found him safe in the dining saloon.",
          conditions: [{ type: "not", condition: { type: "flag", key: "ashford_rescued_husband", equals: true } }],
          consequences: [
            { type: "changeRelationship", npcId: "ashford", dimension: "trust", delta: 15 },
            { type: "changeRelationship", npcId: "ashford", dimension: "loyalty", delta: 10 },
            { type: "setFlag", key: "ashford_rescued_husband", value: true },
            { type: "addKnowledge", id: "ashford_reunited" },
          ],
          npcReply: "Her eyes fill with tears of relief. \"Thank you. I won't forget this.\"",
        },
      ],
    },
  },
};
