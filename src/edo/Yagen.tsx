import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera, DiamondLabel, LeafIcon, RootIcon, WoodTable, seeded } from "./common";

export const YagenScene: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => {
  const f = useCurrentFrame();
  const swing = Math.sin(f * 0.16);
  const wx = 960 + swing * 150;
  const rot = (swing * 150) / 1.2; // wheel radius 120 → degrees roughly follows travel
  const r = seeded(21);
  const roots = Array.from({ length: 14 }, () => ({ x: 300 + r() * 260, y: 640 + r() * 140, a: r() * 180, l: 70 + r() * 70 }));
  const slices = Array.from({ length: 22 }, () => ({ x: 1420 + r() * 260, y: 640 + r() * 150, rr: 16 + r() * 12 }));
  const leaves = Array.from({ length: 12 }, () => ({ x: 1380 + r() * 300, y: 330 + r() * 120, a: r() * 360 }));
  const dust = Array.from({ length: 26 }, (_, i) => {
    const life = (f * 1.3 + i * 9) % 40;
    const rr = seeded(100 + i);
    const ang = rr() * Math.PI * 2;
    return { x: wx + Math.cos(ang) * life * 3, y: 640 - life * 2.2 + Math.sin(ang) * 10, o: 1 - life / 40 };
  });

  return (
    <AbsoluteFill>
      <Camera duration={duration} from={{ scale: 1.08, x: 0, y: 30 }} to={{ scale: 1.22, x: 0, y: -10 }}>
        <WoodTable seed={5} />
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="iron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#56585e" />
              <stop offset="1" stopColor="#24252a" />
            </linearGradient>
            <radialGradient id="wheel">
              <stop offset="0" stopColor="#6a6c72" />
              <stop offset="1" stopColor="#2c2d32" />
            </radialGradient>
          </defs>
          {/* shadow */}
          <ellipse cx="960" cy="780" rx="520" ry="60" fill="#000" opacity="0.3" />
          {/* yagen trough */}
          <path d="M 420 640 Q 960 820 1500 640 L 1460 740 Q 960 860 460 740 Z" fill="url(#iron)" />
          <path d="M 420 640 Q 960 720 1500 640 Q 960 690 420 640 Z" fill="#1a1b1f" />
          <rect x="520" y="740" width="60" height="70" fill="#2a2b30" />
          <rect x="1340" y="740" width="60" height="70" fill="#2a2b30" />
          {/* powder in trough */}
          <path d="M 640 668 Q 960 712 1280 668 Q 960 690 640 668 Z" fill="#b89a5e" opacity="0.9" />
          {/* wheel */}
          <g transform={`translate(${wx}, 560)`}>
            <line x1="-230" y1="0" x2="230" y2="0" stroke="#5a3a20" strokeWidth="22" strokeLinecap="round" />
            <circle r="125" fill="url(#wheel)" stroke="#18191c" strokeWidth="6" />
            <g transform={`rotate(${rot})`}>
              {[0, 60, 120].map((a) => (
                <line key={a} x1="0" y1="0" x2="0" y2="-110" stroke="#45474d" strokeWidth="6" transform={`rotate(${a})`} />
              ))}
              {[0, 60, 120].map((a) => (
                <line key={`b${a}`} x1="0" y1="0" x2="0" y2="110" stroke="#45474d" strokeWidth="6" transform={`rotate(${a})`} />
              ))}
            </g>
            <circle r="26" fill="#7a4c2b" stroke="#3a2212" strokeWidth="5" />
            {/* hands on handle */}
            <ellipse cx="-215" cy="0" rx="34" ry="26" fill="#e2b48b" stroke="#9a6b48" strokeWidth="3" />
            <ellipse cx="215" cy="0" rx="34" ry="26" fill="#e2b48b" stroke="#9a6b48" strokeWidth="3" />
            <path d="M -240 -10 L -330 -120" stroke="#2c3e6b" strokeWidth="56" strokeLinecap="round" />
            <path d="M 240 -10 L 330 -120" stroke="#2c3e6b" strokeWidth="56" strokeLinecap="round" />
          </g>
          {dust.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="4" fill="#d8c08a" opacity={d.o * 0.7} />
          ))}
          {/* kakkon roots (left) */}
          <ellipse cx="430" cy="720" rx="200" ry="90" fill="#000" opacity="0.15" />
          {roots.map((t, i) => (
            <rect key={i} x={t.x} y={t.y} width={t.l} height="22" rx="11" fill={i % 2 ? "#8a5a33" : "#a06d40"} stroke="#4a2c14" strokeWidth="3" transform={`rotate(${t.a} ${t.x + t.l / 2} ${t.y + 11})`} />
          ))}
          {/* kanzo slices (right) */}
          <ellipse cx="1550" cy="720" rx="200" ry="90" fill="#000" opacity="0.15" />
          {slices.map((s, i) => (
            <g key={i}>
              <ellipse cx={s.x} cy={s.y} rx={s.rr} ry={s.rr * 0.8} fill="#e0b64e" stroke="#8a6420" strokeWidth="3" />
              <ellipse cx={s.x} cy={s.y} rx={s.rr * 0.4} ry={s.rr * 0.3} fill="#c4952f" />
            </g>
          ))}
          {/* dried leaves (top right) */}
          {leaves.map((l, i) => (
            <path key={i} d="M 0 30 C -18 18 -18 -12 0 -30 C 18 -12 18 18 0 30 Z" fill={i % 3 ? "#6d8a45" : "#58733a"} stroke="#2f3f1d" strokeWidth="2.5" transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(1.4)`} />
          ))}
          {/* paper packets (top left) */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${330 + i * 150} ${340 + (i % 2) * 40}) rotate(${-10 + i * 12})`}>
              <path d="M -60 -45 L 60 -45 L 60 45 L -60 45 Z" fill="#f4ecd8" stroke="#a89470" strokeWidth="3" />
              <path d="M -60 -45 L 0 10 L 60 -45" fill="none" stroke="#a89470" strokeWidth="3" />
            </g>
          ))}
        </svg>
        <DiamondLabel x={470} y={560} at={labelAt} text="葛根" sub="かっこん" icon={<RootIcon />} />
        <DiamondLabel x={1570} y={560} at={labelAt + 14} text="甘草" sub="かんぞう" icon={<LeafIcon color="#e0b64e" />} side="left" />
      </Camera>
    </AbsoluteFill>
  );
};
