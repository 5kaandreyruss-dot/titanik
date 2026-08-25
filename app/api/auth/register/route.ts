import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { getRegisterSchema } from "@/lib/auth/validation";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";

export async function POST(request: Request) {
  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  const body = await request.json().catch(() => null);
  const parsed = getRegisterSchema(locale).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? ui.errors.invalidInput },
      { status: 400 },
    );
  }

  const { nickname, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { nickname } });
  if (existing) {
    return NextResponse.json({ error: ui.errors.nicknameTaken }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { nickname, passwordHash },
  });

  await createSession(user.id);

  return NextResponse.json({ id: user.id, nickname: user.nickname });
}
