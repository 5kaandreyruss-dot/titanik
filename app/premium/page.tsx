import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SubscriptionService } from "@/lib/subscription";
import { Panel } from "@/components/ui/Panel";

export default async function PremiumPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isPremium = SubscriptionService.isPremium(user);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-4">
      <Panel className="w-full max-w-md text-center">
        <h1 className="text-xl font-semibold text-[var(--gold)] mb-2">Premium</h1>
        {isPremium ? (
          <p className="text-[var(--positive)]">You already have Premium. Thank you for supporting the ship.</p>
        ) : (
          <>
            <p className="text-[var(--ink-dim)] mb-3">
              Premium unlocks unlimited daily runs and additional story content — alternative
              characters, extra investigations, and special campaigns. It never changes stats,
              odds, or gives you answers: everyone plays the same fair game.
            </p>
            <p className="text-sm text-[var(--ink-dim)]">Premium is coming soon.</p>
          </>
        )}
      </Panel>
      <Link href="/menu" className="btn w-full max-w-md">Back to Menu</Link>
    </div>
  );
}
