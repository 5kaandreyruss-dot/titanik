import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold text-[var(--gold)]">Leaderboard</h1>
      <LeaderboardView />
      <Link href="/menu" className="btn w-full max-w-md">Back to Menu</Link>
    </div>
  );
}
