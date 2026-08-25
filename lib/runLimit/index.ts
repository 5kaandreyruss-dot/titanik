import "server-only";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionService } from "@/lib/subscription";
import { getContentRegistry } from "@/lib/content";
import { createInitialState } from "@/lib/engine/state";
import { generateRunSeed } from "@/lib/engine/rng";
import type { User, GameRun } from "@prisma/client";

export const FREE_RUNS_PER_DAY = 2;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export class RunLimitError extends Error {}

/**
 * Server-authoritative enforcement of the free-tier daily run limit (spec
 * #31, #68). Never trust client state for this. A new run consumes a slot
 * immediately at creation (atomically, via a serializable transaction) so
 * repeatedly starting/abandoning runs cannot be used to bypass the limit.
 */
export async function createNewRun(user: User, archetypeId?: string): Promise<GameRun> {
  const isPremium = SubscriptionService.isPremium(user);
  const dayStart = startOfUtcDay(new Date());

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          if (!isPremium) {
            const count = await tx.gameRun.count({
              where: { userId: user.id, createdAt: { gte: dayStart } },
            });
            if (count >= FREE_RUNS_PER_DAY) {
              throw new RunLimitError("Daily free run limit reached");
            }
          }

          const content = getContentRegistry();
          const seed = generateRunSeed();
          const state = createInitialState(content, seed, { archetypeId });

          return tx.gameRun.create({
            data: {
              userId: user.id,
              seed,
              archetypeId: state.characterArchetypeId,
              stateJson: state as unknown as object,
            },
          });
        },
        { isolationLevel: "Serializable" },
      );
    } catch (err) {
      if (err instanceof RunLimitError) throw err;
      const isSerializationConflict =
        typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P2034";
      if (isSerializationConflict && attempt < 2) continue;
      throw err;
    }
  }
  throw new Error("Could not create run after retries");
}

export async function getRemainingFreeRuns(user: User): Promise<number | null> {
  if (SubscriptionService.isPremium(user)) return null; // unlimited
  const dayStart = startOfUtcDay(new Date());
  const count = await prisma.gameRun.count({
    where: { userId: user.id, createdAt: { gte: dayStart } },
  });
  return Math.max(0, FREE_RUNS_PER_DAY - count);
}
