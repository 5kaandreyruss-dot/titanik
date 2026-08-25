import { describe, it, expect } from "vitest";
import { getContentRegistry } from "@/lib/content";
import { createInitialState } from "@/lib/engine/state";
import { checkEndings } from "@/lib/engine/endings";

const content = getContentRegistry();

describe("ending resolution", () => {
  it("resolves the negative ending when flooding is fatal and the player isn't on the boat deck", () => {
    const state = createInitialState(content, "seed-end-1", { archetypeId: "steward" });
    state.currentLocationId = "boiler_room_6";
    state.ship.flooding = 90;

    expect(checkEndings(content, state)).toBe("ending_drowned");
  });

  it("prefers the positive ending over neutral when at least one person was rescued", () => {
    const state = createInitialState(content, "seed-end-2", { archetypeId: "steward" });
    state.currentLocationId = "boat_deck";
    state.flags["collision_happened"] = true;
    state.ship.flooding = 50;
    state.rescuedPeople.push("ashford");

    expect(checkEndings(content, state)).toBe("ending_survived_helped");
  });

  it("falls back to the neutral survival ending with no rescues", () => {
    const state = createInitialState(content, "seed-end-3", { archetypeId: "steward" });
    state.currentLocationId = "boat_deck";
    state.flags["collision_happened"] = true;
    state.ship.flooding = 50;

    expect(checkEndings(content, state)).toBe("ending_survived_alone");
  });

  it("returns null while no ending condition is satisfied yet", () => {
    const state = createInitialState(content, "seed-end-4", { archetypeId: "steward" });
    expect(checkEndings(content, state)).toBeNull();
  });
});
