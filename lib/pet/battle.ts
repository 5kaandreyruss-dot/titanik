import type { Personality } from "./types";

export type BattleMove = "ATTACK" | "DEFEND" | "DODGE";

function rand(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

/** Weighted random move based on personality — used for the "ask pet to decide" option, no AI call needed. */
export function suggestMove(personality: Personality): BattleMove {
  const weights: Record<BattleMove, number> = {
    ATTACK: personality.aggressive + personality.brave,
    DEFEND: personality.lazy + personality.gentle * 0.5,
    DODGE: personality.curious + personality.gentle * 0.5,
  };
  const total = weights.ATTACK + weights.DEFEND + weights.DODGE || 1;
  let r = Math.random() * total;
  for (const move of Object.keys(weights) as BattleMove[]) {
    if (r < weights[move]) return move;
    r -= weights[move];
  }
  return "ATTACK";
}

export interface RoundResult {
  petDamageDealt: number;
  monsterDamageDealt: number;
  quip: string;
}

export function resolveRound(move: BattleMove, monsterLevel: number): RoundResult {
  const baseMonsterDmg = 10 + monsterLevel * 2;
  if (move === "ATTACK") {
    return {
      petDamageDealt: rand(15, 25),
      monsterDamageDealt: rand(Math.round(baseMonsterDmg * 0.8), Math.round(baseMonsterDmg * 1.1)),
      quip: "Атакую!",
    };
  }
  if (move === "DEFEND") {
    return {
      petDamageDealt: rand(3, 8),
      monsterDamageDealt: rand(Math.round(baseMonsterDmg * 0.25), Math.round(baseMonsterDmg * 0.45)),
      quip: "Держу оборону.",
    };
  }
  const dodged = Math.random() < 0.5;
  return {
    petDamageDealt: rand(5, 10),
    monsterDamageDealt: dodged ? 0 : rand(Math.round(baseMonsterDmg * 0.8), Math.round(baseMonsterDmg * 1.1)),
    quip: dodged ? "Увернулся!" : "Не успел увернуться...",
  };
}
