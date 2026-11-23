import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile } from "remotion";
import "@fontsource/noto-serif-jp/400.css";
import "@fontsource/noto-serif-jp/700.css";
import durations from "../../public/ha/durations.json";
import { FadeIn, PaperOverlay, Subtitle } from "../edo/common";
import { ChapterCard, IconMontage, NightRoom, TitleCard, TodayCard } from "./scenes1";
import { ClayTablet, Fauchard, Papyrus, RegionMap, ToothCross, WordCard, WormStory } from "./scenes2";

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

// Subtitle text (kanji). The audio was synthesized from docs/ha-itami/script-ch0-1.tsv.
const TEXT: Record<string, string> = {
  p1: "ズキズキ、ズキズキ。夜中に突然、歯が痛み出す。",
  p2: "今なら、痛み止めを飲んで\n朝になったら歯医者へ行けば大丈夫。",
  p3: "でも、歯医者も、痛み止めの薬もなかった時代。\n人々は、この痛みとどう向き合っていたのでしょうか。",
  p4: "歯の痛みの歴史をたどると\n虫、神さま、そして、ちょっと怖い治療が出てきます。",
  p5: "昔の人が、歯の痛みにどう立ち向かったのか。\nのぞいてみましょう。",
  c1: "第一章　歯の中に、虫がいる？",
  c2: "歯が痛むのは、なぜなのか。\n昔の人が出した答えは、とても意外なものでした。",
  c3: "「歯の中に、虫が住んでいる」",
  c4: "今のイラクのあたり、古代メソポタミアでは\n歯の痛みは虫のしわざだと考えられていました。",
  c5: "2500年以上前の粘土板には\nこんなお話が刻まれています。",
  c6: "泥から生まれた一匹の虫が\n神さまに、何を食べればいいのかとたずねます。",
  c7: "神さまがイチジクやアンズを差し出すと\n虫は首を振って、こう言いました。",
  c8: "「わたしを、歯と歯ぐきのあいだに住まわせてください。\n歯の血を吸って暮らします」",
  c9: "歯が痛いときには、このお話を唱えて\n虫を追い払おうとしたのです。",
  c10: "エジプトにも、歯の痛みの記録があります。",
  c11: "紀元前1550年ごろの医学書『エーベルス・パピルス』には\n歯の痛みに効く薬の作り方も書かれています。",
  c12: "歯の虫の考え方は、その後もなかなか消えませんでした。\nヨーロッパでも、長いあいだ信じられていたのです。",
  c13: "歯に穴があくのも、ズキズキ痛むのも\nすべて虫が食べたせい。",
  c14: "この考え方は、わたしたちの言葉にも残っていると言われます。\nそう、「虫歯」です。",
  c15: "「虫はいない」と書き残したのは\nフランスの歯医者、ピエール・フォシャールでした。",
  c16: "1728年、彼は「顕微鏡で何度も調べたが\n虫は見つからなかった」と記しています。",
  c17: "では、本当の原因は何なのか。\nそれがはっきりわかるのは、もっとずっと先のことです。",
  c18: "虫のせいだと信じていた人々。\nその痛みを止めるために、まず頼ったのは、神さまでした。",
};
const ORDER = Object.keys(TEXT);
const DUR = durations as Record<string, number>;
const GAP = 0.35;
const EXTRA_AFTER: Record<string, number> = { p5: 2.4, c1: 0.7, c3: 0.3, c13: 0.2, c18: 0.6 };
const EXTRA_BEFORE: Record<string, number> = { c1: 0.6 };

// Line start times (seconds).
const START: Record<string, number> = {};
{
  let t = 0.8;
  for (const id of ORDER) {
    t += EXTRA_BEFORE[id] ?? 0;
    START[id] = t;
    t += DUR[id] + GAP + (EXTRA_AFTER[id] ?? 0);
  }
}
const END = (id: string) => START[id] + DUR[id];
const NEXT_CARD = END("c18") + 0.9;
export const TOTAL = NEXT_CARD + 4.2;
export const DURATION = s(TOTAL);

type SceneDef = { key: string; at: number };
const SCENES: SceneDef[] = [
  { key: "room", at: 0 },
  { key: "montage", at: START.p4 - 0.35 },
  { key: "title", at: START.p5 - 0.35 },
  { key: "ch1", at: START.c1 - 0.5 },
  { key: "tooth", at: START.c2 - 0.35 },
  { key: "map", at: START.c4 - 0.35 },
  { key: "tablet", at: START.c5 - 0.35 },
  { key: "story", at: START.c6 - 0.35 },
  { key: "chant", at: START.c9 - 0.35 },
  { key: "egypt", at: START.c10 - 0.35 },
  { key: "europe", at: START.c12 - 0.35 },
  { key: "word", at: START.c14 - 0.35 },
  { key: "fauchard", at: START.c15 - 0.35 },
  { key: "question", at: START.c17 - 0.35 },
  { key: "pray", at: START.c18 - 0.35 },
  { key: "next", at: NEXT_CARD },
];

const rel = (id: string, sceneAt: number, frac = 0) => s(START[id] + DUR[id] * frac - sceneAt);

const renderScene = (key: string, at: number, len: number) => {
  switch (key) {
    case "room":
      return (
        <>
          <NightRoom duration={len} />
          <TodayCard at={rel("p2", at)} crossAt={rel("p3", at, 0.1)} />
        </>
      );
    case "montage":
      return <IconMontage duration={len} times={[rel("p4", at, 0.4), rel("p4", at, 0.5), rel("p4", at, 0.68)]} />;
    case "title":
      return <TitleCard duration={len} />;
    case "ch1":
      return <ChapterCard num="第一章" title="歯の中に、虫がいる？" />;
    case "tooth":
      return <ToothCross duration={len} worms="peek" />;
    case "map":
      return (
        <RegionMap
          duration={len}
          box={[
            [30, 26],
            [56, 40],
          ]}
          highlight={["368"]}
          rivers={[
            [[42.7, 37.1], [43.1, 36.3], [43.6, 35.0], [44.4, 33.3], [45.8, 32.5], [47.0, 31.4], [47.4, 31.0], [48.0, 30.4]],
            [[38.3, 36.5], [40.1, 35.3], [41.0, 34.4], [43.3, 33.0], [44.3, 32.4], [45.5, 31.6], [46.5, 31.0], [47.4, 31.0]],
          ]}
          label={{ text: "メソポタミア", sub: "（今のイラクのあたり）", lon: 44.2, lat: 34.6 }}
          places={[{ name: "バビロン", lon: 44.42, lat: 32.54 }]}
        />
      );
    case "tablet":
      return <ClayTablet duration={len} labelAt={12} />;
    case "story":
      return <WormStory duration={len} offerAt={rel("c7", at)} refuseAt={rel("c7", at, 0.55)} toothAt={rel("c8", at)} />;
    case "chant":
      return <ToothCross duration={len} worms="retreat" chant />;
    case "egypt":
      return <Papyrus duration={len} labelAt={rel("c11", at, 0.15)} />;
    case "europe":
      return <ToothCross duration={len} mode="engraving" worms="many" />;
    case "word":
      return <WordCard />;
    case "fauchard":
      return <Fauchard duration={len} nameAt={rel("c15", at, 0.6)} yearAt={rel("c16", at)} lensAt={rel("c16", at, 0.35)} />;
    case "question":
      return <ToothCross duration={len} worms="none" question />;
    case "pray":
      return <NightRoom duration={len} pose="pray" zoom={false} />;
    case "next":
      return <ChapterCard num="第二章（つづく）" title="神さま仏さまに頼む" />;
    default:
      return null;
  }
};

const ALL_TEXT = Object.values(TEXT).join("") + "今なら…痛み止め歯医者昔は、なかった虫神さま怖い治療歯が痛くなったら昔の人はどうしていた？歯第一章第二章（つづく）神さま仏さまに頼むメソポタミア（今のイラクのあたり）バビロン粘土板2500年以上前エーベルス・パピルス紀元前1550年ごろむしば虫歯虫はいないピエール・フォシャールフランスの歯医者1728年著書で記す？";

const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(["400", "700"].map((w) => document.fonts.load(`${w} 40px "Noto Serif JP"`, ALL_TEXT)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

export const HaFilm: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SCENES.map((sc, i) => {
        const next = SCENES[i + 1]?.at ?? TOTAL;
        const len = s(next - sc.at) + 15;
        const body = renderScene(sc.key, sc.at, len);
        return (
          <Sequence key={sc.key + i} from={s(sc.at)} durationInFrames={len}>
            {i === 0 ? <AbsoluteFill>{body}</AbsoluteFill> : <FadeIn>{body}</FadeIn>}
          </Sequence>
        );
      })}
      <PaperOverlay />
      {ORDER.map((id) => (
        <Subtitle key={id} text={TEXT[id]} from={s(START[id])} to={s(END(id) + 0.3)} />
      ))}
      {ORDER.map((id) => (
        <Sequence key={`a${id}`} from={s(START[id])}>
          <Audio src={staticFile(`ha/${id}.wav`)} />
        </Sequence>
      ))}
      <Audio
        src={staticFile("ha/bgm.wav")}
        volume={(f) => {
          const talking = ORDER.some((id) => f >= s(START[id]) - 6 && f <= s(END(id)) + 6);
          const fadeOut = interpolate(f, [DURATION - 60, DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return interpolate(f, [0, 30], [0, 1], { extrapolateRight: "clamp" }) * (talking ? 0.16 : 0.34) * fadeOut;
        }}
      />
      {SCENES.slice(1).map((sc) => (
        <Sequence key={`w${sc.key}`} from={Math.max(0, s(sc.at) - 8)}>
          <Audio src={staticFile("edo/whoosh.wav")} volume={0.28} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
