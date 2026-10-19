#!/usr/bin/env python3
"""Commons API helper: list files in a category with license metadata.
usage: commons.py cat "Category:Lamborghini Revuelto" | search "query" """
import sys, json, urllib.request, urllib.parse, re
UA = {"User-Agent": "kahaan-portfolio-autos/1.0 (kahaankapasi@gmail.com)"}
API = "https://commons.wikimedia.org/w/api.php"
def api(**p):
    p["format"] = "json"
    url = API + "?" + urllib.parse.urlencode(p)
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA)))
def clean(s): return re.sub(r"<[^>]+>", "", s or "").strip()
def info_for(titles):
    out = []
    for i in range(0, len(titles), 40):
        r = api(action="query", titles="|".join(titles[i:i+40]), prop="imageinfo",
                iiprop="url|size|extmetadata", iiextmetadatafilter="LicenseShortName|Artist|ImageDescription")
        for pg in r["query"]["pages"].values():
            ii = (pg.get("imageinfo") or [None])[0]
            if not ii: continue
            m = ii.get("extmetadata", {})
            out.append((pg["title"], ii["width"], ii["height"], clean(m.get("LicenseShortName", {}).get("value")),
                        clean(m.get("Artist", {}).get("value"))[:50], ii["url"]))
    return out
if __name__ == "__main__":
    mode, q = sys.argv[1], sys.argv[2]
    if mode == "cat":
        titles, cont = [], {}
        while True:
            r = api(action="query", list="categorymembers", cmtitle=q, cmtype="file", cmlimit="200", **cont)
            titles += [m["title"] for m in r["query"]["categorymembers"]]
            if "continue" in r and len(titles) < 400: cont = r["continue"]
            else: break
    else:
        r = api(action="query", list="search", srsearch=q, srnamespace="6", srlimit="40")
        titles = [m["title"] for m in r["query"]["search"]]
    for t in info_for(titles):
        print(" | ".join(str(x) for x in t[:5]))
