import { describe, expect, it } from 'vitest'
import { CHAPTERS, NPCS } from '@/content/story'
import { createInitialState, getEligibleScenes, getPendingStoryScene, resolveStoryScene } from '@/engine'

describe('Kiếm Lai Story Engine', () => {
  it('has valid chapters, scenes and NPCs', () => {
    expect(CHAPTERS.length).toBeGreaterThanOrEqual(6)
    expect(NPCS.length).toBeGreaterThanOrEqual(8)

    // Check key NPCs
    const npcs = NPCS.map((n) => n.id)
    expect(npcs).toContain('tran-binh-an')
    expect(npcs).toContain('ninh-dieu')
    expect(npcs).toContain('te-tinh-xuan')
    expect(npcs).toContain('a-luong')
  })

  it('provides initial story scene for newly created character (Hồi 0)', () => {
    const state = createInitialState(1000)
    expect(getEligibleScenes(state).length).toBeGreaterThanOrEqual(1)
    const pending = getPendingStoryScene(state)
    expect(pending).not.toBeNull()
    expect(pending?.chapterId).toBe('hoi-00')
    expect(pending?.title).toContain('Cá Chép Bốn Râu')
  })

  it('resolves scene, marks it seen, and proceeds to next scene', () => {
    const s0 = createInitialState(1000)
    const scene1 = getPendingStoryScene(s0)!
    expect(scene1).toBeDefined()

    // Resolve scene 1 with choice
    const { state: s1, resolution } = resolveStoryScene(s0, scene1.id, 'c1')
    expect(resolution.choice?.id).toBe('c1')
    expect(s1.flags[`story:seen:${scene1.id}`]).toBe(true)
    expect(s1.flags['story:choice:c1']).toBe(true)

    // Next pending scene should be scene 0-2 (Lão Hòe Thụ Dưới Mưa)
    const scene2 = getPendingStoryScene(s1)
    expect(scene2).not.toBeNull()
    expect(scene2?.id).toBe('scene-0-2')

    // Resolve scene 2 without choice
    const { state: s2 } = resolveStoryScene(s1, scene2!.id)
    expect(s2.flags[`story:seen:${scene2!.id}`]).toBe(true)

    // In Phàm Nhân realm, no more scenes until Luyện Khí 1
    const pendingAfter = getPendingStoryScene(s2)
    expect(pendingAfter).toBeNull()

    // When advancing to Luyện Khí 1 (realmIndex = 1), Hồi 1 opens
    const sLuyenKhi = { ...s2, realmIndex: 1 }
    const sceneHoi1 = getPendingStoryScene(sLuyenKhi)
    expect(sceneHoi1).not.toBeNull()
    expect(sceneHoi1?.chapterId).toBe('hoi-01')
    expect(sceneHoi1?.title).toContain('Thiếu Nữ Áo Xanh')
  })
})
