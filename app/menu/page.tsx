import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getRemainingFreeRuns } from "@/lib/runLimit";
import { SubscriptionService } from "@/lib/subscription";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { Panel } from "@/components/ui/Panel";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { MenuActions } from "@/components/menu/MenuActions";

export default async function MenuPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  const activeRun = await prisma.gameRun.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
  const remainingFreeRuns = await getRemainingFreeRuns(user);
  const isPremium = SubscriptionService.isPremium(user);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 relative overflow-hidden">
      <div className="ambient-glow" />
      <LocaleSwitcher locale={locale} className="absolute top-4 right-4 z-10" />
      <div className="text-center relative z-10 anim-fade-in-up">
        <h1 className="font-display text-3xl font-bold tracking-widest text-[var(--gold-bright)]">{ui.landing.title}</h1>
        <p className="text-sm tracking-[0.3em] text-[var(--ink-dim)]">{ui.landing.subtitle}</p>
      </div>

      <Panel className="w-full max-w-sm relative z-10 anim-fade-in-up">
        <p className="text-sm text-[var(--ink-dim)] mb-4">
          {ui.menu.signedInAs} <span className="text-[var(--ink)] font-medium">{user.nickname}</span>
          {isPremium ? <span className="text-[var(--gold)]"> · {ui.menu.premiumBadge}</span> : null}
        </p>
        <MenuActions
          hasActiveRun={Boolean(activeRun)}
          activeRunId={activeRun?.id ?? null}
          remainingFreeRuns={remainingFreeRuns}
          locale={locale}
        />
      </Panel>
    </div>
  );
}
