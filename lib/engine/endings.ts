import type { GameRunState } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { evaluateAll } from "@/lib/engine/conditions";

/**
 * Checks all ending definitions; the highest-priority match wins. Returns the
 * matched ending id, or null if the run should continue.
 */
export function checkEndings(content: ContentRegistry, state: GameRunState): string | null {
  if (state.ending) return state.ending;

  const candidates = content.endings
    .filter((e) => evaluateAll(e.conditions, state))
    .sort((a, b) => b.priority - a.priority);

  return candidates[0]?.id ?? null;
}
