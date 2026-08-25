import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { applyAction } from "@/lib/engine/run";
import { buildRunView } from "@/lib/engine/view";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { recordLeaderboardEntry } from "@/lib/leaderboard";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import type { GameRunState, PlayerAction } from "@/lib/engine/types";

const actionSchema: z.ZodType<PlayerAction> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("MOVE"), targetLocationId: z.string() }),
  z.object({ type: z.literal("LOOK_AROUND") }),
  z.object({ type: z.literal("TALK_START"), npcId: z.string() }),
  z.object({ type: z.literal("DIALOGUE_CHOOSE"), npcId: z.string(), choiceId: z.string() }),
  z.object({ type: z.literal("INSPECT"), targetId: z.string() }),
  z.object({ type: z.literal("TAKE_ITEM"), itemId: z.string() }),
  z.object({ type: z.literal("USE_ITEM"), itemId: z.string(), targetId: z.string().optional() }),
  z.object({ type: z.literal("GIVE_ITEM"), itemId: z.string(), npcId: z.string() }),
  z.object({ type: z.literal("WAIT"), minutes: z.number().int().min(1).max(60) }),
]);

export async function POST(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const locale = await getLocale();
  const ui = getUiDictionary(locale);
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: ui.errors.notAuthenticated }, { status: 401 });

  const { runId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: ui.errors.invalidAction }, { status: 400 });

  const gameRun = await prisma.gameRun.findUnique({ where: { id: runId } });
  if (!gameRun || gameRun.userId !== user.id) {
    return NextResponse.json({ error: ui.errors.runNotFound }, { status: 404 });
  }
  if (gameRun.status !== "ACTIVE") {
    return NextResponse.json({ error: ui.errors.runAlreadyEnded }, { status: 409 });
  }

  const content = getContentRegistry();
  const state = gameRun.stateJson as unknown as GameRunState;

  const previousKnowledge = new Set(state.knowledge);
  const { state: newState, effects } = applyAction(content, state, parsed.data, gameRun.seed);

  const newKnowledgeIds = newState.knowledge.filter((id) => !previousKnowledge.has(id));
  if (newKnowledgeIds.length > 0) {
    await prisma.discovery.createMany({
      data: newKnowledgeIds.map((knowledgeId) => ({
        userId: user.id,
        gameRunId: runId,
        knowledgeId,
        category: content.knowledgeById[knowledgeId]?.category ?? "Secrets",
      })),
      skipDuplicates: true,
    });
  }

  const finished = Boolean(newState.ending);
  const updated = await prisma.gameRun.update({
    where: { id: runId },
    data: {
      stateJson: newState as unknown as object,
      actionCount: { increment: 1 },
      status: finished ? "FINISHED" : "ACTIVE",
      endingId: finished ? newState.ending : undefined,
      finishedAt: finished ? new Date() : undefined,
    },
  });

  const newAchievements = await checkAndUnlockAchievements(user.id, runId, newState);
  if (finished) {
    await recordLeaderboardEntry(user, updated, newState);
  }

  const view = buildRunView(content, newState, locale);
  const localizedEffects = effects.map((e) => ({ kind: e.kind, text: e.text[locale] }));
  return NextResponse.json({ view, effects: localizedEffects, newAchievements, finished });
}
