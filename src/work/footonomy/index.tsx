import CaseLayout from '../_shared/CaseLayout'
import { BrowserFrame, Figure, PlateGrid, Prose, Rows, Section, StackTable, type Shot } from '../_shared/parts'
import { useLightbox } from '../_shared/Lightbox'
import './footonomy.css'

const B = '/work/footonomy/'
const shot = (f: string, w: number, h: number, alt: string, caption: string): Shot => ({ src: `${B}${f}.webp`, width: w, height: h, alt, caption })

const feed = shot('matches-feed', 1232, 770, 'Matches screen of the built app in dark mode: a day switcher, a league filter, fixtures grouped by league with scores, and a Match Spotlight panel.', 'Matches feed.')
const detail = shot('match-detail', 968, 407, 'Match centre header for a Liverpool against Manchester City match with the score, tabs for Overview, Stats, Lineups, H2H and Table, and a statistics comparison with bars.', 'Match centre, statistics tab.')
const lineup = shot('lineup', 693, 330, 'Lineups tab with a football pitch showing a starting eleven placed by formation.', 'Lineups on a pitch.')
const standings = shot('standings', 693, 330, 'Premier League tournament page with a standings table showing played, won, drawn, lost, goal difference and points.', 'League standings.')
const team = shot('team', 629, 352, 'Team page for a club with a crest, a follow button, tabs for Overview, Matches and Squad, and a list of latest results.', 'Team page.')
const games = shot('games-hub', 629, 352, 'Games hub listing five daily football games: Draft, Tic tac toe, Who are ya, Career path and Blind ranking.', 'Games hub.')
const whoareya = shot('who-are-ya', 629, 352, 'Who are ya game: a guess box and a list of earlier guesses with nationality and position hints.', 'Who are ya.')
const search = shot('search', 629, 352, 'Search results for a club name, grouped into teams, players and tournaments with follow buttons.', 'Search.')
const GROUP = [feed, detail, lineup, standings, team, games, whoareya, search]

function HeroShot() {
  const lb = useLightbox()
  return (
    <BrowserFrame url="Footonomy (built app)" className="wfo-frame">
      <button type="button" className="wfo-tap" onClick={() => lb.open(GROUP, 0)} aria-label="Enlarge: matches feed screenshot">
        <img src={feed.src} width={feed.width} height={feed.height} alt={feed.alt} decoding="async" />
      </button>
    </BrowserFrame>
  )
}

export default function FootonomyCase() {
  return (
    <CaseLayout
      slug="footonomy"
      title="Footonomy"
      summary="A football companion web app: live scores pushed as they change, a match centre with pitch lineups, standings, a feed of the teams you follow, search, and five daily games on one shared login. A private admin API lets its owner run it from Content Studio."
      role="Team member on a three-person academic project"
      stack="React 19, Vite, Tailwind, Spring Boot 3, PostgreSQL with Flyway, WebSockets, Redis, Docker"
      status="Academic project, built for college"
      credit="Built as part of a three-person academic team project."
      accent="#5a34b8"
      metaTitle="Footonomy case study | Kahaan Kapasi"
      metaDescription="Case study: Footonomy, a football companion web app with live scores over WebSockets, a match centre with pitch lineups, standings, a following feed, search and five daily games. Built with a 3-person team using React 19, Spring Boot and PostgreSQL."
      hero={<HeroShot />}
    >
      <Section id="overview" title="What it is">
        <Prose lead>
          <p>
            Big football apps are cluttered, and it takes effort to see what matters to your teams. Footonomy pulls the useful parts into
            one companion: what is on today, how a match is going, where a team sits in its league, and a feed built from the teams and
            tournaments you follow. Five short daily games give people a reason to open it when there is no match on.
          </p>
          <p>
            It was built as an academic project by a team of three, so the credit here is shared, and it ships as three connected parts:
            the football app, a games service on a shared login, and Content Studio, the private tool that administers it. The pictures
            on this page are screenshots of the built app.
          </p>
        </Prose>
        <div className="w-gap" />
        <dl className="wfo-nums">
          <div>
            <dt>Seconds between live-score checks</dt>
            <dd>30</dd>
          </div>
          <div>
            <dt>Competitions covered</dt>
            <dd>28</dd>
          </div>
          <div>
            <dt>Solo games with one shared login</dt>
            <dd>5</dd>
          </div>
          <div>
            <dt>Database tables, versioned with Flyway</dt>
            <dd>16</dd>
          </div>
        </dl>
      </Section>

      <Section id="features" title="What it does">
        <Rows
          items={[
            { name: 'Live scores', text: 'Matches for three days back to three days ahead, with a date strip and a league filter, grouped by competition. Live games show their minute, and a spotlight card picks out a match. When a score, status or minute changes it is pushed to every open page without a reload.' },
            { name: 'Match centre', text: 'Overview with an events timeline of goals, cards and substitutions, plus recent form. Stats with comparison bars. Lineups on a 2D pitch placed by formation, with a list view. Head to head, and the league table with both teams highlighted.' },
            { name: 'Teams, players and tournaments', text: 'Team pages with form badges, results and a squad grouped by position. Player pages with a season statistics table. 28 curated competitions, each with standings and fixtures.' },
            { name: 'Search', text: 'One search box across teams, players and tournaments, with instant results and keyboard support.' },
            { name: 'Sign-in and following', text: 'Passwordless: enter an email, get a six-digit code, sign in. A new account is created on the first code. Follow teams and tournaments for a feed of just their matches, live first, then scheduled, then finished.' },
            { name: 'Fan reactions and a banner', text: 'Fire, love and wow reactions on a match, shared by every visitor. The owner can switch reactions off, publish a site-wide banner such as planned maintenance, and the site re-checks it every two minutes.' },
          ]}
        />
      </Section>

      <Section id="games" title="The five games">
        <Prose>
          <p>
            The games are a separate Spring Boot service with its own database. It never issues tokens: it validates the JWTs Footonomy
            issues, so one login works everywhere, and a guest is identified by a random id kept in the browser. The game pages live
            inside the Footonomy app, with loading, already-played, rate-limited and error states on every one.
          </p>
        </Prose>
        <div className="w-gap" />
        <Rows
          items={[
            { name: 'Draft, weekly', text: 'Fill 11 slots from a player pool. Each pick is scored from six attributes, and the total is compared with the best possible squad, found with the Hungarian assignment algorithm. Score is total over optimal, out of 100.' },
            { name: 'Footy Tic Tac Toe, daily', text: 'Name a player who fits both the row and the column in each of nine cells, then submit once. Answers match after accent folding.' },
            { name: 'Who Are Ya, daily', text: 'Find the mystery player in up to eight guesses; each guess shows whether nationality and position match.' },
            { name: 'Career Path, daily', text: 'Clubs are revealed one at a time and you guess the footballer. Each wrong guess reveals another club.' },
            { name: 'Blind Ranking, weekly', text: 'Rank ten players from best to worst, then see how the community voted.' },
          ]}
        />
        <p className="wfo-note">
          The 28 players and all clues are hand-typed placeholders, labelled as demo content in the interface. Player-versus-player
          games, leaderboards and streak screens are not built.
        </p>
      </Section>

      <Section id="screens" title="Screens" wide>
        <PlateGrid layout="duo">
          <Figure shot={feed} plate="01" caption="Matches feed." group={GROUP} />
          <Figure shot={detail} plate="02" caption="Match centre, statistics tab." group={GROUP} />
        </PlateGrid>
        <PlateGrid layout="duo">
          <Figure shot={lineup} plate="03" caption="Lineups on a pitch." group={GROUP} />
          <Figure shot={standings} plate="04" caption="League standings." group={GROUP} />
        </PlateGrid>
        <PlateGrid layout="duo">
          <Figure shot={team} plate="05" caption="Team page." group={GROUP} />
          <Figure shot={games} plate="06" caption="Games hub." group={GROUP} />
        </PlateGrid>
        <PlateGrid layout="duo">
          <Figure shot={whoareya} plate="07" caption="Who are ya." group={GROUP} />
          <Figure shot={search} plate="08" caption="Search." group={GROUP} />
        </PlateGrid>
        <p className="wfo-note">
          Screenshots of the built app. The sample fixtures use real league and club names as placeholder content.
        </p>
      </Section>

      <Section id="architecture" title="Architecture">
        <Prose>
          <p>
            Footonomy works as a backend-for-frontend: one API shaped for the screens that merges several sources into ready-to-render
            views. It reads public football data through its own layer instead of a paid API, so the front end never talks to a third
            party. That layer has a tiered cache, with lifetimes from 30 seconds to 6 hours, caps concurrency, uses timeouts, and serves
            the last good copy if a source fails, so a page does not break because an upstream is down.
          </p>
          <p>
            Live scores come from a scheduler that runs every 30 seconds. If nobody has viewed a match recently it does nothing;
            otherwise it refreshes only the leagues with a live or imminent match, compares each match with its previous status, score
            and minute, and publishes only the changes on a WebSocket topic. The browser replaces the matching item in place and briefly
            highlights it.
          </p>
          <p>
            Operations were designed in, not added later: indexed foreign keys and unique constraints so follows are idempotent, rate
            limiting, runtime feature switches, health and latency metrics with Prometheus and Grafana alert rules, JSON logs with
            request ids, an audit log, and non-root Docker images behind nginx.
          </p>
        </Prose>
      </Section>

      <Section id="studio" title="Run from Content Studio">
        <Prose>
          <p>
            Footonomy serves an admin API on a separate port, only when an admin token is set, only with a bearer token, bound to
            loopback by default. On the public port those paths return 404. Content Studio&apos;s Footonomy tab is the only client: it
            shows users, sign-ups, follows, request rate, errors, p95 latency, cache hit rate and live connections, and can suspend or
            delete users, turn sign-ups, reactions or live updates on or off, publish the banner and flush the cache. Every action lands
            in Footonomy&apos;s audit log. Studio calls out; Footonomy never calls Studio.
          </p>
        </Prose>
      </Section>

      <Section id="build" title="How it is built">
        <Prose>
          <p>
            The front end is React 19 with Vite and Tailwind, a dark, data-dense interface where the numbers get the weight: large
            scores, tabular figures and clear live states. It was checked at 320, 375, 768 and 1280 pixels, with skip links, visible
            focus, keyboard support in search and reduced-motion support. The back end is Spring Boot 3 on Java 21 with Flyway
            migrations; the games service is Spring Boot on Java 17.
          </p>
          <p>
            Automated tests cover the back ends: 11 for Footonomy, mostly the admin port and security boundaries, 23 for the games, and
            482 for Content Studio at the time of submission. The front ends were checked by hand rather than by a test suite.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'Front end', items: 'React 19, React Router 7, Vite, Tailwind' },
            { name: 'Back end', items: 'Spring Boot 3.3 on Java 21, Spring Security, Spring Data JPA, JWT sign-in' },
            { name: 'Data', items: 'PostgreSQL with Flyway migrations; 16 tables' },
            { name: 'Real time', items: 'STOMP over WebSocket, pushing only changed matches' },
            { name: 'Games service', items: 'Spring Boot 3 on Java 17, PostgreSQL, JWT validation, optimal-assignment scoring' },
            { name: 'Operations', items: 'Redis, Docker, nginx, Prometheus and Grafana, JSON logs' },
            { name: 'Team', items: 'Three people, with a faculty guide. Academic project.' },
          ]}
        />
      </Section>

      <Section id="limits" title="Known limits">
        <Prose>
          <ul>
            <li>Football data comes from a public source and would need a licensed feed or written permission before any commercial launch.</li>
            <li>Sign-in codes are shown on screen in development; email delivery is planned.</li>
            <li>No load test has been run, so the caching and indexing choices are design-level, not measured capacity.</li>
            <li>The notifications toggle is not functional and says so in settings.</li>
          </ul>
        </Prose>
      </Section>
    </CaseLayout>
  )
}
