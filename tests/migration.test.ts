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
