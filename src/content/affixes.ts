/** Gear affixes (thuộc tính). Values are fractions: 0.1 = +10%. */
import type { GearSlot } from './gear'

export type AffixKey =
  | 'atk'
  | 'hp'
  | 'def'
  | 'crit'
  | 'critDmg'
  | 'atkSpeed'
  | 'lifesteal'
  | 'qiRate'
  | 'stoneRate'
  | 'lootChance'

export interface AffixDef {
  key: AffixKey
  name: string
  /** Value range at tier 1; scaled by `affixTierMult`. */
  min: number
  max: number
  slots: GearSlot[]
  weight: number
}

export const AFFIXES: readonly AffixDef[] = [
  { key: 'atk', name: 'Công', min: 0.05, max: 0.15, slots: ['kiem', 'giap', 'phap-khi'], weight: 10 },
  { key: 'hp', name: 'Khí huyết', min: 0.06, max: 0.18, slots: ['kiem', 'giap', 'phap-khi'], weight: 10 },
  { key: 'def', name: 'Thủ', min: 0.06, max: 0.18, slots: ['kiem', 'giap', 'phap-khi'], weight: 8 },
  { key: 'crit', name: 'Bạo kích', min: 0.02, max: 0.06, slots: ['kiem', 'phap-khi'], weight: 6 },
  { key: 'critDmg', name: 'Bạo thương', min: 0.1, max: 0.3, slots: ['kiem'], weight: 5 },
  { key: 'atkSpeed', name: 'Thân pháp', min: 0.04, max: 0.12, slots: ['kiem', 'phap-khi'], weight: 6 },
  { key: 'lifesteal', name: 'Hấp huyết', min: 0.02, max: 0.06, slots: ['kiem', 'giap'], weight: 4 },
  { key: 'qiRate', name: 'Linh khí', min: 0.02, max: 0.06, slots: ['giap', 'phap-khi'], weight: 4 },
  { key: 'stoneRate', name: 'Tụ bảo', min: 0.03, max: 0.1, slots: ['phap-khi'], weight: 4 },
  { key: 'lootChance', name: 'Cơ duyên', min: 0.05, max: 0.15, slots: ['giap', 'phap-khi'], weight: 4 },
]

export const AFFIX_BY_KEY: Readonly<Record<AffixKey, AffixDef>> = Object.fromEntries(AFFIXES.map((a) => [a.key, a])) as Record<AffixKey, AffixDef>

/** Higher-tier regions roll bigger numbers. Tier 1 = x1, tier 9 = x2.2. */
export function affixTierMult(tier: number): number {
  return 1 + 0.15 * (Math.max(1, tier) - 1)
}

export type Rarity = 'pham' | 'linh' | 'bao' | 'tien' | 'than'
export const RARITIES: readonly Rarity[] = ['pham', 'linh', 'bao', 'tien', 'than']
export const RARITY_NAME: Record<Rarity, string> = { pham: 'Phàm', linh: 'Linh', bao: 'Bảo', tien: 'Tiên', than: 'Thần' }
export const RARITY_RANK: Record<Rarity, number> = { pham: 0, linh: 1, bao: 2, tien: 3, than: 4 }
export const AFFIX_COUNT: Record<Rarity, number> = { pham: 1, linh: 2, bao: 3, tien: 4, than: 5 }
/** Salvage value in seconds of current stone income. */
export const SALVAGE_SECONDS: Record<Rarity, number> = { pham: 5, linh: 15, bao: 45, tien: 120, than: 300 }

export type ChestKind = 'normal' | 'red'

/** Rarity weights per chest kind and difficulty (index 0..3). Order follows RARITIES. */
export const RARITY_TABLE: Record<ChestKind, readonly (readonly number[])[]> = {
  normal: [
    [60, 30, 9, 1, 0],
    [45, 35, 16, 3.5, 0.5],
    [30, 38, 24, 7, 1],
    [20, 35, 30, 12, 3],
  ],
  red: [
    [10, 40, 38, 10, 2],
    [5, 30, 42, 18, 5],
    [0, 20, 42, 28, 10],
    [0, 10, 38, 35, 17],
  ],
}
