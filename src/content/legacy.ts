/** Permanent upgrades bought with Đạo Vận, persisting across reincarnations. */
export type LegacyEffectKind =
  | 'qiRateMult' // +perLevel to qi multiplier
  | 'startRealm' // start the next life at Luyện Khí tầng <level>
  | 'lifespanYears' // +perLevel years
  | 'breakthroughBonus' // +perLevel chance / tribulation damage reduction
  | 'startStones' // start with perLevel*level spirit stones
  | 'keepTreasures' // treasures survive reincarnation
  | 'dualCultivation' // Mở khóa đạo cốt Kiếm Võ Song Tu khi bắt đầu kiếp mới

export interface LegacyUpgradeDef {
  id: string
  name: string
  description: string
  effect: LegacyEffectKind
  perLevel: number
  maxLevel: number
  baseCost: number
  costGrowth: number
}

export const LEGACY_UPGRADES: readonly LegacyUpgradeDef[] = [
  { id: 'tien-thien-linh-can', name: 'Tiên Thiên Linh Căn', description: 'Linh căn kiếp sau tinh thuần hơn, tu luyện nhanh hơn.', effect: 'qiRateMult', perLevel: 0.1, maxLevel: 20, baseCost: 2, costGrowth: 1.35 },
  { id: 'tuc-the-ky-uc', name: 'Túc Thế Ký Ức', description: 'Nhớ lại tu vi kiếp trước, khởi đầu ở Luyện Khí.', effect: 'startRealm', perLevel: 1, maxLevel: 9, baseCost: 3, costGrowth: 1.5 },
  { id: 'truong-sinh-the', name: 'Trường Sinh Chi Thể', description: 'Thọ nguyên mỗi kiếp dài hơn.', effect: 'lifespanYears', perLevel: 20, maxLevel: 10, baseCost: 2, costGrowth: 1.5 },
  { id: 'dao-tam-kien-co', name: 'Đạo Tâm Kiên Cố', description: 'Đột phá dễ hơn, thiên kiếp bớt đau.', effect: 'breakthroughBonus', perLevel: 0.01, maxLevel: 10, baseCost: 3, costGrowth: 1.5 },
  { id: 'tien-the-di-san', name: 'Tiền Thế Di Sản', description: 'Chôn linh thạch kiếp trước, kiếp sau đào lên.', effect: 'startStones', perLevel: 300, maxLevel: 10, baseCost: 2, costGrowth: 1.6 },
  { id: 'tang-bao-cac', name: 'Tàng Bảo Các', description: 'Pháp bảo đang mặc theo nguyên thần sang kiếp sau.', effect: 'keepTreasures', perLevel: 1, maxLevel: 1, baseCost: 8, costGrowth: 1 },
  { id: 'kiem-vo-song-tu', name: 'Kiếm Võ Song Tu Đạo Cốt', description: 'Dị số ngàn năm như Trần Bình An: Đồng thời tu luyện cả Cảnh Giới Võ Đạo lẫn Luyện Khí Sĩ.', effect: 'dualCultivation', perLevel: 1, maxLevel: 1, baseCost: 15, costGrowth: 1 },
]

export const LEGACY_BY_ID: Readonly<Record<string, LegacyUpgradeDef>> = Object.fromEntries(
  LEGACY_UPGRADES.map((u) => [u.id, u]),
)
