import { REALMS, type RealmStage } from '@/content/realms'
import {
  BREAKTHROUGH_STONE_SECONDS,
  DAYS_PER_YEAR,
  FAIL_PENALTY_MAX,
  FAIL_PENALTY_MIN,
  MAX_BREAKTHROUGH_CHANCE,
  STONE_RATE_FACTOR,
} from './constants'
import { pushLog } from './log'
import { getModifiers } from './modifiers'
import { startTribulation } from './tribulation'
import type { GameState, Rng } from './types'

export function getRealm(state: GameState): RealmStage {
  return REALMS[Math.min(state.realmIndex, REALMS.length - 1)]
}

export function getNextRealm(state: GameState): RealmStage | null {
  return REALMS[state.realmIndex + 1] ?? null
}

export function getLifespanDays(state: GameState): number {
  return (getRealm(state).lifespanYears + state.lifespanBonusYears + getModifiers(state).lifespanBonusYears) * DAYS_PER_YEAR
}

export function isLifespanExceeded(state: GameState): boolean {
  return state.ageDays >= getLifespanDays(state)
}

/** Qi per real second after techniques and buffs. */
export function getQiRate(state: GameState): number {
  if (isLifespanExceeded(state)) return 0
  return getRealm(state).qiRate * getModifiers(state).qiRateMult
}

/** Effective success chance for the next attempt, including techniques and pending pill bonus. */
export function getBreakthroughChance(state: GameState): number {
  const realm = getRealm(state)
  if (realm.terminal) return 0
  if (realm.breakthroughChance >= 1) return 1
  return Math.min(
    MAX_BREAKTHROUGH_CHANCE,
    realm.breakthroughChance + getModifiers(state).breakthroughBonus + state.pendingBreakthroughBonus,
  )
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
  stonesGained: number
  /** True when a heavenly tribulation started instead of a plain roll. */
  tribulation: boolean
}

export function attemptBreakthrough(state: GameState, rng: Rng): BreakthroughResult {
  const from = getRealm(state)
  if (!canBreakthrough(state)) {
    return { state, success: false, from, to: null, qiLost: 0, stonesGained: 0, tribulation: false }
  }
  const to = REALMS[state.realmIndex + 1]
  if (from.tribulation) {
    return { state: startTribulation(state, to), success: false, from, to, qiLost: 0, stonesGained: 0, tribulation: true }
  }
  const chance = getBreakthroughChance(state)
  const mods = getModifiers(state)
  const roll = rng()
  // The pill bonus is spent whether or not the attempt succeeds.
  const base: GameState = { ...state, pendingBreakthroughBonus: 0 }

  if (roll < chance) {
    const stonesGained = Math.round(Math.sqrt(from.qiRate) * STONE_RATE_FACTOR * mods.stoneRateMult * BREAKTHROUGH_STONE_SECONDS)
    let next: GameState = {
      ...base,
      realmIndex: state.realmIndex + 1,
      qi: 0,
      stones: state.stones + stonesGained,
      stats: {
        ...state.stats,
        breakthroughs: state.stats.breakthroughs + 1,
        stonesTotal: state.stats.stonesTotal + stonesGained,
      },
    }
    next = pushLog(next, `Đột phá thành công! Tiến vào ${to.name}. Nhặt được ${stonesGained} linh thạch.`, 'success')
    if (to.firstOfMajor) {
      next = pushLog(next, `Thọ nguyên tăng lên ${to.lifespanYears} năm.`, 'info')
    }
    return { state: next, success: true, from, to, qiLost: 0, stonesGained, tribulation: false }
  }

  const penalty = (FAIL_PENALTY_MIN + rng() * (FAIL_PENALTY_MAX - FAIL_PENALTY_MIN)) * mods.failPenaltyMult
  const qiLost = state.qi * penalty
  let next: GameState = {
    ...base,
    qi: state.qi - qiLost,
    stats: { ...state.stats, breakthroughFailures: state.stats.breakthroughFailures + 1 },
  }
  next = pushLog(
    next,
    `Đột phá thất bại, linh khí tản mất ${Math.round(penalty * 100)}%. Cần tĩnh tâm tu luyện lại.`,
    'danger',
  )
  return { state: next, success: false, from, to: null, qiLost, stonesGained: 0, tribulation: false }
}

/** Active play: a tap grants a burst of qi so early game is not pure waiting. */
export function meditate(state: GameState): GameState {
  const gain = getQiRate(state) * getModifiers(state).meditateSeconds
  if (gain <= 0) return state
  return {
    ...state,
    qi: state.qi + gain,
    stats: { ...state.stats, qiTotal: state.stats.qiTotal + gain },
  }
}
