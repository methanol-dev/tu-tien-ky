import { pushLog } from './log'
import { tick } from './tick'
import type { GameState } from './types'

export const DEFAULT_OFFLINE_CAP_MS = 8 * 60 * 60 * 1000
/** Below this the UI should not bother showing an offline summary. */
export const MIN_OFFLINE_REPORT_MS = 60 * 1000

export interface OfflineReport {
  elapsedMs: number
  appliedMs: number
  capped: boolean
  qiGained: number
  daysPassed: number
}

export function applyOfflineProgress(
  state: GameState,
  now: number,
  capMs: number = DEFAULT_OFFLINE_CAP_MS,
): { state: GameState; report: OfflineReport } {
  const elapsedMs = Math.max(0, now - state.lastSavedAt)
  const appliedMs = Math.min(elapsedMs, capMs)
  const after = tick(state, appliedMs)
  const qiGained = after.qi - state.qi
  const daysPassed = after.ageDays - state.ageDays
  const report: OfflineReport = {
    elapsedMs,
    appliedMs,
    capped: elapsedMs > capMs,
    qiGained,
    daysPassed,
  }
  let next = { ...after, lastSavedAt: now }
  if (appliedMs >= MIN_OFFLINE_REPORT_MS) {
    next = pushLog(
      next,
      `Bế quan ${Math.floor(daysPassed)} ngày, hấp thu ${Math.round(qiGained)} linh khí.`,
      'info',
    )
  }
  return { state: next, report }
}
