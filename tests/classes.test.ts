import { describe, expect, it } from 'vitest'
import { CLASSES, CLASS_BY_ID } from '@/content/classes'
import { changeClass } from '@/engine/classes'
import { getCombatStats } from '@/engine/combat'
import { createInitialState } from '@/engine/state'

describe('Classes and Factions', () => {
  it('defines 10 unique classes with distinct archetypes', () => {
    expect(CLASSES.length).toBe(10)
    for (const c of CLASSES) {
      expect(c.id).toBeTruthy()
      expect(c.name).toBeTruthy()
      expect(c.title).toBeTruthy()
      expect(c.glyph).toBeTruthy()
      expect(CLASS_BY_ID[c.id]).toBe(c)
    }
  })

  it('changing class applies multipliers to combat stats', () => {
    const s0 = { ...createInitialState(0), realmIndex: 5 }
    expect(s0.classId).toBe('kiem-tu')
    const swordStats = getCombatStats(s0)

    // Chuyển sang Võ Phu (tăng HP và Def)
    const rVoPhu = changeClass(s0, 'vo-phu')
    expect(rVoPhu.ok).toBe(true)
    if (!rVoPhu.ok) return
    const voPhuStats = getCombatStats(rVoPhu.state)
    expect(voPhuStats.hp).toBeGreaterThan(swordStats.hp)
    expect(voPhuStats.def).toBeGreaterThan(swordStats.def)

    // Chuyển sang cùng phái sẽ báo lỗi
    const rDup = changeClass(rVoPhu.state, 'vo-phu')
    expect(rDup.ok).toBe(false)
  })
})
