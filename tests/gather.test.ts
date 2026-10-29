import { describe, expect, it } from 'vitest'
import { HERBS } from '@/content/items'
import { REALM_INDEX_BY_ID } from '@/content/realms'
import {
  canGather,
  createInitialState,
  createSeededRng,
  gather,
  GATHER_COOLDOWN_MS,
  getGatherableHerbs,
  getGatherCooldownMs,
  pickHerb,
  tick,
} from '@/engine'

describe('gathering', () => {
  it('only offers herbs unlocked by realm', () => {
    expect(getGatherableHerbs(createInitialState(0)).map((h) => h.id)).toEqual(['linh-thao'])
    const kc = { ...createInitialState(0), realmIndex: REALM_INDEX_BY_ID['khi-cot-1'] }
    expect(getGatherableHerbs(kc)).toHaveLength(7)
  })

  it('weights lower tiers heavier', () => {
    const avail = HERBS.slice(0, 3) // weights 4,2,1 of 7
    expect(pickHerb(avail, 0).id).toBe('linh-thao')
    expect(pickHerb(avail, 0.5).id).toBe('linh-thao')
    expect(pickHerb(avail, 0.6).id).toBe('huyet-tinh-chi')
    expect(pickHerb(avail, 0.9).id).toBe('tu-linh-chi')
    expect(pickHerb(avail, 0.999).id).toBe('tu-linh-chi')
  })

  it('gives 1-3 herbs and starts a cooldown measured in played time', () => {
    const r = gather(createInitialState(0), createSeededRng(3))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const total = Object.values(r.state.gained).reduce((a, b) => a + b, 0)
    expect(total).toBeGreaterThanOrEqual(1)
    expect(total).toBeLessThanOrEqual(3)
    expect(r.state.state.inventory['linh-thao']).toBe(total)
    expect(canGather(r.state.state)).toBe(false)
    expect(getGatherCooldownMs(r.state.state)).toBe(GATHER_COOLDOWN_MS)
    expect(gather(r.state.state, () => 0).ok).toBe(false)
    const later = tick(r.state.state, GATHER_COOLDOWN_MS)
    expect(canGather(later)).toBe(true)
  })
})
