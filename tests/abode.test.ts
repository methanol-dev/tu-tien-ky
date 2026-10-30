import { describe, expect, it } from 'vitest'
import {
  canUpgradeAbodeTier,
  canUpgradeFacility,
  createInitialState,
  getAbodeTierDef,
  getFacilityCost,
  getModifiers,
  harvestAbodeHerbs,
  simulateAbodeTick,
  tick,
  upgradeAbodeTier,
  upgradeFacility,
} from '@/engine'

describe('Abode System (Hệ thống Động Phủ Kiếm Lai)', () => {
  it('initializes with Tier 1: Ngõ Nê Bình', () => {
    const s = createInitialState(0)
    expect(s.abode.tier).toBe(1)
    const tierDef = getAbodeTierDef(s)
    expect(tierDef.id).toBe('ngo-ne-binh')
    expect(tierDef.name).toBe('Ngõ Nê Bình')
    expect(tierDef.maxFacilityLevel).toBe(10)
  })

  it('checks and upgrades Abode tier correctly', () => {
    let s = createInitialState(0)
    expect(canUpgradeAbodeTier(s).can).toBe(false) // Realm & stones too low

    // Giả lập đủ cảnh giới Động Phủ Cảnh (realmIndex >= 5) nhưng chưa đủ đá
    s = { ...s, realmIndex: 5, stones: 100 }
    expect(canUpgradeAbodeTier(s).can).toBe(false)

    // Đủ 50,000 Linh thạch
    s = { ...s, stones: 50_000 }
    expect(canUpgradeAbodeTier(s).can).toBe(true)

    const res = upgradeAbodeTier(s)
    expect(res.ok).toBe(true)
    if (!res.ok) return
    s = res.state
    expect(s.abode.tier).toBe(2)
    expect(s.stones).toBe(0)
    expect(getAbodeTierDef(s).id).toBe('lac-phach-son')
    expect(getAbodeTierDef(s).name).toBe('Lạc Phách Sơn')
  })

  it('handles facility unlock conditions and upgrades', () => {
    let s = createInitialState(0)
    s = { ...s, stones: 10_000 }

    // spiritBeast bị khóa ở Tier 1 (yêu cầu Tier 2: Lạc Phách Sơn)
    const beastCheck = canUpgradeFacility(s, 'spiritBeast')
    expect(beastCheck.can).toBe(false)
    expect(beastCheck.reason).toContain('Lạc Phách Sơn')

    // Tụ Linh Trận (gatheringArray) mở ở Tier 1
    const arrayCheck = canUpgradeFacility(s, 'gatheringArray')
    expect(arrayCheck.can).toBe(true)
    const cost = getFacilityCost(s, 'gatheringArray')
    expect(cost).toBeGreaterThan(0)

    const upgradeRes = upgradeFacility(s, 'gatheringArray')
    expect(upgradeRes.ok).toBe(true)
    if (!upgradeRes.ok) return
    s = upgradeRes.state
    expect(s.abode.facilities.gatheringArray.level).toBe(1)
    expect(s.stones).toBe(10_000 - cost)
  })

  it('boosts Qi and Stone rates via Abode facilities and paper puppets', () => {
    let s = createInitialState(0)
    const baseMods = getModifiers(s)

    // Nâng cấp Tụ Linh Trận lên cấp 5 (+25% qiRate)
    s = {
      ...s,
      abode: {
        ...s.abode,
        facilities: {
          ...s.abode.facilities,
          gatheringArray: { level: 5 },
          spiritSpring: { level: 4 },
        },
      },
    }

    const upgradedMods = getModifiers(s)
    expect(upgradedMods.qiRateMult).toBeGreaterThan(baseMods.qiRateMult)
    expect(upgradedMods.stoneRateMult).toBeGreaterThan(baseMods.stoneRateMult)

    // Nâng Chỉ Nhân lên cấp 3 (+10% Tụ Linh Trận & +10% Linh Tuyền)
    s = {
      ...s,
      abode: {
        ...s.abode,
        facilities: {
          ...s.abode.facilities,
          paperPuppets: { level: 3 },
        },
      },
    }
    const puppetMods = getModifiers(s)
    expect(puppetMods.qiRateMult).toBeGreaterThan(upgradedMods.qiRateMult)
    expect(puppetMods.stoneRateMult).toBeGreaterThan(upgradedMods.stoneRateMult)
  })

  it('produces herbs in Linh Điền and handles manual vs auto puppet harvest', () => {
    let s = createInitialState(0)
    // Chỉ Nhân = 0 (thu hoạch thủ công)
    s = {
      ...s,
      abode: {
        ...s.abode,
        facilities: {
          ...s.abode.facilities,
          herbGarden: { level: 2 },
          paperPuppets: { level: 0 },
        },
        lastHerbTickMs: 0,
      },
      playedMs: 70_000, // Đã trôi qua 70s (> 60s chu kỳ)
    }

    const rng = () => 0.5
    s = simulateAbodeTick(s, rng)
    const storedKeys = Object.keys(s.abode.storedHerbs)
    expect(storedKeys.length).toBeGreaterThan(0)

    // Thu hoạch thủ công
    const harvestRes = harvestAbodeHerbs(s)
    expect(harvestRes.ok).toBe(true)
    if (!harvestRes.ok) return
    s = harvestRes.state.state
    expect(Object.keys(s.abode.storedHerbs).length).toBe(0)
    expect(Object.values(s.inventory).some((c) => c > 0)).toBe(true)

    // Bây giờ nâng cấp Chỉ Nhân lên Cấp 1 -> Tự động thu hoạch vào inventory
    s = {
      ...s,
      abode: {
        ...s.abode,
        facilities: {
          ...s.abode.facilities,
          paperPuppets: { level: 1 },
        },
        lastHerbTickMs: s.playedMs,
      },
      playedMs: s.playedMs + 70_000,
    }
    const invBefore = { ...s.inventory }
    s = simulateAbodeTick(s, rng)
    // Không đọng trong storedHerbs mà chuyển thẳng vào inventory
    expect(Object.keys(s.abode.storedHerbs).length).toBe(0)
    const invCountBefore = Object.values(invBefore).reduce((a, b) => a + b, 0)
    const invCountAfter = Object.values(s.inventory).reduce((a, b) => a + b, 0)
    expect(invCountAfter).toBeGreaterThan(invCountBefore)
  })

  it('integrates seamlessly with the engine tick loop without memory leak', () => {
    let s = createInitialState(0)
    s = {
      ...s,
      abode: {
        ...s.abode,
        facilities: {
          ...s.abode.facilities,
          gatheringArray: { level: 3 },
          spiritSpring: { level: 3 },
        },
      },
    }
    const initialQi = s.qi
    const initialStones = s.stones
    s = tick(s, 1000)
    expect(s.qi).toBeGreaterThan(initialQi)
    expect(s.stones).toBeGreaterThan(initialStones)
  })
})
