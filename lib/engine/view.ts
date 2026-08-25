import type { GameRunState } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { formatGameTime } from "@/lib/engine/state";
import { getVisibleNode } from "@/lib/engine/dialogue";
import { t, type Locale } from "@/lib/i18n/types";
import { getUiDictionary } from "@/lib/i18n/ui";

function bucket(value: number): "none" | "light" | "moderate" | "severe" | "critical" {
  if (value <= 0) return "none";
  if (value < 25) return "light";
  if (value < 50) return "moderate";
  if (value < 80) return "severe";
  return "critical";
}

export type RunView = ReturnType<typeof buildRunView>;

/**
 * Builds the client-facing view of a run: never leaks undiscovered content,
 * exact skill-check math, or raw ship-state numbers (spec #7, #47, #58).
 * All player-facing text is resolved to `locale` here — the engine itself
 * stays language-neutral.
 */
export function buildRunView(content: ContentRegistry, state: GameRunState, locale: Locale) {
  const ui = getUiDictionary(locale);
  const { time, date } = formatGameTime(state.time.minutesSinceStart, locale);
  const currentLocDef = content.locationsById[state.currentLocationId];

  const exits = (currentLocDef?.exits ?? []).map((id) => {
    const def = content.locationsById[id];
    const runtime = state.locations[id];
    return {
      id,
      name: runtime.discovered ? t(def.name, locale) : ui.game.unexploredPassage,
      discovered: runtime.discovered,
      locked: runtime.locked,
    };
  });

  const npcsHere = content.npcs
    .filter((n) => state.npcs[n.id]?.locationId === state.currentLocationId && state.npcs[n.id]?.alive)
    .map((n) => ({ id: n.id, name: n.name, profession: t(n.profession, locale) }));

  const itemsHere = (state.locations[state.currentLocationId]?.itemsPresent ?? []).map((id) => ({
    id,
    name: t(content.itemsById[id].name, locale),
  }));

  const inventory = state.inventory.map((i) => {
    const def = content.itemsById[i.itemId];
    return {
      itemId: i.itemId,
      quantity: i.quantity,
      name: t(def.name, locale),
      description: t(def.description, locale),
      actions: def.actions,
    };
  });

  const knowledge = state.knowledge
    .map((id) => content.knowledgeById[id])
    .filter(Boolean)
    .map((k) => ({ id: k.id, category: k.category, title: t(k.title, locale), text: t(k.text, locale) }));

  const map = content.locations.map((loc) => {
    const runtime = state.locations[loc.id];
    return {
      id: loc.id,
      name: runtime.discovered ? t(loc.name, locale) : ui.game.unknownLocation,
      deck: t(loc.deck, locale),
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
        text: t(visible.node.npcText, locale),
        choices: visible.choices.map((c) => ({
          id: c.id,
          text: t(c.text, locale),
          hint: c.hint ? t(c.hint, locale) : undefined,
        })),
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
          name: t(currentLocDef.name, locale),
          description: t(currentLocDef.description, locale),
          sceneBackground: currentLocDef.sceneBackground,
          deck: t(currentLocDef.deck, locale),
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
    archetype: (() => {
      const def = content.archetypesById[state.characterArchetypeId];
      return def ? { id: def.id, name: t(def.name, locale), description: t(def.description, locale) } : null;
    })(),
    socialClass: state.socialClass,
    rescuedPeople: state.rescuedPeople,
    deadPeople: state.deadPeople,
    log: state.log.slice(-20).map((entry) => ({ time: entry.time, text: t(entry.text, locale) })),
    ending: state.ending
      ? {
          id: state.ending,
          name: t(content.endingsById[state.ending].name, locale),
          category: content.endingsById[state.ending].category,
          epilogueText: t(content.endingsById[state.ending].epilogueText, locale),
        }
      : null,
  };
}

function relationshipBucket(trust: number): "hostile" | "distrustful" | "neutral" | "trusting" | "loyal" {
  if (trust < 20) return "hostile";
  if (trust < 40) return "distrustful";
  if (trust < 60) return "neutral";
  if (trust < 80) return "trusting";
  return "loyal";
}
