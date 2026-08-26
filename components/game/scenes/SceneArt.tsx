"use client";

// Hand-composed, cinematic vector illustrations for each location's
// `sceneBackground` key. No external art assets — everything is built from
// gradients, layered shapes, and a shared "atmosphere" pass (vignette +
// film grain) so every scene reads as a moody, richly lit painting rather
// than a flat diagram. Add a new `case` here whenever a new
// sceneBackground key ships in lib/content/locations.

const W = 400;
const H = 260;

const SKY_ID = "sceneSky";
const SEA_ID = "sceneSea";
const WARM_ID = "sceneWarm";
const WOOD_ID = "sceneWood";
const BRASS_ID = "sceneBrass";
const FIRE_ID = "sceneFire";
const MOON_GLOW_ID = "sceneMoonGlow";
const LAMP_GLOW_ID = "sceneLampGlow";
const VIGNETTE_ID = "sceneVignette";
const GRAIN_ID = "sceneGrain";
const FLOOR_ID = "sceneFloor";
const SHAFT_ID = "sceneShaft";

function Defs() {
  return (
    <defs>
      <linearGradient id={SKY_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a1530" />
        <stop offset="55%" stopColor="#123055" />
        <stop offset="100%" stopColor="#1f4d6e" />
      </linearGradient>
      <linearGradient id={SEA_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0e3350" />
        <stop offset="100%" stopColor="#030a12" />
      </linearGradient>
      <linearGradient id={WARM_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4a2f16" />
        <stop offset="60%" stopColor="#26160a" />
        <stop offset="100%" stopColor="#120a05" />
      </linearGradient>
      <linearGradient id={WOOD_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5c3820" />
        <stop offset="100%" stopColor="#2c1a0f" />
      </linearGradient>
      <linearGradient id={BRASS_ID} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f2d38a" />
        <stop offset="100%" stopColor="#a97a34" />
      </linearGradient>
      <radialGradient id={FIRE_ID} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffb15e" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#ff7a3c" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ff7a3c" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={MOON_GLOW_ID} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#fff3d6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={LAMP_GLOW_ID} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd98f" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ffd98f" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={FLOOR_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a2414" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#160d07" />
      </linearGradient>
      <linearGradient id={SHAFT_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0b1622" />
        <stop offset="55%" stopColor="#2e1c14" />
        <stop offset="100%" stopColor="#7a3a18" />
      </linearGradient>
      <radialGradient id={VIGNETTE_ID} cx="50%" cy="42%" r="75%">
        <stop offset="55%" stopColor="#000000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
      </radialGradient>
      <filter id={GRAIN_ID}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
      </filter>
    </defs>
  );
}

function Atmosphere() {
  return (
    <>
      <rect width={W} height={H} fill={`url(#${VIGNETTE_ID})`} />
      <rect width={W} height={H} filter={`url(#${GRAIN_ID})`} />
    </>
  );
}

function Stars() {
  const pts = [
    [24, 18], [64, 10], [104, 26], [146, 8], [188, 20], [228, 12], [268, 28],
    [308, 16], [348, 24], [376, 38], [16, 44], [388, 14], [56, 34],
  ];
  return (
    <>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#fff" opacity={0.45 + (i % 4) * 0.13} />
      ))}
    </>
  );
}

function Moon({ x = 330, y = 34, r = 20 }: { x?: number; y?: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r * 2.4} fill={`url(#${MOON_GLOW_ID})`} />
      <circle cx={x} cy={y} r={r} fill="#fbf3dd" />
      <circle cx={x - r * 0.28} cy={y - r * 0.18} r={r * 0.22} fill="#e9dcb6" opacity={0.6} />
      <circle cx={x + r * 0.22} cy={y + r * 0.3} r={r * 0.14} fill="#e9dcb6" opacity={0.5} />
    </>
  );
}

function OceanHorizon({ y = 170, moonX }: { y?: number; moonX?: number }) {
  return (
    <>
      <rect x={0} y={y} width={W} height={H - y} fill={`url(#${SEA_ID})`} />
      <path d={`M0,${y} Q${W * 0.25},${y - 3} ${W * 0.5},${y} T${W},${y}`} stroke="rgba(255,224,168,0.3)" strokeWidth={1} fill="none" />
      {moonX !== undefined &&
        Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x={moonX - 18 + ((i * 37) % 36) - 6}
            y={y + 6 + i * 7}
            width={12 - i}
            height={1.6}
            rx={0.8}
            fill="#ffe9b8"
            opacity={0.35 - i * 0.04}
          />
        ))}
    </>
  );
}

function Railing({ y = 214 }: { y?: number }) {
  const posts = [16, 66, 116, 166, 216, 266, 316, 366];
  return (
    <g stroke="#04070c" strokeWidth={4} opacity={0.92}>
      <line x1={0} y1={y} x2={W} y2={y} />
      <line x1={0} y1={y - 16} x2={W} y2={y - 16} />
      {posts.map((x) => (
        <line key={x} x1={x} y1={y - 20} x2={x} y2={y + 6} />
      ))}
      <rect x={0} y={y + 4} width={W} height={H - y - 4} fill="#03060a" opacity={0.9} />
    </g>
  );
}

function Lifeboat({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <line x1={-20} y1={-26} x2={20} y2={-26} stroke="#6b5636" strokeWidth={2} />
      <path d="M-22,-26 Q0,-4 22,-26 L17,-29 Q0,-9 -17,-29 Z" fill="#241b10" stroke="#3a2c18" strokeWidth={0.5} />
      <path d="M-14,-26 L-14,-30 M0,-26 L0,-31 M14,-26 L14,-30" stroke="#6b5636" strokeWidth={1.4} />
    </g>
  );
}

function Funnel({ x, y = 0 }: { x: number; y?: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-16} y={0} width={32} height={70} fill="#1c1108" />
      <rect x={-16} y={0} width={32} height={8} fill="#0b0703" />
      <rect x={-19} y={-4} width={38} height={6} rx={2} fill="#3a2510" />
    </g>
  );
}

function FigureCoat({ x, y, scale = 1, hat = "bowler" }: { x: number; y: number; scale?: number; hat?: "bowler" | "flat" | "none" }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} fill="#050a12" opacity={0.92}>
      <circle cx={0} cy={-30} r={5.5} />
      {hat === "bowler" && <path d="M-6,-33 Q0,-42 6,-33 L6,-31 L-6,-31 Z" />}
      {hat === "flat" && <ellipse cx={0} cy={-34} rx={7} ry={2.4} />}
      <path d="M-8,-6 Q-9,-24 0,-25 Q9,-24 8,-6 L6,0 L-6,0 Z" />
      <path d="M-8,-6 L-11,2 M8,-6 L11,2" stroke="#050a12" strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
}

function ArchWindows({ warm = true }: { warm?: boolean }) {
  const xs = [46, 132, 218, 304];
  return (
    <>
      <rect width={W} height={H} fill={`url(#${WARM_ID})`} />
      <rect x={0} y={0} width={W} height={54} fill="#1e120a" opacity={0.9} />
      {xs.map((x) => (
        <g key={x}>
          <path d={`M${x - 34},204 L${x - 34},96 Q${x},58 ${x + 34},96 L${x + 34},204 Z`} fill="#0a1626" />
          <path
            d={`M${x - 27},198 L${x - 27},100 Q${x},68 ${x + 27},100 L${x + 27},198 Z`}
            fill={warm ? "#16324a" : "#0b1c2c"}
          />
          <path d={`M${x - 27},198 L${x - 27},100 Q${x},68 ${x + 27},100 L${x + 27},198 Z`} fill="url(#sceneSky)" opacity={0.5} />
          <path d={`M${x},72 L${x},198`} stroke="#050d17" strokeWidth={2} />
          <path d={`M${x - 27},150 L${x + 27},150`} stroke="#050d17" strokeWidth={2} />
          <path
            d={`M${x - 34},204 L${x - 34},96 Q${x},58 ${x + 34},96 L${x + 34},204 Z`}
            fill="none"
            stroke="#c9a35f"
            strokeOpacity={0.55}
            strokeWidth={2.5}
          />
          <circle cx={x} cy={62} r={16} fill={`url(#${LAMP_GLOW_ID})`} />
          <circle cx={x} cy={60} r={3} fill="#ffe6ad" />
        </g>
      ))}
      <rect x={0} y={198} width={W} height={H - 198} fill={`url(#${FLOOR_ID})`} />
      {[90, 200, 310].map((x, i) => (
        <path key={x} d={`M${x - 60},${H} L${x - 10},204 L${x + 10},204 L${x + 60},${H} Z`} fill="#0b0703" opacity={0.28 + i * 0.02} />
      ))}
    </>
  );
}

function StrollingFigures() {
  return (
    <>
      <FigureCoat x={112} y={230} scale={1.15} hat="bowler" />
      <FigureCoat x={210} y={222} scale={0.95} hat="flat" />
      <FigureCoat x={296} y={234} scale={1.05} hat="none" />
    </>
  );
}

function DoorPanel({ x, number }: { x: number; number: number }) {
  return (
    <g>
      <rect x={x - 26} y={58} width={52} height={128} rx={4} fill="#2a180d" stroke="#150c06" strokeWidth={2} />
      <rect x={x - 20} y={66} width={40} height={50} rx={2} fill="#3a2313" stroke="#c9a35f" strokeOpacity={0.3} />
      <rect x={x - 20} y={122} width={40} height={54} rx={2} fill="#3a2313" stroke="#c9a35f" strokeOpacity={0.3} />
      <circle cx={x + 16} cy={148} r={2.2} fill="#f2d38a" />
      <rect x={x - 14} y={44} width={28} height={12} rx={2} fill="url(#sceneBrass)" />
      <text x={x} y={53} fontSize={8} fontWeight={700} fill="#3a2313" textAnchor="middle">
        {number}
      </text>
    </g>
  );
}

function CabinDoors() {
  const doors = [
    [40, 12],
    [124, 13],
    [208, 14],
    [292, 15],
    [376, 16],
  ] as const;
  return (
    <>
      <rect width={W} height={H} fill={`url(#${WOOD_ID})`} />
      <rect x={0} y={0} width={W} height={40} fill="#1c0f08" />
      {doors.map(([x, num]) => (
        <DoorPanel key={x} x={x} number={num} />
      ))}
      {[82, 250, 334].map((x) => (
        <g key={x}>
          <circle cx={x} cy={30} r={13} fill={`url(#${LAMP_GLOW_ID})`} />
          <rect x={x - 5} y={16} width={10} height={16} rx={2} fill="url(#sceneBrass)" />
        </g>
      ))}
      <rect x={0} y={196} width={W} height={H - 196} fill="#170d07" />
      <rect x={0} y={196} width={W} height={10} fill="#5c1f22" opacity={0.55} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={i * 60} y={200} width={30} height={H - 204} fill="#7a2b2b" opacity={0.28} />
      ))}
      <path d={`M0,196 L${W},196`} stroke="#c9a35f" strokeOpacity={0.25} strokeWidth={1} />
    </>
  );
}

function ChandelierAndTables() {
  return (
    <>
      <path d="M20,0 L20,150 Q200,120 380,150 L380,0 Z" fill="#100a06" opacity={0.5} />
      <path d="M60,0 L60,132 Q200,112 340,132 L340,0 Z" fill="#3a2410" opacity={0.55} />
      {[110, 200, 290].map((x) => (
        <rect key={x} x={x - 22} y={20} width={44} height={90} rx={4} fill="#160d06" opacity={0.5} />
      ))}
      <path d="M40,0 Q200,-30 360,0 L360,40 Q200,10 40,40 Z" fill="#241407" opacity={0.9} />
      <line x1={200} y1={10} x2={200} y2={58} stroke="#c9a35f" strokeWidth={1.6} opacity={0.7} />
      <ellipse cx={200} cy={66} rx={60} ry={26} fill={`url(#${LAMP_GLOW_ID})`} />
      {[-24, -8, 8, 24].map((dx) => (
        <circle key={dx} cx={200 + dx} cy={60} r={4} fill="#fff0cf" />
      ))}
      <path d="M20,220 L60,150 L340,150 L380,220 Z" fill="#170d07" />
      <path d="M20,220 L60,150 L340,150 L380,220 Z" fill="url(#sceneFloor)" opacity={0.7} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${60 + i * 70},150 L${20 + i * 90},220`}
          stroke="#5c3820"
          strokeOpacity={0.3}
          strokeWidth={1.5}
        />
      ))}
      {[[92, 168], [200, 178], [308, 168]].map(([x, y]) => (
        <g key={x}>
          <ellipse cx={x} cy={y + 26} rx={44} ry={10} fill="#0b0603" opacity={0.5} />
          <rect x={x - 3} y={y} width={6} height={26} fill="#2a1c10" />
          <ellipse cx={x} cy={y} rx={40} ry={11} fill="#f5ede0" />
          <ellipse cx={x} cy={y} rx={40} ry={11} fill="none" stroke="#c9a35f" strokeOpacity={0.5} strokeWidth={1} />
          <circle cx={x - 14} cy={y - 2} r={4} fill="#e6d9c2" />
          <circle cx={x + 14} cy={y - 2} r={4} fill="#e6d9c2" />
        </g>
      ))}
      <FigureCoat x={140} y={214} scale={0.7} hat="none" />
      <FigureCoat x={266} y={210} scale={0.65} hat="none" />
    </>
  );
}

function ShelvesAndSafe() {
  const bookColors = ["#7a2b2b", "#2c5636", "#5c4420", "#3a3d6b", "#7a2b2b", "#2c5636"];
  return (
    <>
      <rect width={W} height={H} fill={`url(#${WARM_ID})`} />
      <rect x={0} y={30} width={272} height={170} fill="#20140a" />
      {[46, 92, 138].map((y) => (
        <g key={y}>
          <rect x={12} y={y} width={248} height={40} fill="#170d07" />
          <rect x={12} y={y + 38} width={248} height={5} fill="url(#sceneBrass)" opacity={0.7} />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={18 + i * 20} y={y + 4} width={14} height={32} fill={bookColors[(i + y) % bookColors.length]} opacity={0.85} />
          ))}
        </g>
      ))}
      <rect x={296} y={82} width={92} height={110} rx={5} fill="#141019" stroke="url(#sceneBrass)" strokeWidth={2.5} />
      <circle cx={342} cy={130} r={17} fill="none" stroke="url(#sceneBrass)" strokeWidth={2.5} />
      <circle cx={342} cy={130} r={3} fill="#f2d38a" />
      <rect x={320} y={158} width={44} height={8} rx={2} fill="url(#sceneBrass)" opacity={0.7} />
      <circle cx={355} cy={40} r={34} fill={`url(#${LAMP_GLOW_ID})`} />
      <rect x={0} y={198} width={W} height={H - 198} fill={`url(#${FLOOR_ID})`} />
    </>
  );
}

function EngineStairwell() {
  return (
    <>
      <rect width={W} height={H} fill={`url(#${SHAFT_ID})`} />
      <ellipse cx={200} cy={225} rx={180} ry={60} fill={`url(#${FIRE_ID})`} opacity={0.9} />
      <path d="M64,30 L336,30 L296,236 L104,236 Z" fill="#0a1420" opacity={0.55} />
      {[76, 128, 180].map((y, i) => (
        <g key={y}>
          <rect x={94 + i * 6} y={y} width={212 - i * 12} height={14} rx={3} fill="#3a4f63" stroke="#0a1420" strokeWidth={1.5} />
          <rect x={94 + i * 6} y={y} width={212 - i * 12} height={4} rx={2} fill="#5c7690" opacity={0.8} />
          {Array.from({ length: 6 }).map((_, j) => (
            <circle key={j} cx={100 + i * 6 + j * ((200 - i * 12) / 5)} cy={y + 7} r={1.3} fill="#f2d38a" opacity={0.7} />
          ))}
        </g>
      ))}
      <g stroke="#1c2a38" strokeWidth={5}>
        <line x1={104} y1={30} x2={70} y2={236} />
        <line x1={296} y1={30} x2={330} y2={236} />
      </g>
      <g stroke="#ffb15e" strokeOpacity={0.35} strokeWidth={1.5}>
        <line x1={104} y1={30} x2={70} y2={236} />
        <line x1={296} y1={30} x2={330} y2={236} />
      </g>
      {[128, 200, 272].map((x) => (
        <path key={x} d={`M${x},146 L${x},224`} stroke="#5c7690" strokeWidth={6} opacity={0.7} strokeLinecap="round" />
      ))}
      <path d="M150,90 Q162,58 140,26" stroke="#eef4f8" strokeOpacity={0.28} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M260,100 Q248,66 276,34" stroke="#eef4f8" strokeOpacity={0.22} strokeWidth={11} fill="none" strokeLinecap="round" />
      <FigureCoat x={200} y={222} scale={0.9} hat="none" />
      <path d="M192,192 Q200,215 208,192" stroke="#ffb15e" strokeOpacity={0.5} strokeWidth={2} fill="none" />
    </>
  );
}

function BoilerFurnaces() {
  return (
    <>
      <rect width={W} height={H} fill="#0d0805" />
      <rect x={0} y={0} width={W} height={40} fill="#060301" />
      {[46, 152, 258, 352].map((x, i) => (
        <g key={x}>
          <rect x={x - 34} y={100} width={68} height={110} rx={8} fill="#2a1a10" stroke="#140b06" strokeWidth={2} />
          <circle cx={x} cy={190} r={26} fill={`url(#${FIRE_ID})`} />
          <path d={`M${x - 22},176 L${x - 22},140 Q${x},116 ${x + 22},140 L${x + 22},176 Z`} fill="#1a0d06" />
          <path d={`M${x - 22},176 L${x - 22},140 Q${x},116 ${x + 22},140 L${x + 22},176 Z`} fill={`url(#${FIRE_ID})`} opacity={0.9} />
          <rect x={x - 30} y={96} width={60} height={6} fill="url(#sceneBrass)" opacity={0.6} />
          {i < 3 && <rect x={x + 34} y={110} width={10} height={90} fill="#0a0503" />}
        </g>
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <circle
          key={i}
          cx={20 + ((i * 53) % 380)}
          cy={40 + ((i * 37) % 150)}
          r={0.9 + (i % 3) * 0.4}
          fill={i % 2 === 0 ? "#ffb15e" : "#8a7a63"}
          opacity={0.5}
        />
      ))}
      <FigureCoat x={190} y={232} scale={0.85} hat="none" />
      <rect x={0} y={0} width={W} height={H} fill="url(#sceneFire)" opacity={0.12} />
    </>
  );
}

function Bunks() {
  const blankets = ["#a94a4a", "#a97a34", "#3f8a7a", "#4a5fa9"];
  const frame = "#5c3d24";
  return (
    <>
      <rect width={W} height={H} fill={`url(#${WARM_ID})`} />
      {[[16, 0], [140, 1]].map(([x, ci]) => (
        <g key={x}>
          <rect x={x} y={50} width={108} height={32} rx={3} fill={frame} stroke="#160d07" strokeWidth={2} />
          <rect x={x + 5} y={55} width={98} height={18} rx={2} fill={blankets[ci % blankets.length]} />
          <rect x={x} y={98} width={108} height={32} rx={3} fill={frame} stroke="#160d07" strokeWidth={2} />
          <rect x={x + 5} y={103} width={98} height={18} rx={2} fill={blankets[(ci + 1) % blankets.length]} />
          <rect x={x} y={146} width={108} height={32} rx={3} fill={frame} stroke="#160d07" strokeWidth={2} />
          <rect x={x + 5} y={151} width={98} height={18} rx={2} fill={blankets[(ci + 2) % blankets.length]} />
        </g>
      ))}
      <circle cx={310} cy={54} r={26} fill="#0a1420" stroke="url(#sceneBrass)" strokeWidth={3} />
      <circle cx={310} cy={54} r={26} fill={`url(#${SEA_ID})`} opacity={0.75} />
      <circle cx={301} cy={46} r={2.4} fill="#fbf3dd" opacity={0.65} />
      <rect x={278} y={100} width={54} height={36} rx={3} fill="#241407" stroke="#160d07" strokeWidth={2} />
      <rect x={283} y={105} width={44} height={26} fill="#6b4423" />
      <rect x={283} y={112} width={44} height={4} fill="url(#sceneBrass)" opacity={0.7} />
      <circle cx={210} cy={22} r={24} fill={`url(#${LAMP_GLOW_ID})`} />
      <rect x={205} y={11} width={10} height={14} fill="url(#sceneBrass)" />
      <rect x={0} y={200} width={W} height={H - 200} fill={`url(#${FLOOR_ID})`} />
      <FigureCoat x={255} y={224} scale={0.75} hat="none" />
    </>
  );
}

function BridgeWindow() {
  return (
    <>
      <rect width={W} height={H} fill="#081120" />
      <path d="M10,150 L10,44 Q200,6 390,44 L390,150 Z" fill="#0f1e30" />
      <path d="M10,150 L10,44 Q200,6 390,44 L390,150 Z" fill="url(#sceneSky)" opacity={0.65} />
      <path d="M10,150 L10,44 Q200,6 390,44 L390,150 Z" fill="none" stroke="#c9a35f" strokeOpacity={0.4} strokeWidth={2.5} />
      <line x1={200} y1={8} x2={200} y2={150} stroke="#081120" strokeWidth={4} />
      <OceanHorizon y={112} moonX={310} />
      <Moon x={310} y={62} r={16} />
      <Stars />
      <rect x={0} y={150} width={W} height={H - 150} fill="#140d08" />
      <rect x={70} y={166} width={260} height={72} rx={6} fill="#241608" stroke="#0d0803" strokeWidth={2} />
      <circle cx={150} cy={202} r={22} fill="none" stroke="url(#sceneBrass)" strokeWidth={3} />
      <line x1={150} y1={202} x2={150} y2={183} stroke="url(#sceneBrass)" strokeWidth={2.5} />
      {[190, 220, 250, 280].map((x, i) => (
        <circle key={x} cx={x} cy={196} r={4} fill={i % 2 === 0 ? "#ffb15e" : "#8fae9b"} opacity={0.85} />
      ))}
      <FigureCoat x={150} y={214} scale={0.75} hat="flat" />
    </>
  );
}

export function SceneArt({ sceneKey }: { sceneKey: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs />
      {(() => {
        switch (sceneKey) {
          case "boat_deck_night":
            return (
              <>
                <rect width={W} height={H} fill={`url(#${SKY_ID})`} />
                <Stars />
                <Moon x={330} y={40} />
                <OceanHorizon y={150} moonX={330} />
                <Funnel x={40} y={-20} />
                <Funnel x={366} y={-20} />
                <Lifeboat x={80} y={120} />
                <Lifeboat x={200} y={112} scale={1.05} />
                <Lifeboat x={320} y={120} />
                <FigureCoat x={230} y={182} scale={0.9} hat="bowler" />
                <Railing y={214} />
              </>
            );
          case "a_deck_promenade":
            return (
              <>
                <ArchWindows />
                <StrollingFigures />
              </>
            );
          case "bridge_wing":
            return <BridgeWindow />;
          case "b_deck_corridor":
            return <CabinDoors />;
          case "dining_saloon":
            return (
              <>
                <rect width={W} height={H} fill={`url(#${WARM_ID})`} />
                <ChandelierAndTables />
              </>
            );
          case "purser_office":
            return <ShelvesAndSafe />;
          case "engine_access":
            return <EngineStairwell />;
          case "boiler_room":
            return <BoilerFurnaces />;
          case "thirdclass_berths":
            return <Bunks />;
          default:
            return (
              <>
                <rect width={W} height={H} fill={`url(#${SKY_ID})`} />
                <Stars />
                <Moon x={330} y={40} />
                <OceanHorizon y={170} moonX={330} />
              </>
            );
        }
      })()}
      <Atmosphere />
    </svg>
  );
}
