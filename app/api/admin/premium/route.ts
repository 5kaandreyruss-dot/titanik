import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionService } from "@/lib/subscription";

const bodySchema = z.object({
  nickname: z.string().min(1),
  action: z.enum(["activate", "deactivate"]),
  untilDays: z.number().int().min(1).max(3650).optional(),
});

export async function POST(request: Request) {
  const admin = await requireUser().catch(() => null);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { nickname: parsed.data.nickname } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (parsed.data.action === "activate") {
    const until = parsed.data.untilDays
      ? new Date(Date.now() + parsed.data.untilDays * 24 * 60 * 60 * 1000)
      : null;
    await SubscriptionService.activate(target.id, until, "admin");
  } else {
    await SubscriptionService.deactivate(target.id, "admin");
  }

  return NextResponse.json({ ok: true });
}
