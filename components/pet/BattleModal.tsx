"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PetRig } from "@/components/pet/PetRig";
import { suggestMove, resolveRound, type BattleMove } from "@/lib/pet/battle";
import { api } from "@/lib/apiClient";
import type { PetViewData } from "@/components/pet/types";
import type { EvolutionBranch } from "@/lib/pet/evolution";

const MONSTER_EMOJI = ["👹", "🦂", "🐍", "🦇", "👻"];

export function BattleModal({
  pet,
  branch,
  onClose,
  onWin,
}: {
  pet: PetViewData;
  branch: EvolutionBranch;
  onClose: () => void;
  onWin: (pet: PetViewData) => void;
}) {
  const level = Math.max(1, Math.floor(pet.stats.strength / 10));
  const [monsterHp, setMonsterHp] = useState(60 + level * 15);
  const [monsterMaxHp] = useState(60 + level * 15);
  const [petHp, setPetHp] = useState(100);
  const [log, setLog] = useState<string[]>([`Появился противник! (уровень ${level})`]);
  const [finished, setFinished] = useState<"win" | "lose" | null>(null);
  const [busy, setBusy] = useState(false);
  const [monsterEmoji] = useState(() => MONSTER_EMOJI[Math.floor(Math.random() * MONSTER_EMOJI.length)]);

  async function playMove(move: BattleMove) {
    if (busy || finished) return;
    setBusy(true);
    const result = resolveRound(move, level);
    const nextMonsterHp = Math.max(0, monsterHp - result.petDamageDealt);
    const nextPetHp = Math.max(0, petHp - result.monsterDamageDealt);
    setMonsterHp(nextMonsterHp);
    setPetHp(nextPetHp);
    setLog((prev) => [...prev.slice(-4), `${pet.name}: ${result.quip} (−${result.petDamageDealt} врагу, −${result.monsterDamageDealt} тебе)`]);

    if (nextMonsterHp <= 0) {
      setFinished("win");
      try {
        const res = await api.post<{ pet: PetViewData }>("/api/pet/action", { type: "BATTLE_WIN" });
        onWin(res.pet);
      } catch {
        // battle victory still stands visually even if the reward call fails
      }
    } else if (nextPetHp <= 0) {
      setFinished("lose");
    }
    setBusy(false);
  }

  function askPet() {
    const move = suggestMove(pet.personality);
    playMove(move);
  }

  return (
    <Modal title="Бой" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <PetRig world={pet.world} stage={pet.stage} branch={branch} mood="battle" size={100} />
            <div className="h-2 rounded-full bg-black/30 overflow-hidden mt-1">
              <div className="h-full bg-[var(--positive)] transition-[width]" style={{ width: `${petHp}%` }} />
            </div>
            <p className="text-xs text-center text-[var(--ink-dim)] mt-1">{pet.name}</p>
          </div>
          <div className="text-2xl font-bold text-[var(--ink-dim)]">VS</div>
          <div className="flex-1">
            <div className="text-6xl text-center">{monsterEmoji}</div>
            <div className="h-2 rounded-full bg-black/30 overflow-hidden mt-1">
              <div
                className="h-full bg-[var(--danger)] transition-[width]"
                style={{ width: `${(monsterHp / monsterMaxHp) * 100}%` }}
              />
            </div>
            <p className="text-xs text-center text-[var(--ink-dim)] mt-1">Противник</p>
          </div>
        </div>

        <div className="text-xs text-[var(--ink-dim)] flex flex-col gap-1 max-h-24 overflow-y-auto">
          {log.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {finished ? (
          <div className="text-center space-y-3">
            <p className={finished === "win" ? "text-[var(--positive)] font-semibold" : "text-[var(--danger)] font-semibold"}>
              {finished === "win" ? `Победа! +10 💎, +3 к силе` : "Поражение... в следующий раз получится!"}
            </p>
            <Button variant="primary" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => playMove("ATTACK")} disabled={busy}>
              🔥 Атака
            </Button>
            <Button onClick={() => playMove("DEFEND")} disabled={busy}>
              🛡 Защита
            </Button>
            <Button onClick={() => playMove("DODGE")} disabled={busy}>
              💨 Уворот
            </Button>
            <Button onClick={askPet} disabled={busy}>
              💬 Спросить {pet.name}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
