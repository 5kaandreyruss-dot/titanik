import type { GameRunState, EngineEffect } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { evaluateAll } from "@/lib/engine/conditions";
import { engineMessages } from "@/lib/engine/messages";

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
    effects.push({ kind: "error", text: engineMessages.placeDoesntExist() });
    return;
  }
  if (!currentLoc?.exits.includes(targetLocationId)) {
    effects.push({ kind: "error", text: engineMessages.cantGetThereDirectly() });
    return;
  }

  const runtimeLoc = state.locations[targetLocationId];

  if (targetDef.restrictedToClasses && !targetDef.restrictedToClasses.includes(state.socialClass)) {
    effects.push({ kind: "error", text: engineMessages.areaRestricted() });
    return;
  }

  if (runtimeLoc.locked) {
    const canUnlock = evaluateAll(targetDef.requiredToUnlock, state);
    if (!canUnlock) {
      effects.push({ kind: "error", text: engineMessages.wayLockedOrBlocked() });
      return;
    }
    runtimeLoc.locked = false;
    effects.push({ kind: "location", text: engineMessages.foundWayInto(targetDef.name) });
  }

  state.currentLocationId = targetLocationId;
  state.time.minutesSinceStart += MOVE_TIME_MINUTES;

  if (!runtimeLoc.discovered) {
    runtimeLoc.discovered = true;
    effects.push({ kind: "location", text: engineMessages.discovered(targetDef.name) });
  }

  effects.push({ kind: "log", text: engineMessages.movedTo(targetDef.name) });
}
