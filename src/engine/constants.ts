export const SAVE_VERSION = 2
export const LOG_LIMIT = 100
export const DAYS_PER_YEAR = 360
export const STARTING_AGE_YEARS = 16

/** Breakthrough failure burns this fraction range of current qi (before technique reductions). */
export const FAIL_PENALTY_MIN = 0.1
export const FAIL_PENALTY_MAX = 0.3
/** Hard cap for any non-guaranteed breakthrough. */
export const MAX_BREAKTHROUGH_CHANCE = 0.98

/** Seconds of passive qi granted by one "Tu luyện" tap before technique bonuses. */
export const MEDITATE_BONUS_SECONDS = 2

export const DEFAULT_OFFLINE_CAP_MS = 8 * 60 * 60 * 1000

/** Spirit stones per second = realm qiRate * this factor. */
export const STONE_RATE_FACTOR = 0.2
/** Spirit stones awarded on a successful breakthrough = qiRequired * this factor. */
export const BREAKTHROUGH_STONE_FACTOR = 0.2

export const GATHER_COOLDOWN_MS = 60_000
export const GATHER_MIN_COUNT = 1
export const GATHER_MAX_COUNT = 3
