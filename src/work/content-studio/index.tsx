import CaseLayout from '../_shared/CaseLayout'
import { Prose, Rows, Section, StackTable } from '../_shared/parts'
import Mock from './Mock'
import Pipeline from './Pipeline'
import './mock.css'

export default function ContentStudioCase() {
  return (
    <CaseLayout
      slug="content-studio"
      title="Content Studio"
      summary="A private, single-user content tool for a football media brand. It finds topics from news feeds, drafts articles, builds Instagram carousels, plans and renders video, tracks every dollar of AI spend, and has a tab that runs the admin side of the Footonomy app."
      role="Designer and developer. Built for my own brand, used by me."
      stack="FastAPI, SQLAlchemy, Postgres (Neon) or SQLite, React 19, Vite, Tailwind, Gemini, FFmpeg, Cloudinary, Instagram Graph API"
      status="Private tool, in use. Not public."
      accent="#0f6b4f"
      metaTitle="Content Studio case study | Kahaan Kapasi"
      metaDescription="Case study: Content Studio, a private content tool for a football media brand. Workspace-based topic discovery, an article pipeline, a carousel studio with Instagram publishing, video engines, Genjutsu motion transfer, cost awareness and a Footonomy admin tab. FastAPI, React, Gemini and FFmpeg, with 520+ backend tests."
      hero={<Mock />}
    >
      <Section id="overview" title="Why it exists">
        <Prose lead>
          <p>
            Running a football media brand solo means the same loop every day: find out what is worth covering, then produce an article, a
            carousel or a video fast enough to still be relevant. Making one carousel by hand took about 45 minutes. The target for
            Content Studio was one pipeline, under 10.
          </p>
          <p>
            It is semi-automated on purpose. Machines collect, draft and render; a person chooses, edits and approves. Paid steps show
            what they will cost before they run, and nothing is published without a deliberate click.
          </p>
        </Prose>
        <div className="w-gap" />
        <dl className="wcs-nums">
          <div>
            <dt>Automated backend tests</dt>
            <dd>520+</dd>
          </div>
          <div>
            <dt>API endpoints</dt>
            <dd>80+</dd>
          </div>
          <div>
            <dt>Lines of code, backend and front end</dt>
            <dd>~20K</dd>
          </div>
          <div>
            <dt>Video engines behind one plan-review step</dt>
            <dd>6</dd>
          </div>
        </dl>
      </Section>

      <Section id="pipeline" title="How the modules connect" wide>
        <Pipeline />
      </Section>

      <Section id="discovery" title="Discovery and workspaces">
        <Prose>
          <p>
            Discovery is the front of the pipeline. It collects from RSS feeds, de-duplicates, and asks Gemini to turn what is new into 15
            to 20 topic ideas. Each topic carries a short rationale and a tag for where it fits: article, video or both. Collection takes a
            few seconds; the topics are generated in the background and show up as they land. A run with nothing new skips the model
            entirely and costs nothing.
          </p>
          <p>
            <strong>Workspaces</strong> keep the brands apart. The Madridonomy workspace pulls only Real Madrid sources (14 feeds), the
            Footonomy workspace pulls football-wide sources (20 feeds), and General combines both. Each has its own topic focus prompt,
            topics are stored per workspace, and the Articles and Video pages follow whichever workspace is selected. Sources sit behind
            one adapter interface, so adding a feed needs no pipeline change, and one dead source never stops a run. X sources are wired
            in too, and switch on when the API has credit.
          </p>
        </Prose>
      </Section>

      <Section id="modules" title="The modules">
        <Rows
          items={[
            {
              name: 'Articles',
              text: 'A chosen topic goes through three model calls: draft, humanize (rewrite the stiff, repetitive phrasing), then SEO for the title tag, meta description, slug and tags. Each step is logged to the cost ledger. The result is copied out or marked published; there is no publishing integration yet.',
            },
            {
              name: 'Posts, the carousel studio',
              text: 'The module used most. Three fixed templates (darkened background, transparency overlay, background-removed cut-out) on a Fabric.js canvas, in 1:1, 4:5, 3:4, 9:16 or 16:9. Paste or drag images in as layers; adjust exposure, contrast, temperature, saturation and sharpness; watch a live Instagram-style preview. Templates apply instantly in the browser. Background removal uses an open-source neural model through rembg, cached on disk. To publish, the image goes to Cloudinary first because Instagram only fetches public URLs, then the Instagram Graph API creates the carousel or single post. The editor is template-constrained on purpose: it is not a general design tool.',
            },
            {
              name: 'Video: clip, scripts, studio',
              text: 'Three surfaces. Clip is prompt in, video out: Gemini can research and improve the prompt with web grounding, then a provider (Google Veo, Higgsfield or Muapi) renders it, and the file is downloaded straight away because Veo output expires. Ideas and scripts turn a topic into candidate titles and long and short scripts. Studio runs multi-stage engines that make finished videos, described below.',
            },
            {
              name: 'Genjutsu motion transfer',
              text: 'Upload a source video and one to eight reference photos, pick 480p, 720p or 1080p, and Higgsfield’s Genjutsu model performs the same motion with the person in the photos. The job is built to be safe to leave: the cost is confirmed first and the server re-checks that the price still holds, the provider request id is saved before polling so a restart resumes instead of paying twice, unstarted jobs can be cancelled, and a moderation block is reported honestly as a failure.',
            },
            {
              name: 'Dashboard and cost awareness',
              text: 'Instagram followers, reach and engagement, X metrics, and a before-and-after posting baseline so the effect of using Studio can be measured. A price table with sources and verified dates sits behind every estimate, and it supports date-effective prices because one model’s rates are announced to double on 1 January 2027. A header pill shows today’s and total spend.',
            },
            {
              name: 'Footonomy admin tab',
              text: 'The one deliberate bridge to the football app. Studio calls Footonomy’s private admin API on its own port with a bearer token; Footonomy never calls Studio. The tab shows users, sign-ups and follows per day, app health (request rate, error rate, p95 latency, cache hit rate, live connections), and lets the owner suspend or delete users, flip feature switches, publish a site-wide banner and read the audit log. A snapshot is stored every five minutes while the tab is open so health numbers have a history. Studio’s client sanitises errors so the URL and token never leak.',
            },
          ]}
        />
      </Section>

      <Section id="engines" title="Video studio engines">
        <Prose>
          <p>
            Every engine is an ordered list of stages run by one job runner: plan, review, render. Stage outputs are saved to disk, so
            retry resumes at the stage that failed. Paid engines stop after planning and show the plan with a cost range; nothing renders
            until it is approved. A 45-minute timeout and restart recovery mean a job never hangs silently.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'Motion graphics', items: 'Gemini writes Python against Studio’s own primitives (counters, bars, scoreboards). The code is checked against an AST whitelist, run in a resource-limited subprocess, and its frames are piped to FFmpeg.' },
            { name: 'Stock-footage shorts', items: 'Script, search terms, stock clips, text-to-speech, captions and music, composed by FFmpeg.' },
            { name: 'Recipes', items: 'Singing story, two-host podcast with a waveform, low-poly and comic-book looks, and product demo.' },
            { name: 'Toons, shorts, explainers', items: 'A shared scene-film core: script, shot list, consistent character references, per-shot visuals, voices, captions. A cheap mode uses stills with camera moves; an AI mode uses image-to-video.' },
            { name: 'Shared kit', items: 'FFmpeg helpers, free edge-tts or Gemini speech, ASS caption burn-in, Gemini images, Cloudinary upload for outputs.' },
          ]}
        />
      </Section>

      <Section id="status" title="Where it stands">
        <Prose>
          <p>
            Honest status, because several parts are ahead of their first real run. Proven live: discovery for both workspaces, Instagram
            insights with automatic token refresh, Genjutsu video replacement, a motion-graphics render, Cloudinary upload and the cost
            ledger. Built and covered by tests with every external service mocked, but not yet run end to end with paid models or live
            posting: the other video engines, Veo and Muapi clips, Reels and carousel publishing, and the X features. Not built: a series
            and cast system, lip-sync and a post scheduler.
          </p>
          <p>
            The Posts studio has already paid off in practice: two carousels made in it in September 2026 reached about 196K views and
            5.3K shares combined, per Instagram post insights on 14 October 2026.
          </p>
        </Prose>
      </Section>

      <Section id="build" title="How it is built">
        <Prose>
          <p>
            One FastAPI backend with nine route modules and a React single-page app. Slow work (scraping, rendering, background removal)
            runs as background jobs with a small state machine, so the editor stays responsive and each job reports its state. Cut-outs
            and stock media are cached on disk, the web app caches queries and loads pages on demand, and startup migrations are
            idempotent. The database is SQLite locally and in tests and Postgres on Neon in production, switched by one setting.
          </p>
          <p>
            It is a single-user tool behind an access password and is not meant to be public, so there is no account system. The suite of
            520+ pytest tests is offline: a temporary database, blanked secrets, network sockets blocked, and Gemini, Instagram, X and
            Cloudinary all mocked. The mock above is built in HTML, CSS and SVG with invented data. It follows the structure of the real
            screens but contains no real accounts, metrics, keys or screenshots.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'API', items: 'FastAPI, SQLAlchemy 2, Pydantic, Uvicorn' },
            { name: 'Data', items: 'Postgres on Neon in production, SQLite locally and in tests' },
            { name: 'Front end', items: 'React 19, TypeScript, Vite, Tailwind, TanStack Query, Fabric.js, Recharts' },
            { name: 'AI', items: 'Gemini for text, images, speech and grounded research; Veo, Higgsfield and Muapi for video' },
            { name: 'Media', items: 'FFmpeg, rembg with ONNX Runtime, edge-tts, Pillow, Cloudinary' },
            { name: 'Publishing and data', items: 'Instagram Graph API, X API, RSS via feedparser' },
            { name: 'Quality', items: '520+ backend tests in pytest, oxlint and strict TypeScript on the front end' },
          ]}
        />
      </Section>
    </CaseLayout>
  )
}
