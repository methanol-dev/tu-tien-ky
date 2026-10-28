import { LEGACY_BY_ID, type LegacyUpgradeDef } from '@/content/legacy'
import { REALM_INDEX_BY_ID, REALMS } from '@/content/realms'
import { isLifespanExceeded } from './cultivation'
import { pushLog } from './log'
import { createInitialState } from './state'
import type { ActionResult, GameState } from './types'

export function getLegacyLevel(state: GameState, id: string): number {
  return state.legacy.upgrades[id] ?? 0
}

export function getLegacyCost(def: LegacyUpgradeDef, level: number): number {
  return Math.round(def.baseCost * def.costGrowth ** level)
}

/** Đạo Vận this life would yield if reincarnated now. */
export function computeDaoVan(state: GameState): number {
  const best = state.realmIndex
  if (best < REALM_INDEX_BY_ID['truc-co-1']) return 0
  const fromRealm = Math.floor(Math.sqrt(REALMS[best].qiRate))
  const fromBreakthroughs = Math.floor(state.stats.breakthroughs / 3)
  return Math.max(1, fromRealm + fromBreakthroughs)
}

export function canReincarnate(state: GameState): boolean {
  return isLifespanExceeded(state) || computeDaoVan(state) > 0
}

export function isReincarnationForced(state: GameState): boolean {
  return isLifespanExceeded(state)
}

/** Start a new life, carrying legacy forward. */
export function reincarnate(state: GameState, now: number): ActionResult {
  if (!canReincarnate(state)) return { ok: false, error: 'Tu vi còn quá thấp, chuyển thế lúc này chẳng được gì' }
  const gained = computeDaoVan(state)
  const legacy = {
    daoVan: state.legacy.daoVan + gained,
    lives: state.legacy.lives + 1,
    upgrades: state.legacy.upgrades,
    bestRealmIndex: Math.max(state.legacy.bestRealmIndex, state.realmIndex),
  }
  let next = applyLegacyStart({ ...createInitialState(now), legacy })
  if (getLegacyLevel(state, 'tang-bao-cac') > 0) {
    // Only what the soul "wears" crosses over: the equipped pieces, same uids.
    const kept = state.gear.filter((g) => Object.values(state.equipped).includes(g.uid))
    next = { ...next, gear: kept, equipped: { ...state.equipped }, nextGearUid: state.nextGearUid }
  }
  next = pushLog(next, `Kiếp thứ ${legacy.lives}. Nguyên thần mang theo ${gained} Đạo Vận từ kiếp trước.`, 'event')
  return { ok: true, state: next }
}

/** Applies start-of-life legacy effects (realm, stones) to a fresh state. */
export function applyLegacyStart(state: GameState): GameState {
  const startRealm = getLegacyLevel(state, 'tuc-the-ky-uc')
  const startStones = getLegacyLevel(state, 'tien-the-di-san') * (LEGACY_BY_ID['tien-the-di-san'].perLevel)
  return {
    ...state,
    realmIndex: Math.min(startRealm, REALMS.length - 1),
    stones: startStones,
  }
}

export function canBuyLegacy(state: GameState, id: string): boolean {
  const def = LEGACY_BY_ID[id]
  if (!def) return false
  const level = getLegacyLevel(state, id)
  return level < def.maxLevel && state.legacy.daoVan >= getLegacyCost(def, level)
}

export function buyLegacyUpgrade(state: GameState, id: string): ActionResult {
  const def = LEGACY_BY_ID[id]
  if (!def) return { ok: false, error: 'Không có nâng cấp này' }
  const level = getLegacyLevel(state, id)
  if (level >= def.maxLevel) return { ok: false, error: 'Đã đạt tối đa' }
  const cost = getLegacyCost(def, level)
  if (state.legacy.daoVan < cost) return { ok: false, error: 'Không đủ Đạo Vận' }
  let next: GameState = {
    ...state,
    legacy: { ...state.legacy, daoVan: state.legacy.daoVan - cost, upgrades: { ...state.legacy.upgrades, [id]: level + 1 } },
  }
  next = pushLog(next, `Đạo Vận ngưng tụ: ${def.name} tầng ${level + 1}. Hiệu lực từ kiếp sau (trừ linh căn và đạo tâm có tác dụng ngay).`, 'success')
  return { ok: true, state: next }
}
