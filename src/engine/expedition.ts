import { DUNGEON_BY_ID, type DungeonDef } from '@/content/dungeons'
import { ITEM_BY_ID } from '@/content/items'
import { type CombatReport, getCombatStats, simulateCombat } from './combat'
import { EXPEDITION_DEFEAT_QI_LOSS, EXPEDITION_INJURY_MS, EXPEDITION_INJURY_MULT } from './constants'
import { getStoneRate } from './economy'
import { addItems } from './inventory'
import { pushLog } from './log'
import type { ActionResult, GameState, Rng } from './types'

export function isDungeonUnlocked(state: GameState, d: DungeonDef): boolean {
  return state.realmIndex >= d.minRealmIndex
}

export function canStartExpedition(state: GameState, dungeonId: string): boolean {
  const d = DUNGEON_BY_ID[dungeonId]
  return Boolean(d && state.expedition === null && isDungeonUnlocked(state, d))
}

export function startExpedition(state: GameState, dungeonId: string): ActionResult {
  const d = DUNGEON_BY_ID[dungeonId]
  if (!d) return { ok: false, error: 'Bí cảnh không tồn tại' }
  if (state.expedition) return { ok: false, error: 'Đang trong một chuyến thám hiểm khác' }
  if (!isDungeonUnlocked(state, d)) return { ok: false, error: 'Cảnh giới chưa đủ để vào bí cảnh này' }
  let next: GameState = {
    ...state,
    expedition: { dungeonId, startedAtMs: state.playedMs, finishAtMs: state.playedMs + d.durationMs },
  }
  next = pushLog(next, `Lên đường tới ${d.name}.`, 'info')
  return { ok: true, state: next }
}

export function isExpeditionReady(state: GameState): boolean {
  return state.expedition !== null && state.playedMs >= state.expedition.finishAtMs
}

export function getExpeditionProgress(state: GameState): number {
  const j = state.expedition
  if (!j) return 0
  const total = j.finishAtMs - j.startedAtMs
  return total <= 0 ? 1 : Math.min(1, (state.playedMs - j.startedAtMs) / total)
}

export interface ExpeditionReport {
  dungeon: DungeonDef
  combat: CombatReport
  loot: Record<string, number>
  stones: number
  treasure: string | null
}

export function rollLoot(d: DungeonDef, rng: Rng): Record<string, number> {
  const out: Record<string, number> = {}
  for (const e of d.loot) {
    if (rng() >= e.chance) continue
    const n = e.min + Math.floor(rng() * (e.max - e.min + 1))
    if (n > 0) out[e.itemId] = (out[e.itemId] ?? 0) + n
  }
  return out
}

/** Resolve a finished expedition: run combat, hand out loot or apply defeat penalties. */
export function completeExpedition(state: GameState, rng: Rng): ActionResult<{ state: GameState; report: ExpeditionReport }> {
  if (!state.expedition) return { ok: false, error: 'Không có chuyến thám hiểm nào' }
  if (!isExpeditionReady(state)) return { ok: false, error: 'Chưa tới nơi' }
  const d = DUNGEON_BY_ID[state.expedition.dungeonId]
  if (!d) {
    return { ok: true, state: { state: { ...state, expedition: null }, report: { dungeon: { ...DUNGEON_BY_ID[Object.keys(DUNGEON_BY_ID)[0]] }, combat: { victory: false, playerMax: 0, playerHpLeft: 0, waves: [], log: [] }, loot: {}, stones: 0, treasure: null } } }
  }

  const combat = simulateCombat(getCombatStats(state), d.enemies, rng)
  let next: GameState = { ...state, expedition: null, stats: { ...state.stats, expeditions: state.stats.expeditions + 1 } }
  let loot: Record<string, number> = {}
  let stones = 0
  let treasure: string | null = null

  if (combat.victory) {
    loot = rollLoot(d, rng)
    stones = Math.round(getStoneRate(state) * d.stonesSeconds)
    if (d.bossLoot && rng() < d.bossLoot.chance) treasure = d.bossLoot.itemId
    next = addItems(next, loot)
    if (treasure) next = addItems(next, { [treasure]: 1 })
    next = {
      ...next,
      stones: next.stones + stones,
      stats: { ...next.stats, stonesTotal: next.stats.stonesTotal + stones, expeditionWins: next.stats.expeditionWins + 1 },
    }
    const summary = Object.entries(loot).map(([id, n]) => `${n} ${ITEM_BY_ID[id]?.name ?? id}`).join(', ')
    next = pushLog(next, `Quét sạch ${d.name}! Thu được ${stones} linh thạch${summary ? `, ${summary}` : ''}.`, 'success')
    if (treasure) next = pushLog(next, `Boss rơi pháp bảo: ${ITEM_BY_ID[treasure]?.name ?? treasure}!`, 'success')
  } else {
    const others = next.buffs.filter((b) => b.id !== 'trong-thuong' && b.expiresAtMs > next.playedMs)
    next = {
      ...next,
      qi: next.qi * (1 - EXPEDITION_DEFEAT_QI_LOSS),
      buffs: [...others, { id: 'trong-thuong', name: 'Trọng thương', qiRateMult: EXPEDITION_INJURY_MULT, expiresAtMs: next.playedMs + EXPEDITION_INJURY_MS }],
    }
    const fallen = combat.waves.at(-1)?.enemy ?? '?'
    next = pushLog(next, `Bại trận tại ${d.name} dưới tay ${fallen}. Ngươi lết về động phủ, trọng thương.`, 'danger')
  }

  return { ok: true, state: { state: next, report: { dungeon: d, combat, loot, stones, treasure } } }
}
