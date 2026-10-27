import { EVENT_BY_ID, EVENTS, type EventChoice, type EventDef, type EventOutcome } from '@/content/events'
import { EVENT_INTERVAL_MAX_MS, EVENT_INTERVAL_MIN_MS } from './constants'
import { applyEffect } from './eventEffects'
import { hasItems } from './inventory'
import { pushLog } from './log'
import type { ActionResult, GameState, Rng } from './types'

export * from './eventEffects'

export function isEventEligible(state: GameState, def: EventDef): boolean {
  const c = def.condition
  if (c?.minRealmIndex !== undefined && state.realmIndex < c.minRealmIndex) return false
  if (c?.maxRealmIndex !== undefined && state.realmIndex > c.maxRealmIndex) return false
  if (c?.requiredFlags?.some((f) => !state.flags[f])) return false
  if (c?.forbiddenFlags?.some((f) => state.flags[f])) return false
  if (def.once && state.flags[`seen:${def.id}`]) return false
  const until = state.eventCooldowns[def.id]
  if (until !== undefined && state.playedMs < until) return false
  return true
}

export function getEligibleEvents(state: GameState): EventDef[] {
  return EVENTS.filter((e) => isEventEligible(state, e))
}

export function shouldRollEvent(state: GameState): boolean {
  return state.pendingEvent === null && state.playedMs >= state.nextEventAtMs
}

export function pickWeighted<T extends { weight: number }>(items: readonly T[], roll: number): T {
  const total = items.reduce((a, b) => a + b.weight, 0)
  let acc = 0
  for (const it of items) {
    acc += it.weight
    if (roll * total < acc) return it
  }
  return items[items.length - 1]
}

function scheduleNext(state: GameState, rng: Rng): GameState {
  const gap = EVENT_INTERVAL_MIN_MS + rng() * (EVENT_INTERVAL_MAX_MS - EVENT_INTERVAL_MIN_MS)
  return { ...state, nextEventAtMs: state.playedMs + gap }
}

/** Called by the loop when `shouldRollEvent`. Picks an eligible event or just reschedules. */
export function rollEvent(state: GameState, rng: Rng): GameState {
  if (!shouldRollEvent(state)) return state
  const eligible = getEligibleEvents(state)
  if (eligible.length === 0) return scheduleNext(state, rng)
  const def = pickWeighted(eligible, rng())
  const next: GameState = { ...state, pendingEvent: { eventId: def.id, triggeredAtMs: state.playedMs } }
  return pushLog(next, `${def.title}: ${def.text}`, 'event')
}

export function getPendingEvent(state: GameState): EventDef | null {
  return state.pendingEvent ? (EVENT_BY_ID[state.pendingEvent.eventId] ?? null) : null
}

export function isChoiceAvailable(state: GameState, choice: EventChoice): boolean {
  const r = choice.requires
  if (!r) return true
  if (r.stones !== undefined && state.stones < r.stones) return false
  if (r.items && !hasItems(state, r.items)) return false
  if (r.minRealmIndex !== undefined && state.realmIndex < r.minRealmIndex) return false
  if (r.flag && !state.flags[r.flag]) return false
  return true
}

export interface EventResolution {
  state: GameState
  outcome: EventOutcome
  event: EventDef
}

export function resolveEvent(state: GameState, choiceId: string, rng: Rng): ActionResult<EventResolution> {
  const def = getPendingEvent(state)
  if (!def) {
    // Pending id no longer exists in content (removed event): clear it so the game is not stuck.
    if (state.pendingEvent) return { ok: true, state: { state: scheduleNext({ ...state, pendingEvent: null }, rng), outcome: { weight: 1, text: '', effects: [] }, event: EVENTS[0] } }
    return { ok: false, error: 'Không có sự kiện nào đang chờ' }
  }
  const choice = def.choices.find((c) => c.id === choiceId)
  if (!choice) return { ok: false, error: 'Lựa chọn không hợp lệ' }
  if (!isChoiceAvailable(state, choice)) return { ok: false, error: 'Không đủ điều kiện cho lựa chọn này' }

  const outcome = pickWeighted(choice.outcomes, rng())
  let next: GameState = state
  if (choice.requires?.stones) next = { ...next, stones: next.stones - choice.requires.stones }
  for (const fx of outcome.effects) next = applyEffect(next, fx, rng)

  const eventCooldowns = def.cooldownMs
    ? { ...next.eventCooldowns, [def.id]: next.playedMs + def.cooldownMs }
    : next.eventCooldowns
  const flags = def.once ? { ...next.flags, [`seen:${def.id}`]: true } : next.flags
  next = {
    ...next,
    pendingEvent: null,
    eventCooldowns,
    flags,
    stats: { ...next.stats, eventsResolved: next.stats.eventsResolved + 1 },
  }
  next = pushLog(next, outcome.text, 'event')
  next = scheduleNext(next, rng)
  return { ok: true, state: { state: next, outcome, event: def } }
}
