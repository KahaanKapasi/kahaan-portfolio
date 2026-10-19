import { lazy, Suspense, useState, useMemo } from 'react'
import { WebGLGate, useWebGLAllowed } from '../../shared/webgl'
import { CLUBS, legibleAccent, type ClubId, type Player } from './data'
import { Crest, Shirt } from './crests'

const LazyPlayerScene = lazy(() => import('./scene/PlayerScene'))

const CLUB_KEYS: ClubId[] = ['real-madrid', 'barcelona', 'man-city', 'liverpool', 'arsenal', 'bayern', 'psg']

export function PlayerViewer({
  selectedClub,
  onSelectClub,
}: {
  selectedClub?: ClubId
  onSelectClub?: (c: ClubId) => void
}) {
  const allowed = useWebGLAllowed()
  const [internalClub, setInternalClub] = useState<ClubId>('real-madrid')
  const activeClub = selectedClub ?? internalClub
  const setActiveClub = onSelectClub ?? setInternalClub

  const club = CLUBS[activeClub]
  const [playerIndex, setPlayerIndex] = useState<number>(9) // Default to striker (e.g. Mbappé / Lewandowski / Haaland)
  const [isBench, setIsBench] = useState<boolean>(false)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [viewAngle, setViewAngle] = useState<'front' | 'back' | 'free'>('front')
  const [fallbackView, setFallbackView] = useState<'front' | 'back'>('back')

  const activePlayer: Player = useMemo(() => {
    const list = isBench ? club.bench : club.xi
    return list[playerIndex] ?? club.xi[0]
  }, [club, isBench, playerIndex])

  const selectPlayer = (idx: number, bench: boolean) => {
    setPlayerIndex(idx)
    setIsBench(bench)
  }

  const handleClubChange = (id: ClubId) => {
    setActiveClub(id)
    setPlayerIndex(9) // Striker
    setIsBench(false)
  }

  const fallback = (
    <div className="cf-player-2d-fallback">
      <div className="cf-fallback-shirt-wrap">
        <div className="cf-fallback-toggle">
          <button
            type="button"
            className="cf-btn cf-btn-small"
            aria-pressed={fallbackView === 'back'}
            onClick={() => setFallbackView('back')}
          >
            Back View
          </button>
          <button
            type="button"
            className="cf-btn cf-btn-small"
            aria-pressed={fallbackView === 'front'}
            onClick={() => setFallbackView('front')}
          >
            Front View
          </button>
        </div>
        <Shirt
          club={activeClub}
          number={activePlayer.n}
          name={activePlayer.displayName}
          view={fallbackView}
          size={200}
        />
        <p className="cf-fallback-note">Static preview active (WebGL off or reduced-motion enabled).</p>
      </div>
    </div>
  )

  return (
    <section className="cf-player-viewer" id="player-3d" aria-labelledby="pv-h">
      <div className="cf-pv-head">
        <h2 id="pv-h" className="cf-h2">
          Rotatable 3D player models
        </h2>
        <p className="cf-lede">
          Stylised athletic figures rendered in each club&rsquo;s authentic kit colours, with names and squad numbers mapped across the back.
          Drag to rotate 360°, inspect kit patterns, and pick players from the European elite.
        </p>
      </div>

      {/* Club Selector Tabs */}
      <div className="cf-club-tabs" role="tablist" aria-label="Select club">
        {CLUB_KEYS.map((cid) => {
          const c = CLUBS[cid]
          const isSelected = cid === activeClub
          return (
            <button
              key={cid}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className="cf-club-tab"
              data-active={isSelected}
              onClick={() => handleClubChange(cid)}
              style={
                isSelected
                  ? { borderColor: c.accent, backgroundColor: 'rgba(241, 245, 233, 0.08)' }
                  : undefined
              }
            >
              <Crest club={cid} size={28} />
              <span className="cf-club-tab-name">{c.name}</span>
            </button>
          )
        })}
      </div>

      {/* Main 3D Experience Grid */}
      <div className="cf-pv-grid">
        {/* Left: 3D Stage */}
        <div className="cf-stage-column">
          <div className="cf-stage-box" tabIndex={0} aria-label="3D Player Viewer. Drag or swipe horizontally to rotate.">
            {allowed ? (
              <WebGLGate className="cf-pv-gate" fallback={fallback}>
                {(active) => (
                  <Suspense fallback={<div className="cf-pv-loading">Loading 3D kit model…</div>}>
                    <LazyPlayerScene
                      active={active}
                      clubId={activeClub}
                      player={activePlayer}
                      autoRotate={autoRotate}
                      viewAngle={viewAngle}
                    />
                  </Suspense>
                )}
              </WebGLGate>
            ) : (
              fallback
            )}

            {/* Overlaid Viewer Controls */}
            {allowed && (
              <div className="cf-stage-overlay">
                <div className="cf-stage-hints" aria-hidden="true">
                  <span>Drag to rotate 360° · Scroll to zoom</span>
                </div>
                <div className="cf-stage-actions">
                  <button
                    type="button"
                    className="cf-btn cf-btn-small"
                    aria-pressed={viewAngle === 'front'}
                    onClick={() => {
                      setViewAngle('front')
                      setAutoRotate(false)
                    }}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    className="cf-btn cf-btn-small"
                    aria-pressed={viewAngle === 'back'}
                    onClick={() => {
                      setViewAngle('back')
                      setAutoRotate(false)
                    }}
                  >
                    Back (# &amp; Name)
                  </button>
                  <button
                    type="button"
                    className="cf-btn cf-btn-small"
                    aria-pressed={autoRotate}
                    onClick={() => {
                      setAutoRotate((r) => !r)
                      setViewAngle('free')
                    }}
                  >
                    {autoRotate ? 'Pause 360°' : 'Rotate 360°'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Player Dossier Card */}
          <div className="cf-player-dossier" aria-live="polite">
            <div className="cf-dossier-main">
              <span className="cf-dossier-number" style={{ color: legibleAccent(club.accent) }}>
                {activePlayer.n}
              </span>
              <div className="cf-dossier-meta">
                <div className="cf-dossier-badge-row">
                  <Crest club={activeClub} size={28} />
                  <span className="cf-dossier-club">{club.name}</span>
                  <span className="cf-dossier-pos">{activePlayer.pos}</span>
                </div>
                <h3 className="cf-dossier-name">{activePlayer.name}</h3>
                <p className="cf-dossier-role">{activePlayer.role}</p>
              </div>
            </div>

            <dl className="cf-dossier-stats">
              <div>
                <dt>Country</dt>
                <dd>{activePlayer.country}</dd>
              </div>
              <div>
                <dt>Preferred Foot</dt>
                <dd>{activePlayer.foot}</dd>
              </div>
              <div>
                <dt>Height</dt>
                <dd>{activePlayer.height}</dd>
              </div>
              <div>
                <dt>Overall</dt>
                <dd className="cf-dossier-ovr">{activePlayer.rating}</dd>
              </div>
            </dl>

            <p className="cf-dossier-trait">
              <strong>Tactical Profile:</strong> {activePlayer.trait}
            </p>
          </div>
        </div>

        {/* Right: Squad Picker Roster */}
        <div className="cf-roster-column">
          <div className="cf-roster-header">
            <h3 className="cf-h3">Starting XI</h3>
            <span className="cf-roster-sub">{club.manager} &bull; 4-3-3</span>
          </div>

          <ol className="cf-player-list" aria-label={`${club.name} starting squad`}>
            {club.xi.map((p, idx) => {
              const isSelected = !isBench && playerIndex === idx
              return (
                <li key={p.n}>
                  <button
                    type="button"
                    className="cf-player-row"
                    data-selected={isSelected}
                    onClick={() => selectPlayer(idx, false)}
                    aria-pressed={isSelected}
                  >
                    <span className="cf-row-n" style={isSelected ? { color: legibleAccent(club.accent) } : undefined}>
                      {p.n}
                    </span>
                    <span className="cf-row-name">{p.name}</span>
                    <span className="cf-row-pos">{p.pos}</span>
                    <span className="cf-row-ovr">{p.rating}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="cf-roster-header cf-bench-header">
            <h3 className="cf-h3">Substitutes</h3>
          </div>

          <ol className="cf-player-list" aria-label={`${club.name} bench players`}>
            {club.bench.map((p, idx) => {
              const isSelected = isBench && playerIndex === idx
              return (
                <li key={p.n}>
                  <button
                    type="button"
                    className="cf-player-row"
                    data-selected={isSelected}
                    onClick={() => selectPlayer(idx, true)}
                    aria-pressed={isSelected}
                  >
                    <span className="cf-row-n" style={isSelected ? { color: legibleAccent(club.accent) } : undefined}>
                      {p.n}
                    </span>
                    <span className="cf-row-name">{p.name}</span>
                    <span className="cf-row-pos">{p.pos}</span>
                    <span className="cf-row-ovr">{p.rating}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
