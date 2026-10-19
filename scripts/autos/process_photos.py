#!/usr/bin/env python3
"""Crop raw Commons photos to 16:9, resize to 1600px wide, write WebP (+800w) into public/concepts/autos/photos/<model>/<angle>.webp
usage: process_photos.py <raw_dir>   (crop focus tweaks in FOCUS: (x_frac, y_frac) of the free space)"""
import sys, os, subprocess
from PIL import Image
raw = sys.argv[1]
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "concepts", "autos", "photos"))
FOCUS = {"revuelto__front": (0.5, 1.0), "m4-csl__rear": (0.5, 0.8)}
for f in sorted(os.listdir(raw)):
    if not f.endswith(".jpg"): continue
    key = f[:-4]; model, angle = key.split("__")
    im = Image.open(os.path.join(raw, f)).convert("RGB"); w, h = im.size
    tw = 16 / 9
    if w / h > tw: nw, nh = round(h * tw), h
    else: nw, nh = w, round(w / tw)
    fx, fy = FOCUS.get(key, (0.5, 0.5))
    x, y = round((w - nw) * fx), round((h - nh) * fy)
    im = im.crop((x, y, x + nw, y + nh))
    os.makedirs(os.path.join(root, model), exist_ok=True)
    for width, suffix in ((1600, ""), (800, "-800")):
        out = im.resize((width, round(width / tw)), Image.LANCZOS)
        tmp = os.path.join(raw, "_t.png"); out.save(tmp)
        dst = os.path.join(root, model, f"{angle}{suffix}.webp")
        subprocess.run(["cwebp", "-q", "80", "-m", "5", tmp, "-o", dst], check=True, capture_output=True)
    print(model, angle, (w, h), "->crop", (nw, nh))
