import { describe, expect, it } from 'vitest'
import { createInitialState, deserialize, SAVE_VERSION } from '@/engine'
import raw from './fixtures/save-v5.json?raw'

describe('save migration chain', () => {
  it('upgrades a v1 save (pre-economy) to the current version with sane defaults', () => {
    const v1 = {
      version: 1,
      createdAt: 0,
      lastSavedAt: 0,
      playedMs: 5000,
      realmIndex: 4,
      qi: 123,
      ageDays: 6000,
      nextLogId: 3,
      log: [{ id: 1, day: 5760, kind: 'event', text: 'hi' }],
      stats: { breakthroughs: 4, breakthroughFailures: 1, qiTotal: 999 },
      settings: { timeScale: 1 },
    }
    const r = deserialize(JSON.stringify(v1))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.version).toBe(SAVE_VERSION)
    expect(r.state.realmIndex).toBe(4)
    expect(r.state.stones).toBe(0)
    expect(r.state.techniques).toEqual({})
    expect(r.state.inventory).toEqual({})
    expect(r.state.buffs).toEqual([])
    expect(r.state.alchemy).toBeNull()
    expect(r.state.stats.breakthroughs).toBe(4)
    expect(r.state.stats.stonesTotal).toBe(0)
  })

  it('a fresh state always matches the current schema', () => {
    const r = deserialize(JSON.stringify(createInitialState(0)))
    expect(r.ok).toBe(true)
  })

  it('rejects unknown-but-huge inventories and bad buffs', () => {
    const s = createInitialState(0)
    const huge: Record<string, number> = {}
    for (let i = 0; i < 201; i++) huge[`x${i}`] = 1
    expect(deserialize(JSON.stringify({ ...s, inventory: huge })).ok).toBe(false)
    expect(
      deserialize(JSON.stringify({ ...s, buffs: [{ id: 'a', name: 'b', qiRateMult: -1, expiresAtMs: 0 }] })).ok,
    ).toBe(false)
  })
})

describe('v5 -> v6 (Phase 9: journey + gear)', () => {
  it('converts treasures into equipped named gear and drops expeditions, keeping everything else', () => {
    const before = JSON.parse(raw)
    expect(before.version).toBe(5)
    const r = deserialize(raw)
    expect(r.ok, r.ok ? '' : r.error).toBe(true)
    if (!r.ok) return
    const s = r.state
    expect(s.version).toBe(SAVE_VERSION)
    expect(s.realmIndex).toBe(before.realmIndex)
    expect(s.qi).toBe(before.qi)
    expect(s.stones).toBe(before.stones)
    expect(s.flags).toEqual(before.flags)
    expect(s.techniques).toEqual(before.techniques)
    expect(s.legacy).toEqual(before.legacy)
    expect(s.inventory).toEqual({ 'linh-thao': 12, 'tu-khi-dan': 2 })
    expect(s.gear.map((g) => g.defId).sort()).toEqual(['huyen-quy-giap', 'ngung-than-phu', 'thiet-kiem'])
    expect(s.equipped['vu-khi']).toBe(s.gear.find((g) => g.defId === 'thiet-kiem')!.uid)
    expect(s.equipped.ao).toBe(s.gear.find((g) => g.defId === 'huyen-quy-giap')!.uid)
    expect(s.equipped.giay).toBe(s.gear.find((g) => g.defId === 'ngung-than-phu')!.uid)
    expect(s.nextGearUid).toBe(4)
    expect((s as unknown as Record<string, unknown>).expedition).toBeUndefined()
    expect((s.stats as unknown as Record<string, unknown>).expeditions).toBeUndefined()
    expect(s.stats.breakthroughs).toBe(14)
    expect(s.stats.enemiesSlain).toBe(0)
    expect(s.journey.phase).toBe('rest')
    expect(s.journey.regionId).toBe('hau-son-lam')
  })

  it('migrates v6 (3 slots) to v7 (12 slots)', () => {
    const rawV6 = {
      version: 6,
      createdAt: 1000,
      lastSavedAt: 2000,
      playedMs: 500,
      realmIndex: 1,
      qi: 10,
      ageDays: 5000,
      lifespanBonusYears: 0,
      stones: 50,
      techniques: {},
      inventory: {},
      gear: [
        { uid: 'g1', defId: 'thiet-kiem', rarity: 'linh', tier: 1, affixes: [] },
        { uid: 'g2', defId: 'huyen-quy-giap', rarity: 'bao', tier: 1, affixes: [] },
      ],
      equipped: {
        kiem: 'g1',
        giap: 'g2',
        'phap-khi': null,
      },
      nextGearUid: 3,
      buffs: [],
      pendingBreakthroughBonus: 0,
      alchemy: null,
      journey: {
        regionId: 'hau-son-lam',
        difficulty: 0,
        stage: 1,
        phase: 'rest',
        phaseUntilMs: 1000,
        party: [{ id: 'player', hp: 10, maxHp: 10, nextAttackAtMs: 0 }],
        enemies: [],
        chests: { normal: 0, red: 0 },
        autoAdvance: true,
        cleared: {},
        deaths: 0,
        runDeaths: 0,
        accMs: 0,
        events: [],
      },
      tribulation: null,
      legacy: { daoVan: 0, lives: 1, upgrades: {}, bestRealmIndex: 0 },
      pendingEvent: null,
      nextEventAtMs: 1000,
      eventCooldowns: {},
      flags: {},
      gatherReadyAtMs: 0,
      nextLogId: 1,
      log: [],
      stats: {
        breakthroughs: 0,
        breakthroughFailures: 0,
        qiTotal: 0,
        stonesTotal: 0,
        pillsUsed: 0,
        alchemyCrafted: 0,
        eventsResolved: 0,
        tribulationsPassed: 0,
        tribulationsFailed: 0,
        enemiesSlain: 0,
        bossesSlain: 0,
        stagesCleared: 0,
        chestsOpened: 0,
        gearFound: 0,
      },
      settings: { timeScale: 1, pauseOnEvent: false },
    }
    const r = deserialize(JSON.stringify(rawV6))
    expect(r.ok, r.ok ? '' : r.error).toBe(true)
    if (!r.ok) return
    expect(r.state.version).toBe(7)
    expect(r.state.equipped['vu-khi']).toBe('g1')
    expect(r.state.equipped.ao).toBe('g2')
    expect(r.state.equipped['nhan-1']).toBeNull()
    expect(r.state.equipped['bong-tai-1']).toBeNull()
  })
})
