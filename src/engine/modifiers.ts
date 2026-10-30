import { CLASS_BY_ID } from '@/content/classes'
import { LEGACY_BY_ID } from '@/content/legacy'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import { DEFAULT_OFFLINE_CAP_MS, MEDITATE_BONUS_SECONDS } from './constants'
import { getAffixTotals } from './gear'
import { getTechniqueEffectiveValue } from './techniques'
import type { GameState } from './types'

export interface Modifiers {
  qiRateMult: number
  stoneRateMult: number
  breakthroughBonus: number
  failPenaltyMult: number
  meditateSeconds: number
  offlineCapMs: number
  lifespanBonusYears: number
  /** Multiplies chest drop chance in the journey. */
  lootChanceMult: number
}

const HOUR = 3_600_000

/** Aggregates every passive bonus (legacy + techniques + gear + active buffs) into one object. */
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
    lifespanBonusYears: 0,
    lootChanceMult: 1,
  }

  for (const [id, level] of Object.entries(state.legacy.upgrades)) {
    const def = LEGACY_BY_ID[id]
    if (!def || level <= 0) continue
    const v = def.perLevel * level
    if (def.effect === 'qiRateMult') qiAdd += v
    else if (def.effect === 'breakthroughBonus') mods.breakthroughBonus += v
    else if (def.effect === 'lifespanYears') mods.lifespanBonusYears += v
  }

  for (const [id, level] of Object.entries(state.techniques)) {
    const def = TECHNIQUE_BY_ID[id]
    if (!def || level <= 0) continue
    const v = getTechniqueEffectiveValue(def, level)
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
        mods.failPenaltyMult *= Math.max(0.05, 1 - v)
        break
      case 'meditateSeconds':
        mods.meditateSeconds += v
        break
      case 'offlineCapHours':
        mods.offlineCapMs += v * HOUR
        break
    }
  }

  const gear = getAffixTotals(state)
  const classDef = CLASS_BY_ID[state.classId] ?? CLASS_BY_ID['kiem-tu']
  const cm = classDef.multipliers

  if (state.abode?.facilities) {
    const qLvl = state.abode.facilities.gatheringArray?.level ?? 0
    const pLvl = state.abode.facilities.paperPuppets?.level ?? 0
    const sLvl = state.abode.facilities.spiritSpring?.level ?? 0
    const bLvl = state.abode.facilities.spiritBeast?.level ?? 0

    const puppetQiBonus = pLvl >= 3 ? 0.1 : 0
    qiAdd += qLvl * 0.05 + puppetQiBonus

    const puppetStoneBonus = pLvl >= 2 ? 0.1 : 0
    stoneAdd += sLvl * 0.05 + puppetStoneBonus

    if (bLvl > 0) {
      mods.lootChanceMult += bLvl * 0.02
    }
  }

  stoneAdd += gear.stoneRate
  mods.qiRateMult = (1 + qiAdd) * (1 + gear.qiRate) * (cm.qiRate ?? 1)
  mods.stoneRateMult = (1 + stoneAdd) * (cm.stoneRate ?? 1)
  mods.lootChanceMult = (mods.lootChanceMult + gear.lootChance) * (cm.lootChance ?? 1)

  for (const buff of state.buffs) {
    if (buff.expiresAtMs > state.playedMs) mods.qiRateMult *= buff.qiRateMult
  }
  return mods
}
