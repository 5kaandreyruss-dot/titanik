import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getContentRegistry } from "@/lib/content";
import { SubscriptionService } from "@/lib/subscription";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { t } from "@/lib/i18n/types";

export async function GET() {
  const locale = await getLocale();
  const ui = getUiDictionary(locale);
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: ui.errors.notAuthenticated }, { status: 401 });

  const content = getContentRegistry();
  const isPremium = SubscriptionService.isPremium(user);

  const archetypes = content.archetypes.map((a) => ({
    id: a.id,
    name: t(a.name, locale),
    socialClass: a.socialClass,
    description: t(a.description, locale),
    locked: Boolean(a.premiumOnly) && !isPremium,
  }));

  return NextResponse.json({ archetypes });
}
