import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { getLoginSchema } from "@/lib/auth/validation";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";

export async function POST(request: Request) {
  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  const body = await request.json().catch(() => null);
  const parsed = getLoginSchema().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: ui.errors.invalidInput }, { status: 400 });
  }

  const { nickname, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { nickname } });
  if (!user) {
    return NextResponse.json({ error: ui.errors.invalidCredentials }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: ui.errors.invalidCredentials }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({ id: user.id, nickname: user.nickname });
}
