import { describe, expect, it } from 'vitest'
import { REALMS } from '@/content/realms'
import { createInitialState, DAYS_PER_YEAR, getQiRate, tick } from '@/engine'

describe('tick', () => {
  it('accumulates qi at the realm rate', () => {
    const s0 = createInitialState(0)
    const s1 = tick(s0, 10_000)
    expect(s1.qi).toBeCloseTo(REALMS[0].qiRate * 10)
    expect(s1.stats.qiTotal).toBeCloseTo(REALMS[0].qiRate * 10)
    expect(s1.playedMs).toBe(10_000)
  })

  it('ages the cultivator according to timeScale', () => {
    const s0 = { ...createInitialState(0), settings: { timeScale: 2 } }
    const s1 = tick(s0, 5_000)
    expect(s1.ageDays - s0.ageDays).toBeCloseTo(10)
  })

  it('does not mutate the input state', () => {
    const s0 = createInitialState(0)
    const snapshot = JSON.stringify(s0)
    tick(s0, 1_000)
    expect(JSON.stringify(s0)).toBe(snapshot)
  })

  it('returns the same state for non-positive dt', () => {
    const s0 = createInitialState(0)
    expect(tick(s0, 0)).toBe(s0)
    expect(tick(s0, -5)).toBe(s0)
  })

  it('stops qi gain once lifespan is exceeded', () => {
    const s0 = createInitialState(0)
    const old = { ...s0, ageDays: REALMS[0].lifespanYears * DAYS_PER_YEAR + 1 }
    expect(getQiRate(old)).toBe(0)
    expect(tick(old, 10_000).qi).toBe(0)
  })
})
