import type { AffixKey, Rarity } from '@/content/affixes'
import type { ClassId, CultivationPath } from '@/content/classes'
import type { GearSlot } from '@/content/gear'
import type { Difficulty, SilhouetteId } from '@/content/regions'

export type LogKind = 'info' | 'success' | 'danger' | 'event'

export interface LogEntry {
  id: number
  /** In-game day when the entry was written. */
  day: number
  kind: LogKind
  text: string
}

export type BattleSpeed = 1 | 2 | 4

export interface ForgeAutoFilters {
  stopOnHigherScore: boolean
  minRarity: Rarity
}

export interface ForgeState {
  level: number
  exp: number
  fireCount: number
  pendingGear: GearInstance | null
  autoFilters: ForgeAutoFilters
}

export type FormationSlot =
  | 'front-left'
  | 'front-mid'
  | 'front-right'
  | 'back-left'
  | 'back-mid'
  | 'back-right'

export interface FormationState {
  playerSlot: FormationSlot
}

export interface GameSettings {
  /** In-game days elapsed per real second. */
  timeScale: number
  /** Freeze the simulation while an event awaits a decision. */
  pauseOnEvent: boolean
  /** Selected character avatar ID (defaults to 'tran-binh-an'). */
  avatarId?: string
  /** Combat simulation multiplier for journey (1x, 2x, 4x). */
  battleSpeed?: BattleSpeed
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
  eventsResolved: number
  tribulationsPassed: number
  tribulationsFailed: number
  enemiesSlain: number
  bossesSlain: number
  stagesCleared: number
  chestsOpened: number
  gearFound: number
}

/** Temporary multiplier. Timed against `playedMs` so it also runs down during offline progress. */
export interface Buff {
  id: string
  name: string
  qiRateMult: number
  expiresAtMs: number
}

export interface PendingEvent {
  eventId: string
  triggeredAtMs: number
}

export interface TribulationState {
  toRealmIndex: number
  bolts: number
  /** Index of the next bolt (0-based). */
  current: number
  hp: number
  maxHp: number
  /** Damage reduction applied to every bolt (0..0.5). */
  reduction: number
  log: string[]
}

/** Carried across lives. */
export interface Legacy {
  daoVan: number
  lives: number
  upgrades: Record<string, number>
  bestRealmIndex: number
}

export interface AlchemyJob {
  recipeId: string
  startedAtMs: number
  finishAtMs: number
}

// ---- Gear & journey (Phase 9) ----

export interface Affix {
  key: AffixKey
  value: number
}

export interface GearInstance {
  uid: string
  defId: string
  rarity: Rarity
  tier: number
  affixes: Affix[]
}

/** A party member in the journey. P9: only the player; companions come with the story. */
export interface Fighter {
  id: string
  hp: number
  maxHp: number
  nextAttackAtMs: number
}

export interface JourneyEnemy {
  id: string
  name: string
  silhouette: SilhouetteId
  imageUrl?: string
  classId?: ClassId
  hp: number
  maxHp: number
  atk: number
  def: number
  boss: boolean
  nextAttackAtMs: number
}

/** `rest`: region locked by realm, hero meditates. `retreat`: fled after dying, healing up. */
export type JourneyPhase = 'rest' | 'walk' | 'fight' | 'retreat'

export type JourneyEventKind =
  | 'hit'
  | 'crit'
  | 'hurt'
  | 'kill'
  | 'boss-kill'
  | 'death'
  | 'stage'
  | 'chest'
  | 'region'
  | 'loot-stone'
  | 'loot-item'
  | 'loot-manual'
  | 'natal-sword'

export interface SwordTalentInstance {
  id: string
  level: number
}

export interface NatalSwordInstance {
  uid: string
  swordDefId: string
  name: string
  level: number
  talents: SwordTalentInstance[]
}

/** Short-lived facts for the UI (damage numbers, flashes). Ring buffer, see JOURNEY_EVENT_LIMIT. */
export interface JourneyEvent {
  atMs: number
  kind: JourneyEventKind
  amount?: number
  label?: string
  itemId?: string
  /** 'player' or index into `enemies`. */
  target?: 'player' | number
}

export interface JourneyState {
  regionId: string
  difficulty: Difficulty
  /** 1..STAGES_PER_REGION. */
  stage: number
  phase: JourneyPhase
  /** playedMs at which the current walk/retreat ends. */
  phaseUntilMs: number
  party: Fighter[]
  enemies: JourneyEnemy[]
  chests: { normal: number; red: number }
  /** Move up a difficulty / region after a clean clear; step down after repeated deaths. */
  autoAdvance: boolean
  /** regionId -> highest difficulty cleared (0..3). Absent = never cleared. */
  cleared: Record<string, number>
  /** Consecutive deaths in the current region/difficulty. */
  deaths: number
  /** Deaths accumulated while clearing the current run; 0 at region clear = clean. */
  runDeaths: number
  /** Leftover ms not yet simulated (fixed-step accumulator). */
  accMs: number
  events: JourneyEvent[]
}

export interface GameState {
  version: number
  /** Epoch ms when this save was created. */
  createdAt: number
  /** Epoch ms of the last persist; drives offline progress. */
  lastSavedAt: number
  /** Total real time the simulation has advanced, in ms. Game-time clock for cooldowns. */
  playedMs: number
  /** Origin tu đạo / class archetype. Defaults to 'kiem-tu'. */
  classId: ClassId
  /** Đạo đồ tu luyện: 'martial' (Thuần Túy Võ Phu), 'qi' (Luyện Khí Sĩ), 'dual' (Kiếm Võ Song Tu). */
  cultivationPath: CultivationPath
  /** Cảnh giới võ đạo hiện tại (0..10 tương ứng 11 cảnh giới trong martialRealms.ts). */
  martialStageIndex: number
  /** Số quyền đã luyện (tài nguyên tiến cấp và bồi đắp quyền ý của Võ Phu). */
  punches: number
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
  /** Item id -> count (herbs, pills). */
  inventory: Record<string, number>
  /** Gear instances owned (equipped ones included). */
  gear: GearInstance[]
  equipped: Record<GearSlot, string | null>
  nextGearUid: number
  /** Phi kiếm bản mệnh uẩn dưỡng trong khí phủ của kiếm tu */
  natalSwords: NatalSwordInstance[]
  buffs: Buff[]
  /** One-shot bonus consumed by the next breakthrough attempt. */
  pendingBreakthroughBonus: number
  alchemy: AlchemyJob | null
  journey: JourneyState
  tribulation: TribulationState | null
  legacy: Legacy
  /** Random event awaiting a choice, if any. */
  pendingEvent: PendingEvent | null
  /** playedMs at which the next random event may fire. */
  nextEventAtMs: number
  /** Event id -> playedMs until it may fire again. */
  eventCooldowns: Record<string, number>
  /** Story flags set by events; `seen:<id>` marks once-only events. */
  flags: Record<string, boolean>
  /** playedMs at which the next herb gathering is allowed. */
  gatherReadyAtMs: number
  nextLogId: number
  log: LogEntry[]
  stats: GameStats
  settings: GameSettings
  forge: ForgeState
  formation: FormationState
}

/** Random source in [0, 1). Injected so tests and simulations are deterministic. */
export type Rng = () => number

/** Standard shape for engine actions that may be refused. */
export type ActionResult<T = GameState> = { ok: true; state: T } | { ok: false; error: string }
