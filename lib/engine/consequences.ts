import type { Consequence, GameRunState, EngineEffect } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { engineMessages } from "@/lib/engine/messages";

export function applyConsequence(
  content: ContentRegistry,
  state: GameRunState,
  consequence: Consequence,
  effects: EngineEffect[],
): void {
  switch (consequence.type) {
    case "addKnowledge": {
      if (!state.knowledge.includes(consequence.id)) {
        state.knowledge.push(consequence.id);
        const def = content.knowledgeById[consequence.id];
        effects.push({ kind: "knowledge", text: engineMessages.newKnowledge(def.title) });
      }
      break;
    }
    case "changeRelationship": {
      const rel = state.relationships[consequence.npcId];
      if (rel) {
        rel[consequence.dimension] = clamp(rel[consequence.dimension] + consequence.delta, 0, 100);
      }
      break;
    }
    case "moveNpc": {
      const npc = state.npcs[consequence.npcId];
      if (npc) npc.locationId = consequence.locationId;
      break;
    }
    case "unlockLocation": {
      const loc = state.locations[consequence.id];
      if (loc) {
        loc.locked = false;
        effects.push({ kind: "location", text: engineMessages.locationUnlocked(content.locationsById[consequence.id].name) });
      }
      break;
    }
    case "lockLocation": {
      const loc = state.locations[consequence.id];
      if (loc) loc.locked = true;
      break;
    }
    case "addItem": {
      const qty = consequence.quantity ?? 1;
      const existing = state.inventory.find((i) => i.itemId === consequence.id);
      if (existing) existing.quantity += qty;
      else state.inventory.push({ itemId: consequence.id, quantity: qty });
      const def = content.itemsById[consequence.id];
      effects.push({ kind: "item", text: engineMessages.itemObtained(def.name) });
      break;
    }
    case "removeItem": {
      const qty = consequence.quantity ?? 1;
      const existing = state.inventory.find((i) => i.itemId === consequence.id);
      if (existing) {
        existing.quantity -= qty;
        if (existing.quantity <= 0) {
          state.inventory = state.inventory.filter((i) => i.itemId !== consequence.id);
        }
      }
      break;
    }
    case "setFlag": {
      state.flags[consequence.key] = consequence.value;
      break;
    }
    case "changeShipState": {
      state.ship[consequence.key] = clamp(state.ship[consequence.key] + consequence.delta, 0, 100);
      break;
    }
    case "triggerEvent": {
      if (!state.eventsActive.includes(consequence.id)) {
        state.eventsActive.push(consequence.id);
      }
      break;
    }
    case "advanceTime": {
      state.time.minutesSinceStart += consequence.minutes;
      break;
    }
    case "killNpc": {
      const npc = state.npcs[consequence.id];
      if (npc) npc.alive = false;
      if (!state.deadPeople.includes(consequence.id)) state.deadPeople.push(consequence.id);
      break;
    }
    case "rescuePerson": {
      if (!state.rescuedPeople.includes(consequence.id)) {
        state.rescuedPeople.push(consequence.id);
        effects.push({ kind: "log", text: engineMessages.rescued(content.npcsById[consequence.id].name) });
      }
      break;
    }
    case "endRun": {
      state.ending = consequence.endingId;
      break;
    }
    default:
      break;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
