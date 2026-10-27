import type { GameState } from './types'

export const SAVE_VERSION = 1
export const LOG_LIMIT = 100
export const DAYS_PER_YEAR = 360
export const STARTING_AGE_YEARS = 16

export function createInitialState(now: number = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    createdAt: now,
    lastSavedAt: now,
    playedMs: 0,
    realmIndex: 0,
    qi: 0,
    ageDays: STARTING_AGE_YEARS * DAYS_PER_YEAR,
    nextLogId: 1,
    log: [],
    stats: { breakthroughs: 0, breakthroughFailures: 0, qiTotal: 0 },
    settings: { timeScale: 1 },
  }
}
