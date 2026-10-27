import { describe, expect, it } from 'vitest'
import { EVENT_BY_ID, EVENTS } from '@/content/events'
import { REALM_INDEX_BY_ID } from '@/content/realms'
import {
  createInitialState,
  createSeededRng,
  EVENT_INTERVAL_MAX_MS,
  EVENT_INTERVAL_MIN_MS,
  FIRST_EVENT_AT_MS,
  getEligibleEvents,
  getPendingEvent,
  isChoiceAvailable,
  pickWeighted,
  resolveEvent,
  rollEvent,
  shouldRollEvent,
  tick,
  validateEvents,
} from '@/engine'

const at = (realm: string, playedMs = FIRST_EVENT_AT_MS) => ({
  ...createInitialState(0),
  realmIndex: REALM_INDEX_BY_ID[realm],
  playedMs,
  stones: 1000,
})

describe('event content', () => {
  it('has at least 30 valid events', () => {
    expect(EVENTS.length).toBeGreaterThanOrEqual(30)
    expect(validateEvents()).toEqual([])
  })
})

describe('event scheduling', () => {
  it('does not roll before the scheduled time and rolls exactly one event after', () => {
    const s0 = createInitialState(0)
    expect(shouldRollEvent(s0)).toBe(false)
    const early = tick(s0, FIRST_EVENT_AT_MS - 1)
    expect(rollEvent(early, () => 0)).toBe(early)
    const due = tick(early, 1)
    expect(shouldRollEvent(due)).toBe(true)
    const rolled = rollEvent(due, () => 0)
    expect(rolled.pendingEvent).not.toBeNull()
    expect(rolled.log.at(-1)?.kind).toBe('event')
    expect(shouldRollEvent(rolled)).toBe(false)
  })

  it('offline progress leaves at most one pending event', () => {
    const s = tick(createInitialState(0), 8 * 3_600_000)
    const rolled = rollEvent(s, createSeededRng(1))
    expect(rolled.pendingEvent).not.toBeNull()
    expect(rollEvent(rolled, createSeededRng(2))).toBe(rolled)
  })

  it('respects realm gating, flags, cooldowns and once', () => {
    const ids = (s: ReturnType<typeof at>) => getEligibleEvents(s).map((e) => e.id)
    expect(ids(at('pham-nhan'))).not.toContain('ma-tu-chan-duong')
    expect(ids(at('luyen-khi-2'))).toContain('ma-tu-chan-duong')
    expect(ids(at('truc-co-1'))).not.toContain('quay-lai-dong-co')
    expect(ids({ ...at('truc-co-1'), flags: { 'biet-dong-co': true } })).toContain('quay-lai-dong-co')
    expect(ids({ ...at('luyen-khi-6'), flags: { 'nhan-nghia': true } })).not.toContain('cuop-dong-phu')
    expect(ids({ ...at('luyen-khi-3'), flags: { 'seen:tien-boi-truyen-cong': true } })).not.toContain('tien-boi-truyen-cong')
    expect(ids({ ...at('luyen-khi-2'), eventCooldowns: { 'ma-tu-chan-duong': FIRST_EVENT_AT_MS + 1 } })).not.toContain('ma-tu-chan-duong')
  })

  it('pickWeighted honours weights', () => {
    const items = [{ weight: 1, id: 'a' }, { weight: 3, id: 'b' }]
    expect(pickWeighted(items, 0).id).toBe('a')
    expect(pickWeighted(items, 0.24).id).toBe('a')
    expect(pickWeighted(items, 0.26).id).toBe('b')
    expect(pickWeighted(items, 0.99).id).toBe('b')
  })
})

describe('event resolution', () => {
  const pending = (eventId: string, realm = 'luyen-khi-2') => ({
    ...at(realm),
    pendingEvent: { eventId, triggeredAtMs: FIRST_EVENT_AT_MS },
  })

  it('refuses when nothing is pending or the choice is invalid/unavailable', () => {
    expect(resolveEvent(at('luyen-khi-2'), 'danh', () => 0).ok).toBe(false)
    expect(resolveEvent(pending('ma-tu-chan-duong'), 'nope', () => 0).ok).toBe(false)
    const poor = { ...pending('tau-hoa-nhap-ma', 'truc-co-1'), inventory: {} }
    const choice = EVENT_BY_ID['tau-hoa-nhap-ma'].choices.find((c) => c.id === 'dung-dan')!
    expect(isChoiceAvailable(poor, choice)).toBe(false)
    expect(resolveEvent(poor, 'dung-dan', () => 0).ok).toBe(false)
  })

  it('applies the chosen outcome, clears the event, sets cooldown and reschedules', () => {
    const s = pending('ma-tu-chan-duong')
    const r = resolveEvent(s, 'hoi-lo', () => 0)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const next = r.state.state
    expect(next.stones).toBeCloseTo(700)
    expect(next.pendingEvent).toBeNull()
    expect(next.eventCooldowns['ma-tu-chan-duong']).toBe(FIRST_EVENT_AT_MS + 10 * 60_000)
    expect(next.nextEventAtMs).toBeGreaterThanOrEqual(FIRST_EVENT_AT_MS + EVENT_INTERVAL_MIN_MS)
    expect(next.nextEventAtMs).toBeLessThanOrEqual(FIRST_EVENT_AT_MS + EVENT_INTERVAL_MAX_MS)
    expect(next.stats.eventsResolved).toBe(1)
    expect(next.log.at(-1)?.text).toBe(r.state.outcome.text)
  })

  it('weighted outcomes: fight can win or lose depending on the roll', () => {
    const s = pending('ma-tu-chan-duong')
    const win = resolveEvent(s, 'danh', () => 0)
    const lose = resolveEvent(s, 'danh', () => 0.99)
    if (!win.ok || !lose.ok) throw new Error()
    expect(win.state.state.stones).toBeGreaterThan(1000)
    expect(lose.state.state.buffs.some((b) => b.qiRateMult < 1)).toBe(true)
  })

  it('once-only events set a seen flag and chained events unlock via flags', () => {
    const s = pending('tan-tu-xin-giup')
    const r = resolveEvent(s, 'giup', () => 0)
    if (!r.ok) throw new Error()
    expect(r.state.state.flags['seen:tan-tu-xin-giup']).toBe(true)
    expect(r.state.state.flags['giup-tan-tu']).toBe(true)
    const later = { ...r.state.state, realmIndex: REALM_INDEX_BY_ID['luyen-khi-6'] }
    expect(getEligibleEvents(later).map((e) => e.id)).toContain('tan-tu-bao-an')
    expect(getEligibleEvents(later).map((e) => e.id)).not.toContain('tan-tu-bao-thu')
  })

  it('technique effect levels up an unlocked technique', () => {
    const s = pending('bi-tich-rach', 'luyen-khi-3')
    const r = resolveEvent(s, 'doc', () => 0)
    if (!r.ok) throw new Error()
    expect(Object.values(r.state.state.techniques).some((l) => l >= 1)).toBe(true)
  })

  it('pauseOnEvent freezes the simulation while an event waits', () => {
    const s = { ...pending('ma-tu-chan-duong'), settings: { timeScale: 1, pauseOnEvent: true } }
    expect(tick(s, 5000)).toBe(s)
    expect(getPendingEvent(s)?.id).toBe('ma-tu-chan-duong')
  })
})
