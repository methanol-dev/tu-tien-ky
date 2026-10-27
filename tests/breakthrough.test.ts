import { describe, expect, it } from 'vitest'
import { REALMS, REALM_INDEX_BY_ID } from '@/content/realms'
import {
  attemptBreakthrough,
  canBreakthrough,
  createInitialState,
  FAIL_PENALTY_MAX,
  FAIL_PENALTY_MIN,
  getBreakthroughProgress,
} from '@/engine'

const alwaysLow = () => 0 // roll 0 < chance -> success
const alwaysHigh = () => 0.999 // roll >= chance -> fail (for chance < 0.999)

describe('breakthrough', () => {
  it('is not possible below the qi threshold', () => {
    const s = createInitialState(0)
    expect(canBreakthrough(s)).toBe(false)
    expect(getBreakthroughProgress(s)).toBe(0)
    const r = attemptBreakthrough(s, alwaysLow)
    expect(r.success).toBe(false)
    expect(r.state).toBe(s)
  })

  it('advances one stage, resets qi and logs on success', () => {
    const s = { ...createInitialState(0), qi: REALMS[0].qiRequired }
    expect(canBreakthrough(s)).toBe(true)
    expect(getBreakthroughProgress(s)).toBe(1)
    const r = attemptBreakthrough(s, alwaysLow)
    expect(r.success).toBe(true)
    expect(r.state.realmIndex).toBe(1)
    expect(r.state.qi).toBe(0)
    expect(r.state.stats.breakthroughs).toBe(1)
    expect(r.to?.id).toBe('luyen-khi-1')
    expect(r.state.log.some((l) => l.kind === 'success')).toBe(true)
  })

  it('loses 10-30% qi and logs on failure', () => {
    const idx = REALM_INDEX_BY_ID['luyen-khi-5']
    const qi = REALMS[idx].qiRequired * 1.5
    const s = { ...createInitialState(0), realmIndex: idx, qi }
    const r = attemptBreakthrough(s, alwaysHigh)
    expect(r.success).toBe(false)
    expect(r.state.realmIndex).toBe(idx)
    const lostFrac = r.qiLost / qi
    expect(lostFrac).toBeGreaterThanOrEqual(FAIL_PENALTY_MIN)
    expect(lostFrac).toBeLessThanOrEqual(FAIL_PENALTY_MAX)
    expect(r.state.qi).toBeCloseTo(qi - r.qiLost)
    expect(r.state.stats.breakthroughFailures).toBe(1)
    expect(r.state.log.at(-1)?.kind).toBe('danger')
  })

  it('cannot break through from the terminal realm', () => {
    const s = { ...createInitialState(0), realmIndex: REALMS.length - 1, qi: 1e30 }
    expect(canBreakthrough(s)).toBe(false)
    expect(attemptBreakthrough(s, alwaysLow).success).toBe(false)
  })

  it('logs the lifespan bump when entering a new major realm', () => {
    const idx = REALM_INDEX_BY_ID['luyen-khi-9']
    const s = { ...createInitialState(0), realmIndex: idx, qi: REALMS[idx].qiRequired }
    const r = attemptBreakthrough(s, alwaysLow)
    expect(r.to?.firstOfMajor).toBe(true)
    expect(r.state.log.some((l) => l.text.includes('Thọ nguyên'))).toBe(true)
  })
})
