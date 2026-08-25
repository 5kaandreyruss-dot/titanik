import type { GameRunState } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";

/**
 * NPCs with a schedule move around the ship over time (spec #8: "NPCs can
 * move around the ship"). Applied every action tick after time advances.
 * Explicit `moveNpc` consequences from dialogues/events always run after
 * this and take precedence for that tick.
 */
export function applyNpcSchedules(content: ContentRegistry, state: GameRunState): void {
  for (const npcDef of content.npcs) {
    if (npcDef.schedule.length === 0) continue;
    const npcState = state.npcs[npcDef.id];
    if (!npcState?.alive) continue;

    let current = npcDef.schedule[0];
    for (const entry of npcDef.schedule) {
      if (entry.afterMinutes <= state.time.minutesSinceStart) {
        current = entry;
      }
    }
    npcState.locationId = current.locationId;
  }
}
