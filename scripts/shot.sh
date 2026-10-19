#!/bin/sh
# Usage: scripts/shot.sh <url> <width> <height> <out.png> [budget_ms]
# Headless Chrome screenshot (uses SwiftShader WebGL). Separate profile per call.
URL="$1"; W="$2"; H="$3"; OUT="$4"; BUDGET="${5:-6000}"
PROFILE="$(mktemp -d "${TMPDIR:-/tmp}/kkshot.XXXXXX")"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader \
  --hide-scrollbars --no-first-run --no-default-browser-check --user-data-dir="$PROFILE" \
  --window-size="$W,$H" --virtual-time-budget="$BUDGET" --screenshot="$OUT" "$URL" >/dev/null 2>&1
rm -rf "$PROFILE"
[ -f "$OUT" ] && echo "saved $OUT" || echo "FAILED $OUT"
