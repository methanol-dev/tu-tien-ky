import { describe, expect, it } from 'vitest'
import { REALM_INDEX_BY_ID, REALMS } from '@/content/realms'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import {
  canUpgradeTechnique,
  createInitialState,
  getBreakthroughChance,
  getModifiers,
  getQiRate,
  getTechniqueCost,
  upgradeTechnique,
} from '@/engine'

const DB1 = REALM_INDEX_BY_ID['dong-bi-1']

describe('techniques', () => {
  it('cost grows geometrically per level', () => {
    const def = TECHNIQUE_BY_ID['dan-khi-quyet']
    expect(getTechniqueCost(def, 0)).toBe(50)
    expect(getTechniqueCost(def, 1)).toBe(95)
    expect(getTechniqueCost(def, 2)).toBe(181)
  })

  it('is locked below the required realm and refused without stones', () => {
    const s = { ...createInitialState(0), stones: 1e9 }
    expect(canUpgradeTechnique(s, 'dan-khi-quyet')).toBe(false)
    expect(upgradeTechnique(s, 'dan-khi-quyet').ok).toBe(false)
    const poor = { ...s, realmIndex: DB1, stones: 10 }
    expect(upgradeTechnique(poor, 'dan-khi-quyet')).toEqual({ ok: false, error: 'Không đủ linh thạch' })
  })

  it('upgrades, charges stones and boosts qi rate', () => {
    const s = { ...createInitialState(0), realmIndex: DB1, stones: 100 }
    const r = upgradeTechnique(s, 'dan-khi-quyet')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.stones).toBe(50)
    expect(r.state.techniques['dan-khi-quyet']).toBe(1)
    expect(getModifiers(r.state).qiRateMult).toBeCloseTo(1.1)
    expect(getQiRate(r.state)).toBeCloseTo(REALMS[DB1].qiRate * 1.1)
    expect(r.state.log.at(-1)?.text).toContain('Lĩnh ngộ')
  })

  it('stops at max level', () => {
    const def = TECHNIQUE_BY_ID['dan-khi-quyet']
    const s = {
      ...createInitialState(0),
      realmIndex: DB1,
      stones: 1e12,
      techniques: { 'dan-khi-quyet': def.maxLevel },
    }
    expect(canUpgradeTechnique(s, 'dan-khi-quyet')).toBe(false)
    expect(upgradeTechnique(s, 'dan-khi-quyet').ok).toBe(false)
  })

  it('breakthrough bonus is additive and capped with milestone multipliers', () => {
    const idx = REALM_INDEX_BY_ID['thao-can-2']
    // Level 4 (no milestone yet): 0.02 * 4 = 0.08
    const s4 = { ...createInitialState(0), realmIndex: idx, techniques: { 'thanh-tam-chu': 4 } }
    expect(getBreakthroughChance(s4)).toBeCloseTo(REALMS[idx].breakthroughChance + 0.08)

    // Level 5 (hits Tiểu Thành x2 milestone): 0.02 * 5 * 2 = 0.20
    const s5 = { ...createInitialState(0), realmIndex: idx, techniques: { 'thanh-tam-chu': 5 } }
    // 0.86 + 0.20 = 1.06 -> capped at 0.98
    expect(getBreakthroughChance(s5)).toBe(0.98)

    const capped = { ...s4, pendingBreakthroughBonus: 0.9 }
    expect(getBreakthroughChance(capped)).toBe(0.98)
  })

  it('fail penalty reduction multiplies', () => {
    const s = { ...createInitialState(0), techniques: { 'kim-cuong-bat-hoai': 4 } }
    expect(getModifiers(s).failPenaltyMult).toBeCloseTo(0.8)
  })

  it('offline cap extends by hours', () => {
    const s = { ...createInitialState(0), techniques: { 'tu-linh-tran': 3 } }
    expect(getModifiers(s).offlineCapMs).toBe(11 * 3_600_000)
  })
})
