import { useEffect, useRef, useState } from 'react'
import { BrowserFrame, ExtIcon } from '../_shared/parts'

const LIVE = 'https://flippr.live'

/**
 * Click-to-load embed of flippr.live. Third-party bytes wait for a click.
 * If the host blocks framing, a timeout points at the live tab.
 */
export default function LivePreview() {
  const [requested, setRequested] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  const [frameKey, setFrameKey] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!requested || loaded) return
    timer.current = window.setTimeout(() => setSlow(true), 8000)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [requested, loaded, frameKey])

  const load = () => {
    setSlow(false)
    setLoaded(false)
    setRequested(true)
    setFrameKey((k) => k + 1)
  }

  const openLive = (
    <a className="w-btn w-btn--sm wl-open" href={LIVE} target="_blank" rel="noopener noreferrer">
      Open live
      <ExtIcon />
    </a>
  )

  return (
    <div className="wl-preview">
      <BrowserFrame url="flippr.live" action={openLive}>
        <div className="wl-stage">
          {!requested ? (
            <>
              <Poster />
              <div className="wl-cover">
                <button type="button" className="w-btn" onClick={load}>
                  Load live preview
                </button>
                <p>Loads flippr.live inside this page. Nothing is requested until you click.</p>
              </div>
            </>
          ) : (
            <>
              <Poster quiet />
              <iframe
                key={frameKey}
                className="wl-frame"
                src={LIVE}
                title="flippr.live live preview"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => {
                  setLoaded(true)
                  setSlow(false)
                }}
              />
              {!loaded && !slow ? (
                <p className="wl-status" role="status">
                  Loading the live site…
                </p>
              ) : null}
              {slow ? (
                <div className="wl-slow" role="status">
                  <p>Preview did not load? The site may not allow embedding.</p>
                  <a className="w-btn w-btn--sm" href={LIVE} target="_blank" rel="noopener noreferrer">
                    Open live
                    <ExtIcon />
                  </a>
                  <button type="button" className="w-btn w-btn--sm w-btn--ghost" onClick={() => setRequested(false)}>
                    Show poster
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </BrowserFrame>
      <p className="wl-note">
        {requested
          ? 'Blank frame? The live site may block embedding. Use Open live to see it in its own tab.'
          : 'Click to load the real marketing page. Until then this is a screenshot of it, taken on the day I wrote this case study.'}
      </p>
    </div>
  )
}

function Poster({ quiet }: { quiet?: boolean }) {
  return (
    <picture className={`wl-poster${quiet ? ' wl-poster--behind' : ''}`} aria-hidden={quiet ? true : undefined}>
      <source media="(max-width: 720px)" srcSet="/work/flippr-live/mobile-hero.webp" />
      <img
        src="/work/flippr-live/desktop-hero.webp"
        width={1440}
        height={768}
        alt={quiet ? '' : 'Screenshot of flippr.live: a blue header with store badges, the headline "Local cricket. Live scoring. Real matches." and a phone showing live ball-by-ball commentary.'}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  )
}
