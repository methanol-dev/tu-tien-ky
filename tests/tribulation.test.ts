import { describe, expect, it } from 'vitest'
import { REALM_INDEX_BY_ID, REALMS } from '@/content/realms'
import {
  attemptBreakthrough,
  canUseTribulationPill,
  createInitialState,
  createSeededRng,
  getBoltFraction,
  getCombatStats,
  getTribulationBolts,
  resolveBolt,
  TRIBULATION_FAIL_QI_LOSS,
} from '@/engine'

const TC4 = REALM_INDEX_BY_ID['truc-co-4']

const ready = () => ({ ...createInitialState(0), realmIndex: TC4, qi: REALMS[TC4].qiRequired, inventory: { 'tu-khi-dan': 2 } })

describe('tribulation', () => {
  it('bolt count grows per major realm from Kim Đan', () => {
    expect(getTribulationBolts(REALMS[REALM_INDEX_BY_ID['kim-dan-1']])).toBe(3)
    expect(getTribulationBolts(REALMS[REALM_INDEX_BY_ID['nguyen-anh-1']])).toBe(4)
    expect(getTribulationBolts(REALMS[REALM_INDEX_BY_ID['phi-thang']])).toBe(9)
    expect(getBoltFraction(0)).toBeCloseTo(0.18)
    expect(getBoltFraction(2)).toBeCloseTo(0.34)
  })

  it('breakthrough from a tribulation stage starts a tribulation instead of rolling', () => {
    const r = attemptBreakthrough(ready(), () => 0)
    expect(r.tribulation).toBe(true)
    expect(r.success).toBe(false)
    expect(r.state.realmIndex).toBe(TC4)
    expect(r.state.tribulation?.bolts).toBe(3)
    expect(r.state.tribulation?.hp).toBe(getCombatStats(ready()).hp)
    expect(r.state.tribulation?.current).toBe(0)
  })

  it('pending pill bonus becomes damage reduction and is consumed', () => {
    const r = attemptBreakthrough({ ...ready(), pendingBreakthroughBonus: 0.3 }, () => 0)
    expect(r.state.tribulation?.reduction).toBeCloseTo(0.3)
    expect(r.state.pendingBreakthroughBonus).toBe(0)
  })

  it('tanking all bolts with average rolls survives Kim Đan and promotes', () => {
    let s = attemptBreakthrough(ready(), () => 0).state
    const mid = () => 0.5
    for (let i = 0; i < 2; i++) {
      const b = resolveBolt(s, 'tank', mid)
      if (!b.ok) throw new Error(b.error)
      expect(b.state.finished).toBe(false)
      s = b.state.state
    }
    const last = resolveBolt(s, 'tank', mid)
    if (!last.ok) throw new Error()
    expect(last.state.finished).toBe(true)
    expect(last.state.success).toBe(true)
    expect(last.state.state.realmIndex).toBe(TC4 + 1)
    expect(last.state.state.tribulation).toBeNull()
    expect(last.state.state.stats.tribulationsPassed).toBe(1)
    expect(last.state.state.qi).toBe(0)
  })

  it('dodge is a gamble, pill shields and is consumed', () => {
    const s = attemptBreakthrough(ready(), () => 0).state
    const dodgeOk = resolveBolt(s, 'dodge', () => 0.1)
    const dodgeBad = resolveBolt(s, 'dodge', () => 0.9)
    const tank = resolveBolt(s, 'tank', () => 0.5)
    const pill = resolveBolt(s, 'pill', () => 0.5)
    if (!dodgeOk.ok || !dodgeBad.ok || !tank.ok || !pill.ok) throw new Error()
    expect(dodgeOk.state.dodged).toBe(true)
    expect(dodgeOk.state.damage).toBe(0)
    expect(dodgeBad.state.damage).toBeGreaterThan(tank.state.damage)
    expect(pill.state.damage).toBeLessThan(tank.state.damage)
    expect(pill.state.state.inventory['tu-khi-dan']).toBe(1)
    expect(canUseTribulationPill({ ...s, inventory: {} })).toBe(false)
    expect(resolveBolt({ ...s, inventory: {} }, 'pill', () => 0).ok).toBe(false)
  })

  it('running out of HP fails the tribulation with penalties', () => {
    const started = attemptBreakthrough(ready(), () => 0).state
    const weak = { ...started, tribulation: { ...started.tribulation!, hp: 1 } }
    const r = resolveBolt(weak, 'tank', () => 0.5)
    if (!r.ok) throw new Error()
    expect(r.state.finished).toBe(true)
    expect(r.state.success).toBe(false)
    expect(r.state.state.realmIndex).toBe(TC4)
    expect(r.state.state.qi).toBeCloseTo(REALMS[TC4].qiRequired * (1 - TRIBULATION_FAIL_QI_LOSS))
    expect(r.state.state.buffs.some((b) => b.id === 'trong-thuong')).toBe(true)
    expect(r.state.state.stats.tribulationsFailed).toBe(1)
  })

  it('a 9-bolt tribulation cannot be tanked without help', () => {
    const idx = REALM_INDEX_BY_ID['do-kiep']
    let s = attemptBreakthrough({ ...createInitialState(0), realmIndex: idx, qi: REALMS[idx].qiRequired }, () => 0).state
    let finished = false
    let success: boolean | null = null
    const rng = createSeededRng(5)
    while (!finished) {
      const b = resolveBolt(s, 'tank', rng)
      if (!b.ok) throw new Error()
      s = b.state.state
      finished = b.state.finished
      success = b.state.success
    }
    expect(success).toBe(false)
  })
})
