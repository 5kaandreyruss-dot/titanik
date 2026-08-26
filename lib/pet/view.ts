import "server-only";
import type { Pet } from "@prisma/client";
import { applyTimeDecay, isNeglected } from "./stats";
import { computeStageInfo } from "./evolution";
import type { Personality, PetStats } from "./types";

export interface PetView {
  id: string;
  name: string;
  world: Pet["world"];
  stats: PetStats;
  personality: Personality;
  ageDays: number;
  stage: number;
  stageName: string;
  neglected: boolean;
}

/** Applies passive decay for the time elapsed since we last looked, without needing a cron job. */
export function decayPet(pet: Pet): PetStats {
  const hours = (Date.now() - pet.lastSeenAt.getTime()) / 3_600_000;
  return applyTimeDecay(
    { trust: pet.trust, intelligence: pet.intelligence, strength: pet.strength, energy: pet.energy, hunger: pet.hunger },
    hours,
  );
}

export function buildPetView(pet: Pet, stats: PetStats): PetView {
  const ageDays = Math.floor((Date.now() - pet.bornAt.getTime()) / 86_400_000);
  const personality = pet.personality as unknown as Personality;
  const stageInfo = computeStageInfo(pet.world, ageDays, stats.trust, personality);
  return {
    id: pet.id,
    name: pet.name,
    world: pet.world,
    stats,
    personality,
    ageDays,
    stage: stageInfo.stage,
    stageName: stageInfo.name,
    neglected: isNeglected(stats),
  };
}
