import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries from "world-atlas/countries-50m.json";
import { BoxIcon, Camera, DiamondLabel, FONT } from "./common";

const topo = countries as unknown as Topology<{ countries: GeometryCollection }>;
const all = feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection;
const japan = all.features.find((f) => String(f.id) === "392")!;

const projection = geoMercator().fitExtent(
  [
    [260, 40],
    [1660, 1040],
  ],
  {
    type: "Feature",
    properties: {},
    geometry: { type: "MultiPoint", coordinates: [[129.0, 30.8], [142.2, 41.6]] },
  } as GeoJSON.Feature,
);
const path = geoPath(projection);
const P = (lon: number, lat: number) => projection([lon, lat]) as [number, number];

const toyama = P(137.21, 36.7);
const cities = [
  { name: "江戸", p: P(139.69, 35.69), dx: 30, dy: 50 },
  { name: "仙台", p: P(140.87, 38.27), dx: 34, dy: 10 },
  { name: "大坂", p: P(135.5, 34.69), dx: -10, dy: 56 },
  { name: "広島", p: P(132.46, 34.39), dx: -20, dy: -30 },
  { name: "高知", p: P(133.53, 33.56), dx: 20, dy: 50 },
  { name: "博多", p: P(130.4, 33.59), dx: -100, dy: -10 },
  { name: "薩摩", p: P(130.56, 31.6), dx: -100, dy: 20 },
];

const arc = (a: [number, number], b: [number, number]) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const cx = mx - (dy / len) * len * 0.22;
  const cy = my + (dx / len) * len * 0.22;
  return { d: `M ${a[0]} ${a[1]} Q ${cx} ${cy} ${b[0]} ${b[1]}`, end: b, ctrl: [cx, cy] as [number, number], len: len * 1.1 };
};

export const MapScene: React.FC<{ duration: number; cardAt: number }> = ({ duration, cardAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pin = spring({ frame: f - 12, fps, config: { damping: 10 } });
  const card = spring({ frame: f - cardAt, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: "#c4d3cc" }}>
      <Camera duration={duration} from={{ scale: 1.7, x: -(toyama[0] - 960) * 1.7, y: -(toyama[1] - 540) * 1.7 }} to={{ scale: 0.9, x: -250, y: -70 }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <pattern id="waves" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 20 Q 15 8 30 20 T 60 20" stroke="#9fb7ae" strokeWidth="2" fill="none" />
            </pattern>
            <marker id="head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#7a1f12" />
            </marker>
          </defs>
          <rect width="1920" height="1080" fill="#c4d3cc" />
          <rect width="1920" height="1080" fill="url(#waves)" opacity="0.6" />
          {all.features
            .filter((c) => c !== japan)
            .map((c, i) => (
              <path key={i} d={path(c) ?? ""} fill="#d9d0b4" stroke="#9c8b68" strokeWidth="2" />
            ))}
          <path d={path(japan) ?? ""} fill="#e7d6a4" stroke="#6e5536" strokeWidth="3" />
          {cities.map((c, i) => {
            const a = arc(toyama, c.p);
            const start = 30 + i * 9;
            const p = interpolate(f, [start, start + 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const dot = spring({ frame: f - start - 24, fps, config: { damping: 12 } });
            return (
              <g key={c.name}>
                <path
                  d={a.d}
                  stroke="#7a1f12"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${a.len} ${a.len}`}
                  strokeDashoffset={a.len * (1 - p)}
                  markerEnd={p > 0.97 ? "url(#head)" : undefined}
                />
                <circle cx={c.p[0]} cy={c.p[1]} r={10 * dot} fill="#7a1f12" stroke="#f3e7c9" strokeWidth="3" />
                <text
                  x={c.p[0] + c.dx}
                  y={c.p[1] + c.dy}
                  fontFamily={FONT}
                  fontWeight={700}
                  fontSize="38"
                  fill="#2a1a0e"
                  opacity={dot}
                  stroke="#f3ead2"
                  strokeWidth="6"
                  paintOrder="stroke"
                >
                  {c.name}
                </text>
              </g>
            );
          })}
          <circle cx={toyama[0]} cy={toyama[1]} r={18 * pin} fill="#b0301a" stroke="#f3e7c9" strokeWidth="4" />
        </svg>
        <DiamondLabel x={toyama[0]} y={toyama[1] - 80} at={14} text="富山" icon={<BoxIcon />} />
      </Camera>

      {/* 置き薬 card */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 200,
          width: 520,
          transform: `translateX(${(1 - card) * 700}px) rotate(${(1 - card) * 8 + 2}deg)`,
          background: "linear-gradient(#f6ecd2, #eadbb5)",
          border: "4px solid #3b2a1e",
          boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
          padding: "34px 40px",
          fontFamily: FONT,
          color: "#2a1a0e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <rect x="15" y="25" width="120" height="110" rx="6" fill="#a8743f" stroke="#3b2a1e" strokeWidth="5" />
            <rect x="15" y="25" width="120" height="26" fill="#8c5c2f" stroke="#3b2a1e" strokeWidth="5" />
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => (
                <g key={`${r}${c}`}>
                  <rect x={24 + c * 54} y={58 + r * 25} width={48} height={20} fill="#c08a52" stroke="#3b2a1e" strokeWidth="3" />
                  <circle cx={48 + c * 54} cy={68 + r * 25} r="3" fill="#3b2a1e" />
                </g>
              )),
            )}
            <rect x="58" y="29" width="34" height="18" fill="#f3e7c9" />
            <text x="75" y="44" fontFamily={FONT} fontWeight={700} fontSize="16" textAnchor="middle" fill="#7a1f12">
              薬
            </text>
          </svg>
          <div>
            <div style={{ fontSize: 74, fontWeight: 700, letterSpacing: 8 }}>置き薬</div>
            <div style={{ fontSize: 26, marginTop: 4, color: "#6b4a2e" }}>おきぐすり</div>
          </div>
        </div>
        <div style={{ marginTop: 22, borderTop: "2px solid #8b6b45", paddingTop: 16, fontSize: 34, lineHeight: 1.5 }}>
          先に使って、あとで払う
          <div style={{ fontSize: 28, color: "#7a1f12", fontWeight: 700 }}>「先用後利」</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
