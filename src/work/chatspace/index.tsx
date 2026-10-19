import CaseLayout from '../_shared/CaseLayout'
import { Prose, Rows, Section, StackTable } from '../_shared/parts'
import ChatMock from './ChatMock'
import './chatspace.css'

export default function ChatSpaceCase() {
  return (
    <CaseLayout
      slug="chatspace"
      title="ChatSpace"
      summary="A college full-stack project: real-time team chat with Socket.io rooms and presence, in-chat tasks with deadline reminders, AI helper messages and file uploads."
      role="Full-stack developer. College project, designed and built end to end."
      stack="React, Vite, Tailwind, Node, Express, Socket.io, MongoDB, JWT, Vitest"
      status="Live frontend. The API sleeps on Render free tier."
      links={[{ label: 'fsdmicro.netlify.app', href: 'https://fsdmicro.netlify.app', external: true }]}
      credit="College full-stack project"
      accent="#3d4fd8"
      accentInk="#ffffff"
      metaTitle="ChatSpace case study | Kahaan Kapasi"
      metaDescription="Case study: ChatSpace, a real-time team chat with Socket.io rooms, in-chat tasks, AI helpers and file uploads. React, Express, MongoDB. Live frontend, sleeping free-tier API."
      hero={<ChatMock />}
    >
      <Section id="product" title="What it does">
        <Prose lead>
          <p>
            ChatSpace is a team chat for a small group that already lives in too many tabs: a room for the work, a place to drop a
            file, a task that does not get lost in the scroll, and a helper that can summarise the thread.
          </p>
          <p>
            The mock above is the product in miniature. Send a line, mark the task done, open Summarize. It does not call the live
            API.
          </p>
        </Prose>
        <div className="w-gap" />
        <Rows
          items={[
            {
              name: 'Rooms and presence',
              text: 'Channels and direct messages. Sockets join a room by conversation id, plus a private user room. Presence is a live count per user, so two tabs from the same person do not look like two people.',
            },
            {
              name: 'In-chat tasks',
              text: 'A message can become a task card in the stream (/task Title @handle due:YYYY-MM-DD). Status, priority, assignees and due date sit on the card. Deadline reminders arrive as socket events, then as an in-app toast and a browser notification while the tab is open.',
            },
            {
              name: 'AI helpers',
              text: 'Summarise a room, translate a message, transcribe voice. The default provider is a deterministic mock, so the UI is real even when no model is configured. Voice uses the browser Web Speech API when it exists, otherwise a transcribe route.',
            },
            {
              name: 'Files',
              text: 'Uploads land on local disk (15 MB, image, document and audio allow-list) and come back as {url, fileType, size, name}. One module is the swap point for object storage later.',
            },
          ]}
        />
      </Section>

      <Section id="build" title="How it is built">
        <Prose>
          <p>
            The client is React on Vite with Tailwind. The server is Node and Express. MongoDB holds users, conversations, messages
            and tasks. Auth is JWT (header or cookie). Socket.io carries the live events: join and leave, send with ack, typing,
            presence, read receipts, task created/updated/deleted, and the deadline reminder.
          </p>
          <p>
            Tasks and AI replies link to messages by id. Text is not copied into a second collection. A 26-test Vitest suite covers
            auth, models, realtime, uploads, tasks, the scheduler and the AI routes.
          </p>
        </Prose>
        <div className="w-gap" />
        <StackTable
          groups={[
            { name: 'Client', items: 'React, Vite, Tailwind' },
            { name: 'Server', items: 'Node, Express, Socket.io, JWT, Multer, node-cron' },
            { name: 'Data', items: 'MongoDB (Mongoose); embedded Mongo when no URI is set' },
            { name: 'Tests', items: 'Vitest, 26 server tests' },
            { name: 'Live', items: 'Frontend on Netlify. API on Render free tier, which sleeps when idle.' },
          ]}
        />
      </Section>

      <Section id="live" title="The live build">
        <Prose>
          <p>
            The frontend is at fsdmicro.netlify.app. The API runs on Render free tier, so the first request after a quiet spell
            can fail or wait while the service wakes. That is a hosting limit, not a missing feature. If chat does not connect,
            wait and refresh, or use the mock on this page.
          </p>
        </Prose>
      </Section>
    </CaseLayout>
  )
}
