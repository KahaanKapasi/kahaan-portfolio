import CaseLayout from '../_shared/CaseLayout'
import { Figure, PlateGrid, Prose, Section, StackTable, type Shot } from '../_shared/parts'
import LivePreview from './LivePreview'
import '@fontsource-variable/jetbrains-mono'
import './flippr-live.css'

const B = '/work/flippr-live/'
const shot = (f: string, w: number, h: number, alt: string, caption: string): Shot => ({ src: `${B}${f}.webp`, width: w, height: h, alt, caption })

const dHero = shot('desktop-hero', 1440, 768, 'flippr.live on desktop: a blue header with Contact us, Login and App Store and Google Play badges, the headline "Local cricket. Live scoring. Real matches." with a short line and store badges, and a phone showing live ball-by-ball commentary.', 'Desktop hero at 1440 wide.')
const dTeams = shot('desktop-teams', 1440, 684, 'The "Your teams. Your tournaments." section on desktop: a phone showing a live scoring pad on the left and the heading and a short paragraph on the right.', 'Desktop: teams and tournaments.')
const dScoring = shot('desktop-scoring', 1440, 683, 'The "Score every local match live" section on desktop: the heading and a short paragraph on the left and a phone with the scoring pad on the right.', 'Desktop: scoring every local match.')
const dClose = shot('desktop-close', 1440, 388, 'The closing call to action on a blue background: "Ready to play local cricket?", a line saying 100% free with no entry fees, no deposits and no real-money gaming, and the two store badges.', 'Desktop: closing call to action.')
const mHero = shot('mobile-hero', 780, 1878, 'flippr.live on a phone: the blue header with Login and a menu, a phone showing live commentary, the headline "Local cricket. Live scoring. Real matches." and the two store badges.', 'Mobile hero at 390 wide.')
const mTeams = shot('mobile-teams', 780, 1522, 'The "Your teams. Your tournaments." section on a phone: heading, a short paragraph and a phone showing the scoring pad.', 'Mobile: teams and tournaments.')
const mClose = shot('mobile-close', 780, 714, 'The closing call to action on a phone: "Ready to play local cricket?" with the free, no-deposit line and the store badges.', 'Mobile: closing call to action.')
const GROUP = [dHero, dTeams, dScoring, dClose, mHero, mTeams, mClose]

export default function FlipprLiveCase() {
  return (
    <CaseLayout
      slug="flippr-live"
      title="flippr.live"
      summary="The public face of Flippr: a marketing homepage that sends people to the App Store and Play Store, and the host that opens match and invite links in the app when it is installed."
      role="Flippr product team at Veefin Solutions Ltd"
      stack="React, Vite, nginx"
      status="Live"
      links={[
        { label: 'flippr.live', href: 'https://flippr.live', external: true },
        { label: 'Mobile app case', href: '/work/flippr-app' },
      ]}
      credit="Marketing site for the Flippr cricket app"
      accent="#1f3fb5"
      metaTitle="flippr.live case study | Kahaan Kapasi"
      metaDescription="Case study: flippr.live, the marketing site for Flippr, a local cricket scoring app. Live preview, store links, and how the page was built."
      hero={<LivePreview />}
    >
      <Section id="what" title="What it is">
        <Prose lead>
          <p>
            flippr.live is the marketing homepage for Flippr, a free local cricket scoring app. The headline on the live page is
            “Local cricket. Live scoring. Real matches.” The page asks people to download the app, not to score in the browser.
          </p>
          <p>
            It is a different product from the live auction console at auction.flippr.live, and a different surface from the Flutter
            app itself. This page sells the app and catches the links that should open it.
          </p>
        </Prose>
      </Section>

      <Section id="screens" title="The live page" wide>
        <PlateGrid layout="duo">
          <Figure shot={dTeams} plate="01" caption="Desktop: teams and tournaments." group={GROUP} />
          <Figure shot={dScoring} plate="02" caption="Desktop: scoring every local match." group={GROUP} />
        </PlateGrid>
        <PlateGrid layout="wide">
          <Figure shot={dClose} plate="03" caption="Desktop: closing call to action." group={GROUP} />
        </PlateGrid>
        <PlateGrid layout="phones">
          <Figure shot={mHero} plate="04" caption="Phone: hero." group={GROUP} />
          <Figure shot={mTeams} plate="05" caption="Phone: teams and tournaments." group={GROUP} />
          <Figure shot={mClose} plate="06" caption="Phone: closing call to action." group={GROUP} />
        </PlateGrid>
        <p className="wl-shots-note">
          Screenshots of https://flippr.live captured in a clean browser profile at 1440 and 390 pixels wide. One tab label inside the
          app preview is blurred. The app imagery belongs to Flippr.
        </p>
      </Section>

      <Section id="does" title="What it does">
        <ul className="wl-beats">
          <li>
            <h3>Send people to the stores</h3>
            <p>
              App Store and Google Play badges sit on the hero and again at the close. The copy is explicit: 100% free, no entry
              fees, no deposits, no real-money gaming.
            </p>
          </li>
          <li>
            <h3>Explain the product in three beats</h3>
            <p>
              Follow every ball live. Your teams and tournaments, including career stats from matches nearby. Score every local
              match, with authorised scorers writing the ball-by-ball record.
            </p>
          </li>
          <li>
            <h3>Open the app from a link</h3>
            <p>
              Associated-domain files for Apple and Android live on this host, so a match, team, player, ground or invite URL can
              hand off to the installed app.
            </p>
          </li>
          <li>
            <h3>Catch the miss</h3>
            <p>
              If the app is not installed, fallback routes still render a page (open-in-Flippr) instead of dumping the person on
              the marketing home with no context. Privacy lives here too.
            </p>
          </li>
        </ul>
        <ul className="wl-routes" aria-label="Deep-link path prefixes on flippr.live">
          <li>/m</li>
          <li>/t</li>
          <li>/p</li>
          <li>/team</li>
          <li>/g</li>
          <li>/i</li>
          <li>/handoff</li>
          <li>/privacy</li>
        </ul>
      </Section>

      <Section id="built" title="How it was built">
        <Prose>
          <p>
            The live page is a React single-page app built with Vite and served by nginx. Fonts are TASA Orbiter, the same family
            the Flutter app uses, so the store listing, the website and the client share one voice. Theme follows the system
            (light or dark) from a small boot script before React hydrates.
          </p>
          <p>
            Two hosts, two jobs: flippr.live is the website and the link files; the API lives on a separate API host so a store
            landing page never shares a process with scoring. The well-known Apple and Android association files are served as
            JSON, not HTML, which is the difference between a tap opening the app and a tap bouncing.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'Page', items: 'React, Vite, TASA Orbiter, system light/dark' },
            { name: 'Host', items: 'nginx static dist, SPA fallback to index.html' },
            { name: 'App links', items: 'apple-app-site-association, assetlinks.json, open-in-app fallback routes' },
            { name: 'Related', items: 'Flutter app case study, auction.flippr.live for the hall auction' },
          ]}
        />
      </Section>
    </CaseLayout>
  )
}
