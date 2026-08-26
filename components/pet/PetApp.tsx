"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PetRig, type PetMood } from "@/components/pet/PetRig";
import { StatBar } from "@/components/pet/StatBar";
import { ChatPanel } from "@/components/pet/ChatPanel";
import { BattleModal } from "@/components/pet/BattleModal";
import { Onboarding } from "@/components/pet/Onboarding";
import type { PetViewData } from "@/components/pet/types";
import { dominantTrait } from "@/lib/pet/personality";

function deriveMood(pet: PetViewData): PetMood {
  if (pet.stats.trust <= 20) return "sad";
  if (pet.stats.hunger <= 20) return "hungry";
  if (pet.stats.energy <= 20) return "sleepy";
  if (pet.stats.trust >= 70) return "happy";
  return "idle";
}

function branchFor(pet: PetViewData): "light" | "dark" | "neutral" {
  if (pet.stage < 3) return "neutral";
  const d = dominantTrait(pet.personality);
  if (d === "aggressive") return "dark";
  if (d === "gentle" || d === "curious") return "light";
  return "neutral";
}

export function PetApp({ nickname, crystals: initialCrystals }: { nickname: string; crystals: number }) {
  const router = useRouter();
  const [pet, setPet] = useState<PetViewData | null | undefined>(undefined);
  const [crystals, setCrystals] = useState(initialCrystals);
  const [modal, setModal] = useState<"chat" | "battle" | "shop" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ pet: PetViewData | null }>("/api/pet")
      .then((res) => setPet(res.pet))
      .catch(() => setPet(null));
  }, []);

  async function doAction(type: "FEED" | "PLAY" | "TRAIN") {
    if (busy || !pet) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ pet: PetViewData }>("/api/pet/action", { type });
      setPet(res.pet);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не получилось");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await api.post("/api/auth/logout");
    router.push("/login");
    router.refresh();
  }

  if (pet === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--ink-dim)] text-sm">Загрузка...</p>
      </div>
    );
  }

  if (pet === null) {
    return <Onboarding onComplete={setPet} />;
  }

  const mood = deriveMood(pet);
  const branch = branchFor(pet);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-[var(--bg-deep)] relative">
      <div className="ambient-glow" />
      <header className="flex items-center justify-between px-4 py-3 relative z-10">
        <p className="text-sm text-[var(--ink-dim)]">
          <span className="text-[var(--ink)] font-medium">{nickname}</span>
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--gold-bright)]">💎 {crystals}</span>
          <button onClick={() => setModal("shop")} className="btn text-xs px-2 py-1">
            Магазин
          </button>
          <button onClick={logout} className="text-[var(--ink-dim)] text-xs underline">
            Выйти
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 relative z-10 gap-3">
        <div className="text-center anim-fade-in-up">
          <p className="text-xs uppercase tracking-widest text-[var(--ink-dim)]">{pet.stageName}</p>
          <h1 className="font-display text-2xl font-bold text-[var(--gold-bright)]">{pet.name}</h1>
          <p className="text-xs text-[var(--ink-dim)]">Возраст: {pet.ageDays} дн.</p>
        </div>

        <div className="anim-pop-in">
          <PetRig world={pet.world} stage={pet.stage} branch={branch} mood={mood} size={220} />
        </div>

        {pet.neglected && (
          <p className="text-sm text-[var(--danger)] text-center max-w-xs anim-fade-in-up">
            {pet.name} совсем загрустил и перестал тебе доверять... Позаботься о нём, чтобы всё исправить.
          </p>
        )}

        <div className="panel p-4 w-full max-w-sm space-y-2.5">
          <StatBar label="Доверие" value={pet.stats.trust} color="var(--positive)" />
          <StatBar label="Сытость" value={pet.stats.hunger} color="var(--gold)" />
          <StatBar label="Энергия" value={pet.stats.energy} color="var(--gold-bright)" />
          <StatBar label="Интеллект" value={pet.stats.intelligence} color="#8fe3ff" />
          <StatBar label="Сила" value={pet.stats.strength} color="var(--danger)" />
        </div>

        {error && <p className="text-[var(--danger)] text-sm">{error}</p>}
      </main>

      <nav className="grid grid-cols-5 gap-1.5 p-3 relative z-10">
        <Button onClick={() => doAction("FEED")} disabled={busy} className="text-xs px-1">
          🍖 Кормить
        </Button>
        <Button onClick={() => doAction("PLAY")} disabled={busy} className="text-xs px-1">
          🎾 Играть
        </Button>
        <Button onClick={() => doAction("TRAIN")} disabled={busy} className="text-xs px-1">
          💪 Тренировать
        </Button>
        <Button onClick={() => setModal("battle")} disabled={busy} className="text-xs px-1">
          ⚔️ Бой
        </Button>
        <Button variant="primary" onClick={() => setModal("chat")} className="text-xs px-1">
          💬 Говорить
        </Button>
      </nav>

      {modal === "chat" && (
        <Modal title={`Разговор с ${pet.name}`} onClose={() => setModal(null)}>
          <div className="h-[60vh] -m-4">
            <ChatPanel petName={pet.name} onPetUpdate={setPet} />
          </div>
        </Modal>
      )}

      {modal === "battle" && (
        <BattleModal
          pet={pet}
          branch={branch}
          onClose={() => setModal(null)}
          onWin={(updated) => {
            setPet(updated);
            setCrystals((c) => c + 10);
          }}
        />
      )}

      {modal === "shop" && (
        <Modal title="Магазин" onClose={() => setModal(null)}>
          <p className="text-sm text-[var(--ink-dim)]">
            Скоро здесь появятся редкие яйца, скины и ускорения — а пока копи кристаллы за победы в боях. 💎
          </p>
        </Modal>
      )}
    </div>
  );
}
