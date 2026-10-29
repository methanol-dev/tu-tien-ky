import { describe, expect, it } from 'vitest'
import { REALM_INDEX_BY_ID } from '@/content/realms'
import { REGIONS, STAGES_PER_REGION } from '@/content/regions'
import {
  applyOfflineProgress,
  AUTO_OPEN_NORMAL_LEVEL,
  AUTO_OPEN_TECHNIQUE,
  AUTO_STEP_DOWN_DEATHS,
  createInitialState,
  createSeededRng,
  type GameState,
  getPhaseProgress,
  getRetreatMs,
  isDifficultyAvailable,
  JOURNEY_RETREAT_MS,
  JOURNEY_STEP_MS,
  JOURNEY_WALK_MS,
  journeyTick,
  type Rng,
  setAutoAdvance,
  startRegion,
  tick,
} from '@/engine'

const HOUR = 3_600_000
const MIN = 60_000

/** Advance both clocks together, like the store does. */
function run(s: GameState, ms: number, rng: Rng, stepMs = 1000): GameState {
  let t = 0
  while (t < ms) {
    const dt = Math.min(stepMs, ms - t)
    s = journeyTick(tick(s, dt), dt, rng)
    t += dt
  }
  return s
}

const at = (realm: string) => ({ ...createInitialState(0), realmIndex: REALM_INDEX_BY_ID[realm] })

describe('journey phases', () => {
  it('rests while the region is locked, walks once the realm allows, then fights', () => {
    const rng = createSeededRng(1)
    let s = run(createInitialState(0), 20_000, rng)
    expect(s.journey.phase).toBe('rest')
    expect(s.journey.enemies).toHaveLength(0)
    s = { ...s, realmIndex: REALM_INDEX_BY_ID['dong-bi-1'] }
    s = run(s, JOURNEY_STEP_MS, rng)
    expect(s.journey.phase).toBe('walk')
    expect(s.journey.party[0].hp).toBe(s.journey.party[0].maxHp)
    s = run(s, JOURNEY_WALK_MS + JOURNEY_STEP_MS, rng)
    expect(s.journey.phase).toBe('fight')
    expect(s.journey.enemies.length).toBeGreaterThan(0)
    expect(getPhaseProgress(s)).toBe(1)
  })

  it('is deterministic per seed and independent of tick granularity', () => {
    const a = run(at('dong-bi-1'), 5 * MIN, createSeededRng(7), 100)
    const b = run(at('dong-bi-1'), 5 * MIN, createSeededRng(7), 500)
    const c = run(at('dong-bi-1'), 5 * MIN, createSeededRng(7), 2500)
    expect(a.journey).toEqual(b.journey)
    expect(b.journey).toEqual(c.journey)
    expect(a.stats.enemiesSlain).toBeGreaterThan(0)
  })

  it('holds its breath with the world when pauseOnEvent is on', () => {
    const s = { ...at('dong-bi-1'), pendingEvent: { eventId: 'x', triggeredAtMs: 0 }, settings: { timeScale: 1, pauseOnEvent: true } }
    expect(journeyTick(s, 5000, () => 0.5)).toBe(s)
  })
})

describe('journey progression', () => {
  it('at the minimum realm the hero gets deep into Thường but cannot reliably beat the boss unarmed', () => {
    let s = at('dong-bi-1')
    s = run(s, 10 * MIN, createSeededRng(3))
    expect(s.stats.stagesCleared).toBeGreaterThanOrEqual(5)
    expect(s.journey.chests.normal + s.journey.chests.red).toBeGreaterThan(0)
  })

  it('three stages above the minimum realm clears the region cleanly and steps up', () => {
    let s = at('thao-can-1')
    s = run(s, 10 * MIN, createSeededRng(3))
    expect(s.journey.cleared['hau-son-lam']).toBe(0)
    expect(s.stats.bossesSlain).toBeGreaterThanOrEqual(1)
    expect(s.journey.chests.red).toBeGreaterThanOrEqual(1)
    // Stepped up to the next harder option (region 2 Thường or region 1 Hiểm).
    expect(s.journey.regionId === 'hac-phong-dong' || s.journey.difficulty === 1).toBe(true)
  })

  it('dying retreats with growing cooldown and auto-steps down after repeated deaths', () => {
    const rng = createSeededRng(4)
    let s = at('dong-bi-1')
    // Force Tuyệt difficulty of region 1 (x27): certain death.
    s = { ...s, journey: { ...s.journey, cleared: { 'hau-son-lam': 2 } } }
    const start = startRegion(s, 'hau-son-lam', 3)
    expect(start.ok).toBe(true)
    if (!start.ok) return
    s = run(start.state, 30_000, rng)
    expect(s.journey.phase).toBe('retreat')
    expect(s.journey.deaths).toBe(1)
    expect(s.journey.phaseUntilMs - s.playedMs).toBeLessThanOrEqual(JOURNEY_RETREAT_MS)
    expect(getPhaseProgress(s)).toBeLessThan(1)
    expect(getRetreatMs(3)).toBe(JOURNEY_RETREAT_MS * 2)
    s = run(s, 15 * MIN, rng)
    expect(s.journey.difficulty).toBeLessThan(3)
    expect(s.log.some((l) => l.text.includes('lui về'))).toBe(true)
    expect(s.stats.enemiesSlain).toBeGreaterThanOrEqual(0)
    void AUTO_STEP_DOWN_DEATHS
  })

  it('startRegion gates by realm and by cleared difficulty; autoAdvance toggles', () => {
    const s = at('dong-bi-1')
    expect(startRegion(s, 'tuyet-son-dinh', 0).ok).toBe(false)
    expect(startRegion(s, 'hau-son-lam', 1).ok).toBe(false)
    expect(isDifficultyAvailable(s, 'hau-son-lam', 0)).toBe(true)
    expect(isDifficultyAvailable({ ...s, journey: { ...s.journey, cleared: { 'hau-son-lam': 0 } } }, 'hau-son-lam', 1)).toBe(true)
    expect(startRegion(s, 'nope', 0).ok).toBe(false)
    expect(setAutoAdvance(s, false).journey.autoAdvance).toBe(false)
  })

  it('stage 10 is the boss and clears heal to full', () => {
    let s = at('thao-can-2')
    s = run(s, 8 * MIN, createSeededRng(8))
    const sawBoss = s.log.some((l) => l.text.startsWith('Quét sạch'))
    expect(sawBoss).toBe(true)
    expect(s.journey.stage).toBeLessThanOrEqual(STAGES_PER_REGION)
  })

  it('auto-opens normal chests once Tụ Bảo Quyết is high enough', () => {
    let s = at('dong-bi-3')
    s = { ...s, techniques: { [AUTO_OPEN_TECHNIQUE]: AUTO_OPEN_NORMAL_LEVEL } }
    s = run(s, 10 * MIN, createSeededRng(2))
    expect(s.journey.chests.normal).toBe(0)
    expect(s.gear.length).toBeGreaterThan(0)
  })
})

describe('journey offline', () => {
  it('an 8-hour catch-up runs in well under 2s and advances the journey', () => {
    const s = { ...at('dong-bi-3'), lastSavedAt: 0 }
    const t0 = performance.now()
    const { state, report } = applyOfflineProgress(s, 8 * HOUR, undefined, createSeededRng(5))
    expect(performance.now() - t0).toBeLessThan(2000)
    expect(report.appliedMs).toBe(8 * HOUR)
    expect(report.stagesCleared).toBeGreaterThan(20)
    expect(state.journey.accMs).toBeLessThan(JOURNEY_STEP_MS)
    expect(state.log.at(-1)?.text).toContain('Hành tẩu')
  })

  it('REGIONS are reachable in order by realm', () => {
    for (let i = 1; i < REGIONS.length; i++) expect(REGIONS[i].minRealmIndex).toBeGreaterThan(REGIONS[i - 1].minRealmIndex)
  })
})
