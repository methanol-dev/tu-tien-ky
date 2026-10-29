import { describe, expect, it } from 'vitest'
import {
  FORGE_EXP_TABLE,
  FORGE_MAX_LEVEL,
  canForge,
  createInitialForge,
  equipPendingGear,
  forgeGear,
  getForgeGearTier,
  getTargetSlotForGear,
  rollForgeRarity,
  salvagePendingGear,
  buyFire,
  addFire,
  updateForgeFilters,
} from '@/engine/forge'
import { createInitialState } from '@/engine/state'

describe('Forge Engine (Đan Lô Luyện Khí)', () => {
  it('creates initial forge with 50 fire and level 1', () => {
    const forge = createInitialForge()
    expect(forge.level).toBe(1)
    expect(forge.exp).toBe(0)
    expect(forge.fireCount).toBe(50)
    expect(forge.pendingGear).toBeNull()
    expect(forge.autoFilters.stopOnHigherScore).toBe(true)
  })

  it('rolls rarity respecting forge level weights', () => {
    // Level 1: mostly pham (85%)
    let phamCount = 0
    for (let i = 0; i < 100; i++) {
      const seed = i / 100
      const r = rollForgeRarity(1, () => seed)
      if (r === 'pham') phamCount++
    }
    expect(phamCount).toBeGreaterThan(70)

    // Level 20: only bao (20%), tien (50%), than (30%)
    for (let i = 0; i < 100; i++) {
      const seed = i / 100
      const r = rollForgeRarity(FORGE_MAX_LEVEL, () => seed)
      expect(['bao', 'tien', 'than']).toContain(r)
    }
  })

  it('determines gear tier by realm index', () => {
    const s = createInitialState()
    expect(getForgeGearTier(s)).toBe(1)
    s.realmIndex = 6
    expect(getForgeGearTier(s)).toBe(3)
  })

  it('forges gear and sets pendingGear', () => {
    const s = createInitialState()
    expect(canForge(s)).toBe(true)

    const mockRngValue = 0.5
    const mockRng = () => mockRngValue

    const res = forgeGear(s, mockRng)
    expect(res.ok).toBe(true)
    if (!res.ok) return

    expect(res.state.state.forge.fireCount).toBe(49)
    expect(res.state.state.forge.pendingGear).not.toBeNull()
    expect(res.state.gear).toBeDefined()
    expect(res.state.slot).toBeDefined()

    // Cannot forge again while pendingGear exists
    expect(canForge(res.state.state)).toBe(false)
    const secondForge = forgeGear(res.state.state, mockRng)
    expect(secondForge.ok).toBe(false)
  })

  it('salvages pending gear to grant exp and level up forge', () => {
    let s = createInitialState()
    s.forge.fireCount = 100
    const mockVal = 0.1
    const mockRng = () => mockVal

    const res = forgeGear(s, mockRng)
    expect(res.ok).toBe(true)
    if (!res.ok) return

    s = res.state.state
    expect(s.forge.pendingGear).not.toBeNull()

    const initialStones = s.stones
    s = salvagePendingGear(s)
    expect(s.forge.pendingGear).toBeNull()
    expect(s.forge.exp).toBeGreaterThan(0)
    expect(s.stones).toBeGreaterThanOrEqual(initialStones)

    // Test leveling up forge
    s.forge.exp = FORGE_EXP_TABLE[1] - 1
    const res2 = forgeGear(s, mockRng)
    if (res2.ok) {
      s = salvagePendingGear(res2.state.state)
      expect(s.forge.level).toBe(2)
    }
  })

  it('equips pending gear and auto-salvages old item', () => {
    let s = createInitialState()
    const mockRng = () => 0.2

    // Forge first item
    const res1 = forgeGear(s, mockRng)
    if (!res1.ok) return
    s = equipPendingGear(res1.state.state)

    const firstGear = s.gear[0]
    expect(firstGear).toBeDefined()
    expect(s.forge.pendingGear).toBeNull()

    const slot = getTargetSlotForGear(s, firstGear)
    expect(s.equipped[slot]).toBe(firstGear.uid)

    // Forge second item into same slot
    const res2 = forgeGear(s, mockRng)
    if (!res2.ok) return
    const initialExp = res2.state.state.forge.exp

    s = equipPendingGear(res2.state.state)
    // Old item should be auto-salvaged
    expect(s.gear.find((g) => g.uid === firstGear.uid)).toBeUndefined()
    expect(s.forge.exp).toBeGreaterThan(initialExp)
  })

  it('buys fire with spirit stones', () => {
    const s = createInitialState()
    s.stones = 100000

    const initialFire = s.forge.fireCount
    const buyRes = buyFire(s, 10)
    expect(buyRes.ok).toBe(true)
    if (buyRes.ok) {
      expect(buyRes.state.forge.fireCount).toBe(initialFire + 10)
      expect(buyRes.state.stones).toBeLessThan(100000)
    }

    // Fails if not enough stones
    s.stones = 0
    const failRes = buyFire(s, 10)
    expect(failRes.ok).toBe(false)
  })

  it('adds fire correctly', () => {
    let s = createInitialState()
    const current = s.forge.fireCount
    s = addFire(s, 15)
    expect(s.forge.fireCount).toBe(current + 15)
  })

  it('updates auto forge filters correctly', () => {
    let s = createInitialState()
    s = updateForgeFilters(s, { minRarity: 'tien', stopOnHigherScore: false })
    expect(s.forge.autoFilters.minRarity).toBe('tien')
    expect(s.forge.autoFilters.stopOnHigherScore).toBe(false)
  })
})
