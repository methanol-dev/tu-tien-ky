import { describe, expect, it } from 'vitest'
import { AFFIX_BY_KEY, AFFIX_COUNT, RARITIES, type Rarity } from '@/content/affixes'
import { GEAR_DEF_BY_ID } from '@/content/gear'
import {
  createInitialState,
  createSeededRng,
  equip,
  GEAR_CAP,
  getAffixTotals,
  getModifiers,
  getSalvageValue,
  openChest,
  openChests,
  rollGear,
  rollRarity,
  salvage,
  salvageByRarity,
  unequip,
} from '@/engine'

const withChests = (normal: number, red: number) => {
  const s = createInitialState(0)
  return { ...s, realmIndex: 5, journey: { ...s.journey, chests: { normal, red } } }
}

describe('gear rolling', () => {
  it('rarity follows the table: red chests at Tuyệt roll Thần, normal at Thường never does', () => {
    const rng = createSeededRng(11)
    const counts: Record<Rarity, number> = { pham: 0, linh: 0, bao: 0, tien: 0, than: 0 }
    for (let i = 0; i < 2000; i++) counts[rollRarity('normal', 0, rng)]++
    expect(counts.than).toBe(0)
    expect(counts.pham).toBeGreaterThan(counts.bao)
    const red: Record<Rarity, number> = { pham: 0, linh: 0, bao: 0, tien: 0, than: 0 }
    for (let i = 0; i < 2000; i++) red[rollRarity('red', 3, rng)]++
    expect(red.pham).toBe(0)
    expect(red.than).toBeGreaterThan(100)
  })

  it('rolls the right number of distinct, slot-legal affixes scaled by tier', () => {
    const rng = createSeededRng(5)
    for (const rarity of RARITIES) {
      const g = rollGear('kiem', rarity, 1, 'g1', rng)
      expect(g.affixes).toHaveLength(AFFIX_COUNT[rarity])
      expect(new Set(g.affixes.map((a) => a.key)).size).toBe(g.affixes.length)
      for (const a of g.affixes) {
        const def = AFFIX_BY_KEY[a.key]
        expect(def.slots).toContain('kiem')
        expect(a.value).toBeGreaterThanOrEqual(def.min - 1e-9)
        expect(a.value).toBeLessThanOrEqual(def.max + 1e-9)
      }
      expect(GEAR_DEF_BY_ID[g.defId].slot).toBe('kiem')
    }
    const high = rollGear('giap', 'than', 9, 'g2', () => 0.999)
    const low = rollGear('giap', 'than', 1, 'g3', () => 0.999)
    expect(high.affixes[0].value).toBeGreaterThan(low.affixes[0].value)
  })
})

describe('chests', () => {
  it('opening consumes a chest, adds gear, bumps stats; refuses when empty or full', () => {
    const s = withChests(2, 0)
    const r = openChest(s, 'normal', createSeededRng(1))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.state.journey.chests.normal).toBe(1)
    expect(r.state.state.gear).toHaveLength(1)
    expect(r.state.state.gear[0].uid).toBe('g1')
    expect(r.state.state.nextGearUid).toBe(2)
    expect(r.state.state.stats.chestsOpened).toBe(1)
    expect(openChest(s, 'red', createSeededRng(1)).ok).toBe(false)
    const full = { ...s, gear: Array.from({ length: GEAR_CAP }, (_, i) => ({ uid: `x${i}`, defId: 'moc-phu', rarity: 'pham' as const, tier: 1, affixes: [] })) }
    expect(openChest(full, 'normal', createSeededRng(1)).ok).toBe(false)
  })

  it('red chests can hold the region named gear; openChests stops at the cap without failing', () => {
    const s = withChests(0, 1)
    const r = openChest(s, 'red', () => 0)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.state.gear.defId).toBe('thiet-kiem')
    const many = openChests(withChests(100, 0), 'normal', 100, createSeededRng(2))
    expect(many.opened.length).toBe(GEAR_CAP)
    expect(many.error).toBeUndefined()
    expect(many.state.journey.chests.normal).toBe(100 - GEAR_CAP)
  })
})

describe('equip & salvage', () => {
  const geared = () => {
    const s = withChests(3, 0)
    return openChests(s, 'normal', 3, createSeededRng(9)).state
  }

  it('equips into the def slot, unequips, and totals only what is worn', () => {
    const s = geared()
    const g = s.gear[0]
    const slot = GEAR_DEF_BY_ID[g.defId].slot
    const r = equip(s, g.uid)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.equipped[slot]).toBe(g.uid)
    expect(equip(r.state, g.uid).ok).toBe(false)
    const totals = getAffixTotals(r.state)
    for (const a of g.affixes) expect(totals[a.key]).toBeCloseTo(a.value)
    const u = unequip(r.state, slot)
    expect(u.ok).toBe(true)
    if (u.ok) expect(getAffixTotals(u.state).atk).toBe(0)
    expect(unequip(s, slot).ok).toBe(false)
  })

  it('gear affixes feed modifiers: qiRate multiplies, stoneRate adds, lootChance multiplies', () => {
    const s = createInitialState(0)
    const charm = { uid: 'c', defId: 'moc-phu', rarity: 'bao' as const, tier: 1, affixes: [{ key: 'qiRate' as const, value: 0.1 }, { key: 'stoneRate' as const, value: 0.2 }, { key: 'lootChance' as const, value: 0.5 }] }
    const worn = { ...s, gear: [charm], equipped: { ...s.equipped, 'phap-khi': 'c' } }
    const m = getModifiers(worn)
    expect(m.qiRateMult).toBeCloseTo(1.1)
    expect(m.stoneRateMult).toBeCloseTo(1.2)
    expect(m.lootChanceMult).toBeCloseTo(1.5)
  })

  it('salvage pays stones, skips equipped gear, and salvageByRarity filters', () => {
    const s = geared()
    const worn = equip(s, s.gear[0].uid)
    if (!worn.ok) throw new Error()
    const all = salvage(worn.state, worn.state.gear.map((g) => g.uid))
    expect(all.ok).toBe(true)
    if (!all.ok) return
    expect(all.state.count).toBe(2)
    expect(all.state.state.gear).toHaveLength(1)
    expect(all.state.stones).toBe(getSalvageValue(worn.state, worn.state.gear.slice(1)))
    expect(all.state.stones).toBeGreaterThan(0)
    expect(salvage(all.state.state, [s.gear[0].uid]).ok).toBe(false)
    const byRarity = salvageByRarity(worn.state, ['pham', 'linh', 'bao', 'tien', 'than'])
    expect(byRarity.ok && byRarity.state.count).toBe(2)
  })
})
