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
    name: 'Khí Thao Long Diêu',
    description: 'Thao luyện thổ nạp khi gánh nước nung gốm ở lò rồng ngõ Nê Bình, dẫn linh khí nhập kinh mạch.',
    effect: 'qiRateMult',
    perLevel: 0.1,
    maxLevel: 10,
    baseCost: 50,
    costGrowth: 1.9,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-1'],
  },
  {
    id: 'ngu-khi-thuat',
    name: 'Hám Sơn Quyền Phổ',
    description: 'Quyền pháp võ đạo nhập môn do tiền bối truyền thụ, mỗi quyền đánh ra chấn động khí huyết và linh khí.',
    effect: 'meditateSeconds',
    perLevel: 0.25,
    maxLevel: 10,
    baseCost: 150,
    costGrowth: 1.8,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-2'],
  },
  {
    id: 'tu-linh-tran',
    name: 'Tụ Khí Lạc Phách',
    description: 'Phương pháp tích khí bế quan trên đỉnh Lạc Phách Sơn, giúp kéo dài thời gian tu luyện khi rời mạng.',
    effect: 'offlineCapHours',
    perLevel: 1,
    maxLevel: 8,
    baseCost: 200,
    costGrowth: 2.0,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-3'],
  },
  {
    id: 'thanh-tam-chu',
    name: 'Văn Đảm Thuần Lương',
    description: 'Đạo tâm vững như bàn thạch, tri hành hợp nhất, giúp tăng xác suất đột phá cảnh giới kế tiếp.',
    effect: 'breakthroughBonus',
    perLevel: 0.02,
    maxLevel: 10,
    baseCost: 300,
    costGrowth: 1.9,
    minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-5'],
  },
  {
    id: 'tu-bao-quyet',
    name: 'Tàng Bảo Kiếm Các',
    description: 'Bí quyết quản lý ngân quỹ tông môn của Lạc Phách Sơn, tăng thu hoạch linh thạch và tự mở rương.',
    effect: 'stoneRateMult',
    perLevel: 0.15,
    maxLevel: 10,
    baseCost: 1_500,
    costGrowth: 1.9,
    minRealmIndex: REALM_INDEX_BY_ID['truc-co-1'],
  },
  {
    id: 'kim-cuong-bat-hoai',
    name: 'Thập Thất Bách Quyền',
    description: 'Võ phu rèn giũa nhục thân qua hàng ngàn quyền, giảm thiểu hao tổn khi nghịch thiên đột phá thất bại.',
    effect: 'failPenaltyMult',
    perLevel: 0.05,
    maxLevel: 10,
    baseCost: 2_000,
    costGrowth: 2.0,
    minRealmIndex: REALM_INDEX_BY_ID['truc-co-2'],
  },
  {
    id: 'thai-thuong-vong-tinh-luc',
    name: 'Kiếm Ý Trường Thành',
    description: 'Kiếm ý vắt ngang trời đất đúc từ ngàn năm chiến hỏa Kiếm Khí Trường Thành, tốc độ tu vi tăng vọt.',
    effect: 'qiRateMult',
    perLevel: 0.25,
    maxLevel: 10,
    baseCost: 50_000,
    costGrowth: 2.4,
    minRealmIndex: REALM_INDEX_BY_ID['kim-dan-1'],
  },
]

export const TECHNIQUE_BY_ID: Readonly<Record<string, TechniqueDef>> = Object.fromEntries(
  TECHNIQUES.map((t) => [t.id, t]),
)
