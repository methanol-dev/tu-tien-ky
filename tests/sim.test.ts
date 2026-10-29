import { describe, expect, it } from 'vitest'
import { REALM_INDEX_BY_ID } from '@/content/realms'
import { simulate } from '@/engine'

const MIN = 60
const HOUR = 3600

/**
 * Balance guardrails. An active bot (1 tap/s for 10 min, auto events, constant expeditions)
 * must land inside these windows; a real player is somewhat slower.
 */
describe('balance simulation (24h active bot, seed 1)', () => {
  const t0 = performance.now()
  const r = simulate({ seconds: 24 * HOUR, seed: 1, tapsPerSec: 1, activeSeconds: 600, events: true })
  const elapsed = performance.now() - t0
  const at = (id: string) => r.reachedAt[REALM_INDEX_BY_ID[id]]

  it('runs a full day within acceptable time budget', () => {
    // Shared CI runners (e.g. GitHub Actions 2 vCPUs running 30 concurrent workers) have CPU contention.
    expect(elapsed).toBeLessThan(15000)
  })

  it('reaches Đồng Bì within the first minute and Động Phủ within 10-60 minutes', () => {
    expect(at('dong-bi-1')).toBeLessThanOrEqual(1 * MIN + 30)
    expect(at('dong-phu-1')).toBeGreaterThanOrEqual(10 * MIN)
    expect(at('dong-phu-1')).toBeLessThanOrEqual(60 * MIN)
  })

  it('reaches Kim Đan between 1 and 6 hours, Nguyên Anh between 2 and 12 hours', () => {
    expect(at('kim-dan-1')).toBeGreaterThanOrEqual(1 * HOUR)
    expect(at('kim-dan-1')).toBeLessThanOrEqual(6 * HOUR)
    expect(at('nguyen-anh-1')).toBeGreaterThanOrEqual(2 * HOUR)
    expect(at('nguyen-anh-1')).toBeLessThanOrEqual(12 * HOUR)
  })

  it('does not reach Thập Tứ Cảnh in a day, and passes at least one tribulation', () => {
    expect(at('thap-tu-1')).toBeUndefined()
    expect(r.final.stats.tribulationsPassed).toBeGreaterThanOrEqual(1)
    expect(r.final.stats.bossesSlain).toBeGreaterThan(0)
  })

  it('a passive player (no taps, no events) still reaches Động Phủ within 2 hours', () => {
    const p = simulate({ seconds: 2 * HOUR, seed: 2, tapsPerSec: 0, events: false })
    expect(p.reachedAt[REALM_INDEX_BY_ID['dong-phu-1']]).toBeDefined()
  })
})
