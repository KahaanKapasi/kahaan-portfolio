import { useEffect, useRef, useState } from 'react'
import { BrowserFrame, ExtIcon, type Shot } from '../_shared/parts'

const LIVE = 'https://auction.flippr.live'

type Props = { poster: Shot; reel: Shot[] }

/**
 * Click-to-load embed of the live site. Nothing third-party is requested until
 * the visitor asks. A screenshot reel is the default fallback, a timeout shows an
 * "open live" hint, and the toggle switches between the two views.
 */
export default function LivePreview({ poster, reel }: Props) {
  const [mode, setMode] = useState<'live' | 'shots'>('live')
  const [requested, setRequested] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  const [frameKey, setFrameKey] = useState(0)
  const [i, setI] = useState(0)
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

  const cur = reel[i]
  const openLive = (
    <a className="w-btn w-btn--sm wa-open" href={LIVE} target="_blank" rel="noopener noreferrer">
      Open live
      <ExtIcon />
    </a>
  )

  return (
    <div className="wa-preview">
      <div className="wa-toggle" role="group" aria-label="Preview mode">
        <button type="button" aria-pressed={mode === 'live'} onClick={() => setMode('live')}>
          Live preview
        </button>
        <button type="button" aria-pressed={mode === 'shots'} onClick={() => setMode('shots')}>
          Screenshots
        </button>
      </div>

      <BrowserFrame url="auction.flippr.live" action={openLive}>
        <div className="wa-stage">
          {mode === 'live' ? (
            <>
              {!requested ? (
                <>
                  <img src={poster.src} width={poster.width} height={poster.height} alt={poster.alt} className="wa-poster" decoding="async" />
                  <div className="wa-cover">
                    <button type="button" className="w-btn" onClick={load}>
                      Load live preview
                    </button>
                    <p>Loads auction.flippr.live inside this page. Nothing is requested until you click.</p>
                  </div>
                </>
              ) : (
                <>
                  <img src={poster.src} width={poster.width} height={poster.height} alt="" aria-hidden="true" className="wa-poster wa-poster--behind" />
                  <iframe
                    key={frameKey}
                    className="wa-frame"
                    src={LIVE}
                    title="auction.flippr.live live preview"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    onLoad={() => {
                      setLoaded(true)
                      setSlow(false)
                    }}
                  />
                  {!loaded && !slow ? <p className="wa-status" role="status">Loading the live site…</p> : null}
                  {slow ? (
                    <div className="wa-slow" role="status">
                      <p>Preview didn&apos;t load? The site may not allow embedding.</p>
                      <a className="w-btn w-btn--sm" href={LIVE} target="_blank" rel="noopener noreferrer">
                        Open live
                        <ExtIcon />
                      </a>
                      <button type="button" className="w-btn w-btn--sm w-btn--ghost" onClick={() => setMode('shots')}>
                        See screenshots
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </>
          ) : (
            <>
              <img key={cur.src} src={cur.src} width={cur.width} height={cur.height} alt={cur.alt} className="wa-poster wa-shot" decoding="async" />
              <div className="wa-reel">
                <button type="button" onClick={() => setI((i + reel.length - 1) % reel.length)} aria-label="Previous screenshot">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                </button>
                <span aria-live="polite">
                  {i + 1} / {reel.length}
                </span>
                <button type="button" onClick={() => setI((i + 1) % reel.length)} aria-label="Next screenshot">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </>
          )}
        </div>
      </BrowserFrame>
      <p className="wa-note">
        {mode === 'live'
          ? 'Blank frame? The live site may block embedding. Use Open live to see it in its own tab.'
          : cur.caption}
      </p>
    </div>
  )
}
