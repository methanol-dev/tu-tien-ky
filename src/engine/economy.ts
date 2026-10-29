import { STONE_RATE_EXPONENT, STONE_RATE_FACTOR } from './constants'
import { getRealm, isLifespanExceeded } from './cultivation'
import { getModifiers } from './modifiers'
import type { GameState } from './types'

/** Spirit stones per real second. */
export function getStoneRate(state: GameState): number {
  if (isLifespanExceeded(state)) return 0
  const baseQi = Math.max(0, getRealm(state).qiRate)
  return Math.pow(baseQi, STONE_RATE_EXPONENT) * STONE_RATE_FACTOR * getModifiers(state).stoneRateMult
}

export function addStones(state: GameState, amount: number): GameState {
  if (amount <= 0) return state
  return {
    ...state,
    stones: state.stones + amount,
    stats: { ...state.stats, stonesTotal: state.stats.stonesTotal + amount },
  }
}
