import { ITEM_BY_ID } from '@/content/items'
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
  if (!def || def.kind !== 'pill' || !def.effect) return { ok: false, error: 'Vật phẩm không dùng được' }
  if (getItemCount(state, itemId) <= 0) return { ok: false, error: `Không còn ${def.name}` }

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

/** Convenience for UI: lifespan bonus expressed in days. */
export function getLifespanBonusDays(state: GameState): number {
  return state.lifespanBonusYears * DAYS_PER_YEAR
}
