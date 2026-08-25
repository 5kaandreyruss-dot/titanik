import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { t } from "@/lib/i18n/types";

export async function GET() {
  const locale = await getLocale();
  const ui = getUiDictionary(locale);
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: ui.errors.notAuthenticated }, { status: 401 });

  const content = getContentRegistry();
  const unlocked = await prisma.playerAchievement.findMany({ where: { userId: user.id } });
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  const achievements = content.achievements.map((a) => {
    const isUnlocked = unlockedIds.has(a.id);
    if (a.secret && !isUnlocked) {
      return { id: a.id, name: ui.achievementsPage.hiddenName, description: ui.achievementsPage.hiddenDescription, secret: true, unlocked: false };
    }
    return { id: a.id, name: t(a.name, locale), description: t(a.description, locale), secret: a.secret, unlocked: isUnlocked };
  });

  return NextResponse.json({ achievements });
}
