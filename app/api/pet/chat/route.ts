import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { classifyMessage, driftPersonality } from "@/lib/pet/personality";
import { applyChat } from "@/lib/pet/stats";
import { decayPet, buildPetView } from "@/lib/pet/view";
import { consumeMessageQuota, getRemainingFreeMessages } from "@/lib/pet/chatLimit";
import { generatePetReply } from "@/lib/ai/petChat";
import type { Personality } from "@/lib/pet/types";

const schema = z.object({ message: z.string().trim().min(1).max(500) });

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const pet = await prisma.pet.findUnique({ where: { userId: user.id } });
  if (!pet) return NextResponse.json({ error: "Питомец не найден" }, { status: 404 });

  const history = await prisma.chatMessage.findMany({
    where: { petId: pet.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const remaining = await getRemainingFreeMessages(user);
  return NextResponse.json({
    messages: history.reverse().map((m) => ({ id: m.id, role: m.role, content: m.content })),
    remainingFreeMessages: remaining,
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const pet = await prisma.pet.findUnique({ where: { userId: user.id } });
  if (!pet) return NextResponse.json({ error: "Питомец не найден" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Некорректное сообщение" }, { status: 400 });

  const allowed = await consumeMessageQuota(user);
  if (!allowed) {
    return NextResponse.json({ error: "На сегодня сообщения закончились — загляни завтра или оформи подписку" }, { status: 429 });
  }

  const history = await prisma.chatMessage.findMany({
    where: { petId: pet.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const decayedStats = decayPet(pet);
  const currentPersonality = pet.personality as unknown as Personality;
  const signal = classifyMessage(parsed.data.message);
  const nextPersonality = driftPersonality(currentPersonality, signal);
  const nextStats = applyChat(decayedStats, 1);

  const view = buildPetView({ ...pet, ...nextStats, personality: nextPersonality }, nextStats);

  const reply = await generatePetReply({
    petName: pet.name,
    stageLabel: view.stageName,
    personality: nextPersonality,
    stats: nextStats,
    history: history.reverse().map((m) => ({ role: m.role, content: m.content })),
    userMessage: parsed.data.message,
  });

  await prisma.$transaction([
    prisma.chatMessage.create({ data: { petId: pet.id, role: "USER", content: parsed.data.message } }),
    prisma.chatMessage.create({ data: { petId: pet.id, role: "PET", content: reply } }),
    prisma.pet.update({
      where: { id: pet.id },
      data: { ...nextStats, personality: nextPersonality, lastSeenAt: new Date() },
    }),
  ]);

  const remaining = await getRemainingFreeMessages(user);
  return NextResponse.json({ reply, pet: view, remainingFreeMessages: remaining });
}
