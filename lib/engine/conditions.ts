import type { Condition, GameRunState } from "@/lib/engine/types";

export function evaluateCondition(condition: Condition, state: GameRunState): boolean {
  switch (condition.type) {
    case "timeAfter":
      return state.time.minutesSinceStart >= condition.minutes;
    case "timeBefore":
      return state.time.minutesSinceStart < condition.minutes;
    case "flag": {
      const value = state.flags[condition.key];
      if (condition.equals === undefined) return Boolean(value);
      return value === condition.equals;
    }
    case "relationshipAtLeast": {
      const rel = state.relationships[condition.npcId];
      if (!rel) return false;
      return rel[condition.dimension] >= condition.value;
    }
    case "hasKnowledge":
      return state.knowledge.includes(condition.id);
    case "hasItem":
      return state.inventory.some((i) => i.itemId === condition.id && i.quantity > 0);
    case "locationIs":
      return state.currentLocationId === condition.id;
    case "npcAlive":
      return state.npcs[condition.id]?.alive ?? false;
    case "npcDead":
      return !(state.npcs[condition.id]?.alive ?? true);
    case "eventCompleted":
      return state.eventsCompleted.includes(condition.id);
    case "statAtLeast":
      return (state.stats[condition.stat] ?? 0) >= condition.value;
    case "shipStateAtLeast":
      return state.ship[condition.key] >= condition.value;
    case "rescuedAtLeast":
      return state.rescuedPeople.length >= condition.count;
    case "and":
      return condition.conditions.every((c) => evaluateCondition(c, state));
    case "or":
      return condition.conditions.some((c) => evaluateCondition(c, state));
    case "not":
      return !evaluateCondition(condition.condition, state);
    default:
      return false;
  }
}

export function evaluateAll(conditions: Condition[] | undefined, state: GameRunState): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((c) => evaluateCondition(c, state));
}
