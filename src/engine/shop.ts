import { ITEM_BY_ID } from '@/content/items'
import { addItems } from './inventory'
import type { ActionResult, GameState } from './types'

export function getBuyPrice(itemId: string, qty: number): number | null {
  const def = ITEM_BY_ID[itemId]
  if (!def || def.price === undefined) return null
  return def.price * qty
}

export function buyItem(state: GameState, itemId: string, qty: number = 1): ActionResult {
  if (!Number.isInteger(qty) || qty <= 0) return { ok: false, error: 'Số lượng không hợp lệ' }
  const price = getBuyPrice(itemId, qty)
  if (price === null) return { ok: false, error: 'Phường thị không bán vật này' }
  if (state.stones < price) return { ok: false, error: 'Không đủ linh thạch' }
  const next = addItems({ ...state, stones: state.stones - price }, { [itemId]: qty })
  return { ok: true, state: next }
}
