import { HERBS, type ItemDef } from '@/content/items'
import { GATHER_COOLDOWN_MS, GATHER_MAX_COUNT, GATHER_MIN_COUNT } from './constants'
import { addItems } from './inventory'
import { pushLog } from './log'
import type { ActionResult, GameState, Rng } from './types'

export function getGatherCooldownMs(state: GameState): number {
  return Math.max(0, state.gatherReadyAtMs - state.playedMs)
}

export function canGather(state: GameState): boolean {
  return getGatherCooldownMs(state) === 0
}

export function getGatherableHerbs(state: GameState): ItemDef[] {
  return HERBS.filter((h) => h.minRealmIndex <= state.realmIndex)
}

/** Lower tiers are exponentially more common: weights 8,4,2,1 for 4 available tiers. */
export function pickHerb(available: ItemDef[], roll: number): ItemDef {
  const n = available.length
  const total = 2 ** n - 1
  let acc = 0
  for (let i = 0; i < n; i++) {
    acc += 2 ** (n - 1 - i)
    if (roll * total < acc) return available[i]
  }
  return available[n - 1]
}

export interface GatherResult {
  state: GameState
  gained: Record<string, number>
}

export function gather(state: GameState, rng: Rng): ActionResult<GatherResult> {
  if (!canGather(state)) return { ok: false, error: 'Dược viên chưa mọc lại' }
  const available = getGatherableHerbs(state)
  if (available.length === 0) return { ok: false, error: 'Không có dược liệu ở đây' }

  const count = GATHER_MIN_COUNT + Math.floor(rng() * (GATHER_MAX_COUNT - GATHER_MIN_COUNT + 1))
  const gained: Record<string, number> = {}
  for (let i = 0; i < count; i++) {
    const herb = pickHerb(available, rng())
    gained[herb.id] = (gained[herb.id] ?? 0) + 1
  }
  let next = addItems(state, gained)
  next = { ...next, gatherReadyAtMs: next.playedMs + GATHER_COOLDOWN_MS }
  const summary = Object.entries(gained)
    .map(([id, n]) => `${n} ${available.find((h) => h.id === id)?.name ?? id}`)
    .join(', ')
  next = pushLog(next, `Hái thuốc quanh động phủ, thu được ${summary}.`, 'info')
  return { ok: true, state: { state: next, gained } }
}
