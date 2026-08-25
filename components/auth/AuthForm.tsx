"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { getUiDictionary } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/types";

export function AuthForm({ mode, locale }: { mode: "login" | "register"; locale: Locale }) {
  const ui = getUiDictionary(locale);
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post(`/api/auth/${mode}`, { nickname, password });
      router.push("/menu");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : ui.errors.somethingWrong);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative">
      <LocaleSwitcher locale={locale} className="absolute top-4 right-4" />
      <Panel className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-[var(--gold)] mb-4">
          {mode === "login" ? ui.auth.signInTitle : ui.auth.createAccountTitle}
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-[var(--ink-dim)]">
            {ui.auth.nickname}
            <input
              className="mt-1 w-full rounded border border-[var(--panel-border)] bg-black/30 px-3 py-2 text-[var(--ink)]"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              minLength={3}
              maxLength={20}
              required
            />
          </label>
          <label className="text-sm text-[var(--ink-dim)]">
            {ui.auth.password}
            <input
              type="password"
              className="mt-1 w-full rounded border border-[var(--panel-border)] bg-black/30 px-3 py-2 text-[var(--ink)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>
          {error && <p className="text-[var(--danger)] text-sm">{error}</p>}
          <Button type="submit" variant="primary" disabled={busy}>
            {mode === "login" ? ui.auth.signInButton : ui.auth.createAccountButton}
          </Button>
        </form>
      </Panel>
    </div>
  );
}
