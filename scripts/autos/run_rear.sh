#!/bin/sh
# Rear-angle paint variants for the two models whose rear photograph shows the same car as the front.
cd "$(dirname "$0")"
for p in blu-cepheus verde-mantis bianco-isis nero-noctis; do python3 gen_variants.py revuelto paint $p rear; done
for p in portimao alpine-white sao-paulo toronto-red; do python3 gen_variants.py m4-csl paint $p rear; done
