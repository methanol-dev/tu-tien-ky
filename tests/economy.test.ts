import { describe, expect, it } from 'vitest'
import { REALMS } from '@/content/realms'
import {
  attemptBreakthrough,
  BREAKTHROUGH_STONE_SECONDS,
  buyItem,
  createInitialState,
  getStoneRate,
  STONE_RATE_FACTOR,
  tick,
} from '@/engine'

describe('economy', () => {
  it('earns spirit stones over time', () => {
    const s = tick(createInitialState(0), 10_000)
    expect(getStoneRate(s)).toBeCloseTo(Math.sqrt(REALMS[0].qiRate) * STONE_RATE_FACTOR)
    expect(s.stones).toBeCloseTo(Math.sqrt(REALMS[0].qiRate) * STONE_RATE_FACTOR * 10)
    expect(s.stats.stonesTotal).toBeCloseTo(s.stones)
  })

  it('awards stones on a successful breakthrough and spends the pill bonus', () => {
    const s = { ...createInitialState(0), qi: REALMS[0].qiRequired, pendingBreakthroughBonus: 0.15 }
    const r = attemptBreakthrough(s, () => 0)
    expect(r.success).toBe(true)
    expect(r.stonesGained).toBe(Math.round(Math.sqrt(REALMS[0].qiRate) * STONE_RATE_FACTOR * BREAKTHROUGH_STONE_SECONDS))
    expect(r.state.stones).toBe(r.stonesGained)
    expect(r.state.pendingBreakthroughBonus).toBe(0)
  })

  it('spends the pill bonus even on failure', () => {
    const s = { ...createInitialState(0), realmIndex: 5, qi: REALMS[5].qiRequired, pendingBreakthroughBonus: 0.15 }
    const r = attemptBreakthrough(s, () => 0.999)
    expect(r.success).toBe(false)
    expect(r.state.pendingBreakthroughBonus).toBe(0)
  })

  it('shop sells herbs for stones and refuses pills', () => {
    const s = { ...createInitialState(0), stones: 100 }
    const r = buyItem(s, 'linh-thao', 3)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.state.stones).toBe(70)
      expect(r.state.inventory['linh-thao']).toBe(3)
    }
    expect(buyItem(s, 'tu-khi-dan').ok).toBe(false)
    expect(buyItem(s, 'linh-thao', 11).ok).toBe(false)
    expect(buyItem(s, 'linh-thao', 0).ok).toBe(false)
  })
})
