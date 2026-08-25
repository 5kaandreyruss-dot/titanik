import { describe, it, expect } from "vitest";
import { getContentRegistry } from "@/lib/content";
import { createInitialState } from "@/lib/engine/state";
import { takeItem, giveItem } from "@/lib/engine/inventory";
import type { EngineEffect } from "@/lib/engine/types";

const content = getContentRegistry();

describe("inventory actions", () => {
  it("picks up an item present at the current location", () => {
    const state = createInitialState(content, "seed-inv-1", { archetypeId: "steward" });
    state.currentLocationId = "boat_deck";
    const effects: EngineEffect[] = [];

    takeItem(content, state, "lifebelt", effects);

    expect(state.inventory.some((i) => i.itemId === "lifebelt")).toBe(true);
    expect(state.locations["boat_deck"].itemsPresent).not.toContain("lifebelt");
  });

  it("refuses to take an item that isn't there", () => {
    const state = createInitialState(content, "seed-inv-2", { archetypeId: "steward" });
    state.currentLocationId = "boat_deck";
    const effects: EngineEffect[] = [];

    takeItem(content, state, "flashlight", effects);

    expect(state.inventory.some((i) => i.itemId === "flashlight")).toBe(false);
    expect(effects.some((e) => e.kind === "error")).toBe(true);
  });

  it("gives an item to an NPC present at the same location and raises trust slightly", () => {
    const state = createInitialState(content, "seed-inv-3", { archetypeId: "aristocrat" });
    state.currentLocationId = "b_deck_corridor"; // ashford's starting location
    const trustBefore = state.relationships["ashford"].trust;
    const effects: EngineEffect[] = [];

    giveItem(content, state, "pocket_watch", "ashford", effects);

    expect(state.inventory.some((i) => i.itemId === "pocket_watch")).toBe(false);
    expect(state.relationships["ashford"].trust).toBeGreaterThan(trustBefore);
  });

  it("refuses to give an item the player doesn't have", () => {
    const state = createInitialState(content, "seed-inv-4", { archetypeId: "steward" });
    state.currentLocationId = "b_deck_corridor";
    const effects: EngineEffect[] = [];

    giveItem(content, state, "lockpick_set", "ashford", effects);

    expect(effects.some((e) => e.kind === "error")).toBe(true);
  });
});
