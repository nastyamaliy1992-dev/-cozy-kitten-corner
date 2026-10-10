#!/usr/bin/env python3
"""Render small game-ready MP4 dance clips from the project's own Luna assets.
Clips are generated in CI so GitHub Pages can serve videos without a video API.
Music is handled by the interactive WebAudio room player (videos are silent).
"""
import math
import subprocess
from pathlib import Path
from PIL import Image, ImageEnhance, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "luna" / "hall"
SCENE = ROOT / "assets" / "rooms" / "dance-final-20261010.webp"
OUTPUT = ROOT / "assets" / "videos"
OUTPUT.mkdir(parents=True, exist_ok=True)
W, H, FPS = 540, 960, 24

background = Image.open(SCENE).convert("RGB")
factor = max(W / background.width, H / background.height)
background = background.resize((round(background.width*factor),
                                round(background.height*factor)), Image.Resampling.LANCZOS)
ox = (background.width-W)//2
oy = (background.height-H)//2
background = background.crop((ox, oy, ox+W, oy+H)).convert("RGBA")
background = ImageEnhance.Contrast(background.convert("RGB")).enhance(1.08).convert("RGBA")

poses = {}
for key, filename in {
    "idle": "luna-main-clean.png",
    "wave": "luna-wave-clean.png",
    "tail": "luna-idle-tail-clean.png"
}.items():
    img = Image.open(SOURCE / filename).convert("RGBA")
    alpha = img.getchannel("A")
    bounds = alpha.getbbox()
    if bounds:
        img = img.crop(bounds)
    height = 426
    img = img.resize((round(img.width*height/img.height),height),
                     Image.Resampling.LANCZOS)
    poses[key] = img

routines = {
  "macarena": {"duration": 8.2, "frames":
      ["wave","idle","wave","tail","idle","wave","tail","wave",
       "idle","wave","tail","idle"], "tempo":110, "shift":34},
  "aram": {"duration": 7.1, "frames":
      ["wave","tail","wave","tail","idle","wave","tail","wave",
       "idle","tail","wave","wave"], "tempo":135, "shift":22},
  "hiphop": {"duration": 7.6, "frames":
      ["tail","wave","idle","tail","wave","tail","wave","idle",
       "wave","tail","wave","wave"], "tempo":98, "shift":51}
}

for title, routine in routines.items():
    path = OUTPUT / (title + ".mp4")
    command = [
      "ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo",
      "-pixel_format", "rgb24", "-video_size", f"{W}x{H}",
      "-framerate", str(FPS), "-i", "-",
      "-an", "-c:v", "libx264", "-preset", "veryfast",
      "-crf", "27", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", str(path)
    ]
    ff = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    count = round(FPS*routine["duration"])
    for i in range(count):
        sec = i/FPS
        frame_index = min(11, int(12*sec/routine["duration"]))
        current = routine["frames"][frame_index]
        cat = poses[current]
        beat = sec*routine["tempo"]/60.0
        horizontal = routine["shift"]*math.sin(beat*math.pi*1.7)
        height = 24*abs(math.sin(beat*math.pi))
        angle = 10*math.sin(beat*math.pi*1.7)
        if title == "hiphop":
            angle *= 1.4
            height *= 1.25
        if title == "aram":
            height *= 1.4
            horizontal *= .5
        tilted = cat.rotate(-angle, Image.Resampling.BICUBIC, expand=True)
        scene = background.copy()
        lights = Image.new("RGBA", (W,H), (0,0,0,0))
        ld = ImageDraw.Draw(lights)
        for j in range(7):
            lx = int(W/2+math.cos(sec*3+j)*135)
            ly = 120+j*42
            rad = 8+round(4*math.sin(sec*4+j))
            rgba = [(200,135,255,65),(106,179,255,60),(255,206,137,65)][j%3]
            ld.ellipse((lx-rad,ly-rad,lx+rad,ly+rad), fill=rgba)
        scene = Image.alpha_composite(scene,lights)
        # All art is floor-anchored, with a full-body silhouette.
        left = round(W/2-tilted.width/2+horizontal)
        top = round(H*.78-tilted.height-height)
        scene.alpha_composite(tilted,(left,top))
        try:
            ff.stdin.write(scene.convert("RGB").tobytes())
        except BrokenPipeError:
            break
    ff.stdin.close()
    error = ff.stderr.read().decode("utf-8",errors="replace")
    if ff.wait():
        raise RuntimeError(f"Video generation failed for {title}: {error}")
    print(f"Created {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")
