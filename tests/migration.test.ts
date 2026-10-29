import { describe, expect, it } from 'vitest'
import { REALM_INDEX_BY_ID } from '@/content/realms'
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
    // Legacy realmIndex 11 (trúc-cơ-2) is migrated to 17 (động-phủ-2) in save v9
    expect(s.realmIndex).toBe(17)
    expect(s.qi).toBe(before.qi)
    expect(s.stones).toBe(before.stones)
    expect(s.flags).toEqual(before.flags)
    expect(s.techniques).toEqual(before.techniques)
    expect(s.legacy.daoVan).toBe(before.legacy.daoVan)
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
    expect(r.state.version).toBe(SAVE_VERSION)
    expect(r.state.classId).toBe('kiem-tu')
    expect(r.state.equipped['vu-khi']).toBe('g1')
    expect(r.state.equipped.ao).toBe('g2')
    expect(r.state.equipped['nhan-1']).toBeNull()
    expect(r.state.equipped['bong-tai-1']).toBeNull()
  })

  it('migrates v8 to v9 and through to v10 mapping old realms to Kiếm Lai realms', () => {
    const v8 = {
      ...createInitialState(0),
      version: 8,
      realmIndex: 1, // legacy luyen-khi-1
      legacy: { daoVan: 0, lives: 1, upgrades: {}, bestRealmIndex: 10 }, // legacy truc-co-1
    }
    const r = deserialize(JSON.stringify(v8))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.version).toBe(SAVE_VERSION)
    expect(r.state.realmIndex).toBe(REALM_INDEX_BY_ID['dong-bi-1'])
    expect(r.state.legacy.bestRealmIndex).toBe(REALM_INDEX_BY_ID['dong-phu-1'])
  })

  it('migrates v9 to v10 assigning cultivationPath and preserving/calculating martial punches', () => {
    const { punches: _p, cultivationPath: _c, martialStageIndex: _m, natalSwords: _ns, ...baseV9 } = createInitialState(0)
    void _p
    void _c
    void _m
    void _ns

    const v9Qi = {
      ...baseV9,
      version: 9,
      classId: 'kiem-tu',
    }
    const rQi = deserialize(JSON.stringify(v9Qi))
    expect(rQi.ok).toBe(true)
    if (!rQi.ok) return
    expect(rQi.state.version).toBe(SAVE_VERSION)
    expect(rQi.state.cultivationPath).toBe('qi')
    expect(rQi.state.punches).toBe(0)
    expect(rQi.state.natalSwords).toHaveLength(1)
    expect(rQi.state.natalSwords[0].swordDefId).toBe('so-thap')

    const v9Martial = {
      ...baseV9,
      version: 9,
      classId: 'vo-phu',
      stats: {
        ...baseV9.stats,
        enemiesSlain: 100,
        bossesSlain: 5,
        stagesCleared: 20,
      },
    }
    const rMartial = deserialize(JSON.stringify(v9Martial))
    expect(rMartial.ok).toBe(true)
    if (!rMartial.ok) return
    expect(rMartial.state.version).toBe(SAVE_VERSION)
    expect(rMartial.state.cultivationPath).toBe('martial')
    // 100 + 5*10 + 20*5 = 250 punches
    expect(rMartial.state.punches).toBe(250)
  })

  it('migrates v10 to v11 initializing natalSwords for sword cultivators', () => {
    const { natalSwords: _ns, ...baseV10 } = createInitialState(0)
    void _ns

    const v10 = {
      ...baseV10,
      version: 10,
      classId: 'kiem-tu',
    }
    const r = deserialize(JSON.stringify(v10))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.version).toBe(SAVE_VERSION)
    expect(r.state.natalSwords).toHaveLength(1)
    expect(r.state.natalSwords[0].name).toBe('Sơ Thập')
    expect(r.state.natalSwords[0].talents[0].id).toBe('bon-loi-tat-hanh')
  })

  it('migrates v11 to current version initializing forge state', () => {
    const v11 = {
      ...createInitialState(0),
      version: 11,
    }
    const r = deserialize(JSON.stringify(v11))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.version).toBe(SAVE_VERSION)
    expect(r.state.forge.level).toBe(1)
    expect(r.state.forge.exp).toBe(0)
    expect(r.state.forge.fireCount).toBe(50)
    expect(r.state.forge.pendingGear).toBeNull()
    expect(r.state.forge.autoFilters.minRarity).toBe('bao')
  })

  it('migrates v12 to v13 initializing formation slot based on class', () => {
    const v12Sword = {
      ...createInitialState(0),
      version: 12,
      classId: 'kiem-tu',
    }
    const rSword = deserialize(JSON.stringify(v12Sword))
    expect(rSword.ok).toBe(true)
    if (!rSword.ok) return
    expect(rSword.state.version).toBe(13)
    expect(rSword.state.formation.playerSlot).toBe('back-mid')

    const v12Brawler = {
      ...createInitialState(0),
      version: 12,
      classId: 'vo-phu',
    }
    const rBrawler = deserialize(JSON.stringify(v12Brawler))
    expect(rBrawler.ok).toBe(true)
    if (!rBrawler.ok) return
    expect(rBrawler.state.formation.playerSlot).toBe('front-mid')
  })
})
