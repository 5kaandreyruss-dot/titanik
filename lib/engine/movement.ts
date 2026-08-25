import type { GameRunState, EngineEffect } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { evaluateAll } from "@/lib/engine/conditions";

const MOVE_TIME_MINUTES = 5;

export function attemptMove(
  content: ContentRegistry,
  state: GameRunState,
  targetLocationId: string,
  effects: EngineEffect[],
): void {
  const currentLoc = content.locationsById[state.currentLocationId];
  const targetDef = content.locationsById[targetLocationId];

  if (!targetDef) {
    effects.push({ kind: "error", text: "That place doesn't exist." });
    return;
  }
  if (!currentLoc?.exits.includes(targetLocationId)) {
    effects.push({ kind: "error", text: "You can't get there directly from here." });
    return;
  }

  const runtimeLoc = state.locations[targetLocationId];

  if (targetDef.restrictedToClasses && !targetDef.restrictedToClasses.includes(state.socialClass)) {
    effects.push({ kind: "error", text: "This area is restricted — you don't belong here." });
    return;
  }

  if (runtimeLoc.locked) {
    const canUnlock = evaluateAll(targetDef.requiredToUnlock, state);
    if (!canUnlock) {
      effects.push({ kind: "error", text: "The way is locked or blocked." });
      return;
    }
    runtimeLoc.locked = false;
    effects.push({ kind: "location", text: `You find a way past the obstacle into ${targetDef.name}.` });
  }

  state.currentLocationId = targetLocationId;
  state.time.minutesSinceStart += MOVE_TIME_MINUTES;

  if (!runtimeLoc.discovered) {
    runtimeLoc.discovered = true;
    effects.push({ kind: "location", text: `Discovered: ${targetDef.name}` });
  }

  effects.push({ kind: "log", text: `You make your way to ${targetDef.name}.` });
}
