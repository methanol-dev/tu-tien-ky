import { describe, expect, it } from 'vitest'
import { AVATARS, AVATAR_BY_ID, getEvolutionStage } from '@/content/avatars'
import { createMemoryStorage } from '@/engine'
import { createGameStore } from '@/store/gameStore'

describe('avatars & character visual evolution', () => {
  it('contains 8 Kiếm Lai characters with valid image paths and descriptions', () => {
    expect(AVATARS).toHaveLength(8)
    for (const a of AVATARS) {
      expect(a.id).toBeTruthy()
      expect(a.name).toBeTruthy()
      expect(a.image).toContain('assets/portraits/')
      expect(AVATAR_BY_ID[a.id]).toBe(a)
    }
  })

  it('updates selected avatar in game store settings', () => {
    const store = createGameStore({ storage: createMemoryStorage() })
    store.getState().hydrate(0)

    expect(store.getState().state.settings.avatarId).toBeUndefined()

    store.getState().setAvatar('ninh-dieu')
    expect(store.getState().state.settings.avatarId).toBe('ninh-dieu')
  })

  it('calculates evolution stage correctly across realms', () => {
    // Stage 1: Phàm nhân / Luyện khí sơ kỳ
    const s1 = getEvolutionStage(0)
    expect(s1.id).toBe('thieu-nien')
    expect(s1.weapon).toContain('Hòe Mộc Kiếm')

    // Stage 2: Luyện khí hậu kỳ / Trúc cơ
    const s2 = getEvolutionStage(4)
    expect(s2.id).toBe('du-hiep')
    expect(s2.weapon).toContain('Lung Trung Tước')

    // Stage 3: Kết đan / Kim đan / Nguyên Anh
    const s3 = getEvolutionStage(8)
    expect(s3.id).toBe('an-quan')
    expect(s3.name).toBe('Bào Xanh Ẩn Quan')

    // Stage 4: Hóa Thần trở lên
    const s4 = getEvolutionStage(13)
    expect(s4.id).toBe('kiem-tien')
    expect(s4.swordCount).toBe(4)
  })
})
