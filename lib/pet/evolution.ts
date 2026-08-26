import { dominantTrait } from "./personality";
import type { Personality, WorldTheme } from "./types";

export type EvolutionBranch = "light" | "dark" | "neutral";

export interface StageInfo {
  stage: number;
  name: string;
  branch: EvolutionBranch;
}

/** Stage gate: age (in days since born) plus a trust floor, so neglect can stunt growth. */
export function computeStage(ageDays: number, trust: number): number {
  if (ageDays < 1) return 0;
  if (ageDays < 3 || trust < 25) return 1;
  if (ageDays < 7 || trust < 45) return 2;
  return 3;
}

function branchFromPersonality(personality: Personality): EvolutionBranch {
  const dominant = dominantTrait(personality);
  if (dominant === "aggressive") return "dark";
  if (dominant === "gentle" || dominant === "curious") return "light";
  return "neutral";
}

const STAGE_NAMES: Record<WorldTheme, Record<number, Partial<Record<EvolutionBranch, string>>>> = {
  FANTASY: {
    0: { neutral: "Яйцо" },
    1: { neutral: "Детёныш дракона" },
    2: { neutral: "Молодой дракон" },
    3: { light: "Небесный дракон", dark: "Демонический дракон", neutral: "Древний дракон" },
  },
  SPACE: {
    0: { neutral: "Звёздная капсула" },
    1: { neutral: "Космический малыш" },
    2: { neutral: "Юное создание" },
    3: { light: "Хранитель звёзд", dark: "Тёмная материя", neutral: "Древний странник" },
  },
  CYBERPUNK: {
    0: { neutral: "Модуль ядра" },
    1: { neutral: "Дрон-малыш" },
    2: { neutral: "Боевой юнит" },
    3: { light: "Синтетик-ангел", dark: "Протокол-изгой", neutral: "Древний ИИ" },
  },
};

export function computeStageInfo(world: WorldTheme, ageDays: number, trust: number, personality: Personality): StageInfo {
  const stage = computeStage(ageDays, trust);
  const branch = stage === 3 ? branchFromPersonality(personality) : "neutral";
  const names = STAGE_NAMES[world][stage];
  const name = names[branch] ?? names.neutral ?? "???";
  return { stage, name, branch };
}
