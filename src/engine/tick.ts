import { getQiRate } from './cultivation'
import type { GameState } from './types'

/**
 * Advance the simulation by `dtMs` real milliseconds. Pure; returns a new state.
 * No clamping here: the live loop decides how big a step it is willing to take,
 * and offline progress calls this once with the (capped) elapsed time.
 */
export function tick(state: GameState, dtMs: number): GameState {
  if (dtMs <= 0) return state
  const dtSec = dtMs / 1000
  const qiGain = getQiRate(state) * dtSec
  return {
    ...state,
    qi: state.qi + qiGain,
    ageDays: state.ageDays + dtSec * state.settings.timeScale,
    playedMs: state.playedMs + dtMs,
    stats: { ...state.stats, qiTotal: state.stats.qiTotal + qiGain },
  }
}
