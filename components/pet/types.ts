import type { WorldTheme, PetStats, Personality } from "@/lib/pet/types";

export interface PetViewData {
  id: string;
  name: string;
  world: WorldTheme;
  stats: PetStats;
  personality: Personality;
  ageDays: number;
  stage: number;
  stageName: string;
  neglected: boolean;
}
