"use client";

import type { RunView } from "@/lib/engine/view";

// Hand-placed schematic coordinates for the vertical-slice location set.
// Not to scale — a simplified deck diagram (top = upper decks, bottom =
// lower decks) so the player always has a sense of where they are and
// what's directly reachable. Extend this map when new locations ship.
const COORDS: Record<string, { x: number; y: number }> = {
  bridge_wing: { x: 40, y: 18 },
  boat_deck: { x: 230, y: 18 },
  a_deck_promenade: { x: 140, y: 46 },
  b_deck_corridor: { x: 140, y: 82 },
  first_class_dining: { x: 235, y: 82 },
  g_deck_thirdclass_berths: { x: 45, y: 108 },
  c_deck_purser_office: { x: 140, y: 118 },
  engine_room_access: { x: 140, y: 154 },
  boiler_room_6: { x: 140, y: 186 },
};

export function ShipMiniMap({ view }: { view: RunView }) {
  const currentId = view.location?.id;
  const exitIds = new Set(view.exits.map((e) => e.id));

  const edges: { from: string; to: string; faint: boolean }[] = [];
  for (const loc of view.map) {
    if (!currentId || loc.id === currentId) continue;
    if (!COORDS[loc.id] || !COORDS[currentId]) continue;
    if (exitIds.has(loc.id)) {
      edges.push({ from: currentId, to: loc.id, faint: !loc.discovered });
    }
  }

  return (
    <svg viewBox="0 0 300 204" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {edges.map((edge, i) => {
        const a = COORDS[edge.from];
        const b = COORDS[edge.to];
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--gold)"
            strokeOpacity={edge.faint ? 0.15 : 0.4}
            strokeWidth={1}
            strokeDasharray={edge.faint ? "3 3" : undefined}
          />
        );
      })}

      {view.map.map((loc) => {
        const pos = COORDS[loc.id];
        if (!pos) return null;
        const isCurrent = loc.id === currentId;
        return (
          <g key={loc.id}>
            {isCurrent && (
              <circle cx={pos.x} cy={pos.y} r={9} fill="var(--gold)" fillOpacity={0.18}>
                <animate attributeName="r" values="7;11;7" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.25;0.05;0.25" dur="2.5s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isCurrent ? 4.5 : loc.discovered ? 3 : 2}
              fill={isCurrent ? "var(--gold-bright)" : loc.discovered ? "var(--ink-dim)" : "#33455a"}
            />
            {(isCurrent || loc.discovered) && (
              <text
                x={pos.x}
                y={pos.y - (isCurrent ? 10 : 7)}
                textAnchor="middle"
                fontSize={isCurrent ? 9 : 7.5}
                fill={isCurrent ? "var(--gold-bright)" : "var(--ink-dim)"}
                fontWeight={isCurrent ? 700 : 400}
              >
                {loc.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
