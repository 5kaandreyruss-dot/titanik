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
      npcText:
        "Halloway barely looks up from a roll of blueprints. \"Can't this wait? I have work to do.\"",
      choices: [
        {
          id: "smalltalk",
          text: "Just checking in on the engines.",
          consequences: [{ type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: 2 }],
          npcReply: "\"They're running fine. For now.\" He returns to his notes.",
        },
        {
          id: "reassure",
          text: "I won't repeat anything you tell me. You can trust me.",
          conditions: [{ type: "not", condition: { type: "flag", key: "halloway_reassured", equals: true } }],
          consequences: [
            { type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: 8 },
            { type: "setFlag", key: "halloway_reassured", value: true },
          ],
          npcReply: "He studies you for a moment, then gives a small, uncertain nod.",
        },
        {
          id: "rude",
          text: "None of your business, then.",
          consequences: [{ type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: -5 }],
          npcReply: "\"Suit yourself,\" he mutters, turning away.",
        },
        {
          id: "press",
          text: "What are you hiding?",
          conditions: [
            { type: "not", condition: { type: "relationshipAtLeast", npcId: "halloway", dimension: "trust", value: 40 } },
          ],
          consequences: [{ type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: -2 }],
          npcReply: "\"Nothing you need concern yourself with. Now, if you'll excuse me.\"",
        },
      ],
    },
    reveal_ready: {
      id: "reveal_ready",
      npcText:
        "Halloway glances up and down the walkway, then leans in close. \"Since you ask... I don't think this ship can take a serious blow. Not the way they think.\"",
      choices: [
        {
          id: "ask_more",
          text: "What do you mean? Tell me everything.",
          consequences: [
            { type: "addKnowledge", id: "iceberg_warning" },
            { type: "changeRelationship", npcId: "halloway", dimension: "trust", delta: 5 },
          ],
          npcReply:
            "\"The watertight bulkheads don't go high enough. If enough compartments flood, the bow will drag the rest of her down. I've told no one who would listen.\"",
        },
      ],
    },
  },
};
