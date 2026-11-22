import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, FONT, seeded } from "./common";

// One machiya (townhouse) facade.
const House: React.FC<{ x: number; w: number; h: number; base: number; noren?: string; dark?: number }> = ({
  x,
  w,
  h,
  base,
  noren,
  dark = 0,
}) => {
  const top = base - h;
  const roofH = h * 0.28;
  const wall = dark ? "#b9a27e" : "#d6c19a";
  const slats = Math.floor(w / 18);
  return (
    <g>
      {/* roof */}
      <path d={`M ${x - 26} ${top + roofH} L ${x + 10} ${top} L ${x + w - 10} ${top} L ${x + w + 26} ${top + roofH} Z`} fill="#34323f" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={x - 20 + i * 2} y1={top + (roofH * (i + 1)) / 7} x2={x + w + 20 - i * 2} y2={top + (roofH * (i + 1)) / 7} stroke="#4a4858" strokeWidth="2" />
      ))}
      <rect x={x - 30} y={top + roofH - 4} width={w + 60} height={10} fill="#25232e" />
      {/* wall */}
      <rect x={x} y={top + roofH + 6} width={w} height={h - roofH - 6} fill={wall} />
      {/* upper lattice window */}
      <rect x={x + w * 0.15} y={top + roofH + 18} width={w * 0.7} height={h * 0.16} fill="#5a3b24" />
      {Array.from({ length: Math.floor((w * 0.7) / 10) }, (_, i) => (
        <line key={i} x1={x + w * 0.15 + i * 10} x2={x + w * 0.15 + i * 10} y1={top + roofH + 18} y2={top + roofH + 18 + h * 0.16} stroke="#2e1d10" strokeWidth="3" />
      ))}
      {/* small lower eave */}
      <rect x={x - 12} y={top + h * 0.52} width={w + 24} height={12} fill="#34323f" />
      {/* ground floor lattice (koshi) */}
      <rect x={x + 6} y={top + h * 0.56} width={w - 12} height={h * 0.44} fill="#6b4529" />
      {Array.from({ length: slats }, (_, i) => (
        <rect key={i} x={x + 10 + i * 18} y={top + h * 0.56} width={7} height={h * 0.44} fill="#3d2615" />
      ))}
      {noren ? (
        <g>
          <rect x={x + w * 0.3} y={top + h * 0.57} width={w * 0.4} height={h * 0.2} fill={noren} />
          {[1, 2].map((i) => (
            <line key={i} x1={x + w * 0.3 + (w * 0.4 * i) / 3} x2={x + w * 0.3 + (w * 0.4 * i) / 3} y1={top + h * 0.62} y2={top + h * 0.77} stroke="#1a2440" strokeWidth="3" />
          ))}
          <circle cx={x + w * 0.5} cy={top + h * 0.645} r={h * 0.035} fill="none" stroke="#f1ead8" strokeWidth="3" />
        </g>
      ) : null}
    </g>
  );
};

const Walker: React.FC<{ x: number; base: number; scale: number; phase: number; color: string; load?: boolean }> = ({
  x,
  base,
  scale,
  phase,
  color,
  load,
}) => {
  const bob = Math.abs(Math.sin(phase)) * 4;
  const leg = Math.sin(phase) * 12;
  return (
    <g transform={`translate(${x}, ${base - bob}) scale(${scale})`}>
      <ellipse cx="0" cy={bob + 2} rx="34" ry="7" fill="#000" opacity="0.18" />
      <line x1="-4" y1="-40" x2={-4 + leg} y2="0" stroke="#2a2020" strokeWidth="9" strokeLinecap="round" />
      <line x1="4" y1="-40" x2={4 - leg} y2="0" stroke="#2a2020" strokeWidth="9" strokeLinecap="round" />
      <path d="M -22 -40 L -16 -118 L 16 -118 L 22 -40 Z" fill={color} />
      <path d="M -16 -118 L 0 -96 L 16 -118" fill="none" stroke="#f1ead8" strokeWidth="4" />
      <circle cx="0" cy="-132" r="14" fill="#e2b48b" />
      {/* straw hat */}
      <path d="M -40 -136 Q 0 -178 40 -136 Z" fill="#c9a35a" stroke="#7d6130" strokeWidth="3" />
      {load ? (
        <g>
          <rect x="-50" y="-128" width="40" height="70" rx="4" fill="#1f3157" />
          <rect x="-50" y="-128" width="40" height="70" rx="4" fill="none" stroke="#e9dfc6" strokeWidth="3" />
          <line x1="-50" y1="-93" x2="-10" y2="-93" stroke="#e9dfc6" strokeWidth="3" />
        </g>
      ) : null}
    </g>
  );
};

export const TownScene: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flicker = 0.85 + 0.15 * Math.sin(f * 0.7) * Math.sin(f * 0.23 + 1);
  const r = seeded(11);
  const birds = Array.from({ length: 5 }, () => ({ x: r() * 600 + 200, y: r() * 120 + 140, s: 0.6 + r() * 0.6, sp: 2 + r() * 1.5 }));

  const titleS = spring({ frame: f - 45, fps, config: { damping: 16 } });
  const subO = interpolate(f, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.12, x: -70, y: 20 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2d3663" />
              <stop offset="0.45" stopColor="#a36a7a" />
              <stop offset="0.7" stopColor="#ec9f6c" />
              <stop offset="1" stopColor="#f7cf8e" />
            </linearGradient>
            <radialGradient id="sun">
              <stop offset="0" stopColor="#fff2c4" />
              <stop offset="0.4" stopColor="#ffd08a" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ffb070" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow">
              <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ff9a40" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="street" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b39468" />
              <stop offset="1" stopColor="#8d6f4a" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#sky)" />
          <circle cx="560" cy="560" r="260" fill="url(#sun)" />
          {/* Mt Fuji */}
          <path d="M 1020 680 L 1380 300 L 1420 300 L 1800 680 Z" fill="#6c6a8c" />
          <path d="M 1300 385 L 1380 300 L 1420 300 L 1505 390 L 1470 375 L 1440 400 L 1410 372 L 1375 402 L 1340 378 Z" fill="#efe6ee" />
          {/* far hills */}
          <path d="M 0 640 Q 300 560 600 640 T 1200 630 T 1920 620 L 1920 720 L 0 720 Z" fill="#8c7590" opacity="0.85" />
          {/* birds */}
          {birds.map((b, i) => {
            const bx = b.x + f * b.sp;
            const flap = Math.sin(f * 0.4 + i) * 8;
            return (
              <path
                key={i}
                d={`M ${bx - 16 * b.s} ${b.y - flap * b.s} Q ${bx - 6 * b.s} ${b.y} ${bx} ${b.y + 4 * b.s} Q ${bx + 6 * b.s} ${b.y} ${bx + 16 * b.s} ${b.y - flap * b.s}`}
                stroke="#2b2433"
                strokeWidth="3"
                fill="none"
              />
            );
          })}
          {/* back row of houses */}
          {[0, 230, 470, 700, 1260, 1500, 1720].map((x, i) => (
            <House key={x} x={x} w={210} h={300} base={760} dark={1} noren={i % 3 === 1 ? "#33456e" : undefined} />
          ))}
          {/* street */}
          <path d="M 0 760 L 1920 760 L 1920 1080 L 0 1080 Z" fill="url(#street)" />
          {/* medicine shop (front) */}
          <House x={930} w={300} h={420} base={800} noren="#24345e" />
          {/* hanging sign 看板 */}
          <g>
            <rect x="1250" y="440" width="70" height="200" fill="#4a2f1b" stroke="#2a190c" strokeWidth="5" />
            <text x="1285" y="500" fontFamily={FONT} fontWeight={700} fontSize="46" fill="#f1e2b8" textAnchor="middle">
              く
            </text>
            <text x="1285" y="555" fontFamily={FONT} fontWeight={700} fontSize="46" fill="#f1e2b8" textAnchor="middle">
              す
            </text>
            <text x="1285" y="610" fontFamily={FONT} fontWeight={700} fontSize="46" fill="#f1e2b8" textAnchor="middle">
              り
            </text>
          </g>
          {/* lantern */}
          <circle cx="905" cy="560" r={130 * flicker} fill="url(#glow)" />
          <line x1="905" y1="430" x2="905" y2="480" stroke="#2a190c" strokeWidth="4" />
          <rect x="880" y="478" width="50" height="12" fill="#2a190c" />
          <ellipse cx="905" cy="560" rx="52" ry="72" fill="#f08a3c" />
          <ellipse cx="905" cy="560" rx="52" ry="72" fill="#ffd27a" opacity={0.35 * flicker} />
          {[-40, -20, 0, 20, 40].map((dy) => (
            <path key={dy} d={`M 855 ${560 + dy} Q 905 ${566 + dy} 955 ${560 + dy}`} stroke="#c25d22" strokeWidth="2" fill="none" />
          ))}
          <text x="905" y="580" fontFamily={FONT} fontWeight={700} fontSize="58" fill="#2a1408" textAnchor="middle">
            薬
          </text>
          <rect x="880" y="630" width="50" height="12" fill="#2a190c" />
          {/* walkers */}
          <Walker x={-120 + f * 3.2} base={900} scale={1.1} phase={f * 0.32} color="#3b4f7a" load />
          <Walker x={2000 - f * 2.4} base={960} scale={1.25} phase={f * 0.28 + 1} color="#7a3b3b" />
        </svg>
      </Camera>

      {/* title banner */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 90,
          transform: `scale(${titleS})`,
          transformOrigin: "0 50%",
        }}
      >
        <div
          style={{
            background: "linear-gradient(#f3e6c4, #e4d0a2)",
            border: "4px solid #3b2a1e",
            padding: "14px 40px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 64,
            color: "#2a1a0e",
            letterSpacing: 10,
          }}
        >
          江戸のくすり
        </div>
        <div
          style={{
            marginTop: 10,
            marginLeft: 24,
            display: "inline-block",
            background: "#2a1c12",
            color: "#f3e7c9",
            fontFamily: FONT,
            fontSize: 30,
            padding: "6px 22px",
            letterSpacing: 6,
            opacity: subO,
          }}
        >
          庶民の知恵をたどる
        </div>
      </div>
    </AbsoluteFill>
  );
};
