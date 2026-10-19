import { useState } from 'react'
import { CLUBS, legibleAccent, type ClubId, type Player } from './data'
import { Crest, Shirt } from './crests'

const SQUAD_CLUBS: ClubId[] = ['real-madrid', 'barcelona', 'man-city', 'liverpool', 'arsenal', 'bayern', 'psg']

function Sheet({
  clubId,
  onInspect,
}: {
  clubId: ClubId
  onInspect?: (player: Player) => void
}) {
  const c = CLUBS[clubId]
  const star = c.xi.find((p) => p.pos === 'ST') ?? c.xi[9]

  return (
    <article className="cf-sheet" data-club={clubId} aria-labelledby={`sh-${clubId}`}>
      <header className="cf-sheet-header">
        <Crest club={clubId} size={70} />
        <div>
          <h3 id={`sh-${clubId}`}>{c.name}</h3>
          <p className="cf-sheet-sub">
            {c.nickname} &bull; Founded {c.founded} &bull; {c.stadium} &bull; Head Coach {c.manager}
          </p>
        </div>
      </header>

      <div className="cf-sheet-body">
        <div className="cf-sheet-kit">
          <Shirt club={clubId} number={star.n} name={star.displayName} view="back" size={130} />
          <p>{c.kitNote}</p>
        </div>

        <ol className="cf-xi" aria-label={`${c.name} starting eleven`}>
          {c.xi.map((p) => (
            <li key={p.n} className="cf-xi-item">
              <span className="cf-xi-n" style={{ color: legibleAccent(c.accent) }}>
                {p.n}
              </span>
              <span className="cf-xi-name">{p.name}</span>
              <span className="cf-xi-pos" title={p.role}>
                {p.pos}
              </span>
              {onInspect && (
                <button
                  type="button"
                  className="cf-inspect-btn"
                  onClick={() => onInspect(p)}
                  aria-label={`Inspect ${p.name} in 3D`}
                >
                  3D
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="cf-bench-box">
        <h4>Substitutes</h4>
        <p className="cf-bench-names">
          {c.bench.map((p) => `${p.n} ${p.name} (${p.pos})`).join(' · ')}
        </p>
      </div>
    </article>
  )
}

export function Squads({ onInspectPlayer }: { onInspectPlayer?: (club: ClubId, player: Player) => void }) {
  const [activeTab, setActiveTab] = useState<ClubId>('real-madrid')

  const handleInspect = (p: Player) => {
    if (onInspectPlayer) {
      onInspectPlayer(activeTab, p)
      document.getElementById('player-3d')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="cf-squads" id="squads" aria-labelledby="sq-h">
      <div className="cf-sq-head">
        <h2 id="sq-h" className="cf-h2">
          Official squad sheets
        </h2>
        <p className="cf-lede">
          Complete current squads for Europe&rsquo;s marquee clubs. Every player includes official squad numbers, tactical traits,
          and corresponding 3D kit models.
        </p>
      </div>

      {/* Club Switcher for Squad Sheets */}
      <div className="cf-squad-tabs" role="tablist" aria-label="Select club sheet">
        {SQUAD_CLUBS.map((cid) => {
          const isSelected = cid === activeTab
          const c = CLUBS[cid]
          return (
            <button
              key={cid}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className="cf-squad-tab-btn"
              data-active={isSelected}
              onClick={() => setActiveTab(cid)}
            >
              <Crest club={cid} size={24} />
              <span>{c.short}</span>
            </button>
          )
        })}
      </div>

      <div className="cf-sheets-single">
        <Sheet clubId={activeTab} onInspect={handleInspect} />
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="cf-footer">
      <p className="cf-foot-big" aria-hidden="true">
        FOOTONOMY
      </p>
      <div className="cf-foot-row">
        <div>
          <p className="cf-foot-brand">
            <strong>Footonomy</strong> &bull; The interactive football showpiece by <strong>Kahaan Kapasi</strong>.
          </p>
          <p className="cf-foot-disclaimer">
            Unofficial concept build for Footonomy companion web app. Built with React 19, Three.js (@react-three/fiber + drei),
            custom Magnus ball physics, and procedural WebGL rendering. Real club and player names used for conceptual demonstration;
            all trademarks and copyrights belong to their respective owners.
          </p>
        </div>
        <a href="#top" className="cf-btn cf-btn-small">
          Back to the top
        </a>
      </div>
    </footer>
  )
}
