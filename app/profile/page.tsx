import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionService } from "@/lib/subscription";
import { getContentRegistry } from "@/lib/content";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { Panel } from "@/components/ui/Panel";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  const [totalRuns, finishedRuns, achievementsCount, discoveriesCount, leaderboardEntries] = await Promise.all([
    prisma.gameRun.count({ where: { userId: user.id } }),
    prisma.gameRun.findMany({ where: { userId: user.id, status: "FINISHED" }, select: { endingId: true } }),
    prisma.playerAchievement.count({ where: { userId: user.id } }),
    prisma.discovery.count({ where: { userId: user.id } }),
    prisma.leaderboardEntry.findMany({ where: { userId: user.id } }),
  ]);

  const content = getContentRegistry();
  const survivals = finishedRuns.filter((r) => {
    const ending = r.endingId ? content.endingsById[r.endingId] : null;
    return ending?.category === "positive" || ending?.category === "neutral";
  }).length;
  const peopleRescued = leaderboardEntries.reduce((sum, e) => sum + e.peopleRescued, 0);
  const endingsDiscovered = new Set(finishedRuns.map((r) => r.endingId).filter(Boolean)).size;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4 relative overflow-hidden">
      <div className="ambient-glow" />
      <Panel className="w-full max-w-md relative z-10 anim-fade-in-up">
        <h1 className="font-display text-xl font-semibold text-[var(--gold-bright)] mb-1">{user.nickname}</h1>
        <p className="text-sm text-[var(--ink-dim)] mb-4">
          {SubscriptionService.isPremium(user) ? ui.profile.premiumMember : ui.profile.freeAccount}
        </p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Stat label={ui.profile.totalRuns} value={totalRuns} />
          <Stat label={ui.profile.survivals} value={survivals} />
          <Stat label={ui.profile.peopleRescued} value={peopleRescued} />
          <Stat label={ui.profile.endingsFound} value={endingsDiscovered} />
          <Stat label={ui.profile.achievementsLabel} value={achievementsCount} />
          <Stat label={ui.profile.knowledgeEntries} value={discoveriesCount} />
        </dl>
      </Panel>
      <Link href="/menu" className="btn w-full max-w-md relative z-10">{ui.profile.backToMenu}</Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[var(--ink-dim)] text-xs uppercase">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
}
