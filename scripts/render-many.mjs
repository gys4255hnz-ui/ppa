// Render several compositions from one bundle: node scripts/render-many.mjs outDir Comp1 Comp2 ...
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [outDir, ...ids] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const t0 = Date.now();
  await renderMedia({ serveUrl, composition, codec: "h264", outputLocation: `${outDir}/${id}.mp4`, concurrency: 4, browserExecutable });
  console.log("rendered", id, Math.round((Date.now() - t0) / 1000) + "s");
}
