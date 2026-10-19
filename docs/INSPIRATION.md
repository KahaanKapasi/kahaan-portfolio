# Portfolio inspiration study

Ten reference sites, viewed rendered at 1440px desktop. Phone view was approximated by loading each site in a 375px-wide iframe, so media queries fire but touch and hover behaviour is not emulated. Fonts, libraries and canvas counts were read from the live DOM; motion and easing are judged from screenshots and scrolling, not from code.

**Verification caveats**
- `niccolamiranda.com` does not resolve (DNS fails). The real site is `niccolomiranda.com` ("Miranda — Paper Portfolio"), and that is what was reviewed.
- `madebyhart.com` is the site of Hart Studio, an agency in Arkansas, not a personal portfolio.
- Quang Dinh's phone view and project page were not seen. The browser froze on that page (7 autoplay videos). Project data comes from a text fetch of its markup.
- Hover states were checked on only a few sites. "Not verified" is marked where it matters.

---

## 1. madebyhart.com (Hart Studio)
- **Wow moment:** A photographic desk scene with a vintage yellow TV that plays the studio's recent projects. A dial and arrow buttons change "channel", and a small LED panel types the project name. Two canvases, no GSAP or Three global. It reads as a layered-image scene with a canvas or video screen, not full 3D.
- **Nav:** Logo top-left, hamburger top-right. Menu items are Our Work, AEC Agency, About Us, Our Team, Blog, Contact Us.
- **Work:** Hero TV (15 projects), then an "Explore the work" grid of five cards with "See Work" labels. A client logo strip scrolls past after the hero.
- **Type:** Akira (extended, heavy) for headings and labels, Open Sans for body, an italic serif for the intro statement, and Digital-7 for the LED readout. The extended caps against a calm italic serif is the memorable pairing.
- **Colour:** Near-black background (`#101113`) with a warm, saturated yellow-orange hero object and pale-blue accent links. The camera and prop photography does the art direction, not the UI.
- **Motion:** The dial and channel flip are the signature. Below the hero it is plain: logos drift in a marquee, text blocks fade in.
- **Mobile:** The scene recomposes into a taller crop. The TV sits in the top ~55% and the statement sits below. It stays recognisable on a phone.
- **Steal:** One tangible, physical metaphor as the project switcher. Kahaan's equivalent is a bar-sculpture "equaliser" or football scoreboard that cycles case studies.
- **Avoid:** Making the hero the only memorable thing. After the TV the page is a standard agency template.

## 2. about.senbuzy.com (Sen Zheng)
- **Wow moment:** A full-screen WebGL scene (two canvases at 2x DPR). A clay-style 3D head covered in stickers sits behind the text. Scrolling flies the camera across the face, then rotates to a profile view. It is scroll-driven camera choreography, with film grain and soft depth of field over the top.
- **Nav:** None in the DOM. Only a GitHub icon, a language toggle, and a "Portfolio" label top-right. The page is one long narrative with a pinned timeline.
- **Work:** Narrative sections ("Résumé", "Works" 01-04) with a vertical timeline rail. Projects are titles, categories and view counts, not a grid.
- **Type:** Mansalva (handwritten marker) for the hero title, Cormorant Upright (display serif) for section heads, Helvetica Neue for body. The hand-drawn title over a calm serif is warm.
- **Colour:** Sage-olive gradient (`#0a0e16` base with desaturated greens) and warm skin tones. Cream text (`#f4f1ea`). The sticker colours are the accent.
- **Motion:** Slow, filmic, scroll-scrubbed. Timeline entries fade in beside a glowing dot on a thin rail. A blurred copy of the 3D scene sits behind readable text so legibility holds.
- **Mobile:** The same head and title are kept, just recomposed. The text lines are small but legible.
- **Steal:** Text always sits on a calmer, blurred layer of the 3D scene, so the 3D never fights the copy. The experience timeline as a dotted rail is directly applicable to Veefin, Madridonomy and Spectrum.
- **Avoid:** A 7,992px page that is mostly scroll-scrubbing. It needs a loader (there is a spinner) and punishes slow phones.

## 3. altshift.agency (Alt Shift, Dubai)
- **Wow moment:** A giant "ALTSHIFT" wordmark in a gradient field, with a glossy, chromatic-aberration 3D logo glyph floating in front and sticker-like 3D objects scattered around. The background gradient changes between loads (blue on desktop, orange on phone). Several canvases plus three videos; Lenis smooth scroll.
- **Nav:** Floating white pill buttons. "Let's work" and a status dot top-left, logo centre, "Menu" pill top-right that expands inline into "Works / Contact" pills (no full-screen overlay).
- **Work:** Large 16:10 framed project cards one after another, each with a year and a name, with corner crop-marks. An awards strip lists Awwwards, FWA, CSS Design Awards. "See all works" opens a list page.
- **Type:** Anton (condensed, tall caps) for statements, Space Grotesk for UI, an italic serif accent in the tagline. The hero statement is a scroll-reveal: words light up one by one ("WE DON'T JUST DESIGN. WE BUILD IT TOO."), with underlined key words.
- **Colour:** Warm paper-grey and an animated gradient in the hero, then near-black for the rest (`#0c0c0a`). Pills are white, so the UI pops against both.
- **Motion:** Scroll-reveal text, a running marquee ticker with a live Dubai clock, and 3D objects that react to the cursor. Menu pills slide in horizontally.
- **Mobile:** The wordmark shrinks and stacks as "ALT.SHIFT". The 3D glyph is kept as a flat, grey, extruded object, a clear cheaper version. The menu collapses to one round button.
- **Steal:** The inline-expanding pill nav, and word-by-word scroll-highlight statements for the "what I do" pitch.
- **Avoid:** Awards logos as proof. Kahaan does not have them, so use shipped products and numbers (61K, live auction) instead.

## 4. niccolomiranda.com (Niccolò Miranda, "The Paper Portfolio")
- **Wow moment:** A newspaper front page. The hero is a three-column broadsheet (project / "ALL WORK!" / project) above a huge black block of the surname in a cut stencil-like display face. A paper-grain texture covers everything. It is type and layout, with GSAP and Locomotive Scroll plus a WebGL canvas for image distortion.
- **Nav:** Slim masthead with location left, wordmark centre, a two-line hamburger right. The menu opens to a full-screen dark panel with huge stacked "INDEX / WORK / ABOUT"; the hovered item gets a red strike-through line.
- **Work:** A horizontally draggable broadsheet row ("Drag sideways to navigate"), each project a headline plus a deck paragraph with a red "NEW" tag. Other sections use "Click on the image to explore" and "Click on the sides to explore" tips, so the pattern repeats with a different gesture.
- **Type:** Canopee (condensed display, 225px headings), Editorial New (body serif), Domaine Display. A newspaper voice: tight caps heads with long serif decks.
- **Colour:** Warm newsprint grey-beige (`#bcb5a8` area) with near-black (`#1d1d1b`) blocks and one red-orange accent. Very restricted.
- **Motion:** Drag and inertial scroll, image distortion on hover (not verified), menu reveal. Scroll was very damped in my test, so it feels deliberate.
- **Mobile:** The masthead stays. "MIRANDA" is a black box, a portrait illustration sits below it, and the roles are stacked as ruled lines. The editorial concept survives intact on a phone.
- **Steal:** Give each section a one-line gesture hint ("Drag sideways") in the same voice as the concept. Also, a strong single-concept metaphor beats effects.
- **Avoid:** Heavy damped scroll on content a client needs to skim.

## 5. samfcheng.com (Sam Cheng)
- **Wow moment:** A physics ID-badge on a lanyard hangs from the top, overlapping a giant "Sam Cheng" in a high-contrast serif. A canvas renders the swinging badge (drag test did not visibly move it, so interaction is unverified). The badge card itself carries the name in blue and black.
- **Nav:** None. A short sentence top-left ("I design products and the stories behind them. [more]") and a status line top-right. The page is a single scroll.
- **Work:** Three full-width, hairline-ruled rows (Multiply, Classmate, Olos), each with title, one-sentence description, and dates. Row images appear on the right as a stack of device mockups. Rows deblur and sharpen as they enter the viewport.
- **Type:** Kyoto (a quirky text serif) at every size, 287px for the name down to 16px body. One typeface, no pairing.
- **Colour:** White and `#080808`. Accent only appears in coloured pill links (LinkedIn blue, Instagram pink, email orange) in the closing paragraph.
- **Motion:** Blur-to-sharp scroll focus on rows, nothing else. Restraint is the point.
- **Mobile:** The badge sits above the two-line name. The rest is the same single column.
- **Steal:** The fintech-intern framing is the same as Kahaan's: lead with company, one-line outcome, dates. Also, coloured pill links for social at the end.
- **Avoid:** A long wait for the badge to initialise on a phone (my first mobile screenshot caught it mid-load, tinted purple).

## 6. meermohsin.me (Meer Mohsin)
- **Wow moment:** A black page with blood-red tribal-gothic ornament that rips, wipes and scrubs between sections. A red barcode loader sits bottom-left. Three canvases plus Lenis. A giant headline ("THIS WILL FEEL DIFFERENT") swaps between a light sans and a red calligraphic script, letter by letter.
- **Nav:** Fullscreen menu (Home, About, Services, Work, Blog, Contact Us), opened from a short two-line icon top-right, with a crest logo top-left.
- **Work:** A "Gallery / Contribution / View / 01 My work" block, plus a visual journal (blog) and an awards block. Much of the copy is still lorem ipsum. This site is unfinished at 21,600px tall.
- **Type:** Custom light and regular grotesques in all caps, plus Ruthie (a calligraphic script) for numbers and emphasis. Script numerals (10+, 25+) on red are the memorable detail.
- **Colour:** Black to saturated red (`#9a1000` field). Black bleeds into red via a burnt-edge mask.
- **Motion:** Very theatrical: ornaments animate in, text scatters and reassembles, a footer ticker repeats "IT WAS ALWAYS GOING TO BE THIS WAY." The story arc is "Tension / Immersion / Impact."
- **Mobile:** The huge hero word is cropped to its edges ("YS...N" visible) and the red ticker is thin. It is readable but the hero is partially broken.
- **Steal:** A three-word story spine for the whole site. Kahaan's could be "Build / Ship / Scale".
- **Avoid:** Tone. Horror-gothic is wrong for B2B fintech clients, and placeholder copy shipped live undermines trust.

## 7. dejiajetomobi.com (Deji Ajetomobi)
- **Wow moment:** There is no 3D. A blackletter "Deji Ajetomobi" fills the bottom of the viewport above plain Inter text. A ruler of tick marks at the top slides as you switch tabs, like a tape measure.
- **Nav:** A centred pill tab switcher (About / Design / Articles / & Engineering) under a sliding tick-mark ruler. Each tab is its own route, and no page scrolls (the About page is 693px tall).
- **Work:** The Design tab is a masonry wall of images with a filter row (All / Case studies / Product / Components / Brand / ...), and badges in the corner of each tile show the tools used. The About tab is four text columns (bio, case study links, experience, press).
- **Type:** Blackletter display, Inter at 14-20px. IBM Plex Sans appears as a secondary.
- **Colour:** White, black, light-grey pills. Colour comes only from the work images.
- **Motion:** The tick-ruler slide and pill hover. That is almost all of it.
- **Mobile:** The About tab stacks into a single column (bio, case studies, experience). The sticky tab bar stays at the top.
- **Steal:** The About page as four scannable columns (who / case studies / experience / press) all above the fold. That is the page a recruiter wants.
- **Avoid:** Zero visible depth for a developer. Kahaan's 3D is the differentiator.

## 8. dirtverse.co (Dirt, Perth & Sydney)
- **Wow moment:** A horizontal strip of glossy, rendered orbs (chrome flower, liquid metal, yellow web, blue flame, red-orange liquid) drifting across a white page. They are looping videos (13 on the page) plus one canvas. A Framer build.
- **Nav:** Three small grey pills (About / Work / Journal) top-left, a heavy "dirt" wordmark centre, a black "Contact" pill top-right. On mobile this becomes the logo plus a single black "Menu" pill.
- **Work:** "Selected works" is a 2-column asymmetric video grid with brand names overlaid, ending in a "See all work" pill. The Services list is a big stacked word list (Brand, Digital, Content, Motion, Print) where the active word darkens as you scroll and an image to the right swaps.
- **Type:** Inter Tight at 40px and a heavier grotesque for the service words. Chivo Mono for tiny labels (SELECTED WORKS). Sequel Sans appears as a fourth.
- **Colour:** Almost pure white with black, light-grey pills, and all colour in the media. Confident restraint.
- **Motion:** Pills fade behind content on scroll, services words highlight in sequence. Mostly video-driven.
- **Mobile:** Orbs recentre as a swipeable strip, one dominant. The tagline sits at the bottom. A very clean small-screen composition.
- **Steal:** The services list as a scroll-highlighted word stack with a sticky image. It is cheap in framer-motion and clear to a client.
- **Avoid:** Pure autoplay video walls. 13 videos is heavy on mobile data.

## 9. gahanrao.com (Gahan Rao)
- **Wow moment:** The strongest idea in the set. A full-viewport WebGL carousel of project cards: the centre card is flat and readable; side cards bend and warp away at the edges of the screen, with a rainbow-edged smear. A pill switcher picks the shader distortion (Stretch / Bulge / Drum / Shatter / Dust). A mute/unmute button implies audio. Wheel scrolls the carousel rather than the page (page height is 693px).
- **Nav:** No nav bar. A wordmark top-left with a rounded logo, a one-line intro in the middle, and a three-line bio top-right with inline text links (About / LinkedIn / X / Email).
- **Work:** The carousel is the work. Cards show title, one-line tagline, tag ("Industry Project") and year, on gradient art. Click-through not tested.
- **Type:** Brockmann (neutral grotesque) for text, Clash Grotesk bold for the wordmark. Orange-red inline keywords in the bio are the only accent.
- **Colour:** Light grey (`#f2f2f2`) with per-project colour cards (green, orange, magenta, blue) that act as the palette.
- **Motion:** The card shader distortion reacts to scroll velocity. The pill switch re-skins the effect live. That is shader work.
- **Mobile:** The same carousel, but the bio stacks and the card grows to fill the width. The mute button becomes a round icon. It works well in a 375px viewport.
- **Steal:** A velocity-reactive WebGL card carousel for case studies. It is buildable in R3F with a plane per card and a vertex shader driven by scroll delta. Use only one distortion.
- **Avoid:** Five distortion modes. That is a toy, and clients will not read it as hire-worthy.

## 10. quangdinh.im (Quang Dinh)
- **Wow moment:** A one-screen home with a hand-drawn highlighter-yellow blob around "QuangDinh" in a loose script, five sticker-like tags (Technology, Football, Playing game, Music, Collection) orbiting it, a live mini clock (00:28) and the coordinates of Ho Chi Minh City. Seven videos load. No canvas, so the effect is CSS and video (hover reveal not verified).
- **Nav:** Three outlined pills bottom-left (Home / Projects / Archive), with social text links bottom-right. The nav lives at the bottom, not the top.
- **Work:** Projects is a vertical stack of nine linked thumbnails (EVO Money, Herumetsu, 987 ATH, Address 338, Documatic, EISLAB, PhoenixBank, SKIN, Evo Mobile) with category labels (Finance, Fashion, Sport...) and "See detail". Page transitions not seen.
- **Type:** Instrument Serif italic for small labels, Pangea Afrikan for body, Geist Mono for coordinates. The tiny sizes (12px) are an editorial-label look.
- **Colour:** White with warm brown-black text (`#302c27`) and a single fluorescent yellow-green marker blob.
- **Motion:** Not verified beyond the live clock. The marker blob looks animated.
- **Mobile:** Not verified.
- **Steal:** A "personality" layer of tags, clock and coordinates that proves a real person without a long bio. Also bottom-anchored pills for thumb reach.
- **Avoid:** Tiny 12px grey labels on a phone, and a home with no obvious "hire me" action.

---

# Design direction for kahaankapasi.com

**Hero concept: the bar sculpture is the whole idea. Keep it, and give it a job.** The name as instanced bars should act like an equaliser or a market ticker. Bars rise when the cursor or scroll moves and settle into the name. On first load, show the name from bars in under 2 seconds with a lightweight loader. Under it, one plain sentence in 18-20px: "I build fintech and product sites that ship." Two buttons directly below: **See work** and **Email me**. Realistic in R3F: `InstancedMesh` with a per-instance height uniform, a simple pointer-ray falloff, and `useFrame` damping. Avoid post-processing beyond a light bloom. Take the "calm layer behind text" idea from Sen: text sits on a flat panel, never directly over moving bars.

**Navigation: Alt Shift's floating pill pattern.** Logo or initials left, a single "Menu" pill right that expands inline to Work / Experience / Concepts / Contact. Add a persistent "Hire me" pill. Keep nav at the top for desktop. On phones, put the three most important pills in a bottom bar (Dirt, Quang Dinh), so the thumb reaches them.

**Work presentation: two tiers.**
1. **Case studies (Flippr, auction.flippr.live, madridonomy.com, Footonomy, Content Studio, ChatSpace):** hairline-ruled rows in the Sam Cheng style. Row = name, one-line outcome with a number, tags, year. On desktop hover, show a preview image. Click opens a full case-study page.
2. **Concept sites (Footonomy showpiece, car configurator, architecture, fintech):** a Gahan-style R3F card carousel, one distortion only (vertical bend, scroll-velocity driven). It is the showpiece, not the primary list.

**Page transitions:** framer-motion `AnimatePresence` with a 400-500ms cross-fade plus a 24px upward shift, and a single full-width bar that wipes across (echoing the hero bars). Keep the R3F canvas mounted across routes. Do not remount.

**Type pairing:** a tall grotesque or condensed display for headings (Anton or a Neue Montreal-style grotesque), with an italic serif (Instrument Serif) for one-line "voice" sentences, and a clean sans (Inter or Geist) for body, plus a mono for numbers and labels. Three typefaces maximum. Hart (extended caps plus italic serif) and Alt Shift (Anton plus a serif accent) are the models.

**Colour:** near-black base (`#0c0c0a`) with warm off-white text (`#f4f1ea`). One saturated accent, financial-leaning (electric green or amber), used only for bars at peak, links and the primary CTA. Per-project colour only appears inside the project's own card. Avoid red-gothic (Meer) and gradients on text.

**Signature micro-interactions (pick four):**
1. Bars react to the cursor, and to scroll velocity on touch.
2. Case-study rows blur-to-sharp as they enter (Sam Cheng), using `whileInView` with a CSS filter.
3. Services as a scroll-highlight word stack with a sticky image (Dirt).
4. Timeline as a dotted rail with a glowing dot that fills (Sen) for Veefin, Madridonomy 61K and Spectrum.
5. Letter-roll hover on nav links (Gahan), which is a two-line text mask in CSS.

**What must stay simple for clients:** a visible Email link and a Hire button in every viewport; the case-study order (best proof first, with metrics); plain-language headings ("What I build", "Results"); no hidden gestures required to reach work; no autoplay audio; a text fallback if WebGL fails. Do not gate content behind drag or scroll-jacking (Miranda and Gahan both hide the project list behind a gesture).

**Mobile rules:** design the phone first. Reduce the bar count and DPR (cap at 1.5), pause the render loop when off-screen, replace the carousel with vertical snap cards, set tap targets at 44px minimum, body text at 16px, and never place text over moving 3D. Test on a real mid-range Android. Respect `prefers-reduced-motion` with static bars.

**Realistically buildable:** the bar hero, case-study rows, pill nav, word-stack, timeline and page transitions are all comfortable in R3F plus framer-motion. The velocity-driven card carousel needs custom shader work (a day or two). Skip: a physics lanyard (Sam Cheng) and a full 3D scene as backdrop (Sen) — high cost, low client value.
