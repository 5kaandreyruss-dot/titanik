import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { buildRunView } from "@/lib/engine/view";
import { GameScreen } from "@/components/game/GameScreen";
import type { GameRunState } from "@/lib/engine/types";

export default async function PlayPage({ params }: { params: Promise<{ runId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { runId } = await params;
  const gameRun = await prisma.gameRun.findUnique({ where: { id: runId } });
  if (!gameRun || gameRun.userId !== user.id) notFound();

  const content = getContentRegistry();
  const view = buildRunView(content, gameRun.stateJson as unknown as GameRunState);

  return <GameScreen runId={runId} initialView={view} />;
}
