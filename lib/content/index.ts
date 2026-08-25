import { allLocations, locationsById } from "@/lib/content/locations";
import { allItems, itemsById } from "@/lib/content/items";
import { allNpcs, npcsById } from "@/lib/content/npcs";
import { allDialogues, dialoguesByNpcId } from "@/lib/content/dialogues";
import { allEvents, eventsById } from "@/lib/content/events";
import { allEndings, endingsById } from "@/lib/content/endings";
import { allAchievements, achievementsById } from "@/lib/content/achievements";
import { allKnowledge, knowledgeById } from "@/lib/content/knowledge";
import { allArchetypes, archetypesById } from "@/lib/content/characterArchetypes";
import type { Condition } from "@/lib/engine/types";

export interface ContentRegistry {
  locations: typeof allLocations;
  locationsById: typeof locationsById;
  items: typeof allItems;
  itemsById: typeof itemsById;
  npcs: typeof allNpcs;
  npcsById: typeof npcsById;
  dialoguesByNpcId: typeof dialoguesByNpcId;
  events: typeof allEvents;
  eventsById: typeof eventsById;
  endings: typeof allEndings;
  endingsById: typeof endingsById;
  achievements: typeof allAchievements;
  achievementsById: typeof achievementsById;
  knowledge: typeof allKnowledge;
  knowledgeById: typeof knowledgeById;
  archetypes: typeof allArchetypes;
  archetypesById: typeof archetypesById;
}

function collectConditionRefs(condition: Condition, itemIds: Set<string>, npcIds: Set<string>) {
  switch (condition.type) {
    case "hasItem":
      if (!itemIds.has(condition.id)) throw new Error(`Unknown item id in condition: ${condition.id}`);
      break;
    case "relationshipAtLeast":
      if (!npcIds.has(condition.npcId)) throw new Error(`Unknown NPC id in condition: ${condition.npcId}`);
      break;
    case "npcAlive":
    case "npcDead":
      if (!npcIds.has(condition.id)) throw new Error(`Unknown NPC id in condition: ${condition.id}`);
      break;
    case "and":
    case "or":
      condition.conditions.forEach((c) => collectConditionRefs(c, itemIds, npcIds));
      break;
    case "not":
      collectConditionRefs(condition.condition, itemIds, npcIds);
      break;
    default:
      break;
  }
}

function validateContent(): void {
  const locationIds = new Set(allLocations.map((l) => l.id));
  const itemIds = new Set(allItems.map((i) => i.id));
  const npcIds = new Set(allNpcs.map((n) => n.id));

  const dupCheck = (ids: string[], label: string) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) throw new Error(`Duplicate ${label} id: ${id}`);
      seen.add(id);
    }
  };
  dupCheck(allLocations.map((l) => l.id), "location");
  dupCheck(allItems.map((i) => i.id), "item");
  dupCheck(allNpcs.map((n) => n.id), "npc");
  dupCheck(allEvents.map((e) => e.id), "event");
  dupCheck(allEndings.map((e) => e.id), "ending");
  dupCheck(allAchievements.map((a) => a.id), "achievement");
  dupCheck(allKnowledge.map((k) => k.id), "knowledge");
  dupCheck(allArchetypes.map((a) => a.id), "archetype");

  for (const loc of allLocations) {
    for (const exit of loc.exits) {
      if (!locationIds.has(exit)) {
        throw new Error(`Location ${loc.id} has unknown exit: ${exit}`);
      }
    }
  }

  for (const npc of allNpcs) {
    if (!locationIds.has(npc.startingLocationId)) {
      throw new Error(`NPC ${npc.id} has unknown startingLocationId: ${npc.startingLocationId}`);
    }
    for (const itemId of npc.startingInventory) {
      if (!itemIds.has(itemId)) {
        throw new Error(`NPC ${npc.id} has unknown starting item: ${itemId}`);
      }
    }
    for (const s of npc.schedule) {
      if (!locationIds.has(s.locationId)) {
        throw new Error(`NPC ${npc.id} schedule references unknown location: ${s.locationId}`);
      }
    }
  }

  for (const arch of allArchetypes) {
    if (!locationIds.has(arch.startingLocationId)) {
      throw new Error(`Archetype ${arch.id} has unknown startingLocationId: ${arch.startingLocationId}`);
    }
    for (const itemId of arch.startingItems) {
      if (!itemIds.has(itemId)) {
        throw new Error(`Archetype ${arch.id} has unknown starting item: ${itemId}`);
      }
    }
    for (const rel of arch.startingRelationships) {
      if (!npcIds.has(rel.npcId)) {
        throw new Error(`Archetype ${arch.id} references unknown NPC: ${rel.npcId}`);
      }
    }
  }

  for (const dlg of allDialogues) {
    if (!npcIds.has(dlg.npcId)) {
      throw new Error(`Dialogue references unknown NPC: ${dlg.npcId}`);
    }
    if (!dlg.nodes[dlg.entryNodeId]) {
      throw new Error(`Dialogue for ${dlg.npcId} has invalid entryNodeId`);
    }
    for (const node of Object.values(dlg.nodes)) {
      for (const choice of node.choices) {
        if (choice.nextNodeId && !dlg.nodes[choice.nextNodeId]) {
          throw new Error(`Dialogue ${dlg.npcId} node ${node.id} references unknown nextNodeId`);
        }
        for (const c of choice.conditions ?? []) collectConditionRefs(c, itemIds, npcIds);
      }
    }
  }

  for (const ev of allEvents) {
    for (const c of ev.trigger) collectConditionRefs(c, itemIds, npcIds);
  }
  for (const end of allEndings) {
    for (const c of end.conditions) collectConditionRefs(c, itemIds, npcIds);
  }
}

validateContent();

export function getContentRegistry(): ContentRegistry {
  return {
    locations: allLocations,
    locationsById,
    items: allItems,
    itemsById,
    npcs: allNpcs,
    npcsById,
    dialoguesByNpcId,
    events: allEvents,
    eventsById,
    endings: allEndings,
    endingsById,
    achievements: allAchievements,
    achievementsById,
    knowledge: allKnowledge,
    knowledgeById,
    archetypes: allArchetypes,
    archetypesById,
  };
}
