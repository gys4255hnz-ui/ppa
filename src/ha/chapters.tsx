import React from "react";
import { makeChapter } from "./engine";
import { ChapterCard, IconMontage, NightRoom } from "./scenes1";
import { RegionMap, ToothCross } from "./scenes2";
import {
  Barber,
  CloveStill,
  Denture,
  DoctorScene,
  EtherDome,
  Fumigation,
  Fusayoji,
  Figure,
  Flier,
  GasShow,
  Iainuki,
  JapaneseRoom,
  KeyTool,
  MeijiDentist,
  MorningRoom,
  Ohaguro,
  Shrine,
  StainedSaint,
  WaterBowl,
  WordShift,
} from "./scenes3";
import d2 from "../../public/ha/ch2/durations.json";
import d3 from "../../public/ha/ch3/durations.json";
import d4 from "../../public/ha/ch4/durations.json";
import d5 from "../../public/ha/ch5/durations.json";
import d6 from "../../public/ha/ch6/durations.json";
import d7 from "../../public/ha/ch7/durations.json";
import dEnd from "../../public/ha/end/durations.json";

const NEVER = 99999;
const LABELS = "聖アポロニア249年ごろ歯痛のお守り歯神社大阪・梅田なで石水を食い止める「歯止め」痛みを止める「歯痛止め」ヒヨスの種煙でいぶす正体は楽器の弦？丁子クローブ丁子油今も歯科で市場の歯抜き屋床屋さん抜歯用の鍵てこで抜く歯みがき居合抜き大道芸長井兵助入れ歯・歯の療治口中医こうちゅうい房楊枝ふさようじ1643年ごろ丁字屋大明香薬お歯黒おはぐろ入れ歯師いればし木の総入れ歯1538年没の仏姫和歌山・願成寺自分の歯で実験ホレス・ウェルズ1844年1846年10月16日エーテル麻酔小幡英之助日本初の歯科医師免許アメリカハートフォードボストン第二章第三章第四章第五章第六章第七章終章おわり虫神さま怖い治療";

export const ch2 = makeChapter({
  folder: "ha/ch2",
  durations: d2,
  labels: LABELS,
  extraAfter: { d1: 0.6 },
  text: {
    d1: "第二章　神さま、仏さまに頼む",
    d2: "原因が虫だとしても、薬がなければ治せません。\nそこで人々が頼ったのが、神さまや仏さまでした。",
    d3: "ヨーロッパでは、歯の痛みの守り神として\n聖アポロニアという女性が祈られてきました。",
    d4: "西暦249年ごろ、エジプトのアレクサンドリアで\n歯を折られる目にあったと伝えられています。",
    d5: "そのため、歯の痛みに苦しむ人たちは、彼女に祈りました。",
    d6: "中世には、彼女の歯だという品が\n歯痛のお守りとして売られていたほどです。",
    d7: "日本にも、歯の神さまがいます。\n大阪の梅田にある、歯神社です。",
    d8: "もとは、大洪水のとき、流れてくる水を食い止めた\n大きな石を祀ったものでした。",
    d9: "水を食い止める「歯止め」の神さま。\nそれがいつしか「歯痛止め」の神さまとして\n親しまれるようになったと言われます。",
    d10: "なで石をなでてから、痛い歯をなでると\n痛みが取れると言われています。",
    d11: "祈りやおまじないで、虫歯が治るわけではありません。",
    d12: "それでも、すがるものがほしい。\nそれほど、歯の痛みはつらいものだったのです。",
    d13: "では、少しでも痛みをやわらげる方法は\nなかったのでしょうか。",
  },
  scenes: [
    { key: "card", from: "d1", render: () => <ChapterCard num="第二章" title="神さま、仏さまに頼む" /> },
    { key: "pray", from: "d2", render: (c) => <NightRoom duration={c.len} pose="pray" zoom={false} /> },
    { key: "saint", from: "d3", render: (c) => <StainedSaint duration={c.len} labelAt={c.rel("d4", 0.1)} relicAt={c.rel("d6", 0.2)} /> },
    { key: "shrine", from: "d7", render: (c) => <Shrine duration={c.len} mode="shrine" labelAt={c.rel("d7", 0.6)} /> },
    { key: "flood", from: "d8", render: (c) => <Shrine duration={c.len} mode="flood" /> },
    { key: "word", from: "d9", render: (c) => <WordShift shiftAt={c.rel("d9", 0.45)} /> },
    { key: "stroke", from: "d10", render: (c) => <Shrine duration={c.len} mode="stroke" labelAt={12} /> },
    { key: "pray2", from: "d11", render: (c) => <NightRoom duration={c.len} pose="pray" /> },
    { key: "q", from: "d13", render: (c) => <ToothCross duration={c.len} worms="none" question /> },
  ],
});

export const ch3 = makeChapter({
  folder: "ha/ch3",
  durations: d3,
  labels: LABELS,
  extraAfter: { e1: 0.6 },
  text: {
    e1: "第三章　痛みをやわらげる知恵",
    e2: "神頼みだけではありません。\n人々は、身近なもので、痛みをやわらげようとしました。",
    e3: "中世のヨーロッパでよく行われたのが\n煙で虫をいぶり出す方法です。",
    e4: "ヒヨスという植物の種を、炭の上で焼き\nその煙を、管で口に吸い込みます。",
    e5: "すると、口から虫が出てくる、と信じられていました。",
    e6: "水を張ったお皿に、つばを吐かせて\nうごめく虫を見せる治療師もいたと言われます。",
    e7: "ところがその正体は、水を吸って動く\n楽器の弦の切れはしだった、という話も残っています。",
    e8: "一方で、本当に役に立った知恵もあります。",
    e9: "それが、丁子（ちょうじ）。英語ではクローブと呼ばれる\n花のつぼみを干した香辛料です。",
    e10: "丁子の油には、痛みをしずめる成分が含まれていて\n今でも歯医者さんで使われることがあります。",
    e11: "昔の人は、経験から、効くものを見つけ出していたのです。",
    e12: "それでも、虫歯そのものが治るわけではありません。\n痛みは、またやってきます。",
    e13: "そして、最後に残された方法は\nとても単純で、とても怖いものでした。",
  },
  scenes: [
    { key: "card", from: "e1", render: () => <ChapterCard num="第三章" title="痛みをやわらげる知恵" /> },
    { key: "room", from: "e2", render: (c) => <NightRoom duration={c.len} /> },
    { key: "fume", from: "e3", render: (c) => <Fumigation duration={c.len} labelAt={c.rel("e4", 0.1)} /> },
    { key: "bowl", from: "e6", render: (c) => <WaterBowl duration={c.len} revealAt={c.rel("e7", 0.35)} /> },
    { key: "clove", from: "e8", render: (c) => <CloveStill duration={c.len} labelAt={c.rel("e9", 0.15)} todayAt={c.rel("e10", 0.65)} /> },
    { key: "pain", from: "e12", render: (c) => <NightRoom duration={c.len} /> },
    { key: "key", from: "e13", render: (c) => <KeyTool duration={c.len} labelAt={NEVER} /> },
  ],
});

export const ch4 = makeChapter({
  folder: "ha/ch4",
  durations: d4,
  labels: LABELS,
  extraAfter: { f1: 0.6 },
  text: {
    f1: "第四章　最後は、抜く",
    f2: "痛む歯を、抜いてしまう。\n麻酔のない時代、それは、想像を絶する痛みでした。",
    f3: "中世のヨーロッパで歯を抜いていたのは\nなんと、床屋さんでした。",
    f4: "床屋は、ひげをそるだけでなく\nちょっとした外科の仕事も、引き受けていたのです。",
    f5: "市場では、歯抜き屋が、太鼓やラッパを鳴らして\n客を集めたとも言われます。",
    f6: "患者の叫び声を、かき消すためだった\nという説まであります。",
    f7: "やがて、てこの力で歯を抜く\n鍵のような形の道具も登場しました。",
    f8: "では、江戸の町では、どうだったのでしょう。",
    f9: "にぎやかな通りで人を集めていたのが\n居合抜きの芸人です。",
    f10: "中でも有名だったのが、長井兵助。\n長い刀を抜いてみせる芸で客を集め\n歯の治療や入れ歯の商売もしていました。",
    f11: "当時のチラシには、刀と入れ歯の絵が\n一緒に描かれていたそうです。",
    f12: "また、口の中の病気を専門に診る\n口中医（こうちゅうい）と呼ばれるお医者さんもいました。",
    f13: "とはいえ、抜くのは最後の手段。\n人々は、歯を守る工夫も、始めていました。",
  },
  scenes: [
    { key: "card", from: "f1", render: () => <ChapterCard num="第四章" title="最後は、抜く" /> },
    { key: "pain", from: "f2", render: (c) => <NightRoom duration={c.len} /> },
    { key: "barber", from: "f3", render: (c) => <Barber duration={c.len} labelAt={c.rel("f3", 0.7)} /> },
    { key: "market", from: "f5", render: (c) => <Barber duration={c.len} market labelAt={12} /> },
    { key: "key", from: "f7", render: (c) => <KeyTool duration={c.len} labelAt={c.rel("f7", 0.4)} /> },
    { key: "iai", from: "f8", render: (c) => <Iainuki duration={c.len} labelAt={c.rel("f9", 0.6)} /> },
    { key: "flier", from: "f11", render: () => <Flier /> },
    { key: "doctor", from: "f12", render: (c) => <DoctorScene duration={c.len} labelAt={c.rel("f12", 0.55)} /> },
    { key: "tooth", from: "f13", render: (c) => <ToothCross duration={c.len} worms="none" /> },
  ],
});

export const ch5 = makeChapter({
  folder: "ha/ch5",
  durations: d5,
  labels: LABELS,
  extraAfter: { g1: 0.6 },
  text: {
    g1: "第五章　痛くならないための工夫",
    g2: "江戸の人たちは、毎朝、歯をみがいていました。",
    g3: "使っていたのは、房楊枝（ふさようじ）。\n柳などの枝の先をたたいて、ブラシのようにほぐしたものです。",
    g4: "みがき粉も、売られていました。",
    g5: "1643年ごろ、丁字屋という店が「大明香薬」という\nみがき粉を売り出したのが始まり、と言われています。",
    g6: "細かい砂に、丁子などの香りを混ぜたもので\n歯を白くし、口の匂いを消すと、うたわれていました。",
    g7: "もうひとつ、江戸の女性の口元といえば、お歯黒です。",
    g8: "結婚した女性などが、歯を黒く染める習わしでした。",
    g9: "鉄を溶かした液と、植物からとった粉を使って染めます。",
    g10: "このお歯黒には、歯の表面を守って\n虫歯を防ぐ働きもあったと考えられています。",
    g11: "それでも、歯は少しずつ失われていきます。\n抜けてしまった歯は、どうしたのでしょう。",
  },
  scenes: [
    { key: "card", from: "g1", render: () => <ChapterCard num="第五章" title="痛くならないための工夫" /> },
    { key: "morning", from: "g2", render: (c) => <MorningRoom duration={c.len} /> },
    { key: "yoji", from: "g3", render: (c) => <Fusayoji duration={c.len} powderAt={c.rel("g4")} yearAt={c.rel("g5", 0.1)} /> },
    { key: "ohaguro", from: "g7", render: (c) => <Ohaguro duration={c.len} potAt={c.rel("g9")} labelAt={c.rel("g7", 0.7)} /> },
    { key: "q", from: "g11", render: (c) => <ToothCross duration={c.len} worms="none" question /> },
  ],
});

export const ch6 = makeChapter({
  folder: "ha/ch6",
  durations: d6,
  labels: LABELS,
  extraAfter: { h1: 0.6 },
  text: {
    h1: "第六章　抜けたあとは、入れ歯",
    h2: "歯がなくなると、食べることも、話すことも、大変になります。",
    h3: "そこで生まれたのが、入れ歯です。",
    h4: "日本に残る、最も古い入れ歯は\n和歌山の願成寺（がんじょうじ）に伝わるものです。",
    h5: "1538年に亡くなった、仏姫（ほとけひめ）と呼ばれる尼さんが\n使っていたとされます。",
    h6: "驚くことに、これは、木を彫って作った総入れ歯でした。",
    h7: "しかも、上あごに、ぴたりと吸い付くように\n作られていたのです。",
    h8: "江戸時代になると、入れ歯を作る職人\n入れ歯師（いればし）が活躍します。",
    h9: "木の土台に、石や動物の骨、人の歯などを植え込んで\n見た目も工夫しました。",
    h10: "歯を失っても、食べる楽しみを、あきらめない。\nその工夫は、今の入れ歯にも、つながっています。",
    h11: "そしてついに、歯の治療を大きく変える発見が、生まれます。",
  },
  scenes: [
    { key: "card", from: "h1", render: () => <ChapterCard num="第六章" title="抜けたあとは、入れ歯" /> },
    {
      key: "elder",
      from: "h2",
      render: (c) => (
        <JapaneseRoom duration={c.len}>
          <Figure x={960} y={900} s={1.9} robe="#6a5a4a" hair="topknot" hairColor="#bdb8b0" mouth="pain" arm="cheek" />
        </JapaneseRoom>
      ),
    },
    {
      key: "map",
      from: "h4",
      render: (c) => (
        <RegionMap
          duration={c.len}
          box={[
            [129, 31],
            [142, 41],
          ]}
          highlight={["392"]}
          label={{ text: "和歌山・願成寺", lon: 135.17, lat: 34.6 }}
          places={[{ name: "", lon: 135.17, lat: 34.23 }]}
        />
      ),
    },
    { key: "denture", from: "h5", render: (c) => <Denture duration={c.len} labelAt={c.rel("h5", 0.5)} /> },
    { key: "craft", from: "h8", render: (c) => <Denture duration={c.len} craft labelAt={c.rel("h8", 0.6)} /> },
    { key: "morning", from: "h10", render: (c) => <MorningRoom duration={c.len} /> },
    { key: "next", from: "h11", render: (c) => <ToothCross duration={c.len} worms="none" /> },
  ],
});

export const ch7 = makeChapter({
  folder: "ha/ch7",
  durations: d7,
  labels: LABELS,
  extraAfter: { i1: 0.6 },
  text: {
    i1: "第七章　痛くない治療へ",
    i2: "19世紀のアメリカ。きっかけを作ったのは、歯医者さんでした。",
    i3: "1844年、歯医者のホレス・ウェルズは\n笑気ガスを吸った人が\nけがをしても痛がらないことに気づきます。",
    i4: "そこで、自分の歯を抜いてもらうときに\n笑気ガスを試してみたのです。",
    i5: "結果は、ほとんど痛みなし。\nところが、大勢の前での実演では\n患者が声を上げてしまい、失敗とされてしまいました。",
    i6: "1846年10月16日。ウェルズと仕事をしたこともある歯医者\nウィリアム・モートンが\nエーテルという薬で公開手術にのぞみます。",
    i7: "患者は眠ったまま、手術は成功。麻酔の時代が始まりました。",
    i8: "体を眠らせる麻酔は、歯医者さんの挑戦から\n広まっていったのです。",
    i9: "日本でも、明治時代になると、西洋式の歯科医学が入ってきます。",
    i10: "小幡英之助（おばたえいのすけ）は、日本で初めて\n歯科の医師の免許を受けた人物として知られています。",
    i11: "こうして、歯の治療は、少しずつ\n痛くないものへと、変わっていきました。",
  },
  scenes: [
    { key: "card", from: "i1", render: () => <ChapterCard num="第七章" title="痛くない治療へ" /> },
    {
      key: "usa",
      from: "i2",
      render: (c) => (
        <RegionMap
          duration={c.len}
          box={[
            [-125, 25],
            [-66, 49],
          ]}
          highlight={["840"]}
          label={{ text: "アメリカ", lon: -98, lat: 39 }}
          places={[
            { name: "ハートフォード", lon: -72.68, lat: 41.76 },
            { name: "ボストン", lon: -71.06, lat: 42.36 },
          ]}
        />
      ),
    },
    { key: "gas", from: "i3", render: (c) => <GasShow duration={c.len} labelAt={c.rel("i3", 0.35)} /> },
    { key: "extract", from: "i4", render: (c) => <GasShow duration={c.len} extract labelAt={10} /> },
    { key: "ether", from: "i6", render: (c) => <EtherDome duration={c.len} labelAt={c.rel("i6", 0.1)} /> },
    { key: "meiji", from: "i9", render: (c) => <MeijiDentist duration={c.len} labelAt={c.rel("i10", 0.25)} /> },
    { key: "morning", from: "i11", render: (c) => <MorningRoom duration={c.len} /> },
  ],
});

export const chEnd = makeChapter({
  folder: "ha/end",
  durations: dEnd,
  labels: LABELS,
  extraAfter: { j1: 0.6 },
  tail: 5.5,
  text: {
    j1: "終章　今、歯医者に行けるということ",
    j2: "歯の中の虫を信じ、神さまに祈り\n最後は抜くしかなかった時代。",
    j3: "その長い歴史の先に、今の、痛くない治療があります。",
    j4: "夜中に歯が痛むとき\n昔の人のことを、少しだけ思い出してみてください。",
    j5: "そして、朝になったら、ちゃんと歯医者さんへ行きましょう。",
  },
  scenes: [
    { key: "card", from: "j1", render: () => <ChapterCard num="終章" title="今、歯医者に行けるということ" /> },
    { key: "montage", from: "j2", render: (c) => <IconMontage duration={c.len} times={[c.rel("j2", 0.1), c.rel("j2", 0.4), c.rel("j2", 0.75)]} /> },
    { key: "tooth", from: "j3", render: (c) => <ToothCross duration={c.len} worms="none" /> },
    { key: "night", from: "j4", render: (c) => <NightRoom duration={c.len} /> },
    { key: "morning", from: "j5", render: (c) => <MorningRoom duration={c.len} /> },
    { key: "fin", from: "j5", lead: -(dEnd.j5 + 0.8), render: () => <ChapterCard num="おわり" title="歯が痛くなったら" sub="昔の人はどうしていた？" /> },
  ],
});
