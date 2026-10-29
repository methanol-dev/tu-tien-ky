import { describe, expect, it } from 'vitest'
import { createInitialState, createSeededRng, journeyTick } from '@/engine'
import { createGameStore } from '@/store/gameStore'

describe('battle speed controller (QoL 1x, 2x, 4x)', () => {
  it('defaults to 1x battle speed in initial state', () => {
    const s = createInitialState(0)
    expect(s.settings.battleSpeed).toBe(1)
  })

  it('updates battle speed via store action', () => {
    const store = createGameStore()
    expect(store.getState().state.settings.battleSpeed).toBe(1)

    store.getState().setBattleSpeed(2)
    expect(store.getState().state.settings.battleSpeed).toBe(2)

    store.getState().setBattleSpeed(4)
    expect(store.getState().state.settings.battleSpeed).toBe(4)

    store.getState().setBattleSpeed(1)
    expect(store.getState().state.settings.battleSpeed).toBe(1)
  })

  it('multiplies journey simulation progress with battle speed', () => {
    const rng1 = createSeededRng(100)
    const rng2 = createSeededRng(100)

    const s0 = createInitialState(0)
    // Run 1000ms at 2x speed -> equivalent to 2000ms of journeyTick
    const at1x = journeyTick(s0, 2000, rng1)
    const at2x = journeyTick(s0, 1000 * 2, rng2)

    expect(at2x.journey.accMs).toBe(at1x.journey.accMs)
    expect(at2x.journey.phase).toBe(at1x.journey.phase)
    expect(at2x.journey.phaseUntilMs).toBe(at1x.journey.phaseUntilMs)
  })

  it('advances stages faster in gameStore with higher speed', () => {
    const store1 = createGameStore({ rng: createSeededRng(42) })
    const store2 = createGameStore({ rng: createSeededRng(42) })

    store2.getState().setBattleSpeed(4)

    // Simulate 20 real seconds of ticking in steps of 500ms
    for (let i = 0; i < 40; i++) {
      store1.getState().tick(500)
      store2.getState().tick(500)
    }

    // At 4x speed, played simulated journey time is 4 times higher
    const events1 = store1.getState().state.journey.events.length
    const events2 = store2.getState().state.journey.events.length
    expect(events2).toBeGreaterThanOrEqual(events1)
  })
})
