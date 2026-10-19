export type CaseEntry = {
  slug: string
  path: string
  name: string
  blurb: string
}

/** Order here drives the "next case study" links. */
export const CASES: CaseEntry[] = [
  { slug: 'auction-flippr-live', path: '/work/auction-flippr-live', name: 'auction.flippr.live', blurb: 'Live cricket player auctions, in sync on every screen.' },
  { slug: 'flippr-live', path: '/work/flippr-live', name: 'flippr.live', blurb: 'The marketing site for Flippr, the cricket app.' },
  { slug: 'flippr-app', path: '/work/flippr-app', name: 'Flippr mobile app', blurb: 'A B2C cricket platform on a microservice backend.' },
  { slug: 'madridonomy', path: '/work/madridonomy', name: 'madridonomy.com', blurb: 'A football media site with its own CMS and AI pipeline.' },
  { slug: 'footonomy', path: '/work/footonomy', name: 'Footonomy', blurb: 'A football companion web app, built with a team of three.' },
  { slug: 'chatspace', path: '/work/chatspace', name: 'ChatSpace', blurb: 'Real-time team chat with tasks and AI helpers.' },
  { slug: 'madridonomy-store', path: '/work/madridonomy-store', name: 'Madridonomy Store', blurb: 'A custom Shopify theme for a football-streetwear store.' },
  { slug: 'content-studio', path: '/work/content-studio', name: 'Content Studio', blurb: 'A private AI content tool for a football media brand.' },
]

export function neighbours(slug: string): { prev: CaseEntry; next: CaseEntry } {
  const i = Math.max(0, CASES.findIndex((c) => c.slug === slug))
  return { prev: CASES[(i + CASES.length - 1) % CASES.length], next: CASES[(i + 1) % CASES.length] }
}
