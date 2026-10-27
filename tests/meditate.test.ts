import { describe, expect, it } from 'vitest'
import { REALMS } from '@/content/realms'
import { createInitialState, DAYS_PER_YEAR, meditate, MEDITATE_BONUS_SECONDS } from '@/engine'

describe('meditate', () => {
  it('grants a burst of qi equal to a few seconds of passive rate', () => {
    const s = meditate(createInitialState(0))
    expect(s.qi).toBeCloseTo(REALMS[0].qiRate * MEDITATE_BONUS_SECONDS)
    expect(s.stats.qiTotal).toBeCloseTo(s.qi)
  })

  it('does nothing once lifespan is exceeded', () => {
    const s0 = { ...createInitialState(0), ageDays: REALMS[0].lifespanYears * DAYS_PER_YEAR }
    expect(meditate(s0)).toBe(s0)
  })
})
