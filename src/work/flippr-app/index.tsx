import CaseLayout from '../_shared/CaseLayout'
import { PhoneFrame, Prose, Rows, Section, StackTable, type Shot } from '../_shared/parts'
import { useLightbox } from '../_shared/Lightbox'
import Architecture from './Architecture'
import './flippr-app.css'

const B = '/work/flippr-app/'
const live: Shot = {
  src: `${B}screen-live-scoring.webp`,
  width: 443,
  height: 960,
  alt: 'Live scoring screen in the Flippr app: a dark scoreboard showing 104 for 9 after 18.3 overs, the two batters and the current bowler with the last six balls, and a pad of run buttons for 0 to 3, four, six, wide, no-ball, byes, leg byes, out and undo.',
  caption: 'Live scoring: the scorer’s pad.',
}
const matches: Shot = {
  src: `${B}screen-my-matches.webp`,
  width: 443,
  height: 960,
  alt: 'My Matches screen in the Flippr app with Matches and Tournaments tabs, an Upcoming, Live and Past switch, and two match cards with a countdown, stats and points table links.',
  caption: 'My matches: upcoming, live and past.',
}
const create: Shot = {
  src: `${B}screen-create-tournament.webp`,
  width: 443,
  height: 960,
  alt: 'Create a Tournament form in the Flippr app with banner and logo upload, tournament name, organiser details, a list of grounds and start and end dates.',
  caption: 'Create a tournament.',
}
const GROUP = [live, matches, create]

function Phone({ shot, index }: { shot: Shot; index: number }) {
  const lb = useLightbox()
  return (
    <PhoneFrame>
      <button type="button" className="wf-tap" onClick={() => lb.open(GROUP, index)} aria-label={`Enlarge: ${shot.caption}`}>
        <img src={shot.src} width={shot.width} height={shot.height} alt={shot.alt} loading="eager" decoding="async" />
      </button>
    </PhoneFrame>
  )
}

export default function FlipprAppCase() {
  return (
    <CaseLayout
      slug="flippr-app"
      title="Flippr mobile app"
      summary="A B2C cricket platform: ball-by-ball live scoring, tournaments, auctions, invites and notifications, sitting on a microservice backend. I owned the system architecture and backend design, and was a core developer on the Flutter app."
      role="Technical solutionist at Veefin Solutions Ltd (internship, Nov 2025 to present). System architecture, backend design, core mobile developer."
      stack="Flutter, BLoC, go_router, Dio, STOMP, Firebase Messaging, Java services, Postgres, Redis, Docker on AWS EC2"
      status="In development. A B2C sports app."
      links={[
        { label: 'Marketing site', href: '/work/flippr-live' },
        { label: 'Live auctions', href: '/work/auction-flippr-live' },
      ]}
      credit="Built as part of the Flippr product team at Veefin Solutions Ltd"
      accent="#1f3fb5"
      metaTitle="Flippr mobile app case study | Kahaan Kapasi"
      metaDescription="Case study: Flippr, a Flutter cricket platform with a microservice backend. Kahaan owned system architecture and backend design and was a core developer on the mobile app."
      hero={
        <div className="wf-stage">
          <div className="wf-phones">
            <Phone shot={live} index={0} />
            <Phone shot={matches} index={1} />
            <Phone shot={create} index={2} />
          </div>
          <ol className="wf-caps">
            <li>
              <b>Live</b>The scorer’s pad, built for one hand.
            </li>
            <li>
              <b>Matches</b>Upcoming, live and past in one list.
            </li>
            <li>
              <b>Setup</b>Create a tournament with the minimum of fields.
            </li>
          </ol>
        </div>
      }
    >
      <Section id="product" title="What the app does">
        <Prose lead>
          <p>
            Local cricket still runs on group chats, paper scoresheets and spreadsheets. Flippr puts the scorer, the organiser, the
            players and the fans on one app, so a ball scored on one phone is on every other phone straight away.
          </p>
          <p>
            It is a B2C sports app, in development. It covers the life of a match: creating a tournament, setting the toss, scoring ball
            by ball, following live, inviting people in, and, when a league drafts its squads, auctioning players into teams.
          </p>
        </Prose>
        <div className="w-gap" />
        <Rows
          items={[
            {
              name: 'Live scoring',
              text: 'A scorer’s pad built for one-handed use: runs, four, six, wide, no-ball, byes, leg byes, wicket, undo, and the less common cases such as five or seven runs and bonus or penalty runs. Followers get the same match as a live scorecard and commentary.',
            },
            {
              name: 'Toss and match set-up',
              text: 'Sides, ground, rules, then the toss. The scoring screen starts from that state, not from a blank pad.',
            },
            {
              name: 'My matches',
              text: 'One place for upcoming, live and past matches, with a countdown to the next one and quick links to stats and the points table.',
            },
            {
              name: 'Tournaments',
              text: 'Organisers create a tournament with a logo and banner, organiser details, grounds and dates. Fixtures are generated and the points table updates as results come in. Staff roles (officials and scorers) gate who can resume or cancel a match.',
            },
            {
              name: 'Auctions and invites',
              text: 'Player auctions with live bidding and team purses for leagues that draft their squads, and invites to bring captains, players and officials into a tournament. The hall-scale auction console is a separate live product.',
            },
            {
              name: 'Notifications',
              text: 'In-app inbox plus push: toss, wicket, result, invite. Preferences live on the notification service so a locked phone still hears the match.',
            },
          ]}
        />
      </Section>

      <Section id="architecture" title="Microservice architecture" wide>
        <Prose>
          <p>
            The mobile app is the visible end of a split backend. Identity issues the session. Catalog, tournaments, matches and scoring
            each own a slice of the cricket domain. A gateway and a mobile BFF sit in front. Live updates travel on STOMP over
            WebSocket; push goes through Firebase Cloud Messaging. Data sits in Postgres, sessions in Redis, the whole stack in Docker
            on AWS EC2.
          </p>
        </Prose>
        <div className="w-gap" />
        <Architecture />
        <p className="wf-note">
          This is the system as designed and deployed for development, described without host names, keys or templates. Some app
          screens still talk to fixtures while the matching APIs land; the services above are the ones the wiring is aimed at.
        </p>
      </Section>

      <Section id="role" title="My role">
        <Prose>
          <p>
            I joined the Flippr team through my internship at Veefin Solutions Ltd as the technical solutionist for this product. Two
            jobs at once: decide how the system fits together, and build a large part of the mobile client.
          </p>
          <ul>
            <li>
              <strong>System architecture.</strong> Service boundaries, the JWT trust chain (identity issues, cricket services verify
              issuer and session), how a scored ball reaches followers, and how push is fanned out without putting FCM inside every
              domain service.
            </li>
            <li>
              <strong>Backend design.</strong> Match lifecycle and scoring contracts, invite and staff-roster endpoints, notification
              events, and the path-based gateway rules that send a request to the right process.
            </li>
            <li>
              <strong>Core mobile developer.</strong> Flutter work on scoring, match flow, tournaments and the live client: BLoC,
              go_router, Dio against the BFF, STOMP subscriptions, Firebase Messaging.
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="build" title="Stack">
        <StackTable
          groups={[
            { name: 'Client', items: 'Flutter, BLoC, go_router, Dio, STOMP client, Firebase Messaging' },
            { name: 'Edge', items: 'HTTPS reverse proxy, API gateway, mobile BFF' },
            { name: 'Services', items: 'Identity, catalog, tournaments, matches, scoring, notifications, media' },
            { name: 'Realtime', items: 'STOMP over WebSocket for live scoring; FCM for push' },
            { name: 'Data', items: 'Postgres per service, Redis sessions' },
            { name: 'Runtime', items: 'Docker Compose on AWS EC2' },
          ]}
        />
      </Section>
    </CaseLayout>
  )
}
