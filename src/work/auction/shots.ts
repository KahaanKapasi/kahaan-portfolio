import type { Shot } from '../_shared/parts'

const B = '/work/auction/'
const s = (file: string, width: number, height: number, alt: string, caption: string, kind: 'wide' | 'tall'): Shot => ({
  src: `${B}${file}.webp`,
  width,
  height,
  alt,
  caption,
  kind,
})

export const SHOTS = {
  desktop: s('desktop', 800, 503, 'Landing hero on a dark night-hall background: the headline "Run the auction on Flippr", a gold-rimmed 3D lot card for a sample player at 25L, a gavel on a plinth, and a paddle widget for placing a sample bid.', 'Landing hero with the spotlit lot card and gavel (sample player).', 'wide'),
  mobile: s('mobile', 780, 1688, 'Mobile landing page with the headline, Create auction and Browse auctions buttons, a sample lot card showing a current bid of 30L, and a bid button.', 'The same hero on a phone.', 'tall'),
  syncDesktop: s('landing-sync-desktop', 800, 503, 'The "One lot. Every screen." section showing the projector stage with a sample player, the current bid, and team purses along the bottom.', 'One lot, every screen: the hall stage.', 'wide'),
  syncMobile: s('landing-sync-mobile', 780, 1688, 'Phone view of the same section with the stage, the operator desk with a bid ladder and Sold, Unsold and Next player buttons, and a captain phone.', 'Stage, operator desk and captain phone, stacked for mobile.', 'tall'),
  bento: s('landing-bento-desktop', 800, 500, 'Feature section titled "Built for the night itself": a purse board that updates as players sell, an OBS overlay preview on a checkerboard, and cards for phone-as-camera, YouTube streaming and sale history.', 'Purses, overlay, phone camera, streaming and history.', 'wide'),
  stageDesktop: s('stage-desktop', 1440, 900, 'Public stage: a gold 3D lot card for the next lot, a gavel on a plinth, counters for sold, unsold and remaining, a team purse table, and a top-buy panel.', 'The public stage, the hall projector.', 'wide'),
  stageMobile: s('stage-mobile', 780, 1688, 'The stage on a phone: counters for sold, unsold and remaining, then a large player photo (blurred in this screenshot), name, role and base value.', 'The stage on a phone. The player photo is blurred here.', 'tall'),
  overlayWide: s('overlay-wide', 1600, 900, 'Broadcast overlay on a transparent canvas: a top scoreboard with a live tag, sold, unsold and remaining counts, a team purse table, and a lower third for the player on the block.', 'OBS overlay, shown on white to reveal the transparent areas.', 'wide'),
  overlayKey: s('overlay-key', 800, 450, 'The overlay on a green key background with a scoreboard strip and two team purse rows, and a faded lower third.', 'The same overlay with a green background for keying.', 'wide'),
  captain: s('captain-mobile', 780, 1688, 'Captain room on a phone: the player on the block with a blurred photo, current bid, quick raise buttons, a recent bids list, and a Sign in to bid button.', 'Captain room: bid, raise buttons and recent bids.', 'tall'),
  camera: s('camera-mobile', 780, 1688, 'Venue camera screen on a phone with a black preview, a connection status, a hint to turn the phone sideways and a Try again button.', 'Venue camera: any phone becomes the program feed source.', 'tall'),
  teamMobile: s('team-mobile', 780, 1688, 'Team dashboard on a phone showing purse left, squad progress, the player on the block and the maximum this team can bid.', 'Team dashboard on a phone.', 'tall'),
  summaryDesktop: s('summary-desktop', 1440, 900, 'Auction board in Teams view: summary tiles, then a card per team with purse left, squad slots and the maximum current bid.', 'Auction board: teams, purses and squad slots.', 'wide'),
  historyDesktop: s('history-desktop', 1440, 900, 'Auction record page with tiles for players sold, total spend, highest sale and average price, a search box with All, Sold and Unsold filters, and a timeline of sales.', 'Auction record: totals, filters and a sales timeline.', 'wide'),
  summaryMobile: s('summary-mobile', 780, 1688, 'Auction board on a phone with summary tiles, view toggles and the first team card.', 'Auction board on a phone.', 'tall'),
  historyMobile: s('history-mobile', 780, 1688, 'Auction record on a phone with summary tiles, search, filters and one sale in the timeline.', 'Auction record on a phone.', 'tall'),
  teamDesktop: s('team-desktop', 800, 500, 'Team dashboard on desktop: purse left, squad progress, the player on the block with the most this team can bid, and an empty players-bought list.', 'Team dashboard on desktop.', 'wide'),
  browseMobile: s('browse-mobile', 780, 1688, 'Browse auctions on a phone with All, Live, Setup and Completed filters and tournament cards offering Watch the stage, Team summary and Auction history.', 'Browse auctions with status filters.', 'tall'),
  loginMobile: s('login-mobile', 780, 1688, 'Sign in screen on a phone asking for a mobile number to send a code.', 'Sign in with a mobile number.', 'tall'),
  contactDesktop: s('landing-contact-desktop', 800, 500, 'Enquiry form titled "Talk to us before the auction" with name, phone, preferred date and message fields, above an "Open a room" call to action.', 'Organiser enquiry form.', 'wide'),
  footerDesktop: s('landing-footer-desktop', 800, 500, 'Closing call to action reading "Open a room" and a footer with an accent switcher offering Gold, Flippr blue and a custom colour.', 'Closing call to action and the accent switcher.', 'wide'),
  contactMobile: s('landing-contact-mobile', 780, 1688, 'Enquiry form on a phone with name, phone, preferred date and message fields and a Continue button.', 'The enquiry form on a phone.', 'tall'),
} as const

export const DESKTOP_REEL: Shot[] = [SHOTS.desktop, SHOTS.syncDesktop, SHOTS.stageDesktop, SHOTS.overlayWide, SHOTS.summaryDesktop, SHOTS.historyDesktop]

