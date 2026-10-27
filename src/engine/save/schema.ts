import { z } from 'zod'

const logEntrySchema = z.object({
  id: z.number().int().nonnegative(),
  day: z.number(),
  kind: z.enum(['info', 'success', 'danger', 'event']),
  text: z.string().max(500),
})

/** Schema for the CURRENT save version. Older versions go through migrations first. */
export const gameStateSchema = z.object({
  version: z.literal(1),
  createdAt: z.number().int().nonnegative(),
  lastSavedAt: z.number().int().nonnegative(),
  playedMs: z.number().nonnegative(),
  realmIndex: z.number().int().nonnegative(),
  qi: z.number().nonnegative().finite(),
  ageDays: z.number().nonnegative().finite(),
  nextLogId: z.number().int().positive(),
  log: z.array(logEntrySchema).max(100),
  stats: z.object({
    breakthroughs: z.number().int().nonnegative(),
    breakthroughFailures: z.number().int().nonnegative(),
    qiTotal: z.number().nonnegative().finite(),
  }),
  settings: z.object({
    timeScale: z.number().positive().max(1000),
  }),
})

export type GameStateSchema = z.infer<typeof gameStateSchema>
