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

  it('reaches Luyện Khí within the first minute and Trúc Cơ within 10-60 minutes', () => {
    expect(at('luyen-khi-1')).toBeLessThanOrEqual(1 * MIN + 30)
    expect(at('truc-co-1')).toBeGreaterThanOrEqual(10 * MIN)
    expect(at('truc-co-1')).toBeLessThanOrEqual(60 * MIN)
  })

  it('reaches Kim Đan between 2 and 8 hours, Nguyên Anh between 6 and 20 hours', () => {
    expect(at('kim-dan-1')).toBeGreaterThanOrEqual(2 * HOUR)
    expect(at('kim-dan-1')).toBeLessThanOrEqual(8 * HOUR)
    expect(at('nguyen-anh-1')).toBeGreaterThanOrEqual(6 * HOUR)
    expect(at('nguyen-anh-1')).toBeLessThanOrEqual(20 * HOUR)
  })

  it('does not reach Hóa Thần in a day, and passes at least one tribulation', () => {
    expect(at('hoa-than-1')).toBeUndefined()
    expect(r.final.stats.tribulationsPassed).toBeGreaterThanOrEqual(1)
    expect(r.final.stats.bossesSlain).toBeGreaterThan(0)
  })

  it('a passive player (no taps, no events) still reaches Trúc Cơ within 2 hours', () => {
    const p = simulate({ seconds: 2 * HOUR, seed: 2, tapsPerSec: 0, events: false })
    expect(p.reachedAt[REALM_INDEX_BY_ID['truc-co-1']]).toBeDefined()
  })
})
