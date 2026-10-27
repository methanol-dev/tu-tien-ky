import type { EnemyDef } from '@/content/dungeons'
import { TREASURES } from '@/content/items'
import { REALMS } from '@/content/realms'
import type { GameState, Rng } from './types'

export interface CombatStats {
  hp: number
  atk: number
  def: number
}

export const COMBAT_MAX_ROUNDS = 200
/** Fraction of max HP recovered between waves. */
export const WAVE_REGEN = 0.1
export const CRIT_CHANCE = 0.1
export const CRIT_MULT = 1.5

/** Baseline combat stats grow with realm; owned treasures multiply them. */
export function getCombatStats(state: GameState): CombatStats {
  const p = REALMS[Math.min(state.realmIndex, REALMS.length - 1)].qiRate
  let hpMult = 1
  let atkMult = 1
  let defMult = 1
  for (const t of TREASURES) {
    if ((state.inventory[t.id] ?? 0) > 0 && t.passive) {
      hpMult += t.passive.hp ?? 0
      atkMult += t.passive.atk ?? 0
      defMult += t.passive.def ?? 0
    }
  }
  return {
    hp: Math.round((100 + 40 * p) * hpMult),
    atk: Math.round((10 + 4 * p) * atkMult),
    def: Math.round((2 + p) * defMult),
  }
}

export function rollDamage(atk: number, def: number, rng: Rng): { dmg: number; crit: boolean } {
  const variance = 0.85 + rng() * 0.3
  const crit = rng() < CRIT_CHANCE
  const raw = atk * variance * (crit ? CRIT_MULT : 1) - def * 0.6
  return { dmg: Math.max(1, Math.round(raw)), crit }
}

export interface WaveResult {
  enemy: string
  boss: boolean
  rounds: number
  won: boolean
  hpAfter: number
}

export interface CombatReport {
  victory: boolean
  playerMax: number
  playerHpLeft: number
  waves: WaveResult[]
  /** Human-readable round-by-round log, trimmed to the tail. */
  log: string[]
}

const LOG_LIMIT = 60

/** Deterministic given `rng`. Player fights enemies in order, regenerating a bit between waves. */
export function simulateCombat(player: CombatStats, enemies: EnemyDef[], rng: Rng): CombatReport {
  let hp = player.hp
  const waves: WaveResult[] = []
  const log: string[] = []
  const say = (s: string) => {
    log.push(s)
    if (log.length > LOG_LIMIT) log.shift()
  }

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i]
    let ehp = e.hp
    let rounds = 0
    say(`${e.boss ? '👹 ' : ''}${e.name} xuất hiện (HP ${e.hp}).`)
    while (hp > 0 && ehp > 0 && rounds < COMBAT_MAX_ROUNDS) {
      rounds++
      const mine = rollDamage(player.atk, e.def, rng)
      ehp -= mine.dmg
      say(`Hiệp ${rounds}: ngươi đánh ${mine.dmg}${mine.crit ? ' (bạo kích!)' : ''}, ${e.name} còn ${Math.max(0, ehp)}.`)
      if (ehp <= 0) break
      const theirs = rollDamage(e.atk, player.def, rng)
      hp -= theirs.dmg
      say(`Hiệp ${rounds}: ${e.name} đánh ${theirs.dmg}${theirs.crit ? ' (bạo kích!)' : ''}, ngươi còn ${Math.max(0, hp)}.`)
    }
    const won = ehp <= 0 && hp > 0
    waves.push({ enemy: e.name, boss: Boolean(e.boss), rounds, won, hpAfter: Math.max(0, hp) })
    if (!won) {
      say(`Ngươi gục ngã trước ${e.name}.`)
      return { victory: false, playerMax: player.hp, playerHpLeft: 0, waves, log }
    }
    say(`${e.name} bị hạ sau ${rounds} hiệp.`)
    if (i < enemies.length - 1) {
      hp = Math.min(player.hp, hp + Math.round(player.hp * WAVE_REGEN))
    }
  }
  return { victory: true, playerMax: player.hp, playerHpLeft: hp, waves, log }
}
