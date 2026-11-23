import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { BoxIcon, Camera, DiamondLabel, FONT, LeafIcon, ScrollIcon, WoodTable, seeded } from "../edo/common";
import { PliersIcon, ToothIcon, ToriiIcon } from "./scenes1";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSpring = (at: number, damping = 14) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping } });
};

// Simple standing/sitting figure used across scenes.
export const Figure: React.FC<{
  x: number;
  y: number;
  s?: number;
  robe: string;
  skin?: string;
  hair?: "topknot" | "bald" | "wig" | "veil" | "woman" | "short" | "none";
  hairColor?: string;
  mouth?: "smile" | "open" | "black" | "pain" | "flat";
  arm?: "down" | "up" | "forward" | "cheek";
}> = ({ x, y, s = 1, robe, skin = "#e6bd96", hair = "short", hairColor = "#2b2420", mouth = "flat", arm = "down" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 0 Q -80 -160 -50 -200 Q 0 -225 50 -200 Q 80 -160 70 0 Z" fill={robe} />
    <path d="M -22 -205 L 0 -165 L 22 -205" fill="none" stroke="#f2ead8" strokeWidth="8" />
    {arm === "up" ? <path d="M 45 -190 Q 100 -230 110 -300" stroke={robe} strokeWidth="30" strokeLinecap="round" fill="none" /> : null}
    {arm === "forward" ? <path d="M 45 -185 Q 110 -170 150 -175" stroke={robe} strokeWidth="30" strokeLinecap="round" fill="none" /> : null}
    {arm === "cheek" ? <path d="M 45 -190 Q 95 -230 50 -265" stroke={robe} strokeWidth="30" strokeLinecap="round" fill="none" /> : null}
    {arm === "cheek" ? <ellipse cx="44" cy="-268" rx="18" ry="22" fill={skin} /> : null}
    <circle cx="0" cy="-262" r="48" fill={skin} />
    {hair === "topknot" ? (
      <>
        <path d="M -48 -268 Q -46 -318 0 -320 Q 46 -318 48 -268 Q 24 -296 0 -296 Q -24 -296 -48 -268 Z" fill={hairColor} />
        <rect x="-10" y="-334" width="20" height="22" rx="6" fill={hairColor} />
      </>
    ) : null}
    {hair === "short" ? <path d="M -50 -262 Q -50 -318 0 -318 Q 50 -318 50 -262 Q 30 -292 0 -290 Q -30 -292 -50 -262 Z" fill={hairColor} /> : null}
    {hair === "woman" ? (
      <>
        <ellipse cx="0" cy="-320" rx="56" ry="30" fill={hairColor} />
        <path d="M -52 -262 Q -54 -310 0 -312 Q 54 -310 52 -262 Q 30 -292 0 -292 Q -30 -292 -52 -262 Z" fill={hairColor} />
        <rect x="30" y="-346" width="40" height="6" fill="#c9a24a" transform="rotate(-20 30 -346)" />
      </>
    ) : null}
    {hair === "wig" ? (
      <>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={-44 + (i % 2) * 4} cy={-300 + i * 22} r="20" fill="#e9e6df" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <circle key={`r${i}`} cx={44 - (i % 2) * 4} cy={-300 + i * 22} r="20" fill="#e9e6df" />
        ))}
        <path d="M -46 -290 Q 0 -340 46 -290 Q 0 -305 -46 -290 Z" fill="#e9e6df" />
      </>
    ) : null}
    {hair === "veil" ? <path d="M -62 -250 Q -62 -330 0 -330 Q 62 -330 62 -250 L 70 -150 L 48 -150 L 46 -250 Q 0 -300 -46 -250 L -48 -150 L -70 -150 Z" fill={hairColor} /> : null}
    <circle cx="-16" cy="-266" r="5" fill="#2a1a10" />
    <circle cx="16" cy="-266" r="5" fill="#2a1a10" />
    {mouth === "smile" ? <path d="M -16 -240 q 16 12 32 0" stroke="#7a3a2a" strokeWidth="4" fill="none" /> : null}
    {mouth === "flat" ? <path d="M -12 -238 l 24 0" stroke="#7a3a2a" strokeWidth="4" /> : null}
    {mouth === "pain" ? <path d="M -16 -236 q 8 -6 16 0 q 8 6 16 0" stroke="#7a3a2a" strokeWidth="4" fill="none" /> : null}
    {mouth === "open" ? <ellipse cx="0" cy="-236" rx="14" ry="10" fill="#5a1e1e" /> : null}
    {mouth === "black" ? (
      <>
        <path d="M -22 -244 Q 0 -222 22 -244 Z" fill="#141010" />
        <path d="M -22 -244 Q 0 -222 22 -244" stroke="#7a3a2a" strokeWidth="3" fill="none" />
      </>
    ) : null}
  </g>
);

// ---------- Stained glass saint (Apollonia) ----------
export const StainedSaint: React.FC<{ duration: number; labelAt: number; relicAt?: number }> = ({ duration, labelAt, relicAt }) => {
  const f = useCurrentFrame();
  const r = seeded(9);
  const cols = ["#2f5ea8", "#b8323a", "#d9a63a", "#3f8a5a", "#6a3f8f"];
  const panes = Array.from({ length: 70 }, (_, i) => ({ x: 610 + (i % 7) * 100, y: 130 + Math.floor(i / 7) * 92, c: cols[Math.floor(r() * cols.length)] }));
  const relic = relicAt !== undefined ? spring({ frame: f - relicAt, fps: 30, config: { damping: 14 } }) : 0;
  const shimmer = 0.85 + 0.15 * Math.sin(f * 0.05);
  return (
    <AbsoluteFill style={{ background: "#120e16" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.12, x: 0, y: 30 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <clipPath id="arch">
              <path d="M 610 1000 L 610 380 Q 610 110 960 90 Q 1310 110 1310 380 L 1310 1000 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#arch)" opacity={shimmer}>
            {panes.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width="100" height="92" fill={p.c} stroke="#1a1418" strokeWidth="8" />
            ))}
            <circle cx="960" cy="360" r="120" fill="#f2d16a" stroke="#1a1418" strokeWidth="10" />
            <circle cx="960" cy="380" r="70" fill="#f1d9c0" stroke="#1a1418" strokeWidth="8" />
            <path d="M 890 380 Q 890 300 960 296 Q 1030 300 1030 380 L 1040 470 L 880 470 Z" fill="#6a3f8f" stroke="#1a1418" strokeWidth="8" />
            <circle cx="960" cy="380" r="62" fill="#f1d9c0" />
            <path d="M 935 376 l 14 0 M 971 376 l 14 0 M 948 410 q 12 8 24 0" stroke="#1a1418" strokeWidth="5" fill="none" />
            <path d="M 840 1000 L 860 470 Q 960 440 1060 470 L 1080 1000 Z" fill="#b8323a" stroke="#1a1418" strokeWidth="10" />
            <path d="M 900 520 L 960 600 L 1020 520" stroke="#d9a63a" strokeWidth="14" fill="none" />
            {/* pliers holding a tooth */}
            <g transform="translate(1100 600) rotate(-25)">
              <path d="M -20 0 L 0 160 M 20 0 L 0 160" stroke="#c9ccd2" strokeWidth="18" strokeLinecap="round" />
              <path d="M -20 0 L 0 160 M 20 0 L 0 160" stroke="#1a1418" strokeWidth="4" fill="none" />
              <path d="M -24 -50 C -24 -80 -8 -80 0 -68 C 8 -80 24 -80 24 -50 C 24 -30 18 -20 14 -6 L -14 -6 C -18 -20 -24 -30 -24 -50 Z" fill="#fbf7ee" stroke="#1a1418" strokeWidth="5" />
            </g>
            <path d="M 860 640 Q 960 700 1100 620" stroke="#f1d9c0" strokeWidth="34" strokeLinecap="round" fill="none" />
          </g>
          <path d="M 610 1000 L 610 380 Q 610 110 960 90 Q 1310 110 1310 380 L 1310 1000" fill="none" stroke="#3a3036" strokeWidth="26" />
          {/* light rays */}
          <path d="M 700 200 L 300 1080 L 600 1080 Z" fill="#f2d16a" opacity="0.06" />
          <path d="M 1220 200 L 1620 1080 L 1320 1080 Z" fill="#9fc0ff" opacity="0.06" />
        </svg>
        {relicAt !== undefined ? (
          <div
            style={{
              position: "absolute",
              right: 150,
              top: 320,
              transform: `scale(${relic}) rotate(4deg)`,
              background: "linear-gradient(#d9b15a, #a37a2a)",
              border: "6px solid #5a4214",
              padding: "26px 30px",
              boxShadow: "0 14px 30px rgba(0,0,0,0.6)",
              textAlign: "center",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 30,
              color: "#2a1a0e",
            }}
          >
            <div style={{ background: "#2a1a10", padding: 16, display: "flex", gap: 6 }}>
              <ToothIcon size={56} />
              <ToothIcon size={56} />
            </div>
            <div style={{ marginTop: 10 }}>歯痛のお守り</div>
          </div>
        ) : null}
        <DiamondLabel x={330} y={200} at={labelAt} text="聖アポロニア" sub="249年ごろ" icon={<ToothIcon size={54} />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Shrine with a big stone; optional flood ----------
export const Shrine: React.FC<{ duration: number; mode: "shrine" | "flood" | "stroke"; labelAt?: number }> = ({ duration, mode, labelAt = 20 }) => {
  const f = useCurrentFrame();
  const flood = mode === "flood";
  const water = flood ? interpolate(f, [10, 70], [0, 1], clamp) : 0;
  const hand = mode === "stroke" ? Math.sin(f * 0.15) * 40 : 0;
  return (
    <AbsoluteFill style={{ background: flood ? "linear-gradient(#5c6b80, #8d9aa8)" : "linear-gradient(#9cc4dc, #e8efe0)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={mode === "stroke" ? { scale: 1.35, x: 120, y: -150 } : { scale: 1.1, x: 0, y: 0 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          {/* trees */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse key={i} cx={120 + i * 340} cy={430 + (i % 2) * 40} rx="210" ry="170" fill={flood ? "#3f5048" : "#4f7a4a"} opacity="0.9" />
          ))}
          <rect x="0" y="640" width="1920" height="440" fill={flood ? "#6a6a5a" : "#cdbb92"} />
          {/* shrine building */}
          <g transform="translate(1180 250)">
            <path d="M -60 120 L 260 120 L 300 170 L -100 170 Z" fill="#2a2a32" />
            <path d="M -110 175 Q 100 60 310 175 L 290 190 Q 100 90 -90 190 Z" fill="#3a3a44" />
            <rect x="-40" y="190" width="280" height="200" fill="#a8452c" />
            <rect x="20" y="230" width="160" height="160" fill="#2a1a12" />
            <rect x="-60" y="390" width="320" height="24" fill="#6a5a4a" />
          </g>
          {/* torii */}
          <g transform="translate(260 260)">
            <path d="M -40 40 Q 220 10 480 40 L 470 80 Q 220 55 -30 80 Z" fill="#c0281c" />
            <rect x="20" y="110" width="400" height="26" fill="#c0281c" />
            <rect x="60" y="70" width="34" height="400" fill="#c0281c" />
            <rect x="346" y="70" width="34" height="400" fill="#c0281c" />
            <rect x="200" y="82" width="40" height="60" fill="#2a1a12" />
          </g>
          {/* big stone */}
          <g>
            <path d="M 820 760 Q 800 560 960 520 Q 1120 540 1100 760 Z" fill="#7c7a72" stroke="#4a4842" strokeWidth="6" />
            <path d="M 880 600 Q 940 570 1000 600" stroke="#5a5852" strokeWidth="5" fill="none" />
            <path d="M 860 545 Q 960 500 1060 545" stroke="#f2ead8" strokeWidth="6" fill="none" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={880 + i * 50} y="548" width="14" height="38" fill="#f2ead8" />
            ))}
          </g>
          {mode === "stroke" ? (
            <g transform={`translate(${hand} 0)`}>
              <path d="M 1300 820 Q 1150 700 1040 660" stroke="#8fa9bf" strokeWidth="56" strokeLinecap="round" fill="none" />
              <ellipse cx="1030" cy="650" rx="40" ry="30" fill="#e6bd96" />
            </g>
          ) : null}
          {flood ? (
            <>
              <path
                d={`M 0 ${1080 - water * 420} Q 200 ${1050 - water * 450} 400 ${1080 - water * 420} T 800 ${1080 - water * 420} L 800 1080 L 0 1080 Z`}
                fill="#3f6f9a"
                opacity="0.85"
              />
              {Array.from({ length: 6 }, (_, i) => (
                <path key={i} d={`M ${60 + i * 120 + ((f * 3) % 120)} ${1000 - water * 380 + i * 20} q 30 -20 60 0`} stroke="#cfe2f0" strokeWidth="6" fill="none" opacity={water} />
              ))}
              <path d={`M 1100 1080 L 1100 ${1080 - water * 120} Q 1500 ${1060 - water * 110} 1920 ${1080 - water * 120} L 1920 1080 Z`} fill="#3f6f9a" opacity="0.5" />
            </>
          ) : null}
        </svg>
        {mode === "shrine" ? <DiamondLabel x={400} y={160} at={labelAt} text="歯神社" sub="大阪・梅田" icon={<ToriiIcon />} /> : null}
        {mode === "stroke" ? <DiamondLabel x={700} y={430} at={labelAt} text="なで石" icon={<ToothIcon size={54} />} /> : null}
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- 歯止め → 歯痛止め word play ----------
export const WordShift: React.FC<{ shiftAt: number }> = ({ shiftAt }) => {
  const f = useCurrentFrame();
  const ins = useSpring(shiftAt, 12);
  const w = interpolate(f, [shiftAt, shiftAt + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #f6ecd2, #d9c08e)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 220, color: "#2a1a0e", display: "flex", alignItems: "flex-end" }}>
        <span>歯</span>
        <span style={{ display: "inline-block", width: 220 * w, overflow: "visible", color: "#b3261e", transform: `scale(${ins})`, transformOrigin: "50% 100%" }}>痛</span>
        <span>止め</span>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 44, color: "#6b4a2e", marginTop: 20, opacity: 1 - w * 0.4 }}>{w < 0.5 ? "水を食い止める「歯止め」" : "痛みを止める「歯痛止め」"}</div>
    </AbsoluteFill>
  );
};

// ---------- Fumigation with henbane ----------
export const Fumigation: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 60%, #4a3626, #120c08)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.15, x: 60, y: 40 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <rect x="0" y="820" width="1920" height="260" fill="#2a1e14" />
          {/* brazier */}
          <path d="M 700 760 L 980 760 L 940 860 L 740 860 Z" fill="#5a4a3a" stroke="#2a2018" strokeWidth="6" />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={730 + i * 28} cy={752 - (i % 2) * 8} r="16" fill={i % 3 ? "#e0602a" : "#ffb040"} opacity={0.7 + 0.3 * Math.sin(f * 0.3 + i)} />
          ))}
          {/* funnel + tube */}
          <path d="M 780 700 L 900 700 L 860 620 L 820 620 Z" fill="#8a7a62" stroke="#3a3024" strokeWidth="5" />
          <path d="M 840 620 Q 840 480 1080 470" stroke="#8a7a62" strokeWidth="22" fill="none" strokeLinecap="round" />
          {/* smoke */}
          {Array.from({ length: 14 }, (_, i) => {
            const t = ((f * 0.8 + i * 10) % 140) / 140;
            return <circle key={i} cx={840 + Math.sin(t * 6 + i) * 30} cy={700 - t * 400} r={20 + t * 50} fill="#cfc8bc" opacity={(1 - t) * 0.25} />;
          })}
          {/* seeds */}
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} cx={760 + (i % 6) * 30} cy={738 + Math.floor(i / 6) * 10} rx="7" ry="5" fill="#3a2a1a" />
          ))}
          <Figure x={1220} y={860} s={1.6} robe="#6a4a3a" hair="short" hairColor="#5a3a22" mouth="open" />
        </svg>
        <DiamondLabel x={420} y={300} at={labelAt} text="ヒヨスの種" sub="煙でいぶす" icon={<LeafIcon color="#7a8a4a" />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Bowl of water with "worms" ----------
export const WaterBowl: React.FC<{ duration: number; revealAt: number }> = ({ duration, revealAt }) => {
  const f = useCurrentFrame();
  const reveal = interpolate(f, [revealAt, revealAt + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.18, x: 0, y: 30 }}>
        <WoodTable seed={14} />
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <ellipse cx="960" cy="600" rx="430" ry="230" fill="#000" opacity="0.3" />
          <ellipse cx="960" cy="560" rx="420" ry="220" fill="#c9c2b2" stroke="#6a6258" strokeWidth="10" />
          <ellipse cx="960" cy="560" rx="360" ry="180" fill="#7ea2b4" />
          <ellipse cx="900" cy="500" rx="140" ry="40" fill="#ffffff" opacity="0.18" />
          {Array.from({ length: 6 }, (_, i) => {
            const cx = 760 + i * 80;
            const cy = 540 + (i % 2) * 50;
            const d = Array.from({ length: 8 }, (_, k) => `${k ? "L" : "M"} ${cx + k * 12} ${cy + Math.sin(f * 0.2 + k * 0.9 + i) * 10}`).join(" ");
            return (
              <g key={i}>
                <path d={d} stroke={reveal > 0.5 ? "#e8e0c8" : "#e6b59c"} strokeWidth={reveal > 0.5 ? 4 : 12} strokeLinecap="round" fill="none" />
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            right: 140,
            top: 170,
            opacity: reveal,
            transform: `rotate(-4deg) scale(${0.8 + 0.2 * reveal})`,
            background: "#b3261e",
            color: "#f6ecd2",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 48,
            padding: "14px 28px",
            border: "4px double #f6ecd2",
          }}
        >
          正体は 楽器の弦？
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Cloves ----------
export const CloveStill: React.FC<{ duration: number; labelAt: number; todayAt: number }> = ({ duration, labelAt, todayAt }) => {
  const r = seeded(41);
  const cloves = Array.from({ length: 34 }, () => ({ x: 520 + r() * 520, y: 520 + r() * 300, a: r() * 360 }));
  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.05, x: 0, y: 0 }} to={{ scale: 1.2, x: 40, y: -20 }}>
        <WoodTable seed={21} />
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <ellipse cx="780" cy="690" rx="330" ry="170" fill="#000" opacity="0.15" />
          {cloves.map((c, i) => (
            <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.a})`}>
              <path d="M -6 0 L -3 60 L 3 60 L 6 0 Z" fill="#5a2e18" />
              <circle cx="0" cy="-6" r="13" fill="#7a3a1e" />
              {[0, 90, 180, 270].map((a) => (
                <path key={a} d="M 0 -6 l 0 -16" stroke="#5a2e18" strokeWidth="7" strokeLinecap="round" transform={`rotate(${a + 45} 0 -6)`} />
              ))}
            </g>
          ))}
          {/* oil bottle */}
          <g transform="translate(1380 420)">
            <rect x="-70" y="60" width="140" height="240" rx="24" fill="#8fb0a0" opacity="0.85" stroke="#3a4a42" strokeWidth="6" />
            <rect x="-30" y="0" width="60" height="70" fill="#5a3a22" />
            <rect x="-56" y="130" width="112" height="90" fill="#f2ead8" />
            <text x="0" y="190" fontFamily={FONT} fontWeight={700} fontSize="38" textAnchor="middle" fill="#2a1a0e">
              丁子油
            </text>
          </g>
        </svg>
        <DiamondLabel x={420} y={300} at={labelAt} text="丁子" sub="クローブ" icon={<LeafIcon color="#7a3a1e" />} />
        <DiamondLabel x={1380} y={300} at={todayAt} text="今も歯科で" side="left" icon={<ToothIcon size={54} />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Barber pole and tooth-drawer at a market ----------
export const Barber: React.FC<{ duration: number; market?: boolean; labelAt: number }> = ({ duration, market, labelAt }) => {
  const f = useCurrentFrame();
  const drum = Math.abs(Math.sin(f * 0.4));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#a9c6d8, #efe6cf)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.12, x: -40, y: 20 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <clipPath id="pole">
              <rect x="300" y="200" width="70" height="520" rx="30" />
            </clipPath>
          </defs>
          {/* buildings */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={i * 420 - 40} y={260 - (i % 2) * 60} width="400" height="600" fill={["#c9b08a", "#b8a07a", "#d4c2a0"][i % 3]} />
              <path d={`M ${i * 420 - 60} ${270 - (i % 2) * 60} L ${i * 420 + 160} ${120 - (i % 2) * 60} L ${i * 420 + 380} ${270 - (i % 2) * 60} Z`} fill="#7a4a3a" />
              {[0, 1, 2].map((k) => (
                <line key={k} x1={i * 420 - 40 + k * 130 + 60} x2={i * 420 - 40 + k * 130 + 60} y1={260 - (i % 2) * 60} y2="860" stroke="#5a4030" strokeWidth="10" />
              ))}
            </g>
          ))}
          <rect x="0" y="860" width="1920" height="220" fill="#9a8a70" />
          {/* barber pole */}
          <g clipPath="url(#pole)">
            <rect x="300" y="200" width="70" height="520" fill="#f6f2ea" />
            {Array.from({ length: 14 }, (_, i) => (
              <path key={i} d={`M 280 ${180 + i * 60 - (f * 2) % 60} L 400 ${240 + i * 60 - (f * 2) % 60}`} stroke={i % 2 ? "#c0281c" : "#2f5ea8"} strokeWidth="22" />
            ))}
          </g>
          <rect x="296" y="180" width="78" height="24" rx="8" fill="#b08a3a" />
          <rect x="296" y="716" width="78" height="24" rx="8" fill="#b08a3a" />
          {market ? (
            <g>
              <path d="M 820 380 L 1500 380 L 1560 460 L 760 460 Z" fill="#c0281c" />
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i} d={`M ${760 + i * 100} 460 q 50 40 100 0`} fill={i % 2 ? "#f2ead8" : "#c0281c"} />
              ))}
              <rect x="790" y="460" width="20" height="420" fill="#5a4030" />
              <rect x="1510" y="460" width="20" height="420" fill="#5a4030" />
              <g transform={`translate(1650 880)`}>
                <ellipse cx="0" cy="-120" rx="70" ry="40" fill="#a8743f" stroke="#3b2a1e" strokeWidth="6" />
                <rect x="-70" y="-120" width="140" height="90" fill="#a8743f" />
                <ellipse cx="0" cy="-120" rx="70" ry="40" fill="#e8d6ac" stroke="#3b2a1e" strokeWidth="6" />
                <line x1="-40" y1={-200 + drum * 50} x2="-10" y2="-130" stroke="#3b2a1e" strokeWidth="10" strokeLinecap="round" />
              </g>
              {Array.from({ length: 3 }, (_, i) => (
                <path key={i} d={`M ${1720 + i * 40} ${640 - i * 30} q 20 -20 0 -40`} stroke="#2a1a10" strokeWidth="6" fill="none" opacity={drum} />
              ))}
            </g>
          ) : null}
          <Figure x={1020} y={880} s={1.3} robe="#5a6a8a" hair="short" hairColor="#3a2a1a" mouth="open" />
          <Figure x={1300} y={880} s={1.45} robe="#3a3a3a" hair="short" hairColor="#6a4a2a" mouth="flat" arm="forward" />
          <g transform="translate(1440 590) rotate(-150)">
            <path d="M -10 0 L 0 90 M 10 0 L 0 90" stroke="#9a9ca2" strokeWidth="12" strokeLinecap="round" />
          </g>
        </svg>
        <DiamondLabel x={520} y={150} at={labelAt} text={market ? "市場の歯抜き屋" : "床屋さん"} icon={<PliersIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Dental key tool ----------
export const KeyTool: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [40, 90], [0, -35], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.15, x: 0, y: 20 }}>
        <WoodTable seed={33} />
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <rect x="420" y="360" width="1080" height="400" rx="20" fill="#3a1e22" stroke="#1a0c0e" strokeWidth="8" />
          <g transform={`translate(960 560) rotate(${rot})`}>
            <rect x="-420" y="-18" width="640" height="36" rx="10" fill="#b8bcc4" stroke="#4a4c52" strokeWidth="6" />
            <rect x="-470" y="-70" width="60" height="140" rx="20" fill="#e9dcc0" stroke="#5a4a30" strokeWidth="6" />
            <path d="M 220 -18 Q 300 -90 340 -30 Q 320 0 280 -10" stroke="#b8bcc4" strokeWidth="26" fill="none" strokeLinecap="round" />
            <path d="M 220 -18 Q 300 -90 340 -30 Q 320 0 280 -10" stroke="#4a4c52" strokeWidth="5" fill="none" />
          </g>
        </svg>
        <DiamondLabel x={460} y={230} at={labelAt} text="抜歯用の鍵" sub="てこで抜く" icon={<PliersIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Edo street performer (iai-nuki) ----------
export const Iainuki: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f % 120, [30, 45], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#f2c98a, #e8dcc0)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.12, x: 0, y: 20 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect x={i * 340 - 20} y="300" width="320" height="400" fill="#c9b08a" />
              <path d={`M ${i * 340 - 50} 320 L ${i * 340 + 140} 230 L ${i * 340 + 330} 320 Z`} fill="#34323f" />
              {Array.from({ length: 10 }, (_, k) => (
                <rect key={k} x={i * 340 + k * 30} y="460" width="12" height="240" fill="#5a3b24" />
              ))}
            </g>
          ))}
          <rect x="0" y="700" width="1920" height="380" fill="#b59a72" />
          {/* stall sign */}
          <g transform="translate(1440 380)">
            <rect x="0" y="0" width="90" height="300" fill="#f3e7c9" stroke="#3b2a1e" strokeWidth="6" />
            {"歯みがき".split("").map((c, i) => (
              <text key={c + i} x="45" y={60 + i * 62} fontFamily={FONT} fontWeight={700} fontSize="52" textAnchor="middle" fill="#2a1a0e">
                {c}
              </text>
            ))}
          </g>
          {/* crowd */}
          {Array.from({ length: 9 }, (_, i) => (
            <Figure key={i} x={180 + i * 190 + (i > 3 ? 360 : 0)} y={1080} s={0.9} robe={["#3b4f7a", "#7a3b3b", "#4f6a3a", "#6a5a3a"][i % 4]} hair="topknot" mouth="open" />
          ))}
          {/* performer */}
          <Figure x={960} y={900} s={1.5} robe="#2a2a3a" hair="topknot" mouth="flat" arm="up" />
          <g transform={`translate(1125 455) rotate(${-60 + draw * 75})`}>
            <rect x="0" y="-6" width={360 * (0.3 + 0.7 * draw)} height="12" fill="#e6e8ee" stroke="#6a6c72" strokeWidth="3" />
            <rect x="-60" y="-10" width="60" height="20" fill="#2a1a10" />
          </g>
        </svg>
        <DiamondLabel x={420} y={200} at={labelAt} text="居合抜き" sub="大道芸" icon={<PliersIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Nagai's flier: sword + dentures ----------
export const Flier: React.FC = () => {
  const s = useSpring(6);
  return (
    <AbsoluteFill>
      <WoodTable seed={7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `rotate(-3deg) scale(${0.9 + 0.1 * s})`,
            opacity: s,
            background: "linear-gradient(#f3e6c4, #e2cf9e)",
            border: "6px solid #3b2a1e",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            width: 1000,
            padding: "40px 60px",
            fontFamily: FONT,
            color: "#2a1a0e",
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: 10, textAlign: "center" }}>長井兵助</div>
          <svg width="880" height="260" viewBox="0 0 880 260">
            <g transform="translate(40 120) rotate(-8)">
              <rect x="0" y="-8" width="420" height="16" fill="#c9ccd4" stroke="#3a3c42" strokeWidth="3" />
              <rect x="-70" y="-12" width="70" height="24" fill="#2a1a10" />
            </g>
            <g transform="translate(600 140)">
              <path d="M -130 -20 Q 0 -150 130 -20 L 100 10 Q 0 -100 -100 10 Z" fill="#c9905a" stroke="#3b2a1e" strokeWidth="5" />
              {Array.from({ length: 8 }, (_, i) => {
                const a = Math.PI * (0.15 + (i / 7) * 0.7);
                return <rect key={i} x={Math.cos(a) * -100 - 12} y={-Math.sin(a) * 100 - 40} width="24" height="30" rx="6" fill="#fbf7ee" stroke="#3b2a1e" strokeWidth="3" />;
              })}
            </g>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-around", fontSize: 44, fontWeight: 700 }}>
            <span>居合抜き</span>
            <span style={{ color: "#b3261e" }}>入れ歯・歯の療治</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Japanese room scene (doctor / daily life) ----------
export const JapaneseRoom: React.FC<{ duration: number; children: React.ReactNode; morning?: boolean }> = ({ duration, children, morning }) => (
  <AbsoluteFill>
    <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.1, x: 0, y: 20 }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <rect width="1920" height="1080" fill={morning ? "#e9dcc0" : "#d9c9a6"} />
        <rect x="1180" y="120" width="620" height="560" fill={morning ? "#fff6dc" : "#f2ead6"} />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`v${i}`} x1={1180 + i * 124} x2={1180 + i * 124} y1="120" y2="680" stroke="#6a4a2a" strokeWidth="8" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="1180" x2="1800" y1={120 + i * 112} y2={120 + i * 112} stroke="#6a4a2a" strokeWidth="6" />
        ))}
        <rect x="0" y="90" width="1920" height="30" fill="#5a3a22" />
        <rect x="1120" y="0" width="40" height="700" fill="#5a3a22" />
        <path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#b7b07a" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={i * 640 - 200} y1="700" x2={i * 760 - 600} y2="1080" stroke="#6e6a40" strokeWidth="8" />
        ))}
        <line x1="0" y1="880" x2="1920" y2="880" stroke="#6e6a40" strokeWidth="8" />
        {morning ? <path d="M 1180 680 L 900 1080 L 1700 1080 L 1800 680 Z" fill="#fff2c4" opacity="0.35" /> : null}
        {children}
      </svg>
    </Camera>
  </AbsoluteFill>
);

export const DoctorScene: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => (
  <AbsoluteFill>
    <JapaneseRoom duration={duration}>
      <Figure x={760} y={880} s={1.5} robe="#7a8a6a" hair="topknot" mouth="open" />
      <Figure x={1100} y={880} s={1.55} robe="#1f1f28" hair="none" mouth="flat" arm="forward" />
      <g transform="translate(1300 800)">
        <rect x="0" y="0" width="260" height="70" fill="#6a3a22" stroke="#2a1a10" strokeWidth="5" />
        <rect x="20" y="-30" width="60" height="30" fill="#e9dcc0" />
        <rect x="100" y="-24" width="40" height="24" fill="#c9a24a" />
        <rect x="160" y="-36" width="70" height="36" fill="#a8743f" />
      </g>
    </JapaneseRoom>
    <DiamondLabel x={420} y={200} at={labelAt} text="口中医" sub="こうちゅうい" icon={<BoxIcon />} />
  </AbsoluteFill>
);

// ---------- Fusayoji and tooth powder ----------
export const Fusayoji: React.FC<{ duration: number; powderAt: number; yearAt: number }> = ({ duration, powderAt, yearAt }) => {
  const powder = useSpring(powderAt);
  const r = seeded(51);
  const fray = Array.from({ length: 26 }, () => ({ a: r() * 50 - 25, l: 40 + r() * 30 }));
  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.15, x: -40, y: 10 }}>
        <WoodTable seed={27} />
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${520 + k * 40} ${420 + k * 120}) rotate(${-12 + k * 6})`}>
              <rect x="0" y="-12" width="520" height="24" rx="10" fill="#d9c08a" stroke="#7a5a2a" strokeWidth="4" />
              {fray.map((t, i) => (
                <line key={i} x1="518" y1={-10 + (i % 6) * 4} x2={518 + Math.cos((t.a * Math.PI) / 180) * t.l} y2={-10 + (i % 6) * 4 + Math.sin((t.a * Math.PI) / 180) * t.l} stroke="#e8d6a6" strokeWidth="4" strokeLinecap="round" />
              ))}
            </g>
          ))}
          <g transform={`translate(1360 600) scale(${powder})`}>
            <path d="M -160 -180 L 160 -180 L 180 160 L -180 160 Z" fill="#f2e6c6" stroke="#5a3a22" strokeWidth="6" />
            <rect x="-60" y="-150" width="120" height="250" fill="#b3261e" />
            {"大明香薬".split("").map((c, i) => (
              <text key={c} x="0" y={-100 + i * 58} fontFamily={FONT} fontWeight={700} fontSize="50" fill="#f6ecd2" textAnchor="middle">
                {c}
              </text>
            ))}
            <ellipse cx="-260" cy="140" rx="90" ry="26" fill="#efe6d2" />
          </g>
        </svg>
        <DiamondLabel x={420} y={230} at={20} text="房楊枝" sub="ふさようじ" icon={<LeafIcon color="#d9c08a" />} />
        <DiamondLabel x={1400} y={230} at={yearAt} text="1643年ごろ" side="left" sub="丁字屋" icon={<ScrollIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Ohaguro ----------
export const Ohaguro: React.FC<{ duration: number; potAt: number; labelAt: number }> = ({ duration, potAt, labelAt }) => {
  const pot = useSpring(potAt);
  return (
    <AbsoluteFill>
      <JapaneseRoom duration={duration}>
        <Figure x={820} y={900} s={2.1} robe="#7a3b5a" hair="woman" mouth="black" />
        <g transform={`translate(1380 800) scale(${pot})`}>
          <path d="M -80 -100 Q -110 40 -60 80 L 60 80 Q 110 40 80 -100 Z" fill="#3a2a22" stroke="#1a1410" strokeWidth="6" />
          <ellipse cx="0" cy="-100" rx="80" ry="22" fill="#141010" />
          <line x1="40" y1="-110" x2="140" y2="-260" stroke="#c9a24a" strokeWidth="10" />
          <path d="M 130 -250 l 26 -30" stroke="#2a2a2a" strokeWidth="16" strokeLinecap="round" />
        </g>
      </JapaneseRoom>
      <DiamondLabel x={420} y={200} at={labelAt} text="お歯黒" sub="おはぐろ" icon={<ToothIcon size={54} color="#2a2020" />} />
    </AbsoluteFill>
  );
};

// ---------- Wooden denture ----------
export const Denture: React.FC<{ duration: number; labelAt: number; craft?: boolean }> = ({ duration, labelAt, craft }) => {
  const f = useCurrentFrame();
  const chip = craft ? Math.abs(Math.sin(f * 0.3)) : 0;
  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.2, x: 0, y: 20 }}>
        <WoodTable seed={38} />
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <rect x="560" y="330" width="800" height="520" rx="30" fill="#4a2a52" opacity="0.9" />
          <g transform="translate(960 640)">
            <path d="M -300 60 Q -320 -260 0 -280 Q 320 -260 300 60 L 220 80 Q 230 -170 0 -180 Q -230 -170 -220 80 Z" fill="#c9905a" stroke="#5a3a1a" strokeWidth="8" />
            <path d="M -200 0 Q -200 -130 0 -140 Q 200 -130 200 0" fill="#b9804a" />
            {Array.from({ length: 12 }, (_, i) => {
              const a = Math.PI * (0.08 + (i / 11) * 0.84);
              const x = -Math.cos(a) * 262;
              const y = -Math.sin(a) * 232 + 40;
              return <rect key={i} x={x - 20} y={y - 22} width="40" height="44" rx="10" fill={craft && i % 3 === 0 ? "#efe9dc" : "#e9d2a8"} stroke="#5a3a1a" strokeWidth="4" transform={`rotate(${(a * 180) / Math.PI - 90} ${x} ${y})`} />;
            })}
          </g>
          {craft ? (
            <g transform={`translate(1480 360) rotate(${-30 + chip * 10})`}>
              <rect x="-10" y="0" width="20" height="200" fill="#8a6a3a" />
              <path d="M -14 200 L 14 200 L 0 260 Z" fill="#b8bcc4" />
            </g>
          ) : null}
        </svg>
        {craft ? (
          <DiamondLabel x={420} y={200} at={labelAt} text="入れ歯師" sub="いればし" icon={<ToothIcon size={54} />} />
        ) : (
          <DiamondLabel x={420} y={200} at={labelAt} text="木の総入れ歯" sub="1538年没の仏姫" icon={<ToothIcon size={54} />} />
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Laughing gas show (Wells, 1844) ----------
export const GasShow: React.FC<{ duration: number; labelAt: number; extract?: boolean }> = ({ duration, labelAt, extract }) => {
  const f = useCurrentFrame();
  const laugh = Math.abs(Math.sin(f * 0.35));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #6a2a2a, #1a0a0a)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.12, x: 0, y: 30 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <path d="M 0 0 L 400 0 Q 300 400 360 900 L 0 900 Z" fill="#8a1e22" />
          <path d="M 1920 0 L 1520 0 Q 1620 400 1560 900 L 1920 900 Z" fill="#8a1e22" />
          <rect x="0" y="820" width="1920" height="260" fill="#5a3a22" />
          <ellipse cx="960" cy="200" rx="500" ry="120" fill="#ffe8b0" opacity="0.12" />
          {extract ? (
            <>
              <rect x="760" y="560" width="260" height="40" fill="#3a2a22" />
              <rect x="780" y="380" width="40" height="440" fill="#3a2a22" />
              <Figure x={880} y={820} s={1.5} robe="#2a3a5a" hair="short" mouth="open" />
              <Figure x={1180} y={830} s={1.5} robe="#1f1f28" hair="short" hairColor="#5a3a22" arm="forward" />
            </>
          ) : (
            <>
              <Figure x={820} y={830} s={1.5} robe="#3a4a2a" hair="short" mouth={laugh > 0.5 ? "open" : "smile"} arm="up" />
              <g transform={`translate(1160 520)`}>
                <ellipse cx="0" cy="0" rx="90" ry="120" fill="#cfd8e8" opacity="0.8" stroke="#4a5a6a" strokeWidth="5" />
                <path d="M 0 120 Q -60 200 -230 230" stroke="#4a5a6a" strokeWidth="12" fill="none" />
                <text x="0" y="14" fontFamily="serif" fontSize="40" textAnchor="middle" fill="#2a3a4a">
                  N₂O
                </text>
              </g>
              {[0, 1, 2].map((i) => (
                <text key={i} x={940 + i * 50} y={420 - i * 40 - laugh * 20} fontFamily={FONT} fontWeight={700} fontSize="56" fill="#ffe8b0" opacity={laugh}>
                  ハ
                </text>
              ))}
            </>
          )}
        </svg>
        <DiamondLabel x={420} y={200} at={labelAt} text={extract ? "自分の歯で実験" : "ホレス・ウェルズ"} sub={extract ? "" : "1844年"} icon={<ToothIcon size={54} />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Ether dome public operation (1846) ----------
export const EtherDome: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => {
  const r = seeded(61);
  const crowd = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 14 - row }, (_, i) => ({ x: 260 + row * 70 + i * 100 + r() * 20, y: 300 + row * 70 })),
  ).flat();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#d8cdb4, #a8957a)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.15, x: 0, y: 60 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <path d="M 160 0 Q 960 -200 1760 0 L 1760 200 L 160 200 Z" fill="#efe6d2" />
          {[0, 1, 2, 3, 4].map((row) => (
            <path key={row} d={`M ${200 + row * 70} ${330 + row * 70} Q 960 ${250 + row * 70} ${1720 - row * 70} ${330 + row * 70}`} stroke="#7a5a3a" strokeWidth="16" fill="none" />
          ))}
          {crowd.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y - 30} r="20" fill="#2a2a2a" />
              <path d={`M ${c.x - 26} ${c.y + 20} Q ${c.x} ${c.y - 20} ${c.x + 26} ${c.y + 20} Z`} fill="#2a2a2a" />
            </g>
          ))}
          <rect x="0" y="780" width="1920" height="300" fill="#7a6248" />
          <rect x="760" y="700" width="420" height="50" rx="10" fill="#5a3a22" />
          <rect x="800" y="740" width="30" height="120" fill="#3a2a1a" />
          <rect x="1110" y="740" width="30" height="120" fill="#3a2a1a" />
          <ellipse cx="900" cy="690" rx="50" ry="34" fill="#e6bd96" />
          <path d="M 940 690 L 1180 700 L 1180 720 L 940 720 Z" fill="#f2ead8" />
          {/* ether inhaler */}
          <g transform="translate(780 620)">
            <circle cx="0" cy="0" r="46" fill="#cfe0ea" opacity="0.8" stroke="#4a5a6a" strokeWidth="5" />
            <path d="M 40 20 L 100 60" stroke="#4a5a6a" strokeWidth="10" />
          </g>
          <Figure x={700} y={880} s={1.2} robe="#1f1f28" hair="short" />
          <Figure x={1260} y={880} s={1.2} robe="#1f1f28" hair="short" hairColor="#5a5a5a" />
        </svg>
        <DiamondLabel x={420} y={140} at={labelAt} text="1846年10月16日" sub="エーテル麻酔" icon={<ScrollIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Meiji Western-style dentist ----------
export const MeijiDentist: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => (
  <AbsoluteFill style={{ background: "linear-gradient(#e9e2d0, #c9bfa8)" }}>
    <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.12, x: -30, y: 20 }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <rect x="0" y="0" width="1920" height="760" fill="#e2d6bc" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={i * 300} x2={i * 300} y1="0" y2="760" stroke="#cdbf9e" strokeWidth="6" />
        ))}
        <rect x="1320" y="140" width="380" height="440" fill="#bcd4e4" stroke="#6a5a3a" strokeWidth="16" />
        <line x1="1510" x2="1510" y1="140" y2="580" stroke="#6a5a3a" strokeWidth="10" />
        <line x1="1320" x2="1700" y1="360" y2="360" stroke="#6a5a3a" strokeWidth="10" />
        <rect x="0" y="760" width="1920" height="320" fill="#7a5a3a" />
        {/* dental chair */}
        <g transform="translate(820 520)">
          <rect x="-40" y="0" width="80" height="300" rx="20" fill="#7a1e22" transform="rotate(-18)" />
          <rect x="0" y="230" width="260" height="70" rx="20" fill="#7a1e22" />
          <rect x="110" y="300" width="40" height="160" fill="#3a3a3a" />
          <rect x="40" y="450" width="180" height="30" fill="#3a3a3a" />
        </g>
        <Figure x={900} y={860} s={1.35} robe="#5a6a7a" hair="topknot" mouth="open" />
        <Figure x={1220} y={880} s={1.5} robe="#1f1f28" hair="short" mouth="flat" arm="forward" />
        <path d="M 1185 492 q 35 18 70 0" stroke="#2a1a10" strokeWidth="8" fill="none" />
      </svg>
      <DiamondLabel x={420} y={200} at={labelAt} text="小幡英之助" sub="日本初の歯科医師免許" icon={<ToothIcon size={54} />} />
    </Camera>
  </AbsoluteFill>
);

// ---------- Simple map pin card (Japan, Wakayama / America) ----------
export const MorningRoom: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill>
    <JapaneseRoom duration={duration} morning>
      <Figure x={960} y={900} s={1.8} robe="#8fa9bf" hair="topknot" mouth="smile" arm="up" />
      <circle cx="1490" cy="300" r="90" fill="#ffd98a" opacity="0.7" />
    </JapaneseRoom>
  </AbsoluteFill>
);
