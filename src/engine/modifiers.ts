import { TECHNIQUE_BY_ID } from '@/content/techniques'
import { DEFAULT_OFFLINE_CAP_MS, MEDITATE_BONUS_SECONDS } from './constants'
import type { GameState } from './types'

export interface Modifiers {
  qiRateMult: number
  stoneRateMult: number
  breakthroughBonus: number
  failPenaltyMult: number
  meditateSeconds: number
  offlineCapMs: number
}

const HOUR = 3_600_000

/** Aggregates every passive bonus (techniques + active buffs) into one object. */
export function getModifiers(state: GameState): Modifiers {
  let qiAdd = 0
  let stoneAdd = 0
  const mods: Modifiers = {
    qiRateMult: 1,
    stoneRateMult: 1,
    breakthroughBonus: 0,
    failPenaltyMult: 1,
    meditateSeconds: MEDITATE_BONUS_SECONDS,
    offlineCapMs: DEFAULT_OFFLINE_CAP_MS,
  }

  for (const [id, level] of Object.entries(state.techniques)) {
    const def = TECHNIQUE_BY_ID[id]
    if (!def || level <= 0) continue
    const v = def.perLevel * level
    switch (def.effect) {
      case 'qiRateMult':
        qiAdd += v
        break
      case 'stoneRateMult':
        stoneAdd += v
        break
      case 'breakthroughBonus':
        mods.breakthroughBonus += v
        break
      case 'failPenaltyMult':
        mods.failPenaltyMult *= Math.max(0, 1 - v)
        break
      case 'meditateSeconds':
        mods.meditateSeconds += v
        break
      case 'offlineCapHours':
        mods.offlineCapMs += v * HOUR
        break
    }
  }
  mods.qiRateMult = 1 + qiAdd
  mods.stoneRateMult = 1 + stoneAdd

  for (const buff of state.buffs) {
    if (buff.expiresAtMs > state.playedMs) mods.qiRateMult *= buff.qiRateMult
  }
  return mods
}
