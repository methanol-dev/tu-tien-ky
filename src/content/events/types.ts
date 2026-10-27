/** One concrete consequence applied to GameState. Amounts scale with the player where possible. */
export type EventEffect =
  | { type: 'qi'; fraction: number } // fraction of current realm qiRequired; negative = loss
  | { type: 'qiLoss'; fraction: number } // fraction of CURRENT qi lost (0..1)
  | { type: 'stones'; seconds: number } // +/- this many seconds of current stone income
  | { type: 'stonesFraction'; fraction: number } // fraction of current stones; negative = loss
  | { type: 'item'; id: string; count: number } // negative removes (clamped at 0)
  | { type: 'buff'; id: string; name: string; mult: number; durationMs: number } // mult < 1 = injury
  | { type: 'breakthroughBonus'; bonus: number }
  | { type: 'lifespan'; years: number }
  | { type: 'technique'; id?: string; levels: number } // random unlocked technique when id omitted
  | { type: 'flag'; key: string; value: boolean }

export interface EventOutcome {
  weight: number
  text: string
  effects: EventEffect[]
}

export interface EventChoiceRequirement {
  stones?: number
  items?: Record<string, number>
  minRealmIndex?: number
  flag?: string
}

export interface EventChoice {
  id: string
  label: string
  /** Short hint shown under the label, e.g. "Mất 100 linh thạch". */
  hint?: string
  requires?: EventChoiceRequirement
  outcomes: EventOutcome[]
}

export interface EventCondition {
  minRealmIndex?: number
  maxRealmIndex?: number
  requiredFlags?: string[]
  forbiddenFlags?: string[]
}

export interface EventDef {
  id: string
  title: string
  text: string
  /** Relative pick weight among eligible events. */
  weight: number
  condition?: EventCondition
  /** Minimum played-time between two occurrences. */
  cooldownMs?: number
  /** Fires at most once per life. */
  once?: boolean
  choices: EventChoice[]
}
