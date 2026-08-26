import { describe, it, expect } from "vitest";
import { suggestMove, resolveRound } from "@/lib/pet/battle";
import { initialPersonality, driftPersonality } from "@/lib/pet/personality";

describe("suggestMove", () => {
  it("leans toward ATTACK for an aggressive/brave-dominant pet", () => {
    const p = driftPersonality(initialPersonality(), { aggressive: 0.4, brave: 0.4 });
    const counts = { ATTACK: 0, DEFEND: 0, DODGE: 0 };
    for (let i = 0; i < 200; i++) counts[suggestMove(p)]++;
    expect(counts.ATTACK).toBeGreaterThan(counts.DEFEND);
    expect(counts.ATTACK).toBeGreaterThan(counts.DODGE);
  });

  it("leans toward DEFEND for a lazy-dominant pet", () => {
    const p = driftPersonality(initialPersonality(), { lazy: 0.6 });
    const counts = { ATTACK: 0, DEFEND: 0, DODGE: 0 };
    for (let i = 0; i < 200; i++) counts[suggestMove(p)]++;
    expect(counts.DEFEND).toBeGreaterThan(counts.ATTACK);
  });
});

describe("resolveRound", () => {
  it("deals more damage on ATTACK than on DEFEND", () => {
    const attack = resolveRound("ATTACK", 1);
    const defend = resolveRound("DEFEND", 1);
    expect(attack.petDamageDealt).toBeGreaterThan(defend.petDamageDealt);
  });

  it("scales monster damage with monster level", () => {
    const low = resolveRound("ATTACK", 1);
    const high = resolveRound("ATTACK", 10);
    expect(high.monsterDamageDealt).toBeGreaterThan(low.monsterDamageDealt * 0.5);
  });

  it("never lets DEFEND take more damage than a typical ATTACK round", () => {
    for (let i = 0; i < 50; i++) {
      const defend = resolveRound("DEFEND", 5);
      expect(defend.monsterDamageDealt).toBeLessThanOrEqual(20 * 0.5);
    }
  });
});
