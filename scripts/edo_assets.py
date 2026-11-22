"""Generate paper texture, koto-like BGM and a whoosh SFX for the Edo test film."""
import numpy as np, wave, sys
from PIL import Image, ImageFilter

out = sys.argv[1]
rng = np.random.default_rng(7)

# --- paper grain (multiply overlay) ---
W, H = 1920, 1080
n = rng.normal(0, 1, (H // 2, W // 2))
img = Image.fromarray(np.uint8(np.clip(128 + n * 40, 0, 255))).resize((W, H), Image.BICUBIC)
fine = Image.fromarray(np.uint8(np.clip(128 + rng.normal(0, 1, (H, W)) * 25, 0, 255)))
blotch = Image.fromarray(np.uint8(np.clip(128 + rng.normal(0, 1, (27, 48)) * 60, 0, 255))).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
a = (np.asarray(img, float) * 0.35 + np.asarray(fine, float) * 0.35 + np.asarray(blotch, float) * 0.3)
a = 235 + (a - 128) * 0.35
Image.fromarray(np.uint8(np.clip(a, 0, 255))).save(f"{out}/paper.png")

SR = 44100
def write(path, x):
    x = np.clip(x, -1, 1)
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())

def pluck(freq, dur, bright=0.5):
    N = int(SR / freq)
    buf = rng.uniform(-1, 1, N)
    out_ = np.zeros(int(SR * dur))
    for i in range(len(out_)):
        out_[i] = buf[i % N]
        buf[i % N] = 0.996 * (bright * buf[i % N] + (1 - bright) * buf[(i + 1) % N])
    env = np.exp(-np.linspace(0, 4, len(out_)))
    return out_ * env

# --- koto-like BGM, miyako-bushi on D ---
T = float(sys.argv[2]) if len(sys.argv) > 2 else 31.5
bgm = np.zeros(int(SR * T))
D4 = 293.66
scale = [1, 16/15, 4/3, 3/2, 8/5, 2, 32/15, 8/3]
pattern = [0, 2, 3, 5, 4, 3, 2, None, 3, 5, 6, 5, 4, 3, 1, 0, None, 2, 3, 4, 3, 2, 0, None]
t = 0.6; k = 0
while t < T - 2:
    p = pattern[k % len(pattern)]
    if p is not None:
        s = pluck(D4 * scale[p], 2.2, 0.55)
        i = int(t * SR); bgm[i:i + len(s)] += s[: len(bgm) - i] * 0.5
    t += 0.62 if k % 4 != 3 else 0.95
    k += 1
tt = np.arange(len(bgm)) / SR
drone = (np.sin(2 * np.pi * 73.4 * tt) * 0.06 + np.sin(2 * np.pi * 110.0 * tt) * 0.03) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * tt))
bgm += drone
fade = np.minimum(1, np.minimum(tt / 1.5, (T - tt) / 2.5))
bgm *= np.clip(fade, 0, 1)
bgm /= np.abs(bgm).max() + 1e-9
write(f"{out}/bgm.wav", bgm * 0.8)

# --- whoosh ---
d = 0.9
noise = rng.normal(0, 1, int(SR * d))
spec = np.fft.rfft(noise); f = np.fft.rfftfreq(len(noise), 1 / SR)
spec *= np.exp(-((f - 900) / 700) ** 2) + 0.3 * np.exp(-((f - 2500) / 1500) ** 2)
w = np.fft.irfft(spec)
e = np.sin(np.pi * np.linspace(0, 1, len(w))) ** 2
w = w * e; w /= np.abs(w).max()
write(f"{out}/whoosh.wav", w * 0.6)
print("ok")
