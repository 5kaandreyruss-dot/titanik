import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getRemainingFreeRuns } from "@/lib/runLimit";
import { SubscriptionService } from "@/lib/subscription";
import { Panel } from "@/components/ui/Panel";
import { MenuActions } from "@/components/menu/MenuActions";

export default async function MenuPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activeRun = await prisma.gameRun.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
  const remainingFreeRuns = await getRemainingFreeRuns(user);
  const isPremium = SubscriptionService.isPremium(user);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-widest text-[var(--gold)]">TITANIC</h1>
        <p className="text-sm tracking-[0.3em] text-[var(--ink-dim)]">THE LAST CHANCE</p>
      </div>

      <Panel className="w-full max-w-sm">
        <p className="text-sm text-[var(--ink-dim)] mb-4">
          Signed in as <span className="text-[var(--ink)] font-medium">{user.nickname}</span>
          {isPremium ? <span className="text-[var(--gold)]"> · Premium</span> : null}
        </p>
        <MenuActions
          hasActiveRun={Boolean(activeRun)}
          activeRunId={activeRun?.id ?? null}
          remainingFreeRuns={remainingFreeRuns}
        />
      </Panel>
    </div>
  );
}
