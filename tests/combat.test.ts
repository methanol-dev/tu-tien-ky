import { describe, expect, it } from 'vitest'
import { DUNGEONS } from '@/content/dungeons'
import { ITEM_BY_ID } from '@/content/items'
import { REALMS } from '@/content/realms'
import {
  completeExpedition,
  createInitialState,
  createSeededRng,
  getCombatStats,
  getExpeditionProgress,
  getModifiers,
  isExpeditionReady,
  rollLoot,
  simulateCombat,
  startExpedition,
  tick,
} from '@/engine'

describe('dungeon content', () => {
  it('references only known items and has a boss last', () => {
    for (const d of DUNGEONS) {
      expect(d.enemies.at(-1)?.boss).toBe(true)
      for (const l of d.loot) expect(ITEM_BY_ID[l.itemId], `${d.id} loot ${l.itemId}`).toBeDefined()
      if (d.bossLoot) expect(ITEM_BY_ID[d.bossLoot.itemId]?.kind).toBe('treasure')
    }
  })

  it('a player at the minimum realm usually beats the dungeon', () => {
    for (const d of DUNGEONS) {
      const s = { ...createInitialState(0), realmIndex: d.minRealmIndex }
      let wins = 0
      for (let seed = 0; seed < 50; seed++) {
        if (simulateCombat(getCombatStats(s), d.enemies, createSeededRng(seed)).victory) wins++
      }
      expect(wins, `${d.id} win rate at min realm`).toBeGreaterThanOrEqual(30)
      const strong = { ...s, realmIndex: d.minRealmIndex + 3 }
      let strongWins = 0
      for (let seed = 0; seed < 50; seed++) {
        if (simulateCombat(getCombatStats(strong), d.enemies, createSeededRng(seed)).victory) strongWins++
      }
      expect(strongWins, `${d.id} should be safe 3 stages later`).toBe(50)
    }
  })
})

describe('combat', () => {
  it('is deterministic for a seed and stats scale with realm and treasures', () => {
    const s = { ...createInitialState(0), realmIndex: 1 }
    const a = simulateCombat(getCombatStats(s), DUNGEONS[0].enemies, createSeededRng(42))
    const b = simulateCombat(getCombatStats(s), DUNGEONS[0].enemies, createSeededRng(42))
    expect(a).toEqual(b)
    expect(getCombatStats({ ...s, realmIndex: 10 }).atk).toBeGreaterThan(getCombatStats(s).atk)
    const armed = { ...s, inventory: { 'thiet-kiem': 1, 'huyen-quy-giap': 2 } }
    expect(getCombatStats(armed).atk).toBe(Math.round(getCombatStats(s).atk * 1.2))
    expect(getCombatStats(armed).def).toBe(Math.round(getCombatStats(s).def * 1.3))
  })

  it('treasure qi passives feed into modifiers once regardless of count', () => {
    const s = { ...createInitialState(0), inventory: { 'ngung-than-phu': 3 } }
    expect(getModifiers(s).qiRateMult).toBeCloseTo(1.08)
  })

  it('a hopeless fight ends in defeat with a log', () => {
    const r = simulateCombat({ hp: 10, atk: 1, def: 0 }, DUNGEONS[5].enemies, createSeededRng(1))
    expect(r.victory).toBe(false)
    expect(r.playerHpLeft).toBe(0)
    expect(r.log.length).toBeGreaterThan(0)
    expect(r.waves[0].won).toBe(false)
  })
})

describe('expedition', () => {
  const ready = () => ({ ...createInitialState(0), realmIndex: DUNGEONS[0].minRealmIndex, stones: 0 })

  it('gates by realm and one at a time, then runs on the played clock', () => {
    expect(startExpedition(createInitialState(0), 'hau-son-lam').ok).toBe(false)
    const r = startExpedition(ready(), 'hau-son-lam')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(startExpedition(r.state, 'hau-son-lam').ok).toBe(false)
    expect(isExpeditionReady(r.state)).toBe(false)
    expect(completeExpedition(r.state, () => 0).ok).toBe(false)
    const half = tick(r.state, DUNGEONS[0].durationMs / 2)
    expect(getExpeditionProgress(half)).toBeCloseTo(0.5)
    expect(isExpeditionReady(tick(half, DUNGEONS[0].durationMs / 2))).toBe(true)
  })

  it('victory grants loot and stones; defeat burns qi and injures', () => {
    const started = startExpedition(ready(), 'hau-son-lam')
    if (!started.ok) throw new Error()
    const done = { ...tick(started.state, DUNGEONS[0].durationMs), qi: 100 }

    const strong = { ...done, realmIndex: REALMS.length - 2 }
    const win = completeExpedition(strong, createSeededRng(3))
    expect(win.ok).toBe(true)
    if (win.ok) {
      expect(win.state.report.combat.victory).toBe(true)
      expect(win.state.state.stones).toBeGreaterThan(0)
      expect(win.state.state.inventory['linh-thao']).toBeGreaterThanOrEqual(3)
      expect(win.state.state.expedition).toBeNull()
      expect(win.state.state.stats.expeditionWins).toBe(1)
    }

    const weak = { ...done, realmIndex: 0 }
    const lose = completeExpedition(weak, createSeededRng(3))
    expect(lose.ok).toBe(true)
    if (lose.ok) {
      expect(lose.state.report.combat.victory).toBe(false)
      expect(lose.state.state.qi).toBeCloseTo(90)
      expect(lose.state.state.buffs.some((b) => b.id === 'trong-thuong')).toBe(true)
      expect(lose.state.state.stats.expeditions).toBe(1)
    }
  })

  it('rollLoot respects chances and ranges', () => {
    const always = rollLoot(DUNGEONS[0], () => 0)
    expect(always['linh-thao']).toBe(3)
    expect(always['huyet-tinh-chi']).toBe(1)
    const never = rollLoot(DUNGEONS[0], () => 0.999)
    expect(never['huyet-tinh-chi']).toBeUndefined()
    expect(never['linh-thao']).toBe(6)
  })
})
