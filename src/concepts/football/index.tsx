import { useState } from 'react'
import '@fontsource-variable/anybody/wdth.css'
import '@fontsource-variable/hanken-grotesk'
import './football.css'
import { ConceptStrip } from '../../shared/ConceptStrip'
import { useMeta } from '../../shared/meta'
import { CelebrationProvider } from './celebrate'
import { Nav } from './Nav'
import { Hero } from './Hero'
import { PlayerViewer } from './PlayerViewer'
import { KickSection } from './KickSection'
import { Tactics } from './Tactics'
import { Matchday } from './Matchday'
import { Squads, Footer } from './Squads'
import type { ClubId, Player } from './data'

export default function FootballPage() {
  useMeta(
    'Footonomy: The Interactive Football Showpiece | Concept build by Kahaan Kapasi',
    'What Footonomy could be: Rotatable 3D player models with real European clubs, a WebGL stadium fly-through, free-kick physics simulation, tactics board and live matchday scoreboard.',
  )

  const [selectedClub, setSelectedClub] = useState<ClubId>('real-madrid')

  const handleInspectFromSquads = (club: ClubId, _player: Player) => {
    setSelectedClub(club)
  }

  return (
    <div className="c-football">
      <ConceptStrip brand="Footonomy" note="Concept build for Footonomy. Unofficial; clubs and players belong to their owners." />

      <CelebrationProvider>
        <Nav />
        <main className="cf-main">
          <Hero />
          <PlayerViewer selectedClub={selectedClub} onSelectClub={setSelectedClub} />
          <KickSection />
          <Tactics />
          <Matchday />
          <Squads onInspectPlayer={handleInspectFromSquads} />
          <Footer />
        </main>
      </CelebrationProvider>
    </div>
  )
}
