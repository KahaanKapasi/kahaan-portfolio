#!/usr/bin/env python3
"""Generate option variants from the base photos with Gemini image editing, with a hard spend cap.

The API key is read at runtime from Content Studio's env file (only the GEMINI_API_KEY line, in this process),
sent as a request header, and never printed, logged or written anywhere.

usage:
  gen_variants.py <model> paint <paint-id> [angle]     one paint variant
  gen_variants.py <model> wheel [angle]                one wheel variant
  gen_variants.py all                                  everything in variants.json not yet generated (front angle)
"""
import sys, os, io, json, base64, time, subprocess, urllib.request, urllib.error
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
PHOTOS = os.path.join(ROOT, "public/concepts/autos/photos")
OUT = os.path.join(ROOT, "public/concepts/autos/variants")
LEDGER = os.path.join(HERE, "ledger.json")
ENV_FILE = "/Users/kk/Desktop/studio-de-content/.env"
MODEL = "gemini-3.1-flash-image-preview"   # Content Studio's GEMINI_IMAGE_MODEL default
PRICE = 0.067                               # USD per 1K image (Content Studio costs/prices.py), also charged for failures
CAP = 3.00
RAW_DIR = os.environ.get("AUTOS_RAW_DIR", "")

def key():
    for line in open(ENV_FILE):
        if line.startswith("GEMINI_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("GEMINI_API_KEY not found")

def ledger():
    if os.path.exists(LEDGER): return json.load(open(LEDGER))
    return {"model": MODEL, "price_per_image_usd": PRICE, "cap_usd": CAP, "calls": 0, "images_ok": 0, "failed": 0, "estimated_cost_usd": 0.0, "log": []}

def save_ledger(l):
    l["estimated_cost_usd"] = round(l["calls"] * PRICE, 3)
    json.dump(l, open(LEDGER, "w"), indent=1)

def call(prompt, img_path, aspect="16:9"):
    l = ledger()
    if (l["calls"] + 1) * PRICE > CAP + 1e-9:
        sys.exit(f"CAP REACHED: {l['calls']} calls, ~${l['calls']*PRICE:.2f}")
    # count the call before sending (failures and unusable results also count against the cap)
    l["calls"] += 1; save_ledger(l)
    data = base64.b64encode(open(img_path, "rb").read()).decode()
    body = {"contents": [{"parts": [{"text": prompt}, {"inline_data": {"mime_type": "image/png", "data": data}}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key()})
    status, result = "ok", None
    try:
        r = json.load(urllib.request.urlopen(req, timeout=180))
        for c in r.get("candidates", []):
            for p in (c.get("content") or {}).get("parts", []):
                d = p.get("inlineData") or p.get("inline_data")
                if d and d.get("data"): result = base64.b64decode(d["data"])
        if result is None: status = "no-image: " + str(r.get("promptFeedback") or [c.get("finishReason") for c in r.get("candidates", [])])[:200]
    except urllib.error.HTTPError as e:
        status = f"http {e.code}: " + e.read().decode()[:300]
    except Exception as e:
        status = f"error {type(e).__name__}"
    l = ledger()
    if result: l["images_ok"] += 1
    else: l["failed"] += 1
    l["log"].append({"t": int(time.time()), "prompt": prompt[:90], "status": status})
    save_ledger(l)
    if result is None: print("FAILED:", status); return None
    return Image.open(io.BytesIO(result)).convert("RGB")

def prompt_for(kind, model, spec, desc_name):
    keep = ("Edit this photograph. Keep the framing, crop, camera angle, perspective, background, floor, lighting direction, shadows, "
            "reflections of the environment, the car's exact shape and proportions, badges, lettering, glass, tyres and every other detail IDENTICAL to the input. "
            "Do not add or remove anything. Do not change the aspect ratio or zoom. The result must look like a real unretouched photograph of the same car at the same moment. ")
    if kind == "paint":
        return keep + (f"Change ONLY the car's body paint colour to {spec['name']}: {spec['desc']}. Use a realistic factory-finish with natural clear-coat highlights and reflections "
                       "that follow the original lighting. Black carbon/trim, windows, grille, wheels, brake calipers, tyres and badges keep their original colours.")
    return keep + (f"Change ONLY the wheels: give them a {spec['desc']} (finish name: {spec['name']}). Keep the original wheel size and spoke design, tyres, brake discs and calipers. "
                   "Every other part of the image, including the paint colour, remains exactly as in the input.")

def run(model, kind, spec, angle="front", out_name=None):
    cfg = json.load(open(os.path.join(HERE, "variants.json")))[model]
    src = Image.open(os.path.join(PHOTOS, model, f"{angle}.webp")).convert("RGB")
    tmp = os.path.join(RAW_DIR or "/tmp", f"_src_{model}_{angle}.png"); src.save(tmp)
    oid = out_name or (spec["id"] if kind == "wheel" else None)
    dest_dir = os.path.join(OUT, model); os.makedirs(dest_dir, exist_ok=True)
    img = call(prompt_for(kind, model, spec, spec["name"]), tmp)
    if img is None: return False
    if RAW_DIR: img.save(os.path.join(RAW_DIR, f"{model}__{oid}__{angle}.png"))
    fin = img.resize((1600, 900), Image.LANCZOS)
    for width, suffix in ((1600, ""), (800, "-800")):
        t = os.path.join(RAW_DIR or "/tmp", "_o.png"); fin.resize((width, round(width * 9 / 16)), Image.LANCZOS).save(t)
        subprocess.run(["cwebp", "-q", "80", "-m", "5", t, "-o", os.path.join(dest_dir, f"{oid}{suffix}.webp")], check=True, capture_output=True)
    print("saved", model, oid, "size", img.size)
    return True

if __name__ == "__main__":
    a = sys.argv[1:]
    cfgs = json.load(open(os.path.join(HERE, "variants.json")))
    if a[0] == "all":
        for model, cfg in cfgs.items():
            for pid, spec in cfg["paints"].items():
                if os.path.exists(os.path.join(OUT, model, f"{pid}.webp")): continue
                run(model, "paint", spec, out_name=pid)
    else:
        model, kind = a[0], a[1]
        cfg = cfgs[model]
        if kind == "paint":
            ang = a[3] if len(a) > 3 else "front"
            run(model, "paint", cfg["paints"][a[2]], ang, out_name=a[2] + ("__rear" if ang == "rear" else ""))
        else: run(model, "wheel", cfg["wheel"], a[2] if len(a) > 2 else "front")
