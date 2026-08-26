import type { PetStats } from "./types";

function clamp(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function applyFeed(stats: PetStats): PetStats {
  return {
    ...stats,
    hunger: clamp(stats.hunger + 30),
    trust: clamp(stats.trust + 2),
    energy: clamp(stats.energy + 5),
  };
}

export function applyPlay(stats: PetStats): PetStats {
  return {
    ...stats,
    energy: clamp(stats.energy - 15),
    hunger: clamp(stats.hunger - 10),
    trust: clamp(stats.trust + 5),
    intelligence: clamp(stats.intelligence + 1),
  };
}

export function applyTrain(stats: PetStats): PetStats {
  return {
    ...stats,
    energy: clamp(stats.energy - 20),
    hunger: clamp(stats.hunger - 15),
    strength: clamp(stats.strength + 4),
    intelligence: clamp(stats.intelligence + 2),
    trust: clamp(stats.trust + 1),
  };
}

export function applyChat(stats: PetStats, trustDelta: number): PetStats {
  return { ...stats, trust: clamp(stats.trust + trustDelta) };
}

/** Passive decay since the last time we looked at the pet — called lazily on read, not via a cron job. */
export function applyTimeDecay(stats: PetStats, hoursSinceLastSeen: number): PetStats {
  if (hoursSinceLastSeen <= 0) return stats;
  const hungerLoss = hoursSinceLastSeen * 1.5;
  const energyLoss = hoursSinceLastSeen * 1.2;
  const nextHunger = clamp(stats.hunger - hungerLoss);
  const nextEnergy = clamp(stats.energy - energyLoss);
  // Being starving/exhausted for a long stretch erodes trust — this is the
  // "can be neglected" mechanic, deliberately gentler than the hunger/energy
  // drain so a day or two away doesn't tank the relationship outright.
  const neglectPenalty = nextHunger === 0 ? hoursSinceLastSeen * 0.6 : 0;
  const nextTrust = clamp(stats.trust - neglectPenalty);
  return { ...stats, hunger: nextHunger, energy: nextEnergy, trust: nextTrust };
}

export function isNeglected(stats: PetStats): boolean {
  return stats.trust <= 0;
}
