import React from "react";
import { Composition } from "remotion";
import { Hello } from "./Hello";
import { DURATION, EdoFilm, FPS } from "./edo/EdoFilm";
import { DURATION as HA_DURATION, HaFilm } from "./ha/HaFilm";

export const Root: React.FC = () => (
  <>
    <Composition id="Hello" component={Hello} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="HaItami" component={HaFilm} durationInFrames={HA_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="EdoMedicine" component={EdoFilm} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
  </>
);
