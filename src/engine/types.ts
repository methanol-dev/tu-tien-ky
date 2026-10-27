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
  /** Lifetime qi accumulated. */
  qiTotal: number
  /** Lifetime spirit stones earned. */
  stonesTotal: number
  pillsUsed: number
  alchemyCrafted: number
}

/** Temporary multiplier. Timed against `playedMs` so it also runs down during offline progress. */
export interface Buff {
  id: string
  name: string
  qiRateMult: number
  expiresAtMs: number
}

export interface AlchemyJob {
  recipeId: string
  startedAtMs: number
  finishAtMs: number
}

export interface GameState {
  version: number
  /** Epoch ms when this save was created. */
  createdAt: number
  /** Epoch ms of the last persist; drives offline progress. */
  lastSavedAt: number
  /** Total real time the simulation has advanced, in ms. Game-time clock for cooldowns. */
  playedMs: number
  /** Index into REALMS. */
  realmIndex: number
  qi: number
  /** Age in in-game days. */
  ageDays: number
  /** Extra lifespan from pills, in years. */
  lifespanBonusYears: number
  /** Spirit stones (currency). */
  stones: number
  /** Technique id -> level. Absent = level 0. */
  techniques: Record<string, number>
  /** Item id -> count. */
  inventory: Record<string, number>
  buffs: Buff[]
  /** One-shot bonus consumed by the next breakthrough attempt. */
  pendingBreakthroughBonus: number
  alchemy: AlchemyJob | null
  /** playedMs at which the next herb gathering is allowed. */
  gatherReadyAtMs: number
  nextLogId: number
  log: LogEntry[]
  stats: GameStats
  settings: GameSettings
}

/** Random source in [0, 1). Injected so tests and simulations are deterministic. */
export type Rng = () => number

/** Standard shape for engine actions that may be refused. */
export type ActionResult<T = GameState> = { ok: true; state: T } | { ok: false; error: string }
