import { describe, expect, it } from 'vitest'
import { REALMS } from '@/content/realms'
import {
  createInitialState,
  DAYS_PER_YEAR,
  getActiveBuffs,
  getLifespanDays,
  getQiRate,
  tick,
  usePill,
} from '@/engine'

function withItems(items: Record<string, number>) {
  return { ...createInitialState(0), inventory: items }
}

describe('pills', () => {
  it('refuses unknown items, herbs, and empty stacks', () => {
    const s = withItems({ 'linh-thao': 1 })
    expect(usePill(s, 'nope').ok).toBe(false)
    expect(usePill(s, 'linh-thao').ok).toBe(false)
    expect(usePill(s, 'tu-khi-dan').ok).toBe(false)
  })

  it('instant qi pill adds a fraction of the requirement and consumes one', () => {
    const r = usePill(withItems({ 'tu-khi-dan': 2 }), 'tu-khi-dan')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.qi).toBeCloseTo(REALMS[0].qiRequired * 0.1)
    expect(r.state.inventory['tu-khi-dan']).toBe(1)
    expect(r.state.stats.pillsUsed).toBe(1)
  })

  it('buff pill doubles qi rate until it expires through tick', () => {
    const r = usePill(withItems({ 'ngung-than-dan': 1 }), 'ngung-than-dan')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(getActiveBuffs(r.state)).toHaveLength(1)
    expect(getQiRate(r.state)).toBeCloseTo(REALMS[0].qiRate * 2)
    const later = tick(r.state, 5 * 60_000 + 1)
    expect(later.buffs).toHaveLength(0)
    expect(getQiRate(later)).toBeCloseTo(REALMS[0].qiRate)
    expect(r.state.inventory['ngung-than-dan']).toBeUndefined()
  })

  it('re-using a buff pill refreshes instead of stacking', () => {
    const first = usePill(withItems({ 'ngung-than-dan': 2 }), 'ngung-than-dan')
    if (!first.ok) throw new Error()
    const mid = tick(first.state, 60_000)
    const second = usePill(mid, 'ngung-than-dan')
    if (!second.ok) throw new Error()
    expect(second.state.buffs).toHaveLength(1)
    expect(second.state.buffs[0].expiresAtMs).toBe(mid.playedMs + 5 * 60_000)
  })

  it('breakthrough pill sets a pending bonus and refuses a weaker duplicate', () => {
    const r = usePill(withItems({ 'pha-canh-dan': 2, 'kim-nguyen-dan': 1 }), 'pha-canh-dan')
    if (!r.ok) throw new Error()
    expect(r.state.pendingBreakthroughBonus).toBe(0.15)
    expect(usePill(r.state, 'pha-canh-dan').ok).toBe(false)
    const up = usePill(r.state, 'kim-nguyen-dan')
    expect(up.ok).toBe(true)
    if (up.ok) expect(up.state.pendingBreakthroughBonus).toBe(0.3)
  })

  it('lifespan pill extends lifespan', () => {
    const s = withItems({ 'tang-tho-dan': 1 })
    const before = getLifespanDays(s)
    const r = usePill(s, 'tang-tho-dan')
    if (!r.ok) throw new Error()
    expect(getLifespanDays(r.state)).toBe(before + 20 * DAYS_PER_YEAR)
  })
})
