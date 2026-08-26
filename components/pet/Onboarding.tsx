"use client";

import { useState, FormEvent } from "react";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { PetEgg } from "@/components/pet/PetRig";
import type { WorldTheme } from "@/lib/pet/types";
import type { PetViewData } from "@/components/pet/types";

const WORLDS: { id: WorldTheme; label: string; blurb: string; emoji: string }[] = [
  { id: "FANTASY", label: "Фэнтези", blurb: "драконы, магия, древние земли", emoji: "🐉" },
  { id: "SPACE", label: "Космос", blurb: "далёкие звёзды и странные существа", emoji: "🪐" },
  { id: "CYBERPUNK", label: "Киберпанк", blurb: "неон, дроны, цифровые души", emoji: "🤖" },
];

const EGG_PROMPT: Record<WorldTheme, string> = {
  FANTASY: "Я чувствую тебя сквозь скорлупу... Кто ты? Расскажи мне о себе.",
  SPACE: "Сигнал получен... я просыпаюсь. Кто говорит со мной? Расскажи о себе.",
  CYBERPUNK: "Ядро инициализировано... обнаружен пользователь. Кто ты?",
};

export function Onboarding({ onComplete }: { onComplete: (pet: PetViewData) => void }) {
  const [step, setStep] = useState<"world" | "name" | "egg">("world");
  const [world, setWorld] = useState<WorldTheme | null>(null);
  const [name, setName] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPet(e: FormEvent) {
    e.preventDefault();
    if (!world) return;
    setBusy(true);
    setError(null);
    try {
      await api.post<{ pet: PetViewData }>("/api/pet", { name, world });
      setStep("egg");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не получилось создать питомца");
    } finally {
      setBusy(false);
    }
  }

  async function sendFirstMessage(e: FormEvent) {
    e.preventDefault();
    if (!firstMessage.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ pet: PetViewData }>("/api/pet/chat", { message: firstMessage });
      onComplete(res.pet);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Что-то пошло не так");
    } finally {
      setBusy(false);
    }
  }

  if (step === "world") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="ambient-glow" />
        <Panel className="max-w-md w-full p-6 space-y-4 relative z-10 anim-pop-in">
          <h1 className="font-display text-2xl font-bold text-[var(--gold-bright)] text-center">Выбери мир</h1>
          <div className="flex flex-col gap-2">
            {WORLDS.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setWorld(w.id);
                  setStep("name");
                }}
                className="btn justify-start text-left"
              >
                <span className="text-xl">{w.emoji}</span>
                <span className="flex flex-col">
                  <span className="font-semibold">{w.label}</span>
                  <span className="text-xs text-[var(--ink-dim)] font-normal">{w.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="ambient-glow" />
        <Panel className="max-w-sm w-full p-6 space-y-4 relative z-10 anim-pop-in">
          <h1 className="font-display text-xl font-bold text-[var(--gold-bright)] text-center">Как назовём питомца?</h1>
          <form onSubmit={createPet} className="flex flex-col gap-3">
            <input
              autoFocus
              className="w-full rounded border border-[var(--panel-border)] bg-black/30 px-3 py-2 text-[var(--ink)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={1}
              maxLength={20}
              required
            />
            {error && <p className="text-[var(--danger)] text-sm">{error}</p>}
            <Button type="submit" variant="primary" disabled={busy}>
              Дальше
            </Button>
          </form>
        </Panel>
      </div>
    );
  }

  // step === "egg"
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="ambient-glow" />
      <Panel className="max-w-sm w-full p-6 space-y-4 relative z-10 anim-pop-in text-center">
        <div className="flex justify-center">{world && <PetEgg world={world} size={160} />}</div>
        <p className="text-[var(--ink-dim)] leading-relaxed">{world && EGG_PROMPT[world]}</p>
        <form onSubmit={sendFirstMessage} className="flex flex-col gap-3">
          <textarea
            autoFocus
            className="w-full rounded border border-[var(--panel-border)] bg-black/30 px-3 py-2 text-[var(--ink)] resize-none"
            rows={3}
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            placeholder="Напиши что-нибудь..."
            required
          />
          {error && <p className="text-[var(--danger)] text-sm">{error}</p>}
          <Button type="submit" variant="primary" disabled={busy}>
            Ответить
          </Button>
        </form>
      </Panel>
    </div>
  );
}
