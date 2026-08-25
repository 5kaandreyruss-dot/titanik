"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/apiClient";
import type { RunView } from "@/lib/engine/view";
import type { PlayerAction } from "@/lib/engine/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ShipMiniMap } from "@/components/game/ShipMiniMap";
import { getUiDictionary } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/types";

interface ActionResponse {
  view: RunView;
  effects: { kind: string; text: string }[];
  newAchievements: string[];
  finished: boolean;
}

export function GameScreen({ runId, initialView, locale }: { runId: string; initialView: RunView; locale: Locale }) {
  const ui = getUiDictionary(locale);
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
      setError(e instanceof ApiError ? e.message : ui.errors.somethingWrong);
    } finally {
      setBusy(false);
    }
  }

  if (view.ending) {
    return <EndingScreen view={view} ui={ui} onMenu={() => router.push("/menu")} />;
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <header className="panel mx-3 mt-3 px-4 py-2.5 flex items-center justify-between text-sm shrink-0">
        <div>
          <div className="text-[var(--gold-bright)] font-mono text-lg leading-none tracking-wide">{view.time}</div>
          <div className="text-[var(--ink-dim)] text-xs mt-0.5">{view.date}</div>
        </div>
        <div className="text-right">
          <div className="font-display font-semibold text-[var(--ink)]">{view.location?.name}</div>
          <div className="text-[var(--ink-dim)] text-xs mt-0.5">{view.location?.deck}</div>
        </div>
      </header>

      <div className="mx-3 mt-2 panel scene-bg h-44 shrink-0 relative overflow-hidden">
        <ShipMiniMap view={view} />
        <div className="absolute bottom-2 left-3 right-3 text-xs text-[var(--ink-dim)]">
          <ShipStatus view={view} ui={ui} />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto mx-3 mt-2 mb-2 panel p-4 space-y-3">
        <p className="leading-relaxed text-[15px]">{view.location?.description}</p>

        {view.npcsHere.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ink-dim)] mb-1.5">{ui.game.peopleHere}</p>
            <div className="flex flex-wrap gap-2">
              {view.npcsHere.map((npc) => (
                <Button key={npc.id} onClick={() => send({ type: "TALK_START", npcId: npc.id })} disabled={busy}>
                  {ui.game.talkTo(npc.name)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {view.itemsHere.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ink-dim)] mb-1.5">{ui.game.nearby}</p>
            <div className="flex flex-wrap gap-2">
              {view.itemsHere.map((item) => (
                <Button key={item.id} onClick={() => send({ type: "TAKE_ITEM", itemId: item.id })} disabled={busy}>
                  {ui.game.take(item.name)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {view.dialogue && (
          <DialoguePanel
            dialogue={view.dialogue}
            onChoose={(choiceId) => send({ type: "DIALOGUE_CHOOSE", npcId: view.dialogue!.npcId, choiceId })}
            disabled={busy}
          />
        )}

        {error && <p className="text-[var(--danger)] text-sm">{error}</p>}

        <div className="border-t border-[var(--panel-border)] pt-3 text-sm text-[var(--ink-dim)] space-y-1.5">
          {log.slice(-8).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </main>

      <nav className="grid grid-cols-4 gap-1.5 mx-3 mb-3 shrink-0">
        <Button onClick={() => send({ type: "LOOK_AROUND" })} disabled={busy}>
          {ui.game.look}
        </Button>
        <Button onClick={() => setModal("move")} disabled={busy}>
          {ui.game.move}
        </Button>
        <Button onClick={() => setModal("inventory")} disabled={busy}>
          {ui.game.inventory}
        </Button>
        <Button onClick={() => setModal("map")} disabled={busy}>
          {ui.game.map}
        </Button>
      </nav>

      {modal === "move" && (
        <Modal title={ui.game.moveToTitle} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-2">
            {view.exits.map((exit) => (
              <Button
                key={exit.id}
                onClick={() => send({ type: "MOVE", targetLocationId: exit.id })}
                disabled={busy}
              >
                {exit.discovered ? exit.name : ui.game.unexploredPassage}
                {exit.locked ? ui.game.lockedSuffix : ""}
              </Button>
            ))}
          </div>
        </Modal>
      )}

      {modal === "inventory" && (
        <Modal title={ui.game.inventoryTitle} onClose={() => setModal(null)}>
          {view.inventory.length === 0 && <p className="text-[var(--ink-dim)] text-sm">{ui.game.inventoryEmpty}</p>}
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
                      {ui.game.use}
                    </Button>
                  )}
                  {item.actions.includes("give") &&
                    view.npcsHere.map((npc) => (
                      <Button
                        key={npc.id}
                        onClick={() => send({ type: "GIVE_ITEM", itemId: item.itemId, npcId: npc.id })}
                        disabled={busy}
                      >
                        {ui.game.giveTo(npc.name)}
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === "map" && (
        <Modal title={ui.game.mapTitle} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-1">
            {view.map.map((loc) => (
              <div
                key={loc.id}
                className={`px-3 py-2 rounded-lg text-sm flex justify-between ${
                  loc.isCurrent ? "bg-[var(--gold)] text-[#1a1408] font-semibold" : "bg-black/20"
                }`}
              >
                <span>{loc.discovered ? loc.name : ui.game.unknownLocation}</span>
                <span className="text-xs opacity-70">{loc.discovered ? loc.deck : ""}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {newAchievements.length > 0 && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 panel px-4 py-2 text-sm text-[var(--gold-bright)] cursor-pointer z-40"
          onClick={() => setNewAchievements([])}
        >
          {ui.game.achievementUnlocked}
        </div>
      )}
    </div>
  );
}

function ShipStatus({ view, ui }: { view: RunView; ui: ReturnType<typeof getUiDictionary> }) {
  const notable = Object.entries(view.ship).filter(([, v]) => v !== "none");
  if (notable.length === 0) return <span>{ui.game.shipCalm}</span>;
  return (
    <span>
      {notable
        .map(([k, v]) => `${ui.ship[k as keyof typeof ui.ship]}: ${ui.ship[v as keyof typeof ui.ship]}`)
        .join(" · ")}
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
    <div className="pixel-border p-3.5 bg-black/20">
      <p className="text-[var(--gold-bright)] text-xs uppercase tracking-wide mb-1.5">{dialogue.npcName}</p>
      <p className="mb-3 italic leading-relaxed">{dialogue.text}</p>
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

function EndingScreen({
  view,
  ui,
  onMenu,
}: {
  view: RunView;
  ui: ReturnType<typeof getUiDictionary>;
  onMenu: () => void;
}) {
  const categoryColor =
    view.ending?.category === "positive"
      ? "var(--positive)"
      : view.ending?.category === "negative"
        ? "var(--danger)"
        : "var(--neutral)";
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="panel max-w-md w-full p-6 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold" style={{ color: categoryColor }}>
          {view.ending?.name}
        </h1>
        <p className="leading-relaxed text-[var(--ink-dim)]">{view.ending?.epilogueText}</p>
        <div className="text-sm text-left border-t border-[var(--panel-border)] pt-3 space-y-1">
          <p>{ui.game.characterLabel}: {view.characterName}</p>
          <p>{ui.game.peopleRescuedLabel}: {view.rescuedPeople.length}</p>
          <p>
            {ui.game.locationsDiscoveredLabel}: {view.map.filter((l) => l.discovered).length} / {view.map.length}
          </p>
          <p>{ui.game.secretsUncoveredLabel}: {view.knowledge.length}</p>
        </div>
        <Button variant="primary" onClick={onMenu} className="w-full">
          {ui.game.returnToMenu}
        </Button>
      </div>
    </div>
  );
}
