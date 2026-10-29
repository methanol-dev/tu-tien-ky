export const SAVE_VERSION = 9
export const LOG_LIMIT = 100
export const DAYS_PER_YEAR = 360
export const STARTING_AGE_YEARS = 16

/** Breakthrough failure burns this fraction range of current qi (before technique reductions). */
export const FAIL_PENALTY_MIN = 0.1
export const FAIL_PENALTY_MAX = 0.3
/** Hard cap for any non-guaranteed breakthrough. */
export const MAX_BREAKTHROUGH_CHANCE = 0.98

/** Seconds of passive qi granted by one "Tu luyện" tap before technique bonuses. */
export const MEDITATE_BONUS_SECONDS = 1

export const DEFAULT_OFFLINE_CAP_MS = 8 * 60 * 60 * 1000

/** Spirit stones per second = sqrt(realm qiRate) * this factor. Sub-linear so fixed prices stay meaningful. */
export const STONE_RATE_FACTOR = 0.3
/** Spirit stones awarded on a successful breakthrough, in seconds of current income. */
export const BREAKTHROUGH_STONE_SECONDS = 600

export const GATHER_COOLDOWN_MS = 60_000
export const GATHER_MIN_COUNT = 1
export const GATHER_MAX_COUNT = 3

/** Random events: first one soon after start, then every few minutes of played time. */
export const FIRST_EVENT_AT_MS = 90_000
export const EVENT_INTERVAL_MIN_MS = 3 * 60_000
export const EVENT_INTERVAL_MAX_MS = 6 * 60_000

/** Combat baseline (gear affixes add on top). */
export const BASE_CRIT_CHANCE = 0.1
export const BASE_CRIT_MULT = 1.5
export const PLAYER_ATTACK_MS = 1000
export const ENEMY_ATTACK_MS = 1200
export const MAX_CRIT_CHANCE = 0.75
export const MAX_LIFESTEAL = 0.3
export const MAX_ATTACK_SPEED_MULT = 2.5

/** Journey (Hành Tẩu): fixed simulation step and pacing. All in ms of played time. */
export const JOURNEY_STEP_MS = 500
export const JOURNEY_WALK_MS = 3000
export const JOURNEY_BOSS_WALK_MS = 4500
export const JOURNEY_RETREAT_MS = 45_000
/** Retreat grows with consecutive deaths, up to this multiple. */
export const JOURNEY_RETREAT_MAX_MULT = 5
/** Fraction of max HP restored after each stage clear. */
export const JOURNEY_STAGE_REGEN = 0.25
/** Stones per kill / boss kill, in seconds of current income. */
export const KILL_STONE_SECONDS = 3
export const BOSS_STONE_SECONDS = 30
/** Herb loot table is rolled per stage clear with chances scaled by this (boss stage: full chance). */
export const HERB_STAGE_CHANCE_SCALE = 0.06
export const CHEST_DROP_CHANCE = 0.3
export const GEAR_CAP = 60
export const CHEST_CAP = 999
export const JOURNEY_EVENT_LIMIT = 24
/** Tụ Bảo Quyết levels that unlock auto-opening chests. */
export const AUTO_OPEN_TECHNIQUE = 'tu-bao-quyet'
export const AUTO_OPEN_NORMAL_LEVEL = 5
export const AUTO_OPEN_RED_LEVEL = 10
/** With autoAdvance on, step down after this many consecutive deaths. */
export const AUTO_STEP_DOWN_DEATHS = 3

/** Heavenly tribulation: bolts dealt as fractions of max HP, growing per bolt. */
export const TRIBULATION_BASE_FRACTION = 0.18
export const TRIBULATION_STEP_FRACTION = 0.08
export const TRIBULATION_MIN_BOLTS = 3
export const TRIBULATION_MAX_BOLTS = 9
export const TRIBULATION_DODGE_CHANCE = 0.5
export const TRIBULATION_DODGE_FAIL_MULT = 1.5
export const TRIBULATION_PILL_MULT = 0.4
export const TRIBULATION_PILL_ITEM = 'tu-khi-dan'
export const TRIBULATION_FAIL_QI_LOSS = 0.3
export const TRIBULATION_INJURY_MS = 10 * 60_000
/** Damage reduction from breakthrough bonuses is capped here. */
export const TRIBULATION_MAX_REDUCTION = 0.5
