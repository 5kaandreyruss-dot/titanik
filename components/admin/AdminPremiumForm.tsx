"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { getUiDictionary } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/types";

export function AdminPremiumForm({ locale }: { locale: Locale }) {
  const ui = getUiDictionary(locale);
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submit(action: "activate" | "deactivate") {
    setStatus(null);
    try {
      await api.post("/api/admin/premium", { nickname, action, untilDays: 365 });
      setStatus(action === "activate" ? ui.admin.activated(nickname) : ui.admin.deactivated(nickname));
    } catch (err) {
      setStatus(err instanceof ApiError ? err.message : ui.admin.failed);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        className="rounded border border-[var(--panel-border)] bg-black/30 px-3 py-2"
        placeholder={ui.admin.nicknamePlaceholder}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="button" variant="primary" onClick={() => submit("activate")}>{ui.admin.activate}</Button>
        <Button type="button" variant="danger" onClick={() => submit("deactivate")}>{ui.admin.deactivate}</Button>
      </div>
      {status && <p className="text-sm text-[var(--ink-dim)]">{status}</p>}
    </div>
  );
}
