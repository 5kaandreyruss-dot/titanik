import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import type { GameRunState } from "@/lib/engine/types";

/**
 * Checks all achievement definitions against the current run state and
 * persists any newly-unlocked ones server-side (spec #28, #42 — never
 * trust the client for achievement unlocks). Safe to call after every
 * action; already-unlocked achievements are skipped via the unique
 * (userId, achievementId) constraint.
 */
export async function checkAndUnlockAchievements(
  userId: string,
  gameRunId: string,
  state: GameRunState,
): Promise<string[]> {
  const content = getContentRegistry();
  const already = await prisma.playerAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const alreadyIds = new Set(already.map((a) => a.achievementId));

  const newlyUnlocked: string[] = [];
  for (const achievement of content.achievements) {
    if (alreadyIds.has(achievement.id)) continue;
    if (achievement.check({ state })) {
      newlyUnlocked.push(achievement.id);
    }
  }

  if (newlyUnlocked.length > 0) {
    await prisma.achievement.createMany({
      data: content.achievements
        .filter((a) => newlyUnlocked.includes(a.id))
        .map((a) => ({ id: a.id, name: a.name, description: a.description, secret: a.secret })),
      skipDuplicates: true,
    });
    await prisma.playerAchievement.createMany({
      data: newlyUnlocked.map((achievementId) => ({ userId, achievementId, gameRunId })),
      skipDuplicates: true,
    });
  }

  return newlyUnlocked;
}
