import type { CharacterStats, StatKey } from "@/lib/engine/types";
import type { SeededRng } from "@/lib/engine/rng";

/**
 * Resolves a stat-gated skill check. Difficulty and stats are on a 1-10 scale.
 * Success probability rises with (stat - difficulty) and gets a small luck nudge,
 * clamped so no check is ever guaranteed or impossible — avoids "arbitrary random
 * death" while still leaving genuine risk (spec #7, #51).
 */
export function resolveSkillCheck(
  stats: CharacterStats,
  stat: StatKey,
  difficulty: number,
  rng: SeededRng,
): { success: boolean; roll: number; probability: number } {
  const statValue = stats[stat] ?? 5;
  const luckBonus = ((stats.luck ?? 5) - 5) * 0.02;
  const probability = clamp(0.5 + (statValue - difficulty) * 0.08 + luckBonus, 0.05, 0.95);
  const roll = rng.next();
  return { success: roll < probability, roll, probability };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
