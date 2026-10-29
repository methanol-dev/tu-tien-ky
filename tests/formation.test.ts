import { describe, expect, it } from 'vitest'
import {
  createInitialFormation,
  getClassCounterEffect,
  getDefaultFormationSlot,
  getEnemyClass,
  getPositionModifiers,
  isBackline,
  isFrontline,
  setPlayerFormationSlot,
} from '@/engine/formation'
import { createInitialState } from '@/engine/state'
import { getCombatStats } from '@/engine/combat'
import { REGIONS } from '@/content/regions'

describe('Formation & Counters Engine (Trận Đồ Bát Quái & Tương Khắc Ngũ Môn)', () => {
  it('identifies front and back lines correctly', () => {
    expect(isFrontline('front-left')).toBe(true)
    expect(isFrontline('front-mid')).toBe(true)
    expect(isFrontline('front-right')).toBe(true)
    expect(isFrontline('back-mid')).toBe(false)

    expect(isBackline('back-left')).toBe(true)
    expect(isBackline('back-mid')).toBe(true)
    expect(isBackline('back-right')).toBe(true)
    expect(isBackline('front-mid')).toBe(false)
  })

  it('determines default slot by class archetype', () => {
    expect(getDefaultFormationSlot('vo-phu')).toBe('front-mid')
    expect(getDefaultFormationSlot('phat-gia')).toBe('front-mid')
    expect(getDefaultFormationSlot('binh-gia')).toBe('front-mid')

    expect(getDefaultFormationSlot('kiem-tu')).toBe('back-mid')
    expect(getDefaultFormationSlot('dao-gia')).toBe('back-mid')
    expect(getDefaultFormationSlot('nho-gia')).toBe('back-mid')
  })

  it('provides position modifiers for front and back positions', () => {
    const frontMod = getPositionModifiers('front-mid')
    expect(frontMod.defMult).toBe(1.2)
    expect(frontMod.hpMult).toBe(1.15)
    expect(frontMod.atkSpeedMult).toBe(0.9)

    const backMod = getPositionModifiers('back-mid')
    expect(backMod.atkMult).toBe(1.15)
    expect(backMod.critBonus).toBe(0.1)
    expect(backMod.defMult).toBe(0.85)
  })

  it('calculates class counter cycles correctly', () => {
    // Kiếm Tu khắc Nho Gia
    const ktVsNho = getClassCounterEffect('kiem-tu', 'nho-gia')
    expect(ktVsNho.status).toBe('advantage')
    expect(ktVsNho.dmgDealMult).toBe(1.25)
    expect(ktVsNho.dmgTakeMult).toBe(0.85)

    // Nho Gia bị Kiếm Tu khắc
    const nhoVsKt = getClassCounterEffect('nho-gia', 'kiem-tu')
    expect(nhoVsKt.status).toBe('disadvantage')
    expect(nhoVsKt.dmgDealMult).toBe(0.85)
    expect(nhoVsKt.dmgTakeMult).toBe(1.25)

    // Võ Phu khắc Đạo Gia
    const vpVsDg = getClassCounterEffect('vo-phu', 'dao-gia')
    expect(vpVsDg.status).toBe('advantage')

    // Đạo Gia khắc Phật Gia
    const dgVsPg = getClassCounterEffect('dao-gia', 'phat-gia')
    expect(dgVsPg.status).toBe('advantage')

    // Phật Gia khắc Kiếm Tu
    const pgVsKt = getClassCounterEffect('phat-gia', 'kiem-tu')
    expect(pgVsKt.status).toBe('advantage')

    // Cùng hệ phái -> Cân bằng
    const ktVsKt = getClassCounterEffect('kiem-tu', 'kiem-tu')
    expect(ktVsKt.status).toBe('neutral')
    expect(ktVsKt.dmgDealMult).toBe(1.0)
    expect(ktVsKt.dmgTakeMult).toBe(1.0)
  })

  it('infers enemy class from template', () => {
    const lyChau = REGIONS[0]
    expect(getEnemyClass(lyChau.boss)).toBe('vo-phu')

    const hacSon = REGIONS[1]
    expect(getEnemyClass(hacSon.boss)).toBe('am-duong-gia')

    const ninhDieu = REGIONS[6]
    expect(getEnemyClass(ninhDieu.boss)).toBe('kiem-tu')
  })

  it('switches player formation slot and updates combat stats', () => {
    let s = createInitialState()
    s.classId = 'kiem-tu'
    s.formation = createInitialFormation('kiem-tu')
    expect(s.formation.playerSlot).toBe('back-mid')

    const backStats = getCombatStats(s)

    // Switch to frontline
    s = setPlayerFormationSlot(s, 'front-mid')
    expect(s.formation.playerSlot).toBe('front-mid')

    const frontStats = getCombatStats(s)
    // Frontline has higher DEF & HP, but lower ATK & CRIT than Backline
    expect(frontStats.def).toBeGreaterThan(backStats.def)
    expect(frontStats.hp).toBeGreaterThan(backStats.hp)
    expect(frontStats.atk).toBeLessThan(backStats.atk)
    expect(frontStats.crit).toBeLessThan(backStats.crit)
  })
})
