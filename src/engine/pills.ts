import { ITEM_BY_ID } from '@/content/items'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import { formatNumber } from '@/lib/format'
import { DAYS_PER_YEAR } from './constants'
import { getRealm } from './cultivation'
import { getItemCount, removeItems } from './inventory'
import { pushLog } from './log'
import type { ActionResult, GameState } from './types'

export function getActiveBuffs(state: GameState) {
  return state.buffs.filter((b) => b.expiresAtMs > state.playedMs)
}

export function usePill(state: GameState, itemId: string): ActionResult {
  const def = ITEM_BY_ID[itemId]
  if (!def) return { ok: false, error: 'Vật phẩm không tồn tại' }
  if (getItemCount(state, itemId) <= 0) return { ok: false, error: `Không còn ${def.name}` }

  // 1. Dùng Tiền Thần Tiên quy đổi ra Linh Thạch
  if (def.kind === 'currency') {
    const val = def.currencyValue ?? 0
    if (val <= 0) return { ok: false, error: 'Tiền tệ này không thể quy đổi' }
    let next = removeItems(state, { [itemId]: 1 })
    next = {
      ...next,
      stones: next.stones + val,
      stats: { ...next.stats, stonesTotal: next.stats.stonesTotal + val },
    }
    next = pushLog(next, `Đổi 1 ${def.name} thu được ${formatNumber(val)} Linh Thạch.`, 'success')
    return { ok: true, state: next }
  }

  // 2. Dùng Sách Bí Tịch Lĩnh Ngộ Công Pháp Thần Thông
  if (def.kind === 'manual') {
    const techId = def.techniqueId
    if (!techId) return { ok: false, error: 'Bí tịch không chứa công pháp hợp lệ' }
    const techDef = TECHNIQUE_BY_ID[techId]
    if (!techDef) return { ok: false, error: 'Không tìm thấy khẩu quyết công pháp' }

    const currentLevel = state.techniques[techId] ?? 0
    if (currentLevel >= techDef.maxLevel) {
      return { ok: false, error: `${techDef.name} đã tu luyện tới cảnh giới viên mãn (Cấp ${techDef.maxLevel})!` }
    }

    let next = removeItems(state, { [itemId]: 1 })
    const nextLevel = currentLevel + 1
    next = {
      ...next,
      techniques: { ...next.techniques, [techId]: nextLevel },
    }
    next = pushLog(
      next,
      currentLevel === 0
        ? `Nghiền ngẫm ${def.name}, đốn ngộ tuyệt học ${techDef.name}!`
        : `Lĩnh ngộ tàn thiên ${def.name}, ${techDef.name} đột phá lên tầng ${nextLevel}!`,
      'success',
    )
    return { ok: true, state: next }
  }

  // 3. Dùng Đan Dược
  if (def.kind !== 'pill' || !def.effect) return { ok: false, error: 'Vật phẩm không dùng được' }

  let next = removeItems(state, { [itemId]: 1 })
  next = { ...next, stats: { ...next.stats, pillsUsed: next.stats.pillsUsed + 1 } }
  const fx = def.effect

  switch (fx.kind) {
    case 'instantQi': {
      const gain = getRealm(next).qiRequired * fx.fraction
      next = { ...next, qi: next.qi + gain, stats: { ...next.stats, qiTotal: next.stats.qiTotal + gain } }
      next = pushLog(next, `Nuốt ${def.name}, linh khí cuồn cuộn dâng lên.`, 'info')
      break
    }
    case 'qiRateBuff': {
      const others = next.buffs.filter((b) => b.id !== itemId && b.expiresAtMs > next.playedMs)
      next = {
        ...next,
        buffs: [
          ...others,
          { id: itemId, name: def.name, qiRateMult: fx.mult, expiresAtMs: next.playedMs + fx.durationMs },
        ],
      }
      next = pushLog(next, `Dược lực ${def.name} lan tỏa, tốc độ tu luyện x${fx.mult}.`, 'info')
      break
    }
    case 'breakthroughBonus': {
      if (next.pendingBreakthroughBonus >= fx.bonus) {
        return { ok: false, error: 'Dược lực tương đương đang còn, không nên lãng phí' }
      }
      next = { ...next, pendingBreakthroughBonus: fx.bonus }
      next = pushLog(next, `${def.name} phát huy, lần đột phá kế tiếp +${Math.round(fx.bonus * 100)}%.`, 'info')
      break
    }
    case 'lifespan': {
      next = { ...next, lifespanBonusYears: next.lifespanBonusYears + fx.years }
      next = pushLog(next, `${def.name} kéo dài thọ nguyên thêm ${fx.years} năm.`, 'success')
      break
    }
  }
  return { ok: true, state: next }
}

export const useItem = usePill

/** Convenience for UI: lifespan bonus expressed in days. */
export function getLifespanBonusDays(state: GameState): number {
  return state.lifespanBonusYears * DAYS_PER_YEAR
}
