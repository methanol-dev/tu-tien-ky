/**
 * Gear (pháp bảo) definitions. A GearDef is a template; the engine rolls GearInstances
 * from it (see engine/gear). Named gear has fixed rarity and affixes and drops from bosses.
 */
import type { AffixKey, Rarity } from './affixes'

export type GearType =
  | 'vu-khi'
  | 'dau'
  | 'ao'
  | 'quan'
  | 'giay'
  | 'dai-lung'
  | 'phu-luc'
  | 'day-chuyen'
  | 'nhan'
  | 'bong-tai'

export const GEAR_TYPES: readonly GearType[] = [
  'vu-khi',
  'dau',
  'ao',
  'quan',
  'giay',
  'dai-lung',
  'phu-luc',
  'day-chuyen',
  'nhan',
  'bong-tai',
]

export type GearSlot =
  | 'vu-khi'
  | 'dau'
  | 'ao'
  | 'quan'
  | 'giay'
  | 'dai-lung'
  | 'phu-luc'
  | 'day-chuyen'
  | 'nhan-1'
  | 'nhan-2'
  | 'bong-tai-1'
  | 'bong-tai-2'

export const GEAR_SLOTS: readonly GearSlot[] = [
  'vu-khi',
  'dau',
  'ao',
  'quan',
  'giay',
  'dai-lung',
  'phu-luc',
  'day-chuyen',
  'nhan-1',
  'nhan-2',
  'bong-tai-1',
  'bong-tai-2',
]

export const SLOT_NAME: Record<GearSlot, string> = {
  'vu-khi': 'Vũ khí',
  dau: 'Đầu',
  ao: 'Áo',
  quan: 'Quần',
  giay: 'Giày',
  'dai-lung': 'Đai lưng',
  'phu-luc': 'Phù lục',
  'day-chuyen': 'Dây chuyền',
  'nhan-1': 'Nhẫn trái',
  'nhan-2': 'Nhẫn phải',
  'bong-tai-1': 'Hoa tai trái',
  'bong-tai-2': 'Hoa tai phải',
}

export const GEAR_TYPE_NAME: Record<GearType, string> = {
  'vu-khi': 'Vũ khí',
  dau: 'Mũ / Quán',
  ao: 'Áo / Giáp',
  quan: 'Quần / Khố',
  giay: 'Giày / Hài',
  'dai-lung': 'Đai lưng',
  'phu-luc': 'Phù lục',
  'day-chuyen': 'Dây chuyền',
  nhan: 'Nhẫn',
  'bong-tai': 'Bông tai',
}

export function getSlotsForType(type: GearType): GearSlot[] {
  if (type === 'nhan') return ['nhan-1', 'nhan-2']
  if (type === 'bong-tai') return ['bong-tai-1', 'bong-tai-2']
  return [type as GearSlot]
}

export function getTypeForSlot(slot: GearSlot): GearType {
  if (slot === 'nhan-1' || slot === 'nhan-2') return 'nhan'
  if (slot === 'bong-tai-1' || slot === 'bong-tai-2') return 'bong-tai'
  return slot as GearType
}

export interface GearDef {
  id: string
  slot: GearType
  name: string
  /** Single Hán glyph used as the item's "portrait". */
  glyph: string
  description: string
  /** Lowest tier at which this base drops. Ignored for named gear. */
  minTier: number
  /** Set id if this item belongs to a gear set (kích hoạt dòng ẩn bộ) */
  setId?: string
  /** Named gear: fixed rarity + affixes, never rolled randomly. */
  named?: { rarity: Rarity; affixes: { key: AffixKey; value: number }[] }
}

export const GEAR_DEFS: readonly GearDef[] = [
  // 1. VŨ KHÍ (slot: 'vu-khi')
  { id: 'thiet-kiem-tho', slot: 'vu-khi', name: 'Thiết Kiếm', glyph: '🗡️', description: 'Kiếm sắt rèn thô, có còn hơn không.', minTier: 1 },
  { id: 'thanh-cuong-kiem', slot: 'vu-khi', name: 'Thanh Cương Kiếm', glyph: '🗡️', description: 'Thép xanh trăm luyện, lưỡi sắc lạnh.', minTier: 3 },
  { id: 'linh-kiem', slot: 'vu-khi', name: 'Linh Kiếm', glyph: '🗡️', description: 'Kiếm có linh tính, hợp với linh khí người cầm.', minTier: 5 },
  { id: 'phi-kiem', slot: 'vu-khi', name: 'Phi Kiếm', glyph: '🗡️', description: 'Ngự kiếm phi hành, chém địch ngoài trăm bước.', minTier: 7 },
  { id: 'tien-kiem', slot: 'vu-khi', name: 'Tiên Kiếm', glyph: '🗡️', description: 'Kiếm khí nối trời, một kiếm phá vạn pháp.', minTier: 9 },

  // 2. ĐẦU (slot: 'dau')
  { id: 'tho-bo-can', slot: 'dau', name: 'Thô Bố Cân', glyph: '👑', description: 'Khăn vải gai thô vấn tóc của thiếu niên.', minTier: 1 },
  { id: 'o-moc-tram', slot: 'dau', name: 'Ô Mộc Trâm', glyph: '👑', description: 'Trâm gỗ mun cài tóc, thanh tâm quả dục.', minTier: 3 },
  { id: 'huyen-thiet-quan', slot: 'dau', name: 'Huyền Thiết Quán', glyph: '👑', description: 'Đạo quán huyền thiết, tụ thần định phách.', minTier: 5 },
  { id: 'tu-kim-khoi', slot: 'dau', name: 'Tử Kim Khôi', glyph: '👑', description: 'Mũ giáp tử kim, đao thương khó chạm vào đầu.', minTier: 7 },
  { id: 'ngu-than-quan', slot: 'dau', name: 'Ngũ Thần Quán', glyph: '👑', description: 'Đạo miện ngũ thần, thấu hiểu quy tắc thiên địa.', minTier: 9 },

  // 3. ÁO (slot: 'ao')
  { id: 'bo-giap', slot: 'ao', name: 'Bố Giáp', glyph: '🥋', description: 'Áo vải độn bông, đỡ được vài vết cào.', minTier: 1 },
  { id: 'bi-giap', slot: 'ao', name: 'Bì Giáp', glyph: '🥋', description: 'Da yêu thú thuộc kỹ, dẻo dai khó rách.', minTier: 3 },
  { id: 'lan-giap', slot: 'ao', name: 'Lân Giáp', glyph: '🥋', description: 'Vảy giao long kết thành, nước lửa khó xâm.', minTier: 5 },
  { id: 'huyen-giap', slot: 'ao', name: 'Huyền Giáp', glyph: '🥋', description: 'Huyền thiết đen tuyền, nặng mà kín kẽ.', minTier: 7 },
  { id: 'tien-giap', slot: 'ao', name: 'Tiên Giáp', glyph: '🥋', description: 'Giáp tiên gia, kim quang hộ thể bất diệt.', minTier: 9 },

  // 4. QUẦN (slot: 'quan')
  { id: 'tho-bo-kho', slot: 'quan', name: 'Thô Bố Khố', glyph: '🩳', description: 'Quần vải thô xắn gấu chắc nịch.', minTier: 1 },
  { id: 'huyen-bi-kho', slot: 'quan', name: 'Huyền Bì Khố', glyph: '🩳', description: 'Quần da thuộc bền chắc, tiện bề di chuyển.', minTier: 3 },
  { id: 'linh-tam-kho', slot: 'quan', name: 'Linh Tàm Khố', glyph: '🩳', description: 'Quần tơ tằm linh mỏng nhẹ mà dẻo dai.', minTier: 5 },
  { id: 'hac-dieu-kho', slot: 'quan', name: 'Hắc Diệu Khố', glyph: '🩳', description: 'Chiến khố dệt từ hắc diệu thạch, phòng ngự tuyệt hảo.', minTier: 7 },
  { id: 'cuu-thien-chien-kho', slot: 'quan', name: 'Cửu Thiên Khố', glyph: '🩳', description: 'Hạ y cửu thiên tiên bảo, bước đi như lướt trên mây.', minTier: 9 },

  // 5. GIÀY (slot: 'giay')
  { id: 'thao-hai', slot: 'giay', name: 'Thảo Hài', glyph: '👢', description: 'Giày cỏ tự bện, chịu khó dặm trường dẻo dai.', minTier: 1 },
  { id: 'bi-ngoa', slot: 'giay', name: 'Bì Ngoa', glyph: '👢', description: 'Ủng da săn chắc, vượt đầm lầy gai góc.', minTier: 3 },
  { id: 'dap-van-ngoa', slot: 'giay', name: 'Đạp Vân Ngoa', glyph: '👢', description: 'Ủng đạp mây phiêu dật, bước chân nhẹ tựa lông hồng.', minTier: 5 },
  { id: 'ngu-phong-hai', slot: 'giay', name: 'Ngự Phong Hài', glyph: '👢', description: 'Hài ngự gió ngàn dặm, thân pháp xuất quỷ nhập thần.', minTier: 7 },
  { id: 'trich-tinh-bo-ly', slot: 'giay', name: 'Trích Tinh Ngoa', glyph: '👢', description: 'Giày trích tinh hái sao, một bước vượt thiên nhai.', minTier: 9 },

  // 6. ĐAI LƯNG (slot: 'dai-lung')
  { id: 'ma-thung-dai', slot: 'dai-lung', name: 'Ma Thừng Đái', glyph: '🎗️', description: 'Dây thừng gai buộc bụng cho gọn gàng thân thể.', minTier: 1 },
  { id: 'nguu-bi-dai', slot: 'dai-lung', name: 'Ngưu Bì Đái', glyph: '🎗️', description: 'Đai da trâu rừng thuộc kỹ nạm khóa đồng.', minTier: 3 },
  { id: 'linh-tam-thuc-dai', slot: 'dai-lung', name: 'Linh Tàm Đái', glyph: '🎗️', description: 'Thắt lưng lụa linh tàm chứa đựng khí tức an ổn.', minTier: 5 },
  { id: 'huyen-thiet-yeu-dai', slot: 'dai-lung', name: 'Huyền Thiết Đái', glyph: '🎗️', description: 'Đai lưng ghép từ vảy huyền thiết chắc nịch.', minTier: 7 },
  { id: 'can-khon-dai', slot: 'dai-lung', name: 'Càn Khôn Đái', glyph: '🎗️', description: 'Đai càn khôn thâu tóm linh khí đất trời.', minTier: 9 },

  // 7. PHÙ LỤC (slot: 'phu-luc')
  { id: 'moc-phu', slot: 'phu-luc', name: 'Mộc Phù', glyph: '📜', description: 'Bùa gỗ đào khắc chú, trừ tà sơ cấp.', minTier: 1 },
  { id: 'tran-ta-phu', slot: 'phu-luc', name: 'Trấn Tà Phù', glyph: '📜', description: 'Hoàng phù chu sa trấn áp yêu ma quỷ quái.', minTier: 3 },
  { id: 'ho-than-phu', slot: 'phu-luc', name: 'Hộ Thần Phù', glyph: '📜', description: 'Linh phù hộ vệ thần niệm, ngăn cản ma chướng.', minTier: 5 },
  { id: 'pha-giap-phu', slot: 'phu-luc', name: 'Phá Giáp Phù', glyph: '📜', description: 'Bùa phá tan cương khí hộ thể của cường địch.', minTier: 7 },
  { id: 'thai-hu-than-phu', slot: 'phu-luc', name: 'Thái Hư Phù', glyph: '📜', description: 'Bùa thái hư dẫn lôi đình thiên kiếp trảm sát.', minTier: 9 },

  // 8. DÂY CHUYỀN (slot: 'day-chuyen')
  { id: 'moc-chau-chuoi', slot: 'day-chuyen', name: 'Mộc Châu Chuỗi', glyph: '📿', description: 'Chuỗi hạt gỗ đào thơm nhẹ, xua đuổi tà khí.', minTier: 1 },
  { id: 'on-ngoc-boi', slot: 'day-chuyen', name: 'Ôn Ngọc Bội', glyph: '📿', description: 'Ngọc bội ôn nhuận áp sát lồng ngực, dưỡng tâm bổ khí.', minTier: 3 },
  { id: 'tu-linh-chau', slot: 'day-chuyen', name: 'Tụ Linh Châu', glyph: '📿', description: 'Viên ngọc tụ tập linh khí nhật nguyệt bốn mùa.', minTier: 5 },
  { id: 'ho-tam-kinh', slot: 'day-chuyen', name: 'Hộ Tâm Kính', glyph: '📿', description: 'Gương đồng hộ tâm chiếu rọi chân tướng tà đạo.', minTier: 7 },
  { id: 'cuu-long-toa', slot: 'day-chuyen', name: 'Cửu Long Tỏa', glyph: '📿', description: 'Dây chuyền khóa cửu long hộ mệnh thần thông uy mãnh.', minTier: 9 },

  // 9. NHẪN (slot: 'nhan')
  { id: 'dong-gioi', slot: 'nhan', name: 'Đồng Giới', glyph: '💍', description: 'Chiếc nhẫn đồng mộc mạc đeo ngón tay.', minTier: 1 },
  { id: 'bach-ngoc-gioi', slot: 'nhan', name: 'Bạch Ngọc Giới', glyph: '💍', description: 'Nhẫn bạch ngọc trừ uế, giữ thần niệm thông suốt.', minTier: 3 },
  { id: 'tinh-cuong-gioi', slot: 'nhan', name: 'Tinh Cương Giới', glyph: '💍', description: 'Nhẫn luyện từ cương khí, tăng uy lực đòn đánh.', minTier: 5 },
  { id: 'u-minh-gioi', slot: 'nhan', name: 'U Minh Giới', glyph: '💍', description: 'Nhẫn u minh phát ra hàn khí lạnh buốt, tăng bạo kích.', minTier: 7 },
  { id: 'can-khon-gioi', slot: 'nhan', name: 'Càn Khôn Giới', glyph: '💍', description: 'Chiếc nhẫn nạp giới chứa càn khôn uy lực khôn lường.', minTier: 9 },

  // 10. BÔNG TAI (slot: 'bong-tai')
  { id: 'dong-hoan', slot: 'bong-tai', name: 'Đồng Hoàn', glyph: '💎', description: 'Khuyên tai đồng bình dị của người thế tục.', minTier: 1 },
  { id: 'thanh-ngoc-nhi', slot: 'bong-tai', name: 'Thanh Ngọc Nhĩ', glyph: '💎', description: 'Hoa tai ngọc bích đong đưa, lắng nghe âm thanh gió.', minTier: 3 },
  { id: 'linh-te-dong', slot: 'bong-tai', name: 'Linh Tê Đổng', glyph: '💎', description: 'Khuyên tai linh tê tâm ý tương thông, tăng thân pháp.', minTier: 5 },
  { id: 'bang-phach-nhi', slot: 'bong-tai', name: 'Băng Phách Nhĩ', glyph: '💎', description: 'Bông tai kết từ băng phách nghìn năm, tâm cảnh bình lặng.', minTier: 7 },
  { id: 'thai-duong-nhi', slot: 'bong-tai', name: 'Thái Dương Nhĩ', glyph: '💎', description: 'Hoa tai ánh dương chói lọi thiêu đốt tà ma.', minTier: 9 },

  // ================= NAMED GEAR (CỐT TRUYỆN KIẾM LAI & SETS) =================
  // SET 1: Nê Bình Khởi Thủy (ne-binh)
  {
    id: 'thiet-kiem',
    slot: 'vu-khi',
    name: 'Hòe Mộc Kiếm',
    glyph: '🗡️',
    description: 'Kiếm gỗ hòe ngõ Nê Bình do Tề tiên sinh gọt tặng, khắc ba chữ bản mệnh trừ tà giữ đạo.',
    minTier: 1,
    setId: 'ne-binh',
    named: { rarity: 'linh', affixes: [{ key: 'atk', value: 0.2 }, { key: 'lifesteal', value: 0.03 }] },
  },
  {
    id: 'huyen-quy-giap',
    slot: 'ao',
    name: 'Trúc Y Bình An',
    glyph: '🥋',
    description: 'Áo đan từ cọng trúc dẻo dai của thiếu niên gùi trúc, mộc mạc mà vững chãi.',
    minTier: 1,
    setId: 'ne-binh',
    named: { rarity: 'bao', affixes: [{ key: 'def', value: 0.3 }, { key: 'hp', value: 0.15 }, { key: 'lootChance', value: 0.05 }] },
  },
  {
    id: 'ngung-than-phu',
    slot: 'giay',
    name: 'Giày Cỏ Ngõ Nê Bình',
    glyph: '👢',
    description: 'Đôi giày cỏ tự đan bền bỉ theo chân Trần Bình An vạn dặm tống thư.',
    minTier: 1,
    setId: 'ne-binh',
    named: { rarity: 'bao', affixes: [{ key: 'qiRate', value: 0.08 }, { key: 'atkSpeed', value: 0.06 }, { key: 'stoneRate', value: 0.05 }] },
  },
  {
    id: 'gui-truc-binh-an',
    slot: 'dai-lung',
    name: 'Gùi Trúc Vạn Dặm',
    glyph: '🎗️',
    description: 'Chiếc gùi trúc mộc mạc cõng theo sách vở và nghĩa khí của thiếu niên.',
    minTier: 1,
    setId: 'ne-binh',
    named: { rarity: 'bao', affixes: [{ key: 'lootChance', value: 0.1 }, { key: 'stoneRate', value: 0.08 }, { key: 'hp', value: 0.15 }] },
  },

  // SET 2: Kiếm Khí Trường Thành (kiem-khi)
  {
    id: 'phi-kiem-tu-vi',
    slot: 'vu-khi',
    name: 'Phi Kiếm · Lung Trung Tước',
    glyph: '🗡️',
    description: 'Bản mệnh phi kiếm "Chim Trong Lồng", cấm chế phong tỏa thiên địa, sát phạt kinh thiên.',
    minTier: 1,
    setId: 'kiem-khi',
    named: { rarity: 'tien', affixes: [{ key: 'atk', value: 0.5 }, { key: 'crit', value: 0.08 }, { key: 'critDmg', value: 0.3 }, { key: 'atkSpeed', value: 0.1 }] },
  },
  {
    id: 'thien-ma-giap',
    slot: 'ao',
    name: 'Bào Xanh Ẩn Quan',
    glyph: '🥋',
    description: 'Chiếc áo xanh của Ẩn Quan Kiếm Khí Trường Thành, dãi dầu gió sương và ý chí ngút trời.',
    minTier: 1,
    setId: 'kiem-khi',
    named: { rarity: 'than', affixes: [{ key: 'hp', value: 0.4 }, { key: 'atk', value: 0.3 }, { key: 'def', value: 0.4 }, { key: 'qiRate', value: 0.1 }, { key: 'lifesteal', value: 0.05 }] },
  },
  {
    id: 'dau-khoi-tran-yeu',
    slot: 'dau',
    name: 'Đầu Khôi Trấn Yêu',
    glyph: '👑',
    description: 'Chiến khôi nhuộm đầy tinh huyết đại yêu trên tường thành vạn trượng.',
    minTier: 1,
    setId: 'kiem-khi',
    named: { rarity: 'tien', affixes: [{ key: 'def', value: 0.35 }, { key: 'hp', value: 0.25 }, { key: 'crit', value: 0.06 }] },
  },
  {
    id: 'kiem-tien-gioi',
    slot: 'nhan',
    name: 'Kiếm Tiên Giới',
    glyph: '💍',
    description: 'Chiếc nhẫn kiếm tu đúc từ mảnh vỡ cổ kiếm rơi rụng ở chiến trường đầu tường.',
    minTier: 1,
    setId: 'kiem-khi',
    named: { rarity: 'tien', affixes: [{ key: 'atk', value: 0.3 }, { key: 'crit', value: 0.08 }, { key: 'critDmg', value: 0.25 }] },
  },

  // SET 3: Lạc Phách Tông Phong (lac-phach-son)
  {
    id: 'bang-tam-chau',
    slot: 'dau',
    name: 'Trâm Bích Ngọc',
    glyph: '👑',
    description: 'Cây trâm ngọc ôn nhuận hộ mệnh từ Thư Giản Hồ, giúp tâm cảnh bất động trước tà ma.',
    minTier: 1,
    setId: 'lac-phach-son',
    named: { rarity: 'tien', affixes: [{ key: 'hp', value: 0.3 }, { key: 'def', value: 0.2 }, { key: 'qiRate', value: 0.08 }, { key: 'atkSpeed', value: 0.06 }] },
  },
  {
    id: 'duong-kiem-ho-lo',
    slot: 'phu-luc',
    name: 'Dưỡng Kiếm Hồ Lô',
    glyph: '📜',
    description: 'Dưỡng Khí Hồ Lô nuôi dưỡng phi kiếm và tửu khí hào sảng của A Lương truyền lại.',
    minTier: 1,
    setId: 'lac-phach-son',
    named: { rarity: 'tien', affixes: [{ key: 'atk', value: 0.25 }, { key: 'qiRate', value: 0.12 }, { key: 'lifesteal', value: 0.05 }] },
  },
  {
    id: 'tinh-tam-nhi-hoan',
    slot: 'bong-tai',
    name: 'Tĩnh Tâm Nhĩ Hoàn',
    glyph: '💎',
    description: 'Khuyên tai thanh tịnh giúp lắng nghe âm thanh gió núi Lạc Phách Sơn.',
    minTier: 1,
    setId: 'lac-phach-son',
    named: { rarity: 'bao', affixes: [{ key: 'qiRate', value: 0.1 }, { key: 'def', value: 0.15 }, { key: 'hp', value: 0.12 }] },
  },

  // SET 4: Thư Giản Hồ Mịch Đạo (thu-gian-ho)
  {
    id: 'thuy-quy-lan-giap',
    slot: 'ao',
    name: 'Thủy Quỷ Lân Giáp',
    glyph: '🥋',
    description: 'Áo giáp vảy thủy quái nơi Thư Giản Hồ, phòng hộ âm hiểm và kiên cường.',
    minTier: 1,
    setId: 'thu-gian-ho',
    named: { rarity: 'bao', affixes: [{ key: 'hp', value: 0.3 }, { key: 'def', value: 0.2 }, { key: 'lifesteal', value: 0.05 }] },
  },
  {
    id: 'ho-tam-bach-cot',
    slot: 'day-chuyen',
    name: 'Bạch Cốt Hộ Tâm',
    glyph: '📿',
    description: 'Mặt dây chuyền cốt ngọc hộ thân chống lại âm khí rét buốt.',
    minTier: 1,
    setId: 'thu-gian-ho',
    named: { rarity: 'bao', affixes: [{ key: 'hp', value: 0.2 }, { key: 'def', value: 0.15 }, { key: 'lifesteal', value: 0.04 }] },
  },
]

export const GEAR_DEF_BY_ID: Readonly<Record<string, GearDef>> = Object.fromEntries(GEAR_DEFS.map((g) => [g.id, g]))
export const ROLLABLE_GEAR: readonly GearDef[] = GEAR_DEFS.filter((g) => !g.named)
export const NAMED_GEAR: readonly GearDef[] = GEAR_DEFS.filter((g) => Boolean(g.named))

/** Base templates eligible at a tier for a slot: the highest `minTier` band at or below `tier`, plus the band below for variety. */
export function rollableGearFor(type: GearType, tier: number): GearDef[] {
  const byType = ROLLABLE_GEAR.filter((g) => g.slot === type && g.minTier <= tier).sort((a, b) => b.minTier - a.minTier)
  return byType.slice(0, 2)
}
