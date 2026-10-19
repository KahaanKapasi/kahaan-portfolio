/** How the Content Studio modules connect, drawn in HTML so it reflows from phone to desktop. */

const INTAKE = [
  { n: '1', t: 'Collect', d: 'RSS feeds from the active workspace. X lists join in when API credits exist.' },
  { n: '2', t: 'De-duplicate', d: 'Each item gets a SHA-1 fingerprint. Stories already seen are skipped, and at most 40 new items go to the model.' },
  { n: '3', t: 'Topics', d: 'Gemini returns 15 to 20 topic ideas with a rationale, each tagged article, video or both.' },
] as const

const ROUTES = [
  { t: 'Articles', steps: ['Draft', 'Humanize', 'SEO'], out: 'Title, meta, slug and tags, ready to copy or mark published.' },
  { t: 'Posts', steps: ['Template', 'Cut-out', 'Edit', 'Preview'], out: 'Hosted on Cloudinary, then published as a carousel through the Instagram Graph API.' },
  { t: 'Video', steps: ['Clip', 'Scripts', 'Studio engines'], out: 'A plan to review, then an FFmpeg render or a provider clip. Reels publish from here.' },
  { t: 'Genjutsu', steps: ['Source video', 'Reference photos', 'Motion transfer'], out: 'Starts from your own files, not a topic. The result comes back as a finished clip.' },
] as const

export default function Pipeline() {
  return (
    <figure className="wcs-pipe" aria-labelledby="wcs-pipe-cap">
      <ol className="wcs-pipe__intake">
        {INTAKE.map((s) => (
          <li key={s.n}>
            <span className="wcs-pipe__n" aria-hidden="true">{s.n}</span>
            <strong>{s.t}</strong>
            <span>{s.d}</span>
          </li>
        ))}
      </ol>

      <p className="wcs-pipe__pick">
        <span className="wcs-pipe__rail" aria-hidden="true" />
        You pick a topic, then one of four routes
        <span className="wcs-pipe__rail" aria-hidden="true" />
      </p>

      <ul className="wcs-pipe__routes">
        {ROUTES.map((r) => (
          <li key={r.t}>
            <strong>{r.t}</strong>
            <ol aria-label={`${r.t} steps`}>
              {r.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <span>{r.out}</span>
          </li>
        ))}
      </ul>

      <div className="wcs-pipe__end">
        <div>
          <strong>Dashboard</strong>
          <span>Instagram and X numbers, a before-and-after posting baseline, and the spend card.</span>
        </div>
        <div>
          <strong>Footonomy tab</strong>
          <span>A separate arrow out: admin and analytics for the football app, over its private port.</span>
        </div>
      </div>

      <div className="wcs-pipe__cost">
        <strong>Under every paid step</strong>
        <span>Estimate range shown first, two-step confirm above $1, and a ledger entry after.</span>
      </div>

      <figcaption id="wcs-pipe-cap" className="wcs-pipe__cap">
        How the modules connect. Discovery feeds three routes; Genjutsu stands alone; cost tracking spans all of them.
      </figcaption>
    </figure>
  )
}
