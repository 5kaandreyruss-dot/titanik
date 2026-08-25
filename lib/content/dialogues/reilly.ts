import type { DialogueTree } from "@/lib/content/types";

export const reilly: DialogueTree = {
  npcId: "reilly",
  entryNodeId: "greet",
  nodes: {
    greet: {
      id: "greet",
      npcText: "Officer Reilly nods stiffly. \"Evening. Can I help you?\"",
      choices: [
        {
          id: "smalltalk",
          text: "Just making conversation.",
          consequences: [{ type: "changeRelationship", npcId: "reilly", dimension: "respect", delta: 2 }],
          npcReply: "\"Mm. Carry on, then.\"",
        },
        {
          id: "request_access",
          text: "Requesting access to the bridge wing.",
          conditions: [{ type: "not", condition: { type: "flag", key: "reilly_authorized", equals: true } }],
          skillCheck: { stat: "authority", difficulty: 6 },
          successConsequences: [
            { type: "setFlag", key: "reilly_authorized", value: true },
            { type: "unlockLocation", id: "bridge_wing" },
            { type: "changeRelationship", npcId: "reilly", dimension: "respect", delta: 5 },
          ],
          failConsequences: [{ type: "changeRelationship", npcId: "reilly", dimension: "suspicion", delta: 5 }],
          successNpcReply: "\"Very well. Don't cause trouble up there.\"",
          failNpcReply: "\"Not without proper reason. That area is restricted.\"",
          hint: "He looks like he takes rules seriously.",
        },
        {
          id: "warn_bridge",
          text: "I need to warn the bridge — something is wrong with this ship.",
          conditions: [
            { type: "hasKnowledge", id: "iceberg_warning" },
            { type: "not", condition: { type: "flag", key: "warned_bridge", equals: true } },
          ],
          consequences: [
            { type: "setFlag", key: "warned_bridge", value: true },
            { type: "changeShipState", key: "panic", delta: 5 },
            { type: "addKnowledge", id: "warning_given" },
          ],
          npcReply:
            "Reilly's face pales as you explain. \"I'll relay this at once.\" He hurries off toward the bridge.",
        },
      ],
    },
  },
};
