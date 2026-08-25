"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";

export function AdminPremiumForm() {
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submit(action: "activate" | "deactivate") {
    setStatus(null);
    try {
      await api.post("/api/admin/premium", { nickname, action, untilDays: 365 });
      setStatus(`${action === "activate" ? "Activated" : "Deactivated"} Premium for ${nickname}.`);
    } catch (err) {
      setStatus(err instanceof ApiError ? err.message : "Failed.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        className="rounded border border-[var(--panel-border)] bg-black/30 px-3 py-2"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="button" variant="primary" onClick={() => submit("activate")}>Activate</Button>
        <Button type="button" variant="danger" onClick={() => submit("deactivate")}>Deactivate</Button>
      </div>
      {status && <p className="text-sm text-[var(--ink-dim)]">{status}</p>}
    </div>
  );
}
