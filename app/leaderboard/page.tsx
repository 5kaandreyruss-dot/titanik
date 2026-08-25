import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4 relative overflow-hidden">
      <div className="ambient-glow" />
      <h1 className="font-display text-xl font-semibold text-[var(--gold-bright)] relative z-10 anim-fade-in-up">{ui.leaderboard.title}</h1>
      <div className="relative z-10 anim-fade-in-up w-full flex flex-col items-center gap-4">
        <LeaderboardView locale={locale} />
        <Link href="/menu" className="btn w-full max-w-md">{ui.leaderboard.backToMenu}</Link>
      </div>
    </div>
  );
}
