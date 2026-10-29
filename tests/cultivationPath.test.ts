import { describe, expect, it } from 'vitest'
import { createInitialState } from '@/engine/state'
import { getCombatStats } from '@/engine/combat'
import { attemptBreakthrough, canBreakthrough, getBreakthroughProgress, meditate } from '@/engine/cultivation'
import { MARTIAL_STAGES } from '@/content/martialRealms'

describe('Cultivation Path & Combat Range Simulation (Phase 2)', () => {
  it('identifies melee combat range and applies 10-truong suppression mult (+35% Atk) for Vo Phu', () => {
    const s = {
      ...createInitialState(0),
      classId: 'vo-phu' as const,
      cultivationPath: 'martial' as const,
    }
    const stats = getCombatStats(s)
    expect(stats.combatRange).toBe('melee')
    expect(stats.meleeSuppressionMult).toBe(1.35)
  })

  it('identifies ranged combat range with 1.0 mult for Kiem Tu and applies signature crit bonuses', () => {
    const s = {
      ...createInitialState(0),
      classId: 'kiem-tu' as const,
      cultivationPath: 'qi' as const,
    }
    const stats = getCombatStats(s)
    expect(stats.combatRange).toBe('ranged')
    expect(stats.meleeSuppressionMult).toBe(1.0)
    // Kiem Tu has base crit mult bonus +0.2
    expect(stats.critMult).toBeGreaterThanOrEqual(1.7)
  })

  it('meditate grants punches for Martial Artist and qi for Qi Cultivator', () => {
    const martialState = {
      ...createInitialState(0),
      cultivationPath: 'martial' as const,
      punches: 10,
    }
    const nextMartial = meditate(martialState)
    expect(nextMartial.punches).toBeGreaterThan(10)
    expect(nextMartial.qi).toBe(0)

    const qiState = {
      ...createInitialState(0),
      cultivationPath: 'qi' as const,
      qi: 10,
    }
    const nextQi = meditate(qiState)
    expect(nextQi.punches).toBe(0)
    expect(nextQi.qi).toBeGreaterThan(10)
  })

  it('allows Vo Phu breakthrough without tribulation once punches meet the threshold', () => {
    const nextStage = MARTIAL_STAGES[1] // Moc Thai Canh (minPunches: 50)
    const s = {
      ...createInitialState(0),
      cultivationPath: 'martial' as const,
      martialStageIndex: 0,
      punches: 55,
    }

    expect(canBreakthrough(s)).toBe(true)
    expect(getBreakthroughProgress(s)).toBe(1)

    const res = attemptBreakthrough(s, () => 0.5)
    expect(res.success).toBe(true)
    expect(res.tribulation).toBe(false)
    expect(res.state.martialStageIndex).toBe(1)
    expect(res.state.realmIndex).toBe(3) // Thao Can Canh tuong duong
  })
})
