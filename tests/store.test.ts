import { describe, expect, it } from 'vitest'
import { EVENTS } from '@/content/events'
import { REALMS } from '@/content/realms'
import { createMemoryStorage, createSeededRng, serialize, createInitialState, } from '@/engine'
import { REALM_INDEX_BY_ID } from '@/content/realms'
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

describe('game store events', () => {
  it('rolls an event after the first interval and resolves it through the store', () => {
    const store = createGameStore({ storage: createMemoryStorage(), rng: createSeededRng(7) })
    store.getState().hydrate(0)
    store.getState().tick(89_999)
    expect(store.getState().state.pendingEvent).toBeNull()
    store.getState().tick(1)
    const pending = store.getState().state.pendingEvent
    expect(pending).not.toBeNull()
    expect(store.getState().resolveEvent('khong-ton-tai')).toBe(false)
    expect(store.getState().notice?.kind).toBe('error')
    const choices = EVENTS.find((e) => e.id === pending!.eventId)!.choices
    const choice = choices.find((c) => !c.requires) ?? choices[0]
    expect(store.getState().resolveEvent(choice.id)).toBe(true)
    expect(store.getState().state.pendingEvent).toBeNull()
    expect(store.getState().eventResult?.event.id).toBe(pending!.eventId)
    store.getState().dismissEventResult()
    expect(store.getState().eventResult).toBeNull()
  })
})

describe('game store journey', () => {
  it('ticks the journey alongside cultivation, opens chests into chestResult, equips and salvages', () => {
    const store = createGameStore({ storage: createMemoryStorage(), rng: createSeededRng(3) })
    store.getState().hydrate(0)
    useRealm(store, 'thao-can-1')
    for (let i = 0; i < 600; i++) store.getState().tick(1000)
    const s = store.getState().state
    expect(s.stats.enemiesSlain).toBeGreaterThan(0)
    expect(s.journey.chests.normal + s.journey.chests.red).toBeGreaterThan(0)
    expect(store.getState().openChests('normal', 0)).toBe(true)
    const kind = s.journey.chests.red > 0 ? 'red' : 'normal'
    expect(store.getState().openChests(kind, 1)).toBe(true)
    const opened = store.getState().chestResult
    expect(opened).not.toBeNull()
    expect(opened!.length).toBe(1)
    const uid = opened![0].uid
    expect(store.getState().equip(uid)).toBe(true)
    expect(store.getState().salvage([uid])).toBe(false) // equipped: refused with an error notice
    expect(store.getState().notice?.kind).toBe('error')
    store.getState().dismissChestResult()
    expect(store.getState().chestResult).toBeNull()
    expect(store.getState().startRegion('tuyet-son-dinh', 0)).toBe(false)
    store.getState().setAutoAdvance(false)
    expect(store.getState().state.journey.autoAdvance).toBe(false)
  })

  it('handles forge gacha actions correctly', () => {
    const store = createGameStore({ storage: createMemoryStorage(), rng: () => 0.1 })
    store.getState().hydrate(0)

    expect(store.getState().state.forge.fireCount).toBe(50)
    expect(store.getState().forgeGear()).toBe(true)
    expect(store.getState().state.forge.fireCount).toBe(49)
    expect(store.getState().state.forge.pendingGear).not.toBeNull()

    // Equip pending
    store.getState().equipPendingGear()
    expect(store.getState().state.forge.pendingGear).toBeNull()
    expect(store.getState().state.gear.length).toBe(1)

    // Buy fire
    store.setState((st) => ({ state: { ...st.state, stones: 50000 } }))
    expect(store.getState().buyFire(5)).toBe(true)
    expect(store.getState().state.forge.fireCount).toBe(54)
  })
})

function useRealm(store: ReturnType<typeof createGameStore>, id: string) {
  store.setState((st) => ({ state: { ...st.state, realmIndex: REALM_INDEX_BY_ID[id] } }))
}
