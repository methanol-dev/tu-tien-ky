import { describe, expect, it } from 'vitest'
import { REGIONS } from '@/content/regions'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import {
  addItems,
  createInitialState,
  createSeededRng,
  getItemCount,
  journeyTick,
  tick,
  useItem,
} from '@/engine'

describe('Journey Rich Loot & Currency System', () => {
  it('allows converting Tuyết Hoa Tiền to Spirit Stones', () => {
    let s = createInitialState(0)
    s = addItems(s, { 'tuyet-hoa-tien': 2 })
    expect(getItemCount(s, 'tuyet-hoa-tien')).toBe(2)
    const initialStones = s.stones

    const res = useItem(s, 'tuyet-hoa-tien')
    expect(res.ok).toBe(true)
    if (!res.ok) return

    expect(getItemCount(res.state, 'tuyet-hoa-tien')).toBe(1)
    expect(res.state.stones).toBe(initialStones + 1_000)
  })

  it('allows converting Tiểu Thử Tiền and Cốc Vũ Tiền to Spirit Stones', () => {
    let s = createInitialState(0)
    s = addItems(s, { 'tieu-thu-tien': 1, 'coc-vu-tien': 1 })

    const res1 = useItem(s, 'tieu-thu-tien')
    expect(res1.ok).toBe(true)
    if (!res1.ok) return
    expect(res1.state.stones).toBe(100_000)

    const res2 = useItem(res1.state, 'coc-vu-tien')
    expect(res2.ok).toBe(true)
    if (!res2.ok) return
    expect(res2.state.stones).toBe(100_000 + 10_000_000)
  })

  it('allows comprehending Technique Manuals from inventory', () => {
    let s = createInitialState(0)
    s = addItems(s, { 'tan-quyen-kiem-pho': 2 })
    expect(s.techniques['so-thap-kiem-pho'] ?? 0).toBe(0)

    // Lần 1: Lĩnh ngộ khai mở tầng 1
    const res1 = useItem(s, 'tan-quyen-kiem-pho')
    expect(res1.ok).toBe(true)
    if (!res1.ok) return
    expect(getItemCount(res1.state, 'tan-quyen-kiem-pho')).toBe(1)
    expect(res1.state.techniques['so-thap-kiem-pho']).toBe(1)

    // Lần 2: Tiến lên tầng 2
    const res2 = useItem(res1.state, 'tan-quyen-kiem-pho')
    expect(res2.ok).toBe(true)
    if (!res2.ok) return
    expect(getItemCount(res2.state, 'tan-quyen-kiem-pho')).toBe(0)
    expect(res2.state.techniques['so-thap-kiem-pho']).toBe(2)
  })

  it('prevents using manual when technique is already at max level', () => {
    let s = createInitialState(0)
    const tech = TECHNIQUE_BY_ID['so-thap-kiem-pho']
    s = { ...s, techniques: { ...s.techniques, 'so-thap-kiem-pho': tech.maxLevel } }
    s = addItems(s, { 'tan-quyen-kiem-pho': 1 })

    const res = useItem(s, 'tan-quyen-kiem-pho')
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error).toContain('viên mãn')
    }
  })

  it('drops loot events (loot-stone, loot-item, loot-manual) during journey combat', () => {
    let s = createInitialState(0)
    // Cấp cao để diệt quái nhanh trong 1 đòn
    s = {
      ...s,
      realmIndex: 8,
      journey: {
        ...s.journey,
        regionId: REGIONS[0].id,
        difficulty: 0,
        phase: 'fight',
        party: [{ id: 'player', hp: 1000, maxHp: 1000, nextAttackAtMs: 0 }],
        enemies: [
          {
            id: 'da-khuyen',
            name: 'Dã khuyển',
            silhouette: 'wolf',
            hp: 1,
            maxHp: 1,
            atk: 1,
            def: 0,
            boss: false,
            nextAttackAtMs: 10_000,
          },
        ],
      },
    }

    const rng = createSeededRng(42)
    let cur = s
    for (let i = 0; i < 10; i++) {
      cur = journeyTick(tick(cur, 100), 100, rng)
    }

    // Đã hạ gục dã khuyển
    expect(cur.stats.enemiesSlain).toBeGreaterThanOrEqual(1)
    // Có event loot linh thạch
    const hasLootStone = cur.journey.events.some((e) => e.kind === 'loot-stone')
    expect(hasLootStone).toBe(true)
  })
})
