#!/usr/bin/env python3
"""Generate Luna's word-free, original dance MP4 for GitHub Pages.

Renders moving whole-body art across the floor at 20 fps, without song names,
and an original electronic instrumental. The game plays the MP4 muted and uses
the already-configurable room audio instead.
"""
from __future__ import annotations
import math
import subprocess
import wave
from array import array
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
W, H, FPS, DURATION, BPM = 432, 768, 20, 9.15, 118
OUT = ROOT / "assets/videos/luna-dance.mp4"
ART = ROOT / "assets/luna/hall"
SPRITES = [
    "luna-main-clean.png", "luna-wave-clean.png",
    "luna-idle-tail-clean.png", "luna-idle-blink-clean.png"
]
DANCE_BG = ROOT / "assets/rooms/dance-final-20261010.webp"


def prepare_sprites():
    prepared = []
    for name in SPRITES:
        image = Image.open(ART / name).convert("RGBA")
        bounds = image.getchannel("A").getbbox()
        if not bounds:
            raise RuntimeError(f"Invisible Luna sprite: {name}")
        image = image.crop(bounds)
        image.thumbnail((252, 282), Image.Resampling.LANCZOS)
        stage = Image.new("RGBA", (348, 378), (0, 0, 0, 0))
        stage.alpha_composite(image, (174 - image.width // 2, 335 - image.height))
        prepared.append(stage)
    return prepared


def draw_frame(t, background, artwork):
    beat = t * BPM / 60
    x = W * 0.50 + 49 * math.sin(beat * 0.76) + 12 * math.sin(beat * 1.97)
    bounce = 10 * max(0, math.sin(beat * math.pi))
    if int(t / 1.64) % 3 == 1:
        bounce += 31 * max(0, math.sin((t % 1.64) / 1.64 * math.pi))
    lean = 10 * math.sin(beat * 1.18) + 3 * math.sin(beat * 2.1)
    floor_y = int(H * 0.725)
    frame = background.copy().convert("RGBA")
    light = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    painter = ImageDraw.Draw(light)
    painter.ellipse((int(x - 80), floor_y + 6, int(x + 80), floor_y + 30),
                    fill=(20, 11, 25, 62))
    for n in range(3):
        spot_x = int(W * (0.20 + n * 0.30) + 14 * math.sin(t * 1.6 + n))
        painter.ellipse((spot_x - 31, H - 148, spot_x + 31, H - 118),
                        fill=((176, 128, 255, 19) if n % 2 else (255, 223, 160, 16)))
    frame = Image.alpha_composite(frame, light)
    pose_index = [0, 1, 2, 1, 3, 0, 2, 1][int(beat * 1.1) % 8]
    kitty = artwork[pose_index].rotate(
        lean, Image.Resampling.BICUBIC, center=(174, 335), expand=False
    )
    frame.alpha_composite(kitty, (int(x - 174), int(floor_y - 335 - bounce)))
    return frame.convert("RGB")


def make_original_music(path):
    rate = 22050
    melody = [392, 523.25, 587.33, 523.25, 440, 587.33, 659.25, 523.25]
    raw = array("h")
    for i in range(int(DURATION * rate)):
        t = i / rate
        beat = t * BPM / 60
        phase = beat % 1
        pitch = melody[int(beat * 2) % len(melody)]
        attack = min(1, (phase + 0.001) * 18)
        lead = (
            math.sin(2 * math.pi * pitch * t) * 0.13
            + math.sin(2 * math.pi * pitch * 2 * t) * 0.032
        ) * attack
        bass = 0.14 * math.sin(2 * math.pi * (pitch / 4) * t)
        kick = (0.28 * math.exp(-28 * phase)
                * math.sin(2 * math.pi * (68 - 24 * phase) * t))
        hat = (0.042 * math.exp(-44 * ((beat * 2) % 1))
               * math.sin(2 * math.pi * 5300 * t))
        sample = max(-0.95, min(0.95, lead + bass + kick + hat))
        raw.append(int(32767 * sample))
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(raw.tobytes())


def main():
    for file in [DANCE_BG, *(ART / name for name in SPRITES)]:
        if not file.is_file():
            raise FileNotFoundError(file)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    background = ImageOps.fit(
        Image.open(DANCE_BG).convert("RGB"), (W, H),
        method=Image.Resampling.LANCZOS, centering=(0.5, 0.48)
    )
    artwork = prepare_sprites()
    music = OUT.parent / ".dance-audio.wav"
    make_original_music(music)
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s:v", f"{W}x{H}",
        "-r", str(FPS), "-i", "pipe:0", "-i", str(music),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
        "-t", f"{DURATION:.2f}", "-movflags", "+faststart", str(OUT)
    ]
    process = subprocess.Popen(
        command, stdin=subprocess.PIPE, stderr=subprocess.PIPE
    )
    try:
        for i in range(round(DURATION * FPS)):
            process.stdin.write(
                draw_frame(i / FPS, background, artwork).tobytes()
            )
    except BrokenPipeError as exc:
        raise RuntimeError("Video encoder closed unexpectedly") from exc
    finally:
        process.stdin.close()
    stderr = process.stderr.read().decode("utf-8", "replace")
    code = process.wait()
    music.unlink(missing_ok=True)
    if code:
        raise RuntimeError(f"ffmpeg exited with {code}: {stderr}")
    print(f"Created {OUT.relative_to(ROOT)}: {OUT.stat().st_size} bytes")


if __name__ == "__main__":
    main()
