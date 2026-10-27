import { MAJOR_REALM_DEFS, REALMS, type RealmStage } from '@/content/realms'
import { getCombatStats } from './combat'
import {
  TRIBULATION_BASE_FRACTION,
  TRIBULATION_DODGE_CHANCE,
  TRIBULATION_DODGE_FAIL_MULT,
  TRIBULATION_FAIL_QI_LOSS,
  TRIBULATION_INJURY_MS,
  TRIBULATION_MAX_BOLTS,
  TRIBULATION_MAX_REDUCTION,
  TRIBULATION_MIN_BOLTS,
  TRIBULATION_PILL_ITEM,
  TRIBULATION_PILL_MULT,
  TRIBULATION_STEP_FRACTION,
} from './constants'
import { getItemCount, removeItems } from './inventory'
import { pushLog } from './log'
import { getModifiers } from './modifiers'
import type { ActionResult, GameState, Rng } from './types'

export type TribulationAction = 'tank' | 'dodge' | 'pill'

/** Kim Đan = 3 bolts, one more per major realm after that, capped. */
export function getTribulationBolts(to: RealmStage): number {
  const majorIdx = MAJOR_REALM_DEFS.findIndex((d) => d.id === to.majorId)
  const kimDanIdx = MAJOR_REALM_DEFS.findIndex((d) => d.id === 'kim-dan')
  return Math.min(TRIBULATION_MAX_BOLTS, TRIBULATION_MIN_BOLTS + Math.max(0, majorIdx - kimDanIdx))
}

export function getBoltFraction(index: number): number {
  return TRIBULATION_BASE_FRACTION + TRIBULATION_STEP_FRACTION * index
}

/** Begin a tribulation towards `to`. Consumes the pending pill bonus as damage reduction. */
export function startTribulation(state: GameState, to: RealmStage): GameState {
  const { hp } = getCombatStats(state)
  const reduction = Math.min(
    TRIBULATION_MAX_REDUCTION,
    getModifiers(state).breakthroughBonus + state.pendingBreakthroughBonus,
  )
  const bolts = getTribulationBolts(to)
  let next: GameState = {
    ...state,
    pendingBreakthroughBonus: 0,
    tribulation: {
      toRealmIndex: REALMS.indexOf(to),
      bolts,
      current: 0,
      hp,
      maxHp: hp,
      reduction,
      log: [`Mây đen kéo tới, ${bolts} đạo thiên lôi đang ngưng tụ.`],
    },
  }
  next = pushLog(next, `Thiên kiếp giáng xuống! ${bolts} đạo lôi đình chắn giữa ngươi và ${to.name}.`, 'danger')
  return next
}

export function canUseTribulationPill(state: GameState): boolean {
  return getItemCount(state, TRIBULATION_PILL_ITEM) > 0
}

export interface BoltResult {
  state: GameState
  damage: number
  dodged: boolean
  /** True once the tribulation ended (either way). */
  finished: boolean
  /** Set when finished. */
  success: boolean | null
}

export function resolveBolt(state: GameState, action: TribulationAction, rng: Rng): ActionResult<BoltResult> {
  const t = state.tribulation
  if (!t) return { ok: false, error: 'Không có thiên kiếp nào' }
  if (action === 'pill' && !canUseTribulationPill(state)) return { ok: false, error: 'Không còn đan hộ thể' }

  let next: GameState = state
  const variance = 0.8 + rng() * 0.4
  let damage = t.maxHp * getBoltFraction(t.current) * variance * (1 - t.reduction)
  let dodged = false
  let line: string

  if (action === 'dodge') {
    if (rng() < TRIBULATION_DODGE_CHANCE) {
      damage = 0
      dodged = true
    } else {
      damage *= TRIBULATION_DODGE_FAIL_MULT
    }
  } else if (action === 'pill') {
    next = removeItems(next, { [TRIBULATION_PILL_ITEM]: 1 })
    damage *= TRIBULATION_PILL_MULT
  }
  damage = Math.round(damage)
  const hp = Math.max(0, t.hp - damage)
  const n = t.current + 1
  if (dodged) line = `Đạo lôi thứ ${n}: ngươi né được, sét đánh trúng tảng đá sau lưng.`
  else if (action === 'pill') line = `Đạo lôi thứ ${n}: dược lực hộ thể, chỉ mất ${damage} khí huyết.`
  else if (action === 'dodge') line = `Đạo lôi thứ ${n}: né hụt! Sét quật thẳng, mất ${damage} khí huyết.`
  else line = `Đạo lôi thứ ${n}: ngạnh kháng, mất ${damage} khí huyết.`

  const log = [...t.log, line]

  if (hp <= 0) {
    const others = next.buffs.filter((b) => b.id !== 'trong-thuong' && b.expiresAtMs > next.playedMs)
    next = {
      ...next,
      tribulation: null,
      qi: next.qi * (1 - TRIBULATION_FAIL_QI_LOSS),
      buffs: [...others, { id: 'trong-thuong', name: 'Trọng thương', qiRateMult: 0.5, expiresAtMs: next.playedMs + TRIBULATION_INJURY_MS }],
      stats: { ...next.stats, tribulationsFailed: next.stats.tribulationsFailed + 1, breakthroughFailures: next.stats.breakthroughFailures + 1 },
    }
    next = pushLog(next, 'Độ kiếp thất bại. Ngươi bị thiên lôi đánh trọng thương, linh khí tản mất một nửa.', 'danger')
    return { ok: true, state: { state: next, damage, dodged, finished: true, success: false } }
  }

  if (n >= t.bolts) {
    const to = REALMS[t.toRealmIndex]
    next = {
      ...next,
      tribulation: null,
      realmIndex: t.toRealmIndex,
      qi: 0,
      stats: { ...next.stats, tribulationsPassed: next.stats.tribulationsPassed + 1, breakthroughs: next.stats.breakthroughs + 1 },
    }
    next = pushLog(next, `Mây tan, trời quang. Độ kiếp thành công, tiến vào ${to.name}!`, 'success')
    next = pushLog(next, `Thọ nguyên tăng lên ${to.lifespanYears} năm.`, 'info')
    return { ok: true, state: { state: next, damage, dodged, finished: true, success: true } }
  }

  next = { ...next, tribulation: { ...t, current: n, hp, log } }
  return { ok: true, state: { state: next, damage, dodged, finished: false, success: null } }
}
