import { describe, it, expect } from "vitest";
import { initialPersonality, driftPersonality, dominantTrait, classifyMessage } from "@/lib/pet/personality";
import { TRAIT_KEYS } from "@/lib/pet/types";

describe("initialPersonality", () => {
  it("starts balanced across all traits", () => {
    const p = initialPersonality();
    for (const key of TRAIT_KEYS) expect(p[key]).toBeCloseTo(0.2);
  });
});

describe("driftPersonality", () => {
  it("nudges a trait up and keeps the vector normalized to ~1", () => {
    const p = initialPersonality();
    const next = driftPersonality(p, { aggressive: 0.3 });
    expect(next.aggressive).toBeGreaterThan(p.aggressive);
    const sum = TRAIT_KEYS.reduce((acc, k) => acc + next[k], 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it("clamps within 0-1 before renormalizing", () => {
    const p = initialPersonality();
    const next = driftPersonality(p, { curious: 5 });
    for (const key of TRAIT_KEYS) {
      expect(next[key]).toBeGreaterThanOrEqual(0);
      expect(next[key]).toBeLessThanOrEqual(1);
    }
  });
});

describe("dominantTrait", () => {
  it("picks the highest-weighted trait", () => {
    const p = { curious: 0.1, gentle: 0.1, aggressive: 0.6, lazy: 0.1, brave: 0.1 };
    expect(dominantTrait(p)).toBe("aggressive");
  });
});

describe("classifyMessage", () => {
  it("detects rude language as an aggressive signal", () => {
    const signal = classifyMessage("ты тупой идиот");
    expect(signal.aggressive).toBeGreaterThan(0);
  });

  it("detects gratitude as a gentle signal", () => {
    const signal = classifyMessage("спасибо, ты молодец");
    expect(signal.gentle).toBeGreaterThan(0);
  });

  it("detects questions as a curious signal", () => {
    const signal = classifyMessage("расскажи, почему ты так делаешь?");
    expect(signal.curious).toBeGreaterThan(0);
  });

  it("returns an empty signal for neutral small talk with no keyword matches", () => {
    const signal = classifyMessage("ладно, до встречи");
    expect(signal).toEqual({});
  });
});
