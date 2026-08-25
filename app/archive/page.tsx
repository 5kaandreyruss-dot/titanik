import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getContentRegistry } from "@/lib/content";
import { Panel } from "@/components/ui/Panel";

export default async function ArchivePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const content = getContentRegistry();
  const discoveries = await prisma.discovery.findMany({ where: { userId: user.id }, orderBy: { discoveredAt: "asc" } });

  const byCategory: Record<string, { title: string; text: string }[]> = {};
  for (const d of discoveries) {
    const def = content.knowledgeById[d.knowledgeId];
    if (!def) continue;
    byCategory[def.category] ??= [];
    byCategory[def.category].push({ title: def.title, text: def.text });
  }
  const categories = Object.keys(byCategory);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold text-[var(--gold)]">Knowledge Archive</h1>
      <div className="w-full max-w-md flex flex-col gap-4">
        {categories.length === 0 && (
          <p className="text-sm text-[var(--ink-dim)] text-center">
            Nothing discovered yet. Play a run to start filling this in.
          </p>
        )}
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-sm uppercase tracking-wide text-[var(--ink-dim)] mb-2">{cat}</h2>
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
      <Link href="/menu" className="btn w-full max-w-md">Back to Menu</Link>
    </div>
  );
}
