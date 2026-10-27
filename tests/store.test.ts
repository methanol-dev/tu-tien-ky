import { describe, expect, it } from 'vitest'
import { REALMS } from '@/content/realms'
import { createMemoryStorage, createSeededRng, serialize, createInitialState } from '@/engine'
import { createGameStore } from '@/store/gameStore'

const HOUR = 3_600_000

describe('game store', () => {
  it('starts a fresh game with a welcome log when storage is empty', () => {
    const store = createGameStore({ storage: createMemoryStorage(), rng: () => 0 })
    store.getState().hydrate(1000)
    const { state, hydrated, offlineReport } = store.getState()
    expect(hydrated).toBe(true)
    expect(offlineReport).toBeNull()
    expect(state.log[0].kind).toBe('event')
    expect(state.createdAt).toBe(1000)
  })

  it('loads a save and reports offline progress', () => {
    const storage = createMemoryStorage()
    storage.save(serialize(createInitialState(0)))
    const store = createGameStore({ storage, rng: () => 0 })
    store.getState().hydrate(2 * HOUR)
    const { state, offlineReport } = store.getState()
    expect(offlineReport?.appliedMs).toBe(2 * HOUR)
    expect(state.qi).toBeCloseTo(REALMS[0].qiRate * 7200)
  })

  it('breaks through, emits fx and persists', () => {
    const storage = createMemoryStorage()
    const store = createGameStore({ storage, rng: createSeededRng(1) })
    store.getState().hydrate(0)
    expect(store.getState().breakthrough()).toBeNull()
    for (let i = 0; i < 60; i++) store.getState().tick(1000)
    const result = store.getState().breakthrough()
    expect(result?.success).toBe(true)
    expect(store.getState().state.realmIndex).toBe(1)
    expect(store.getState().fx?.kind).toBe('breakthrough-success')
    expect(storage.load()).not.toBeNull()
  })

  it('rejects a bad import and keeps the current state', () => {
    const store = createGameStore({ storage: createMemoryStorage(), rng: () => 0 })
    store.getState().hydrate(0)
    const before = store.getState().state
    const r = store.getState().importSave('garbage')
    expect(r.ok).toBe(false)
    expect(store.getState().state).toBe(before)
  })

  it('export/import round-trips through the store', () => {
    const store = createGameStore({ storage: createMemoryStorage(), rng: () => 0 })
    store.getState().hydrate(0)
    store.getState().tick(5000)
    const exported = store.getState().exportSave()
    const other = createGameStore({ storage: createMemoryStorage(), rng: () => 0 })
    other.getState().hydrate(0)
    expect(other.getState().importSave(exported).ok).toBe(true)
    expect(other.getState().state.qi).toBeGreaterThanOrEqual(store.getState().state.qi)
  })

  it('reset clears storage and starts over', () => {
    const storage = createMemoryStorage()
    const store = createGameStore({ storage, rng: () => 0 })
    store.getState().hydrate(0)
    store.getState().tick(10_000)
    store.getState().save(10_000)
    store.getState().resetGame(20_000)
    expect(store.getState().state.qi).toBe(0)
    expect(store.getState().state.createdAt).toBe(20_000)
  })
})
