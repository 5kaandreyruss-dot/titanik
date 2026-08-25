import { describe, it, expect } from "vitest";
import { getContentRegistry } from "@/lib/content";
import { createInitialState } from "@/lib/engine/state";
import { applyAction } from "@/lib/engine/run";
import type { GameRunState } from "@/lib/engine/types";

const content = getContentRegistry();

function move(state: GameRunState, seed: string, targetLocationId: string) {
  return applyAction(content, state, { type: "MOVE", targetLocationId }, seed);
}

describe("applyAction full playthrough", () => {
  it("drives the vertical-slice story chain to the positive ending", () => {
    const seed = "integration-seed-1";
    let state = createInitialState(content, seed, { archetypeId: "aristocrat" });
    state.stats.authority = 10; // deterministic bridge access for this test
    state.currentLocationId = "b_deck_corridor";

    // Agree to help Mrs. Ashford
    state = applyAction(content, state, { type: "TALK_START", npcId: "ashford" }, seed).state;
    state = applyAction(content, state, { type: "DIALOGUE_CHOOSE", npcId: "ashford", choiceId: "help" }, seed).state;
    expect(state.flags["agreed_help_ashford"]).toBe(true);

    // Find Mr. Ashford in the dining saloon
    state = move(state, seed, "first_class_dining").state;
    expect(state.flags["found_ashford_husband"]).toBe(true);

    // Report back
    state = move(state, seed, "b_deck_corridor").state;
    state = applyAction(content, state, { type: "TALK_START", npcId: "ashford" }, seed).state;
    expect(state.activeDialogue?.nodeId).toBe("found_him");
    state = applyAction(content, state, { type: "DIALOGUE_CHOOSE", npcId: "ashford", choiceId: "tell_found" }, seed).state;
    expect(state.flags["ashford_rescued_husband"]).toBe(true);

    // Wait for Halloway to move to the bridge wing (schedule: 180 min)
    while (state.time.minutesSinceStart < 185) {
      state = applyAction(content, state, { type: "WAIT", minutes: 10 }, seed).state;
    }
    expect(state.npcs["halloway"].locationId).toBe("bridge_wing");

    // Reach the bridge wing (authority-gated) and build enough trust with Halloway
    state = move(state, seed, "a_deck_promenade").state;
    state = move(state, seed, "bridge_wing").state;
    state = applyAction(content, state, { type: "TALK_START", npcId: "halloway" }, seed).state;
    state = applyAction(content, state, { type: "DIALOGUE_CHOOSE", npcId: "halloway", choiceId: "reassure" }, seed).state;
    state = applyAction(content, state, { type: "TALK_START", npcId: "halloway" }, seed).state;
    state = applyAction(content, state, { type: "DIALOGUE_CHOOSE", npcId: "halloway", choiceId: "smalltalk" }, seed).state;
    expect(state.relationships["halloway"].trust).toBeGreaterThanOrEqual(40);

    // Learn the secret
    state = applyAction(content, state, { type: "TALK_START", npcId: "halloway" }, seed).state;
    expect(state.activeDialogue?.nodeId).toBe("reveal_ready");
    state = applyAction(content, state, { type: "DIALOGUE_CHOOSE", npcId: "halloway", choiceId: "ask_more" }, seed).state;
    expect(state.knowledge).toContain("iceberg_warning");

    // Warn the bridge via Officer Reilly
    state = move(state, seed, "a_deck_promenade").state;
    state = move(state, seed, "boat_deck").state;
    state = applyAction(content, state, { type: "TALK_START", npcId: "reilly" }, seed).state;
    state = applyAction(content, state, { type: "DIALOGUE_CHOOSE", npcId: "reilly", choiceId: "warn_bridge" }, seed).state;
    expect(state.flags["warned_bridge"]).toBe(true);

    // Let the collision happen and flooding build up while away from the boat deck
    state = move(state, seed, "a_deck_promenade").state;
    while (!state.flags["collision_happened"] || state.ship.flooding < 40) {
      state = applyAction(content, state, { type: "WAIT", minutes: 5 }, seed).state;
      if (state.ship.flooding >= 79) break; // safety valve against runaway loop
    }
    expect(state.flags["collision_happened"]).toBe(true);

    // Reach the boat deck and rescue the Ashfords
    const result = move(state, seed, "boat_deck");
    state = result.state;

    expect(state.rescuedPeople).toContain("ashford");
    expect(state.ending).toBe("ending_survived_helped");
  });

  it("resolves the drowned ending when flooding overwhelms the ship far from a lifeboat", () => {
    const seed = "integration-seed-2";
    let state = createInitialState(content, seed, { archetypeId: "mechanic" });
    state.currentLocationId = "boiler_room_6";
    state.flags["collision_happened"] = true;
    state.ship.flooding = 76;

    const result = applyAction(content, state, { type: "WAIT", minutes: 5 }, seed);
    state = result.state;

    expect(state.ending).toBe("ending_drowned");
  });

  it("ignores actions submitted after the run has already ended", () => {
    const seed = "integration-seed-3";
    const state = createInitialState(content, seed, { archetypeId: "mechanic" });
    state.ending = "ending_drowned";

    const result = applyAction(content, state, { type: "LOOK_AROUND" }, seed);

    expect(result.effects.some((e) => e.kind === "error")).toBe(true);
  });
});
