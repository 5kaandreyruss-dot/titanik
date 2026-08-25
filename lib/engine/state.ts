import type { GameRunState, CharacterStats, SocialClass } from "@/lib/engine/types";
import { ALL_STATS } from "@/lib/engine/types";
import type { ContentRegistry } from "@/lib/content";
import { SeededRng } from "@/lib/engine/rng";
import { maleFirstNames, femaleFirstNames, surnames } from "@/lib/content/names";

const GAME_START_HOUR = 20; // 20:00, April 14, 1912

function withArticle(noun: string): string {
  return `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`;
}

export interface NewCharacterOptions {
  archetypeId?: string;
}

export function rollBaseStats(rng: SeededRng): CharacterStats {
  const stats = {} as CharacterStats;
  for (const stat of ALL_STATS) {
    stats[stat] = rng.int(3, 6);
  }
  return stats;
}

export function createInitialState(
  content: ContentRegistry,
  seed: string,
  options: NewCharacterOptions = {},
): GameRunState {
  const rng = new SeededRng(seed, 0);

  const archetype = options.archetypeId
    ? content.archetypesById[options.archetypeId]
    : rng.pick(content.archetypes);
  if (!archetype) throw new Error("Unknown archetype");

  const stats = rollBaseStats(rng);
  for (const [stat, bonus] of Object.entries(archetype.statBias)) {
    stats[stat as keyof CharacterStats] = Math.min(10, stats[stat as keyof CharacterStats] + (bonus ?? 0));
  }

  const gender = rng.pick(["male", "female"]);
  const firstName = gender === "male" ? rng.pick(maleFirstNames) : rng.pick(femaleFirstNames);
  const characterName = `${firstName} ${rng.pick(surnames)}`;

  const locations: GameRunState["locations"] = {};
  for (const loc of content.locations) {
    locations[loc.id] = {
      discovered: loc.startsDiscovered || loc.id === archetype.startingLocationId,
      locked: loc.startsLocked,
      itemsPresent: [...(loc.itemsPresent ?? [])],
    };
  }

  const npcs: GameRunState["npcs"] = {};
  const relationships: GameRunState["relationships"] = {};
  for (const npc of content.npcs) {
    npcs[npc.id] = {
      locationId: npc.startingLocationId,
      alive: true,
      flags: {},
    };
    const rel: GameRunState["relationships"][string] = {
      trust: 30,
      respect: 30,
      fear: 10,
      suspicion: 20,
      loyalty: 20,
    };
    for (const [dim, val] of Object.entries(npc.startingRelationship)) {
      if (val !== undefined) rel[dim as keyof typeof rel] = val;
    }
    relationships[npc.id] = rel;
  }
  for (const startRel of archetype.startingRelationships) {
    const rel = relationships[startRel.npcId];
    if (rel) {
      rel[startRel.dimension as keyof typeof rel] = startRel.value;
    }
  }
  const inventory = archetype.startingItems.map((itemId) => ({ itemId, quantity: 1 }));

  return {
    time: { minutesSinceStart: 0 },
    currentLocationId: archetype.startingLocationId,
    ship: { damage: 0, flooding: 0, power: 100, panic: 0, fire: 0 },
    npcs,
    relationships,
    inventory,
    knowledge: [],
    locations,
    eventsCompleted: [],
    eventsActive: [],
    flags: {},
    rescuedPeople: [],
    deadPeople: [],
    log: [
      {
        time: 0,
        text: `It is 8:00 PM, April 14, 1912. You are ${characterName}, ${withArticle(archetype.name.toLowerCase())} aboard the RMS Titanic.`,
      },
    ],
    ending: null,
    activeDialogue: null,
    stats,
    characterName,
    characterGender: gender,
    characterArchetypeId: archetype.id,
    socialClass: archetype.socialClass as SocialClass,
    rngCounter: 1,
  };
}

export function formatGameTime(minutesSinceStart: number): { time: string; date: string } {
  const totalMinutes = GAME_START_HOUR * 60 + minutesSinceStart;
  const dayOffset = Math.floor(totalMinutes / (24 * 60));
  const minutesInDay = totalMinutes % (24 * 60);
  const hours = Math.floor(minutesInDay / 60);
  const minutes = minutesInDay % 60;
  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const date = dayOffset === 0 ? "April 14, 1912" : "April 15, 1912";
  return { time, date };
}
