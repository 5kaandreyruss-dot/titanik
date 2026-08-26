"use client";

// Deterministic, procedurally generated portrait — no art assets needed.
// Same npcId always renders the same face + hairstyle + palette, so NPCs
// stay visually recognizable across a run without hand-drawn art. Colors
// are chosen to be saturated and distinct from the app's own navy chrome,
// so a portrait always reads as "a person" rather than blending into the UI.

const PALETTES = [
  { skin: "#e8b98a", hair: "#3a2417", clothing: "#8a3b3b", bg: "#1c0f0f" },
  { skin: "#c98a5e", hair: "#161311", clothing: "#3d6b57", bg: "#0e1a15" },
  { skin: "#f0c8a0", hair: "#8a5a2e", clothing: "#3f5a8a", bg: "#0e1622" },
  { skin: "#a9714a", hair: "#100d0b", clothing: "#a97a34", bg: "#221a0d" },
  { skin: "#e6b088", hair: "#5c4022", clothing: "#6b3f8a", bg: "#190f22" },
  { skin: "#d99e73", hair: "#241a12", clothing: "#3f8a7a", bg: "#0d1f1c" },
  { skin: "#f3d0ab", hair: "#3a2b1c", clothing: "#a94a4a", bg: "#200f0f" },
  { skin: "#b97e52", hair: "#0d0b0a", clothing: "#4a5a3f", bg: "#141c0f" },
];

const HAIRSTYLES = ["short", "parted", "swept", "cap"] as const;

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function NpcPortrait({ npcId, size = 40 }: { npcId: string; size?: number }) {
  const h = hashId(npcId);
  const { skin, hair, clothing, bg } = PALETTES[h % PALETTES.length];
  const hairstyle = HAIRSTYLES[Math.floor(h / PALETTES.length) % HAIRSTYLES.length];

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <circle cx={24} cy={24} r={24} fill={bg} />
      {/* shoulders / clothing */}
      <path d="M4,48 Q4,29 24,29 Q44,29 44,48 Z" fill={clothing} />
      <path d="M16,32 Q24,36 32,32 L32,40 Q24,44 16,40 Z" fill={skin} opacity={0.9} />
      {/* neck */}
      <rect x={19} y={26} width={10} height={8} fill={skin} />
      {/* head */}
      <circle cx={24} cy={18} r={10} fill={skin} />
      {/* hair, varies by hashed style */}
      {hairstyle === "short" && <path d="M13,16 Q13,7 24,7 Q35,7 35,16 L35,13 Q24,9 13,13 Z" fill={hair} />}
      {hairstyle === "parted" && (
        <path d="M13,15 Q14,6 24,6.5 Q34,6 35,15 L34,11 Q24,8.5 22,9 Q16,10 14,12 Z" fill={hair} />
      )}
      {hairstyle === "swept" && <path d="M12.5,15 Q11,5 24,5 Q37,5 35.5,15 Q30,9 24,10 Q17,9 12.5,15 Z" fill={hair} />}
      {hairstyle === "cap" && (
        <>
          <path d="M12,14 Q12,5 24,5 Q36,5 36,14 L36,11 L12,11 Z" fill={hair} />
          <rect x={12} y={9} width={24} height={4} rx={2} fill={hair} />
        </>
      )}
      {/* simple facial marks for a touch of character */}
      <circle cx={20} cy={19} r={1.1} fill="#241608" opacity={0.55} />
      <circle cx={28} cy={19} r={1.1} fill="#241608" opacity={0.55} />
      <path d="M20,24 Q24,26 28,24" stroke="#241608" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.45} />
      <circle cx={24} cy={24} r={24} fill="none" stroke="var(--gold)" strokeOpacity={0.4} strokeWidth={1.5} />
    </svg>
  );
}
