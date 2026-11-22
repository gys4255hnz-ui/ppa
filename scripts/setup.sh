#!/usr/bin/env bash
# Re-install the video toolchain in a fresh container. Idempotent.
set -e
cd "$(dirname "$0")/.."
npm install --no-audit --no-fund
pip install -q numpy scipy Pillow matplotlib opencv-python-headless "playwright==$(node -p "require('playwright/package.json').version" 2>/dev/null || echo 1.63.0)" || true
command -v ffmpeg >/dev/null || echo "WARN: ffmpeg not found"
# Optional heavy tools (uncomment as needed):
# git clone --depth 1 https://github.com/storytold/effectcraft.git vendor/effectcraft && (cd vendor/effectcraft && cargo build --release)
# git clone --depth 1 https://github.com/Comfy-Org/ComfyUI.git vendor/ComfyUI   # needs a GPU + torch
echo "setup done"
