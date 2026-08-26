import { describe, it, expect } from "vitest";
import { computeStage, computeStageInfo } from "@/lib/pet/evolution";
import { initialPersonality, driftPersonality } from "@/lib/pet/personality";

describe("computeStage", () => {
  it("starts as an egg (stage 0) on day zero", () => {
    expect(computeStage(0, 50)).toBe(0);
  });

  it("progresses with age when trust is healthy", () => {
    expect(computeStage(1, 50)).toBe(1);
    expect(computeStage(3, 50)).toBe(2);
    expect(computeStage(7, 50)).toBe(3);
  });

  it("stunts growth when trust is too low, regardless of age", () => {
    expect(computeStage(10, 10)).toBe(1);
    expect(computeStage(10, 30)).toBe(2);
  });
});

describe("computeStageInfo", () => {
  it("branches the final stage toward the dark path for an aggressive-dominant pet", () => {
    const aggressive = driftPersonality(initialPersonality(), { aggressive: 0.5 });
    const info = computeStageInfo("FANTASY", 10, 80, aggressive);
    expect(info.stage).toBe(3);
    expect(info.branch).toBe("dark");
    expect(info.name).toBe("Демонический дракон");
  });

  it("branches the final stage toward the light path for a gentle-dominant pet", () => {
    const gentle = driftPersonality(initialPersonality(), { gentle: 0.5 });
    const info = computeStageInfo("FANTASY", 10, 80, gentle);
    expect(info.branch).toBe("light");
    expect(info.name).toBe("Небесный дракон");
  });

  it("stays neutral before the final stage even if a trait already dominates", () => {
    const aggressive = driftPersonality(initialPersonality(), { aggressive: 0.5 });
    const info = computeStageInfo("FANTASY", 4, 80, aggressive);
    expect(info.stage).toBe(2);
    expect(info.branch).toBe("neutral");
  });
});
