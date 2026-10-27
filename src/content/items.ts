import { REALM_INDEX_BY_ID } from './realms'

export type ItemKind = 'herb' | 'pill' | 'treasure'

/** Passive bonuses granted while at least one copy is owned. Multipliers: 0.2 = +20%. */
export interface TreasurePassive {
  hp?: number
  atk?: number
  def?: number
  qiRate?: number
}

export type PillEffect =
  | { kind: 'qiRateBuff'; mult: number; durationMs: number }
  | { kind: 'breakthroughBonus'; bonus: number }
  | { kind: 'instantQi'; fraction: number }
  | { kind: 'lifespan'; years: number }

export interface ItemDef {
  id: string
  name: string
  kind: ItemKind
  /** 1 = common ... 5 = legendary. Drives gathering weights and display. */
  tier: number
  description: string
  /** Realm needed before this herb can be gathered. */
  minRealmIndex: number
  /** Shop price in spirit stones; undefined = not sold. */
  price?: number
  effect?: PillEffect
  passive?: TreasurePassive
}

const MIN = 60_000

export const ITEMS: readonly ItemDef[] = [
  // Herbs
  { id: 'linh-thao', name: 'Linh Thảo', kind: 'herb', tier: 1, description: 'Cỏ linh mọc khắp nơi có linh khí.', minRealmIndex: 0, price: 10 },
  { id: 'huyet-tinh-chi', name: 'Huyết Tinh Chi', kind: 'herb', tier: 2, description: 'Nấm đỏ như máu, mọc trong hang sâu.', minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-4'], price: 50 },
  { id: 'tu-linh-chi', name: 'Tử Linh Chi', kind: 'herb', tier: 3, description: 'Linh chi tím trăm năm, dược lực nồng đậm.', minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-7'], price: 250 },
  { id: 'thien-tam-lien', name: 'Thiên Tâm Liên', kind: 'herb', tier: 4, description: 'Sen trời nở trên đỉnh núi tuyết.', minRealmIndex: REALM_INDEX_BY_ID['truc-co-1'], price: 1_500 },
  { id: 'cuu-chuyen-can', name: 'Cửu Chuyển Căn', kind: 'herb', tier: 5, description: 'Rễ thần mộc ngàn năm, cực kỳ hiếm.', minRealmIndex: REALM_INDEX_BY_ID['kim-dan-1'], price: 10_000 },
  // Pills
  { id: 'tu-khi-dan', name: 'Tụ Khí Đan', kind: 'pill', tier: 1, description: 'Lập tức bổ sung 10% linh khí cần cho đột phá.', minRealmIndex: 0, effect: { kind: 'instantQi', fraction: 0.1 } },
  { id: 'ngung-than-dan', name: 'Ngưng Thần Đan', kind: 'pill', tier: 2, description: 'Tốc độ tu luyện x2 trong 5 phút.', minRealmIndex: 0, effect: { kind: 'qiRateBuff', mult: 2, durationMs: 5 * MIN } },
  { id: 'pha-canh-dan', name: 'Phá Cảnh Đan', kind: 'pill', tier: 3, description: 'Lần đột phá kế tiếp +15% tỉ lệ thành công.', minRealmIndex: 0, effect: { kind: 'breakthroughBonus', bonus: 0.15 } },
  { id: 'tang-tho-dan', name: 'Tăng Thọ Đan', kind: 'pill', tier: 4, description: 'Kéo dài thọ nguyên thêm 20 năm.', minRealmIndex: 0, effect: { kind: 'lifespan', years: 20 } },
  { id: 'kim-nguyen-dan', name: 'Kim Nguyên Đan', kind: 'pill', tier: 5, description: 'Lần đột phá kế tiếp +30% tỉ lệ thành công.', minRealmIndex: 0, effect: { kind: 'breakthroughBonus', bonus: 0.3 } },
  // Treasures (pháp bảo): passive while owned, never consumed
  { id: 'thiet-kiem', name: 'Thiết Kiếm', kind: 'treasure', tier: 1, description: 'Kiếm sắt thường, nhưng có còn hơn không.', minRealmIndex: 0, passive: { atk: 0.2 } },
  { id: 'huyen-quy-giap', name: 'Huyền Quy Giáp', kind: 'treasure', tier: 2, description: 'Giáp làm từ mai rùa đen, cứng như đá.', minRealmIndex: 0, passive: { def: 0.3, hp: 0.15 } },
  { id: 'ngung-than-phu', name: 'Ngưng Thần Phù', kind: 'treasure', tier: 2, description: 'Bùa giúp tâm thần ngưng tụ khi tu luyện.', minRealmIndex: 0, passive: { qiRate: 0.08 } },
  { id: 'bang-tam-chau', name: 'Băng Tâm Châu', kind: 'treasure', tier: 3, description: 'Viên châu lạnh buốt, hộ thể cực tốt.', minRealmIndex: 0, passive: { hp: 0.3, def: 0.2 } },
  { id: 'phi-kiem-tu-vi', name: 'Phi Kiếm Tử Vi', kind: 'treasure', tier: 4, description: 'Phi kiếm ngự không, chém sắt như bùn.', minRealmIndex: 0, passive: { atk: 0.5 } },
  { id: 'thien-ma-giap', name: 'Thiên Ma Giáp', kind: 'treasure', tier: 5, description: 'Chiến giáp của Thiên Ma Tướng, nhuốm sát khí ngàn năm.', minRealmIndex: 0, passive: { hp: 0.4, atk: 0.3, def: 0.4, qiRate: 0.1 } },
]

export const ITEM_BY_ID: Readonly<Record<string, ItemDef>> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
)

export const HERBS: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'herb')
export const PILLS: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'pill')
export const TREASURES: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'treasure')
