import type { GameRunState, EngineEffect } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { engineMessages } from "@/lib/engine/messages";

const SEARCH_TIME_MINUTES = 5;

export function takeItem(
  content: ContentRegistry,
  state: GameRunState,
  itemId: string,
  effects: EngineEffect[],
): void {
  const loc = state.locations[state.currentLocationId];
  if (!loc.itemsPresent.includes(itemId)) {
    effects.push({ kind: "error", text: engineMessages.itemNotHere() });
    return;
  }
  loc.itemsPresent = loc.itemsPresent.filter((i) => i !== itemId);
  const existing = state.inventory.find((i) => i.itemId === itemId);
  if (existing) existing.quantity += 1;
  else state.inventory.push({ itemId, quantity: 1 });

  state.time.minutesSinceStart += SEARCH_TIME_MINUTES;
  const def = content.itemsById[itemId];
  effects.push({ kind: "item", text: engineMessages.youTake(def.name) });
}

export function giveItem(
  content: ContentRegistry,
  state: GameRunState,
  itemId: string,
  npcId: string,
  effects: EngineEffect[],
): void {
  const existing = state.inventory.find((i) => i.itemId === itemId);
  if (!existing || existing.quantity <= 0) {
    effects.push({ kind: "error", text: engineMessages.dontHaveItem() });
    return;
  }
  const npc = state.npcs[npcId];
  if (!npc || npc.locationId !== state.currentLocationId) {
    effects.push({ kind: "error", text: engineMessages.theyArentHere() });
    return;
  }
  existing.quantity -= 1;
  if (existing.quantity <= 0) {
    state.inventory = state.inventory.filter((i) => i.itemId !== itemId);
  }
  const rel = state.relationships[npcId];
  if (rel) rel.trust = Math.min(100, rel.trust + 2);
  const itemDef = content.itemsById[itemId];
  const npcDef = content.npcsById[npcId];
  effects.push({ kind: "item", text: engineMessages.youGiveTo(itemDef.name, npcDef.name) });
}
