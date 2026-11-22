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

## Libraries (npm)
remotion 4, gsap, three, hyperframes, huashu-motion.

## Commands
- `npx remotion studio` — preview; `npx remotion render <Comp> out/x.mp4` — render
- `npx hyperframes ...`, `npx huashu-motion ...`
- Output goes to `out/` (git-ignored).

## Blender MCP
`.mcp.json` registers `uvx blender-mcp`. It only works where Blender runs with the
add-on (`addon.py` from github.com/ahujasid/mcp-for-blender), i.e. on your own machine.

## Not installable here (desktop apps / GPU)
OpenScreen (screen recorder app), Open Design (desktop workspace), ComfyUI (needs GPU and torch;
download.pytorch.org is blocked in this environment), Blender itself.
