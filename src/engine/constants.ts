export const SAVE_VERSION = 5
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

/** Losing an expedition: qi burned and injury debuff. */
export const EXPEDITION_DEFEAT_QI_LOSS = 0.1
export const EXPEDITION_INJURY_MULT = 0.5
export const EXPEDITION_INJURY_MS = 5 * 60_000

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
