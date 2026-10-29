import { describe, expect, it } from 'vitest'
import { REALM_INDEX_BY_ID } from '@/content/realms'
import {
  addItems,
  calculateSwordDaoPower,
  createInitialState,
  forgeNatalSword,
  getCombatStats,
  getNatalSwordsCombatStats,
  getSwordRank,
  temperNatalSword,
  upgradeSwordTalent,
} from '@/engine'

describe('Kiếm Tu - Phi Kiếm Bản Mệnh & Bản Mệnh Thần Thông', () => {
  it('starts with empty natal swords and allows forging free initial sword Sơ Thập', () => {
    let s = createInitialState(0)
    expect(s.natalSwords).toHaveLength(0)

    const res = forgeNatalSword(s, 'so-thap')
    expect(res.ok).toBe(true)
    if (!res.ok) return

    s = res.state
    expect(s.natalSwords).toHaveLength(1)
    expect(s.natalSwords[0].swordDefId).toBe('so-thap')
    expect(s.natalSwords[0].level).toBe(1)
    expect(s.natalSwords[0].talents).toHaveLength(1)
    expect(s.natalSwords[0].talents[0].id).toBe('bon-loi-tat-hanh')
  })

  it('calculates Sword Dao Power and classifies Sword Cultivator rank', () => {
    const s = createInitialState(0)
    const emptyRank = getSwordRank(s.natalSwords)
    expect(emptyRank.tier).toBe(1) // Kiếm Đồ Sơ Khởi

    const res = forgeNatalSword(s, 'so-thap')
    expect(res.ok).toBe(true)
    if (!res.ok) return

    const power = calculateSwordDaoPower(res.state.natalSwords)
    expect(power).toBeGreaterThan(0)

    const rank = getSwordRank(res.state.natalSwords)
    // 1 kiếm sơ khai -> Bậc 2: Khí Phủ Kiếm Sĩ
    expect(rank.tier).toBeGreaterThanOrEqual(2)
  })

  it('tempers sword to level up and awakens new talent at level 3', () => {
    let s = createInitialState(0)
    const forgeRes = forgeNatalSword(s, 'so-thap')
    expect(forgeRes.ok).toBe(true)
    if (!forgeRes.ok) return
    s = { ...forgeRes.state, stones: 100_000 }
    const swordUid = s.natalSwords[0].uid

    // Nâng lên cấp 2
    const res1 = temperNatalSword(s, swordUid)
    expect(res1.ok).toBe(true)
    if (!res1.ok) return
    expect(res1.state.natalSwords[0].level).toBe(2)
    expect(res1.state.natalSwords[0].talents).toHaveLength(1)

    // Nâng lên cấp 3 -> Thức tỉnh Phá Không Sát Giáp!
    const res2 = temperNatalSword(res1.state, swordUid)
    expect(res2.ok).toBe(true)
    if (!res2.ok) return
    expect(res2.state.natalSwords[0].level).toBe(3)
    expect(res2.state.natalSwords[0].talents).toHaveLength(2)
    expect(res2.state.natalSwords[0].talents.some((t) => t.id === 'pha-khong-sat-giap')).toBe(true)
  })

  it('upgrades sword talent to enhance combat stats', () => {
    let s = createInitialState(0)
    const forgeRes = forgeNatalSword(s, 'so-thap')
    expect(forgeRes.ok).toBe(true)
    if (!forgeRes.ok) return
    s = { ...forgeRes.state, stones: 100_000 }
    const swordUid = s.natalSwords[0].uid

    const initialStats = getNatalSwordsCombatStats(s)
    const res = upgradeSwordTalent(s, swordUid, 'bon-loi-tat-hanh')
    expect(res.ok).toBe(true)
    if (!res.ok) return

    expect(res.state.natalSwords[0].talents[0].level).toBe(2)
    const upgradedStats = getNatalSwordsCombatStats(res.state)
    expect(upgradedStats.atkSpeedMult).toBeGreaterThan(initialStats.atkSpeedMult)
  })

  it('allows forging second natal sword (Thập Ngũ) when requirements are met', () => {
    let s = createInitialState(0)
    const forgeRes1 = forgeNatalSword(s, 'so-thap')
    expect(forgeRes1.ok).toBe(true)
    if (!forgeRes1.ok) return

    // Cảnh giới Khí Cốt
    s = {
      ...forgeRes1.state,
      realmIndex: REALM_INDEX_BY_ID['khi-cot-1'],
      stones: 50_000,
    }
    s = addItems(s, {
      'kiem-khi-tinh-thach': 5,
      'tuyet-hoa-tien': 10,
    })

    const res = forgeNatalSword(s, 'thap-ngu')
    expect(res.ok).toBe(true)
    if (!res.ok) return

    expect(res.state.natalSwords).toHaveLength(2)
    expect(res.state.natalSwords.some((sw) => sw.swordDefId === 'thap-ngu')).toBe(true)

    // Đạt danh xưng Song Tuyệt Kiếm Tiên
    const rank = getSwordRank(res.state.natalSwords)
    expect(rank.tier).toBeGreaterThanOrEqual(4)
  })

  it('integrates natal sword stats into getCombatStats', () => {
    let s = createInitialState(0)
    const baseStats = getCombatStats(s)

    const forgeRes = forgeNatalSword(s, 'so-thap')
    expect(forgeRes.ok).toBe(true)
    if (!forgeRes.ok) return
    s = forgeRes.state

    const stats = getCombatStats(s)
    // Đã có bonus tốc đánh từ Bôn Lôi Tật Hành và công kích từ Khí Phủ Kiếm Sĩ
    expect(stats.attackMs).toBeLessThan(baseStats.attackMs)
    expect(stats.atk).toBeGreaterThan(baseStats.atk)
  })
})
