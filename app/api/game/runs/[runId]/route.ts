import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { buildRunView } from "@/lib/engine/view";
import type { GameRunState } from "@/lib/engine/types";

export async function GET(_request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { runId } = await params;
  const gameRun = await prisma.gameRun.findUnique({ where: { id: runId } });
  if (!gameRun || gameRun.userId !== user.id) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  const content = getContentRegistry();
  const view = buildRunView(content, gameRun.stateJson as unknown as GameRunState);
  return NextResponse.json({ runId: gameRun.id, status: gameRun.status, view });
}
