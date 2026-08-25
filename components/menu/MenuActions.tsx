"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";

export function MenuActions({
  hasActiveRun,
  activeRunId,
  remainingFreeRuns,
}: {
  hasActiveRun: boolean;
  activeRunId: string | null;
  remainingFreeRuns: number | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startNewRun() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ runId: string }>("/api/game/runs");
      router.push(`/play/${res.runId}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not start a new run.");
      setBusy(false);
    }
  }

  async function logout() {
    await api.post("/api/auth/logout");
    router.push("/login");
    router.refresh();
  }

  const outOfRuns = remainingFreeRuns === 0;

  return (
    <div className="flex flex-col gap-2">
      {hasActiveRun && activeRunId && (
        <Button variant="primary" onClick={() => router.push(`/play/${activeRunId}`)}>
          Continue
        </Button>
      )}
      <Button variant={hasActiveRun ? "default" : "primary"} onClick={startNewRun} disabled={busy || outOfRuns}>
        New Run {remainingFreeRuns !== null && ` (${remainingFreeRuns} left today)`}
      </Button>
      {error && <p className="text-[var(--danger)] text-sm">{error}</p>}
      {outOfRuns && (
        <p className="text-xs text-[var(--ink-dim)]">
          Out of free runs for today. <Link href="/premium" className="text-[var(--gold)] underline">Go Premium</Link> for unlimited runs.
        </p>
      )}
      <Link href="/profile" className="btn">Profile</Link>
      <Link href="/achievements" className="btn">Achievements</Link>
      <Link href="/leaderboard" className="btn">Leaderboard</Link>
      <Link href="/archive" className="btn">Knowledge Archive</Link>
      <Link href="/premium" className="btn">Premium</Link>
      <Button variant="danger" onClick={logout}>Logout</Button>
    </div>
  );
}
