#!/usr/bin/env bash
# Re-install the video toolchain in a fresh container. Idempotent; heavy parts are skipped when present.
# Usage: ./scripts/setup.sh            (npm + Python + FFmpeg + Godot + VOICEVOX + bpy)
#        SKIP_HEAVY=1 ./scripts/setup.sh  (npm + light Python only)
set -e
cd "$(dirname "$0")/.."
ROOT="$PWD"
V="$ROOT/vendor"; mkdir -p "$V"
GH=https://github.com

echo "== npm (Remotion, three, gsap, R3F, babylon, motion-canvas, ...)"
npm install --no-audit --no-fund

echo "== system libs"
if command -v apt-get >/dev/null; then
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq libcairo2-dev libpango1.0-dev p7zip-full \
    libxrender1 libxxf86vm1 libxfixes3 libxi6 libxkbcommon0 libsm6 libgl1 >/dev/null 2>&1 || true
fi

echo "== Python venv (.venv, 3.12): librosa, faster-whisper, manim, kokoro-onnx"
[ -x .venv/bin/python ] || uv venv -q .venv --python 3.12
uv pip install -q --python .venv/bin/python librosa==1.0.1 faster-whisper==1.2.1 manim==0.22.1 \
  kokoro-onnx soundfile numpy scipy Pillow matplotlib opencv-python-headless
# hyperframes tts looks for kokoro here
pip install -q kokoro-onnx soundfile 2>/dev/null || true

[ -n "$SKIP_HEAVY" ] && { echo "SKIP_HEAVY set: done"; exit 0; }

echo "== torch 2.8.0 + torchaudio + torchvision + whisperx (PyPI build; CPU index is blocked here)"
uv pip install -q --python .venv/bin/python torch==2.8.0 torchaudio==2.8.0 torchvision==0.23.0 whisperx==3.8.6

echo "== FFmpeg 8.1 (BtbN static build) -> /usr/local/bin"
if [ ! -x "$V/ffmpeg/bin/ffmpeg" ]; then
  mkdir -p "$V/ffmpeg" && curl -sL "$GH/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n8.1-latest-linux64-gpl-8.1.tar.xz" \
    | tar xJ --strip-components=1 -C "$V/ffmpeg"
fi
ln -sf "$V/ffmpeg/bin/ffmpeg" /usr/local/bin/ffmpeg; ln -sf "$V/ffmpeg/bin/ffprobe" /usr/local/bin/ffprobe

echo "== Godot 4.7.2"
if [ ! -x "$V/godot/Godot_v4.7.2-stable_linux.x86_64" ]; then
  mkdir -p "$V/godot" && curl -sL -o "$V/godot/g.zip" "$GH/godotengine/godot/releases/download/4.7.2-stable/Godot_v4.7.2-stable_linux.x86_64.zip" \
    && unzip -qo "$V/godot/g.zip" -d "$V/godot" && rm "$V/godot/g.zip"
fi

echo "== VOICEVOX ENGINE 0.26.2 (CPU)"
if [ ! -x "$V/voicevox/linux-cpu-x64/run" ]; then
  mkdir -p "$V/voicevox" && cd "$V/voicevox"
  i=1; while :; do n=$(printf '%03d' $i)
    code=$(curl -sL -o part.$n -w '%{http_code}' "$GH/VOICEVOX/voicevox_engine/releases/download/0.26.2/voicevox_engine-linux-cpu-x64-0.26.2.7z.$n")
    [ "$code" = 200 ] || { rm -f part.$n; break; }; i=$((i+1)); done
  cat part.* > e.7z && 7z x -y e.7z >/dev/null && rm part.* e.7z; cd "$ROOT"
fi

echo "== Blender as Python module (bpy 4.2.0, Python 3.11)"
if [ ! -x "$V/blender-venv/bin/python" ]; then
  uv venv -q "$V/blender-venv" --python 3.11
  uv pip install -q --python "$V/blender-venv/bin/python" bpy==4.2.0
fi

echo "setup done"
