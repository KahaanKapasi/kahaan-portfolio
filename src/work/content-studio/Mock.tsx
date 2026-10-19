import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { BrowserFrame, MockNote } from '../_shared/parts'

type Suits = 'Article' | 'Video' | 'Both'
type Topic = { name: string; suits: Suits; src: string[]; why: string; est: string }

const WORKSPACES = ['Madridonomy', 'Footonomy', 'General'] as const

const TOPICS: Topic[] = [
  { name: 'Why midfield rotation is the story of the season', suits: 'Both', src: ['Club news feed', 'Google News search'], why: 'Three of the last four matches saw different midfield trios; fan chatter is split on whether it is a plan or a patch.', est: '$0.01 to $0.04' },
  { name: 'The 5 young wingers scouts keep mentioning', suits: 'Article', src: ['Sports news feed', 'Transfer search'], why: 'Recurring names in transfer coverage, with clear stats to chart. Works well as a list article.', est: '$0.01 to $0.04' },
  { name: 'How the offside rule change affects wingers', suits: 'Video', src: ['Rules coverage', 'Forum feed'], why: 'Explainer angle: several fans asking for a plain-language breakdown, easy to show with motion graphics.', est: '$0.02 to $0.06' },
  { name: 'Transfer rumour roundup: what is credible and what is noise', suits: 'Article', src: ['Aggregated feeds'], why: 'Aggregates reliable-source tiers and suits a weekly article format.', est: '$0.01 to $0.04' },
  { name: 'Stadium atmosphere rankings fans vote loudest', suits: 'Both', src: ['Forum feed'], why: 'Low-effort engagement topic; also works as a poll carousel.', est: '$0.01 to $0.04' },
]

const SLIDES = [
  { n: '01', h: ['Three things the', 'midfield rotation', 'tells us'] },
  { n: '02', h: ['Minutes are', 'being shared'] },
  { n: '03', h: ['Fresh legs,', 'same shape'] },
  { n: '04', h: ['The bench is', 'deeper than', 'the table says'] },
  { n: '05', h: ['Follow for the', 'next breakdown'] },
]

function Slide({ i, cutout, mini }: { i: number; cutout: boolean; mini?: boolean }) {
  const s = SLIDES[i]
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 400 500" role={mini ? undefined : 'img'} aria-label={mini ? undefined : `Slide ${i + 1} of 5: ${s.h.join(' ')}`} aria-hidden={mini ? true : undefined}>
      <defs>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f2a22" />
          <stop offset="1" stopColor="#14463a" />
        </linearGradient>
        <clipPath id={`${uid}c`}>
          <rect x="190" y="150" width="190" height="300" rx="14" />
        </clipPath>
      </defs>
      <rect width="400" height="500" fill={`url(#${uid}g)`} />
      <circle cx="320" cy="120" r="150" fill="#1d6b57" opacity="0.35" />
      {!cutout ? (
        <g clipPath={`url(#${uid}c)`}>
          <rect x="190" y="150" width="190" height="300" fill="#6d7788" />
          {Array.from({ length: 30 }).map((_, k) => (
            <rect key={k} x={190 + (k % 6) * 32} y={150 + Math.floor(k / 6) * 62} width={20 + ((k * 7) % 14)} height={28 + ((k * 11) % 24)} fill={k % 3 ? '#8c96a8' : '#4f5868'} opacity="0.8" />
          ))}
        </g>
      ) : null}
      <g fill="#e9efe9">
        <circle cx="285" cy="262" r="42" />
        <path d="M190 450c0-78 44-120 95-120s95 42 95 120z" />
      </g>
      {cutout ? <path d="M190 450h190" stroke="#d7b45e" strokeWidth="3" /> : null}
      <text x="28" y="60" fill="#d7b45e" fontSize="22" fontWeight="700" fontFamily="var(--w-display)">
        {s.n}
      </text>
      {s.h.map((l, k) => (
        <text key={l} x="28" y={330 + k * 40} fill="#f4f2e8" fontSize="34" fontFamily="var(--w-display)">
          {l}
        </text>
      ))}
      <text x="28" y="470" fill="#b8c9c2" fontSize="14" fontFamily="var(--w-sans)">
        @yourbrand
      </text>
    </svg>
  )
}

function Topics() {
  const [sel, setSel] = useState(0)
  const [ws, setWs] = useState<(typeof WORKSPACES)[number]>('Madridonomy')
  const t = TOPICS[sel]
  return (
    <div className="wcs-cols">
      <div>
        <h3>Topic ideas</h3>
        <div className="wcs-ws" role="group" aria-label="Workspace">
          {WORKSPACES.map((w) => (
            <button key={w} type="button" aria-pressed={ws === w} onClick={() => setWs(w)}>
              {w}
            </button>
          ))}
        </div>
        <ul className="wcs-topics">
          {TOPICS.map((x, i) => (
            <li key={x.name}>
              <button type="button" className="wcs-topic" aria-pressed={sel === i} onClick={() => setSel(i)}>
                <b>{x.name}</b>
                <span className="vol">Suits: {x.suits}</span>
                <span className="wcs-src">
                  {x.src.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="wcs-card" aria-live="polite">
        <h3>{t.name}</h3>
        <p className="wcs-small" style={{ margin: '0 0 10px' }}>
          Workspace: {ws} · suits {t.suits.toLowerCase()} · from {t.src.join(', ').toLowerCase()}
        </p>
        <p style={{ margin: 0 }}>{t.why}</p>
        <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', margin: '16px 0 0' }}>
          <span className="wcs-btn pri">Write article</span>
          <span className="wcs-btn">Plan a video</span>
          <span className="wcs-small">≈ {t.est}</span>
        </p>
      </div>
    </div>
  )
}

function Article() {
  const steps: [string, string][] = [
    ['Draft', 'Gemini writes the full piece from the topic and its sources'],
    ['Humanize', 'A second pass rewrites stiff, repetitive phrasing'],
    ['SEO', 'Title tag, meta description, slug and tags'],
  ]
  return (
    <div className="wcs-cols">
      <div className="wcs-card">
        <h3>
          Article pipeline <span className="wcs-ai">AI draft</span>
        </h3>
        <ol className="wcs-steps">
          {steps.map(([name, what], k) => (
            <li key={name} className="wcs-step">
              <span className="n">{k + 1}</span>
              <span>
                <b>{name}</b>
                <span className="wcs-small" style={{ display: 'block' }}>{what}</span>
              </span>
              <span className="wcs-small">done</span>
            </li>
          ))}
        </ol>
        <p className="wcs-small" style={{ marginTop: 12 }}>
          Every step is one model call, logged to the cost ledger. A person edits and approves before anything goes out.
        </p>
      </div>
      <div className="wcs-card">
        <h3>Ready to publish</h3>
        <table className="wcs-table">
          <tbody>
            <tr><th scope="row">Title</th><td>Why midfield rotation is the story of the season</td></tr>
            <tr><th scope="row">Meta description</th><td>Three different midfield trios in four matches. Plan or patch? The minutes tell the story.</td></tr>
            <tr><th scope="row">Slug</th><td>midfield-rotation-story-of-the-season</td></tr>
            <tr><th scope="row">Tags</th><td>tactics, rotation, midfield</td></tr>
          </tbody>
        </table>
        <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '14px 0 0' }}>
          <span className="wcs-btn pri">Publish</span>
          <span className="wcs-btn">Copy</span>
        </p>
      </div>
    </div>
  )
}

function Carousel() {
  const [i, setI] = useState(0)
  const [cut, setCut] = useState(true)
  return (
    <div className="wcs-car">
      <div className="wcs-strip" role="group" aria-label="Slides">
        {SLIDES.map((_, k) => (
          <button key={k} type="button" className="wcs-thumb" aria-pressed={i === k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)}>
            <Slide i={k} cutout={cut} mini />
          </button>
        ))}
      </div>
      <div className="wcs-slide">
        <Slide i={i} cutout={cut} />
      </div>
      <div>
        <h3>Layers</h3>
        <ul className="wcs-layers">
          <li><span>Headline</span><span className="wcs-small">text</span></li>
          <li><span>Slide number</span><span className="wcs-small">text</span></li>
          <li><span>Player cutout</span><span className="wcs-small">{cut ? 'background removed' : 'original'}</span></li>
          <li><span>Background</span><span className="wcs-small">gradient</span></li>
        </ul>
        <div className="wcs-switch">
          <button type="button" role="switch" aria-checked={cut} aria-labelledby="wcs-cut-lbl" onClick={() => setCut(!cut)} />
          <span id="wcs-cut-lbl">Remove background</span>
        </div>
        <p className="wcs-small" style={{ marginTop: 10 }}>
          The cutout shown is a plain silhouette, not a real person.
        </p>
        <p style={{ margin: '14px 0 0' }}>
          <span className="wcs-btn pri">Export 5 slides</span>
        </p>
      </div>
    </div>
  )
}

function Video() {
  const scenes: [string, string, string][] = [
    ['1', 'Big counter ticks up to 3 midfield trios', '4 s'],
    ['2', 'Bars compare minutes by player', '6 s'],
    ['3', 'Scoreboard-style recap with a closing line', '5 s'],
  ]
  const stages: [string, string, number][] = [
    ['Plan', 'done', 100],
    ['Scene code, validated', 'done', 100],
    ['Render frames', 'running', 62],
    ['Voice-over and captions', 'waiting', 0],
    ['Compose with FFmpeg', 'waiting', 0],
  ]
  return (
    <div className="wcs-cols">
      <div className="wcs-card">
        <h3>Plan, awaiting approval</h3>
        <p className="wcs-small" style={{ margin: '0 0 8px' }}>Engine: code motion graphics · 9:16 · 15 s</p>
        <table className="wcs-table">
          <thead>
            <tr><th>Scene</th><th>Visual</th><th className="r">Length</th></tr>
          </thead>
          <tbody>
            {scenes.map(([n, v, d]) => (
              <tr key={n}><td>{n}</td><td>{v}</td><td className="r">{d}</td></tr>
            ))}
          </tbody>
        </table>
        <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', margin: '14px 0 0' }}>
          <span className="wcs-btn pri">Approve and render</span>
          <span className="wcs-btn">Re-plan</span>
          <span className="wcs-small">≈ $0.02 to $0.06</span>
        </p>
      </div>
      <div className="wcs-card">
        <h3>A project, mid-render</h3>
        <ol className="wcs-steps">
          {stages.map(([name, state, pct], k) => (
            <li key={name} className={`wcs-step${state === 'waiting' ? ' pending' : ''}`}>
              <span className="n">{k + 1}</span>
              <span>{name}</span>
              <span className="wcs-small">{state}</span>
              <span className="wcs-bar" role="img" aria-label={`${name}: ${pct}%`}>
                <i style={{ width: `${pct}%` }} />
              </span>
            </li>
          ))}
        </ol>
        <p className="wcs-small" style={{ marginTop: 10 }}>
          If a stage fails, retry resumes from that stage instead of starting over.
        </p>
      </div>
    </div>
  )
}

const DAYS = 14
const SERIES = [
  { name: 'Text AI', c: 'var(--cs-c1)', v: [0.8, 1.1, 0.9, 1.3, 1.0, 0.7, 0.6, 1.2, 1.4, 1.1, 0.9, 1.0, 1.3, 1.1] },
  { name: 'Images', c: 'var(--cs-c2)', v: [0.4, 0.6, 0.5, 0.9, 0.7, 0.3, 0.2, 0.8, 1.0, 0.6, 0.5, 0.7, 0.9, 0.6] },
  { name: 'Video', c: 'var(--cs-c3)', v: [0, 0, 1.6, 0, 0, 2.1, 0, 0, 2.4, 0, 1.8, 0, 0, 2.2] },
  { name: 'Speech', c: 'var(--cs-c4)', v: Array(14).fill(0.3) as number[] },
]

function Costs() {
  const W = 560
  const H = 220
  const L = 36
  const B = 26
  const max = 6
  const bw = (W - L) / DAYS
  const y = (v: number) => H - B - (v / max) * (H - B - 8)
  return (
    <div className="wcs-cols">
      <div className="wcs-card wcs-costs">
        <h3>Daily spend by service</h3>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Stacked bar chart of synthetic daily spend over 14 days, split into text AI, images, video and speech. Video days are the tallest bars.">
          {[0, 2, 4, 6].map((t) => (
            <g key={t}>
              <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke="#e1e1d8" />
              <text x={L - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#62645a">
                ${t}
              </text>
            </g>
          ))}
          {Array.from({ length: DAYS }).map((_, d) => {
            let acc = 0
            return (
              <g key={d}>
                {SERIES.map((s) => {
                  const v = s.v[d]
                  const y0 = y(acc + v)
                  const h = y(acc) - y0
                  acc += v
                  return <rect key={s.name} x={L + d * bw + 3} y={y0} width={bw - 6} height={Math.max(0, h - 0.6)} fill={s.c} rx="1.5" />
                })}
              </g>
            )
          })}
          <text x={L} y={H - 6} fontSize="11" fill="#62645a">Day 1</text>
          <text x={W} y={H - 6} fontSize="11" fill="#62645a" textAnchor="end">Day 14</text>
        </svg>
        <ul className="wcs-legend" aria-label="Series">
          {SERIES.map((s) => (
            <li key={s.name}>
              <i style={{ background: s.c }} />
              {s.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="wcs-card">
          <h3>Before you run it</h3>
          <table className="wcs-table">
            <thead>
              <tr><th>Action</th><th className="r">Estimate</th></tr>
            </thead>
            <tbody>
              <tr><td>Discovery run</td><td className="r">≈ $0.02</td></tr>
              <tr><td>Article</td><td className="r">≈ $0.01 to $0.04</td></tr>
              <tr><td>Carousel render</td><td className="r">Free</td></tr>
              <tr><td>8 s clip, fast model</td><td className="r">≈ $0.80</td></tr>
            </tbody>
          </table>
          <p className="wcs-small" style={{ margin: '8px 0 0' }}>Estimates above $1 turn the button into a two-step confirm.</p>
        </div>
        <div className="wcs-card">
          <h3>Spend by action</h3>
          <table className="wcs-table">
            <thead>
              <tr><th>Action</th><th className="r">Runs</th><th className="r">Total</th></tr>
            </thead>
            <tbody>
              <tr><td>Discovery</td><td className="r">38</td><td className="r">$0.76</td></tr>
              <tr><td>Articles</td><td className="r">12</td><td className="r">$0.21</td></tr>
              <tr><td>Video</td><td className="r">6</td><td className="r">$12.30</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'topics', label: 'Topics', el: <Topics /> },
  { id: 'article', label: 'Article', el: <Article /> },
  { id: 'carousel', label: 'Carousel', el: <Carousel /> },
  { id: 'video', label: 'Video', el: <Video /> },
  { id: 'costs', label: 'Costs', el: <Costs /> },
]

export default function Mock() {
  const [tab, setTab] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const base = useId()
  const onKey = (e: KeyboardEvent) => {
    let n = tab
    if (e.key === 'ArrowRight') n = (tab + 1) % TABS.length
    else if (e.key === 'ArrowLeft') n = (tab + TABS.length - 1) % TABS.length
    else return
    e.preventDefault()
    setTab(n)
    refs.current[n]?.focus()
  }
  return (
    <div className="wcs">
      <BrowserFrame url="studio (private tool, mock)">
        <div className="wcs-app">
          <div className="wcs-top">
            <span className="wcs-brand">Content Studio</span>
            <div className="wcs-tabs" role="tablist" aria-label="Studio sections" onKeyDown={onKey}>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`${base}-t-${t.id}`}
                  aria-selected={tab === i}
                  aria-controls={`${base}-p-${t.id}`}
                  tabIndex={tab === i ? 0 : -1}
                  onClick={() => setTab(i)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className="wcs-synth">Illustrative mock, synthetic data</span>
          </div>
          {TABS.map((t, i) => (
            <div key={t.id} role="tabpanel" id={`${base}-p-${t.id}`} aria-labelledby={`${base}-t-${t.id}`} hidden={tab !== i} className="wcs-panel">
              {tab === i ? t.el : null}
            </div>
          ))}
        </div>
      </BrowserFrame>
      <MockNote>Illustrative mock, synthetic data. Topics, numbers and the cutout silhouette are invented. No real accounts, metrics, keys or screenshots.</MockNote>
    </div>
  )
}
