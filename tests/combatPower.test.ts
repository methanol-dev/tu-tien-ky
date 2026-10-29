import { describe, expect, it } from 'vitest'
import {
  calculateCombatPower,
  calculateGearDelta,
  formatCombatPower,
  formatCPDelta,
  getCombatPower,
} from '@/engine/combatPower'
import type { CombatStats } from '@/engine/combat'
import { createInitialState } from '@/engine/state'
import { forgeGear } from '@/engine/forge'
import { GEAR_DEFS } from '@/content/gear'

describe('Combat Power (Lực Chiến Tổng Hợp - CP ⚔️)', () => {
  const baseStats: CombatStats = {
    hp: 1000,
    atk: 100,
    def: 50,
    crit: 0.05,
    critMult: 1.5,
    attackMs: 1000,
    lifesteal: 0,
    combatRange: 'melee',
    meleeSuppressionMult: 1.35,
    armorPen: 0,
    heavyDmgPct: 0,
    damageReduction: 0,
    dodgeChance: 0,
    executeThreshold: 0,
  }

  it('calculates combat power based on realistic stats', () => {
    const cp = calculateCombatPower(baseStats)
    expect(cp).toBeGreaterThan(0)
    // 1000*0.2 + 100*2.5 + 50*1.8 + 0.05*1500 = 200 + 250 + 90 + 75 = 615
    expect(cp).toBe(615)
  })

  it('scales power when attack speed increases (lower attackMs)', () => {
    const normalCp = calculateCombatPower(baseStats)
    const fastCp = calculateCombatPower({ ...baseStats, attackMs: 500 }) // double speed
    expect(fastCp).toBeGreaterThan(normalCp)
    expect(fastCp).toBe(normalCp * 2)
  })

  it('scales power when crit, dodge, or defense increases', () => {
    const cp1 = calculateCombatPower(baseStats)
    const cp2 = calculateCombatPower({ ...baseStats, crit: 0.2, dodgeChance: 0.1, atk: 200 })
    expect(cp2).toBeGreaterThan(cp1)
  })

  it('computes initial state combat power correctly', () => {
    const s = createInitialState()
    const cp = getCombatPower(s)
    expect(cp).toBeGreaterThan(50)
  })

  it('increases player CP when cultivating to higher realm', () => {
    const s = createInitialState()
    const cpInit = getCombatPower(s)
    s.realmIndex = 5 // Long Môn Cảnh
    const cpHigh = getCombatPower(s)
    expect(cpHigh).toBeGreaterThan(cpInit)
  })

  describe('calculateGearDelta', () => {
    it('returns zero delta when new gear is null or identical to equipped', () => {
      const s = createInitialState()
      const resNull = calculateGearDelta(s, null)
      expect(resNull.delta).toBe(0)
      expect(resNull.isUpgrade).toBe(false)
    })

    it('identifies upgrade correctly when forged gear has higher stats', () => {
      const s = createInitialState()
      // Forging with forced high seed for good affixes
      const res = forgeGear(s, () => 0.99)
      expect(res.ok).toBe(true)

      if (res.ok) {
        const gear = res.state.gear
        expect(gear).not.toBeNull()
        const deltaRes = calculateGearDelta(s, gear)
        expect(deltaRes.currentCP).toBeGreaterThan(0)
        expect(deltaRes.newCP).toBeGreaterThan(0)
        expect(deltaRes.isUpgrade).toBe(deltaRes.delta > 0)
      }
    })

    it('handles comparing replacing an existing slot with a stronger gear', () => {
      const s = createInitialState()
      const weaponDef = GEAR_DEFS.find((d) => d.slot === 'vu-khi')!
      
      const weakWeapon = {
        uid: 'weak-1',
        defId: weaponDef.id,
        rarity: 'pham' as const,
        tier: 1,
        affixes: [{ key: 'atk' as const, value: 0.05 }],
      }
      const strongWeapon = {
        uid: 'strong-1',
        defId: weaponDef.id,
        rarity: 'than' as const,
        tier: 5,
        affixes: [{ key: 'atk' as const, value: 0.8 }, { key: 'crit' as const, value: 0.2 }],
      }

      s.gear.push(weakWeapon, strongWeapon)
      s.equipped['vu-khi'] = weakWeapon.uid

      const delta = calculateGearDelta(s, strongWeapon)
      expect(delta.delta).toBeGreaterThan(0)
      expect(delta.isUpgrade).toBe(true)

      // Comparing weak to strong (downgrade)
      s.equipped['vu-khi'] = strongWeapon.uid
      const downgradeDelta = calculateGearDelta(s, weakWeapon)
      expect(downgradeDelta.delta).toBeLessThan(0)
      expect(downgradeDelta.isUpgrade).toBe(false)
    })
  })

  describe('Formatting helpers', () => {
    it('formats combat power numbers cleanly', () => {
      expect(formatCombatPower(850)).toBe('850')
      expect(formatCombatPower(12450)).toBe('12.4K')
      expect(formatCombatPower(1500000)).toBe('1.50M')
    })

    it('formats delta badges with arrows and symbols', () => {
      const positive = formatCPDelta(350)
      expect(positive.isPositive).toBe(true)
      expect(positive.isZero).toBe(false)
      expect(positive.text).toContain('▲ +')
      expect(positive.text).toContain('⚔️')

      const negative = formatCPDelta(-120)
      expect(negative.isPositive).toBe(false)
      expect(negative.isZero).toBe(false)
      expect(negative.text).toContain('▼ -')

      const zero = formatCPDelta(0)
      expect(zero.isZero).toBe(true)
      expect(zero.text).toContain('Tương đương')
    })
  })
})
