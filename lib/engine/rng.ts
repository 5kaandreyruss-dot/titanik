// Deterministic, seeded RNG so every GameRun is reproducible from its seed +
// action counter. xorshift32 — fast, small, sufficient for gameplay rolls
// (NOT cryptographic; do not use for tokens/secrets).

export function seedFromString(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0 || 1;
}

export class SeededRng {
  private state: number;

  constructor(seed: string, counter: number) {
    // Mix seed and counter so each action draws from a distinct stream
    // position while remaining fully reproducible.
    this.state = (seedFromString(seed) ^ Math.imul(counter + 1, 0x9e3779b9)) >>> 0 || 1;
  }

  /** Returns a float in [0, 1). */
  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    this.state = x;
    return x / 0xffffffff;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
}

export function generateRunSeed(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}
