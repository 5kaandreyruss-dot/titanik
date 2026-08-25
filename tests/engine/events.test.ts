import { describe, it, expect } from "vitest";
import { getContentRegistry } from "@/lib/content";
import { createInitialState } from "@/lib/engine/state";
import { processEvents } from "@/lib/engine/events";
import type { EngineEffect } from "@/lib/engine/types";

const content = getContentRegistry();

describe("event engine", () => {
  it("fires a one-shot event once its conditions are met, and never again", () => {
    const state = createInitialState(content, "seed-ev-1", { archetypeId: "steward" });
    state.time.minutesSinceStart = 219;

    processEvents(content, state, []);
    expect(state.flags["collision_happened"]).toBe(true);
    expect(state.ship.flooding).toBeGreaterThan(0);
    const floodingAfterFirst = state.ship.flooding;

    processEvents(content, state, []);
    // event_collision must not re-apply; only the repeatable flooding event should add more
    expect(state.ship.flooding).toBeGreaterThan(floodingAfterFirst);
    expect(state.eventsCompleted.filter((id) => id === "event_collision").length).toBe(1);
  });

  it("uses reduced flooding growth once the bridge has been warned", () => {
    const warned = createInitialState(content, "seed-ev-2", { archetypeId: "steward" });
    warned.flags["collision_happened"] = true;
    warned.flags["warned_bridge"] = true;

    const unwarned = createInitialState(content, "seed-ev-3", { archetypeId: "steward" });
    unwarned.flags["collision_happened"] = true;

    processEvents(content, warned, []);
    processEvents(content, unwarned, []);

    expect(warned.ship.flooding).toBeLessThan(unwarned.ship.flooding);
  });

  it("triggers a narrative event only when its location and flag conditions both hold", () => {
    const state = createInitialState(content, "seed-ev-4", { archetypeId: "steward" });
    const effects: EngineEffect[] = [];

    state.currentLocationId = "first_class_dining";
    processEvents(content, state, effects);
    expect(state.flags["found_ashford_husband"]).toBeUndefined();

    state.flags["agreed_help_ashford"] = true;
    processEvents(content, state, effects);
    expect(state.flags["found_ashford_husband"]).toBe(true);
  });
});
