"use client";

// Flat, geometric atmospheric illustrations for each location's
// `sceneBackground` key. No external art assets — everything is composed
// from gradients and simple shapes in a consistent style, tuned to the
// site's night-ocean-and-gold palette. Add a new `case` here whenever a
// new sceneBackground key ships in lib/content/locations.

const SKY_ID = "skyGrad";
const WARM_ID = "warmGrad";
const WATER_ID = "waterGrad";
const GLOW_ID = "fireGlow";

function Defs() {
  return (
    <defs>
      <linearGradient id={SKY_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a1420" />
        <stop offset="100%" stopColor="#182c42" />
      </linearGradient>
      <linearGradient id={WARM_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#241b12" />
        <stop offset="100%" stopColor="#140f0a" />
      </linearGradient>
      <linearGradient id={WATER_ID} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0e2436" />
        <stop offset="100%" stopColor="#050d15" />
      </linearGradient>
      <radialGradient id={GLOW_ID} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e8955a" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#e8955a" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Stars() {
  const pts = [
    [30, 20], [70, 12], [110, 28], [150, 10], [190, 22], [230, 14], [270, 30],
    [310, 18], [350, 26], [40, 45], [370, 40], [10, 60],
  ];
  return (
    <>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} fill="#fff" opacity={0.5 + (i % 4) * 0.1} />
      ))}
    </>
  );
}

function Moon() {
  return <circle cx={340} cy={30} r={14} fill="#f3e6c9" opacity={0.85} />;
}

function OceanHorizon({ y = 150 }: { y?: number }) {
  return (
    <>
      <rect x={0} y={y} width={400} height={220 - y} fill={`url(#${WATER_ID})`} />
      <path d={`M0,${y} Q100,${y - 4} 200,${y} T400,${y}`} stroke="rgba(201,163,95,0.25)" strokeWidth={1} fill="none" />
    </>
  );
}

function Railing({ y = 150 }: { y?: number }) {
  const posts = [20, 70, 120, 170, 220, 270, 320, 370];
  return (
    <g stroke="#0a1420" strokeWidth={3} opacity={0.8}>
      <line x1={0} y1={y - 18} x2={400} y2={y - 18} />
      <line x1={0} y1={y - 30} x2={400} y2={y - 30} />
      {posts.map((x) => (
        <line key={x} x1={x} y1={y - 34} x2={x} y2={y - 4} />
      ))}
    </g>
  );
}

function Lifeboat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={-16} y1={-22} x2={16} y2={-22} stroke="#3a3226" strokeWidth={2} />
      <path d="M-18,-22 Q0,-6 18,-22 L14,-24 Q0,-12 -14,-24 Z" fill="#2a2419" />
    </g>
  );
}

function ArchWindows() {
  const xs = [30, 100, 170, 240, 310, 370];
  return (
    <>
      {xs.map((x) => (
        <g key={x}>
          <path d={`M${x - 24},170 L${x - 24},90 Q${x},60 ${x + 24},90 L${x + 24},170 Z`} fill="#0c1c2c" opacity={0.9} />
          <path d={`M${x - 18},165 L${x - 18},95 Q${x},72 ${x + 18},95 L${x + 18},165 Z`} fill="#16324a" />
          <path d={`M${x - 10},160 L${x - 10},100 Q${x},84 ${x + 10},100 L${x + 10},160 Z`} fill="#0a1420" opacity={0.6} />
        </g>
      ))}
    </>
  );
}

function StrollingFigure({ x = 200, y = 172 }: { x?: number; y?: number }) {
  return (
    <g fill="#05090f" opacity={0.85}>
      <circle cx={x} cy={y - 26} r={5} />
      <path d={`M${x - 6},${y - 4} Q${x},${y - 22} ${x + 6},${y - 4} L${x + 5},${y} L${x - 5},${y} Z`} />
    </g>
  );
}

function CabinDoors() {
  const xs = [30, 95, 160, 225, 290, 355];
  return (
    <>
      <rect x={0} y={60} width={400} height={110} fill="#1a2d3f" />
      {xs.map((x, i) => (
        <g key={x}>
          <rect x={x - 22} y={70} width={44} height={90} rx={3} fill="#12222f" stroke="#c9a35f" strokeOpacity={0.25} />
          <circle cx={x + 14} cy={116} r={1.6} fill="#e2c084" />
          <text x={x} y={64} fontSize={7} fill="#c9a35f" textAnchor="middle" opacity={0.7}>
            {12 + i}
          </text>
        </g>
      ))}
      <rect x={0} y={168} width={400} height={52} fill="#2a1f14" />
    </>
  );
}

function ChandelierAndTables() {
  return (
    <>
      <path d="M60,0 Q200,-40 340,0 L340,60 Q200,20 60,60 Z" fill="#16283a" opacity={0.7} />
      <line x1={200} y1={20} x2={200} y2={58} stroke="#c9a35f" strokeWidth={1.5} opacity={0.6} />
      <ellipse cx={200} cy={64} rx={22} ry={8} fill="url(#fireGlow)" />
      <circle cx={200} cy={62} r={7} fill="#f3e6c9" opacity={0.9} />
      {[70, 150, 250, 330].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={190} rx={38} ry={9} fill="#f5f2e8" opacity={0.85} />
          <rect x={x - 3} y={190} width={6} height={26} fill="#2a2115" />
        </g>
      ))}
    </>
  );
}

function ShelvesAndSafe() {
  return (
    <>
      <rect x={0} y={40} width={260} height={140} fill="#18293a" />
      {[60, 90, 120].map((y) => (
        <rect key={y} x={10} y={y} width={240} height={6} fill="#c9a35f" opacity={0.35} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={16 + i * 17} y={44} width={12} height={14} fill="#3a2e1c" opacity={0.7} />
      ))}
      <rect x={280} y={90} width={100} height={90} rx={4} fill="#141d29" stroke="#c9a35f" strokeOpacity={0.4} strokeWidth={1.5} />
      <circle cx={330} cy={135} r={14} fill="none" stroke="#c9a35f" strokeOpacity={0.5} strokeWidth={2} />
      <circle cx={330} cy={135} r={2} fill="#c9a35f" opacity={0.6} />
      <ellipse cx={340} cy={40} rx={30} ry={16} fill="url(#fireGlow)" opacity={0.4} />
    </>
  );
}

function EngineStairwell() {
  return (
    <>
      <rect x={0} y={0} width={400} height={220} fill="#0c1620" />
      {[40, 80, 120].map((y, i) => (
        <rect key={y} x={60 + i * 25} y={y} width={280 - i * 50} height={10} fill="#1c2e3f" />
      ))}
      <g stroke="#0a1420" strokeWidth={3}>
        <line x1={60} y1={40} x2={60} y2={200} />
        <line x1={340} y1={40} x2={340} y2={200} />
      </g>
      <ellipse cx={200} cy={205} rx={140} ry={26} fill="url(#fireGlow)" opacity={0.5} />
      {[100, 200, 300].map((x) => (
        <path key={x} d={`M${x},130 L${x},190`} stroke="#3a4a5a" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
      ))}
    </>
  );
}

function BoilerFurnaces() {
  return (
    <>
      <rect x={0} y={0} width={400} height={220} fill="#100b08" />
      {[40, 140, 240, 340].map((x) => (
        <g key={x}>
          <rect x={x - 30} y={90} width={60} height={90} rx={6} fill="#241a12" />
          <path d={`M${x - 20},170 L${x - 20},130 Q${x},108 ${x + 20},130 L${x + 20},170 Z`} fill="#3a1c0d" />
          <ellipse cx={x} cy={150} rx={16} ry={20} fill="url(#fireGlow)" />
        </g>
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={i} cx={20 + ((i * 53) % 380)} cy={30 + ((i * 37) % 60)} r={0.8} fill="#8a7a63" opacity={0.4} />
      ))}
    </>
  );
}

function Bunks() {
  return (
    <>
      <rect x={0} y={0} width={400} height={220} fill="#12202c" />
      {[40, 200].map((x) => (
        <g key={x}>
          <rect x={x} y={60} width={140} height={26} rx={3} fill="#2a3d4f" />
          <rect x={x} y={100} width={140} height={26} rx={3} fill="#233649" />
          <rect x={x} y={140} width={140} height={26} rx={3} fill="#1c2d3e" />
        </g>
      ))}
      <circle cx={340} cy={50} r={16} fill="#0a1420" stroke="#c9a35f" strokeOpacity={0.3} strokeWidth={2} />
      <circle cx={340} cy={50} r={16} fill="#1c3348" opacity={0.6} />
      <ellipse cx={200} cy={190} rx={180} ry={22} fill="#0a1420" opacity={0.5} />
    </>
  );
}

function BridgeWindow() {
  return (
    <>
      <rect x={0} y={0} width={400} height={140} fill="#0d1a28" />
      <path d="M20,120 L20,40 Q200,10 380,40 L380,120 Z" fill="#132234" />
      <path d="M20,120 L20,40 Q200,10 380,40 L380,120 Z" fill="none" stroke="#c9a35f" strokeOpacity={0.2} strokeWidth={2} />
      <line x1={200} y1={12} x2={200} y2={120} stroke="#0d1a28" strokeWidth={3} />
      <OceanHorizon y={95} />
      <rect x={150} y={140} width={100} height={50} rx={6} fill="#1a2d3f" />
      <circle cx={200} cy={165} r={16} fill="none" stroke="#c9a35f" strokeOpacity={0.5} strokeWidth={2.5} />
      <line x1={200} y1={165} x2={200} y2={153} stroke="#c9a35f" strokeOpacity={0.5} strokeWidth={2} />
    </>
  );
}

export function SceneArt({ sceneKey }: { sceneKey: string }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <Defs />
      {(() => {
        switch (sceneKey) {
          case "boat_deck_night":
            return (
              <>
                <rect width={400} height={220} fill={`url(#${SKY_ID})`} />
                <Stars />
                <Moon />
                <OceanHorizon y={130} />
                <Lifeboat x={90} y={110} />
                <Lifeboat x={200} y={106} />
                <Lifeboat x={310} y={110} />
                <Railing y={175} />
              </>
            );
          case "a_deck_promenade":
            return (
              <>
                <rect width={400} height={220} fill={`url(#${SKY_ID})`} />
                <ArchWindows />
                <StrollingFigure x={140} y={185} />
                <StrollingFigure x={260} y={190} />
              </>
            );
          case "bridge_wing":
            return (
              <>
                <BridgeWindow />
                <rect x={0} y={140} width={400} height={80} fill="#0a1420" />
              </>
            );
          case "b_deck_corridor":
            return <CabinDoors />;
          case "dining_saloon":
            return (
              <>
                <rect width={400} height={220} fill={`url(#${WARM_ID})`} />
                <ChandelierAndTables />
              </>
            );
          case "purser_office":
            return (
              <>
                <rect width={400} height={220} fill={`url(#${WARM_ID})`} />
                <ShelvesAndSafe />
              </>
            );
          case "engine_access":
            return <EngineStairwell />;
          case "boiler_room":
            return <BoilerFurnaces />;
          case "thirdclass_berths":
            return <Bunks />;
          default:
            return <rect width={400} height={220} fill={`url(#${SKY_ID})`} />;
        }
      })()}
    </svg>
  );
}
