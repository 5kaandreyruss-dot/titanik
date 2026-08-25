import { describe, it, expect } from "vitest";
import { resolveSkillCheck } from "@/lib/engine/skillCheck";
import { SeededRng } from "@/lib/engine/rng";
import { ALL_STATS } from "@/lib/engine/types";
import type { CharacterStats } from "@/lib/engine/types";

function makeStats(overrides: Partial<CharacterStats> = {}): CharacterStats {
  const stats = {} as CharacterStats;
  for (const s of ALL_STATS) stats[s] = 5;
  return { ...stats, ...overrides };
}

describe("resolveSkillCheck", () => {
  it("never guarantees success or failure (probability stays within (0,1))", () => {
    const stats = makeStats({ stealth: 10 });
    const rng = new SeededRng("seed", 0);
    const { probability } = resolveSkillCheck(stats, "stealth", 1, rng);
    expect(probability).toBeLessThan(1);
    expect(probability).toBeGreaterThan(0);
  });

  it("higher stat increases success probability relative to a lower stat", () => {
    const rng = new SeededRng("seed", 0);
    const low = resolveSkillCheck(makeStats({ stealth: 2 }), "stealth", 7, rng);
    const high = resolveSkillCheck(makeStats({ stealth: 9 }), "stealth", 7, rng);
    expect(high.probability).toBeGreaterThan(low.probability);
  });

  it("is deterministic for a given seed + counter", () => {
    const stats = makeStats();
    const a = resolveSkillCheck(stats, "agility", 5, new SeededRng("same-seed", 3));
    const b = resolveSkillCheck(stats, "agility", 5, new SeededRng("same-seed", 3));
    expect(a.roll).toBe(b.roll);
    expect(a.success).toBe(b.success);
  });
});
