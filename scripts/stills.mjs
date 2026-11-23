// Render many stills with a single bundle: node scripts/stills.mjs outDir Comp:f1,f2 Comp2:f3 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [outDir, ...specs] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const spec of specs) {
  const [id, frames] = spec.split(":");
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  for (const f of frames.split(",")) {
    const frame = Math.min(Number(f), composition.durationInFrames - 1);
    await renderStill({ serveUrl, composition, frame, output: `${outDir}/${id}-${String(frame).padStart(5, "0")}.png`, scale: 0.25, browserExecutable });
  }
  console.log("done", id);
}
