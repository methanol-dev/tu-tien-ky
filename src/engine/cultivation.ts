import { REALMS, type RealmStage } from '@/content/realms'
import { MARTIAL_STAGES, type MartialStage } from '@/content/martialRealms'
import {
  BREAKTHROUGH_STONE_SECONDS,
  DAYS_PER_YEAR,
  FAIL_PENALTY_MAX,
  FAIL_PENALTY_MIN,
  MAX_BREAKTHROUGH_CHANCE,
  STONE_RATE_EXPONENT,
  STONE_RATE_FACTOR,
} from './constants'
import { pushLog } from './log'
import { getModifiers } from './modifiers'
import { startTribulation } from './tribulation'
import type { GameState, Rng } from './types'

/** Map 11 cảnh giới Võ Đạo sang realmIndex tương đương để mở khóa vùng đất tự nhiên */
export const MARTIAL_REALM_INDEX_EQUIV: readonly number[] = [
  0,  // Nê Phôi Cảnh -> Đồng Bì (realmIndex: 0)
  3,  // Mộc Thai Cảnh -> Thảo Căn (realmIndex: 3)
  6,  // Thủy Ngân Cảnh -> Liễu Cân (realmIndex: 6)
  9,  // Anh Hồn Cảnh -> Khí Cốt (realmIndex: 9)
  12, // Hùng Phách Cảnh -> Trúc Thể (realmIndex: 12)
  15, // Võ Đảm Cảnh -> Động Phủ (realmIndex: 15)
  21, // Kim Thân Cảnh -> Kim Đan (realmIndex: 21)
  24, // Viễn Du Cảnh -> Nguyên Anh (realmIndex: 24)
  27, // Sơn Điên Cảnh -> Ngọc Phác (realmIndex: 27)
  30, // Chỉ Cảnh -> Tiên Nhân (realmIndex: 30)
  39, // Võ Thần Cảnh -> Thập Ngũ Cảnh (realmIndex: 39)
]

export function getRealm(state: GameState): RealmStage {
  return REALMS[Math.min(state.realmIndex, REALMS.length - 1)]
}

export function getNextRealm(state: GameState): RealmStage | null {
  return REALMS[state.realmIndex + 1] ?? null
}

export function getMartialStageInfo(state: GameState): {
  current: MartialStage
  next: MartialStage | null
  index: number
} {
  const index = Math.min(state.martialStageIndex ?? 0, MARTIAL_STAGES.length - 1)
  const current = MARTIAL_STAGES[index]
  const next = index < MARTIAL_STAGES.length - 1 ? MARTIAL_STAGES[index + 1] : null
  return { current, next, index }
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
  if (state.cultivationPath === 'martial') {
    // Võ phu dựa vào khổ luyện, đạt số quyền là đột phá 100%, không bị ảnh hưởng thiên đạo trừng phạt
    return 1.0
  }
  const realm = getRealm(state)
  if (realm.terminal) return 0
  if (realm.breakthroughChance >= 1) return 1
  return Math.min(
    MAX_BREAKTHROUGH_CHANCE,
    realm.breakthroughChance + getModifiers(state).breakthroughBonus + state.pendingBreakthroughBonus,
  )
}

export function getBreakthroughProgress(state: GameState): number {
  if (state.cultivationPath === 'martial') {
    const { current, next } = getMartialStageInfo(state)
    if (!next) return 1
    const needed = next.minPunches - current.minPunches
    if (needed <= 0) return 1
    const progress = state.punches - current.minPunches
    return Math.max(0, Math.min(1, progress / needed))
  }
  const req = getRealm(state).qiRequired
  if (req <= 0) return 1
  return Math.min(1, state.qi / req)
}

export function canBreakthrough(state: GameState): boolean {
  if (state.cultivationPath === 'martial') {
    const { next } = getMartialStageInfo(state)
    return next !== null && state.punches >= next.minPunches
  }
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

  if (state.cultivationPath === 'martial') {
    const { current, next: toStage, index } = getMartialStageInfo(state)
    if (!toStage || !canBreakthrough(state)) {
      return { state, success: false, from, to: null, qiLost: 0, stonesGained: 0, tribulation: false }
    }

    const nextIdx = index + 1
    const equivRealmIdx = MARTIAL_REALM_INDEX_EQUIV[nextIdx] ?? state.realmIndex
    const stonesGained = (nextIdx + 1) * 200

    let next: GameState = {
      ...state,
      martialStageIndex: nextIdx,
      realmIndex: Math.max(state.realmIndex, equivRealmIdx),
      stones: state.stones + stonesGained,
      stats: {
        ...state.stats,
        breakthroughs: state.stats.breakthroughs + 1,
        stonesTotal: state.stats.stonesTotal + stonesGained,
      },
    }

    next = pushLog(
      next,
      `Hám Sơn Quyền Ý bùng nổ! Đột phá từ ${current.name} tiến vào ${toStage.name}! Nhặt được ${stonesGained} linh thạch.`,
      'success',
    )

    return {
      state: next,
      success: true,
      from,
      to: REALMS[equivRealmIdx] ?? from,
      qiLost: 0,
      stonesGained,
      tribulation: false,
    }
  }

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
    const stonesGained = Math.round(
      Math.pow(Math.max(0, from.qiRate), STONE_RATE_EXPONENT) * STONE_RATE_FACTOR * mods.stoneRateMult * BREAKTHROUGH_STONE_SECONDS,
    )
    let next: GameState = {
      ...base,
      realmIndex: state.realmIndex + 1,
      qi: 0,
      stones: state.stones + stonesGained,
      forge: state.forge ? { ...state.forge, fireCount: state.forge.fireCount + 20 } : state.forge,
      stats: {
        ...state.stats,
        breakthroughs: state.stats.breakthroughs + 1,
        stonesTotal: state.stats.stonesTotal + stonesGained,
      },
    }
    next = pushLog(next, `Đột phá thành công! Tiến vào ${to.name}. Nhặt được ${stonesGained} linh thạch và 20 Chân Hỏa.`, 'success')
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

/** Active play: a tap grants a burst of qi (or punches for martial artists). */
export function meditate(state: GameState): GameState {
  if (state.cultivationPath === 'martial') {
    const gain = Math.max(1, Math.round(1 * getModifiers(state).meditateSeconds))
    return {
      ...state,
      punches: state.punches + gain,
    }
  }
  const gain = getQiRate(state) * getModifiers(state).meditateSeconds
  if (gain <= 0) return state
  return {
    ...state,
    qi: state.qi + gain,
    stats: { ...state.stats, qiTotal: state.stats.qiTotal + gain },
  }
}
