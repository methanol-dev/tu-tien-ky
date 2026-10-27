import { describe, expect, it } from 'vitest'
import { createSeededRng } from '@/engine'

describe('seeded rng', () => {
  it('is deterministic for the same seed', () => {
    const a = createSeededRng(42)
    const b = createSeededRng(42)
    const seqA = Array.from({ length: 5 }, () => a())
    const seqB = Array.from({ length: 5 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('stays within [0, 1) and differs across seeds', () => {
    const r = createSeededRng(7)
    for (let i = 0; i < 1000; i++) {
      const v = r()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
    expect(createSeededRng(1)()).not.toBe(createSeededRng(2)())
  })
})
