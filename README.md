# Kahaan Kapasi, portfolio

Freelance portfolio for Kahaan Kapasi (web developer for business sites, catalogues with an editable CMS, real-time web apps and interactive 3D). One Vite + React + TypeScript single-page app: a home page, eight real-work case studies and four clearly labelled concept builds, each with its own visual world.

Positioning and constraints live in `PRODUCT.md`; the original build brief is `BRIEF.md`; per-agent build notes and QA results are in `HANDOFF.md`; the design system is in `DESIGN.md`; hosting steps are in `DEPLOY.md`.

## Stack

- Vite 7, React 19, TypeScript, `react-router-dom` 7 with lazy routes
- three.js through `@react-three/fiber` and `@react-three/drei` (plus `postprocessing` on Footonomy only)
- `framer-motion` for page transitions and reveals
- Fonts self-hosted through `@fontsource` packages (no external font requests)
- No backend, no environment variables, no analytics

## Commands

```bash
npm install          # first time only
npm run dev          # dev server on http://localhost:5173
npm run build        # tsc -b, then vite build into dist/
npm run preview      # serve dist/ on http://localhost:4173
npm run typecheck    # tsc -b only
```

Append `?static` to any URL to force the non-WebGL fallbacks (the same path used for no-WebGL and `prefers-reduced-motion` visitors), for example `/?static` or `/concepts/footonomy?static`.

## Route map

| Route | What it is |
| --- | --- |
| `/` | Home: WebGL name hero, credibility strip, selected work, concept carousel, experience, services, process, stack, contact |
| `/work/flippr-app` | Flippr mobile app: interactive microservice architecture board |
| `/work/flippr-live` | flippr.live marketing site case study: real screenshots plus a click-to-load iframe with fallback |
| `/work/auction-flippr-live` | Live cricket player-auction platform |
| `/work/madridonomy` | madridonomy.com news / stats / games site with admin CMS and AI pipeline |
| `/work/madridonomy-store` | Madridonomy Store: custom Shopify theme (`/work/storemad` redirects here) |
| `/work/footonomy` | Footonomy football companion app, with its games service (team academic project) |
| `/work/content-studio` | Content Studio: module and pipeline write-up, with a sanitised mock |
| `/work/chatspace` | ChatSpace real-time team chat, with an interactive mock |
| `/concepts/footonomy` | Concept: football showpiece (stadium fly-through, 3D players, free-kick game, tactics board, matchday) |
| `/concepts/autos` | Concept: multi-brand car showroom and configurator (`/concepts/autos/model/:slug` for model pages) |
| `/concepts/architecture` | Concept: Aldermoor Studio, architecture and interiors |
| `/concepts/fintech` | Concept: Quayline, multi-currency banking and trade finance |
| `*` | 404 page |

Concept builds are fictional or unofficial and carry a `ConceptStrip` disclaimer; they are never presented as client work.

## Folder structure

```
index.html               meta, canonical, Open Graph, night-colour first paint
vercel.json              SPA rewrite, storemad redirect, cache headers (/assets immutable, images 1 day)
vite.config.ts           vendor chunking (three / r3f / drei / postfx / motion / router / react)
src/
  main.tsx, App.tsx      router, lazy route loaders, page transition (cross-fade + bar wipe)
  base.css               resets
  shared/                site-wide pieces: world.css tokens, SiteNav, Reveal, ConceptStrip,
                         WebGL gate (webgl.tsx), NotFound, contact.ts, meta.ts
  home/                  landing page (Hero + scene/, Work, Experience, Rest, concepts/ carousel art)
  work/
    _shared/             CaseLayout, parts (frames, figures, rows), Lightbox, case.css, cases.ts registry
    <case>/              one folder per case study (index.tsx + its own css / mocks)
  concepts/
    football/ autos/ architecture/ fintech/    one visual world each, own css and scenes
public/
  home/                  favicon, og.png, minetree.webp
  work/                  case-study screenshots and thumbs
  concepts/              assets for concept builds (CREDITS.md in autos)
docs/                    INSPIRATION.md, screens/ (empty)
scripts/shot.sh          screenshot helper
```

## Adding a case study

1. Create `src/work/<slug>/index.tsx` that renders `CaseLayout` from `src/work/_shared`.
2. Register it in `src/work/_shared/cases.ts` (name, blurb; the array order drives the previous and next links).
3. Add its loader to `loaders` and `PATH_LOADER` in `src/App.tsx`, and a row in `CASES` in `src/home/data.ts`.

## Performance notes

- The initial `/` payload is the entry chunk plus `react`, `router` and `motion` vendor chunks (about 450 kB raw, about 150 kB gzipped). three.js, r3f, drei and postprocessing load only when a WebGL route or scene is reached.
- Keep Vite's preload helper out of the three.js chunks (see `manualChunks` in `vite.config.ts`); otherwise the entry statically imports three.js and every visit pays about 750 kB.
- Every WebGL scene is lazy, caps DPR at 1.5, pauses off-screen and has a static fallback.
