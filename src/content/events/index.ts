import { DAILY_EVENTS } from './daily'
import { DANGER_EVENTS } from './danger'
import { FORTUNE_EVENTS } from './fortune'
import { NATURE_EVENTS } from './nature'
import { SOCIAL_EVENTS } from './social'
import type { EventDef } from './types'

export * from './types'

export const EVENTS: readonly EventDef[] = [
  ...FORTUNE_EVENTS,
  ...DANGER_EVENTS,
  ...SOCIAL_EVENTS,
  ...NATURE_EVENTS,
  ...DAILY_EVENTS,
]

export const EVENT_BY_ID: Readonly<Record<string, EventDef>> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e]),
)
