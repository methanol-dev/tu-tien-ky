import { describe, expect, it } from 'vitest'
import { ITEM_BY_ID } from '@/content/items'
import { enemyStats, REGIONS, STAGES_PER_REGION } from '@/content/regions'
import { createInitialState, createSeededRng, getCombatStats, rollDamage, validateGear, validateRegions } from '@/engine'

describe('region & gear content', () => {
  it('validates', () => {
    expect(validateRegions()).toEqual([])
    expect(validateGear()).toEqual([])
    expect(REGIONS.length).toBeGreaterThanOrEqual(6)
    for (const r of REGIONS) for (const l of r.loot) expect(ITEM_BY_ID[l.itemId], `${r.id} loot ${l.itemId}`).toBeDefined()
  })

  it('enemies scale with stage and difficulty, boss is the toughest in a region', () => {
    const r = REGIONS[0]
    const mob1 = enemyStats(r, r.enemies[0], 1, 0)
    const mob9 = enemyStats(r, r.enemies[0], 9, 0)
    const mobHard = enemyStats(r, r.enemies[0], 1, 1)
    const boss = enemyStats(r, r.boss, STAGES_PER_REGION, 0)
    expect(mob9.hp).toBeGreaterThan(mob1.hp)
    expect(mobHard.hp).toBe(Math.round(mob1.hp * 3))
    expect(boss.hp).toBeGreaterThan(mob9.hp)
  })
})

describe('combat stats', () => {
  it('grow with realm and with equipped gear affixes only', () => {
    const s = { ...createInitialState(0), realmIndex: 1 }
    const base = getCombatStats(s)
    expect(getCombatStats({ ...s, realmIndex: 10 }).atk).toBeGreaterThan(base.atk)
    const sword = { uid: 'g1', defId: 'thiet-kiem-tho', rarity: 'linh' as const, tier: 1, affixes: [{ key: 'atk' as const, value: 0.2 }, { key: 'atkSpeed' as const, value: 0.25 }] }
    const owned = { ...s, gear: [sword] }
    expect(getCombatStats(owned).atk).toBe(base.atk)
    const armed = { ...owned, equipped: { ...owned.equipped, 'vu-khi': 'g1' } }
    expect(getCombatStats(armed).atk).toBe(31)
    expect(getCombatStats(armed).attackMs).toBe(800)
  })

  it('rollDamage is deterministic and never below 1', () => {
    const a = rollDamage(20, 5, createSeededRng(3), 0.1, 1.5)
    const b = rollDamage(20, 5, createSeededRng(3), 0.1, 1.5)
    expect(a).toEqual(b)
    expect(rollDamage(1, 100, () => 0.5).dmg).toBe(1)
    expect(rollDamage(10, 0, () => 0, 1, 2).crit).toBe(true)
  })
})
