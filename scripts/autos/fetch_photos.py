#!/usr/bin/env python3
"""Download selected Commons images (2400px thumbs) and write photos-manifest.json with license metadata.
usage: fetch_photos.py <raw_dir>"""
import sys, json, os, urllib.request, re
sys.path.insert(0, os.path.dirname(__file__))
from commons import api, UA, clean
raw = sys.argv[1]; os.makedirs(raw, exist_ok=True)
sel = json.load(open(os.path.join(os.path.dirname(__file__), "selection.json")))
manifest = {}
for model, shots in sel.items():
    for angle, fname in shots:
        title = "File:" + fname
        r = api(action="query", titles=title, prop="imageinfo", iiprop="url|size|extmetadata", iiurlwidth="2400")
        pg = list(r["query"]["pages"].values())[0]; ii = pg["imageinfo"][0]; m = ii["extmetadata"]
        g = lambda k: clean(m.get(k, {}).get("value"))
        entry = dict(model=model, angle=angle, title=fname, author=g("Artist"), license=g("LicenseShortName"),
                     license_url=g("LicenseUrl"), source=ii["descriptionurl"], orig_size=[ii["width"], ii["height"]])
        path = os.path.join(raw, f"{model}__{angle}.jpg")
        url = ii.get("thumburl") or ii["url"]
        open(path, "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read())
        manifest[f"{model}/{angle}"] = entry
        print(model, angle, entry["license"], "|", entry["author"])
json.dump(manifest, open(os.path.join(os.path.dirname(__file__), "photos-manifest.json"), "w"), indent=1)
