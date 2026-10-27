import { REALM_INDEX_BY_ID } from './realms'

export type TechniqueEffectKind =
  | 'qiRateMult' // +perLevel (additive) to qi multiplier
  | 'stoneRateMult' // +perLevel to spirit stone multiplier
  | 'breakthroughBonus' // +perLevel to breakthrough chance
  | 'failPenaltyMult' // -perLevel to the qi lost on failure (multiplicative)
  | 'meditateSeconds' // +perLevel seconds per tap
  | 'offlineCapHours' // +perLevel hours of offline progress

export interface TechniqueDef {
  id: string
  name: string
  description: string
  effect: TechniqueEffectKind
  perLevel: number
  maxLevel: number
  baseCost: number
  costGrowth: number
  minRealmIndex: number
}

export const TECHNIQUES: readonly TechniqueDef[] = [
  {
    id: 'dan-khi-quyet',
    name: 'Dẫn Khí Quyết',
    description: 'Công pháp nhập môn, dẫn linh khí trời đất vào kinh mạch.',
    effect: 'qiRateMult',
    perLevel: 0.1,
    maxLevel: 10,
    baseCost: 50,
    costGrowth: 1.6,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-1'],
  },
  {
    id: 'ngu-khi-thuat',
    name: 'Ngự Khí Thuật',
    description: 'Mỗi lần vận công chủ động hấp thu được nhiều linh khí hơn.',
    effect: 'meditateSeconds',
    perLevel: 1,
    maxLevel: 10,
    baseCost: 150,
    costGrowth: 1.6,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-2'],
  },
  {
    id: 'tu-linh-tran',
    name: 'Tụ Linh Trận',
    description: 'Bày trận trong động phủ, bế quan lâu hơn vẫn tụ được linh khí.',
    effect: 'offlineCapHours',
    perLevel: 1,
    maxLevel: 8,
    baseCost: 200,
    costGrowth: 1.8,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-3'],
  },
  {
    id: 'thanh-tam-chu',
    name: 'Thanh Tâm Chú',
    description: 'Giữ đạo tâm vững vàng, tăng tỉ lệ đột phá thành công.',
    effect: 'breakthroughBonus',
    perLevel: 0.02,
    maxLevel: 10,
    baseCost: 300,
    costGrowth: 1.7,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-5'],
  },
  {
    id: 'tu-bao-quyet',
    name: 'Tụ Bảo Quyết',
    description: 'Cảm ứng linh thạch trong đất đá, thu được nhiều linh thạch hơn.',
    effect: 'stoneRateMult',
    perLevel: 0.15,
    maxLevel: 10,
    baseCost: 1_500,
    costGrowth: 1.7,
    minRealmIndex: REALM_INDEX_BY_ID['truc-co-1'],
  },
  {
    id: 'kim-cuong-bat-hoai',
    name: 'Kim Cương Bất Hoại Thể',
    description: 'Thân thể cứng như kim cương, đột phá thất bại tổn hao ít linh khí hơn.',
    effect: 'failPenaltyMult',
    perLevel: 0.05,
    maxLevel: 10,
    baseCost: 2_000,
    costGrowth: 1.8,
    minRealmIndex: REALM_INDEX_BY_ID['truc-co-2'],
  },
  {
    id: 'thai-thuong-vong-tinh-luc',
    name: 'Thái Thượng Vong Tình Lục',
    description: 'Thượng cổ công pháp, quên tình tuyệt dục, tốc độ tu luyện tăng vọt.',
    effect: 'qiRateMult',
    perLevel: 0.25,
    maxLevel: 10,
    baseCost: 50_000,
    costGrowth: 2.0,
    minRealmIndex: REALM_INDEX_BY_ID['kim-dan-1'],
  },
]

export const TECHNIQUE_BY_ID: Readonly<Record<string, TechniqueDef>> = Object.fromEntries(
  TECHNIQUES.map((t) => [t.id, t]),
)
