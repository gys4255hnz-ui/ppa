import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Camera, DiamondLabel, FONT, ScrollIcon, WoodTable, seeded } from "./common";

const PAPER_W = 1240;
const PAPER_H = 760;

// Faux columns of vertical writing.
const TextColumns: React.FC<{ x: number; cols: number; seed: number }> = ({ x, cols, seed }) => {
  const r = seeded(seed);
  return (
    <g>
      {Array.from({ length: cols }, (_, c) => {
        const cx = x + c * 34;
        let y = 120 + r() * 30;
        const marks: React.ReactNode[] = [];
        const end = 520 + r() * 200;
        while (y < end) {
          const h = 10 + r() * 16;
          marks.push(<line key={y} x1={cx - 9 + r() * 6} x2={cx + 9 - r() * 6} y1={y} y2={y + h} stroke="#3a2a1c" strokeWidth={3 + r() * 2} strokeLinecap="round" opacity={0.75} />);
          y += h + 10;
        }
        return <g key={c}>{marks}</g>;
      })}
    </g>
  );
};

// Simplified anatomical line drawing (sepia ink).
const Anatomy: React.FC<{ draw: number }> = ({ draw }) => {
  const ink = { stroke: "#4a2c18", fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const L = 2600;
  return (
    <g strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - draw)} style={{}}>
      <ellipse cx="0" cy="-260" rx="58" ry="70" {...ink} strokeWidth="5" />
      <path d="M -30 -195 L -40 -160 L -150 -130 L -170 160 M 30 -195 L 40 -160 L 150 -130 L 170 160 M -170 160 Q 0 220 170 160" {...ink} strokeWidth="5" />
      <path d="M 0 -170 L 0 200" {...ink} strokeWidth="6" />
      {[-110, -75, -40, -5, 30].map((y, i) => (
        <g key={y}>
          <path d={`M -4 ${y} Q -90 ${y - 18 + i * 2} -${120 - i * 6} ${y + 30}`} {...ink} strokeWidth="4" />
          <path d={`M 4 ${y} Q 90 ${y - 18 + i * 2} ${120 - i * 6} ${y + 30}`} {...ink} strokeWidth="4" />
        </g>
      ))}
      <path d="M -20 -120 C -100 -110 -110 20 -40 40 C -20 0 -20 -60 -20 -120 Z" {...ink} strokeWidth="3.5" fill="#d8a58a" fillOpacity={0.35 * draw} />
      <path d="M 20 -120 C 100 -110 110 20 40 40 C 20 0 20 -60 20 -120 Z" {...ink} strokeWidth="3.5" fill="#d8a58a" fillOpacity={0.35 * draw} />
      <path d="M -8 -30 C -40 -40 -30 20 8 30 C 40 10 30 -40 -8 -30 Z" {...ink} strokeWidth="4" fill="#b8573e" fillOpacity={0.45 * draw} />
      <path d="M -90 90 C -40 60 60 60 100 100 C 60 140 -40 140 -90 90 Z" {...ink} strokeWidth="3.5" fill="#c98b5a" fillOpacity={0.3 * draw} />
    </g>
  );
};

export const ScrollScene: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = interpolate(f, [8, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const draw = interpolate(f, [40, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const seal = spring({ frame: f - 120, fps, config: { damping: 9 } });
  const w = PAPER_W * open;
  const left = 960 - w / 2;
  const top = 540 - PAPER_H / 2;

  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.18, x: 60, y: 10 }}>
        <WoodTable seed={9} />
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="paperG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e3d2a8" />
              <stop offset="0.08" stopColor="#f3e7c8" />
              <stop offset="0.92" stopColor="#f3e7c8" />
              <stop offset="1" stopColor="#e3d2a8" />
            </linearGradient>
            <clipPath id="paperClip">
              <rect x={left} y={top} width={w} height={PAPER_H} />
            </clipPath>
            <linearGradient id="rod" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5a341a" />
              <stop offset="0.5" stopColor="#a06a3c" />
              <stop offset="1" stopColor="#5a341a" />
            </linearGradient>
          </defs>
          <rect x={left + 10} y={top + 18} width={w} height={PAPER_H} fill="#000" opacity="0.3" />
          <rect x={left} y={top} width={w} height={PAPER_H} fill="url(#paperG)" />
          <g clipPath="url(#paperClip)">
            <g transform={`translate(${960 - PAPER_W / 2}, ${top})`}>
              {/* title, vertical */}
              {"解體新書".split("").map((ch, i) => (
                <text key={ch} x={PAPER_W - 110} y={130 + i * 92} fontFamily={FONT} fontWeight={700} fontSize="80" fill="#2a1a0e" textAnchor="middle">
                  {ch}
                </text>
              ))}
              <TextColumns x={PAPER_W - 260} cols={4} seed={3} />
              <TextColumns x={90} cols={6} seed={8} />
              <g transform={`translate(${PAPER_W / 2 - 10}, 420)`}>
                <Anatomy draw={draw} />
              </g>
              <g transform={`translate(${PAPER_W - 120}, 560) scale(${seal}) rotate(-4)`}>
                <rect x="-48" y="-48" width="96" height="96" fill="#b3261e" opacity="0.88" />
                <text x="0" y="-6" fontFamily={FONT} fontWeight={700} fontSize="36" fill="#f3e7c8" textAnchor="middle">
                  安永
                </text>
                <text x="0" y="34" fontFamily={FONT} fontWeight={700} fontSize="36" fill="#f3e7c8" textAnchor="middle">
                  三年
                </text>
              </g>
            </g>
          </g>
          {/* rollers */}
          {[left, left + w].map((x, i) => (
            <g key={i}>
              <rect x={x - 22} y={top - 40} width="44" height={PAPER_H + 80} rx="18" fill="url(#rod)" stroke="#2e1a0d" strokeWidth="4" />
              <rect x={x - 30} y={top - 64} width="60" height="34" rx="10" fill="#3a2212" />
              <rect x={x - 30} y={top + PAPER_H + 30} width="60" height="34" rx="10" fill="#3a2212" />
            </g>
          ))}
        </svg>
        <DiamondLabel x={360} y={170} at={labelAt} text="1774年" sub="安永三年" icon={<ScrollIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

export const EndScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f - 8, fps, config: { damping: 18 } });
  const s = spring({ frame: f - 26, fps, config: { damping: 8 } });
  const out = interpolate(f, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2f3a66, #161b33)", justifyContent: "center", alignItems: "center", opacity: out }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40, transform: `translateY(${(1 - t) * 40}px)`, opacity: t }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 120, color: "#f3e7c9", letterSpacing: 18 }}>江戸のくすり</div>
        <div
          style={{
            width: 130,
            height: 130,
            background: "#b3261e",
            transform: `scale(${s}) rotate(-6deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 84,
            color: "#f3e7c8",
          }}
        >
          薬
        </div>
      </div>
    </AbsoluteFill>
  );
};
