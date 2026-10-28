import { describe, expect, it } from 'vitest'
import { createInitialState, deserialize, SAVE_VERSION } from '@/engine'

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
  it('converts treasures into equipped named gear and drops expeditions, keeping everything else', async () => {
    const { readFileSync } = await import('node:fs')
    const raw = readFileSync(new URL('./fixtures/save-v5.json', import.meta.url), 'utf8')
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
    expect(s.equipped.kiem).toBe(s.gear.find((g) => g.defId === 'thiet-kiem')!.uid)
    expect(s.equipped.giap).toBe(s.gear.find((g) => g.defId === 'huyen-quy-giap')!.uid)
    expect(s.equipped['phap-khi']).toBe(s.gear.find((g) => g.defId === 'ngung-than-phu')!.uid)
    expect(s.nextGearUid).toBe(4)
    expect((s as unknown as Record<string, unknown>).expedition).toBeUndefined()
    expect((s.stats as unknown as Record<string, unknown>).expeditions).toBeUndefined()
    expect(s.stats.breakthroughs).toBe(14)
    expect(s.stats.enemiesSlain).toBe(0)
    expect(s.journey.phase).toBe('rest')
    expect(s.journey.regionId).toBe('hau-son-lam')
  })
})
