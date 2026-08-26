import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }

  const { nickname, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { nickname } });
  if (existing) {
    return NextResponse.json({ error: "Этот никнейм уже занят" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { nickname, passwordHash },
  });

  await createSession(user.id);

  return NextResponse.json({ id: user.id, nickname: user.nickname });
}
