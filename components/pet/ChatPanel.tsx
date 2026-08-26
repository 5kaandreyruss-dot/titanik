"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import type { PetViewData } from "@/components/pet/types";

interface ChatLine {
  id: string;
  role: "USER" | "PET";
  content: string;
}

export function ChatPanel({
  petName,
  onPetUpdate,
}: {
  petName: string;
  onPetUpdate: (pet: PetViewData) => void;
}) {
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get<{ messages: ChatLine[]; remainingFreeMessages: number | null }>("/api/pet/chat")
      .then((res) => {
        setMessages(res.messages);
        setRemaining(res.remainingFreeMessages);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, role: "USER", content: text }]);
    try {
      const res = await api.post<{ reply: string; pet: PetViewData; remainingFreeMessages: number | null }>(
        "/api/pet/chat",
        { message: text },
      );
      setMessages((prev) => [...prev, { id: `reply-${Date.now()}`, role: "PET", content: res.reply }]);
      setRemaining(res.remainingFreeMessages);
      onPetUpdate(res.pet);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не получилось отправить сообщение");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-2 p-3">
        {messages.length === 0 && (
          <p className="text-xs text-[var(--ink-dim)] text-center mt-4">Напиши {petName} что-нибудь</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm anim-fade-in-up ${
              m.role === "USER"
                ? "self-end bg-[var(--gold)] text-[#1a1408]"
                : "self-start bg-[var(--panel-soft)] border border-[var(--panel-border)]"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 p-3 border-t border-[var(--panel-border)]">
        <input
          className="flex-1 rounded border border-[var(--panel-border)] bg-black/30 px-3 py-2 text-sm text-[var(--ink)]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Сообщение..."
          maxLength={500}
          disabled={busy || remaining === 0}
        />
        <Button type="submit" variant="primary" disabled={busy || !input.trim() || remaining === 0}>
          →
        </Button>
      </form>
      {error && <p className="text-[var(--danger)] text-xs px-3 pb-2">{error}</p>}
      {remaining !== null && (
        <p className="text-[10px] text-[var(--ink-dim)] px-3 pb-2">
          {remaining === 0 ? "Сообщения на сегодня закончились" : `Осталось сообщений сегодня: ${remaining}`}
        </p>
      )}
    </div>
  );
}
