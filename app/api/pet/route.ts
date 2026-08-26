import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { initialPersonality } from "@/lib/pet/personality";
import { decayPet, buildPetView } from "@/lib/pet/view";

const WORLDS = ["FANTASY", "SPACE", "CYBERPUNK"] as const;

const createSchema = z.object({
  name: z.string().trim().min(1, "Введи имя питомца").max(20, "Слишком длинное имя"),
  world: z.enum(WORLDS),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const pet = await prisma.pet.findUnique({ where: { userId: user.id } });
  if (!pet) return NextResponse.json({ pet: null });

  const decayedStats = decayPet(pet);
  const updated = await prisma.pet.update({
    where: { id: pet.id },
    data: { ...decayedStats, lastSeenAt: new Date() },
  });

  return NextResponse.json({ pet: buildPetView(updated, decayedStats) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const existing = await prisma.pet.findUnique({ where: { userId: user.id } });
  if (existing) return NextResponse.json({ error: "У тебя уже есть питомец" }, { status: 409 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }

  const pet = await prisma.pet.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      world: parsed.data.world,
      personality: initialPersonality(),
    },
  });

  const stats = { trust: pet.trust, intelligence: pet.intelligence, strength: pet.strength, energy: pet.energy, hunger: pet.hunger };
  return NextResponse.json({ pet: buildPetView(pet, stats) });
}
