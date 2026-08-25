"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { Panel } from "@/components/ui/Panel";
import { getUiDictionary, type UiDictionary } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/types";

const CATEGORY_IDS = ["rescuers", "explorers", "detectives", "survivors", "heroes", "speed", "collectors"] as const;
type CategoryId = (typeof CATEGORY_IDS)[number];

const METRIC_BY_CATEGORY: Record<CategoryId, keyof Entry> = {
  rescuers: "peopleRescued",
  explorers: "explorationPercent",
  detectives: "secretsDiscovered",
  survivors: "survived",
  heroes: "heroicEnding",
  speed: "durationMinutes",
  collectors: "achievementsCount",
};

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

export function LeaderboardView({ locale }: { locale: Locale }) {
  const ui = getUiDictionary(locale);
  const [category, setCategory] = useState<CategoryId>("rescuers");
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    api.get<{ entries: Entry[] }>(`/api/leaderboard?category=${category}`).then((res) => setEntries(res.entries));
  }, [category]);

  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORY_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`text-xs px-3 py-1.5 rounded border ${
              id === category
                ? "bg-[var(--gold)] text-[#14202b] border-[var(--gold)]"
                : "border-[var(--panel-border)] text-[var(--ink-dim)]"
            }`}
          >
            {ui.leaderboard.categories[id]}
          </button>
        ))}
      </div>
      <Panel>
        {entries.length === 0 && <p className="text-sm text-[var(--ink-dim)] text-center">{ui.leaderboard.noEntries}</p>}
        <ol className="flex flex-col gap-2">
          {entries.map((e, i) => (
            <li key={i} className="flex justify-between text-sm border-b border-[var(--panel-border)] pb-1">
              <span>
                {i + 1}. {e.nickname}
              </span>
              <span className="text-[var(--gold)]">{formatMetric(METRIC_BY_CATEGORY[category], e, ui)}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}

function formatMetric(metric: keyof Entry, e: Entry, ui: UiDictionary): string {
  const value = e[metric];
  if (typeof value === "boolean") return value ? ui.leaderboard.yes : ui.leaderboard.no;
  if (metric === "explorationPercent") return `${value}%`;
  if (metric === "durationMinutes") return `${value} ${ui.leaderboard.minutesSuffix}`;
  return String(value);
}
