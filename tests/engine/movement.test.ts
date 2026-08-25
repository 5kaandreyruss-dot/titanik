import { describe, it, expect } from "vitest";
import { getContentRegistry } from "@/lib/content";
import { createInitialState } from "@/lib/engine/state";
import { attemptMove } from "@/lib/engine/movement";
import type { EngineEffect } from "@/lib/engine/types";

const content = getContentRegistry();

describe("attemptMove", () => {
  it("moves between connected locations and advances time", () => {
    const state = createInitialState(content, "test-seed-1", { archetypeId: "steward" });
    state.currentLocationId = "b_deck_corridor";
    const before = state.time.minutesSinceStart;
    const effects: EngineEffect[] = [];

    attemptMove(content, state, "first_class_dining", effects);

    expect(state.currentLocationId).toBe("first_class_dining");
    expect(state.time.minutesSinceStart).toBeGreaterThan(before);
    expect(state.locations["first_class_dining"].discovered).toBe(true);
  });

  it("refuses movement to a location that isn't a direct exit", () => {
    const state = createInitialState(content, "test-seed-2", { archetypeId: "steward" });
    state.currentLocationId = "boat_deck";
    const effects: EngineEffect[] = [];

    attemptMove(content, state, "boiler_room_6", effects);

    expect(state.currentLocationId).toBe("boat_deck");
    expect(effects.some((e) => e.kind === "error")).toBe(true);
  });

  it("blocks a locked location until its unlock conditions are met", () => {
    const state = createInitialState(content, "test-seed-3", { archetypeId: "steward" });
    state.currentLocationId = "a_deck_promenade";
    const effects: EngineEffect[] = [];

    attemptMove(content, state, "bridge_wing", effects);
    expect(state.currentLocationId).not.toBe("bridge_wing");

    state.stats.authority = 9;
    attemptMove(content, state, "bridge_wing", effects);
    expect(state.currentLocationId).toBe("bridge_wing");
  });

  it("blocks entry to crew-restricted areas for non-crew classes", () => {
    const state = createInitialState(content, "test-seed-4", { archetypeId: "aristocrat" });
    state.currentLocationId = "c_deck_purser_office";
    const effects: EngineEffect[] = [];

    attemptMove(content, state, "engine_room_access", effects);

    expect(state.currentLocationId).not.toBe("engine_room_access");
    expect(effects.some((e) => e.kind === "error")).toBe(true);
  });
});
