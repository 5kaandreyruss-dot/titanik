import { TRAIT_KEYS, type Personality, type TraitKey } from "./types";

export function initialPersonality(): Personality {
  return { curious: 0.2, gentle: 0.2, aggressive: 0.2, lazy: 0.2, brave: 0.2 };
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function normalize(p: Personality): Personality {
  const sum = TRAIT_KEYS.reduce((acc, k) => acc + p[k], 0);
  if (sum <= 0) return initialPersonality();
  const next = {} as Personality;
  for (const k of TRAIT_KEYS) next[k] = p[k] / sum;
  return next;
}

export function dominantTrait(p: Personality): TraitKey {
  return TRAIT_KEYS.reduce((best, k) => (p[k] > p[best] ? k : best), TRAIT_KEYS[0]);
}

/** Nudges the trait vector toward a signal (partial deltas), then renormalizes so it keeps summing to ~1. */
export function driftPersonality(p: Personality, signal: Partial<Record<TraitKey, number>>): Personality {
  const next = { ...p };
  for (const key of TRAIT_KEYS) {
    const delta = signal[key];
    if (delta) next[key] = clamp01(next[key] + delta);
  }
  return normalize(next);
}

const KEYWORD_SIGNALS: { pattern: RegExp; signal: Partial<Record<TraitKey, number>> }[] = [
  { pattern: /дур[ае]к|тупой|заткнись|ненавижу|бесишь|идиот/i, signal: { aggressive: 0.06, gentle: -0.03 } },
  { pattern: /спасибо|люблю|молодец|хорош[а-я]*|умница|милый/i, signal: { gentle: 0.06 } },
  { pattern: /почему|как ты|что такое|расскажи|интересно|зачем/i, signal: { curious: 0.06 } },
  { pattern: /бой|сражай|вперёд|вперед|не боюсь|атаку/i, signal: { brave: 0.06, aggressive: 0.02 } },
  { pattern: /устал|отдохни|не хочу|лень|потом/i, signal: { lazy: 0.06 } },
];

/** Very lightweight, deterministic, zero-cost classifier — no extra AI call needed just to nudge personality. */
export function classifyMessage(text: string): Partial<Record<TraitKey, number>> {
  const signal: Partial<Record<TraitKey, number>> = {};
  for (const { pattern, signal: s } of KEYWORD_SIGNALS) {
    if (pattern.test(text)) {
      for (const [k, v] of Object.entries(s) as [TraitKey, number][]) {
        signal[k] = (signal[k] ?? 0) + v;
      }
    }
  }
  return signal;
}

const TRAIT_LABELS_RU: Record<TraitKey, string> = {
  curious: "любопытный",
  gentle: "добрый",
  aggressive: "дерзкий",
  lazy: "ленивый",
  brave: "смелый",
};

/** e.g. "70% любопытный, 20% ленивый, 10% дерзкий" — top 3 traits by weight. */
export function personalityDescription(p: Personality): string {
  return [...TRAIT_KEYS]
    .sort((a, b) => p[b] - p[a])
    .slice(0, 3)
    .filter((k) => p[k] > 0.05)
    .map((k) => `${Math.round(p[k] * 100)}% ${TRAIT_LABELS_RU[k]}`)
    .join(", ");
}
