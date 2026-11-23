import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, DiamondLabel, FONT, WoodTable } from "../edo/common";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Night room with a person who has toothache ----------
const Person: React.FC<{ pose: "pain" | "pray"; f: number }> = ({ pose, f }) => {
  const sway = Math.sin(f * 0.08) * 3;
  const wince = pose === "pain" ? Math.max(0, Math.sin(f * 0.25)) * 4 : 0;
  return (
    <g transform={`translate(${sway} 0)`}>
      {/* body (sleeping yukata) */}
      <path d="M 880 530 Q 960 500 1040 530 L 1080 760 Q 960 790 840 760 Z" fill="#8fa9bf" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${870 + i * 50} ${560 + (i % 2) * 40} l 18 18 l -18 18 l -18 -18 z`} fill="#6f8aa3" opacity="0.6" />
      ))}
      <path d="M 920 525 L 960 600 L 1000 525" fill="none" stroke="#f2ead8" strokeWidth="10" />
      {/* head */}
      <g transform={`translate(0 ${wince})`}>
        <circle cx="960" cy="450" r="64" fill="#e6bd96" />
        <path d="M 896 440 Q 900 375 960 372 Q 1020 375 1024 440 Q 1000 405 960 404 Q 920 405 896 440 Z" fill="#2b2420" />
        <rect x="948" y="352" width="24" height="30" rx="8" fill="#2b2420" />
        {/* face */}
        <path d="M 926 452 q 10 -7 20 0" stroke="#3a2a20" strokeWidth="4" fill="none" />
        <path d="M 974 452 q 10 -7 20 0" stroke="#3a2a20" strokeWidth="4" fill="none" />
        {pose === "pain" ? (
          <>
            <path d="M 922 432 l 22 8 M 998 432 l -22 8" stroke="#3a2a20" strokeWidth="4" />
            <path d="M 940 490 q 7 -6 14 0 q 7 6 14 0 q 7 -6 14 0" stroke="#7a3a2a" strokeWidth="4" fill="none" />
            <ellipse cx="1012" cy="478" rx="14" ry="9" fill="#e27a6a" opacity="0.7" />
          </>
        ) : (
          <path d="M 946 490 q 14 6 28 0" stroke="#7a3a2a" strokeWidth="4" fill="none" />
        )}
      </g>
      {/* arms */}
      {pose === "pain" ? (
        <>
          <path d="M 1030 545 Q 1080 520 1040 480" stroke="#8fa9bf" strokeWidth="44" strokeLinecap="round" fill="none" />
          <ellipse cx="1030" cy="470" rx="26" ry="32" fill="#e6bd96" />
          <path d="M 892 545 Q 860 640 930 680" stroke="#8fa9bf" strokeWidth="42" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M 892 545 Q 880 600 950 600" stroke="#8fa9bf" strokeWidth="42" strokeLinecap="round" fill="none" />
          <path d="M 1028 545 Q 1040 600 970 600" stroke="#8fa9bf" strokeWidth="42" strokeLinecap="round" fill="none" />
          <path d="M 948 610 L 960 548 L 972 610 Z" fill="#e6bd96" />
        </>
      )}
    </g>
  );
};

export const NightRoom: React.FC<{ duration: number; pose?: "pain" | "pray"; zoom?: boolean }> = ({ duration, pose = "pain", zoom = true }) => {
  const f = useCurrentFrame();
  const flick = 0.85 + 0.15 * Math.sin(f * 0.6) * Math.sin(f * 0.17 + 2);
  const pulse = (f % 24) / 24;
  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={zoom ? { scale: 1.25, x: 0, y: 70 } : { scale: 1.05, x: 0, y: 0 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <linearGradient id="nwall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1c2140" />
              <stop offset="1" stopColor="#2b2a44" />
            </linearGradient>
            <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.75" />
              <stop offset="1" stopColor="#ff9a3a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="moon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#b9c8e8" stopOpacity="0.45" />
              <stop offset="1" stopColor="#8fa3d0" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#nwall)" />
          {/* shoji with moonlight */}
          <g>
            <rect x="1320" y="120" width="520" height="560" fill="url(#moon)" />
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`v${i}`} x1={1320 + i * 130} x2={1320 + i * 130} y1="120" y2="680" stroke="#3a3350" strokeWidth="10" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`h${i}`} x1="1320" x2="1840" y1={120 + i * 112} y2={120 + i * 112} stroke="#3a3350" strokeWidth="8" />
            ))}
            <path d="M 1500 260 q 40 -50 90 -20 q -30 10 -40 40 z" fill="#2c2a40" opacity="0.6" />
          </g>
          {/* pillar & beam */}
          <rect x="1260" y="0" width="40" height="760" fill="#2a1e16" />
          <rect x="0" y="90" width="1920" height="30" fill="#2a1e16" />
          {/* tatami floor */}
          <path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#6f7a4a" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={i * 640 - 200} y1="700" x2={i * 760 - 600} y2="1080" stroke="#3e4428" strokeWidth="8" />
          ))}
          <line x1="0" y1="880" x2="1920" y2="880" stroke="#3e4428" strokeWidth="8" />
          {/* lamp glow */}
          <circle cx="420" cy="560" r={520 * flick} fill="url(#lamp)" />
          {/* andon lamp */}
          <g>
            <rect x="360" y="460" width="120" height="200" fill="#f6d9a0" opacity={0.85 + 0.15 * flick} />
            <rect x="360" y="460" width="120" height="200" fill="none" stroke="#2a1e16" strokeWidth="8" />
            <line x1="420" y1="460" x2="420" y2="660" stroke="#2a1e16" strokeWidth="5" />
            <rect x="350" y="660" width="140" height="22" fill="#2a1e16" />
            <rect x="368" y="682" width="12" height="40" fill="#2a1e16" />
            <rect x="460" y="682" width="12" height="40" fill="#2a1e16" />
          </g>
          {/* futon */}
          <rect x="600" y="700" width="760" height="230" rx="30" fill="#e9e2d0" />
          <rect x="600" y="740" width="760" height="190" rx="30" fill="#33507e" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={680 + i * 150} cy={840} r="22" fill="none" stroke="#d9cfb4" strokeWidth="4" opacity="0.6" />
          ))}
          <Person pose={pose} f={f} />
          {/* pain pulses */}
          {pose === "pain" ? (
            <g opacity={1 - pulse} transform={`translate(1060 440) scale(${0.8 + pulse * 0.6})`}>
              {[-30, 0, 30].map((a) => (
                <path key={a} d="M 20 0 l 22 -10 l -6 14 l 26 -8" stroke="#ff5a3c" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${a})`} />
              ))}
            </g>
          ) : null}
        </svg>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- "Today" card that gets crossed out ----------
const PillIcon = () => (
  <svg width="90" height="90" viewBox="0 0 90 90">
    <rect x="12" y="30" width="66" height="30" rx="15" fill="#f4f1ea" stroke="#3b2a1e" strokeWidth="4" />
    <path d="M 45 30 L 45 60" stroke="#3b2a1e" strokeWidth="4" />
    <path d="M 12 45 a 15 15 0 0 1 33 -15 L 45 60 a 15 15 0 0 1 -33 -15" fill="#e46a5a" />
  </svg>
);
export const ToothIcon: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = "#fbf7ee" }) => (
  <svg width={size} height={size} viewBox="0 0 90 90">
    <path d="M 18 30 C 18 12 34 10 45 20 C 56 10 72 12 72 30 C 72 46 66 52 64 62 L 60 80 C 58 86 52 84 51 78 L 48 62 C 47 58 43 58 42 62 L 39 78 C 38 84 32 86 30 80 L 26 62 C 24 52 18 46 18 30 Z" fill={color} stroke="#3b2a1e" strokeWidth="4" />
  </svg>
);

export const TodayCard: React.FC<{ at: number; crossAt: number }> = ({ at, crossAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 16 } });
  const x = interpolate(f, [crossAt, crossAt + 10], [0, 1], clamp);
  const stamp = spring({ frame: f - crossAt - 10, fps, config: { damping: 8 } });
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 150,
        width: 560,
        transform: `translateX(${(1 - s) * -700}px) rotate(-2deg)`,
        background: "linear-gradient(#f6ecd2, #eadbb5)",
        border: "4px solid #3b2a1e",
        boxShadow: "0 14px 30px rgba(0,0,0,0.5)",
        padding: "28px 36px",
        fontFamily: FONT,
        color: "#2a1a0e",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 6, borderBottom: "2px solid #8b6b45", paddingBottom: 10 }}>今なら…</div>
      <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
        <div style={{ textAlign: "center", fontSize: 32, fontWeight: 700 }}>
          <PillIcon />
          <div>痛み止め</div>
        </div>
        <div style={{ textAlign: "center", fontSize: 32, fontWeight: 700 }}>
          <ToothIcon />
          <div>歯医者</div>
        </div>
      </div>
      <svg width="560" height="300" viewBox="0 0 560 300" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M 40 40 L 520 260" stroke="#c0281c" strokeWidth="16" strokeLinecap="round" strokeDasharray="560" strokeDashoffset={560 * (1 - x)} />
        <path d="M 520 40 L 40 260" stroke="#c0281c" strokeWidth="16" strokeLinecap="round" strokeDasharray="560" strokeDashoffset={560 * (1 - interpolate(f, [crossAt + 5, crossAt + 15], [0, 1], clamp))} />
      </svg>
      <div
        style={{
          position: "absolute",
          right: -40,
          bottom: -40,
          transform: `scale(${stamp}) rotate(-10deg)`,
          background: "#c0281c",
          color: "#f6ecd2",
          fontWeight: 700,
          fontSize: 36,
          padding: "10px 20px",
          border: "4px double #f6ecd2",
        }}
      >
        昔は、なかった
      </div>
    </div>
  );
};

// ---------- Three icons: worm, shrine, pliers ----------
export const WormIcon: React.FC<{ size?: number }> = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <path d="M 8 44 C 14 30 24 50 30 36 C 36 22 46 40 52 22" stroke="#c98a6a" strokeWidth="11" strokeLinecap="round" fill="none" />
    <circle cx="52" cy="20" r="3" fill="#3b2a1e" />
  </svg>
);
export const ToriiIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 60 60">
    <path d="M 6 14 Q 30 8 54 14 L 52 20 Q 30 15 8 20 Z" fill="#c0281c" />
    <rect x="12" y="26" width="36" height="5" fill="#c0281c" />
    <rect x="15" y="18" width="6" height="36" fill="#c0281c" />
    <rect x="39" y="18" width="6" height="36" fill="#c0281c" />
  </svg>
);
export const PliersIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 60 60">
    <path d="M 22 6 L 30 30 L 14 56" stroke="#4a4c52" strokeWidth="7" strokeLinecap="round" fill="none" />
    <path d="M 38 6 L 30 30 L 46 56" stroke="#4a4c52" strokeWidth="7" strokeLinecap="round" fill="none" />
    <circle cx="30" cy="30" r="5" fill="#2a2b30" />
  </svg>
);

export const IconMontage: React.FC<{ duration: number; times: [number, number, number] }> = ({ duration, times }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #f3e6c4, #d8c08e)" }}>
    <Camera duration={duration} from={{ scale: 1, x: 0, y: 0 }} to={{ scale: 1.08, x: 0, y: 0 }}>
      <DiamondLabel x={420} y={440} at={times[0]} text="虫" icon={<WormIcon />} />
      <DiamondLabel x={880} y={560} at={times[1]} text="神さま" icon={<ToriiIcon />} />
      <DiamondLabel x={1340} y={440} at={times[2]} text="怖い治療" icon={<PliersIcon />} />
    </Camera>
  </AbsoluteFill>
);

// ---------- Title and chapter cards ----------
export const TitleCard: React.FC<{ duration: number }> = ({ duration }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 6, fps, config: { damping: 15 } });
  const seal = spring({ frame: f - 30, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.06, x: 0, y: 0 }}>
        <WoodTable seed={12} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              transform: `translateY(${(1 - s) * 60}px) rotate(-1deg)`,
              opacity: s,
              background: "linear-gradient(#f6ecd2, #e8d6ac)",
              border: "6px solid #3b2a1e",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              padding: "60px 110px",
              fontFamily: FONT,
              color: "#2a1a0e",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: 10 }}>歯が痛くなったら</div>
            <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: 8, marginTop: 10 }}>昔の人はどうしていた？</div>
            <div
              style={{
                position: "absolute",
                right: -50,
                top: -50,
                width: 130,
                height: 130,
                background: "#b3261e",
                color: "#f6ecd2",
                fontSize: 86,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${seal}) rotate(8deg)`,
              }}
            >
              歯
            </div>
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

export const ChapterCard: React.FC<{ num: string; title: string; sub?: string }> = ({ num, title, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 6, fps, config: { damping: 18 } });
  const line = interpolate(f, [10, 40], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2f3a66, #141a32)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, color: "#f3e7c9", textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
        <div style={{ fontSize: 48, letterSpacing: 16, color: "#d9b56a" }}>{num}</div>
        <div style={{ width: 700 * line, height: 3, background: "#d9b56a", margin: "24px auto" }} />
        <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: 10 }}>{title}</div>
        {sub ? <div style={{ fontSize: 36, marginTop: 24, color: "#c9bfa6", letterSpacing: 6 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
