import { REALMS, type RealmStage } from '@/content/realms'
import { pushLog } from './log'
import { DAYS_PER_YEAR } from './state'
import type { GameState, Rng } from './types'

export const FAIL_PENALTY_MIN = 0.1
export const FAIL_PENALTY_MAX = 0.3

export function getRealm(state: GameState): RealmStage {
  return REALMS[Math.min(state.realmIndex, REALMS.length - 1)]
}

export function getNextRealm(state: GameState): RealmStage | null {
  return REALMS[state.realmIndex + 1] ?? null
}

export function getLifespanDays(state: GameState): number {
  return getRealm(state).lifespanYears * DAYS_PER_YEAR
}

export function isLifespanExceeded(state: GameState): boolean {
  return state.ageDays >= getLifespanDays(state)
}

/** Qi per real second. Multipliers from techniques/items plug in here (Phase 3). */
export function getQiRate(state: GameState): number {
  if (isLifespanExceeded(state)) return 0
  return getRealm(state).qiRate
}

export function getBreakthroughProgress(state: GameState): number {
  const req = getRealm(state).qiRequired
  if (req <= 0) return 1
  return Math.min(1, state.qi / req)
}

export function canBreakthrough(state: GameState): boolean {
  const realm = getRealm(state)
  return !realm.terminal && state.qi >= realm.qiRequired
}

export interface BreakthroughResult {
  state: GameState
  success: boolean
  from: RealmStage
  to: RealmStage | null
  qiLost: number
}

export function attemptBreakthrough(state: GameState, rng: Rng): BreakthroughResult {
  const from = getRealm(state)
  if (!canBreakthrough(state)) {
    return { state, success: false, from, to: null, qiLost: 0 }
  }
  const to = REALMS[state.realmIndex + 1]
  const roll = rng()
  if (roll < from.breakthroughChance) {
    let next: GameState = {
      ...state,
      realmIndex: state.realmIndex + 1,
      qi: 0,
      stats: { ...state.stats, breakthroughs: state.stats.breakthroughs + 1 },
    }
    next = pushLog(next, `Đột phá thành công! Tiến vào ${to.name}.`, 'success')
    if (to.firstOfMajor) {
      next = pushLog(next, `Thọ nguyên tăng lên ${to.lifespanYears} năm.`, 'info')
    }
    return { state: next, success: true, from, to, qiLost: 0 }
  }
  const penalty = FAIL_PENALTY_MIN + rng() * (FAIL_PENALTY_MAX - FAIL_PENALTY_MIN)
  const qiLost = state.qi * penalty
  let next: GameState = {
    ...state,
    qi: state.qi - qiLost,
    stats: { ...state.stats, breakthroughFailures: state.stats.breakthroughFailures + 1 },
  }
  next = pushLog(
    next,
    `Đột phá thất bại, linh khí tản mất ${Math.round(penalty * 100)}%. Cần tĩnh tâm tu luyện lại.`,
    'danger',
  )
  return { state: next, success: false, from, to: null, qiLost }
}
