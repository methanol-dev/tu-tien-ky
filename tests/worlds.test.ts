import { describe, expect, it } from 'vitest'
import { WORLDS, WORLD_BY_ID } from '@/content/worlds'
import { REGIONS } from '@/content/regions'

describe('Worlds and Regions', () => {
  it('defines 6 major worlds/frontiers in Kiem Lai lore', () => {
    expect(WORLDS.length).toBe(6)
    for (const w of WORLDS) {
      expect(w.id).toBeTruthy()
      expect(w.name).toBeTruthy()
      expect(w.ruler).toBeTruthy()
      expect(WORLD_BY_ID[w.id]).toBe(w)
    }
  })

  it('all regions are mapped to a valid world', () => {
    for (const r of REGIONS) {
      expect(r.worldId).toBeTruthy()
      expect(WORLD_BY_ID[r.worldId]).toBeDefined()
    }
  })

  it('contains regions across different worlds', () => {
    const worldIds = new Set(REGIONS.map((r) => r.worldId))
    expect(worldIds.has('hao-nhien')).toBe(true)
    expect(worldIds.has('kiem-khi')).toBe(true)
    expect(worldIds.has('man-hoang')).toBe(true)
    expect(worldIds.has('ngu-thai')).toBe(true)
    expect(worldIds.has('thanh-minh')).toBe(true)
    expect(worldIds.has('lien-hoa')).toBe(true)
  })
})
