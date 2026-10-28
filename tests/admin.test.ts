import { describe, expect, it } from 'vitest'
import {
  adminAddChests,
  adminAddHerbsAndPills,
  adminAddPunches,
  adminAddQi,
  adminAddStones,
  adminGiveFullGear,
  adminInstantBreakthrough,
  adminSetRealm,
  adminSetTimeScale,
  adminUnlockAllRegions,
} from '@/engine/admin'
import { createInitialState } from '@/engine/state'
import { GEAR_SLOTS } from '@/content/gear'

describe('Admin Dev Tools', () => {
  it('adds stones and qi accurately', () => {
    const s0 = createInitialState(0)
    const s1 = adminAddStones(s0, 500_000)
    expect(s1.stones).toBe(500_000)
    expect(s1.stats.stonesTotal).toBe(500_000)

    const s2 = adminAddQi(s1, 100_000)
    expect(s2.qi).toBe(100_000)
    expect(s2.stats.qiTotal).toBe(100_000)
  })

  it('sets and breakthroughs realm', () => {
    const s0 = createInitialState(0)
    const s1 = adminSetRealm(s0, 7) // Kim Đan Sơ Kỳ
    expect(s1.realmIndex).toBe(7)

    const s2 = adminInstantBreakthrough(s1)
    expect(s2.realmIndex).toBe(8)
  })

  it('adds punches, chests, and unlocks all regions', () => {
    const s0 = createInitialState(0)
    const s1 = adminAddPunches(s0, 1000)
    expect(s1.stats.enemiesSlain).toBe(1000)

    const s2 = adminAddChests(s1, 50, 50)
    expect(s2.journey.chests.normal).toBe(50)
    expect(s2.journey.chests.red).toBe(50)

    const s3 = adminUnlockAllRegions(s2)
    expect(Object.keys(s3.journey.cleared).length).toBeGreaterThanOrEqual(9)
  })

  it('equips full 12神 gear items', () => {
    const s0 = createInitialState(0)
    const s1 = adminGiveFullGear(s0)
    for (const slot of GEAR_SLOTS) {
      expect(s1.equipped[slot]).toBeTruthy()
    }
  })

  it('adjusts timeScale safely within range', () => {
    const s0 = createInitialState(0)
    const s1 = adminSetTimeScale(s0, 10)
    expect(s1.settings.timeScale).toBe(10)

    const s2 = adminSetTimeScale(s0, 200)
    expect(s2.settings.timeScale).toBe(100) // capped
  })

  it('fills herbs and pills inventory', () => {
    const s0 = createInitialState(0)
    const s1 = adminAddHerbsAndPills(s0, 99)
    expect(s1.inventory['linh-thao']).toBe(99)
    expect(s1.inventory['tu-khi-dan']).toBe(99)
  })
})

