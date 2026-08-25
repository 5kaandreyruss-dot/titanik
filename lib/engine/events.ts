import type { GameRunState, EngineEffect } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { evaluateAll } from "@/lib/engine/conditions";
import { applyConsequence } from "@/lib/engine/consequences";

/**
 * Scans all event definitions and applies the ones whose trigger conditions
 * are currently satisfied. One-shot events fire once (tracked in
 * eventsCompleted); repeatable events fire on every action tick where their
 * conditions hold (used for ongoing effects like rising floodwater).
 */
export function processEvents(
  content: ContentRegistry,
  state: GameRunState,
  effects: EngineEffect[],
): void {
  for (const event of content.events) {
    if (event.oneShot && state.eventsCompleted.includes(event.id)) continue;
    if (!evaluateAll(event.trigger, state)) continue;

    for (const consequence of event.consequences) {
      applyConsequence(content, state, consequence, effects);
    }
    effects.push({ kind: "log", text: event.logText });
    state.log.push({ time: state.time.minutesSinceStart, text: event.logText });

    if (event.oneShot) {
      state.eventsCompleted.push(event.id);
    }
  }
}
