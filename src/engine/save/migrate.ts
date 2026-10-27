import { SAVE_VERSION } from '../constants'

type RawSave = Record<string, unknown>
type Migration = (raw: RawSave) => RawSave

/**
 * Keyed by the version they migrate FROM. Adding a field to GameState?
 * Bump SAVE_VERSION, add `MIGRATIONS[old] = ...`, update schema.ts. No exceptions.
 */
export const MIGRATIONS: Record<number, Migration> = {
  // 0 -> 1: pre-release saves had no `stats.qiTotal`.
  0: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    return {
      ...raw,
      version: 1,
      stats: { breakthroughs: 0, breakthroughFailures: 0, qiTotal: 0, ...stats },
    }
  },
  // 3 -> 4: expeditions (Phase 5).
  3: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    return { ...raw, version: 4, expedition: null, stats: { expeditions: 0, expeditionWins: 0, ...stats } }
  },
  // 2 -> 3: random events (Phase 4).
  2: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    const settings = (raw.settings as RawSave | undefined) ?? {}
    return {
      ...raw,
      version: 3,
      pendingEvent: null,
      nextEventAtMs: typeof raw.playedMs === 'number' ? raw.playedMs + 90_000 : 90_000,
      eventCooldowns: {},
      flags: {},
      stats: { eventsResolved: 0, ...stats },
      settings: { pauseOnEvent: false, ...settings },
    }
  },
  // 1 -> 2: economy, techniques, inventory, alchemy (Phase 3).
  1: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    return {
      ...raw,
      version: 2,
      lifespanBonusYears: 0,
      stones: 0,
      techniques: {},
      inventory: {},
      buffs: [],
      pendingBreakthroughBonus: 0,
      alchemy: null,
      gatherReadyAtMs: 0,
      stats: { stonesTotal: 0, pillsUsed: 0, alchemyCrafted: 0, ...stats },
    }
  },
}

export class MigrationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MigrationError'
  }
}

export function migrateSave(input: unknown): RawSave {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new MigrationError('Save is not an object')
  }
  let raw = input as RawSave
  let version = typeof raw.version === 'number' ? raw.version : 0
  if (version > SAVE_VERSION) {
    throw new MigrationError(`Save version ${version} is newer than supported ${SAVE_VERSION}`)
  }
  while (version < SAVE_VERSION) {
    const step = MIGRATIONS[version]
    if (!step) throw new MigrationError(`No migration from version ${version}`)
    raw = step(raw)
    const nextVersion = typeof raw.version === 'number' ? raw.version : version + 1
    if (nextVersion <= version) throw new MigrationError(`Migration ${version} did not advance`)
    version = nextVersion
  }
  return raw
}
