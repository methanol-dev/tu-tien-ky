export type LogKind = 'info' | 'success' | 'danger' | 'event'

export interface LogEntry {
  id: number
  /** In-game day when the entry was written. */
  day: number
  kind: LogKind
  text: string
}

export interface GameSettings {
  /** In-game days elapsed per real second. */
  timeScale: number
}

export interface GameStats {
  breakthroughs: number
  breakthroughFailures: number
  /** Lifetime qi accumulated (for achievements / prestige later). */
  qiTotal: number
}

export interface GameState {
  version: number
  /** Epoch ms when this save was created. */
  createdAt: number
  /** Epoch ms of the last time the state was persisted; drives offline progress. */
  lastSavedAt: number
  /** Total real time the game loop has advanced, in ms. */
  playedMs: number
  /** Index into REALMS. */
  realmIndex: number
  qi: number
  /** Age of the cultivator in in-game days. */
  ageDays: number
  nextLogId: number
  log: LogEntry[]
  stats: GameStats
  settings: GameSettings
}

/** Random source in [0, 1). Injected so that tests and simulations are deterministic. */
export type Rng = () => number
