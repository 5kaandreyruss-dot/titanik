import { describe, it, expect } from "vitest";
import { getContentRegistry } from "@/lib/content";
import { createInitialState } from "@/lib/engine/state";
import { startDialogue, chooseDialogueOption, getVisibleNode } from "@/lib/engine/dialogue";
import type { EngineEffect } from "@/lib/engine/types";

const content = getContentRegistry();

describe("dialogue engine", () => {
  it("hides a choice whose conditions are not met, and reveals it once they are", () => {
    const state = createInitialState(content, "seed-dlg-1", { archetypeId: "steward" });
    state.currentLocationId = "engine_room_access"; // halloway's location
    const effects: EngineEffect[] = [];

    startDialogue(content, state, "halloway", effects);
    let visible = getVisibleNode(content, state)!;
    expect(visible.choices.some((c) => c.id === "press")).toBe(true);

    state.relationships["halloway"].trust = 50;
    visible = getVisibleNode(content, state)!;
    expect(visible.choices.some((c) => c.id === "press")).toBe(false);
  });

  it("picks the correct entry node based on hidden flag conditions", () => {
    const state = createInitialState(content, "seed-dlg-2", { archetypeId: "aristocrat" });
    state.currentLocationId = "b_deck_corridor";
    const effects: EngineEffect[] = [];

    startDialogue(content, state, "ashford", effects);
    expect(state.activeDialogue?.nodeId).toBe("greet");

    state.flags["found_ashford_husband"] = true;
    startDialogue(content, state, "ashford", effects);
    expect(state.activeDialogue?.nodeId).toBe("found_him");
  });

  it("applies consequences and knowledge gain when choosing an option", () => {
    const state = createInitialState(content, "seed-dlg-3", { archetypeId: "steward" });
    state.currentLocationId = "engine_room_access";
    state.relationships["halloway"].trust = 60;
    state.currentLocationId = "bridge_wing"; // required by entry candidate condition
    state.npcs["halloway"].locationId = "bridge_wing";
    const effects: EngineEffect[] = [];

    startDialogue(content, state, "halloway", effects);
    expect(state.activeDialogue?.nodeId).toBe("reveal_ready");

    chooseDialogueOption(content, state, "halloway", "ask_more", "seed-dlg-3", effects);

    expect(state.knowledge).toContain("iceberg_warning");
    expect(state.activeDialogue).toBeNull();
  });

  it("resolves a skill-check choice deterministically for a given seed and applies success/fail consequences", () => {
    const state = createInitialState(content, "seed-dlg-4", { archetypeId: "thief" });
    state.currentLocationId = "g_deck_thirdclass_berths";
    state.stats.stealth = 10; // maximize success probability
    const effects: EngineEffect[] = [];

    startDialogue(content, state, "cobb", effects);
    chooseDialogueOption(content, state, "cobb", "pickpocket", "seed-dlg-4", effects);

    const gotLockpick = state.inventory.some((i) => i.itemId === "lockpick_set");
    const suspicionChanged = state.relationships["cobb"].suspicion !== 40;
    expect(gotLockpick || suspicionChanged).toBe(true);
  });

  it("rejects a choice that isn't currently available", () => {
    const state = createInitialState(content, "seed-dlg-5", { archetypeId: "steward" });
    state.currentLocationId = "boat_deck";
    const effects: EngineEffect[] = [];

    startDialogue(content, state, "reilly", effects);
    chooseDialogueOption(content, state, "reilly", "warn_bridge", "seed-dlg-5", effects);

    expect(effects.some((e) => e.kind === "error")).toBe(true);
    expect(state.flags["warned_bridge"]).toBeUndefined();
  });
});
