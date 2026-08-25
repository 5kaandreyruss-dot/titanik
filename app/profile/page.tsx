import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionService } from "@/lib/subscription";
import { getContentRegistry } from "@/lib/content";
import { Panel } from "@/components/ui/Panel";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

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
    <div className="min-h-screen p-4 flex flex-col items-center gap-4">
      <Panel className="w-full max-w-md">
        <h1 className="text-xl font-semibold text-[var(--gold)] mb-1">{user.nickname}</h1>
        <p className="text-sm text-[var(--ink-dim)] mb-4">
          {SubscriptionService.isPremium(user) ? "Premium member" : "Free account"}
        </p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Total Runs" value={totalRuns} />
          <Stat label="Survivals" value={survivals} />
          <Stat label="People Rescued" value={peopleRescued} />
          <Stat label="Endings Found" value={endingsDiscovered} />
          <Stat label="Achievements" value={achievementsCount} />
          <Stat label="Knowledge Entries" value={discoveriesCount} />
        </dl>
      </Panel>
      <Link href="/menu" className="btn w-full max-w-md">Back to Menu</Link>
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
