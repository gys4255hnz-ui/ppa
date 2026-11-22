import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile } from "remotion";
import "@fontsource/noto-serif-jp/400.css";
import "@fontsource/noto-serif-jp/700.css";
import { FadeIn, PaperOverlay, Subtitle } from "./common";
import { TownScene } from "./Town";
import { MapScene } from "./MapScene";
import { YagenScene } from "./Yagen";
import { EndScene, ScrollScene } from "./ScrollScene";

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

// Scene starts (seconds). Each scene overlaps the next by a 0.5 s crossfade.
const SCENES = { town: 0, map: 8.3, yagen: 20.0, scroll: 27.3, end: 37.8, total: 41 };

// Narration: VOICEVOX (No.7 読み聞かせ, x1.1), kanji subtitles. Durations measured from the wavs.
const LINES = [
  { id: "l1", at: 0.8, dur: 6.7, text: "江戸時代。医者にかかれない人々は\nどうやって病気を治していたのでしょう。" },
  { id: "l2", at: 8.6, dur: 3.32, text: "頼りにしたのは、富山の薬売り。" },
  { id: "l3", at: 12.3, dur: 7.02, text: "家に薬箱を預け、使った分だけお代をもらう\n「置き薬」です。" },
  { id: "l4", at: 20.5, dur: 6.15, text: "中身は、草や根を薬研ですりつぶした「生薬」でした。" },
  { id: "l5", at: 27.8, dur: 8.96, text: "そして1774年。『解体新書』が世に出て\n西洋の医学が広まっていきます。" },
];

export const DURATION = s(SCENES.total);
const ALL_TEXT = LINES.map((l) => l.text).join("") + "江戸のくすり庶民の知恵をたどる置き薬おきぐすり先に使って、あとで払う「先用後利」富山江戸仙台大坂広島高知博多薩摩葛根かっこん甘草かんぞう1774年安永三年解體新書薬くすり";

const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(["400", "700"].map((w) => document.fonts.load(`${w} 40px "Noto Serif JP"`, ALL_TEXT)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

const Scene: React.FC<{ from: number; to: number; first?: boolean; children: React.ReactNode }> = ({ from, to, first, children }) => (
  <Sequence from={s(from)} durationInFrames={s(to - from) + 15}>
    {first ? <AbsoluteFill>{children}</AbsoluteFill> : <FadeIn>{children}</FadeIn>}
  </Sequence>
);

export const EdoFilm: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Scene from={SCENES.town} to={SCENES.map} first>
        <TownScene duration={s(SCENES.map - SCENES.town) + 15} />
      </Scene>
      <Scene from={SCENES.map} to={SCENES.yagen}>
        <MapScene duration={s(SCENES.yagen - SCENES.map) + 15} cardAt={s(12.6 - SCENES.map)} />
      </Scene>
      <Scene from={SCENES.yagen} to={SCENES.scroll}>
        <YagenScene duration={s(SCENES.scroll - SCENES.yagen) + 15} labelAt={s(21.8 - SCENES.yagen)} />
      </Scene>
      <Scene from={SCENES.scroll} to={SCENES.end}>
        <ScrollScene duration={s(SCENES.end - SCENES.scroll) + 15} labelAt={s(28.4 - SCENES.scroll)} />
      </Scene>
      <Scene from={SCENES.end} to={SCENES.total}>
        <EndScene />
      </Scene>

      <PaperOverlay />

      {LINES.map((l) => (
        <Subtitle key={l.id} text={l.text} from={s(l.at)} to={s(l.at + l.dur + 0.3)} />
      ))}

      {/* audio */}
      {LINES.map((l) => (
        <Sequence key={l.id} from={s(l.at)}>
          <Audio src={staticFile(`edo/vv/${l.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      <Audio
        src={staticFile("edo/bgm.wav")}
        volume={(f) => {
          const talking = LINES.some((l) => f >= s(l.at) - 6 && f <= s(l.at + l.dur) + 6);
          return interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" }) * (talking ? 0.22 : 0.42);
        }}
      />
      {[SCENES.map, SCENES.yagen, SCENES.scroll, SCENES.end].map((t) => (
        <Sequence key={t} from={s(t) - 8}>
          <Audio src={staticFile("edo/whoosh.wav")} volume={0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
