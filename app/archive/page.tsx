import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { t } from "@/lib/i18n/types";
import { Panel } from "@/components/ui/Panel";

export default async function ArchivePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  const content = getContentRegistry();
  const discoveries = await prisma.discovery.findMany({ where: { userId: user.id }, orderBy: { discoveredAt: "asc" } });

  const byCategory: Record<string, { title: string; text: string }[]> = {};
  for (const d of discoveries) {
    const def = content.knowledgeById[d.knowledgeId];
    if (!def) continue;
    byCategory[def.category] ??= [];
    byCategory[def.category].push({ title: t(def.title, locale), text: t(def.text, locale) });
  }
  const categories = Object.keys(byCategory) as (keyof typeof ui.archive.categories)[];

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4">
      <h1 className="font-display text-xl font-semibold text-[var(--gold-bright)]">{ui.archive.title}</h1>
      <div className="w-full max-w-md flex flex-col gap-4">
        {categories.length === 0 && (
          <p className="text-sm text-[var(--ink-dim)] text-center">{ui.archive.empty}</p>
        )}
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-sm uppercase tracking-wide text-[var(--ink-dim)] mb-2">{ui.archive.categories[cat]}</h2>
            <div className="flex flex-col gap-2">
              {byCategory[cat].map((entry) => (
                <Panel key={entry.title}>
                  <p className="font-medium">{entry.title}</p>
                  <p className="text-sm text-[var(--ink-dim)]">{entry.text}</p>
                </Panel>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link href="/menu" className="btn w-full max-w-md">{ui.archive.backToMenu}</Link>
    </div>
  );
}
