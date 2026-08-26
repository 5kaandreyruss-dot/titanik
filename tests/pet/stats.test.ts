import { describe, it, expect } from "vitest";
import { applyFeed, applyPlay, applyTrain, applyTimeDecay, isNeglected } from "@/lib/pet/stats";
import type { PetStats } from "@/lib/pet/types";

const base: PetStats = { trust: 50, intelligence: 10, strength: 10, energy: 80, hunger: 70 };

describe("applyFeed", () => {
  it("raises hunger, trust and energy, capped at 100", () => {
    const result = applyFeed(base);
    expect(result.hunger).toBe(100);
    expect(result.trust).toBe(52);
    expect(result.energy).toBe(85);
  });
});

describe("applyPlay", () => {
  it("costs energy and hunger but raises trust and intelligence", () => {
    const result = applyPlay(base);
    expect(result.energy).toBe(65);
    expect(result.hunger).toBe(60);
    expect(result.trust).toBe(55);
    expect(result.intelligence).toBe(11);
  });
});

describe("applyTrain", () => {
  it("costs more energy/hunger for a bigger strength/intelligence payoff", () => {
    const result = applyTrain(base);
    expect(result.energy).toBe(60);
    expect(result.hunger).toBe(55);
    expect(result.strength).toBe(14);
    expect(result.intelligence).toBe(12);
  });
});

describe("applyTimeDecay", () => {
  it("does nothing for zero elapsed hours", () => {
    expect(applyTimeDecay(base, 0)).toEqual(base);
  });

  it("drains hunger and energy over time", () => {
    const result = applyTimeDecay(base, 10);
    expect(result.hunger).toBeLessThan(base.hunger);
    expect(result.energy).toBeLessThan(base.energy);
  });

  it("erodes trust once hunger has bottomed out for a long stretch", () => {
    const starving: PetStats = { ...base, hunger: 0 };
    const result = applyTimeDecay(starving, 48);
    expect(result.trust).toBeLessThan(starving.trust);
  });

  it("clamps stats within 0-100 even after a very long absence", () => {
    const result = applyTimeDecay(base, 24 * 30);
    expect(result.hunger).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.trust).toBeGreaterThanOrEqual(0);
  });
});

describe("isNeglected", () => {
  it("is true only once trust bottoms out", () => {
    expect(isNeglected({ ...base, trust: 1 })).toBe(false);
    expect(isNeglected({ ...base, trust: 0 })).toBe(true);
  });
});
