"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/apiClient";
import type { RunView } from "@/lib/engine/view";
import type { PlayerAction } from "@/lib/engine/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { IsometricShipMap } from "@/components/game/IsometricShipMap";
import { SceneArt } from "@/components/game/scenes/SceneArt";
import { NpcPortrait } from "@/components/game/NpcPortrait";
import { getUiDictionary } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/types";

interface ActionResponse {
  view: RunView;
  effects: { kind: string; text: string }[];
  newAchievements: string[];
  finished: boolean;
}

interface LogLine {
  id: number;
  text: string;
}

export function GameScreen({
  runId,
  initialView,
  locale,
  isNewRun = false,
}: {
  runId: string;
  initialView: RunView;
  locale: Locale;
  isNewRun?: boolean;
}) {
  const ui = getUiDictionary(locale);
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [log, setLog] = useState<LogLine[]>(() => initialView.log.map((l, i) => ({ id: i, text: l.text })));
  const [modal, setModal] = useState<"inventory" | "map" | "move" | "history" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const introSeenKey = `titanik_intro_seen_${runId}`;
  const [showIntro, setShowIntro] = useState(isNewRun);

  useEffect(() => {
    if (!isNewRun) return;
    try {
      // sessionStorage is unavailable during SSR, so this can only be checked post-hydration
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (window.sessionStorage.getItem(introSeenKey) === "1") setShowIntro(false);
    } catch {
      // sessionStorage unavailable (e.g. private mode) — intro stays visible, which is harmless
    }
  }, [isNewRun, introSeenKey]);

  function dismissIntro() {
    try {
      window.sessionStorage.setItem(introSeenKey, "1");
    } catch {
      // sessionStorage unavailable (e.g. private mode) — intro may reappear on reload, which is harmless
    }
    setShowIntro(false);
  }

  async function send(action: PlayerAction) {
    if (busy || view.ending) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<ActionResponse>(`/api/game/runs/${runId}/action`, action);
      setView(res.view);
      setLog((prev) => {
        const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 0;
        const appended = res.effects.map((e, i) => ({ id: nextId + i, text: e.text }));
        return [...prev, ...appended].slice(-60);
      });
      if (res.newAchievements.length > 0) setNewAchievements(res.newAchievements);
      if (modal !== "history") setModal(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : ui.errors.somethingWrong);
    } finally {
      setBusy(false);
    }
  }

  if (view.ending) {
    return <EndingScreen view={view} ui={ui} onMenu={() => router.push("/menu")} />;
  }

  if (showIntro) {
    return <CharacterIntro view={view} ui={ui} onBegin={dismissIntro} />;
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-[var(--bg-deep)]">
      {busy && <div className="loading-shimmer fixed top-0 left-0 right-0 h-0.5 z-50" />}

      <div className="relative shrink-0" style={{ height: "30vh", minHeight: 190, maxHeight: 260 }}>
        <div key={view.location?.sceneBackground} className="absolute inset-0 anim-fade-in-up">
          <SceneArt sceneKey={view.location?.sceneBackground ?? ""} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-black/10 to-black/40" />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="bg-black/45 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <div className="text-[var(--gold-bright)] font-mono text-base leading-none">{view.time}</div>
            <div className="text-white/70 text-[10px] mt-0.5">{view.date}</div>
          </div>
          <button
            onClick={() => setModal("history")}
            className="bg-black/45 backdrop-blur-sm rounded-lg w-9 h-9 flex items-center justify-center text-white/80 text-lg"
            aria-label={ui.game.historyTitle}
          >
            ⟲
          </button>
        </div>

        <div key={`loc-${view.location?.id}`} className="absolute bottom-3 left-3 right-3 anim-fade-in-up">
          <div className="font-display text-white font-semibold text-lg drop-shadow-md">{view.location?.name}</div>
          <div className="text-white/60 text-xs">{view.location?.deck}</div>
          <div className="text-white/50 text-[11px] mt-1">
            <ShipStatus view={view} ui={ui} />
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto mx-3 mt-2 mb-2">
        <div className="panel p-4 space-y-3">
          {view.dialogue ? (
            <DialoguePanel
              key={`${view.dialogue.npcId}-${view.dialogue.text}`}
              dialogue={view.dialogue}
              onChoose={(choiceId) => send({ type: "DIALOGUE_CHOOSE", npcId: view.dialogue!.npcId, choiceId })}
              disabled={busy}
            />
          ) : (
            <>
              <p key={`desc-${view.location?.id}`} className="leading-relaxed text-[15px] anim-fade-in-up">
                {view.location?.description}
              </p>

              {view.npcsHere.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--ink-dim)] mb-1.5">{ui.game.peopleHere}</p>
                  <div className="flex flex-wrap gap-2">
                    {view.npcsHere.map((npc) => (
                      <Button key={npc.id} onClick={() => send({ type: "TALK_START", npcId: npc.id })} disabled={busy}>
                        <NpcPortrait npcId={npc.id} size={24} />
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
            </>
          )}

          {error && <p className="text-[var(--danger)] text-sm anim-fade-in-up">{error}</p>}
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
              <Button key={exit.id} onClick={() => send({ type: "MOVE", targetLocationId: exit.id })} disabled={busy}>
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
          <div className="h-96">
            <IsometricShipMap view={view} onMove={(id) => send({ type: "MOVE", targetLocationId: id })} />
          </div>
        </Modal>
      )}

      {modal === "history" && (
        <Modal title={ui.game.historyTitle} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-2 text-sm text-[var(--ink-dim)]">
            {log.length === 0 && <p>{ui.game.historyEmpty}</p>}
            {[...log].reverse().map((line) => (
              <p key={line.id} className="border-b border-[var(--panel-border)] pb-2">
                {line.text}
              </p>
            ))}
          </div>
        </Modal>
      )}

      {newAchievements.length > 0 && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 panel px-4 py-2 text-sm text-[var(--gold-bright)] cursor-pointer z-40 anim-pop-in"
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
    <div className="anim-pop-in">
      <div className="flex items-center gap-2 mb-2">
        <NpcPortrait npcId={dialogue.npcId} size={32} />
        <p className="text-[var(--gold-bright)] text-xs uppercase tracking-wide">{dialogue.npcName}</p>
      </div>
      <p className="mb-3 italic leading-relaxed text-[15px]">{dialogue.text}</p>
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

function CharacterIntro({
  view,
  ui,
  onBegin,
}: {
  view: RunView;
  ui: ReturnType<typeof getUiDictionary>;
  onBegin: () => void;
}) {
  const statEntries = Object.entries(view.stats) as [keyof typeof ui.stats, number][];
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="ambient-glow" />
      <div className="panel max-w-md w-full p-6 space-y-4 relative z-10 anim-pop-in">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--ink-dim)]">{ui.characterIntro.title}</p>
          <h1 className="font-display text-2xl font-bold text-[var(--gold-bright)] mt-1">{view.characterName}</h1>
          <p className="text-sm text-[var(--ink-dim)] mt-1">
            {view.archetype?.name} · {ui.socialClass[view.socialClass as keyof typeof ui.socialClass]}
          </p>
        </div>

        {view.archetype?.description && (
          <p className="text-sm text-[var(--ink-dim)] text-center leading-relaxed">{view.archetype.description}</p>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
          {statEntries.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--ink-dim)]">{ui.stats[key]}</span>
                <span className="text-[var(--gold-bright)] font-medium">{value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-bright)]"
                  style={{ width: `${Math.min(100, (value / 10) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Button variant="primary" onClick={onBegin} className="w-full">
          {ui.characterIntro.beginButton}
        </Button>
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
      <div className="panel max-w-md w-full p-6 text-center space-y-4 anim-pop-in">
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
