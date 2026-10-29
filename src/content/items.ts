import { REALM_INDEX_BY_ID } from './realms'

export type ItemKind = 'herb' | 'pill' | 'currency' | 'material' | 'manual'

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
  /** Giá trị quy đổi trực tiếp ra Linh Thạch khi sử dụng đồng tiền này. */
  currencyValue?: number
  /** Id công pháp nhận được hoặc tăng cấp khi sử dụng sách bí kíp này. */
  techniqueId?: string
}

const MIN = 60_000

export const ITEMS: readonly ItemDef[] = [
  // Herbs (Linh Thảo & Dược Liệu theo vùng)
  { id: 'linh-thao', name: 'Linh Thảo', kind: 'herb', tier: 1, description: 'Cỏ linh mọc khắp nơi có linh khí.', minRealmIndex: 0, price: 10 },
  { id: 'huyet-tinh-chi', name: 'Huyết Tinh Chi', kind: 'herb', tier: 2, description: 'Nấm đỏ như máu, mọc trong hang sâu.', minRealmIndex: REALM_INDEX_BY_ID['thao-can-1'], price: 50 },
  { id: 'tu-linh-chi', name: 'Tử Linh Chi', kind: 'herb', tier: 3, description: 'Linh chi tím trăm năm, dược lực nồng đậm.', minRealmIndex: REALM_INDEX_BY_ID['lieu-can-1'], price: 250 },
  { id: 'thien-tam-lien', name: 'Thiên Tâm Liên', kind: 'herb', tier: 4, description: 'Sen trời nở trên đỉnh núi tuyết.', minRealmIndex: REALM_INDEX_BY_ID['khi-cot-1'], price: 1_500 },
  { id: 'cuu-chuyen-can', name: 'Cửu Chuyển Căn', kind: 'herb', tier: 5, description: 'Rễ thần mộc ngàn năm, cực kỳ hiếm.', minRealmIndex: REALM_INDEX_BY_ID['dong-phu-1'], price: 10_000 },
  { id: 'hoa-diem-thao', name: 'Hỏa Diệm Thảo', kind: 'herb', tier: 2, description: 'Linh thảo sinh trưởng nơi địa hỏa hừng hực, chứa hỏa linh khí dồi dào.', minRealmIndex: REALM_INDEX_BY_ID['dong-bi-2'], price: 80 },
  { id: 'huyen-bang-hoa', name: 'Huyền Băng Hoa', kind: 'herb', tier: 3, description: 'Đóa hoa băng kết tinh vạn năm nơi Bắc Câu Lô Châu quanh năm tuyết trắng.', minRealmIndex: REALM_INDEX_BY_ID['lieu-can-1'], price: 300 },
  { id: 'kiem-y-thao', name: 'Kiếm Ý Thảo', kind: 'herb', tier: 4, description: 'Linh thảo sinh ra từ máu và kiếm khí ngưng đọng dưới chân Kiếm Khí Trường Thành.', minRealmIndex: REALM_INDEX_BY_ID['khi-cot-1'], price: 2_000 },

  // Pills (Đan Dược)
  { id: 'tu-khi-dan', name: 'Tụ Khí Đan', kind: 'pill', tier: 1, description: 'Lập tức bổ sung 10% linh khí cần cho đột phá.', minRealmIndex: 0, effect: { kind: 'instantQi', fraction: 0.1 } },
  { id: 'ngung-than-dan', name: 'Ngưng Thần Đan', kind: 'pill', tier: 2, description: 'Tốc độ tu luyện x2 trong 5 phút.', minRealmIndex: 0, effect: { kind: 'qiRateBuff', mult: 2, durationMs: 5 * MIN } },
  { id: 'pha-canh-dan', name: 'Phá Cảnh Đan', kind: 'pill', tier: 3, description: 'Lần đột phá kế tiếp +15% tỉ lệ thành công.', minRealmIndex: 0, effect: { kind: 'breakthroughBonus', bonus: 0.15 } },
  { id: 'tang-tho-dan', name: 'Tăng Thọ Đan', kind: 'pill', tier: 4, description: 'Kéo dài thọ nguyên thêm 20 năm.', minRealmIndex: 0, effect: { kind: 'lifespan', years: 20 } },
  { id: 'kim-nguyen-dan', name: 'Kim Nguyên Đan', kind: 'pill', tier: 5, description: 'Lần đột phá kế tiếp +30% tỉ lệ thành công.', minRealmIndex: 0, effect: { kind: 'breakthroughBonus', bonus: 0.3 } },

  // Currencies (Tiền Thần Tiên Kiếm Lai)
  {
    id: 'tuyet-hoa-tien',
    name: 'Tuyết Hoa Tiền',
    kind: 'currency',
    tier: 2,
    description: 'Đồng tiền thần tiên cấp thấp tinh khiết như hoa tuyết. Sử dụng để đổi lấy 1.000 Linh Thạch.',
    minRealmIndex: 0,
    currencyValue: 1_000,
  },
  {
    id: 'tieu-thu-tien',
    name: 'Tiểu Thử Tiền',
    kind: 'currency',
    tier: 4,
    description: 'Đồng tiền thần tiên trung phẩm ấm áp dồi dào dương khí. Sử dụng để đổi lấy 100.000 Linh Thạch.',
    minRealmIndex: 0,
    currencyValue: 100_000,
  },
  {
    id: 'coc-vu-tien',
    name: 'Cốc Vũ Tiền',
    kind: 'currency',
    tier: 5,
    description: 'Đồng tiền thần tiên thượng phẩm quý hiếm bậc nhất thế gian. Sử dụng để đổi lấy 10.000.000 Linh Thạch.',
    minRealmIndex: 0,
    currencyValue: 10_000_000,
  },

  // Materials & Yêu Đan (Nguyên Liệu Luyện Khí & Yêu Thú Tinh Hoa)
  {
    id: 'yeu-dan-ha-pham',
    name: 'Yêu Đan Hạ Phẩm',
    kind: 'material',
    tier: 1,
    description: 'Tinh hạch ngưng tụ linh lực của yêu thú sơ kỳ, dược dẫn quý giá cho đan dược sơ cấp.',
    minRealmIndex: 0,
    price: 30,
  },
  {
    id: 'yeu-dan-trung-pham',
    name: 'Yêu Đan Trung Phẩm',
    kind: 'material',
    tier: 3,
    description: 'Nội đan trăm năm của đầu mục yêu ma, dùng để luyện chế bảo đan đột phá.',
    minRealmIndex: REALM_INDEX_BY_ID['lieu-can-1'],
    price: 400,
  },
  {
    id: 'yeu-dan-thuong-pham',
    name: 'Yêu Đan Thượng Phẩm',
    kind: 'material',
    tier: 5,
    description: 'Đại yêu nội đan ngàn năm hấp thu tinh hoa nhật nguyệt, ẩn chứa yêu lực kinh thiên động địa.',
    minRealmIndex: REALM_INDEX_BY_ID['dong-phu-1'],
    price: 15_000,
  },
  {
    id: 'thuy-tinh-chau',
    name: 'Thủy Tinh Châu',
    kind: 'material',
    tier: 2,
    description: 'Hạt châu ngưng kết từ tinh hoa nước Thư Giản Hồ, tỏa ra hơi nước man mác.',
    minRealmIndex: REALM_INDEX_BY_ID['thao-can-1'],
    price: 120,
  },
  {
    id: 'kiem-khi-tinh-thach',
    name: 'Kiếm Khí Tinh Thạch',
    kind: 'material',
    tier: 4,
    description: 'Khoáng thạch hấp thụ vô số kiếm ý vương vãi nơi chiến trường Kiếm Khí Trường Thành.',
    minRealmIndex: REALM_INDEX_BY_ID['khi-cot-1'],
    price: 3_000,
  },

  // Manuals (Sách Thần Thông & Tàn Quyển Bí Tịch Rơi Độc Quyền)
  {
    id: 'tan-quyen-kiem-pho',
    name: 'Sơ Thập Kiếm Phổ (Tàn Quyển)',
    kind: 'manual',
    tier: 3,
    description: 'Cuộn da cừu ghi chép tàn thiên kiếm phổ mười thức kiếm đạo. Sử dụng để lĩnh ngộ hoặc nâng cấp Sơ Thập Kiếm Phổ.',
    minRealmIndex: 0,
    techniqueId: 'so-thap-kiem-pho',
  },
  {
    id: 'quyen-kinh-tham-sau',
    name: 'Thập Cửu Quyền Phổ (Chân Truyền)',
    kind: 'manual',
    tier: 4,
    description: 'Bản dập cổ xưa ghi lại tinh túy quyền ý nghịch thiên phá cảnh. Sử dụng để lĩnh ngộ hoặc nâng cấp Thập Cửu Quyền Phổ.',
    minRealmIndex: 0,
    techniqueId: 'thap-cuu-quyen-pho',
  },
  {
    id: 'loi-phap-bi-tich',
    name: 'Ngũ Lôi Đạo Chân Quyết',
    kind: 'manual',
    tier: 4,
    description: 'Bản thẻ tre Đạo gia khắc hoạ lôi vân dẫn lôi chú pháp. Sử dụng để lĩnh ngộ hoặc nâng cấp Ngũ Lôi Đạo Pháp.',
    minRealmIndex: 0,
    techniqueId: 'ngu-loi-chinh-phap',
  },
  {
    id: 'bach-thao-bi-yeu',
    name: 'Bách Thảo Bí Yếu',
    kind: 'manual',
    tier: 5,
    description: 'Bí điển thảo mộc đan đạo truyền thừa từ cổ phái. Sử dụng để lĩnh ngộ hoặc nâng cấp Bách Thảo Luyện Đan Kinh.',
    minRealmIndex: 0,
    techniqueId: 'bach-thao-kinh',
  },
]

export const ITEM_BY_ID: Readonly<Record<string, ItemDef>> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
)

export const HERBS: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'herb')
export const PILLS: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'pill')
export const CURRENCIES: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'currency')
export const MATERIALS: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'material')
export const MANUALS: readonly ItemDef[] = ITEMS.filter((i) => i.kind === 'manual')
