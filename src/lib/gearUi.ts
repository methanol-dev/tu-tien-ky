import { AFFIX_BY_KEY, type Rarity, RARITY_NAME } from '@/content/affixes'
import type { Affix } from '@/engine'

/** Text + border classes per rarity, mirroring TIER_CLASS for herbs/pills. */
export const RARITY_CLASS: Record<Rarity, string> = {
  pham: 'text-paper-300 border-paper-400/20',
  linh: 'text-jade-400 border-jade-500/40',
  bao: 'text-qi-400 border-qi-500/40',
  tien: 'text-gold-400 border-gold-500/50',
  than: 'text-vermilion-400 border-vermilion-500/60',
}

export const RARITY_BG: Record<Rarity, string> = {
  pham: 'bg-ink-800/60',
  linh: 'bg-jade-500/5',
  bao: 'bg-qi-500/5',
  tien: 'bg-gold-500/5',
  than: 'bg-vermilion-500/5',
}

export function rarityLabel(r: Rarity): string {
  return RARITY_NAME[r]
}

export function describeAffix(a: Affix): string {
  const def = AFFIX_BY_KEY[a.key]
  return `${def.name} +${Math.round(a.value * 1000) / 10}%`
}
