/**
 * Hệ thống 15 Cảnh Giới Luyện Khí Sĩ chuẩn nguyên tác Kiếm Lai (Phong Hỏa Hí Chư Hầu).
 *
 * Phân tầng Tam Đại Giai Đoạn:
 * - 0. Phàm Tục (Ngõ Nê Bình)
 * - 1..5. HẠ NGŨ CẢNH (Rèn luyện thể phách):
 *   1. Đồng Bì (Luyện Bì), 2. Thảo Căn (Luyện Nhục), 3. Liễu Cân (Luyện Cân), 4. Cốt Cảnh (Khí Cốt), 5. Thể Cảnh (Trúc Thể)
 * - 6..10. TRUNG NGŨ CẢNH (Khai thông khí tượng - Địa Tiên):
 *   6. Động Phủ (365 Khiếu), 7. Quan Hải, 8. Long Môn, 9. Kim Đan (Địa Tiên), 10. Nguyên Anh (Dương Thần)
 * - 11..13. THƯỢNG NGŨ CẢNH (Trường sinh đại thần tiên):
 *   11. Ngọc Phác (Ngọc phác vô tỳ), 12. Tiên Nhân, 13. Phi Thăng (Cực hạn nhân gian)
 * - 14..15. THẤT TRUYỀN NHỊ CẢNH (Tối cao truyền thuyết):
 *   14. Thập Tứ Cảnh (Hợp Đạo Thiên Địa), 15. Thập Ngũ Cảnh (Bản Nguyên Thần Vị)
 */

export type MajorRealmId =
  | 'pham-tuc'
  // Hạ Ngũ Cảnh
  | 'dong-bi'
  | 'thao-can'
  | 'lieu-can'
  | 'khi-cot'
  | 'truc-the'
  // Trung Ngũ Cảnh
  | 'dong-phu'
  | 'quan-hai'
  | 'long-mon'
  | 'kim-dan'
  | 'nguyen-anh'
  // Thượng Ngũ Cảnh
  | 'ngoc-phac'
  | 'tien-nhan'
  | 'phi-thang'
  // Thất Truyền Nhị Cảnh
  | 'thap-tu'
  | 'thap-ngu'

export type RealmGroup =
  | 'Phàm Tục'
  | 'Hạ Ngũ Cảnh'
  | 'Trung Ngũ Cảnh'
  | 'Thượng Ngũ Cảnh'
  | 'Thất Truyền Nhị Cảnh'

export interface RealmStage {
  /** Unique id, e.g. `dong-bi-1`. */
  id: string
  majorId: MajorRealmId
  /** Tên cảnh giới lớn, e.g. "Đồng Bì Cảnh". */
  majorName: string
  /** Nhãn tầng nhỏ, e.g. "Sơ kỳ" / "Viên mãn"; null cho cảnh giới đơn nhất. */
  stageLabel: string | null
  /** Tên đầy đủ hiển thị, e.g. "Đồng Bì Cảnh · Sơ kỳ". */
  name: string
  /** Phân nhóm cảnh giới trong nguyên tác Kiếm Lai. */
  group: RealmGroup
  /** Bậc cảnh giới thứ tự (0..15). */
  groupRank: number
  /** Linh khí nhận được cơ bản mỗi giây. */
  qiRate: number
  /** Linh khí yêu cầu để thử đột phá sang cảnh giới kế tiếp (0 khi đã đạt cực hạn). */
  qiRequired: number
  /** Tỷ lệ thành công cơ bản (0..1). */
  breakthroughChance: number
  /** Thọ nguyên đạt được tại cảnh giới này. */
  lifespanYears: number
  /** Đột phá khỏi cảnh giới này có kích hoạt Thiên Kiếp giáng thế hay không. */
  tribulation: boolean
  /** Cảnh giới tối thượng, không còn cảnh giới kế tiếp. */
  terminal: boolean
  /** Là tầng đầu tiên của cảnh giới lớn này. */
  firstOfMajor: boolean
  /** Mô tả phong vị Kiếm Lai. */
  kiemLaiLore: string
}

interface MajorRealmDef {
  id: MajorRealmId
  name: string
  group: RealmGroup
  groupRank: number
  stages: (string | null)[]
  baseRate: number
  baseReq: number
  rateGrowth: number
  reqGrowth: number
  chanceStart: number
  chanceEnd: number
  lifespanYears: number
  tribulationOnEnter?: boolean
  terminal?: boolean
  lore: string
}

const KY_3 = ['Sơ kỳ', 'Trung kỳ', 'Viên mãn']
const KY_4 = ['Sơ kỳ', 'Trung kỳ', 'Hậu kỳ', 'Viên mãn']

export const MAJOR_REALM_DEFS: readonly MajorRealmDef[] = [
  {
    id: 'pham-tuc',
    name: 'Phàm Tục',
    group: 'Phàm Tục',
    groupRank: 0,
    stages: [null],
    baseRate: 1,
    baseReq: 50,
    rateGrowth: 1,
    reqGrowth: 1,
    chanceStart: 1,
    chanceEnd: 1,
    lifespanYears: 80,
    lore: 'Thiếu niên chân trần ngõ Nê Bình, cõng gùi trúc nhỏ mưu sinh giữa thế tục.',
  },

  // ===== HẠ NGŨ CẢNH (RÈN THÂN LEO NÚI) =====
  {
    id: 'dong-bi',
    name: 'Đồng Bì Cảnh',
    group: 'Hạ Ngũ Cảnh',
    groupRank: 1,
    stages: KY_3,
    baseRate: 2,
    baseReq: 250,
    rateGrowth: 1.25,
    reqGrowth: 1.5,
    chanceStart: 0.95,
    chanceEnd: 0.88,
    lifespanYears: 100,
    lore: 'Luyện Bì Cảnh. Chân khí kích phát khiến da dẻ như đồng thau, đao kiếm khó thương.',
  },
  {
    id: 'thao-can',
    name: 'Thảo Căn Cảnh',
    group: 'Hạ Ngũ Cảnh',
    groupRank: 2,
    stages: KY_3,
    baseRate: 4,
    baseReq: 750,
    rateGrowth: 1.25,
    reqGrowth: 1.55,
    chanceStart: 0.9,
    chanceEnd: 0.82,
    lifespanYears: 110,
    lore: 'Luyện Nhục Cảnh. Cơ bắp như cỏ dại đồng hoang, chém đứt lại mọc, sinh cơ tràn trề.',
  },
  {
    id: 'lieu-can',
    name: 'Liễu Cân Cảnh',
    group: 'Hạ Ngũ Cảnh',
    groupRank: 3,
    stages: KY_3,
    baseRate: 9,
    baseReq: 3_200,
    rateGrowth: 1.28,
    reqGrowth: 1.6,
    chanceStart: 0.85,
    chanceEnd: 0.76,
    lifespanYears: 120,
    lore: 'Luyện Cân Cảnh. Gân cốt dẻo dai như cành liễu trước cuồng phong, kình lực kéo căng tựa cung thần.',
  },
  {
    id: 'khi-cot',
    name: 'Cốt Cảnh',
    group: 'Hạ Ngũ Cảnh',
    groupRank: 4,
    stages: KY_3,
    baseRate: 20,
    baseReq: 9_500,
    rateGrowth: 1.3,
    reqGrowth: 1.65,
    chanceStart: 0.8,
    chanceEnd: 0.7,
    lifespanYears: 130,
    lore: 'Luyện Cốt Cảnh. Rèn đúc khí cốt kiên định, đao búa giáng xuống chỉ nghe tiếng sắt đá va chạm.',
  },
  {
    id: 'truc-the',
    name: 'Thể Cảnh',
    group: 'Hạ Ngũ Cảnh',
    groupRank: 5,
    stages: KY_3,
    baseRate: 45,
    baseReq: 42_000,
    rateGrowth: 1.35,
    reqGrowth: 1.7,
    chanceStart: 0.75,
    chanceEnd: 0.65,
    lifespanYears: 150,
    lore: 'Luyện Thể Viên Mãn. Thân thể biến thành lò luyện khí huyết, chuẩn bị khai khiếu ngộ đạo.',
  },

  // ===== TRUNG NGŨ CẢNH (KHAI LINH ĐỊA TIÊN) =====
  {
    id: 'dong-phu',
    name: 'Động Phủ Cảnh',
    group: 'Trung Ngũ Cảnh',
    groupRank: 6,
    stages: KY_3,
    baseRate: 110,
    baseReq: 220_000,
    rateGrowth: 1.4,
    reqGrowth: 1.8,
    chanceStart: 0.7,
    chanceEnd: 0.58,
    lifespanYears: 200,
    lore: 'Chính thức bước vào cửa Đạo. Khai mở 365 khiếu huyệt như 365 tòa động phủ chứa linh khí.',
  },
  {
    id: 'quan-hai',
    name: 'Quan Hải Cảnh',
    group: 'Trung Ngũ Cảnh',
    groupRank: 7,
    stages: KY_3,
    baseRate: 280,
    baseReq: 1_200_000,
    rateGrowth: 1.45,
    reqGrowth: 1.9,
    chanceStart: 0.65,
    chanceEnd: 0.52,
    lifespanYears: 300,
    lore: 'Linh khí tích lũy thành dòng sông cuồn cuộn đổ về khí hải, thọ mệnh tăng vọt vượt trăm năm.',
  },
  {
    id: 'long-mon',
    name: 'Long Môn Cảnh',
    group: 'Trung Ngũ Cảnh',
    groupRank: 8,
    stages: KY_3,
    baseRate: 750,
    baseReq: 7_500_000,
    rateGrowth: 1.5,
    reqGrowth: 2.0,
    chanceStart: 0.6,
    chanceEnd: 0.45,
    lifespanYears: 500,
    lore: 'Cá chép vượt Long Môn. Vượt qua cửa này là rũ bỏ phàm cốt, ngóng trông Kim Đan đại đạo.',
  },
  {
    id: 'kim-dan',
    name: 'Kim Đan Cảnh',
    group: 'Trung Ngũ Cảnh',
    groupRank: 9,
    stages: KY_4,
    baseRate: 2_400,
    baseReq: 48_000_000,
    rateGrowth: 1.55,
    reqGrowth: 2.15,
    chanceStart: 0.55,
    chanceEnd: 0.4,
    lifespanYears: 800,
    tribulationOnEnter: true,
    lore: 'Ngưng tụ viên mãn Kim Đan, chính thức đứng vào hàng ngũ Địa Tiên, có tiếng tăm lẫy lừng trên núi.',
  },
  {
    id: 'nguyen-anh',
    name: 'Nguyên Anh Cảnh',
    group: 'Trung Ngũ Cảnh',
    groupRank: 10,
    stages: KY_4,
    baseRate: 15_000,
    baseReq: 650_000_000,
    rateGrowth: 1.6,
    reqGrowth: 2.15,
    chanceStart: 0.5,
    chanceEnd: 0.35,
    lifespanYears: 1_500,
    tribulationOnEnter: true,
    lore: 'Kim Đan hóa Anh, sinh ra Âm Thần Dương Thần xuất khiếu ngao du thiên hạ, ngàn năm thọ khảo.',
  },

  // ===== THƯỢNG NGŨ CẢNH (TRƯỜNG SINH TỘC) =====
  {
    id: 'ngoc-phac',
    name: 'Ngọc Phác Cảnh',
    group: 'Thượng Ngũ Cảnh',
    groupRank: 11,
    stages: KY_4,
    baseRate: 95_000,
    baseReq: 8_500_000_000,
    rateGrowth: 1.65,
    reqGrowth: 2.2,
    chanceStart: 0.45,
    chanceEnd: 0.3,
    lifespanYears: 3_000,
    tribulationOnEnter: true,
    lore: 'Bước chân vào Thượng Ngũ Cảnh. Thể phách ngọc phác vô tỳ, tâm cảnh trác tuyệt không tỳ vết.',
  },
  {
    id: 'tien-nhan',
    name: 'Tiên Nhân Cảnh',
    group: 'Thượng Ngũ Cảnh',
    groupRank: 12,
    stages: KY_4,
    baseRate: 700_000,
    baseReq: 120_000_000_000,
    rateGrowth: 1.7,
    reqGrowth: 2.25,
    chanceStart: 0.4,
    chanceEnd: 0.25,
    lifespanYears: 8_000,
    tribulationOnEnter: true,
    lore: 'Đại Tiên hô phong hoán vũ, dời non lấp bể, có thể cắn nuốt sơn hà khí số nuôi dưỡng đạo tâm.',
  },
  {
    id: 'phi-thang',
    name: 'Phi Thăng Cảnh',
    group: 'Thượng Ngũ Cảnh',
    groupRank: 13,
    stages: KY_4,
    baseRate: 6_000_000,
    baseReq: 2_500_000_000_000,
    rateGrowth: 1.75,
    reqGrowth: 2.3,
    chanceStart: 0.35,
    chanceEnd: 0.2,
    lifespanYears: 20_000,
    tribulationOnEnter: true,
    lore: 'Đỉnh phong nhân gian thế giới, một lời định đoạt tồn vong vương triều, thiên đạo bắt đầu bài xích.',
  },

  // ===== THẤT TRUYỀN NHỊ CẢNH (HUYỀN THOẠI TỐI CAO) =====
  {
    id: 'thap-tu',
    name: 'Thập Tứ Cảnh',
    group: 'Thất Truyền Nhị Cảnh',
    groupRank: 14,
    stages: ['Sơ Hợp', 'Hợp Đạo', 'Viên Mãn'],
    baseRate: 65_000_000,
    baseReq: 35_000_000_000_000,
    rateGrowth: 1.8,
    reqGrowth: 2.4,
    chanceStart: 0.25,
    chanceEnd: 0.15,
    lifespanYears: 100_000,
    tribulationOnEnter: true,
    lore: 'Hợp Đạo Thiên Địa. Ngồi ngang hàng chư thánh Văn Miếu, chưởng quản một phương thiên đạo quy tắc.',
  },
  {
    id: 'thap-ngu',
    name: 'Thập Ngũ Cảnh',
    group: 'Thất Truyền Nhị Cảnh',
    groupRank: 15,
    stages: [null],
    baseRate: 1_000_000_000,
    baseReq: 0,
    rateGrowth: 1,
    reqGrowth: 1,
    chanceStart: 0,
    chanceEnd: 0,
    lifespanYears: 1_000_000_000,
    tribulationOnEnter: true,
    terminal: true,
    lore: 'Bản Nguyên Cảnh. Thần Vị Chí Cao Sáng Thế, vượt thoát khỏi mọi trói buộc của năm tòa thiên hạ.',
  },
]

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function buildRealms(defs: readonly MajorRealmDef[]): RealmStage[] {
  const out: RealmStage[] = []
  defs.forEach((def, majorIdx) => {
    const n = def.stages.length
    const next = defs[majorIdx + 1]
    def.stages.forEach((label, k) => {
      const isLast = k === n - 1
      const t = n === 1 ? 0 : k / (n - 1)
      const stageName = label ? `${def.name} · ${label}` : def.name
      out.push({
        id: n === 1 ? def.id : `${def.id}-${k + 1}`,
        majorId: def.id,
        majorName: def.name,
        stageLabel: label,
        name: stageName,
        group: def.group,
        groupRank: def.groupRank,
        qiRate: round(def.baseRate * def.rateGrowth ** k),
        qiRequired: def.terminal ? 0 : round(def.baseReq * def.reqGrowth ** k),
        breakthroughChance: def.terminal ? 0 : lerp(def.chanceStart, def.chanceEnd, t),
        lifespanYears: def.lifespanYears,
        tribulation: isLast && !def.terminal && Boolean(next?.tribulationOnEnter),
        terminal: Boolean(def.terminal),
        firstOfMajor: k === 0,
        kiemLaiLore: def.lore,
      })
    })
  })
  return out
}

function round(n: number): number {
  return n >= 1000 ? Math.round(n) : Math.round(n * 100) / 100
}

export const REALMS: readonly RealmStage[] = buildRealms(MAJOR_REALM_DEFS)

export const REALM_INDEX_BY_ID: Readonly<Record<string, number>> = Object.fromEntries(
  REALMS.map((r, i) => [r.id, i]),
)

/** Bảng ánh xạ hỗ trợ migrate từ save cũ (v1..v8) sang cảnh giới Kiếm Lai v9 */
export const LEGACY_REALM_ID_MAP: Readonly<Record<string, string>> = {
  'pham-nhan': 'pham-tuc',
  'luyen-khi-1': 'dong-bi-1',
  'luyen-khi-2': 'dong-bi-2',
  'luyen-khi-3': 'dong-bi-3',
  'luyen-khi-4': 'thao-can-1',
  'luyen-khi-5': 'thao-can-2',
  'luyen-khi-6': 'lieu-can-1',
  'luyen-khi-7': 'lieu-can-2',
  'luyen-khi-8': 'khi-cot-1',
  'luyen-khi-9': 'truc-the-2',
  'truc-co-1': 'dong-phu-1',
  'truc-co-2': 'dong-phu-2',
  'truc-co-3': 'quan-hai-1',
  'truc-co-4': 'quan-hai-2',
  'kim-dan-1': 'long-mon-1',
  'kim-dan-2': 'long-mon-2',
  'kim-dan-3': 'kim-dan-1',
  'kim-dan-4': 'kim-dan-2',
  'nguyen-anh-1': 'nguyen-anh-1',
  'nguyen-anh-2': 'nguyen-anh-2',
  'nguyen-anh-3': 'nguyen-anh-3',
  'nguyen-anh-4': 'nguyen-anh-4',
  'hoa-than-1': 'ngoc-phac-1',
  'hoa-than-2': 'ngoc-phac-2',
  'hoa-than-3': 'ngoc-phac-3',
  'hoa-than-4': 'ngoc-phac-4',
  'luyen-hu-1': 'tien-nhan-1',
  'luyen-hu-2': 'tien-nhan-2',
  'luyen-hu-3': 'tien-nhan-3',
  'luyen-hu-4': 'tien-nhan-4',
  'hop-the-1': 'phi-thang-1',
  'hop-the-2': 'phi-thang-2',
  'hop-the-3': 'phi-thang-3',
  'hop-the-4': 'phi-thang-4',
  'dai-thua-1': 'thap-tu-1',
  'dai-thua-2': 'thap-tu-2',
  'dai-thua-3': 'thap-tu-2',
  'dai-thua-4': 'thap-tu-3',
  'do-kiep': 'thap-tu-3',
  'phi-thang': 'thap-ngu',
}
