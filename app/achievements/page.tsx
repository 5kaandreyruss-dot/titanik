import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { Panel } from "@/components/ui/Panel";

export default async function AchievementsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const content = getContentRegistry();
  const unlocked = await prisma.playerAchievement.findMany({ where: { userId: user.id } });
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold text-[var(--gold)]">Achievements</h1>
      <div className="w-full max-w-md flex flex-col gap-2">
        {content.achievements.map((a) => {
          const isUnlocked = unlockedIds.has(a.id);
          const hidden = a.secret && !isUnlocked;
          return (
            <Panel key={a.id} className={isUnlocked ? "" : "opacity-50"}>
              <p className="font-medium">{hidden ? "???" : a.name}</p>
              <p className="text-sm text-[var(--ink-dim)]">{hidden ? "A hidden achievement." : a.description}</p>
            </Panel>
          );
        })}
      </div>
      <Link href="/menu" className="btn w-full max-w-md">Back to Menu</Link>
    </div>
  );
}
