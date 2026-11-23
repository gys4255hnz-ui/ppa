import React from "react";
import { Composition } from "remotion";
import { Hello } from "./Hello";
import { DURATION, EdoFilm, FPS } from "./edo/EdoFilm";
import { DURATION as HA_DURATION, HaFilm } from "./ha/HaFilm";
import { ch2, ch3, ch4, ch5, ch6, ch7, chEnd } from "./ha/chapters";

export const Root: React.FC = () => (
  <>
    <Composition id="Hello" component={Hello} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="HaItami" component={HaFilm} durationInFrames={HA_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="HaCh2" component={ch2.Chapter} durationInFrames={ch2.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="HaCh3" component={ch3.Chapter} durationInFrames={ch3.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="HaCh4" component={ch4.Chapter} durationInFrames={ch4.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="HaCh5" component={ch5.Chapter} durationInFrames={ch5.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="HaCh6" component={ch6.Chapter} durationInFrames={ch6.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="HaCh7" component={ch7.Chapter} durationInFrames={ch7.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="HaEnd" component={chEnd.Chapter} durationInFrames={chEnd.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="EdoMedicine" component={EdoFilm} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
  </>
);
