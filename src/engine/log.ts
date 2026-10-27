import { LOG_LIMIT } from './state'
import type { GameState, LogKind } from './types'

export function pushLog(state: GameState, text: string, kind: LogKind = 'info'): GameState {
  const entry = { id: state.nextLogId, day: Math.floor(state.ageDays), kind, text }
  const log = state.log.length >= LOG_LIMIT ? state.log.slice(-(LOG_LIMIT - 1)) : state.log.slice()
  log.push(entry)
  return { ...state, log, nextLogId: state.nextLogId + 1 }
}
