import { journeyTick } from './journey'
import { pushLog } from './log'
import { getModifiers } from './modifiers'
import { defaultRng } from './rng'
import { tick } from './tick'
import type { GameState, Rng } from './types'

/** Below this the UI should not bother showing an offline summary. */
export const MIN_OFFLINE_REPORT_MS = 60 * 1000

export interface OfflineReport {
  elapsedMs: number
  appliedMs: number
  capped: boolean
  qiGained: number
  stonesGained: number
  daysPassed: number
  stagesCleared: number
  chestsGained: number
  deaths: number
  fireGained: number
}

export function applyOfflineProgress(
  state: GameState,
  now: number,
  capMs: number = getModifiers(state).offlineCapMs,
  rng: Rng = defaultRng,
): { state: GameState; report: OfflineReport } {
  const elapsedMs = Math.max(0, now - state.lastSavedAt)
  const appliedMs = Math.min(elapsedMs, capMs)
  const after = journeyTick(tick(state, appliedMs), appliedMs, rng)
  const qiGained = after.qi - state.qi
  const stonesGained = after.stones - state.stones
  const daysPassed = after.ageDays - state.ageDays
  const chestsBefore = state.journey.chests.normal + state.journey.chests.red
  const chestsAfter = after.journey.chests.normal + after.journey.chests.red
  const fireBefore = state.forge?.fireCount ?? 0
  const fireAfter = after.forge?.fireCount ?? 0
  const fireGained = Math.max(0, fireAfter - fireBefore)
  const report: OfflineReport = {
    elapsedMs,
    appliedMs,
    capped: elapsedMs > capMs,
    qiGained,
    stonesGained,
    daysPassed,
    stagesCleared: after.stats.stagesCleared - state.stats.stagesCleared,
    chestsGained: Math.max(0, chestsAfter - chestsBefore) + (after.stats.chestsOpened - state.stats.chestsOpened),
    deaths: after.journey.events.filter((e) => e.kind === 'death').length,
    fireGained,
  }
  let next = { ...after, lastSavedAt: now }
  if (appliedMs >= MIN_OFFLINE_REPORT_MS) {
    const fireText = fireGained > 0 ? `, thu hoạch ${fireGained} Chân Hỏa` : ''
    const journey = report.stagesCleared > 0 ? ` Hành tẩu vượt ${report.stagesCleared} ải, nhặt ${report.chestsGained} rương${fireText}.` : ''
    next = pushLog(
      next,
      `Bế quan ${Math.floor(daysPassed)} ngày, hấp thu ${Math.round(qiGained)} linh khí, nhặt được ${Math.floor(stonesGained)} linh thạch.${journey}`,
      'info',
    )
  }
  return { state: next, report }
}
