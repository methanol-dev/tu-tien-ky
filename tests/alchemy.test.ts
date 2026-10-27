import { describe, expect, it } from 'vitest'
import { REALM_INDEX_BY_ID } from '@/content/realms'
import {
  canStartAlchemy,
  collectAlchemy,
  createInitialState,
  getAlchemyProgress,
  isAlchemyReady,
  startAlchemy,
  tick,
} from '@/engine'

const ready = () => ({
  ...createInitialState(0),
  realmIndex: REALM_INDEX_BY_ID['luyen-khi-1'],
  stones: 100,
  inventory: { 'linh-thao': 5 },
})

describe('alchemy', () => {
  it('requires realm, stones, ingredients and a free furnace', () => {
    expect(canStartAlchemy({ ...ready(), realmIndex: 0 }, 'r-tu-khi-dan')).toBe(false)
    expect(canStartAlchemy({ ...ready(), stones: 5 }, 'r-tu-khi-dan')).toBe(false)
    expect(canStartAlchemy({ ...ready(), inventory: { 'linh-thao': 2 } }, 'r-tu-khi-dan')).toBe(false)
    expect(canStartAlchemy(ready(), 'r-tu-khi-dan')).toBe(true)
    expect(startAlchemy(ready(), 'nope').ok).toBe(false)
  })

  it('consumes inputs and runs on the played-time clock', () => {
    const r = startAlchemy(ready(), 'r-tu-khi-dan')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.state.stones).toBe(80)
    expect(r.state.inventory['linh-thao']).toBe(2)
    expect(r.state.alchemy?.finishAtMs).toBe(60_000)
    expect(isAlchemyReady(r.state)).toBe(false)
    expect(startAlchemy(r.state, 'r-tu-khi-dan').ok).toBe(false)
    const half = tick(r.state, 30_000)
    expect(getAlchemyProgress(half)).toBeCloseTo(0.5)
    expect(collectAlchemy(half, () => 0).ok).toBe(false)
    const done = tick(half, 30_000)
    expect(isAlchemyReady(done)).toBe(true)
  })

  it('collect yields the pill on success and nothing on failure', () => {
    const started = startAlchemy(ready(), 'r-tu-khi-dan')
    if (!started.ok) throw new Error()
    const done = tick(started.state, 60_000)

    const ok = collectAlchemy(done, () => 0)
    expect(ok.ok).toBe(true)
    if (ok.ok) {
      expect(ok.state.success).toBe(true)
      expect(ok.state.state.inventory['tu-khi-dan']).toBe(1)
      expect(ok.state.state.alchemy).toBeNull()
      expect(ok.state.state.stats.alchemyCrafted).toBe(1)
    }

    const fail = collectAlchemy(done, () => 0.95)
    expect(fail.ok).toBe(true)
    if (fail.ok) {
      expect(fail.state.success).toBe(false)
      expect(fail.state.state.inventory['tu-khi-dan']).toBeUndefined()
      expect(fail.state.state.alchemy).toBeNull()
      expect(fail.state.state.log.at(-1)?.kind).toBe('danger')
    }
  })
})
