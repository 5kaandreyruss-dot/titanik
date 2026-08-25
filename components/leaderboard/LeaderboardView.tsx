"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { Panel } from "@/components/ui/Panel";

const CATEGORIES = [
  { id: "rescuers", label: "Rescuers", metric: "peopleRescued" },
  { id: "explorers", label: "Explorers", metric: "explorationPercent" },
  { id: "detectives", label: "Detectives", metric: "secretsDiscovered" },
  { id: "survivors", label: "Survivors", metric: "survived" },
  { id: "heroes", label: "Heroes", metric: "heroicEnding" },
  { id: "speed", label: "Speed", metric: "durationMinutes" },
  { id: "collectors", label: "Collectors", metric: "achievementsCount" },
] as const;

interface Entry {
  nickname: string;
  peopleRescued: number;
  explorationPercent: number;
  secretsDiscovered: number;
  survived: boolean;
  heroicEnding: boolean;
  durationMinutes: number;
  achievementsCount: number;
}

export function LeaderboardView() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("rescuers");
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    api.get<{ entries: Entry[] }>(`/api/leaderboard?category=${category}`).then((res) => setEntries(res.entries));
  }, [category]);

  const activeCategory = CATEGORIES.find((c) => c.id === category)!;

  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`text-xs px-3 py-1.5 rounded border ${
              c.id === category
                ? "bg-[var(--gold)] text-[#14202b] border-[var(--gold)]"
                : "border-[var(--panel-border)] text-[var(--ink-dim)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <Panel>
        {entries.length === 0 && <p className="text-sm text-[var(--ink-dim)] text-center">No entries yet.</p>}
        <ol className="flex flex-col gap-2">
          {entries.map((e, i) => (
            <li key={i} className="flex justify-between text-sm border-b border-[var(--panel-border)] pb-1">
              <span>
                {i + 1}. {e.nickname}
              </span>
              <span className="text-[var(--gold)]">{formatMetric(activeCategory.metric, e)}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}

function formatMetric(metric: string, e: Entry): string {
  const value = e[metric as keyof Entry];
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (metric === "explorationPercent") return `${value}%`;
  if (metric === "durationMinutes") return `${value} min`;
  return String(value);
}
