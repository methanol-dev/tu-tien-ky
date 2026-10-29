import { z } from 'zod'
import { GEAR_CAP, JOURNEY_EVENT_LIMIT } from '../constants'

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

const affixKey = z.enum(['atk', 'hp', 'def', 'crit', 'critDmg', 'atkSpeed', 'lifesteal', 'qiRate', 'stoneRate', 'lootChance'])

const gearInstanceSchema = z.object({
  uid: z.string().max(32),
  defId: z.string().max(64),
  rarity: z.enum(['pham', 'linh', 'bao', 'tien', 'than']),
  tier: z.number().int().min(1).max(20),
  affixes: z.array(z.object({ key: affixKey, value: z.number().min(0).max(5) })).max(6),
})

const fighterSchema = z.object({
  id: z.string().max(64),
  hp: z.number().nonnegative().finite(),
  maxHp: z.number().positive().finite(),
  nextAttackAtMs: z.number().nonnegative(),
})

const enemySchema = z.object({
  id: z.string().max(64),
  name: z.string().max(100),
  silhouette: z.enum(['wolf', 'bear', 'bat', 'snake', 'cultist', 'skeleton', 'skeleton-lord', 'yeti', 'serpent', 'lizard', 'dragonling', 'demon', 'demon-general']),
  imageUrl: z.string().optional(),
  hp: z.number().nonnegative().finite(),
  maxHp: z.number().positive().finite(),
  atk: z.number().nonnegative().finite(),
  def: z.number().nonnegative().finite(),
  boss: z.boolean(),
  nextAttackAtMs: z.number().nonnegative(),
})

const journeySchema = z.object({
  regionId: z.string().max(64),
  difficulty: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  stage: z.number().int().min(1).max(99),
  phase: z.enum(['rest', 'walk', 'fight', 'retreat']),
  phaseUntilMs: z.number().nonnegative(),
  party: z.array(fighterSchema).min(1).max(3),
  enemies: z.array(enemySchema).max(5),
  chests: z.object({ normal: z.number().int().nonnegative(), red: z.number().int().nonnegative() }),
  autoAdvance: z.boolean(),
  cleared: z.record(z.string().max(64), z.number().int().min(0).max(3)),
  deaths: z.number().int().nonnegative(),
  runDeaths: z.number().int().nonnegative(),
  accMs: z.number().nonnegative(),
  events: z
    .array(
      z.object({
        atMs: z.number().nonnegative(),
        kind: z.enum([
          'hit',
          'crit',
          'hurt',
          'kill',
          'boss-kill',
          'death',
          'stage',
          'chest',
          'region',
          'loot-stone',
          'loot-item',
          'loot-manual',
          'natal-sword',
        ]),
        amount: z.number().optional(),
        target: z.union([z.literal('player'), z.number().int().nonnegative()]).optional(),
      }),
    )
    .max(JOURNEY_EVENT_LIMIT),
})

const swordTalentSchema = z.object({
  id: z.string().max(64),
  level: z.number().int().min(1).max(20),
})

const natalSwordSchema = z.object({
  uid: z.string().max(64),
  swordDefId: z.string().max(64),
  name: z.string().max(64),
  level: z.number().int().min(1).max(20),
  talents: z.array(swordTalentSchema).max(10),
})

/** Schema for the CURRENT save version. Older versions go through migrations first. */
export const gameStateSchema = z.object({
  version: z.literal(11),
  createdAt: z.number().int().nonnegative(),
  lastSavedAt: z.number().int().nonnegative(),
  playedMs: z.number().nonnegative(),
  classId: z.enum([
    'kiem-tu',
    'vo-phu',
    'nho-gia',
    'dao-gia',
    'phat-gia',
    'binh-gia',
    'duoc-gia',
    'thuong-gia',
    'mac-gia',
    'am-duong-gia',
  ]),
  cultivationPath: z.enum(['martial', 'qi', 'dual']).default('qi'),
  martialStageIndex: z.number().int().nonnegative().default(0),
  punches: z.number().nonnegative().default(0),
  realmIndex: z.number().int().nonnegative(),
  qi: z.number().nonnegative().finite(),
  ageDays: z.number().nonnegative().finite(),
  lifespanBonusYears: z.number().nonnegative().finite(),
  stones: z.number().nonnegative().finite(),
  techniques: countMap,
  inventory: countMap,
  gear: z.array(gearInstanceSchema).max(GEAR_CAP + 10),
  equipped: z.object({
    'vu-khi': z.string().max(32).nullable(),
    dau: z.string().max(32).nullable(),
    ao: z.string().max(32).nullable(),
    quan: z.string().max(32).nullable(),
    giay: z.string().max(32).nullable(),
    'dai-lung': z.string().max(32).nullable(),
    'phu-luc': z.string().max(32).nullable(),
    'day-chuyen': z.string().max(32).nullable(),
    'nhan-1': z.string().max(32).nullable(),
    'nhan-2': z.string().max(32).nullable(),
    'bong-tai-1': z.string().max(32).nullable(),
    'bong-tai-2': z.string().max(32).nullable(),
  }),
  nextGearUid: z.number().int().positive(),
  natalSwords: z.array(natalSwordSchema).default([]),
  buffs: z.array(buffSchema).max(50),
  pendingBreakthroughBonus: z.number().min(0).max(1),
  alchemy: alchemyJobSchema.nullable(),
  journey: journeySchema,
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
    tribulationsPassed: z.number().int().nonnegative(),
    tribulationsFailed: z.number().int().nonnegative(),
    enemiesSlain: z.number().int().nonnegative(),
    bossesSlain: z.number().int().nonnegative(),
    stagesCleared: z.number().int().nonnegative(),
    chestsOpened: z.number().int().nonnegative(),
    gearFound: z.number().int().nonnegative(),
  }),
  settings: z.object({
    timeScale: z.number().positive().max(1000),
    pauseOnEvent: z.boolean(),
    avatarId: z.string().optional(),
  }),
})

export type GameStateSchema = z.infer<typeof gameStateSchema>
