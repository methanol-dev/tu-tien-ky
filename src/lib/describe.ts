import type { TechniqueDef } from '@/content/techniques'
import type { PillEffect } from '@/content/items'
import { getTechniqueEffectiveValue, getTechniqueMilestoneMultiplier } from '@/engine/techniques'
import { formatDurationMs } from './format'

const pct = (v: number) => `${Math.round(v * 100)}%`

/** Human description of a technique's effect at a given level. */
export function describeTechniqueEffect(def: TechniqueDef, level: number): string {
  const cur = getTechniqueEffectiveValue(def, level)
  const mult = getTechniqueMilestoneMultiplier(level)
  const milestoneSuffix = mult > 1 ? ` [x${mult} đột phá]` : ''

  switch (def.effect) {
    case 'qiRateMult':
      return `Tốc độ tu luyện +${pct(def.perLevel)}/tầng (hiện +${pct(cur)}${milestoneSuffix})`
    case 'stoneRateMult':
      return `Linh thạch +${pct(def.perLevel)}/tầng (hiện +${pct(cur)}${milestoneSuffix})`
    case 'breakthroughBonus':
      return `Tỉ lệ đột phá +${pct(def.perLevel)}/tầng (hiện +${pct(cur)}${milestoneSuffix})`
    case 'failPenaltyMult':
      return `Tổn hao khi thất bại -${pct(def.perLevel)}/tầng (hiện -${pct(cur)}${milestoneSuffix})`
    case 'meditateSeconds':
      return `Mỗi lần vận công +${def.perLevel}s linh khí (hiện +${cur}s${milestoneSuffix})`
    case 'offlineCapHours':
      return `Bế quan tối đa +${def.perLevel} giờ/tầng (hiện +${cur} giờ${milestoneSuffix})`
  }
}

export function describePillEffect(fx: PillEffect): string {
  switch (fx.kind) {
    case 'instantQi':
      return `+${pct(fx.fraction)} linh khí cần đột phá`
    case 'qiRateBuff':
      return `Tu luyện x${fx.mult} trong ${formatDurationMs(fx.durationMs)}`
    case 'breakthroughBonus':
      return `Đột phá kế tiếp +${pct(fx.bonus)}`
    case 'lifespan':
      return `Thọ nguyên +${fx.years} năm`
  }
}

export const TIER_CLASS: Record<number, string> = {
  1: 'text-paper-300 border-paper-400/20',
  2: 'text-jade-400 border-jade-500/40',
  3: 'text-qi-400 border-qi-500/40',
  4: 'text-gold-400 border-gold-500/40',
  5: 'text-vermilion-400 border-vermilion-500/50',
}
