#!/usr/bin/env python3
"""Contact sheet of Commons thumbs. usage: sheet.py out.png "File:A.jpg" "File:B.jpg" ..."""
import sys, io, urllib.request, urllib.parse
from PIL import Image, ImageDraw
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from commons import api, UA
out, titles = sys.argv[1], sys.argv[2:]
cell_w, cell_h, cols = 480, 300, 4
rows = (len(titles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "#222")
d = ImageDraw.Draw(sheet)
r = api(action="query", titles="|".join(titles), prop="imageinfo", iiprop="url", iiurlwidth="480")
by = {p["title"]: p["imageinfo"][0]["thumburl"] for p in r["query"]["pages"].values() if "imageinfo" in p}
for i, t in enumerate(titles):
    x, y = (i % cols) * cell_w, (i // cols) * cell_h
    try:
        data = urllib.request.urlopen(urllib.request.Request(by[t], headers=UA)).read()
        im = Image.open(io.BytesIO(data)).convert("RGB"); im.thumbnail((cell_w, cell_h - 14))
        sheet.paste(im, (x, y + 14))
    except Exception as e:
        d.text((x + 4, y + 20), f"ERR {e}", fill="red")
    d.text((x + 3, y + 1), f"{i}: {t[5:50]}", fill="white")
sheet.save(out)
