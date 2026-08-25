import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { createNewRun, getRemainingFreeRuns, RunLimitError } from "@/lib/runLimit";
import { getContentRegistry } from "@/lib/content";
import { buildRunView } from "@/lib/engine/view";
import { prisma } from "@/lib/db/prisma";
import type { GameRunState } from "@/lib/engine/types";
import { z } from "zod";

const createRunSchema = z.object({
  archetypeId: z.string().optional(),
});

export async function GET() {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const runs = await prisma.gameRun.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, createdAt: true, updatedAt: true, endingId: true, archetypeId: true },
  });
  const remainingFreeRuns = await getRemainingFreeRuns(user);

  return NextResponse.json({ runs, remainingFreeRuns });
}

export async function POST(request: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = createRunSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (parsed.data.archetypeId) {
    const content = getContentRegistry();
    const archetype = content.archetypesById[parsed.data.archetypeId];
    if (!archetype) return NextResponse.json({ error: "Unknown archetype" }, { status: 400 });
    if (archetype.premiumOnly) {
      const { SubscriptionService } = await import("@/lib/subscription");
      if (!SubscriptionService.isPremium(user)) {
        return NextResponse.json({ error: "This archetype requires Premium" }, { status: 403 });
      }
    }
  }

  try {
    const gameRun = await createNewRun(user, parsed.data.archetypeId);
    const content = getContentRegistry();
    const view = buildRunView(content, gameRun.stateJson as unknown as GameRunState);
    return NextResponse.json({ runId: gameRun.id, view });
  } catch (err) {
    if (err instanceof RunLimitError) {
      return NextResponse.json({ error: "Daily free run limit reached. Upgrade to Premium for unlimited runs." }, { status: 403 });
    }
    throw err;
  }
}
