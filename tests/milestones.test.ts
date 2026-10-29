import { describe, expect, it } from 'vitest'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import {
  createInitialState,
  getCurrentTechniqueMilestone,
  getNextTechniqueMilestone,
  getTechniqueEffectiveValue,
  getTechniqueMilestoneMultiplier,
  TECHNIQUE_MILESTONES,
  upgradeTechnique,
} from '@/engine'

describe('technique milestone multipliers', () => {
  it('defines the 5 core milestones', () => {
    expect(TECHNIQUE_MILESTONES).toHaveLength(5)
    expect(TECHNIQUE_MILESTONES.map((m) => m.level)).toEqual([5, 10, 25, 50, 100])
    expect(TECHNIQUE_MILESTONES.map((m) => m.mult)).toEqual([2, 3, 5, 10, 50])
  })

  it('calculates cumulative milestone multipliers across levels', () => {
    expect(getTechniqueMilestoneMultiplier(0)).toBe(1)
    expect(getTechniqueMilestoneMultiplier(4)).toBe(1)
    expect(getTechniqueMilestoneMultiplier(5)).toBe(2)
    expect(getTechniqueMilestoneMultiplier(9)).toBe(2)
    expect(getTechniqueMilestoneMultiplier(10)).toBe(6) // 2 * 3
    expect(getTechniqueMilestoneMultiplier(24)).toBe(6)
    expect(getTechniqueMilestoneMultiplier(25)).toBe(30) // 6 * 5
    expect(getTechniqueMilestoneMultiplier(50)).toBe(300) // 30 * 10
    expect(getTechniqueMilestoneMultiplier(100)).toBe(15000) // 300 * 50
  })

  it('tracks next and current milestones accurately', () => {
    expect(getCurrentTechniqueMilestone(0)).toBeNull()
    expect(getCurrentTechniqueMilestone(4)).toBeNull()
    expect(getCurrentTechniqueMilestone(5)?.label).toBe('Tiểu Thành')
    expect(getCurrentTechniqueMilestone(9)?.label).toBe('Tiểu Thành')
    expect(getCurrentTechniqueMilestone(10)?.label).toBe('Đại Thành')

    expect(getNextTechniqueMilestone(0)?.level).toBe(5)
    expect(getNextTechniqueMilestone(5)?.level).toBe(10)
    expect(getNextTechniqueMilestone(25)?.level).toBe(50)
    expect(getNextTechniqueMilestone(100)).toBeNull()
  })

  it('computes effective value with explosive spike', () => {
    const def = TECHNIQUE_BY_ID['dan-khi-quyet'] // perLevel = 0.1
    expect(getTechniqueEffectiveValue(def, 0)).toBe(0)
    expect(getTechniqueEffectiveValue(def, 1)).toBeCloseTo(0.1)
    expect(getTechniqueEffectiveValue(def, 4)).toBeCloseTo(0.4)
    // At level 5, 0.1 * 5 * 2 = 1.0
    expect(getTechniqueEffectiveValue(def, 5)).toBeCloseTo(1.0)
    // At level 10, 0.1 * 10 * 6 = 6.0
    expect(getTechniqueEffectiveValue(def, 10)).toBeCloseTo(6.0)
  })

  it('caps fail penalty reduction safely at 0.95', () => {
    const def = TECHNIQUE_BY_ID['kim-cuong-bat-hoai'] // perLevel = 0.05
    // Level 10: 0.05 * 10 * 6 = 3.0 -> capped at 0.95
    expect(getTechniqueEffectiveValue(def, 10)).toBe(0.95)
  })

  it('logs a breakthrough event when hitting a milestone upon upgrade', () => {
    const s = {
      ...createInitialState(0),
      realmIndex: 20,
      stones: 1e9,
      techniques: { 'dan-khi-quyet': 4 },
    }
    const r = upgradeTechnique(s, 'dan-khi-quyet')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.techniques['dan-khi-quyet']).toBe(5)
    const lastLog = r.state.log.at(-1)
    expect(lastLog?.kind).toBe('event')
    expect(lastLog?.text).toContain('Tiểu Thành')
    expect(lastLog?.text).toContain('bùng nổ x2')
  })
})
