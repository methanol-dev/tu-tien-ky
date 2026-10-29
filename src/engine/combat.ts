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
import { getPositionModifiers } from './formation'
import { getAffixTotals } from './gear'
import { getNatalSwordsCombatStats } from './natalSwords'
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
  /** Xuyên giáp từ Bản Mệnh Phi Kiếm (0..0.85). */
  armorPen: number
  /** Sát thương nặng theo % máu đối thủ. */
  heavyDmgPct: number
  /** Giảm sát thương nhận vào. */
  damageReduction: number
  /** Tỷ lệ né tránh đòn công. */
  dodgeChance: number
  /** Ngưỡng máu kích hoạt trảm sát hành quyết. */
  executeThreshold: number
}

/** Baseline combat stats grow with realm; equipped gear affixes, martial realm, and natal swords multiply them. */
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

  // Bản Mệnh Phi Kiếm thần thông cộng hưởng
  const ns = getNatalSwordsCombatStats(state)

  // Hệ số trận thế vị trí (Hàng Tiền / Hàng Hậu)
  const posMod = state.formation ? getPositionModifiers(state.formation.playerSlot) : { hpMult: 1, defMult: 1, atkMult: 1, atkSpeedMult: 1, critBonus: 0 }

  // Đặc trưng môn phái bổ trợ theo GDD
  const classCritBonus = 0
  const classCritMultBonus = state.classId === 'kiem-tu' ? 0.2 : 0
  const classLifestealBonus = state.classId === 'binh-gia' ? 0.15 : 0

  return {
    hp: Math.round(b.hp * (1 + t.hp + mb.hpPercent) * (cm.hp ?? 1) * posMod.hpMult),
    atk: Math.round(b.atk * (1 + t.atk + mb.atkPercent) * (cm.atk ?? 1) * meleeSuppressionMult * ns.atkMult * posMod.atkMult),
    def: Math.round(b.def * (1 + t.def + mb.defPercent) * (cm.def ?? 1) * posMod.defMult),
    crit: Math.min(MAX_CRIT_CHANCE, BASE_CRIT_CHANCE + t.crit + (cm.crit ?? 0) + classCritBonus + ns.critBonus + posMod.critBonus),
    critMult: BASE_CRIT_MULT + t.critDmg + classCritMultBonus + ns.critMultBonus,
    attackMs: Math.round(
      PLAYER_ATTACK_MS / Math.min(MAX_ATTACK_SPEED_MULT, (1 + t.atkSpeed) * (cm.atkSpeed ?? 1) * ns.atkSpeedMult * posMod.atkSpeedMult),
    ),
    lifesteal: Math.min(MAX_LIFESTEAL, t.lifesteal + classLifestealBonus + ns.lifestealBonus),
    combatRange: isMelee ? 'melee' : 'ranged',
    meleeSuppressionMult,
    armorPen: ns.armorPen,
    heavyDmgPct: ns.heavyDmgPct,
    damageReduction: ns.damageReduction,
    dodgeChance: ns.dodgeChance,
    executeThreshold: ns.executeThreshold,
  }
}

export function rollDamage(
  atk: number,
  def: number,
  rng: Rng,
  critChance: number = BASE_CRIT_CHANCE,
  critMult: number = BASE_CRIT_MULT,
  armorPen: number = 0,
): { dmg: number; crit: boolean } {
  const variance = 0.85 + rng() * 0.3
  const crit = rng() < critChance
  const effectiveDef = Math.max(0, def * (1 - Math.min(0.85, armorPen)))
  const raw = atk * variance * (crit ? critMult : 1) - effectiveDef * 0.6
  return { dmg: Math.max(1, Math.round(raw)), crit }
}
