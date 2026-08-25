import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/menu");

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 text-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-widest text-[var(--gold)]">TITANIC</h1>
        <p className="text-sm sm:text-base tracking-[0.4em] text-[var(--ink-dim)] mt-2">THE LAST CHANCE</p>
      </div>
      <p className="max-w-sm text-[var(--ink-dim)] leading-relaxed">
        April 14, 1912. Explore. Talk. Investigate. Remember. Make decisions — and live with
        the consequences.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/register" className="btn btn-primary">
          New Account
        </Link>
        <Link href="/login" className="btn">
          Sign In
        </Link>
      </div>
    </div>
  );
}
