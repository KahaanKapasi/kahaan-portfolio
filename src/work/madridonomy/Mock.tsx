import { useState } from 'react'
import { BrowserFrame } from '../_shared/parts'

const glyph = (d: string) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

function PitchArt() {
  return (
    <svg viewBox="0 0 640 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="#e8ecf6" strokeOpacity="0.16" strokeWidth="2">
        <rect x="40" y="30" width="560" height="280" rx="4" />
        <path d="M320 30v280" />
        <circle cx="320" cy="170" r="52" />
        <rect x="40" y="95" width="90" height="150" />
        <rect x="510" y="95" width="90" height="150" />
        <path d="M130 140a40 40 0 010 60M510 140a40 40 0 000 60" />
      </g>
      <circle cx="320" cy="170" r="5" fill="#d7b45e" />
      <path d="M0 340L220 110l180 230z" fill="#d7b45e" fillOpacity="0.08" />
      <path d="M260 340L450 150l190 190z" fill="#ffffff" fillOpacity="0.04" />
    </svg>
  )
}

function PublicSite() {
  return (
    <div className="wm-site">
      <div className="wm-nav">
        <span className="wm-logo">Madridonomy</span>
        <nav>
          <span className="on">News</span>
          <span>Squad</span>
          <span>Standings</span>
          <span>Games</span>
          <span>Transfers</span>
        </nav>
        <span className="wm-pill">Sign in</span>
      </div>
      <div className="wm-grid">
        <article className="wm-lead">
          <div className="wm-art">
            <PitchArt />
          </div>
          <span className="wm-chip">Match report</span>
          <h3>A second-half rally rewrites the derby</h3>
          <p>Two quick goals after the break turned a flat evening around. The numbers behind the comeback, and what changes for the weekend.</p>
          <small>6 min read · drafted with AI, approved by an editor</small>
        </article>
        <ul className="wm-list" aria-hidden="true">
          {[
            ['Defence holds firm in a tense midweek win', '2 hours ago'],
            ['Five talking points from the weekend', '5 hours ago'],
            ['Rotation questions as the schedule tightens', 'Yesterday'],
            ['Youth side wins on penalties', 'Yesterday'],
          ].map(([t, w]) => (
            <li key={t}>
              <h4>{t}</h4>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="wm-games">
        <h3>Today&apos;s games</h3>
        <div className="wm-game">
          {glyph('M12 3a4 4 0 100 8 4 4 0 000-8zM5 21a7 7 0 0114 0')}
          <b>Who Are Ya</b>
          <span>Guess the player</span>
        </div>
        <div className="wm-game">
          {glyph('M9 9a3 3 0 115 2c-1 1-2 1.5-2 3M12 18h.01M12 3a9 9 0 100 18 9 9 0 000-18z')}
          <b>Daily Quiz</b>
          <span>Ten questions</span>
        </div>
        <div className="wm-game">
          {glyph('M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z')}
          <b>Connections</b>
          <span>Group the four sets</span>
        </div>
      </div>
      <div className="wm-table">
        <h3>Table</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th className="wm-num">P</th>
              <th className="wm-num">W</th>
              <th className="wm-num">D</th>
              <th className="wm-num">L</th>
              <th className="wm-num">Pts</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1', 'Team A', '#d7b45e', 24, 18, 4, 2, 58],
              ['2', 'Team B', '#7aa2d6', 24, 17, 3, 4, 54],
              ['3', 'Team C', '#8fcf9f', 24, 14, 6, 4, 48],
              ['4', 'Team D', '#d98a8a', 24, 13, 5, 6, 44],
            ].map((r) => (
              <tr key={String(r[1])}>
                <td>{r[0]}</td>
                <td>
                  <i className="wm-dot" style={{ background: String(r[2]) }} />
                  {r[1]}
                </td>
                <td className="wm-num">{r[3]}</td>
                <td className="wm-num">{r[4]}</td>
                <td className="wm-num">{r[5]}</td>
                <td className="wm-num">{r[6]}</td>
                <td className="wm-num">{r[7]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminMock() {
  const pages = ['Dashboard', 'Articles', 'Automation', 'Analytics', 'AI tools', 'Quiz', 'Connections', 'Predictor', 'Media', 'Settings']
  return (
    <div className="wm-admin">
      <aside className="wm-side">
        <b>Madridonomy admin</b>
        <ul>
          {pages.map((p) => (
            <li key={p} className={p === 'Automation' ? 'on' : undefined}>
              {p}
            </li>
          ))}
        </ul>
      </aside>
      <div className="wm-main">
        <header>
          <h3>Automation</h3>
          <div className="wm-btns">
            <span className="wm-btn">Scrape now</span>
            <span className="wm-btn pri">Publish approved</span>
          </div>
        </header>
        <div className="wm-cols">
          <section className="wm-col">
            <h4>
              Scraped <i>3</i>
            </h4>
            <div className="wm-card">Late equaliser keeps the table race alive<small><span>Source 2</span><span>12 min ago</span></small></div>
            <div className="wm-card">Injury update ahead of the weekend<small><span>Source 1</span><span>40 min ago</span></small></div>
            <div className="wm-card">Academy graduate signs new deal<small><span>Source 3</span><span>1 h ago</span></small></div>
          </section>
          <section className="wm-col">
            <h4>
              Drafted <i>2</i>
            </h4>
            <div className="wm-card hot">
              A second-half rally rewrites the derby
              <small><span className="wm-ai">AI draft</span><span>needs review</span></small>
            </div>
            <div className="wm-card">
              Five talking points from the weekend
              <small><span className="wm-ai">AI draft</span><span>needs review</span></small>
            </div>
          </section>
          <section className="wm-col">
            <h4>
              Approved <i>1</i>
            </h4>
            <div className="wm-card">
              Defence holds firm in a tense midweek win
              <small><span>Editor</span><span>queued</span></small>
            </div>
          </section>
          <section className="wm-col">
            <h4>
              Published <i>2</i>
            </h4>
            <div className="wm-card">
              Rotation questions as the schedule tightens
              <small><span>Live</span><span>shared</span></small>
            </div>
            <div className="wm-card">
              Youth side wins on penalties
              <small><span>Live</span><span>shared</span></small>
            </div>
          </section>
        </div>
        <div className="wm-draft">
          <p>
            <b>A second-half rally rewrites the derby.</b> Draft ready. Check facts, edit the headline, then approve.
          </p>
          <span className="wm-btn pri">Approve</span>
          <div className="wm-lines" aria-hidden="true">
            <i style={{ width: '96%' }} />
            <i style={{ width: '88%' }} />
            <i style={{ width: '92%' }} />
            <i style={{ width: '54%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Mock() {
  const [tab, setTab] = useState<'site' | 'admin'>('site')
  return (
    <div className="wm-mock">
      <div className="wm-tabs" role="group" aria-label="Mock view">
        <button type="button" aria-pressed={tab === 'site'} onClick={() => setTab('site')}>
          Public site
        </button>
        <button type="button" aria-pressed={tab === 'admin'} onClick={() => setTab('admin')}>
          Admin automation
        </button>
      </div>
      <BrowserFrame url={tab === 'site' ? 'madridonomy.com' : 'madridonomy.com/admin'}>
        <div className="wm-view" role="img" aria-label={tab === 'site' ? 'Illustrative mock of the public news site: a lead story, a headline list, three daily games and a league table.' : 'Illustrative mock of the admin automation board: scraped items, AI drafts awaiting review, approved and published articles.'}>
          {tab === 'site' ? <PublicSite /> : <AdminMock />}
        </div>
      </BrowserFrame>
    </div>
  )
}
