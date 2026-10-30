import { simulateAbodeTick } from './abode'
import { getQiRate } from './cultivation'
import { getStoneRate } from './economy'
import type { GameState, Rng } from './types'

/**
 * Advance the simulation by `dtMs` real milliseconds. Pure; returns a new state.
 * No clamping here: the live loop decides how big a step it is willing to take,
 * and offline progress calls this once with the (capped) elapsed time.
 * Rates are evaluated at the start of the step (buffs that expire mid-step still
 * count for the whole step; acceptable for sub-second live ticks, and offline
 * progress is deliberately generous).
 */
export function tick(state: GameState, dtMs: number, rng: Rng = Math.random): GameState {
  if (dtMs <= 0) return state
  // Optional: the world holds its breath while a decision is pending.
  if (state.pendingEvent && state.settings.pauseOnEvent) return state
  const dtSec = dtMs / 1000
  const qiGain = getQiRate(state) * dtSec
  const stoneGain = getStoneRate(state) * dtSec
  const playedMs = state.playedMs + dtMs
  const buffs = state.buffs.some((b) => b.expiresAtMs <= playedMs)
    ? state.buffs.filter((b) => b.expiresAtMs > playedMs)
    : state.buffs
  const next: GameState = {
    ...state,
    qi: state.qi + qiGain,
    stones: state.stones + stoneGain,
    ageDays: state.ageDays + dtSec * state.settings.timeScale,
    playedMs,
    buffs,
    stats: {
      ...state.stats,
      qiTotal: state.stats.qiTotal + qiGain,
      stonesTotal: state.stats.stonesTotal + stoneGain,
    },
  }
  return simulateAbodeTick(next, rng)
}
