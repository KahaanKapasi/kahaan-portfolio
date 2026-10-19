import CaseLayout from '../_shared/CaseLayout'
import { Figure, PlateGrid, Prose, Rows, Section, StackTable } from '../_shared/parts'
import LivePreview from './LivePreview'
import { SHOTS as S, DESKTOP_REEL } from './shots'
import './auction.css'

const ico = (d: string) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

export default function AuctionCase() {
  return (
    <CaseLayout
      slug="auction-flippr-live"
      title="auction.flippr.live"
      summary="A live cricket player-auction platform. One player on the block, bids from every captain's phone, a projector stage for the hall and a broadcast overlay for the stream, all staying in step."
      role="Developer on the Flippr team"
      stack="React 18, Vite, TypeScript, Tailwind, react-three-fiber, STOMP over SockJS"
      status="Live in production"
      links={[{ label: 'Open the live site', href: 'https://auction.flippr.live', external: true }]}
      accent="#8a5a00"
      metaTitle="auction.flippr.live case study | Kahaan Kapasi"
      metaDescription="Case study: a live cricket player-auction platform with an operator console, captain bidding on phones, a projector stage and an OBS overlay, built with React, three.js and STOMP real-time."
      hero={<LivePreview poster={S.stageDesktop} reel={DESKTOP_REEL} />}
    >
      <Section id="overview" title="What it does">
        <Prose lead>
          <p>
            A tournament auction puts four audiences in one room: the hall watching a projector, captains bidding for their teams, an
            operator closing each sale, and a stream audience at home. Flippr Auction keeps all four looking at the same lot.
          </p>
          <p>
            It is the live room for a cricket tournament player auction: one player on the block, bids from captains, a hall stage and an
            operator who closes the sale. The measure of success is a room that stays in sync from the first player to the last squad.
          </p>
          <p>
            An organiser signs in, creates a tournament, loads teams and players, then runs the auction from the operator console.
            Captains join a team room on their phone. The hall opens the public stage. OBS pulls the overlay. When the auction ends, the
            room keeps a team summary and a full history.
          </p>
        </Prose>
      </Section>

      <Section id="surfaces" title="Four surfaces, one lot">
        <ul className="wa-surfaces">
          <li>
            {ico('M3 5h18v11H3zM8 20h8M12 16v4')}
            <strong>Stage</strong>
            <span>The hall projector</span>
          </li>
          <li>
            {ico('M4 6h16M4 12h16M4 18h10')}
            <strong>Operator</strong>
            <span>The desk that closes sales</span>
          </li>
          <li>
            {ico('M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zM11 18h2')}
            <strong>Captain</strong>
            <span>Bidding from a phone</span>
          </li>
          <li>
            {ico('M3 7h13v10H3zM16 10l5-3v10l-5-3')}
            <strong>Overlay</strong>
            <span>The broadcast scene</span>
          </li>
        </ul>
        <Rows
          items={[
            {
              name: 'Operator console',
              text: 'Runs from a Console Dock on the live-control screen, with tabs for Stage, Overlay, Camera, Pool, Players, Sponsors and Details. Panels can be popped into named windows, and the backtick key toggles the dock so the operator keeps the screen for the lot.',
            },
            {
              name: 'Captain room',
              text: "Each captain joins their team's room on a phone and sees the player on the block, the current bid, quick raise buttons and the latest bids. Bidding is tied to a signed-in account.",
            },
            {
              name: 'Public stage',
              text: 'The hall projector at a public address per tournament. It shows the player, the live bid and the leading team, with counters for sold, unsold and remaining, and a team purse table. The 3D gavel strikes when a player is sold.',
            },
            {
              name: 'OBS overlay',
              text: 'A transparent broadcast scene with a scoreboard strip, a purse board and a lower third for the player on the block, plus a green-screen option. Camera and program scenes sit beside it, and any phone can become the venue camera.',
            },
            {
              name: 'Team summary and history',
              text: 'Every purse updates the moment the hammer falls. Finished rooms keep a team summary and a searchable sales history with sold and unsold filters, and a stream link appears on the auction page when a broadcast is set up.',
            },
          ]}
        />
      </Section>

      <Section id="screens" title="Screens from the product" wide>
        <PlateGrid layout="wide-tall">
          <Figure shot={S.desktop} plate="01" caption="The landing hero, with a sample auction a visitor can play." group={ALL} eager />
          <Figure shot={S.mobile} plate="02" caption="The same hero on a phone." group={ALL} />
        </PlateGrid>
        <PlateGrid layout="wide-tall">
          <Figure shot={S.stageDesktop} plate="03" caption="The public stage: lot card, gavel, counters and purses." group={ALL} />
          <Figure shot={S.stageMobile} plate="04" caption="The stage on a phone. The player photo is blurred here." group={ALL} />
        </PlateGrid>
        <PlateGrid layout="duo">
          <Figure shot={S.overlayWide} plate="05" caption="The broadcast overlay on white, so its transparent areas are visible." group={ALL} />
          <Figure shot={S.syncDesktop} plate="06" caption="One lot, every screen: the stage view on the landing page." group={ALL} />
        </PlateGrid>
        <div className="wa-trio-tall">
          <PlateGrid layout="trio">
            <Figure shot={S.captain} plate="07" caption="Captain room." group={ALL} />
            <Figure shot={S.camera} plate="08" caption="Venue camera on a phone." group={ALL} />
            <Figure shot={S.teamMobile} plate="09" caption="Team dashboard." group={ALL} />
          </PlateGrid>
        </div>
        <PlateGrid layout="duo">
          <Figure shot={S.summaryDesktop} plate="10" caption="Auction board: teams, purses and squad slots." group={ALL} />
          <Figure shot={S.historyDesktop} plate="11" caption="Auction record with totals and a sales timeline." group={ALL} />
        </PlateGrid>
        <PlateGrid layout="duo">
          <Figure shot={S.bento} plate="12" caption="Purses, overlay, phone camera, streaming and history." group={ALL} />
          <Figure shot={S.syncMobile} plate="13" caption="The stage, operator desk and captain phone, stacked for mobile." group={ALL} />
        </PlateGrid>
        <PlateGrid layout="trio">
          <Figure shot={S.browseMobile} plate="14" caption="Browse auctions by status." group={ALL} />
          <Figure shot={S.summaryMobile} plate="15" caption="Auction board on a phone." group={ALL} />
          <Figure shot={S.historyMobile} plate="16" caption="Auction record on a phone." group={ALL} />
        </PlateGrid>
        <PlateGrid layout="duo">
          <Figure shot={S.overlayKey} plate="17" caption="The overlay on a green key background." group={ALL} />
          <Figure shot={S.teamDesktop} plate="18" caption="Team dashboard on desktop." group={ALL} />
        </PlateGrid>
        <PlateGrid layout="duo">
          <Figure shot={S.contactDesktop} plate="19" caption="Organiser enquiry form." group={ALL} />
          <Figure shot={S.footerDesktop} plate="20" caption="Closing call to action and the accent switcher." group={ALL} />
        </PlateGrid>
        <div className="wa-trio-tall">
          <PlateGrid layout="duo">
            <Figure shot={S.loginMobile} plate="21" caption="Sign in with a mobile number." group={ALL} />
            <Figure shot={S.contactMobile} plate="22" caption="The enquiry form on a phone." group={ALL} />
          </PlateGrid>
        </div>
        <p className="wa-privacy">
          These are screenshots of test rooms. Player photos and the host tournament's logo are blurred. Sample players on the landing page are invented and carry a visible Sample tag in the product.
        </p>
      </Section>

      <Section id="build" title="How it is built">
        <Prose>
          <p>
            The interface is one night-hall visual language for every surface: the landing page, the operator tools, the captain room and
            the live stage all use the same tokens, type and pill controls, so nothing feels like a separate product. A single brand
            token drives the accent, and a footer switch lets an organiser pick gold, blue or a custom colour that is saved and applied on
            the next page.
          </p>
          <p>
            Real-time state travels over STOMP on SockJS, so the lot, the bids and the purses move together on the stage, the operator
            desk and every phone. The hero stage is a react-three-fiber scene: a spotlit lot card and a gavel that strikes on a sale. It
            pauses when off screen, and a plain DOM lot card replaces it when WebGL is missing or the visitor prefers reduced motion.
            Elsewhere, motion is limited to transform and opacity.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'Front end', items: 'React 18, Vite, TypeScript, Tailwind with a small token set (ground, paper, inset, brand)' },
            { name: 'Real time', items: 'STOMP over SockJS for lot, bid and purse state across stage, operator and captains' },
            { name: '3D', items: 'react-three-fiber hero stage with a DOM fallback and offscreen pause' },
            { name: 'Broadcast', items: 'Transparent OBS overlay, camera and program scenes, optional YouTube link per auction' },
          ]}
        />
        <ul className="wa-routes" aria-label="Routes in the app">
          {['Home', 'Browse', 'Login', 'Admin console', 'Captain room', 'Public stage', 'OBS overlay', 'Camera', 'Program', 'Team summary', 'History'].map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>
    </CaseLayout>
  )
}

const ALL = [
  S.desktop, S.mobile, S.stageDesktop, S.stageMobile, S.overlayWide, S.syncDesktop, S.captain, S.camera, S.teamMobile,
  S.summaryDesktop, S.historyDesktop, S.bento, S.syncMobile, S.browseMobile, S.summaryMobile, S.historyMobile,
  S.overlayKey, S.teamDesktop, S.contactDesktop, S.footerDesktop, S.loginMobile, S.contactMobile,
]
