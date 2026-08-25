import type { GameRunState, EngineEffect } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import type { DialogueChoice, DialogueNode } from "@/lib/content/types";
import { evaluateAll } from "@/lib/engine/conditions";
import { applyConsequence } from "@/lib/engine/consequences";
import { resolveSkillCheck } from "@/lib/engine/skillCheck";
import { SeededRng } from "@/lib/engine/rng";

const DIALOGUE_CHOICE_TIME_MINUTES = 3;

function resolveEntryNodeId(content: ContentRegistry, npcId: string, state: GameRunState): string {
  const tree = content.dialoguesByNpcId[npcId];
  for (const candidate of tree.entryCandidates ?? []) {
    if (evaluateAll(candidate.conditions, state)) return candidate.nodeId;
  }
  return tree.entryNodeId;
}

export function startDialogue(
  content: ContentRegistry,
  state: GameRunState,
  npcId: string,
  effects: EngineEffect[],
): void {
  const npc = state.npcs[npcId];
  const tree = content.dialoguesByNpcId[npcId];
  if (!npc || !npc.alive) {
    effects.push({ kind: "error", text: "They aren't here." });
    return;
  }
  if (npc.locationId !== state.currentLocationId) {
    effects.push({ kind: "error", text: "They aren't here." });
    return;
  }
  if (!tree) {
    effects.push({ kind: "error", text: "They have nothing to say." });
    return;
  }
  const nodeId = resolveEntryNodeId(content, npcId, state);
  state.activeDialogue = { npcId, nodeId };
}

export function getVisibleNode(
  content: ContentRegistry,
  state: GameRunState,
): { node: DialogueNode; choices: DialogueChoice[] } | null {
  if (!state.activeDialogue) return null;
  const tree = content.dialoguesByNpcId[state.activeDialogue.npcId];
  const node = tree?.nodes[state.activeDialogue.nodeId];
  if (!node) return null;
  const choices = node.choices.filter((c) => evaluateAll(c.conditions, state));
  return { node, choices };
}

export function chooseDialogueOption(
  content: ContentRegistry,
  state: GameRunState,
  npcId: string,
  choiceId: string,
  seed: string,
  effects: EngineEffect[],
): void {
  if (!state.activeDialogue || state.activeDialogue.npcId !== npcId) {
    effects.push({ kind: "error", text: "No conversation is active." });
    return;
  }
  const tree = content.dialoguesByNpcId[npcId];
  const node = tree.nodes[state.activeDialogue.nodeId];
  const choice = node.choices.find((c) => c.id === choiceId && evaluateAll(c.conditions, state));
  if (!choice) {
    effects.push({ kind: "error", text: "That's not something you can say right now." });
    return;
  }

  state.time.minutesSinceStart += DIALOGUE_CHOICE_TIME_MINUTES;

  for (const consequence of choice.consequences ?? []) {
    applyConsequence(content, state, consequence, effects);
  }

  if (choice.skillCheck) {
    const rng = new SeededRng(seed, state.rngCounter++);
    const { success } = resolveSkillCheck(state.stats, choice.skillCheck.stat, choice.skillCheck.difficulty, rng);
    const outcomeConsequences = success ? choice.successConsequences : choice.failConsequences;
    const reply = success ? choice.successNpcReply : choice.failNpcReply;
    for (const consequence of outcomeConsequences ?? []) {
      applyConsequence(content, state, consequence, effects);
    }
    if (reply) effects.push({ kind: "log", text: reply });
  } else if (choice.npcReply) {
    effects.push({ kind: "log", text: choice.npcReply });
  }

  if (choice.nextNodeId) {
    state.activeDialogue = { npcId, nodeId: choice.nextNodeId };
  } else {
    state.activeDialogue = null;
  }
}
