import type { GameState } from './types'

export function getItemCount(state: GameState, itemId: string): number {
  return state.inventory[itemId] ?? 0
}

export function addItems(state: GameState, items: Record<string, number>): GameState {
  const inventory = { ...state.inventory }
  for (const [id, n] of Object.entries(items)) {
    if (n <= 0) continue
    inventory[id] = (inventory[id] ?? 0) + n
  }
  return { ...state, inventory }
}

export function hasItems(state: GameState, items: Record<string, number>): boolean {
  return Object.entries(items).every(([id, n]) => getItemCount(state, id) >= n)
}

/** Caller must check `hasItems` first; this never goes negative. */
export function removeItems(state: GameState, items: Record<string, number>): GameState {
  const inventory = { ...state.inventory }
  for (const [id, n] of Object.entries(items)) {
    const left = (inventory[id] ?? 0) - n
    if (left > 0) inventory[id] = left
    else delete inventory[id]
  }
  return { ...state, inventory }
}
