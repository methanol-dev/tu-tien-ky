import { TECHNIQUE_BY_ID, type TechniqueDef } from '@/content/techniques'
import { pushLog } from './log'
import type { ActionResult, GameState } from './types'

export interface MilestoneBonus {
  level: number
  mult: number
  label: string
}

export const TECHNIQUE_MILESTONES: readonly MilestoneBonus[] = [
  { level: 5, mult: 2, label: 'Tiểu Thành' },
  { level: 10, mult: 3, label: 'Đại Thành' },
  { level: 25, mult: 5, label: 'Viên Mãn' },
  { level: 50, mult: 10, label: 'Xuất Thần' },
  { level: 100, mult: 50, label: 'Đăng Phong' },
]

export function getTechniqueLevel(state: GameState, id: string): number {
  return state.techniques[id] ?? 0
}

/** Cost in spirit stones to go from the current level to the next. */
export function getTechniqueCost(def: TechniqueDef, currentLevel: number): number {
  return Math.round(def.baseCost * def.costGrowth ** currentLevel)
}

export function isTechniqueUnlocked(state: GameState, def: TechniqueDef): boolean {
  return state.realmIndex >= def.minRealmIndex
}

export function canUpgradeTechnique(state: GameState, id: string): boolean {
  const def = TECHNIQUE_BY_ID[id]
  if (!def || !isTechniqueUnlocked(state, def)) return false
  const level = getTechniqueLevel(state, id)
  return level < def.maxLevel && state.stones >= getTechniqueCost(def, level)
}

/** Returns the cumulative milestone multiplier for a given level. */
export function getTechniqueMilestoneMultiplier(level: number): number {
  let mult = 1
  for (const m of TECHNIQUE_MILESTONES) {
    if (level >= m.level) {
      mult *= m.mult
    }
  }
  return mult
}

/** Returns the next milestone for a given level, or null if beyond the highest milestone. */
export function getNextTechniqueMilestone(level: number): MilestoneBonus | null {
  for (const m of TECHNIQUE_MILESTONES) {
    if (level < m.level) {
      return m
    }
  }
  return null
}

/** Returns the current achieved milestone, or null if below level 5. */
export function getCurrentTechniqueMilestone(level: number): MilestoneBonus | null {
  let current: MilestoneBonus | null = null
  for (const m of TECHNIQUE_MILESTONES) {
    if (level >= m.level) {
      current = m
    }
  }
  return current
}

/** Computes the effective value provided by the technique at the given level including milestone multipliers. */
export function getTechniqueEffectiveValue(def: TechniqueDef, level: number): number {
  if (level <= 0) return 0
  const milestoneMult = getTechniqueMilestoneMultiplier(level)
  const baseValue = def.perLevel * level
  if (def.effect === 'failPenaltyMult') {
    return Math.min(0.95, baseValue * milestoneMult)
  }
  return baseValue * milestoneMult
}

export function upgradeTechnique(state: GameState, id: string): ActionResult {
  const def = TECHNIQUE_BY_ID[id]
  if (!def) return { ok: false, error: 'Công pháp không tồn tại' }
  if (!isTechniqueUnlocked(state, def)) return { ok: false, error: 'Cảnh giới chưa đủ để lĩnh ngộ' }
  const level = getTechniqueLevel(state, id)
  if (level >= def.maxLevel) return { ok: false, error: 'Công pháp đã viên mãn' }
  const cost = getTechniqueCost(def, level)
  if (state.stones < cost) return { ok: false, error: 'Không đủ linh thạch' }

  const nextLevel = level + 1
  const prevMult = getTechniqueMilestoneMultiplier(level)
  const nextMult = getTechniqueMilestoneMultiplier(nextLevel)
  const hitMilestone = nextMult > prevMult ? getCurrentTechniqueMilestone(nextLevel) : null

  let next: GameState = {
    ...state,
    stones: state.stones - cost,
    techniques: { ...state.techniques, [id]: nextLevel },
  }

  let logMsg: string
  if (level === 0) {
    logMsg = `Lĩnh ngộ ${def.name}.`
  } else if (hitMilestone) {
    logMsg = `⚡ ${def.name} đột phá mốc ${hitMilestone.label} (tầng ${nextLevel})! Hiệu quả bùng nổ x${hitMilestone.mult} (Tổng x${nextMult})!`
  } else {
    logMsg = `${def.name} tiến lên tầng ${nextLevel}.`
  }

  next = pushLog(
    next,
    logMsg,
    hitMilestone ? 'event' : 'success',
  )
  return { ok: true, state: next }
}
