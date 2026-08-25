import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionService } from "@/lib/subscription";
import { getContentRegistry } from "@/lib/content";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { t } from "@/lib/i18n/types";

export async function GET() {
  const locale = await getLocale();
  const ui = getUiDictionary(locale);
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: ui.errors.notAuthenticated }, { status: 401 });

  const [totalRuns, finishedRuns, achievements, discoveries, leaderboardEntries] = await Promise.all([
    prisma.gameRun.count({ where: { userId: user.id } }),
    prisma.gameRun.findMany({
      where: { userId: user.id, status: "FINISHED" },
      select: { endingId: true },
    }),
    prisma.playerAchievement.findMany({
      where: { userId: user.id },
      orderBy: { unlockedAt: "desc" },
    }),
    prisma.discovery.findMany({ where: { userId: user.id } }),
    prisma.leaderboardEntry.findMany({ where: { userId: user.id } }),
  ]);

  const content = getContentRegistry();
  const survivals = finishedRuns.filter((r) => {
    const ending = r.endingId ? content.endingsById[r.endingId] : null;
    return ending?.category === "positive" || ending?.category === "neutral";
  }).length;

  const peopleRescued = leaderboardEntries.reduce((sum, e) => sum + e.peopleRescued, 0);
  const endingsDiscovered = new Set(finishedRuns.map((r) => r.endingId).filter(Boolean)).size;

  return NextResponse.json({
    nickname: user.nickname,
    isPremium: SubscriptionService.isPremium(user),
    premiumUntil: user.premiumUntil,
    totalRuns,
    survivals,
    peopleRescued,
    endingsDiscovered,
    achievements: achievements.map((a) => {
      const def = content.achievementsById[a.achievementId];
      return {
        id: a.achievementId,
        name: def ? t(def.name, locale) : a.achievementId,
        description: def ? t(def.description, locale) : "",
        secret: def?.secret ?? false,
        unlockedAt: a.unlockedAt,
      };
    }),
    knowledgeDiscoveredCount: discoveries.length,
  });
}
