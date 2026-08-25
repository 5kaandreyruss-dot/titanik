import { getContentRegistry } from "./index";

const content = getContentRegistry();
console.log(
  `Content OK: ${content.locations.length} locations, ${content.npcs.length} NPCs, ${content.items.length} items, ${content.events.length} events, ${content.endings.length} endings, ${content.achievements.length} achievements, ${content.archetypes.length} archetypes.`,
);
