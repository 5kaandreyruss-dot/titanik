export type TraitKey = "curious" | "gentle" | "aggressive" | "lazy" | "brave";

export const TRAIT_KEYS: TraitKey[] = ["curious", "gentle", "aggressive", "lazy", "brave"];

export type Personality = Record<TraitKey, number>;

export interface PetStats {
  trust: number;
  intelligence: number;
  strength: number;
  energy: number;
  hunger: number;
}

export type WorldTheme = "FANTASY" | "SPACE" | "CYBERPUNK";
