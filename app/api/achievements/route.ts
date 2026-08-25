import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";

export async function GET() {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const content = getContentRegistry();
  const unlocked = await prisma.playerAchievement.findMany({ where: { userId: user.id } });
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  const achievements = content.achievements.map((a) => {
    const isUnlocked = unlockedIds.has(a.id);
    if (a.secret && !isUnlocked) {
      return { id: a.id, name: "???", description: "A hidden achievement.", secret: true, unlocked: false };
    }
    return { id: a.id, name: a.name, description: a.description, secret: a.secret, unlocked: isUnlocked };
  });

  return NextResponse.json({ achievements });
}
