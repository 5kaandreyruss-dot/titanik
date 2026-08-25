"use client";

// Deterministic, procedurally generated portrait — no art assets needed.
// Same npcId always renders the same silhouette + palette, so NPCs stay
// visually recognizable across a run without hand-drawn art.

const PALETTES = [
  ["#c9a35f", "#7d6641"],
  ["#8fae9b", "#4d6357"],
  ["#a3798a", "#5c3f4a"],
  ["#7a93ad", "#42536a"],
  ["#b98a5e", "#6b4c33"],
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function NpcPortrait({ npcId, size = 40 }: { npcId: string; size?: number }) {
  const h = hashId(npcId);
  const [skin, shade] = PALETTES[h % PALETTES.length];

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <circle cx={24} cy={24} r={24} fill={shade} />
      <circle cx={24} cy={19} r={9} fill={skin} />
      <path d="M6,46 Q6,30 24,30 Q42,30 42,46 Z" fill={skin} />
      <circle cx={24} cy={24} r={24} fill="none" stroke="var(--gold)" strokeOpacity={0.25} strokeWidth={1.5} />
    </svg>
  );
}
