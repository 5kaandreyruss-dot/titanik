import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { t } from "@/lib/i18n/types";

export async function GET() {
  const locale = await getLocale();
  const ui = getUiDictionary(locale);
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: ui.errors.notAuthenticated }, { status: 401 });

  const discoveries = await prisma.discovery.findMany({
    where: { userId: user.id },
    orderBy: { discoveredAt: "asc" },
  });

  const content = getContentRegistry();
  type ArchiveEntry = { id: string; category: string; title: string; text: string; discoveredAt: Date };
  const entries: ArchiveEntry[] = [];
  for (const d of discoveries) {
    const def = content.knowledgeById[d.knowledgeId];
    if (!def) continue;
    entries.push({ id: def.id, category: def.category, title: t(def.title, locale), text: t(def.text, locale), discoveredAt: d.discoveredAt });
  }

  const byCategory: Record<string, ArchiveEntry[]> = {};
  for (const entry of entries) {
    byCategory[entry.category] ??= [];
    byCategory[entry.category].push(entry);
  }

  return NextResponse.json({ byCategory });
}
