# Design system

Derived from the shipped code: `src/shared/world.css` (tokens), `src/shared/site-nav.css`, `src/home/home.css` and `src/work/_shared/case.css`. This covers the portfolio's own world (Home, the floating nav, the eight case studies, 404). The four concept builds each keep their own palette, type and CSS and deliberately do not read these tokens.

The world is a night fabrication shop: a near-black charcoal ground, warm off-white ink, hairline rules, one accent used sparingly (amber by default, visitor-selectable), and display type that is condensed and blunt. Confident and honest, never decorative.

## Tokens (`:root` in `world.css`)

Colour

| Token | Value | Use |
| --- | --- | --- |
| `--k-bg` | `#101214` | Page ground |
| `--k-bg-2` | `#171a1e` | Raised surface |
| `--k-bg-3` | `#1e2328` | Highest surface, inputs |
| `--k-ink` | `#eef1ea` | Primary text, headings |
| `--k-mute` | `#b7bcb3` | Secondary text (about 9:1 on `--k-bg`) |
| `--k-faint` | `#8d928a` | Tertiary text, captions (about 5.5:1) |
| `--k-line` | ink at 14% | Hairline rules |
| `--k-line-2` | ink at 26% | Stronger rules, ghost button borders |
| `--k-accent` | `#e8a317` (amber, default; see the accent table) | The one accent: primary buttons, active states, focus ring, selection, key figures |
| `--k-accent-ink` | `#1a1204` | Text on the accent |
| `--k-accent-hi` | `#f2b94a` | Hover tint of a solid accent button |
| `--k-accent-rgb` | `232 163 23` | Channels for alpha tints: `rgb(var(--k-accent-rgb) / 0.5)` (timeline glow) |

### Accent themes

The accent is a token, not a literal, and the visitor chooses it. The four sets live in `src/shared/shared.css` (`:root[data-accent=...]`, loaded on every route). Each pair clears AA: the accent as text on `--k-bg`, `--k-bg-2` and `--k-bg-3`, and the ink on the accent.

| Accent (`data-accent`) | `--k-accent` | `--k-accent-ink` | `--k-accent-hi` | Accent on bg / bg-2 / bg-3 | Ink on accent |
| --- | --- | --- | --- | --- | --- |
| Amber (`amber`, default) | `#e8a317` | `#1a1204` | `#f2b94a` | 8.7 / 8.1 / 7.3 | 8.6 |
| Electric blue (`blue`) | `#4f8dff` | `#06101f` | `#7aa8ff` | 5.9 / 5.5 / 5.0 | 6.0 |
| Mono (`mono`) | `#ebe5d6` | `#16140f` | `#fbf7ea` | 14.9 / 13.9 / 12.6 | 14.7 |
| Signal red (`red`) | `#ff4a3d` | `#1f0705` | `#ff7a6e` | 5.6 / 5.2 / 4.8 | 5.8 |

Mono has no hue: the warm off-white accent sits next to the ink (`#eef1ea`), so accent states read by weight, underline and fill rather than colour. Use `var(--k-accent)`, `var(--k-accent-ink)`, `var(--k-accent-hi)` and `var(--k-accent-rgb)` everywhere and never a hex or `rgb(214 255 74 / ...)` literal. If you add an accent, check it against all three grounds before adding it to the table.

**Picker** (`src/shared/AccentPicker.tsx`, `accent.ts`, `accent.css`): a footer control in the Home footer and the shared case-study footer, labelled "Accent colour". It is a `role="radiogroup"` of four native radio inputs drawn as 44px pills (swatch dot plus name), so arrow keys, focus and screen-reader state come from the browser; focus shows the accent ring. Choosing writes `document.documentElement.dataset.accent`, saves `kk-accent` to `localStorage` inside try/catch (private mode just means no persistence) and dispatches a `kk-accent` event. A tiny inline script in `index.html` applies the saved value before first paint, so there is no flash. Amber is the default when nothing is stored. The WebGL hero reads `--k-accent` at runtime (`accentHex()`), recolours the bar peak tint and the rim light on the event, and draws a frame if the loop is idle. Concept sites keep their own palettes; only the shared `ConceptStrip` highlight, focus ring and route wipe edge follow the accent.

Not themeable by design: `public/home/favicon.svg` and `public/home/og.png` stay amber (the default), because they are static files. The og.png lockup is regenerated from `LOCKUP_WIDE` in `src/home/scene/glyphs.ts` (SVG rendered in headless Chrome at 1200x630). `index.html` `theme-color` is the ground, not the accent.

The case-study layer maps tokens onto its own `--w-*` set (`--w-paper`, `--w-ink`, `--w-body #d5d9d0`, `--w-mute`, `--w-rule`, `--w-accent`, and so on) so per-case CSS written earlier keeps working. A case's brand colour (`accent` prop on `CaseLayout`) only tints a small swatch.

Shape, space, layers

- Radius: `--k-r` 4px for blocks; buttons, chips and the nav are full pills (999px).
- Gutter: `--k-pad` `clamp(18px, 4.2vw, 48px)`; content max `--k-max` 1180px (case studies `--w-max` 1240px).
- Nav height `--k-nav-h` 64px; nav z-index `--k-z-nav` 40; route wipe 300; concept strip 60.
- Section rhythm: generous separation between sections (`clamp` 28 to 52px under a section head), tight groups inside. Hairlines (1px `--k-line`) separate rows instead of cards.

## Type

| Role | Face | Notes |
| --- | --- | --- |
| Display (`--k-display`) | Saira Variable | Headings 650 to 700 weight, tracking -0.03 to -0.045em, line-height about 1; `h2` is `clamp(2.1rem, 5.4vw, 3.9rem)`, case `h1` `clamp(2.5rem, 8.6vw, 6rem)` |
| Body (`--k-sans`) | Onest Variable | 16px/1.55 on Home, 17px/1.65 in case studies; measure about 34 to 46ch for ledes and descriptions |
| Voice (`--k-serif`, class `.k-voice`) | Bodoni Moda italic | One line of voice at a time, never body copy |
| Numbers (`--k-mono`) | JetBrains Mono Variable | Only for figures and years, never as a "technical" costume |

Rules: balanced headings (`text-wrap: balance`), no eyebrow labels above headings, no gradient text, no emoji or glyph icons, no section numbers. Fonts are self-hosted via `@fontsource`.

## Motion

- One easing: `--k-ease` = `cubic-bezier(0.16, 1, 0.3, 1)` (exponential ease-out). Page wipe uses `cubic-bezier(0.76, 0, 0.24, 1)`.
- Entrance, `Reveal` (`src/shared/Reveal.tsx`, classes `.rv`, `.rv-in`): blur 10px to sharp, 16px rise, opacity, 0.7s, optional stagger via `--rv-delay`. Content is visible if JS fails.
- Page transition (`App.tsx`): cross-fade with a 24px upward shift plus one bar wipe in the ground colour with an accent leading edge (0.3s cover, 0.46s reveal). Chunks preload when the wipe starts. In-page hash links and nested concept routes do not wipe.
- Hero: a WebGL "equaliser" built from the letters of the name, driven by a travelling pulse, cursor proximity and scroll speed. It is the single authored moment on Home; everything else stays calm.
- Hover: nav links roll (letter-roll, desktop only); buttons scale 0.97 on press; row hover previews only on fine pointers.
- Reduced motion: the wipe is skipped, reveals render immediately, and WebGL scenes are replaced by their static fallbacks. `?static` forces the same path for testing.
- Animate transform, opacity, blur, clip-path and background-size. Never layout properties.

## WebGL rules (apply to every scene)

Lazy-loaded chunk; `WebGLGate` (`src/shared/webgl.tsx`) renders a static fallback with no WebGL, `prefers-reduced-motion` or `?static`; `Canvas dpr={DPR}` (cap 1.5, hero 1.25 on phones); `frameloop` paused when off-screen or the tab is hidden; do not use MSAA on the postprocessing composer (it rendered the Footonomy stadium black on some GPUs).

## Components

- **Accent picker** (`AccentPicker`): see Accent themes above. Sits above the fine print in the Home footer and at the end of the case-study footer.
- **Pill nav** (`SiteNav`): centred floating pill on desktop (logo, Work, Experience, Services, Contact, persistent "Hire me" linking to the email). Under 720px it becomes a bottom pill with an inline-expanding Menu (links, email, LinkedIn). Active section on Home shown with a dot. Used on Home, case studies and 404. Concept sites keep their own nav.
- **Buttons** (`.h-btn`, `.w-btn`): 48px minimum height, pill, 650 weight. Solid = accent on `--k-accent-ink`, hover `--k-accent-hi`; ghost = ink with `--k-line-2` border, accent on hover. Focus: 2px accent outline, 3px offset.
- **Work rows**: hairline rows with name, what, one figure, year, status; desktop cursor-following image preview, plain list on touch.
- **Concept carousel / cards**: R3F card carousel with scroll-velocity bend on desktop WebGL; horizontal snap cards with 2D canvas art (`src/home/concepts/art.ts`) on phones and without WebGL. Art is drawn in code.
- **Case layout** (`CaseLayout`, `parts.tsx`): back link, hero (h1, lede, fact list `dl`), `Section`, `Prose`, `Rows`, `StackTable`, `Figure` with lightbox, `PlateGrid`, `PhoneFrame`, `BrowserFrame`, `MockNote`, previous and next case links, footer contact (email and LinkedIn only).
- **Mocks** (Content Studio, Madridonomy, flippr.live, Flippr architecture board, ChatSpace): drawn in their own product's colours inside a frame, always labelled as sanitised or synthetic, and checked for AA contrast on the dark page.
- **ConceptStrip** (`src/shared/ConceptStrip.tsx`): the disclaimer bar on every concept. Takes `brand` and an optional `note`; back link goes to `/#concepts`.
- **Browser surfaces**: `::selection` uses the accent; dark `color-scheme`; scrollbar colours themed; visible focus everywhere; skip links on Home and case studies; `scroll-margin-top` on sections so the pill nav never covers headings.

## Accessibility floor

Body text at least 4.5:1, large text at least 3:1 (use `--k-mute` or brighter for text; `--k-faint` only for captions at 13px and up on `--k-bg`). Do not dim text with `opacity` below about 0.7 (the services list once did and fell to 3.7:1). Touch targets at least 44px. Semantic headings, one `h1` per route. No horizontal overflow from 375px up.
