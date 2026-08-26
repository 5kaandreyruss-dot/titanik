import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { applyFeed, applyPlay, applyTrain } from "@/lib/pet/stats";
import { decayPet, buildPetView } from "@/lib/pet/view";

const schema = z.object({ type: z.enum(["FEED", "PLAY", "TRAIN", "BATTLE_WIN"]) });
const BATTLE_WIN_CRYSTALS = 10;

function applyBattleWin(stats: { trust: number; intelligence: number; strength: number; energy: number; hunger: number }) {
  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
  return {
    ...stats,
    strength: clamp(stats.strength + 3),
    trust: clamp(stats.trust + 3),
    energy: clamp(stats.energy - 10),
  };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const pet = await prisma.pet.findUnique({ where: { userId: user.id } });
  if (!pet) return NextResponse.json({ error: "Питомец не найден" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });

  const decayed = decayPet(pet);
  const applied =
    parsed.data.type === "FEED"
      ? applyFeed(decayed)
      : parsed.data.type === "PLAY"
        ? applyPlay(decayed)
        : parsed.data.type === "TRAIN"
          ? applyTrain(decayed)
          : applyBattleWin(decayed);

  const [updated] = await prisma.$transaction([
    prisma.pet.update({
      where: { id: pet.id },
      data: {
        ...applied,
        lastSeenAt: new Date(),
        ...(parsed.data.type === "FEED" ? { lastFedAt: new Date() } : {}),
      },
    }),
    ...(parsed.data.type === "BATTLE_WIN"
      ? [prisma.user.update({ where: { id: user.id }, data: { crystals: { increment: BATTLE_WIN_CRYSTALS } } })]
      : []),
  ]);

  return NextResponse.json({ pet: buildPetView(updated, applied) });
}
