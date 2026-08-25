"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { getUiDictionary } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/types";

export function MenuActions({
  hasActiveRun,
  activeRunId,
  remainingFreeRuns,
  locale,
}: {
  hasActiveRun: boolean;
  activeRunId: string | null;
  remainingFreeRuns: number | null;
  locale: Locale;
}) {
  const ui = getUiDictionary(locale);
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
      setError(e instanceof ApiError ? e.message : ui.errors.somethingWrong);
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
          {ui.menu.continueRun}
        </Button>
      )}
      <Button variant={hasActiveRun ? "default" : "primary"} onClick={startNewRun} disabled={busy || outOfRuns}>
        {ui.menu.newRun} {remainingFreeRuns !== null && ui.menu.runsLeftToday(remainingFreeRuns)}
      </Button>
      {error && <p className="text-[var(--danger)] text-sm">{error}</p>}
      {outOfRuns && (
        <p className="text-xs text-[var(--ink-dim)]">
          {ui.menu.outOfRunsToday} <Link href="/premium" className="text-[var(--gold)] underline">{ui.menu.goPremium}</Link>
        </p>
      )}
      <Link href="/profile" className="btn">{ui.menu.profile}</Link>
      <Link href="/achievements" className="btn">{ui.menu.achievements}</Link>
      <Link href="/leaderboard" className="btn">{ui.menu.leaderboard}</Link>
      <Link href="/archive" className="btn">{ui.menu.knowledgeArchive}</Link>
      <Link href="/premium" className="btn">{ui.menu.premium}</Link>
      <Button variant="danger" onClick={logout}>{ui.menu.logout}</Button>
    </div>
  );
}
