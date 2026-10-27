import { STONE_RATE_FACTOR } from './constants'
import { getRealm, isLifespanExceeded } from './cultivation'
import { getModifiers } from './modifiers'
import type { GameState } from './types'

/** Spirit stones per real second. */
export function getStoneRate(state: GameState): number {
  if (isLifespanExceeded(state)) return 0
  return getRealm(state).qiRate * STONE_RATE_FACTOR * getModifiers(state).stoneRateMult
}

export function addStones(state: GameState, amount: number): GameState {
  if (amount <= 0) return state
  return {
    ...state,
    stones: state.stones + amount,
    stats: { ...state.stats, stonesTotal: state.stats.stonesTotal + amount },
  }
}
