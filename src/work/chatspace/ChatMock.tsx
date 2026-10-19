import { FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { MockNote } from '../_shared/parts'
import { usePrefersReducedMotion } from '../../shared/webgl'

type Kind = 'channel' | 'dm'
type Priority = 'high' | 'medium' | 'low'

type Task = {
  title: string
  due: string
  done: boolean
  priority: Priority
}

type Msg = {
  id: string
  from: string
  at: string
  text?: string
  task?: Task
  file?: { name: string; size: string }
  helper?: boolean
}

type Room = {
  id: string
  name: string
  kind: Kind
  topic?: string
  unread?: number
  members: string[]
}

const ME = 'Kahaan'
const PEOPLE: Record<string, { name: string; status: 'online' | 'busy' | 'offline'; initial: string }> = {
  Kahaan: { name: 'Kahaan Kapasi', status: 'online', initial: 'K' },
  Meera: { name: 'Meera Joshi', status: 'online', initial: 'M' },
  Arjun: { name: 'Arjun Desai', status: 'busy', initial: 'A' },
  Priya: { name: 'Priya Shah', status: 'offline', initial: 'P' },
}

const ROOMS: Room[] = [
  { id: 'studio', name: 'fsd-studio', kind: 'channel', topic: 'Full-stack project room', members: ['Kahaan', 'Meera', 'Arjun', 'Priya'] },
  { id: 'lab', name: 'deadline-lab', kind: 'channel', topic: 'Due dates and reminders', members: ['Kahaan', 'Meera', 'Arjun'] },
  { id: 'meera', name: 'Meera Joshi', kind: 'dm', members: ['Kahaan', 'Meera'] },
]

const SEED: Record<string, Msg[]> = {
  studio: [
    { id: 's1', from: 'Meera', at: '10:14', text: 'Socket rooms are joining on conversation id. Presence is a count per user, so two tabs do not double-announce online.' },
    { id: 's2', from: 'Kahaan', at: '10:16', text: 'JWT on the handshake, cookie fallback. If the token is dead the socket never connects.' },
    {
      id: 's3',
      from: 'Arjun',
      at: '10:18',
      task: { title: 'Write the Vitest suite for task_deadline_reminder', due: 'Fri', done: false, priority: 'high' },
    },
    { id: 's4', from: 'Priya', at: '10:21', file: { name: 'socket-events.md', size: '12 KB' } },
    { id: 's5', from: 'Meera', at: '10:22', text: 'Slash command is /task Title @meera due:2026-10-20. Mentions resolve from the room.' },
  ],
  lab: [
    { id: 'l1', from: 'Arjun', at: '09:02', text: 'Reminders fire on the server cron, then as a socket event. No service-worker push, so a closed tab stays quiet.' },
    { id: 'l2', from: 'Kahaan', at: '09:07', text: 'That is the honest limit. In-app toast plus a browser Notification while the tab is open.' },
  ],
  meera: [
    { id: 'd1', from: 'Meera', at: '18:40', text: 'Summarize uses the mock AI provider. Swap the provider, keep the route.' },
    { id: 'd2', from: 'Kahaan', at: '18:41', text: 'Same for transcribe. Voice uses Web Speech when the browser has it.' },
  ],
}

const SUMMARIES: Record<string, string> = {
  studio: 'The room agreed sockets join by conversation id, JWTs gate the handshake, and /task mints an in-stream card rather than duplicating text. Priya left the event list as a file.',
  lab: 'Deadline reminders are a server cron plus a socket event. They never arrive if the tab is closed.',
  meera: 'AI helpers are a provider interface. The default is a deterministic mock so the UI can be marked in without a live model.',
}

let n = 20
const nid = () => `m${++n}`
const nowLabel = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function ChatMock() {
  const reduced = usePrefersReducedMotion()
  const [roomId, setRoomId] = useState('studio')
  const [messages, setMessages] = useState<Record<string, Msg[]>>(SEED)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [typing, setTyping] = useState(false)
  const [summary, setSummary] = useState(false)
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>('chat')
  const logRef = useRef<HTMLDivElement>(null)
  const replyTimer = useRef<number | null>(null)
  const liveId = useId()
  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0]
  const thread = messages[roomId] ?? []
  const title = room.kind === 'dm' ? room.name : `#${room.name}`

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [thread.length, typing, roomId, reduced])

  useEffect(() => () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current)
  }, [])

  const members = useMemo(() => room.members.map((id) => PEOPLE[id]), [room.members])

  const toggleTask = (id: string) => {
    setMessages((all) => ({
      ...all,
      [roomId]: (all[roomId] ?? []).map((m) =>
        m.id === id && m.task ? { ...m, task: { ...m.task, done: !m.task.done } } : m,
      ),
    }))
  }

  const push = (roomKey: string, msg: Msg) => {
    setMessages((all) => ({ ...all, [roomKey]: [...(all[roomKey] ?? []), msg] }))
  }

  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) {
      setError('Type a message, or /task and a title.')
      return
    }
    setError('')
    setDraft('')
    const taskMatch = /^\/task\s+(.+)/i.exec(text)
    if (taskMatch) {
      push(roomId, {
        id: nid(),
        from: ME,
        at: nowLabel(),
        task: { title: taskMatch[1].slice(0, 80), due: 'today', done: false, priority: 'medium' },
      })
      return
    }
    push(roomId, { id: nid(), from: ME, at: nowLabel(), text })
    if (roomId === 'studio' && !reduced) {
      setTyping(true)
      if (replyTimer.current) window.clearTimeout(replyTimer.current)
      replyTimer.current = window.setTimeout(() => {
        setTyping(false)
        push('studio', { id: nid(), from: 'Meera', at: nowLabel(), text: 'Got it. Logged on the mock socket.' })
      }, 900)
    }
  }

  return (
    <div className="cs-shell">
      <div className={`cs-app${mobilePane === 'chat' ? ' is-chat' : ''}`}>
        <aside className="cs-side" aria-label="Conversations">
          <div className="cs-me">
            <span className="cs-av" data-st="online" aria-hidden="true">
              K
            </span>
            <div>
              <p className="cs-me__name">Kahaan Kapasi</p>
              <p className="cs-me__st">Online · mock socket</p>
            </div>
          </div>
          <p className="cs-side__label">Channels</p>
          <ul>
            {ROOMS.filter((r) => r.kind === 'channel').map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={r.id === roomId ? 'is-on' : undefined}
                  aria-current={r.id === roomId ? 'page' : undefined}
                  onClick={() => {
                    setRoomId(r.id)
                    setSummary(false)
                    setMobilePane('chat')
                  }}
                >
                  <Hash />
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
          <p className="cs-side__label">Direct</p>
          <ul>
            {ROOMS.filter((r) => r.kind === 'dm').map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={r.id === roomId ? 'is-on' : undefined}
                  aria-current={r.id === roomId ? 'page' : undefined}
                  onClick={() => {
                    setRoomId(r.id)
                    setSummary(false)
                    setMobilePane('chat')
                  }}
                >
                  <span className="cs-av cs-av--sm" data-st={PEOPLE.Meera.status} aria-hidden="true">
                    M
                  </span>
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="cs-main" aria-labelledby={liveId}>
          <header className="cs-head">
            <button type="button" className="cs-back" onClick={() => setMobilePane('list')} aria-label="Back to conversations">
              <Back />
            </button>
            <div className="cs-head__who">
              <h3 id={liveId}>{title}</h3>
              <p>
                {room.kind === 'dm' ? `${PEOPLE.Meera.status}` : `${room.members.length} members`}
                {room.topic ? ` · ${room.topic}` : ''}
              </p>
            </div>
            <button type="button" className={`cs-sum${summary ? ' is-on' : ''}`} aria-pressed={summary} onClick={() => setSummary((s) => !s)}>
              Summarize
            </button>
          </header>

          <div className="cs-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
            {thread.map((m, i) => {
              const mine = m.from === ME
              const person = PEOPLE[m.from]
              const show = i === 0 || thread[i - 1].from !== m.from
              return (
                <article key={m.id} className={`cs-msg${mine ? ' is-mine' : ''}${show ? ' is-head' : ''}`}>
                  {show ? (
                    <span className="cs-av" data-st={person.status} aria-hidden="true">
                      {person.initial}
                    </span>
                  ) : (
                    <span className="cs-av-spacer" />
                  )}
                  <div>
                    {show ? (
                      <p className="cs-msg__meta">
                        <b>{mine ? 'You' : person.name}</b> {m.at}
                      </p>
                    ) : null}
                    {m.task ? (
                      <TaskCard task={m.task} onToggle={() => toggleTask(m.id)} />
                    ) : m.file ? (
                      <p className="cs-file">
                        <FileIcon />
                        <span>
                          {m.file.name}
                          <i>{m.file.size}</i>
                        </span>
                      </p>
                    ) : (
                      <p className={`cs-bubble${m.helper ? ' is-help' : ''}`}>{m.text}</p>
                    )}
                  </div>
                </article>
              )
            })}
            {typing ? (
              <p className="cs-typing" role="status">
                Meera is typing
              </p>
            ) : null}
          </div>

          <form className="cs-compose" onSubmit={send}>
            <label className="cs-vis" htmlFor={`${liveId}-in`}>
              Message
            </label>
            <input
              id={`${liveId}-in`}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (error) setError('')
              }}
              placeholder="Message, or /task a title"
              autoComplete="off"
            />
            <button type="submit" className="w-btn w-btn--sm">
              Send
            </button>
          </form>
          {error ? (
            <p className="cs-err" role="alert">
              {error}
            </p>
          ) : null}
        </section>

        {summary ? (
          <aside className="cs-panel" aria-label="Conversation summary">
            <div className="cs-panel__top">
              <h3>Summary</h3>
              <button type="button" onClick={() => setSummary(false)} aria-label="Close summary">
                Close
              </button>
            </div>
            <p>{SUMMARIES[roomId]}</p>
            <p className="cs-panel__note">Mock AI provider. Same contract as the shipped helper.</p>
          </aside>
        ) : null}
      </div>

      <ul className="cs-people" aria-label="Presence in this mock">
        {members.map((p) => (
          <li key={p.name}>
            <span data-st={p.status} />
            {p.name}
            <i>{p.status}</i>
          </li>
        ))}
      </ul>
      <MockNote>Synthetic conversation. Nothing here is loaded from the live API.</MockNote>
    </div>
  )
}

function TaskCard({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div className={`cs-task${task.done ? ' is-done' : ''}`}>
      <button type="button" onClick={onToggle} aria-pressed={task.done} aria-label={task.done ? 'Mark as not done' : 'Mark as done'}>
        {task.done ? <Check /> : <Circle />}
      </button>
      <div>
        <p className="cs-task__title">{task.title}</p>
        <p className="cs-task__meta">
          <span className="cs-task__pri" data-p={task.priority}>
            {task.priority}
          </span>
          <span>due {task.due}</span>
        </p>
      </div>
    </div>
  )
}

function Hash() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 2L4 14M12 2L10 14M2 6h12M2 10h12" />
    </svg>
  )
}
function Back() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10 3L5 8l5 5" />
    </svg>
  )
}
function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7zM14 3v5h5" />
    </svg>
  )
}
function Circle() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
    </svg>
  )
}
function Check() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="M6.5 10.5l2.2 2.2 4.8-5" />
    </svg>
  )
}
