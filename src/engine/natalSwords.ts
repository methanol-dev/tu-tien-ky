import {
  NATAL_SWORD_BY_ID,
  SWORD_RANKS,
  SWORD_TALENT_BY_ID,
  type SwordRankTier,
} from '@/content/natalSwords'
import { getItemCount, removeItems } from './inventory'
import { pushLog } from './log'
import type { ActionResult, GameState, NatalSwordInstance } from './types'

/**
 * Tính tổng điểm Kiếm Đạo Khí Số (Sword Dao Power) của nhân vật
 */
export function calculateSwordDaoPower(swords: NatalSwordInstance[]): number {
  let power = 0
  for (const s of swords) {
    const def = NATAL_SWORD_BY_ID[s.swordDefId]
    const swordTier = def?.tier ?? 3
    power += swordTier * 100 + s.level * 25

    for (const t of s.talents) {
      const tDef = SWORD_TALENT_BY_ID[t.id]
      const tTier = tDef?.tier ?? 3
      power += tTier * 60 + t.level * 20
    }
  }
  return power
}

/**
 * Tra cứu phẩm cấp danh xưng Kiếm Tu Bảng hiện tại
 */
export function getSwordRank(swords: NatalSwordInstance[]): SwordRankTier {
  const power = calculateSwordDaoPower(swords)
  const count = swords.length
  // Tìm từ bậc cao nhất (bậc 7) xuống bậc thấp nhất (bậc 1)
  const sorted = [...SWORD_RANKS].sort((a, b) => b.tier - a.tier)
  for (const r of sorted) {
    if (power >= r.minPower && count >= r.minSwords) {
      return r
    }
  }
  return SWORD_RANKS[0]
}

export interface NatalSwordCombatStats {
  atkMult: number           // Hệ số tăng sát thương công kích (VD: 1.25 = +25%)
  armorPen: number          // Tỷ lệ bỏ qua giáp của đối thủ (0..1)
  atkSpeedMult: number      // Tăng tốc đánh (VD: 1.2 = nhanh hơn 20%)
  heavyDmgPct: number       // Sát thương cộng dồn theo máu tối đa mục tiêu
  damageReduction: number   // Giảm sát thương nhận vào (0..0.5)
  dodgeChance: number       // Tỷ lệ né tránh đòn công (0..0.4)
  lifestealBonus: number    // Hút máu cộng thêm (0..0.5)
  critBonus: number         // Tỷ lệ bạo kích cộng thêm
  critMultBonus: number     // Sát thương bạo kích cộng thêm
  allDmgMult: number        // Sát thương tổng thể
  executeThreshold: number  // Ngưỡng máu trảm sát (0..0.25)
  qiRateMult: number        // Tốc độ hấp thu linh khí
}

/**
 * Tổng hợp toàn bộ chỉ số combat và tu vi được kích hoạt từ các phi kiếm bản mệnh
 */
export function getNatalSwordsCombatStats(state: GameState): NatalSwordCombatStats {
  const swords = state.natalSwords ?? []
  const rank = getSwordRank(swords)

  // Chỉ số khởi điểm từ Rank Kiếm Tu
  let rankAtkMult = 0
  let rankArmorPen = 0
  let rankCrit = 0
  let rankAtkSpeed = 0

  switch (rank.tier) {
    case 2: rankAtkMult = 0.05; break
    case 3: rankAtkMult = 0.10; rankAtkSpeed = 0.05; break
    case 4: rankAtkMult = 0.20; rankCrit = 0.10; break
    case 5: rankAtkMult = 0.30; rankArmorPen = 0.15; break
    case 6: rankAtkMult = 0.45; rankCrit = 0.20; break
    case 7: rankAtkMult = 0.70; rankArmorPen = 0.30; break
  }

  let armorPen = rankArmorPen
  let atkSpeedBonus = rankAtkSpeed
  let heavyDmgPct = 0
  let damageReduction = 0
  let dodgeChance = 0
  let lifestealBonus = 0
  let critBonus = rankCrit
  let critMultBonus = 0
  let allDmgBonus = rankAtkMult
  let executeThreshold = 0
  let qiRateBonus = 0

  for (const s of swords) {
    for (const t of s.talents) {
      const def = SWORD_TALENT_BY_ID[t.id]
      if (!def) continue
      const val = def.baseValue + (t.level - 1) * def.perLevel

      switch (def.kind) {
        case 'armorPen':
          armorPen = Math.min(0.85, armorPen + val)
          break
        case 'atkSpeed':
          atkSpeedBonus += val
          break
        case 'heavyDmg':
          heavyDmgPct += val
          break
        case 'damageReduction':
          damageReduction = Math.min(0.5, damageReduction + val)
          break
        case 'dodgeCounter':
          dodgeChance = Math.min(0.35, dodgeChance + val)
          break
        case 'lifesteal':
          lifestealBonus += val
          break
        case 'critBuff':
          critBonus += val
          critMultBonus += val * 1.5
          break
        case 'allDmg':
          allDmgBonus += val
          break
        case 'execute':
          executeThreshold = Math.max(executeThreshold, val)
          break
        case 'qiRate':
          qiRateBonus += val
          break
      }
    }
  }

  return {
    atkMult: 1 + allDmgBonus,
    armorPen,
    atkSpeedMult: 1 + atkSpeedBonus,
    heavyDmgPct,
    damageReduction,
    dodgeChance,
    lifestealBonus,
    critBonus,
    critMultBonus,
    allDmgMult: 1 + allDmgBonus,
    executeThreshold,
    qiRateMult: 1 + qiRateBonus,
  }
}

/**
 * Chi phí khai mở phi kiếm bản mệnh tiếp theo (Kiếm 1 = miễn phí, Kiếm 2, 3, 4 cần kiếm tài & tiền thần tiên)
 */
export function getForgeSwordCost(swordCount: number): {
  stones: number
  items: Record<string, number>
} {
  switch (swordCount) {
    case 0:
      return { stones: 0, items: {} }
    case 1:
      // Kiếm thứ 2: 5 Kiếm Khí Tinh Thạch + 5 Tuyết Hoa Tiền
      return {
        stones: 5_000,
        items: {
          'kiem-khi-tinh-thach': 3,
          'tuyet-hoa-tien': 5,
        },
      }
    case 2:
      // Kiếm thứ 3: 15 Kiếm Khí Tinh Thạch + 2 Tiểu Thử Tiền
      return {
        stones: 50_000,
        items: {
          'kiem-khi-tinh-thach': 10,
          'tieu-thu-tien': 2,
        },
      }
    case 3:
      // Kiếm thứ 4: 30 Kiếm Khí Tinh Thạch + 1 Cốc Vũ Tiền
      return {
        stones: 500_000,
        items: {
          'kiem-khi-tinh-thach': 20,
          'coc-vu-tien': 1,
        },
      }
    default:
      return { stones: Infinity, items: {} }
  }
}

/**
 * Uẩn dưỡng thai nghén 1 thanh phi kiếm bản mệnh mới
 */
export function forgeNatalSword(state: GameState, swordDefId: string): ActionResult {
  const def = NATAL_SWORD_BY_ID[swordDefId]
  if (!def) return { ok: false, error: 'Phi kiếm không tồn tại trong điển tịch' }
  const swords = state.natalSwords ?? []

  if (swords.length >= 4) {
    return { ok: false, error: 'Khí phủ đã đạt cực hạn (tối đa 4 phi kiếm bản mệnh)' }
  }
  if (swords.some((s) => s.swordDefId === swordDefId)) {
    return { ok: false, error: `Đã uẩn dưỡng phi kiếm ${def.name} trong khí phủ rồi` }
  }
  if (state.realmIndex < def.minRealmIndex) {
    return { ok: false, error: `Cảnh giới chưa đủ để thai nghén phi kiếm ${def.name}` }
  }

  const cost = getForgeSwordCost(swords.length)
  if (state.stones < cost.stones) {
    return { ok: false, error: `Không đủ linh thạch (cần ${cost.stones.toLocaleString()})` }
  }

  for (const [itemId, count] of Object.entries(cost.items)) {
    if (getItemCount(state, itemId) < count) {
      return { ok: false, error: `Thiếu kiếm tài: cần ${count} ${itemId}` }
    }
  }

  let next = removeItems(state, cost.items)
  next = { ...next, stones: next.stones - cost.stones }

  const newSword: NatalSwordInstance = {
    uid: `sword-${Date.now()}-${swordDefId}`,
    swordDefId,
    name: def.name,
    level: 1,
    talents: def.initialTalentIds.map((id) => ({ id, level: 1 })),
  }

  const updatedSwords = [...swords, newSword]
  const newRank = getSwordRank(updatedSwords)

  next = {
    ...next,
    natalSwords: updatedSwords,
  }

  next = pushLog(
    next,
    `Uẩn dưỡng thành công phi kiếm bản mệnh ${def.name}! Đạt danh vị kiếm đạo: ${newRank.title}.`,
    'success',
  )

  return { ok: true, state: next }
}

/**
 * Tôi luyện nâng cấp phi kiếm bản mệnh (Tăng cấp 1..10)
 */
export function temperNatalSword(state: GameState, swordUid: string): ActionResult {
  const swords = state.natalSwords ?? []
  const idx = swords.findIndex((s) => s.uid === swordUid)
  if (idx < 0) return { ok: false, error: 'Không tìm thấy phi kiếm' }

  const sword = swords[idx]
  const def = NATAL_SWORD_BY_ID[sword.swordDefId]
  if (!def) return { ok: false, error: 'Dữ liệu phi kiếm không hợp lệ' }

  if (sword.level >= def.maxLevel) {
    return { ok: false, error: `${sword.name} đã được tôi luyện tới cảnh giới viên mãn!` }
  }

  const stoneCost = Math.round(1_500 * 1.7 ** (sword.level - 1))
  if (state.stones < stoneCost) {
    return { ok: false, error: `Không đủ linh thạch tôi kiếm (cần ${stoneCost.toLocaleString()})` }
  }

  const newLevel = sword.level + 1
  const updatedTalents = [...sword.talents]

  // Thức tỉnh thần thông mới khi đạt cấp 3 hoặc cấp 6
  let awakenedTalentName: string | null = null
  if (newLevel === 3 || newLevel === 6) {
    for (const tid of def.unlockableTalentIds) {
      if (!updatedTalents.some((t) => t.id === tid)) {
        updatedTalents.push({ id: tid, level: 1 })
        awakenedTalentName = SWORD_TALENT_BY_ID[tid]?.name ?? tid
        break
      }
    }
  }

  const updatedSword: NatalSwordInstance = {
    ...sword,
    level: newLevel,
    talents: updatedTalents,
  }

  const newSwords = [...swords]
  newSwords[idx] = updatedSword

  let next: GameState = {
    ...state,
    stones: state.stones - stoneCost,
    natalSwords: newSwords,
  }

  next = pushLog(
    next,
    `Tôi luyện ${sword.name} thành công tiến lên cấp ${newLevel}!${awakenedTalentName ? ` Thức tỉnh thêm thần thông mới: [${awakenedTalentName}]!` : ''
    }`,
    'success',
  )

  return { ok: true, state: next }
}

/**
 * Nâng cấp một Bản Mệnh Thần Thông cụ thể của phi kiếm
 */
export function upgradeSwordTalent(
  state: GameState,
  swordUid: string,
  talentId: string,
): ActionResult {
  const swords = state.natalSwords ?? []
  const sIdx = swords.findIndex((s) => s.uid === swordUid)
  if (sIdx < 0) return { ok: false, error: 'Không tìm thấy phi kiếm' }

  const sword = swords[sIdx]
  const tIdx = sword.talents.findIndex((t) => t.id === talentId)
  if (tIdx < 0) return { ok: false, error: 'Phi kiếm chưa thức tỉnh thần thông này' }

  const talent = sword.talents[tIdx]
  const def = SWORD_TALENT_BY_ID[talentId]
  if (!def) return { ok: false, error: 'Thần thông không tồn tại' }

  if (talent.level >= def.maxLevel) {
    return { ok: false, error: `Thần thông ${def.name} đã đại thành viên mãn!` }
  }

  const stoneCost = Math.round(2_500 * 1.8 ** (talent.level - 1))
  if (state.stones < stoneCost) {
    return { ok: false, error: `Không đủ linh thạch ngộ đạo (cần ${stoneCost.toLocaleString()})` }
  }

  const newTalents = [...sword.talents]
  newTalents[tIdx] = { ...talent, level: talent.level + 1 }

  const newSwords = [...swords]
  newSwords[sIdx] = { ...sword, talents: newTalents }

  let next: GameState = {
    ...state,
    stones: state.stones - stoneCost,
    natalSwords: newSwords,
  }

  next = pushLog(
    next,
    `Bản mệnh thần thông [${def.name}] của ${sword.name} đốn ngộ đột phá lên tầng ${talent.level + 1}!`,
    'success',
  )

  return { ok: true, state: next }
}

