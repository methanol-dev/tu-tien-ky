import { describe, expect, it } from 'vitest'
import { LEGACY_BY_ID } from '@/content/legacy'
import { REALM_INDEX_BY_ID } from '@/content/realms'
import {
  buyLegacyUpgrade,
  canReincarnate,
  computeDaoVan,
  createInitialState,
  DAYS_PER_YEAR,
  deserialize,
  getLegacyCost,
  getLifespanDays,
  getModifiers,
  reincarnate,
  SAVE_VERSION,
} from '@/engine'

const TC1 = REALM_INDEX_BY_ID['truc-co-1']
const KD1 = REALM_INDEX_BY_ID['kim-dan-1']

describe('prestige', () => {
  it('yields no Đạo Vận before Trúc Cơ, more at higher realms and with breakthroughs', () => {
    const s = createInitialState(0)
    expect(computeDaoVan(s)).toBe(0)
    expect(canReincarnate(s)).toBe(false)
    const tc = { ...s, realmIndex: TC1 }
    const kd = { ...s, realmIndex: KD1, stats: { ...s.stats, breakthroughs: 15 } }
    expect(computeDaoVan(tc)).toBeGreaterThanOrEqual(1)
    expect(computeDaoVan(kd)).toBeGreaterThan(computeDaoVan(tc))
    expect(canReincarnate(tc)).toBe(true)
  })

  it('lifespan exhaustion allows reincarnation even at low realm', () => {
    const s = { ...createInitialState(0), ageDays: 80 * DAYS_PER_YEAR }
    expect(canReincarnate(s)).toBe(true)
    const r = reincarnate(s, 1000)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.state.legacy.lives).toBe(2)
      expect(r.state.legacy.daoVan).toBe(0)
      expect(r.state.realmIndex).toBe(0)
    }
  })

  it('reincarnation resets the life but carries legacy, upgrades and (optionally) treasures', () => {
    const s = {
      ...createInitialState(0),
      realmIndex: KD1,
      qi: 999,
      stones: 5000,
      techniques: { 'dan-khi-quyet': 5 },
      inventory: { 'linh-thao': 10 },
      gear: [
        { uid: 'g1', defId: 'thiet-kiem', rarity: 'linh' as const, tier: 1, affixes: [{ key: 'atk' as const, value: 0.2 }] },
        { uid: 'g2', defId: 'moc-phu', rarity: 'pham' as const, tier: 1, affixes: [{ key: 'hp' as const, value: 0.1 }] },
      ],
      equipped: { kiem: 'g1', giap: null, 'phap-khi': null },
      nextGearUid: 3,
      legacy: { daoVan: 4, lives: 1, upgrades: { 'tuc-the-ky-uc': 3, 'tien-the-di-san': 2, 'tang-bao-cac': 1 }, bestRealmIndex: 0 },
    }
    const r = reincarnate(s, 7)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const n = r.state
    expect(n.realmIndex).toBe(3) // Luyện Khí tầng 3
    expect(n.stones).toBe(600)
    expect(n.qi).toBe(0)
    expect(n.techniques).toEqual({})
    expect(n.inventory).toEqual({})
    expect(n.gear.map((g) => g.uid)).toEqual(['g1'])
    expect(n.equipped.kiem).toBe('g1')
    expect(n.nextGearUid).toBe(3)
    expect(n.legacy.lives).toBe(2)
    expect(n.legacy.daoVan).toBe(4 + computeDaoVan(s))
    expect(n.legacy.bestRealmIndex).toBe(KD1)
    expect(n.createdAt).toBe(7)
    expect(n.log.at(-1)?.text).toContain('Kiếp thứ 2')
  })

  it('legacy upgrades cost Đạo Vận, cap at max level and feed modifiers', () => {
    const def = LEGACY_BY_ID['tien-thien-linh-can']
    expect(getLegacyCost(def, 0)).toBe(2)
    expect(getLegacyCost(def, 1)).toBe(3)
    const s = { ...createInitialState(0), legacy: { daoVan: 5, lives: 2, upgrades: {}, bestRealmIndex: 0 } }
    const r = buyLegacyUpgrade(s, 'tien-thien-linh-can')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.legacy.daoVan).toBe(3)
    expect(getModifiers(r.state).qiRateMult).toBeCloseTo(1.1)
    expect(buyLegacyUpgrade({ ...r.state, legacy: { ...r.state.legacy, daoVan: 0 } }, 'tien-thien-linh-can').ok).toBe(false)
    const maxed = { ...s, legacy: { ...s.legacy, daoVan: 1e9, upgrades: { 'tang-bao-cac': 1 } } }
    expect(buyLegacyUpgrade(maxed, 'tang-bao-cac').ok).toBe(false)
    const longLife = { ...s, legacy: { ...s.legacy, upgrades: { 'truong-sinh-the': 2 } } }
    expect(getLifespanDays(longLife)).toBe(getLifespanDays(s) + 40 * DAYS_PER_YEAR)
  })

  it('migrates a v4 save to v5 with empty legacy', () => {
    const v4 = { ...createInitialState(0), version: 4 } as Record<string, unknown>
    delete v4.tribulation
    delete v4.legacy
    const stats = { ...(v4.stats as Record<string, unknown>) }
    delete stats.tribulationsPassed
    delete stats.tribulationsFailed
    v4.stats = stats
    const r = deserialize(JSON.stringify(v4))
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.state.version).toBe(SAVE_VERSION)
      expect(r.state.legacy.lives).toBe(1)
      expect(r.state.tribulation).toBeNull()
    }
  })
})
