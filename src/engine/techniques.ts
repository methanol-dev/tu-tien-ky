import { TECHNIQUE_BY_ID, type TechniqueDef } from '@/content/techniques'
import { pushLog } from './log'
import type { ActionResult, GameState } from './types'

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

export function upgradeTechnique(state: GameState, id: string): ActionResult {
  const def = TECHNIQUE_BY_ID[id]
  if (!def) return { ok: false, error: 'Công pháp không tồn tại' }
  if (!isTechniqueUnlocked(state, def)) return { ok: false, error: 'Cảnh giới chưa đủ để lĩnh ngộ' }
  const level = getTechniqueLevel(state, id)
  if (level >= def.maxLevel) return { ok: false, error: 'Công pháp đã viên mãn' }
  const cost = getTechniqueCost(def, level)
  if (state.stones < cost) return { ok: false, error: 'Không đủ linh thạch' }
  let next: GameState = {
    ...state,
    stones: state.stones - cost,
    techniques: { ...state.techniques, [id]: level + 1 },
  }
  next = pushLog(
    next,
    level === 0 ? `Lĩnh ngộ ${def.name}.` : `${def.name} tiến lên tầng ${level + 1}.`,
    'success',
  )
  return { ok: true, state: next }
}
