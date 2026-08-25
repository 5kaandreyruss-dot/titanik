import type { GameRunState, PlayerAction, EngineEffect, EngineResult } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { attemptMove } from "@/lib/engine/movement";
import { takeItem, giveItem } from "@/lib/engine/inventory";
import { startDialogue, chooseDialogueOption } from "@/lib/engine/dialogue";
import { processEvents } from "@/lib/engine/events";
import { checkEndings } from "@/lib/engine/endings";
import { applyNpcSchedules } from "@/lib/engine/npcSchedule";
import { engineMessages } from "@/lib/engine/messages";

const WAIT_MAX_MINUTES = 60;

export function applyAction(
  content: ContentRegistry,
  state: GameRunState,
  action: PlayerAction,
  seed: string,
): EngineResult {
  const effects: EngineEffect[] = [];

  if (state.ending) {
    effects.push({ kind: "error", text: engineMessages.runEnded() });
    return { state, effects };
  }

  switch (action.type) {
    case "MOVE":
      attemptMove(content, state, action.targetLocationId, effects);
      break;
    case "LOOK_AROUND": {
      const loc = content.locationsById[state.currentLocationId];
      effects.push({ kind: "log", text: loc?.description ?? engineMessages.nothingRemarkableHere() });
      break;
    }
    case "TALK_START":
      startDialogue(content, state, action.npcId, effects);
      break;
    case "DIALOGUE_CHOOSE":
      chooseDialogueOption(content, state, action.npcId, action.choiceId, seed, effects);
      break;
    case "INSPECT": {
      const itemDef = content.itemsById[action.targetId];
      const npcDef = content.npcsById[action.targetId];
      if (itemDef) {
        effects.push({ kind: "log", text: itemDef.description });
      } else if (npcDef) {
        effects.push({ kind: "log", text: engineMessages.npcInspect(npcDef.name, npcDef.profession) });
      } else {
        effects.push({ kind: "error", text: engineMessages.nothingMoreToSee() });
      }
      break;
    }
    case "TAKE_ITEM":
      takeItem(content, state, action.itemId, effects);
      break;
    case "USE_ITEM": {
      const has = state.inventory.find((i) => i.itemId === action.itemId && i.quantity > 0);
      if (!has) {
        effects.push({ kind: "error", text: engineMessages.dontHaveItem() });
        break;
      }
      const def = content.itemsById[action.itemId];
      effects.push({ kind: "log", text: engineMessages.youUse(def.name) });
      if (def?.consumable) {
        has.quantity -= 1;
        if (has.quantity <= 0) state.inventory = state.inventory.filter((i) => i.itemId !== action.itemId);
      }
      break;
    }
    case "GIVE_ITEM":
      giveItem(content, state, action.itemId, action.npcId, effects);
      break;
    case "WAIT": {
      const minutes = Math.max(1, Math.min(WAIT_MAX_MINUTES, action.minutes));
      state.time.minutesSinceStart += minutes;
      effects.push({ kind: "log", text: engineMessages.timePasses(minutes) });
      break;
    }
    default:
      effects.push({ kind: "error", text: engineMessages.unknownAction() });
  }

  applyNpcSchedules(content, state);
  processEvents(content, state, effects);

  const endingId = checkEndings(content, state);
  if (endingId && !state.ending) {
    state.ending = endingId;
    const ending = content.endingsById[endingId];
    if (ending) effects.push({ kind: "ending", text: ending.epilogueText });
  }

  return { state, effects };
}
