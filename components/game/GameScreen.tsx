"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/apiClient";
import type { RunView } from "@/lib/engine/view";
import type { PlayerAction } from "@/lib/engine/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ActionResponse {
  view: RunView;
  effects: { kind: string; text: string }[];
  newAchievements: string[];
  finished: boolean;
}

const SHIP_LABELS: Record<string, string> = {
  none: "Calm",
  light: "Slight",
  moderate: "Noticeable",
  severe: "Severe",
  critical: "Critical",
};

export function GameScreen({ runId, initialView }: { runId: string; initialView: RunView }) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [log, setLog] = useState<string[]>(initialView.log.map((l) => l.text));
  const [modal, setModal] = useState<"inventory" | "map" | "move" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  async function send(action: PlayerAction) {
    if (busy || view.ending) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<ActionResponse>(`/api/game/runs/${runId}/action`, action);
      setView(res.view);
      setLog((prev) => [...prev, ...res.effects.map((e) => e.text)].slice(-40));
      if (res.newAchievements.length > 0) setNewAchievements(res.newAchievements);
      setModal(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (view.ending) {
    return <EndingScreen view={view} onMenu={() => router.push("/menu")} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="panel m-2 px-4 py-2 flex items-center justify-between text-sm">
        <div>
          <div className="text-[var(--gold)] font-mono text-lg leading-none">{view.time}</div>
          <div className="text-[var(--ink-dim)] text-xs">{view.date}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{view.location?.name}</div>
          <div className="text-[var(--ink-dim)] text-xs">{view.location?.deck}</div>
        </div>
      </header>

      <div className="mx-2 scene-bg pixel-border h-40 flex items-end p-3 text-sm text-[var(--ink-dim)]">
        <ShipStatus view={view} />
      </div>

      <main className="flex-1 mx-2 mt-2 panel p-4 space-y-3">
        <p className="leading-relaxed">{view.location?.description}</p>

        {view.npcsHere.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ink-dim)] mb-1">People here</p>
            <div className="flex flex-wrap gap-2">
              {view.npcsHere.map((npc) => (
                <Button key={npc.id} onClick={() => send({ type: "TALK_START", npcId: npc.id })} disabled={busy}>
                  Talk: {npc.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {view.itemsHere.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ink-dim)] mb-1">Nearby</p>
            <div className="flex flex-wrap gap-2">
              {view.itemsHere.map((item) => (
                <Button key={item.id} onClick={() => send({ type: "TAKE_ITEM", itemId: item.id })} disabled={busy}>
                  Take {item.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {view.dialogue && <DialoguePanel dialogue={view.dialogue} onChoose={(choiceId) => send({ type: "DIALOGUE_CHOOSE", npcId: view.dialogue!.npcId, choiceId })} disabled={busy} />}

        {error && <p className="text-[var(--danger)] text-sm">{error}</p>}

        <div className="border-t border-[var(--panel-border)] pt-3 max-h-32 overflow-y-auto text-sm text-[var(--ink-dim)] space-y-1">
          {log.slice(-8).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </main>

      <nav className="grid grid-cols-4 gap-1 m-2">
        <Button onClick={() => send({ type: "LOOK_AROUND" })} disabled={busy}>
          Look
        </Button>
        <Button onClick={() => setModal("move")} disabled={busy}>
          Move
        </Button>
        <Button onClick={() => setModal("inventory")} disabled={busy}>
          Inventory
        </Button>
        <Button onClick={() => setModal("map")} disabled={busy}>
          Map
        </Button>
      </nav>

      {modal === "move" && (
        <Modal title="Move to..." onClose={() => setModal(null)}>
          <div className="flex flex-col gap-2">
            {view.exits.map((exit) => (
              <Button
                key={exit.id}
                onClick={() => send({ type: "MOVE", targetLocationId: exit.id })}
                disabled={busy}
              >
                {exit.discovered ? exit.name : "Unexplored passage"}
                {exit.locked ? " (locked)" : ""}
              </Button>
            ))}
          </div>
        </Modal>
      )}

      {modal === "inventory" && (
        <Modal title="Inventory" onClose={() => setModal(null)}>
          {view.inventory.length === 0 && <p className="text-[var(--ink-dim)] text-sm">You carry nothing of note.</p>}
          <div className="flex flex-col gap-3">
            {view.inventory.map((item) => (
              <div key={item.itemId} className="border-b border-[var(--panel-border)] pb-2">
                <p className="font-medium">
                  {item.name} {item.quantity > 1 ? `x${item.quantity}` : ""}
                </p>
                <p className="text-xs text-[var(--ink-dim)] mb-2">{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {item.actions.includes("use") && (
                    <Button onClick={() => send({ type: "USE_ITEM", itemId: item.itemId })} disabled={busy}>
                      Use
                    </Button>
                  )}
                  {item.actions.includes("give") &&
                    view.npcsHere.map((npc) => (
                      <Button
                        key={npc.id}
                        onClick={() => send({ type: "GIVE_ITEM", itemId: item.itemId, npcId: npc.id })}
                        disabled={busy}
                      >
                        Give to {npc.name}
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === "map" && (
        <Modal title="Ship Map" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-1">
            {view.map.map((loc) => (
              <div
                key={loc.id}
                className={`px-3 py-2 rounded text-sm flex justify-between ${
                  loc.isCurrent ? "bg-[var(--gold)] text-[#14202b] font-semibold" : "bg-black/20"
                }`}
              >
                <span>{loc.discovered ? loc.name : "???"}</span>
                <span className="text-xs opacity-70">{loc.discovered ? loc.deck : ""}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {newAchievements.length > 0 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 panel px-4 py-2 text-sm text-[var(--gold)] cursor-pointer"
          onClick={() => setNewAchievements([])}
        >
          Achievement unlocked! Tap to dismiss.
        </div>
      )}
    </div>
  );
}

function ShipStatus({ view }: { view: RunView }) {
  const notable = Object.entries(view.ship).filter(([, v]) => v !== "none");
  if (notable.length === 0) return <span>The ship feels calm tonight.</span>;
  return (
    <span>
      {notable.map(([k, v]) => `${k}: ${SHIP_LABELS[v as string]}`).join(" · ")}
    </span>
  );
}

function DialoguePanel({
  dialogue,
  onChoose,
  disabled,
}: {
  dialogue: NonNullable<RunView["dialogue"]>;
  onChoose: (choiceId: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="pixel-border p-3 bg-black/30">
      <p className="text-[var(--gold)] text-xs uppercase mb-1">{dialogue.npcName}</p>
      <p className="mb-3 italic">{dialogue.text}</p>
      <div className="flex flex-col gap-2">
        {dialogue.choices.map((choice) => (
          <Button key={choice.id} onClick={() => onChoose(choice.id)} disabled={disabled} className="text-left justify-start">
            {choice.text}
            {choice.hint && <span className="block text-xs text-[var(--ink-dim)] font-normal">{choice.hint}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
}

function EndingScreen({ view, onMenu }: { view: RunView; onMenu: () => void }) {
  const categoryColor =
    view.ending?.category === "positive"
      ? "var(--positive)"
      : view.ending?.category === "negative"
        ? "var(--danger)"
        : "var(--neutral)";
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="panel max-w-md w-full p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: categoryColor }}>
          {view.ending?.name}
        </h1>
        <p className="leading-relaxed text-[var(--ink-dim)]">{view.ending?.epilogueText}</p>
        <div className="text-sm text-left border-t border-[var(--panel-border)] pt-3 space-y-1">
          <p>Character: {view.characterName}</p>
          <p>People rescued: {view.rescuedPeople.length}</p>
          <p>Locations discovered: {view.map.filter((l) => l.discovered).length} / {view.map.length}</p>
          <p>Secrets uncovered: {view.knowledge.length}</p>
        </div>
        <Button variant="primary" onClick={onMenu} className="w-full">
          Return to Menu
        </Button>
      </div>
    </div>
  );
}
