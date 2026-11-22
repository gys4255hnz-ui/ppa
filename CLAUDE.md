# AI video studio

**返事はいつも日本語で。専門用語は使わず、わかりやすい言葉で説明すること。**

Pipeline: topic → script → motion → score → export (MP4 via FFmpeg).

## Setup in a fresh container
`./scripts/setup.sh` (npm packages + Python deps). Remotion uses the preinstalled Chromium (see `remotion.config.ts`).

## Skills (`.claude/skills/`)
| Purpose | Skill |
|---|---|
| Launch film with its own score | `huashu-motion` (CLI: `npx huashu-motion`) |
| Topic → narrated explainer (Remotion) | `anything2explainer` |
| One continuous camera move | `onetake` (needs Python: numpy, scipy, Pillow, matplotlib, opencv, playwright) |
| 99 film looks | `lemo-opuscar` (fetches its library to `~/lemo-opuscar` on first use) |
| HTML → video | `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `slideshow`, `media-use`, `style-sampling`, `reverse-any-video`, `figma`, `remotion-to-hyperframes` |
| Remotion (official) | `remotion-*` |
| Polish / taste / no AI look | `impeccable`, `taste-skill`, `hallmark` |

## ツール（`./scripts/setup.sh` で入る。vendor/ と .venv/ は git 管理外）
| 種類 | 中身 | 使い方 |
|---|---|---|
| 動画 | Remotion 4.0.545（+ @remotion/three） | `npx remotion render <Comp> out/x.mp4` |
| ゲームエンジン | Godot 4.7.2 | `vendor/godot/Godot_v4.7.2-stable_linux.x86_64 --headless` |
| 3D | Blender 4.2.9 本体 | `vendor/blender/blender -b file.blend --python script.py` |
| 3D（予備） | bpy 4.2.0（Pythonモジュール） | `vendor/blender-venv/bin/python script.py` |
| 書き出し | FFmpeg 8.1（/usr/local/bin） | `ffmpeg ...` |
| 日本語音声 | VOICEVOX ENGINE 0.26.2（CPU） | `vendor/voicevox/linux-cpu-x64/run --port 50021` → `/audio_query` → `/synthesis` |
| 英語ほか音声 | Kokoro（hyperframes tts） | 日本語は漢字を読み違えるので VOICEVOX を使う |
| ブラウザ | 公式 Chrome（展開済み）/ Playwright 同梱 Chromium | `vendor/chrome/opt/google/chrome/chrome --headless --no-sandbox` / `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` |
| 素材検索 | Openverse API | `curl "https://api.openverse.org/v1/audio/?q=wind"`（実ファイルは freesound 等の別ホスト。必要なら許可を追加） |

npm: three, gsap, @dimforge/rapier3d-compat, three.quarks, motion, tweakpane, lottie-web, react 19.3,
@react-three/fiber/drei/rapier/postprocessing, postprocessing, @motion-canvas/core/2d, ola, animejs, shifty,
two.js, @createjs/tweenjs, lume（classy-solid を 0.4.3 に固定）, gifenc, konva, @babylonjs/core, proton-engine, playwright-core, hyperframes, huashu-motion。
motion-canvas は Vite 経由、shifty / tweenjs / lume はブラウザ内でのみ動く。

Python（`.venv/bin/python`, 3.12）: librosa, faster-whisper, whisperx, manim, torch 2.8.0+cpu / torchaudio / torchvision, triton 3.4.0
（torch 2.8.0 が triton 3.4.0 を要求するため 3.9.0 ではない）。

参考スキル（`.claude/skills/`）: motion-design（LottieFiles）, hairline-create / hairline-adopt, anatomy, anatomy-reveal, remotion-*。

## Commands
- `npx remotion studio` — preview; `npx remotion render <Comp> out/x.mp4` — render
- `npx hyperframes ...`, `npx huashu-motion ...`
- Output goes to `out/` (git-ignored).

## Blender MCP
`.mcp.json` registers `uvx blender-mcp`. It only works where Blender runs with the
add-on (`addon.py` from github.com/ahujasid/mcp-for-blender), i.e. on your own machine.

## ネットワーク
クラウド環境「ppa」で download.blender.org, dl.google.com, api.openverse.org, download.pytorch.org, download-r2.pytorch.org を許可済み。

## この環境で入らないもの
OpenScreen / Open Design（デスクトップアプリ）、ComfyUI（GPU が必要）。
