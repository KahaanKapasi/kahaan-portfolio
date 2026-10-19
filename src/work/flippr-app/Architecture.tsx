import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../shared/webgl'
import '@fontsource-variable/jetbrains-mono'

type Node = {
  id: string
  name: string
  layer: string
  blurb: string
  owns: string
}

const NODES: Node[] = [
  {
    id: 'flutter',
    name: 'Flutter app',
    layer: 'Client',
    blurb: 'The scoring pad, my matches, tournaments, auctions and invites. One-handed scoring on the ground, live scorecards for everyone else.',
    owns: 'BLoC state, go_router, Dio, a STOMP client, Firebase Messaging.',
  },
  {
    id: 'proxy',
    name: 'HTTPS edge',
    layer: 'Edge',
    blurb: 'Public traffic lands here. TLS is terminated and hosts are split: the marketing site versus the API.',
    owns: 'nginx (and Caddy in earlier deploys). Path routing, no business logic.',
  },
  {
    id: 'gateway',
    name: 'Gateway / BFF',
    layer: 'Edge',
    blurb: 'First-match-wins routing in front of the services. The mobile BFF is the default upstream; specialised services take their own prefixes.',
    owns: 'API gateway, mobile-bff, request fan-out for the home feed.',
  },
  {
    id: 'identity',
    name: 'Identity',
    layer: 'Services',
    blurb: 'The JWT issuer for the rest of the system. Cricket services trust a token only when the issuer claim matches, and a device session still exists.',
    owns: 'Sign-in, device registration, JWT issue, session lookup.',
  },
  {
    id: 'catalog',
    name: 'Catalog',
    layer: 'Services',
    blurb: 'The shared sports directory: teams, grounds, follows, player invites. Other services consult it rather than storing their own copies.',
    owns: 'Teams, grounds, follows, general invites.',
  },
  {
    id: 'tournament',
    name: 'Tournaments',
    layer: 'Services',
    blurb: 'Competition records and the staff roster used for match permissions. Captain and official invites are minted here so a link can bring a person into a tournament.',
    owns: 'Tournaments, official invites, staff roster.',
  },
  {
    id: 'match',
    name: 'Matches',
    layer: 'Services',
    blurb: 'Fixture lifecycle: create, assign sides, toss, start, break, resume, cancel. Writes the match; scoring writes the ball log.',
    owns: 'Match records, team assignment, status transitions.',
  },
  {
    id: 'scoring',
    name: 'Scoring',
    layer: 'Services',
    blurb: 'Ball-by-ball log and commentary. A tap on the pad becomes an event here, and that event is what followers read as a live scorecard.',
    owns: 'Ball log, extras, wickets, manual commentary.',
  },
  {
    id: 'notify',
    name: 'Notifications',
    layer: 'Services',
    blurb: 'In-app inbox and notification preferences. Domain services publish signed events; this service decides what to store and what to push.',
    owns: 'Inbox, preference APIs, push dispatch.',
  },
  {
    id: 'media',
    name: 'Media',
    layer: 'Services',
    blurb: 'Uploads stay on disk on the host: tournament banners, logos, player photos. Cricket services store an id; this service stores the file.',
    owns: 'Uploads and asset URLs. No object store in the current deploy.',
  },
  {
    id: 'stomp',
    name: 'STOMP',
    layer: 'Realtime',
    blurb: 'STOMP over WebSocket. A scored ball is published on a match topic. Every subscribed phone updates without polling.',
    owns: 'Live scorecards, commentary, match-status pushes.',
  },
  {
    id: 'fcm',
    name: 'FCM',
    layer: 'Realtime',
    blurb: 'Firebase Cloud Messaging for people who are not sitting on the scorecard. Toss, wicket, result, invite: the events that should tap a locked phone.',
    owns: 'Push delivery. Device tokens are registered at identity, dispatched here.',
  },
  {
    id: 'redis',
    name: 'Redis',
    layer: 'Data',
    blurb: 'Short-lived keys: OTP expiry and per-device sessions. Identity checks a session is still active before a cricket service accepts the JWT.',
    owns: 'Session store, short TTL caches. Not the system of record.',
  },
  {
    id: 'postgres',
    name: 'Postgres',
    layer: 'Data',
    blurb: 'System of record for identity, catalog, tournaments, matches and the ball log. Each service keeps its own schema; they do not share tables.',
    owns: 'Durable writes. Read models for the BFF sit on top.',
  },
  {
    id: 'docker',
    name: 'Docker / EC2',
    layer: 'Runtime',
    blurb: 'The stack runs as containers on AWS EC2: databases, services, gateway, reverse proxy. Compose files define what production actually boots.',
    owns: 'Packaging, process isolation, host-level restart.',
  },
]

const LAYERS = ['Client', 'Edge', 'Services', 'Realtime', 'Data', 'Runtime'] as const

const LINKS: [string, string][] = [
  ['flutter', 'proxy'],
  ['proxy', 'gateway'],
  ['gateway', 'identity'],
  ['gateway', 'catalog'],
  ['gateway', 'tournament'],
  ['gateway', 'match'],
  ['gateway', 'scoring'],
  ['gateway', 'notify'],
  ['gateway', 'media'],
  ['identity', 'redis'],
  ['identity', 'postgres'],
  ['catalog', 'postgres'],
  ['tournament', 'postgres'],
  ['match', 'postgres'],
  ['scoring', 'postgres'],
  ['scoring', 'stomp'],
  ['stomp', 'flutter'],
  ['notify', 'fcm'],
  ['fcm', 'flutter'],
  ['media', 'postgres'],
  ['docker', 'proxy'],
  ['docker', 'postgres'],
  ['docker', 'redis'],
]

const TRACE = ['flutter', 'proxy', 'gateway', 'scoring', 'postgres', 'stomp', 'notify', 'fcm'] as const

function neighboursOf(id: string): Set<string> {
  const out = new Set<string>([id])
  for (const [a, b] of LINKS) {
    if (a === id) out.add(b)
    if (b === id) out.add(a)
  }
  return out
}

export default function Architecture() {
  const reduced = usePrefersReducedMotion()
  const [selected, setSelected] = useState<string>('scoring')
  const [traceI, setTraceI] = useState<number | null>(null)
  const timer = useRef<number | null>(null)
  const headingId = useId()
  const tracing = traceI !== null
  const activeId = tracing ? TRACE[traceI] : selected
  const active = NODES.find((n) => n.id === activeId) ?? NODES[0]
  const related = neighboursOf(activeId)

  const stopTrace = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current)
    timer.current = null
    setTraceI(null)
  }, [])

  const startTrace = () => {
    stopTrace()
    if (reduced) {
      setSelected(TRACE[0])
      return
    }
    setTraceI(0)
  }

  useEffect(() => {
    if (traceI === null) return
    timer.current = window.setInterval(() => {
      setTraceI((i) => {
        if (i === null) return null
        if (i >= TRACE.length - 1) {
          if (timer.current) window.clearInterval(timer.current)
          timer.current = null
          setSelected(TRACE[TRACE.length - 1])
          return null
        }
        return i + 1
      })
    }, 700)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [tracing])

  useEffect(() => () => stopTrace(), [stopTrace])

  return (
    <div className="wf-arch">
      <div className="wf-arch__top">
        <h3 id={headingId}>How a scored ball moves</h3>
        <div className="wf-arch__actions">
          <button type="button" className="w-btn w-btn--sm" onClick={startTrace} aria-pressed={tracing}>
            {reduced ? 'Show the path' : tracing ? 'Tracing' : 'Trace a ball'}
          </button>
          {tracing ? (
            <button type="button" className="w-btn w-btn--sm w-btn--ghost" onClick={stopTrace}>
              Stop
            </button>
          ) : null}
        </div>
      </div>

      <p className="wf-arch__hint">
        Select a service. Related nodes light up. Trace a ball follows one scoring event from the pad to every follower.
      </p>

      <div className="wf-arch__board" role="group" aria-labelledby={headingId}>
        {LAYERS.map((layer) => (
          <div key={layer} className="wf-arch__layer">
            <p className="wf-arch__layer-name">{layer}</p>
            <ul>
              {NODES.filter((n) => n.layer === layer).map((n) => {
                const on = n.id === activeId
                const near = related.has(n.id)
                const onPath = tracing && TRACE.includes(n.id as (typeof TRACE)[number])
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={`wf-node${on ? ' is-on' : ''}${near && !on ? ' is-near' : ''}${onPath ? ' is-path' : ''}`}
                      aria-pressed={on}
                      aria-current={on ? 'true' : undefined}
                      onClick={() => {
                        stopTrace()
                        setSelected(n.id)
                      }}
                    >
                      <span className="wf-node__name">{n.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="wf-arch__detail" role="region" aria-live="polite" aria-atomic="true">
        <p className="wf-arch__layer-tag">{active.layer}</p>
        <h4>{active.name}</h4>
        <p>{active.blurb}</p>
        <p className="wf-arch__owns">
          <b>Owns</b>
          {active.owns}
        </p>
      </div>
    </div>
  )
}
