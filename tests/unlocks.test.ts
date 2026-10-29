import { describe, expect, it } from 'vitest'
import {
  getFeatureUnlockRequirement,
  isFeatureUnlocked,
} from '@/engine/unlocks'
import { createInitialState } from '@/engine/state'
import { REALM_INDEX_BY_ID } from '@/content/realms'

describe('Unlocks Engine (Mở Khóa Tính Năng Tuần Tự)', () => {
  it('locks advanced features for a fresh mortal player', () => {
    const s = createInitialState(0)
    expect(isFeatureUnlocked(s, 'techniques')).toBe(false)
    expect(isFeatureUnlocked(s, 'forge')).toBe(false)
    expect(isFeatureUnlocked(s, 'formation')).toBe(false)
    expect(isFeatureUnlocked(s, 'swords')).toBe(false)
    expect(isFeatureUnlocked(s, 'alchemy')).toBe(false)
    expect(isFeatureUnlocked(s, 'legacy')).toBe(false)
  })

  it('unlocks techniques at stage 3 or Dong Bi realm', () => {
    let s = createInitialState(0)
    s.stats.stagesCleared = 3
    expect(isFeatureUnlocked(s, 'techniques')).toBe(true)

    s = createInitialState(0)
    s.realmIndex = REALM_INDEX_BY_ID['dong-bi-1']
    expect(isFeatureUnlocked(s, 'techniques')).toBe(true)
  })

  it('unlocks forge at stage 5 or Dong Bi realm', () => {
    let s = createInitialState(0)
    s.stats.stagesCleared = 5
    expect(isFeatureUnlocked(s, 'forge')).toBe(true)

    s = createInitialState(0)
    s.realmIndex = REALM_INDEX_BY_ID['dong-bi-1']
    expect(isFeatureUnlocked(s, 'forge')).toBe(true)
  })

  it('unlocks formation at stage 8 or Thao Can realm', () => {
    let s = createInitialState(0)
    s.stats.stagesCleared = 8
    expect(isFeatureUnlocked(s, 'formation')).toBe(true)

    s = createInitialState(0)
    s.realmIndex = REALM_INDEX_BY_ID['thao-can-1']
    expect(isFeatureUnlocked(s, 'formation')).toBe(true)
  })

  it('unlocks swords at stage 10 / 1 boss slain or Lieu Can realm', () => {
    let s = createInitialState(0)
    s.stats.bossesSlain = 1
    expect(isFeatureUnlocked(s, 'swords')).toBe(true)

    s = createInitialState(0)
    s.realmIndex = REALM_INDEX_BY_ID['lieu-can-1']
    expect(isFeatureUnlocked(s, 'swords')).toBe(true)
  })

  it('unlocks alchemy at stage 20 / 2 bosses slain or Khi Cot realm', () => {
    let s = createInitialState(0)
    s.stats.bossesSlain = 2
    expect(isFeatureUnlocked(s, 'alchemy')).toBe(true)

    s = createInitialState(0)
    s.realmIndex = REALM_INDEX_BY_ID['khi-cot-1']
    expect(isFeatureUnlocked(s, 'alchemy')).toBe(true)
  })

  it('unlocks legacy at Kim Dan realm or forced reincarnation', () => {
    let s = createInitialState(0)
    s.realmIndex = REALM_INDEX_BY_ID['kim-dan-1']
    expect(isFeatureUnlocked(s, 'legacy')).toBe(true)

    s = createInitialState(0)
    s.ageDays = 1000000 // Out of lifespan
    expect(isFeatureUnlocked(s, 'legacy')).toBe(true)
  })

  it('unlocks features automatically for reincarnated players', () => {
    const s = createInitialState(0)
    s.legacy.lives = 2
    expect(isFeatureUnlocked(s, 'techniques')).toBe(true)
    expect(isFeatureUnlocked(s, 'forge')).toBe(true)
    expect(isFeatureUnlocked(s, 'formation')).toBe(true)
    expect(isFeatureUnlocked(s, 'swords')).toBe(true)
    expect(isFeatureUnlocked(s, 'alchemy')).toBe(true)
  })

  it('returns valid requirement descriptions', () => {
    expect(getFeatureUnlockRequirement('forge')).toContain('Vượt Ải')
    expect(getFeatureUnlockRequirement('swords')).toContain('Vượt Ải')
    expect(getFeatureUnlockRequirement('alchemy')).toContain('Vượt Ải')
  })
})
