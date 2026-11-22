import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export const FONT = '"Noto Serif JP", serif';

// Deterministic pseudo-random so every render frame matches.
export const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const ease = Easing.inOut(Easing.cubic);

// Slow camera move over a scene (Ken Burns style).
export const Camera: React.FC<{
  duration: number;
  from: { scale: number; x: number; y: number };
  to: { scale: number; x: number; y: number };
  children: React.ReactNode;
}> = ({ duration, from, to, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const s = from.scale + (to.scale - from.scale) * p;
  const x = from.x + (to.x - from.x) * p;
  const y = from.y + (to.y - from.y) * p;
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "50% 50%" }}>
      {children}
    </AbsoluteFill>
  );
};

// Fade a scene in over its first frames (crossfade with the scene beneath).
export const FadeIn: React.FC<{ frames?: number; children: React.ReactNode }> = ({ frames = 15, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, frames], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// Paper grain + vignette laid over every frame for a printed, hand-made feel.
export const PaperOverlay: React.FC = () => (
  <>
    <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.55 }}>
      <Img src={staticFile("edo/paper.png")} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
    <AbsoluteFill
      style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(30,15,5,0.42) 100%)" }}
    />
  </>
);

// Diamond icon + ribbon label (pops in).
export const DiamondLabel: React.FC<{
  x: number;
  y: number;
  at: number;
  text: string;
  sub?: string;
  icon: React.ReactNode;
  side?: "right" | "left";
}> = ({ x, y, at, text, sub, icon, side = "right" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 120 } });
  const w = interpolate(f - at, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  if (f < at) return null;
  const ribbonW = 110 + text.length * 44 + (sub ? sub.length * 25 + 14 : 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>
      <div
        style={{
          position: "absolute",
          top: -30,
          [side === "right" ? "left" : "right"]: side === "right" ? 30 : 126,
          height: 60,
          width: ribbonW * w,
          overflow: "hidden",
          background: "linear-gradient(#3b2a1e, #2a1c12)",
          border: "2px solid #c9a86a",
          display: "flex",
          alignItems: "center",
          justifyContent: side === "right" ? "flex-start" : "flex-end",
          padding: side === "right" ? "0 0 0 84px" : "0 84px 0 0",
          boxSizing: "border-box",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: "#f3e7c9", letterSpacing: 4 }}>{text}</span>
        {sub ? (
          <span style={{ fontFamily: FONT, fontSize: 24, color: "#d8c49a", marginLeft: 12 }}>{sub}</span>
        ) : null}
      </div>
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          transform: `translate(-50%,-50%) scale(${s}) rotate(45deg)`,
          background: "#f6efdf",
          border: "4px solid #3b2a1e",
          boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: "rotate(-45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Bottom subtitle.
export const Subtitle: React.FC<{ text: string; from: number; to: number }> = ({ text, from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const o = interpolate(f, [from, from + 6, to - 6, to], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70, opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(10,6,2,0.55) 0%, rgba(10,6,2,0.25) 18%, rgba(0,0,0,0) 30%)" }} />
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50,
          position: "relative",
          color: "#fffaf0",
          textAlign: "center",
          lineHeight: 1.45,
          whiteSpace: "pre-line",
          textShadow: "0 0 8px rgba(0,0,0,0.9), 0 3px 3px rgba(0,0,0,0.8), 0 0 2px #000",
          letterSpacing: 2,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Wood tabletop used by the yagen and scroll scenes.
export const WoodTable: React.FC<{ seed?: number }> = ({ seed = 3 }) => {
  const r = seeded(seed);
  const lines = Array.from({ length: 70 }, (_, i) => {
    const y = (i / 70) * 1080 + r() * 12;
    const amp = 4 + r() * 10;
    const ph = r() * 6;
    let d = `M -20 ${y}`;
    for (let x = 0; x <= 1960; x += 80) d += ` L ${x} ${y + Math.sin(x / 260 + ph) * amp}`;
    return { d, o: 0.08 + r() * 0.18, w: 1 + r() * 3 };
  });
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a34" />
          <stop offset="0.5" stopColor="#7a4c2b" />
          <stop offset="1" stopColor="#5e3920" />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#wood)" />
      {lines.map((l, i) => (
        <path key={i} d={l.d} stroke="#3a2212" strokeWidth={l.w} fill="none" opacity={l.o} />
      ))}
      {[200, 470, 760, 1010].map((y) => (
        <line key={y} x1="0" x2="1920" y1={y} y2={y} stroke="#2e1a0d" strokeWidth="3" opacity="0.35" />
      ))}
    </svg>
  );
};

// Small medicine-box icon used in labels.
export const BoxIcon: React.FC<{ size?: number }> = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <rect x="8" y="10" width="44" height="42" rx="3" fill="#a8743f" stroke="#3b2a1e" strokeWidth="3" />
    <line x1="8" y1="24" x2="52" y2="24" stroke="#3b2a1e" strokeWidth="2.5" />
    <line x1="8" y1="38" x2="52" y2="38" stroke="#3b2a1e" strokeWidth="2.5" />
    <circle cx="30" cy="17" r="2.5" fill="#3b2a1e" />
    <circle cx="30" cy="31" r="2.5" fill="#3b2a1e" />
    <circle cx="30" cy="45" r="2.5" fill="#3b2a1e" />
  </svg>
);

export const LeafIcon: React.FC<{ color?: string }> = ({ color = "#4f7a3a" }) => (
  <svg width="54" height="54" viewBox="0 0 60 60">
    <path d="M30 52 C 10 40, 10 18, 30 6 C 50 18, 50 40, 30 52 Z" fill={color} stroke="#2c3b1d" strokeWidth="3" />
    <path d="M30 50 L30 12" stroke="#2c3b1d" strokeWidth="2.5" />
  </svg>
);

export const RootIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 60 60">
    <path d="M18 10 C 26 22, 22 38, 30 52 M30 10 C 32 26, 38 36, 42 50 M24 30 L14 40 M34 32 L46 30" stroke="#6b4423" strokeWidth="5" strokeLinecap="round" fill="none" />
  </svg>
);

export const ScrollIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 60 60">
    <rect x="12" y="12" width="36" height="36" fill="#efe2c2" stroke="#3b2a1e" strokeWidth="3" />
    <rect x="6" y="9" width="6" height="42" rx="3" fill="#7a4c2b" />
    <rect x="48" y="9" width="6" height="42" rx="3" fill="#7a4c2b" />
    <line x1="22" y1="18" x2="22" y2="42" stroke="#3b2a1e" strokeWidth="2" />
    <line x1="30" y1="18" x2="30" y2="42" stroke="#3b2a1e" strokeWidth="2" />
    <line x1="38" y1="18" x2="38" y2="36" stroke="#3b2a1e" strokeWidth="2" />
  </svg>
);
