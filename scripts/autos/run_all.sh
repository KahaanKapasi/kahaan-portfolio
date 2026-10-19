#!/bin/sh
# Runs the full batch: remaining paints, then one wheel variant per model. The key is read inside gen_variants.py only.
cd "$(dirname "$0")"
python3 gen_variants.py all
for m in revuelto huracan-sto 911-gt3 taycan-turbo m4-csl i5-m60; do python3 gen_variants.py $m wheel; done
