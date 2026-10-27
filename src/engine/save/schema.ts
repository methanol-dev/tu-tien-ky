import { z } from 'zod'

const logEntrySchema = z.object({
  id: z.number().int().nonnegative(),
  day: z.number(),
  kind: z.enum(['info', 'success', 'danger', 'event']),
  text: z.string().max(500),
})

const countMap = z.record(z.string().max(64), z.number().int().nonnegative()).refine(
  (m) => Object.keys(m).length <= 200,
  'quá nhiều mục',
)

const buffSchema = z.object({
  id: z.string().max(64),
  name: z.string().max(100),
  qiRateMult: z.number().positive().max(1000),
  expiresAtMs: z.number().nonnegative(),
})

const alchemyJobSchema = z.object({
  recipeId: z.string().max(64),
  startedAtMs: z.number().nonnegative(),
  finishAtMs: z.number().nonnegative(),
})

/** Schema for the CURRENT save version. Older versions go through migrations first. */
export const gameStateSchema = z.object({
  version: z.literal(5),
  createdAt: z.number().int().nonnegative(),
  lastSavedAt: z.number().int().nonnegative(),
  playedMs: z.number().nonnegative(),
  realmIndex: z.number().int().nonnegative(),
  qi: z.number().nonnegative().finite(),
  ageDays: z.number().nonnegative().finite(),
  lifespanBonusYears: z.number().nonnegative().finite(),
  stones: z.number().nonnegative().finite(),
  techniques: countMap,
  inventory: countMap,
  buffs: z.array(buffSchema).max(50),
  pendingBreakthroughBonus: z.number().min(0).max(1),
  alchemy: alchemyJobSchema.nullable(),
  tribulation: z
    .object({
      toRealmIndex: z.number().int().nonnegative(),
      bolts: z.number().int().min(1).max(20),
      current: z.number().int().nonnegative(),
      hp: z.number().nonnegative(),
      maxHp: z.number().positive(),
      reduction: z.number().min(0).max(1),
      log: z.array(z.string().max(300)).max(40),
    })
    .nullable(),
  legacy: z.object({
    daoVan: z.number().nonnegative(),
    lives: z.number().int().positive(),
    upgrades: z.record(z.string().max(64), z.number().int().nonnegative()),
    bestRealmIndex: z.number().int().nonnegative(),
  }),
  expedition: z.object({ dungeonId: z.string().max(64), startedAtMs: z.number().nonnegative(), finishAtMs: z.number().nonnegative() }).nullable(),
  pendingEvent: z.object({ eventId: z.string().max(64), triggeredAtMs: z.number().nonnegative() }).nullable(),
  nextEventAtMs: z.number().nonnegative(),
  eventCooldowns: z.record(z.string().max(64), z.number().nonnegative()),
  flags: z.record(z.string().max(80), z.boolean()),
  gatherReadyAtMs: z.number().nonnegative(),
  nextLogId: z.number().int().positive(),
  log: z.array(logEntrySchema).max(100),
  stats: z.object({
    breakthroughs: z.number().int().nonnegative(),
    breakthroughFailures: z.number().int().nonnegative(),
    qiTotal: z.number().nonnegative().finite(),
    stonesTotal: z.number().nonnegative().finite(),
    pillsUsed: z.number().int().nonnegative(),
    alchemyCrafted: z.number().int().nonnegative(),
    eventsResolved: z.number().int().nonnegative(),
    expeditions: z.number().int().nonnegative(),
    expeditionWins: z.number().int().nonnegative(),
    tribulationsPassed: z.number().int().nonnegative(),
    tribulationsFailed: z.number().int().nonnegative(),
  }),
  settings: z.object({
    timeScale: z.number().positive().max(1000),
    pauseOnEvent: z.boolean(),
  }),
})

export type GameStateSchema = z.infer<typeof gameStateSchema>
