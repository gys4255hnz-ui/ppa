import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile } from "remotion";
import "@fontsource/noto-serif-jp/400.css";
import "@fontsource/noto-serif-jp/700.css";
import { FadeIn, PaperOverlay, Subtitle } from "../edo/common";

const FPS = 30;
export const sec = (x: number) => Math.round(x * FPS);

export type Ctx = {
  /** frame (relative to the scene start) at a point inside a narration line */
  rel: (id: string, frac?: number) => number;
  len: number;
};
export type SceneSpec = { key: string; from: string; lead?: number; render: (c: Ctx) => React.ReactNode };
export type ChapterSpec = {
  folder: string; // public/<folder>/<id>.wav
  text: Record<string, string>; // ordered: id -> subtitle
  durations: Record<string, number>;
  scenes: SceneSpec[];
  gap?: number;
  extraAfter?: Record<string, number>;
  tail?: number; // seconds after the last line
  labels?: string; // extra glyphs used in drawings, for font preloading
};

export const makeChapter = (spec: ChapterSpec) => {
  const order = Object.keys(spec.text);
  const gap = spec.gap ?? 0.35;
  const start: Record<string, number> = {};
  let t = 0.6;
  for (const id of order) {
    start[id] = t;
    t += spec.durations[id] + gap + (spec.extraAfter?.[id] ?? 0);
  }
  const end = (id: string) => start[id] + spec.durations[id];
  const total = end(order[order.length - 1]) + (spec.tail ?? 1.6);
  const scenes = spec.scenes.map((sc, i) => ({ ...sc, at: i === 0 ? 0 : start[sc.from] - (sc.lead ?? 0.35) }));
  const allText = Object.values(spec.text).join("") + (spec.labels ?? "");

  const Chapter: React.FC = () => {
    const [handle] = useState(() => delayRender("fonts"));
    useEffect(() => {
      Promise.all(["400", "700"].map((w) => document.fonts.load(`${w} 40px "Noto Serif JP"`, allText)))
        .then(() => document.fonts.ready)
        .then(() => continueRender(handle))
        .catch(() => continueRender(handle));
    }, [handle]);
    const D = sec(total);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        {scenes.map((sc, i) => {
          const next = scenes[i + 1]?.at ?? total;
          const len = sec(next - sc.at) + 15;
          const ctx: Ctx = { rel: (id, frac = 0) => sec(start[id] + spec.durations[id] * frac - sc.at), len };
          const body = sc.render(ctx);
          return (
            <Sequence key={sc.key + i} from={sec(sc.at)} durationInFrames={len}>
              {i === 0 ? <AbsoluteFill>{body}</AbsoluteFill> : <FadeIn>{body}</FadeIn>}
            </Sequence>
          );
        })}
        <PaperOverlay />
        {order.map((id) => (
          <Subtitle key={id} text={spec.text[id]} from={sec(start[id])} to={sec(end(id) + 0.3)} />
        ))}
        {order.map((id) => (
          <Sequence key={`a${id}`} from={sec(start[id])}>
            <Audio src={staticFile(`${spec.folder}/${id}.wav`)} />
          </Sequence>
        ))}
        <Audio
          src={staticFile("ha/bgm.wav")}
          volume={(f) => {
            const talking = order.some((id) => f >= sec(start[id]) - 6 && f <= sec(end(id)) + 6);
            const io = interpolate(f, [0, 30, D - 45, D], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return io * (talking ? 0.16 : 0.34);
          }}
        />
        {scenes.slice(1).map((sc) => (
          <Sequence key={`w${sc.key}${sc.at}`} from={Math.max(0, sec(sc.at) - 8)}>
            <Audio src={staticFile("edo/whoosh.wav")} volume={0.28} />
          </Sequence>
        ))}
      </AbsoluteFill>
    );
  };
  return { Chapter, durationInFrames: sec(total) };
};
