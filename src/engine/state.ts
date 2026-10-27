import { DAYS_PER_YEAR, SAVE_VERSION, STARTING_AGE_YEARS } from './constants'
import type { GameState } from './types'

export function createInitialState(now: number = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    createdAt: now,
    lastSavedAt: now,
    playedMs: 0,
    realmIndex: 0,
    qi: 0,
    ageDays: STARTING_AGE_YEARS * DAYS_PER_YEAR,
    lifespanBonusYears: 0,
    stones: 0,
    techniques: {},
    inventory: {},
    buffs: [],
    pendingBreakthroughBonus: 0,
    alchemy: null,
    gatherReadyAtMs: 0,
    nextLogId: 1,
    log: [],
    stats: {
      breakthroughs: 0,
      breakthroughFailures: 0,
      qiTotal: 0,
      stonesTotal: 0,
      pillsUsed: 0,
      alchemyCrafted: 0,
    },
    settings: { timeScale: 1 },
  }
}
