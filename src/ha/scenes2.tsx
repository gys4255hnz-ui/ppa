import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries from "world-atlas/countries-50m.json";
import { Camera, DiamondLabel, FONT, ScrollIcon, seeded } from "../edo/common";
import { ToothIcon, WormIcon } from "./scenes1";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Tooth cross-section with worms ----------
const TOOTH =
  "M 760 300 C 760 220 840 200 880 240 C 920 200 1000 200 1040 240 C 1080 200 1160 220 1160 300 C 1160 400 1130 460 1120 520 L 1100 820 C 1095 880 1050 880 1040 820 L 1000 560 C 990 540 930 540 920 560 L 880 820 C 870 880 825 880 820 820 L 800 520 C 790 460 760 400 760 300 Z";
const CROWN =
  "M 760 300 C 760 220 840 200 880 240 C 920 200 1000 200 1040 240 C 1080 200 1160 220 1160 300 C 1160 370 1145 420 1132 470 Q 960 430 788 470 C 775 420 760 370 760 300 Z";
const PULP =
  "M 890 390 Q 960 350 1030 390 L 1020 480 L 1060 800 L 1048 805 L 995 525 Q 960 510 925 525 L 872 805 L 860 800 L 900 480 Z";

const Worm: React.FC<{ x: number; y: number; ext: number; f: number; ang: number; color: string; ink?: boolean; shake?: number }> = ({
  x,
  y,
  ext,
  f,
  ang,
  color,
  ink,
  shake = 0,
}) => {
  const n = 14;
  const seg = Math.round(ext * n);
  if (seg < 1) return null;
  const pts = Array.from({ length: seg }, (_, i) => {
    const t = i / n;
    const wig = Math.sin(f * 0.25 - i * 0.7) * 14 * t;
    return [x + Math.cos(ang) * i * 16 + Math.cos(ang + Math.PI / 2) * wig, y + Math.sin(ang) * i * 16 + Math.sin(ang + Math.PI / 2) * wig];
  });
  const head = pts[pts.length - 1];
  const hs = Math.sin(f * 0.9) * 18 * shake;
  return (
    <g>
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={13 - i * 0.25} fill={ink ? "#efe0bd" : color} stroke={ink ? "#4a2c18" : "#8a4a3a"} strokeWidth={ink ? 3 : 2} />
      ))}
      <g transform={`translate(${head[0]} ${head[1]}) rotate(${(ang * 180) / Math.PI + 90 + hs})`}>
        <ellipse cx="0" cy="0" rx="16" ry="18" fill={ink ? "#efe0bd" : color} stroke={ink ? "#4a2c18" : "#8a4a3a"} strokeWidth={ink ? 3 : 2} />
        <circle cx="-6" cy="-5" r="3.5" fill="#2a1a10" />
        <circle cx="6" cy="-5" r="3.5" fill="#2a1a10" />
      </g>
    </g>
  );
};

export const ToothCross: React.FC<{
  duration: number;
  mode?: "color" | "engraving";
  worms?: "none" | "peek" | "retreat" | "many";
  question?: boolean;
  chant?: boolean;
}> = ({ duration, mode = "color", worms = "peek", question, chant }) => {
  const f = useCurrentFrame();
  const ink = mode === "engraving";
  const ext =
    worms === "peek" ? interpolate(f, [20, 70], [0, 1], clamp) : worms === "retreat" ? interpolate(f, [60, 140], [1, 0], clamp) : worms === "many" ? interpolate(f, [10, 60], [0, 1], clamp) : 0;
  const r = seeded(4);
  const hatch = Array.from({ length: 60 }, () => ({ x: 760 + r() * 400, y: 230 + r() * 600, l: 10 + r() * 20 }));
  const stroke = ink ? "#4a2c18" : "#5a3a2a";
  return (
    <AbsoluteFill style={{ background: ink ? "radial-gradient(ellipse at 50% 50%, #f2e4c0, #cdb27a)" : "radial-gradient(ellipse at 50% 40%, #3a2a3a, #120c18)" }}>
      <Camera duration={duration} from={{ scale: 0.95, x: 0, y: 20 }} to={{ scale: 1.08, x: 40, y: 40 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          {/* bone and gum */}
          <rect x="560" y="600" width="800" height="400" rx="40" fill={ink ? "none" : "#d9c39a"} stroke={ink ? stroke : "none"} strokeWidth="3" />
          <path d="M 600 610 Q 760 520 860 560 L 1060 560 Q 1160 520 1320 610 L 1320 690 L 600 690 Z" fill={ink ? "none" : "#e28f8f"} stroke={stroke} strokeWidth={ink ? 3 : 0} />
          <path d={TOOTH} fill={ink ? "#f6ecd2" : "#f1e1bf"} stroke={stroke} strokeWidth="6" />
          <path d={CROWN} fill={ink ? "none" : "#fbf7ee"} stroke={stroke} strokeWidth={ink ? 3 : 0} />
          <path d={PULP} fill={ink ? "none" : "#d6656e"} stroke={stroke} strokeWidth="4" />
          {ink
            ? hatch.map((h, i) => <line key={i} x1={h.x} y1={h.y} x2={h.x + h.l} y2={h.y + h.l * 0.6} stroke={stroke} strokeWidth="1.5" opacity="0.35" />)
            : null}
          {worms !== "none" ? (
            <>
              <path d="M 812 262 C 822 304 870 324 902 302 C 884 268 850 248 812 262 Z" fill="#4a2c1a" />
              <path d="M 862 300 L 900 392" stroke="#4a2c1a" strokeWidth="22" strokeLinecap="round" />
            </>
          ) : null}
          {worms === "many" ? (
            <>
              <path d="M 1100 330 C 1110 370 1150 380 1150 340 Z" fill="#4a2c1a" />
              <path d="M 980 240 C 990 270 1030 270 1030 240 Z" fill="#4a2c1a" />
              <Worm x={850} y={275} ext={ext} f={f} ang={-2.3} color="#e6b59c" ink={ink} />
              <Worm x={1130} y={350} ext={ext * 0.8} f={f + 13} ang={-0.5} color="#e6b59c" ink={ink} />
              <Worm x={1005} y={250} ext={ext * 0.9} f={f + 27} ang={-1.5} color="#e6b59c" ink={ink} />
            </>
          ) : worms !== "none" ? (
            <Worm x={850} y={275} ext={ext} f={f} ang={-2.3} color="#e6b59c" />
          ) : null}
          {chant
            ? Array.from({ length: 10 }, (_, i) => {
                const t = ((f + i * 14) % 140) / 140;
                const y = 200 + ((i * 97) % 600);
                return (
                  <g key={i} transform={`translate(${200 + t * 600} ${y})`} opacity={Math.sin(t * Math.PI)}>
                    <path d="M 0 0 l 24 8 l -24 8 z M 30 0 l 0 20 M 38 4 l 16 0" stroke="#ffd98a" strokeWidth="4" fill="#ffd98a" />
                  </g>
                );
              })
            : null}
          {question
            ? [
                [620, 300, 0],
                [1300, 260, 10],
                [1360, 520, 20],
              ].map(([x, y, d], i) => (
                <text key={i} x={x} y={y} fontFamily={FONT} fontWeight={700} fontSize="150" fill="#f3e7c9" opacity={interpolate(f, [d + 10, d + 25], [0, 0.85], clamp)}>
                  ？
                </text>
              ))
            : null}
        </svg>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Region map (Mesopotamia) ----------
const topo = countries as unknown as Topology<{ countries: GeometryCollection }>;
const world = feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection;

export const RegionMap: React.FC<{
  duration: number;
  box: [[number, number], [number, number]];
  highlight: string[];
  rivers?: [number, number][][];
  label: { text: string; sub?: string; lon: number; lat: number };
  places?: { name: string; lon: number; lat: number }[];
}> = ({ duration, box, highlight, rivers = [], label, places = [] }) => {
  const f = useCurrentFrame();
  const proj = geoMercator().fitExtent(
    [
      [160, 90],
      [1760, 990],
    ],
    { type: "Feature", properties: {}, geometry: { type: "MultiPoint", coordinates: box } } as GeoJSON.Feature,
  );
  const path = geoPath(proj);
  const P = (lon: number, lat: number) => proj([lon, lat]) as [number, number];
  const riverDraw = interpolate(f, [15, 60], [0, 1], clamp);
  const glow = interpolate(f, [30, 50], [0, 1], clamp);
  const lp = P(label.lon, label.lat);
  return (
    <AbsoluteFill style={{ background: "#c4d3cc" }}>
      <Camera duration={duration} from={{ scale: 0.8, x: 0, y: 0 }} to={{ scale: 1.15, x: -(lp[0] - 960) * 0.6, y: -(lp[1] - 540) * 0.6 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <pattern id="waves2" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 20 Q 15 8 30 20 T 60 20" stroke="#9fb7ae" strokeWidth="2" fill="none" />
            </pattern>
          </defs>
          <rect x="-1000" y="-1000" width="4000" height="3000" fill="url(#waves2)" opacity="0.6" />
          {world.features.map((c, i) => (
            <path
              key={i}
              d={path(c) ?? ""}
              fill={highlight.includes(String(c.id)) ? `rgba(214,170,98,${0.6 + 0.4 * glow})` : "#ddd3b5"}
              stroke="#9c8b68"
              strokeWidth="2"
            />
          ))}
          {rivers.map((r, i) => {
            const d = r.map(([lo, la], j) => `${j ? "L" : "M"} ${P(lo, la).join(" ")}`).join(" ");
            return <path key={i} d={d} stroke="#3f7fae" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="3000" strokeDashoffset={3000 * (1 - riverDraw)} />;
          })}
          {places.map((p) => {
            const [x, y] = P(p.lon, p.lat);
            return (
              <g key={p.name} opacity={glow}>
                <circle cx={x} cy={y} r="9" fill="#7a1f12" stroke="#f3e7c9" strokeWidth="3" />
                <text x={x + 16} y={y + 10} fontFamily={FONT} fontWeight={700} fontSize="32" fill="#2a1a0e" stroke="#f3ead2" strokeWidth="6" paintOrder="stroke">
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            left: lp[0],
            top: lp[1],
            transform: `translate(-50%,-50%) scale(${glow})`,
            fontFamily: FONT,
            textAlign: "center",
            color: "#2a1a0e",
            textShadow: "0 0 10px #f6ecd2, 0 0 4px #f6ecd2",
          }}
        >
          <div style={{ fontSize: 70, fontWeight: 700, letterSpacing: 8 }}>{label.text}</div>
          {label.sub ? <div style={{ fontSize: 34, fontWeight: 700 }}>{label.sub}</div> : null}
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Clay tablet ----------
export const ClayTablet: React.FC<{ duration: number; labelAt: number; glow?: boolean }> = ({ duration, labelAt, glow }) => {
  const f = useCurrentFrame();
  const r = seeded(31);
  const rows = Array.from({ length: 11 }, (_, row) =>
    Array.from({ length: 13 }, (_, col) => ({ x: 640 + col * 50 + r() * 10, y: 280 + row * 52, k: Math.floor(r() * 4), show: r() > 0.12 })),
  );
  const g = glow ? 0.5 + 0.5 * Math.sin(f * 0.15) : 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #6b5136, #241a10)" }}>
      <Camera duration={duration} from={{ scale: 0.92, x: 0, y: 0 }} to={{ scale: 1.15, x: -60, y: 20 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <linearGradient id="clay" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c99d6a" />
              <stop offset="1" stopColor="#9a7046" />
            </linearGradient>
          </defs>
          <rect x="590" y="200" width="740" height="680" rx="60" fill="#000" opacity="0.35" transform="translate(16 22)" />
          <rect x="590" y="200" width="740" height="680" rx="60" fill="url(#clay)" stroke="#6a4a2c" strokeWidth="6" />
          {rows.flat().map((c, i) =>
            c.show ? (
              <g key={i} transform={`translate(${c.x} ${c.y})`} opacity="0.8">
                {c.k === 0 ? <path d="M 0 0 l 18 6 l -18 6 z" fill="#5a3a20" /> : null}
                {c.k === 1 ? <path d="M 0 0 l 6 18 l 6 -18 z M 6 18 l 0 14" stroke="#5a3a20" strokeWidth="3" fill="#5a3a20" /> : null}
                {c.k === 2 ? <path d="M 0 0 l 18 6 l -18 6 z M 22 0 l 18 6 l -18 6 z" fill="#5a3a20" /> : null}
                {c.k === 3 ? <path d="M 0 10 l 10 -10 l 0 20 z M 10 10 l 22 0" stroke="#5a3a20" strokeWidth="3" fill="#5a3a20" /> : null}
              </g>
            ) : null,
          )}
          <path d="M 1180 200 L 1150 320 L 1190 400 L 1160 470" stroke="#5a3a20" strokeWidth="4" fill="none" opacity="0.6" />
          {glow ? <rect x="590" y="200" width="740" height="680" rx="60" fill="#ffd98a" opacity={g * 0.25} /> : null}
        </svg>
        <DiamondLabel x={360} y={220} at={labelAt} text="粘土板" sub="2500年以上前" icon={<ScrollIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- The worm myth: a god offers fruit, the worm refuses ----------
export const WormStory: React.FC<{ duration: number; offerAt: number; refuseAt: number; toothAt: number }> = ({ duration, offerAt, refuseAt, toothAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offer = spring({ frame: f - offerAt, fps, config: { damping: 14 } });
  const inset = spring({ frame: f - toothAt, fps, config: { damping: 14 } });
  const shake = f > refuseAt && f < refuseAt + 45 ? 1 : 0;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#e9c98e, #c99a5e 60%, #8a6038)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.1, x: 40, y: 10 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          {/* sun disk */}
          <circle cx="620" cy="300" r="170" fill="#ffe2a0" opacity="0.8" />
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1="620" y1="300" x2={620 + Math.cos((i / 16) * Math.PI * 2 + f * 0.004) * 260} y2={300 + Math.sin((i / 16) * Math.PI * 2 + f * 0.004) * 260} stroke="#ffe2a0" strokeWidth="10" opacity="0.5" />
          ))}
          {/* god figure */}
          <g>
            <path d="M 540 420 L 700 420 L 760 960 L 480 960 Z" fill="#7a3b2e" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={500 + i * 8} y1={560 + i * 70} x2={740 - i * 8} y2={560 + i * 70} stroke="#d9a15a" strokeWidth="6" />
            ))}
            <circle cx="620" cy="360" r="62" fill="#c98f66" />
            <path d="M 570 380 Q 620 520 670 380 Z" fill="#2a1a12" />
            <path d="M 590 340 l 20 4 M 650 340 l -20 4" stroke="#2a1a12" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="602" cy="356" rx="6" ry="5" fill="#2a1a12" />
            <ellipse cx="638" cy="356" rx="6" ry="5" fill="#2a1a12" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={585 + i * 12} y1="400" x2={590 + i * 12} y2="470" stroke="#4a3020" strokeWidth="3" />
            ))}
            <path d="M 560 320 L 580 210 L 660 210 L 680 320 Z" fill="#d9a15a" stroke="#7a4a1a" strokeWidth="4" />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M 562 ${300 - i * 30} Q 620 ${285 - i * 30} 678 ${300 - i * 30}`} stroke="#7a4a1a" strokeWidth="5" fill="none" />
            ))}
            {/* offering arm + plate */}
            <g transform={`translate(${offer * 220} ${offer * 60})`}>
              <path d="M 690 520 Q 760 560 800 580" stroke="#7a3b2e" strokeWidth="44" strokeLinecap="round" fill="none" />
              <ellipse cx="840" cy="590" rx="90" ry="22" fill="#b98a4a" stroke="#6a4a20" strokeWidth="4" />
              <circle cx="810" cy="570" r="22" fill="#6b3a5a" />
              <circle cx="846" cy="565" r="22" fill="#7b4566" />
              <circle cx="880" cy="572" r="20" fill="#f0a040" />
            </g>
          </g>
          {/* mud and worm */}
          <ellipse cx="1320" cy="900" rx="320" ry="70" fill="#5a3e26" />
          <ellipse cx="1300" cy="890" rx="220" ry="40" fill="#6b4a2e" />
          <Worm x={1260} y={880} ext={1} f={f} ang={-1.25} color="#e6b59c" shake={shake} />
        </svg>
        {/* inset: worm between tooth and gum */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 90,
            width: 520,
            height: 520,
            borderRadius: "50%",
            overflow: "hidden",
            border: "8px solid #3b2a1e",
            boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
            transform: `scale(${inset})`,
          }}
        >
          <div style={{ position: "absolute", left: -700, top: -280, width: 1920, height: 1080, transform: "scale(0.75)", transformOrigin: "960px 400px" }}>
            <ToothCross duration={200} worms="peek" />
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Egyptian papyrus ----------
export const Papyrus: React.FC<{ duration: number; labelAt: number }> = ({ duration, labelAt }) => {
  const r = seeded(77);
  const cols = Array.from({ length: 14 }, (_, c) =>
    Array.from({ length: 9 }, (_, k) => ({ x: 560 + c * 58, y: 300 + k * 56 + r() * 10, red: k === 0 && c % 4 === 0, w: 20 + r() * 26, s: r() })),
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #e8c98a, #a77c45)" }}>
      <Camera duration={duration} from={{ scale: 0.95, x: 0, y: 0 }} to={{ scale: 1.12, x: 50, y: 0 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <rect x="500" y="230" width="900" height="620" fill="#000" opacity="0.3" transform="translate(14 18)" />
          <rect x="500" y="230" width="900" height="620" fill="#ead9a8" />
          {Array.from({ length: 40 }, (_, i) => (
            <line key={`a${i}`} x1="500" x2="1400" y1={232 + i * 15.5} y2={232 + i * 15.5} stroke="#c9b27a" strokeWidth="2" opacity="0.5" />
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <line key={`b${i}`} y1="230" y2="850" x1={502 + i * 30} x2={502 + i * 30} stroke="#d4bf88" strokeWidth="2" opacity="0.5" />
          ))}
          {cols.flat().map((g, i) => (
            <path
              key={i}
              d={g.s > 0.5 ? `M ${g.x} ${g.y} q ${g.w / 2} -14 ${g.w} 0 q -${g.w / 2} 10 -${g.w} 22` : `M ${g.x} ${g.y} l ${g.w} 4 m -${g.w / 2} -10 l 0 26`}
              stroke={g.red ? "#b0301a" : "#2a1a10"}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          ))}
          {/* honey jar */}
          <g transform="translate(1500 650)">
            <path d="M -70 -60 Q -100 60 -40 110 L 40 110 Q 100 60 70 -60 Z" fill="#b5673a" stroke="#5a2e16" strokeWidth="5" />
            <rect x="-55" y="-90" width="110" height="34" rx="8" fill="#8a4a26" stroke="#5a2e16" strokeWidth="5" />
            <path d="M -40 -60 Q -45 -20 -30 0 Q -20 -20 -22 -60" fill="#f0b030" />
          </g>
        </svg>
        <DiamondLabel x={420} y={200} at={labelAt} text="エーベルス・パピルス" sub="紀元前1550年ごろ" icon={<ScrollIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- The word 虫歯 ----------
export const WordCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 8, fps, config: { damping: 14 } });
  const circ = interpolate(f, [40, 70], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #f6ecd2, #d9c08e)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, color: "#2a1a0e", textAlign: "center", transform: `scale(${0.8 + 0.2 * s})`, opacity: s, position: "relative" }}>
        <div style={{ fontSize: 44, letterSpacing: 20, color: "#6b4a2e" }}>むしば</div>
        <div style={{ fontSize: 300, fontWeight: 700, lineHeight: 1.1 }}>
          <span style={{ color: "#b3261e" }}>虫</span>歯
        </div>
        <svg width="420" height="420" viewBox="0 0 420 420" style={{ position: "absolute", left: -70, top: 20 }}>
          <circle cx="210" cy="210" r="170" fill="none" stroke="#b3261e" strokeWidth="12" strokeDasharray="1070" strokeDashoffset={1070 * (1 - circ)} strokeLinecap="round" transform="rotate(-100 210 210)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Fauchard and the microscope ----------
export const Fauchard: React.FC<{ duration: number; nameAt: number; yearAt: number; lensAt: number }> = ({ duration, nameAt, yearAt, lensAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lens = spring({ frame: f - lensAt, fps, config: { damping: 15 } });
  const r = seeded(5);
  const tubules = Array.from({ length: 26 }, () => ({ x: r() * 360 - 180, a: r() * 20 - 10 }));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2f4a3e, #1b2c25)" }}>
      <Camera duration={duration} from={{ scale: 1.0, x: 0, y: 0 }} to={{ scale: 1.1, x: -40, y: 0 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          {/* wall panels */}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={80 + i * 460} y="80" width="400" height="560" fill="none" stroke="#3f5e50" strokeWidth="6" />
          ))}
          {/* portrait frame */}
          <rect x="360" y="140" width="420" height="520" fill="#c9a24a" />
          <rect x="384" y="164" width="372" height="472" fill="#3a3028" />
          <g>
            <path d="M 470 660 Q 570 520 670 660 Z" fill="#1f2230" />
            <path d="M 545 520 L 570 560 L 595 520" fill="#f2ead8" />
            <ellipse cx="570" cy="410" rx="62" ry="78" fill="#e6c09a" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={`l${i}`} cx={492 + (i % 2) * 8} cy={330 + i * 32} r="26" fill="#e9e6df" />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={`r${i}`} cx={648 - (i % 2) * 8} cy={330 + i * 32} r="26" fill="#e9e6df" />
            ))}
            <path d="M 505 350 Q 570 270 635 350 Q 570 320 505 350 Z" fill="#e9e6df" />
            <path d="M 545 410 q 8 -5 16 0 M 580 410 q 8 -5 16 0" stroke="#3a2a20" strokeWidth="4" fill="none" />
            <path d="M 556 450 q 14 6 28 0" stroke="#7a3a2a" strokeWidth="4" fill="none" />
          </g>
          {/* table */}
          <rect x="900" y="760" width="1020" height="320" fill="#5a3a22" />
          <rect x="900" y="740" width="1020" height="30" fill="#6e4a2c" />
          {/* microscope */}
          <g transform="translate(1180 340)">
            <rect x="-30" y="380" width="200" height="36" rx="8" fill="#b08a3a" stroke="#5a4214" strokeWidth="4" />
            <path d="M 60 380 Q 140 260 70 140" stroke="#b08a3a" strokeWidth="30" fill="none" strokeLinecap="round" />
            <rect x="10" y="40" width="44" height="220" rx="10" fill="#c9a24a" stroke="#5a4214" strokeWidth="4" transform="rotate(-18 32 150)" />
            <rect x="-10" y="270" width="120" height="16" fill="#8a6a2a" />
            <circle cx="32" cy="30" r="20" fill="#2a2a2a" />
          </g>
          {/* book */}
          <g transform="translate(1460 640) rotate(-6)">
            <rect x="0" y="0" width="300" height="200" fill="#f2e6c6" stroke="#5a3a22" strokeWidth="6" />
            <line x1="150" y1="0" x2="150" y2="200" stroke="#5a3a22" strokeWidth="4" />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="20" x2="130" y1={40 + i * 30} y2={40 + i * 30} stroke="#8a7a5a" strokeWidth="3" />
            ))}
            <text x="225" y="70" fontFamily="serif" fontSize="22" fill="#2a1a10" textAnchor="middle">
              Le Chirurgien
            </text>
            <text x="225" y="98" fontFamily="serif" fontSize="22" fill="#2a1a10" textAnchor="middle">
              Dentiste
            </text>
            <text x="225" y="150" fontFamily="serif" fontSize="26" fill="#2a1a10" textAnchor="middle">
              1728
            </text>
          </g>
        </svg>
        {/* lens view: no worms */}
        <div
          style={{
            position: "absolute",
            left: 1330,
            top: 110,
            width: 420,
            height: 420,
            borderRadius: "50%",
            overflow: "hidden",
            border: "10px solid #b08a3a",
            background: "radial-gradient(circle, #f6ecd2, #d9c49a)",
            transform: `scale(${lens})`,
            boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
          }}
        >
          <svg width="420" height="420" viewBox="-210 -210 420 420">
            {tubules.map((t, i) => (
              <path key={i} d={`M ${t.x} -210 Q ${t.x + t.a} 0 ${t.x} 210`} stroke="#c9a87a" strokeWidth="5" fill="none" />
            ))}
            <text x="0" y="20" fontFamily={FONT} fontWeight={700} fontSize="64" fill="#b3261e" textAnchor="middle" opacity={interpolate(f, [lensAt + 30, lensAt + 45], [0, 1], clamp)}>
              虫はいない
            </text>
          </svg>
        </div>
        <DiamondLabel x={300} y={760} at={nameAt} text="ピエール・フォシャール" sub="フランスの歯医者" icon={<ToothIcon size={54} />} />
        <DiamondLabel x={300} y={880} at={yearAt} text="1728年" sub="著書で記す" icon={<ScrollIcon />} />
      </Camera>
    </AbsoluteFill>
  );
};

export { WormIcon };
