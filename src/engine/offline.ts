import { pushLog } from './log'
import { getModifiers } from './modifiers'
import { tick } from './tick'
import type { GameState } from './types'

/** Below this the UI should not bother showing an offline summary. */
export const MIN_OFFLINE_REPORT_MS = 60 * 1000

export interface OfflineReport {
  elapsedMs: number
  appliedMs: number
  capped: boolean
  qiGained: number
  stonesGained: number
  daysPassed: number
}

export function applyOfflineProgress(
  state: GameState,
  now: number,
  capMs: number = getModifiers(state).offlineCapMs,
): { state: GameState; report: OfflineReport } {
  const elapsedMs = Math.max(0, now - state.lastSavedAt)
  const appliedMs = Math.min(elapsedMs, capMs)
  const after = tick(state, appliedMs)
  const qiGained = after.qi - state.qi
  const stonesGained = after.stones - state.stones
  const daysPassed = after.ageDays - state.ageDays
  const report: OfflineReport = {
    elapsedMs,
    appliedMs,
    capped: elapsedMs > capMs,
    qiGained,
    stonesGained,
    daysPassed,
  }
  let next = { ...after, lastSavedAt: now }
  if (appliedMs >= MIN_OFFLINE_REPORT_MS) {
    next = pushLog(
      next,
      `Bế quan ${Math.floor(daysPassed)} ngày, hấp thu ${Math.round(qiGained)} linh khí, nhặt được ${Math.floor(stonesGained)} linh thạch.`,
      'info',
    )
  }
  return { state: next, report }
}
