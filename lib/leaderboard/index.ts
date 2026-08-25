import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { GameRun, User } from "@prisma/client";
import type { GameRunState } from "@/lib/engine/types";
import { getContentRegistry } from "@/lib/content";

export async function recordLeaderboardEntry(
  user: User,
  gameRun: GameRun,
  state: GameRunState,
): Promise<void> {
  const content = getContentRegistry();
  const totalLocations = content.locations.length;
  const discovered = Object.values(state.locations).filter((l) => l.discovered).length;
  const explorationPercent = totalLocations > 0 ? Math.round((discovered / totalLocations) * 100) : 0;

  const achievementsCount = await prisma.playerAchievement.count({ where: { userId: user.id } });

  const ending = state.ending ? content.endingsById[state.ending] : null;
  const survived = ending?.category === "positive" || ending?.category === "neutral";
  const heroic = ending?.category === "positive";

  const durationMinutes = Math.round((Date.now() - gameRun.createdAt.getTime()) / 60000);

  await prisma.leaderboardEntry.upsert({
    where: { gameRunId: gameRun.id },
    create: {
      userId: user.id,
      gameRunId: gameRun.id,
      nickname: user.nickname,
      peopleRescued: state.rescuedPeople.length,
      explorationPercent,
      secretsDiscovered: state.knowledge.length,
      survived,
      heroicEnding: heroic,
      durationMinutes,
      achievementsCount,
    },
    update: {
      peopleRescued: state.rescuedPeople.length,
      explorationPercent,
      secretsDiscovered: state.knowledge.length,
      survived,
      heroicEnding: heroic,
      durationMinutes,
      achievementsCount,
    },
  });
}
