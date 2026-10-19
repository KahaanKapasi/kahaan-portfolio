import CaseLayout from '../_shared/CaseLayout'
import { Prose, Rows, Section, StackTable } from '../_shared/parts'
import Mock from './Mock'
import './mock.css'

function Pipeline() {
  const nodes = [
    ['Sources', 'feeds and pages'],
    ['Scraper', 'collects stories'],
    ['AI draft', 'article text'],
    ['Queue', 'content items'],
    ['Editor', 'review, approve'],
    ['Publish', 'site and social'],
  ]
  const W = 134
  const G = 31
  return (
    <svg className="wm-pipe" viewBox="0 0 960 130" role="img" aria-label="Pipeline: sources, scraper, AI draft, content queue, editor approval, publish to site and social.">
      <title>Article pipeline</title>
      <defs>
        <marker id="wm-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1l6 3-6 3z" fill="#8d1d2c" />
        </marker>
      </defs>
      {nodes.map(([t, sub], i) => {
        const x = 1 + i * (W + G)
        const gate = i === 4
        return (
          <g key={t}>
            <rect x={x} y="28" width={W} height="74" rx="10" fill={gate ? '#15140f' : 'rgba(255,255,255,0.55)'} stroke="#15140f" strokeWidth="1.2" />
            <text x={x + W / 2} y="62" textAnchor="middle" fontSize="17" fontWeight="650" fill={gate ? '#fff' : '#15140f'}>
              {t}
            </text>
            <text x={x + W / 2} y="85" textAnchor="middle" fontSize="13" fill={gate ? '#e9e5d6' : '#5d594d'}>
              {sub}
            </text>
            {i < nodes.length - 1 ? (
              <path className="flow" d={`M${x + W + 3} 65H${x + W + G - 3}`} stroke="#8d1d2c" strokeWidth="2" fill="none" markerEnd="url(#wm-arr)" />
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

export default function MadridonomyCase() {
  return (
    <CaseLayout
      slug="madridonomy"
      title="madridonomy.com"
      summary="A Real Madrid news, stats and daily-games site with its own admin CMS and an AI article pipeline that drafts stories for an editor to approve. The web home of a football media brand I founded."
      role="Founder, designer and developer. Built and run solo, alongside an internship and college."
      stack="Flask, Neon Postgres, Jinja, Alpine.js, HTMX, Tailwind, a React admin, Vercel"
      status="Live"
      links={[{ label: 'madridonomy.com', href: 'https://madridonomy.com', external: true }]}
      accent="#8d1d2c"
      metaTitle="madridonomy.com case study | Kahaan Kapasi"
      metaDescription="Case study: madridonomy.com, a live Real Madrid news, stats and daily-games site with an admin CMS and an AI article pipeline, built solo with Flask, Neon Postgres and React."
      hero={<Mock />}
    >
      <Section id="overview" title="What it is">
        <Prose lead>
          <p>
            Madridonomy started as a football media brand on social platforms in December 2023. The website is where that audience gets
            more than a post: news, stats, fixtures and a set of daily games, all in one place the brand owns.
          </p>
          <p>
            The brand has grown to 61K+ followers, and the site, the database and the publishing system are things it owns outright.
          </p>
        </Prose>
        <div className="w-gap" />
        <dl className="wm-nums">
          <div>
            <dt>Followers across the brand</dt>
            <dd>61K+</dd>
          </div>
          <div>
            <dt>Site visitors in its first two months</dt>
            <dd>~5K</dd>
          </div>
          <div>
            <dt>Revenue over eight months, run solo</dt>
            <dd>₹1.5L+</dd>
          </div>
          <div>
            <dt>Daily game formats</dt>
            <dd>9</dd>
          </div>
        </dl>
      </Section>

      <Section id="features" title="What is on the site">
        <Rows
          items={[
            { name: 'News and articles', text: 'Match reports, analysis and quick news, with category pages, article pages with clean URLs, an XML sitemap and dynamic social preview images.' },
            { name: 'Stats and squad', text: 'Player pages with career, stats and injury history, fixtures, match pages, standings, seasons, transfers and trophies, plus a comparison tool.' },
            { name: 'Daily games hub', text: 'Nine daily puzzle formats that reset each midnight UTC: Who Are Ya, Daily Quiz, Connections, Timeline, Career Path, Guess the Stat, Match Predictor, Rankings and Tic Tac Toe, with streaks and leaderboards.' },
            { name: 'Embeds', text: 'Small embeddable widgets for standings, a player card, a quiz and a fixture ticker.' },
            { name: 'Accounts and alerts', text: 'An account system with tiered access, push notification subscriptions and a newsletter list.' },
          ]}
        />
      </Section>

      <Section id="pipeline" title="The AI article pipeline" wide>
        <Prose>
          <p>
            A solo operator cannot write every story, so the CMS does the first draft. A scraper collects stories from feeds and pages, an
            AI model (Gemini) turns them into article drafts, and each draft lands in a content queue. An editor reviews it in the admin
            app, fixes the facts and the headline, approves it, and only then does it publish and get shared. The human step is the point:
            speed from the machine, judgement from a person.
          </p>
        </Prose>
        <div className="w-gap" />
        <Pipeline />
        <p className="wm-pipe-note">Automation endpoints cover scrape, queue, approve, publish and tweet. An external article API with key-based access lets other tools create drafts.</p>
      </Section>

      <Section id="admin" title="Admin CMS">
        <Prose>
          <p>
            The admin is a separate React and TypeScript app with fifteen pages: dashboard, article list and editor (a rich-text editor),
            automation, analytics, game content for the quiz, connections and predictor, AI tools, affiliates, Instagram, youth players,
            events, injuries, media and settings. It talks to the same API as the site and signs in with JWT.
          </p>
          <p>
            The public site stays deliberately light. Pages are server-rendered Jinja templates with Alpine.js for small interactions and
            HTMX for round-trips, so a news page loads fast on a phone and the games need no framework runtime.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'Server', items: 'Flask 3 and SQLAlchemy on Vercel serverless, with connection pooling tuned for cold starts' },
            { name: 'Database', items: 'Neon Postgres, 40+ tables (content, sports data, games, analytics, business)' },
            { name: 'Public front end', items: 'Jinja templates, Alpine.js, HTMX, Tailwind, dark mode first' },
            { name: 'Admin', items: 'React 19, TypeScript, Vite, Radix UI, Recharts, Tiptap' },
            { name: 'AI and data', items: 'Gemini for drafts, a football data API for fixtures and players, Cloudinary for images, Instagram Graph API' },
            { name: 'Scale', items: '60+ routes, 85+ endpoints, 15 admin pages, an external API v1 with API keys' },
          ]}
        />
      </Section>

      <Section id="brand" title="The brand behind it">
        <Prose>
          <p>
            Madridonomy is also a business. Over eight months it brought in roughly ₹1.5L+ in revenue, run solo alongside an internship
            and college. Brand partnerships so far include:
          </p>
        </Prose>
        <div className="w-gap" />
        <ul className="wm-text-only" aria-label="Brand partners">
          <li>FIFA x DoorDash</li>
          <li>FanCode</li>
          <li>ChatBCC</li>
          <li>The Residency</li>
          <li>and others</li>
        </ul>
        <div className="w-gap" />
        <Prose>
          <p>
            The site is the part of that business I could build myself: the editorial workflow, the games that bring people back daily, and
            the analytics that show what is working. The same pipeline thinking went into Content Studio, a private tool built for the
            brand.
          </p>
        </Prose>
      </Section>
    </CaseLayout>
  )
}

