import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { t } from "@/lib/i18n/types";
import { Panel } from "@/components/ui/Panel";

export default async function AchievementsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  const content = getContentRegistry();
  const unlocked = await prisma.playerAchievement.findMany({ where: { userId: user.id } });
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4 relative overflow-hidden">
      <div className="ambient-glow" />
      <h1 className="font-display text-xl font-semibold text-[var(--gold-bright)] relative z-10 anim-fade-in-up">{ui.achievementsPage.title}</h1>
      <div className="w-full max-w-md flex flex-col gap-2 relative z-10">
        {content.achievements.map((a, i) => {
          const isUnlocked = unlockedIds.has(a.id);
          const hidden = a.secret && !isUnlocked;
          return (
            <Panel
              key={a.id}
              className={`anim-fade-in-up ${isUnlocked ? "" : "opacity-50"}`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <p className="font-medium">{hidden ? ui.achievementsPage.hiddenName : t(a.name, locale)}</p>
              <p className="text-sm text-[var(--ink-dim)]">
                {hidden ? ui.achievementsPage.hiddenDescription : t(a.description, locale)}
              </p>
            </Panel>
          );
        })}
      </div>
      <Link href="/menu" className="btn w-full max-w-md relative z-10">{ui.achievementsPage.backToMenu}</Link>
    </div>
  );
}
