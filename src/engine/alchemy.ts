import { ITEM_BY_ID } from '@/content/items'
import { RECIPE_BY_ID, type RecipeDef } from '@/content/recipes'
import { addItems, hasItems, removeItems } from './inventory'
import { pushLog } from './log'
import { addWeeklyEventPoints } from './retention'
import type { ActionResult, GameState, Rng } from './types'

export function isRecipeUnlocked(state: GameState, recipe: RecipeDef): boolean {
  return state.realmIndex >= recipe.minRealmIndex
}

export function canStartAlchemy(state: GameState, recipeId: string): boolean {
  const recipe = RECIPE_BY_ID[recipeId]
  return Boolean(
    recipe &&
      state.alchemy === null &&
      isRecipeUnlocked(state, recipe) &&
      state.stones >= recipe.stones &&
      hasItems(state, recipe.ingredients),
  )
}

export function startAlchemy(state: GameState, recipeId: string): ActionResult {
  const recipe = RECIPE_BY_ID[recipeId]
  if (!recipe) return { ok: false, error: 'Đan phương không tồn tại' }
  if (state.alchemy) return { ok: false, error: 'Đan lô đang bận' }
  if (!isRecipeUnlocked(state, recipe)) return { ok: false, error: 'Cảnh giới chưa đủ' }
  if (state.stones < recipe.stones) return { ok: false, error: 'Không đủ linh thạch' }
  if (!hasItems(state, recipe.ingredients)) return { ok: false, error: 'Thiếu dược liệu' }

  let next = removeItems(state, recipe.ingredients)
  next = {
    ...next,
    stones: next.stones - recipe.stones,
    alchemy: { recipeId, startedAtMs: next.playedMs, finishAtMs: next.playedMs + recipe.durationMs },
  }
  next = pushLog(next, `Nhóm lửa đan lô, bắt đầu ${recipe.name.toLowerCase()}.`, 'info')
  return { ok: true, state: next }
}

export function isAlchemyReady(state: GameState): boolean {
  return state.alchemy !== null && state.playedMs >= state.alchemy.finishAtMs
}

export function getAlchemyProgress(state: GameState): number {
  const job = state.alchemy
  if (!job) return 0
  const total = job.finishAtMs - job.startedAtMs
  if (total <= 0) return 1
  return Math.min(1, (state.playedMs - job.startedAtMs) / total)
}

export interface AlchemyResult {
  state: GameState
  success: boolean
  recipe: RecipeDef
}

export function collectAlchemy(state: GameState, rng: Rng): ActionResult<AlchemyResult> {
  if (!state.alchemy) return { ok: false, error: 'Đan lô đang trống' }
  if (!isAlchemyReady(state)) return { ok: false, error: 'Đan chưa thành' }
  const recipe = RECIPE_BY_ID[state.alchemy.recipeId]
  if (!recipe) return { ok: false, error: 'Đan phương hỏng' }
  const output = ITEM_BY_ID[recipe.output]
  const success = rng() < recipe.successChance
  let next: GameState = { ...state, alchemy: null }
  if (success) {
    next = addItems(next, { [recipe.output]: 1 })
    next = { ...next, stats: { ...next.stats, alchemyCrafted: next.stats.alchemyCrafted + 1 } }
    next = addWeeklyEventPoints(next, 2, 40)
    next = pushLog(next, `Đan thành! Thu được 1 ${output?.name ?? recipe.output}.`, 'success')
  } else {
    next = pushLog(next, `Lửa quá mạnh, đan lô nổ. ${recipe.name} thất bại.`, 'danger')
  }
  return { ok: true, state: { state: next, success, recipe } }
}
