import type { GameRunState } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { formatGameTime } from "@/lib/engine/state";
import { getVisibleNode } from "@/lib/engine/dialogue";

function bucket(value: number): "none" | "light" | "moderate" | "severe" | "critical" {
  if (value <= 0) return "none";
  if (value < 25) return "light";
  if (value < 50) return "moderate";
  if (value < 80) return "severe";
  return "critical";
}

/**
 * Builds the client-facing view of a run: never leaks undiscovered content,
 * exact skill-check math, or raw ship-state numbers (spec #7, #47, #58).
 */
export type RunView = ReturnType<typeof buildRunView>;

export function buildRunView(content: ContentRegistry, state: GameRunState) {
  const { time, date } = formatGameTime(state.time.minutesSinceStart);
  const currentLocDef = content.locationsById[state.currentLocationId];

  const exits = (currentLocDef?.exits ?? []).map((id) => {
    const def = content.locationsById[id];
    const runtime = state.locations[id];
    return {
      id,
      name: runtime.discovered ? def.name : "Unexplored passage",
      discovered: runtime.discovered,
      locked: runtime.locked,
    };
  });

  const npcsHere = content.npcs
    .filter((n) => state.npcs[n.id]?.locationId === state.currentLocationId && state.npcs[n.id]?.alive)
    .map((n) => ({ id: n.id, name: n.name, profession: n.profession }));

  const itemsHere = (state.locations[state.currentLocationId]?.itemsPresent ?? []).map((id) => ({
    id,
    name: content.itemsById[id]?.name ?? id,
  }));

  const inventory = state.inventory.map((i) => ({
    itemId: i.itemId,
    quantity: i.quantity,
    name: content.itemsById[i.itemId]?.name ?? i.itemId,
    description: content.itemsById[i.itemId]?.description ?? "",
    actions: content.itemsById[i.itemId]?.actions ?? [],
  }));

  const knowledge = state.knowledge.map((id) => content.knowledgeById[id]).filter(Boolean);

  const map = content.locations.map((loc) => {
    const runtime = state.locations[loc.id];
    return {
      id: loc.id,
      name: runtime.discovered ? loc.name : "???",
      deck: loc.deck,
      discovered: runtime.discovered,
      locked: runtime.locked,
      isCurrent: loc.id === state.currentLocationId,
    };
  });

  let dialogue: {
    npcId: string;
    npcName: string;
    text: string;
    choices: { id: string; text: string; hint?: string }[];
  } | null = null;
  if (state.activeDialogue) {
    const visible = getVisibleNode(content, state);
    if (visible) {
      dialogue = {
        npcId: state.activeDialogue.npcId,
        npcName: content.npcsById[state.activeDialogue.npcId]?.name ?? state.activeDialogue.npcId,
        text: visible.node.npcText,
        choices: visible.choices.map((c) => ({ id: c.id, text: c.text, hint: c.hint })),
      };
    }
  }

  const relationshipsHere = npcsHere.map((n) => {
    const rel = state.relationships[n.id];
    return { npcId: n.id, bucket: relationshipBucket(rel?.trust ?? 30) };
  });

  return {
    time,
    date,
    location: currentLocDef
      ? {
          id: currentLocDef.id,
          name: currentLocDef.name,
          description: currentLocDef.description,
          sceneBackground: currentLocDef.sceneBackground,
          deck: currentLocDef.deck,
        }
      : null,
    exits,
    npcsHere,
    relationshipsHere,
    itemsHere,
    inventory,
    knowledge,
    map,
    dialogue,
    ship: {
      flooding: bucket(state.ship.flooding),
      panic: bucket(state.ship.panic),
      damage: bucket(state.ship.damage),
      power: bucket(100 - state.ship.power),
      fire: bucket(state.ship.fire),
    },
    stats: state.stats,
    characterName: state.characterName,
    characterArchetypeId: state.characterArchetypeId,
    socialClass: state.socialClass,
    rescuedPeople: state.rescuedPeople,
    deadPeople: state.deadPeople,
    log: state.log.slice(-20),
    ending: state.ending ? content.endingsById[state.ending] ?? null : null,
  };
}

function relationshipBucket(trust: number): "hostile" | "distrustful" | "neutral" | "trusting" | "loyal" {
  if (trust < 20) return "hostile";
  if (trust < 40) return "distrustful";
  if (trust < 60) return "neutral";
  if (trust < 80) return "trusting";
  return "loyal";
}
