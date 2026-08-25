import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SubscriptionService } from "@/lib/subscription";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { Panel } from "@/components/ui/Panel";

export default async function PremiumPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);
  const isPremium = SubscriptionService.isPremium(user);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      <div className="ambient-glow" />
      <Panel className="w-full max-w-md text-center relative z-10 anim-fade-in-up">
        <h1 className="font-display text-xl font-semibold text-[var(--gold-bright)] mb-2">{ui.premium.title}</h1>
        {isPremium ? (
          <p className="text-[var(--positive)]">{ui.premium.alreadyPremium}</p>
        ) : (
          <>
            <p className="text-[var(--ink-dim)] mb-3">{ui.premium.description}</p>
            <p className="text-sm text-[var(--ink-dim)]">{ui.premium.comingSoon}</p>
          </>
        )}
      </Panel>
      <Link href="/menu" className="btn w-full max-w-md relative z-10">{ui.premium.backToMenu}</Link>
    </div>
  );
}
