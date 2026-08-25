"use client";

import type { RunView } from "@/lib/engine/view";

// Hand-placed isometric tile centers for the vertical-slice location set.
// Rows follow the ship's real deck order (top = upper decks, bottom = lower
// decks); columns give each deck band a light left/right stagger so the
// whole thing reads as a stylized axonometric cutaway rather than a flat
// list. Extend this table when new locations ship.
const TILES: Record<string, { x: number; y: number; tier: number }> = {
  bridge_wing: { x: 55, y: 26, tier: 0 },
  boat_deck: { x: 230, y: 26, tier: 0 },
  a_deck_promenade: { x: 142, y: 60, tier: 1 },
  b_deck_corridor: { x: 142, y: 100, tier: 2 },
  first_class_dining: { x: 234, y: 100, tier: 2 },
  g_deck_thirdclass_berths: { x: 52, y: 132, tier: 3 },
  c_deck_purser_office: { x: 142, y: 140, tier: 3 },
  engine_room_access: { x: 142, y: 180, tier: 4 },
  boiler_room_6: { x: 142, y: 216, tier: 5 },
};

const TIER_COLORS = ["#e2c084", "#c9a35f", "#a3854f", "#7d6641", "#5c4b34", "#3f3527"];

const HALF_W = 26;
const HALF_H = 13;

function tilePath(cx: number, cy: number) {
  return `${cx},${cy - HALF_H} ${cx + HALF_W},${cy} ${cx},${cy + HALF_H} ${cx - HALF_W},${cy}`;
}

export function IsometricShipMap({
  view,
  onMove,
  compact = false,
}: {
  view: RunView;
  onMove?: (locationId: string) => void;
  compact?: boolean;
}) {
  const currentId = view.location?.id;
  const reachable = new Map(view.exits.map((e) => [e.id, e]));
  const entries = Object.entries(TILES).sort((a, b) => a[1].y - b[1].y);

  return (
    <svg
      viewBox="0 0 300 240"
      className="w-full h-full"
      preserveAspectRatio={compact ? "xMidYMid meet" : "xMidYMid meet"}
    >
      <defs>
        <radialGradient id="tileGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--gold-bright)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--gold-bright)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* connections from the current room to its known exits */}
      {currentId &&
        TILES[currentId] &&
        [...reachable.values()].map((exit) => {
          const from = TILES[currentId];
          const to = TILES[exit.id];
          if (!to) return null;
          return (
            <line
              key={exit.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--gold)"
              strokeWidth={1.5}
              strokeOpacity={exit.discovered ? 0.55 : 0.22}
              strokeDasharray="2 4"
              strokeLinecap="round"
              className="map-flow-line"
            />
          );
        })}

      {entries.map(([id, tile]) => {
        const mapEntry = view.map.find((m) => m.id === id);
        if (!mapEntry) return null;
        const isCurrent = id === currentId;
        const canWalkTo = reachable.has(id) && mapEntry.discovered && !mapEntry.locked;
        const color = TIER_COLORS[tile.tier] ?? TIER_COLORS[TIER_COLORS.length - 1];
        const elevation = isCurrent ? 15 : mapEntry.discovered ? 9 : 5;
        const top = tilePath(tile.x, tile.y);

        if (!mapEntry.discovered) {
          return (
            <polygon
              key={id}
              points={top}
              fill="#1a2635"
              fillOpacity={0.6}
              stroke="#2b3d51"
              strokeWidth={0.5}
            />
          );
        }

        return (
          <g
            key={id}
            className={isCurrent ? "map-tile-current" : canWalkTo ? "cursor-pointer" : undefined}
            onClick={canWalkTo && onMove ? () => onMove(id) : undefined}
          >
            {isCurrent && <circle cx={tile.x} cy={tile.y} r={26} fill="url(#tileGlow)" />}

            {/* left wall */}
            <polygon
              points={`${tile.x - HALF_W},${tile.y} ${tile.x},${tile.y + HALF_H} ${tile.x},${tile.y + HALF_H + elevation} ${tile.x - HALF_W},${tile.y + elevation}`}
              fill={color}
              fillOpacity={0.5}
            />
            {/* right wall */}
            <polygon
              points={`${tile.x + HALF_W},${tile.y} ${tile.x},${tile.y + HALF_H} ${tile.x},${tile.y + HALF_H + elevation} ${tile.x + HALF_W},${tile.y + elevation}`}
              fill={color}
              fillOpacity={0.75}
            />
            {/* top face */}
            <polygon
              points={top}
              fill={isCurrent ? "var(--gold-bright)" : color}
              stroke={isCurrent ? "#fff3da" : "rgba(0,0,0,0.25)"}
              strokeWidth={isCurrent ? 1 : 0.5}
            />

            <text
              x={tile.x}
              y={tile.y - HALF_H - 6}
              textAnchor="middle"
              fontSize={isCurrent ? 9.5 : 7.5}
              fontWeight={isCurrent ? 700 : 500}
              fill={isCurrent ? "var(--gold-bright)" : "var(--ink-dim)"}
            >
              {mapEntry.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
