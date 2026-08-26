"use client";

import type { WorldTheme } from "@/lib/pet/types";
import type { EvolutionBranch } from "@/lib/pet/evolution";

export type PetMood = "idle" | "happy" | "sad" | "hungry" | "sleepy" | "battle";

interface PetRigProps {
  world: WorldTheme;
  stage: number;
  branch: EvolutionBranch;
  mood: PetMood;
  size?: number;
}

const WORLD_PALETTE: Record<WorldTheme, { body: string; belly: string; wing: string; accent: string }> = {
  FANTASY: { body: "#4a8f5c", belly: "#bfe6a8", wing: "#2f6b41", accent: "#e2c084" },
  SPACE: { body: "#5c6fae", belly: "#b8c4f0", wing: "#3c4a80", accent: "#8fe3ff" },
  CYBERPUNK: { body: "#3a3f52", belly: "#7fd7d0", wing: "#22262f", accent: "#ff5fae" },
};

const STAGE3_BRANCH_PALETTE: Partial<Record<EvolutionBranch, { body: string; belly: string; wing: string; accent: string }>> = {
  light: { body: "#eaf3ff", belly: "#fff8e0", wing: "#cfe3ff", accent: "#ffe9a8" },
  dark: { body: "#3a0f14", belly: "#7a1f1f", wing: "#1a0508", accent: "#ff5b5b" },
};

function palette(world: WorldTheme, stage: number, branch: EvolutionBranch) {
  if (stage >= 3) {
    return STAGE3_BRANCH_PALETTE[branch] ?? WORLD_PALETTE[world];
  }
  return WORLD_PALETTE[world];
}

function Eyes({ mood }: { mood: PetMood }) {
  if (mood === "happy") {
    return (
      <>
        <path d="M78,86 Q84,78 90,86" stroke="#1a1408" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M110,86 Q116,78 122,86" stroke="#1a1408" strokeWidth={3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "sad") {
    return (
      <>
        <path d="M78,90 Q84,96 90,90" stroke="#1a1408" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M110,90 Q116,96 122,90" stroke="#1a1408" strokeWidth={3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "sleepy") {
    return (
      <>
        <line x1={76} y1={86} x2={92} y2={86} stroke="#1a1408" strokeWidth={3} strokeLinecap="round" />
        <line x1={108} y1={86} x2={124} y2={86} stroke="#1a1408" strokeWidth={3} strokeLinecap="round" />
      </>
    );
  }
  if (mood === "battle") {
    return (
      <>
        <path d="M78,90 L90,82" stroke="#1a1408" strokeWidth={3} strokeLinecap="round" />
        <path d="M122,90 L110,82" stroke="#1a1408" strokeWidth={3} strokeLinecap="round" />
        <circle cx={84} cy={87} r={4} fill="#1a1408" />
        <circle cx={116} cy={87} r={4} fill="#1a1408" />
      </>
    );
  }
  return (
    <g className="pet-blink">
      <circle cx={84} cy={86} r={5} fill="#1a1408" />
      <circle cx={116} cy={86} r={5} fill="#1a1408" />
    </g>
  );
}

function Mouth({ mood }: { mood: PetMood }) {
  if (mood === "happy") return <path d="M92,100 Q100,108 108,100" stroke="#1a1408" strokeWidth={2.5} fill="none" strokeLinecap="round" />;
  if (mood === "sad") return <path d="M92,104 Q100,98 108,104" stroke="#1a1408" strokeWidth={2.5} fill="none" strokeLinecap="round" />;
  if (mood === "hungry") return <ellipse cx={100} cy={102} rx={5} ry={6} fill="#1a1408" />;
  if (mood === "battle") return <line x1={92} y1={101} x2={108} y2={101} stroke="#1a1408" strokeWidth={3} strokeLinecap="round" />;
  return <path d="M92,100 Q100,104 108,100" stroke="#1a1408" strokeWidth={2} fill="none" strokeLinecap="round" />;
}

const MOOD_PARTICLE: Partial<Record<PetMood, string>> = {
  happy: "💛",
  hungry: "❗",
  sleepy: "💤",
};

function MoodParticle({ mood }: { mood: PetMood }) {
  const glyph = MOOD_PARTICLE[mood];
  if (!glyph) return null;
  return (
    <text key={mood} x={135} y={60} fontSize={18} className="pet-particle">
      {glyph}
    </text>
  );
}

export function PetEgg({ world, size = 200 }: { world: WorldTheme; size?: number }) {
  const p = WORLD_PALETTE[world];
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <ellipse cx={100} cy={175} rx={55} ry={10} fill="#000" opacity={0.25} />
      <g className="pet-bounce">
        <ellipse cx={100} cy={110} rx={55} ry={68} fill={p.belly} stroke={p.body} strokeWidth={4} />
        <circle cx={80} cy={80} r={6} fill={p.body} opacity={0.5} />
        <circle cx={120} cy={130} r={8} fill={p.body} opacity={0.5} />
        <circle cx={95} cy={150} r={5} fill={p.body} opacity={0.5} />
        <path d="M92,60 L104,90 L88,100 L108,140" stroke={p.accent} strokeWidth={2} fill="none" opacity={0.7} />
      </g>
    </svg>
  );
}

export function PetRig({ world, stage, branch, mood, size = 200 }: PetRigProps) {
  if (stage === 0) return <PetEgg world={world} size={size} />;

  const p = palette(world, stage, branch);
  const scale = stage === 1 ? 0.75 : stage === 2 ? 0.9 : 1;
  const hasHorns = world === "FANTASY" || branch === "dark";
  const hasAntenna = world !== "FANTASY";

  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <ellipse cx={100} cy={182} rx={60} ry={10} fill="#000" opacity={0.25} />
      <g transform={`translate(100 110) scale(${scale}) translate(-100 -110)`}>
        <g className="pet-breathe">
          {/* tail */}
          <path
            d="M120,150 Q170,150 175,110 Q178,95 165,90"
            stroke={p.wing}
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            className="pet-tail"
          />
          {/* wings */}
          {stage >= 2 && (
            <>
              <path d="M75,110 Q30,90 25,50 Q55,65 78,95 Z" fill={p.wing} className="pet-wing-left" />
              <path d="M125,110 Q170,90 175,50 Q145,65 122,95 Z" fill={p.wing} className="pet-wing-right" />
            </>
          )}
          {/* legs */}
          <ellipse cx={80} cy={168} rx={13} ry={10} fill={p.body} />
          <ellipse cx={120} cy={168} rx={13} ry={10} fill={p.body} />
          {/* body */}
          <ellipse cx={100} cy={125} rx={48} ry={45} fill={p.body} />
          <ellipse cx={100} cy={138} rx={30} ry={26} fill={p.belly} />
          {/* head */}
          <circle cx={100} cy={85} r={38} fill={p.body} />
          <ellipse cx={100} cy={98} rx={20} ry={14} fill={p.belly} />
          {/* horns or antenna */}
          {hasHorns && (
            <>
              <path d="M82,58 L74,38 L88,52 Z" fill={p.accent} />
              <path d="M118,58 L126,38 L112,52 Z" fill={p.accent} />
            </>
          )}
          {hasAntenna && !hasHorns && (
            <>
              <line x1={100} y1={50} x2={100} y2={30} stroke={p.accent} strokeWidth={3} strokeLinecap="round" />
              <circle cx={100} cy={26} r={5} fill={p.accent} />
            </>
          )}
          <Eyes mood={mood} />
          <Mouth mood={mood} />
        </g>
      </g>
      <MoodParticle mood={mood} />
    </svg>
  );
}
