import { baselineStats } from '@/content/regions'
import { CLASS_BY_ID } from '@/content/classes'
import { getMartialPunches, getMartialRealm } from '@/content/martialRealms'
import {
  BASE_CRIT_CHANCE,
  BASE_CRIT_MULT,
  MAX_ATTACK_SPEED_MULT,
  MAX_CRIT_CHANCE,
  MAX_LIFESTEAL,
  PLAYER_ATTACK_MS,
} from './constants'
import { getAffixTotals } from './gear'
import type { GameState, Rng } from './types'

export interface CombatStats {
  hp: number
  atk: number
  def: number
  /** Chance 0..1 that a hit crits. */
  crit: number
  critMult: number
  /** Played-time ms between attacks. */
  attackMs: number
  /** Fraction of damage dealt returned as HP. */
  lifesteal: number
  /** Cự ly chiến đấu: cận chiến (melee) hay tầm xa (ranged). */
  combatRange: 'melee' | 'ranged'
  /** Hệ số áp chế cận chiến (ví dụ 1.35 theo công thức áp chế 10 trượng trong docs.md). */
  meleeSuppressionMult: number
}

/** Baseline combat stats grow with realm; equipped gear affixes and martial realm multiply them. */
export function getCombatStats(state: GameState): CombatStats {
  const b = baselineStats(state.realmIndex)
  const t = getAffixTotals(state)
  const punches = Math.max(state.punches, getMartialPunches(state.stats))
  const martial = getMartialRealm(punches)
  const mb = martial.bonus
  const classDef = CLASS_BY_ID[state.classId] ?? CLASS_BY_ID['kiem-tu']
  const cm = classDef.multipliers
  const isMelee = classDef.combatRange === 'melee' || state.cultivationPath === 'martial'

  // Công thức Áp Chế 10 Trượng từ GDD Kiếm Lai (docs.md): M_martial = 1 + 0.35 * (1 - d/10)
  // Khi áp sát cự ly 0 trượng (cận chiến), hệ số là 1.35 (+35% Atk).
  const meleeSuppressionMult = isMelee ? 1.35 : 1.0

  // Đặc trưng môn phái bổ trợ theo GDD
  const classCritBonus = 0
  const classCritMultBonus = state.classId === 'kiem-tu' ? 0.2 : 0
  const classLifestealBonus = state.classId === 'binh-gia' ? 0.15 : 0

  return {
    hp: Math.round(b.hp * (1 + t.hp + mb.hpPercent) * (cm.hp ?? 1)),
    atk: Math.round(b.atk * (1 + t.atk + mb.atkPercent) * (cm.atk ?? 1) * meleeSuppressionMult),
    def: Math.round(b.def * (1 + t.def + mb.defPercent) * (cm.def ?? 1)),
    crit: Math.min(MAX_CRIT_CHANCE, BASE_CRIT_CHANCE + t.crit + (cm.crit ?? 0) + classCritBonus),
    critMult: BASE_CRIT_MULT + t.critDmg + classCritMultBonus,
    attackMs: Math.round(PLAYER_ATTACK_MS / Math.min(MAX_ATTACK_SPEED_MULT, (1 + t.atkSpeed) * (cm.atkSpeed ?? 1))),
    lifesteal: Math.min(MAX_LIFESTEAL, t.lifesteal + classLifestealBonus),
    combatRange: isMelee ? 'melee' : 'ranged',
    meleeSuppressionMult,
  }
}

export function rollDamage(
  atk: number,
  def: number,
  rng: Rng,
  critChance: number = BASE_CRIT_CHANCE,
  critMult: number = BASE_CRIT_MULT,
): { dmg: number; crit: boolean } {
  const variance = 0.85 + rng() * 0.3
  const crit = rng() < critChance
  const raw = atk * variance * (crit ? critMult : 1) - def * 0.6
  return { dmg: Math.max(1, Math.round(raw)), crit }
}
