"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
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
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Что-то пошло не так, попробуй ещё раз");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative">
      <Panel className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-[var(--gold)] mb-4">
          {mode === "login" ? "Вход" : "Создать аккаунт"}
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-[var(--ink-dim)]">
            Никнейм
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
            Пароль
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
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </Button>
        </form>
      </Panel>
    </div>
  );
}
