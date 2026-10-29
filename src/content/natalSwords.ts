import { REALM_INDEX_BY_ID } from './realms'

export type SwordTalentKind =
  | 'atkSpeed'         // Tăng tốc độ xuất kiếm, giảm attackMs
  | 'armorPen'         // Xuyên giáp (bỏ qua % def của địch)
  | 'heavyDmg'         // Đòn đánh nặng nề theo % máu và làm chậm
  | 'qiRate'           // Uẩn kiếm bồi bổ linh khí khi đánh trúng
  | 'damageReduction'  // Giảm sát thương nhận vào
  | 'dodgeCounter'     // Tăng né tránh / phản đòn
  | 'lifesteal'        // Hấp huyết kiếm khí
  | 'critBuff'         // Tăng bạo kích & sát thương bạo kích
  | 'allDmg'           // Tăng toàn diện sát thương kiếm tu
  | 'execute'          // Trảm sát mục tiêu máu thấp

export interface SwordTalentDef {
  id: string
  name: string
  /** 1 = Phàm, 2 = Huyền, 3 = Địa, 4 = Thiên, 5 = Thần */
  tier: 1 | 2 | 3 | 4 | 5
  description: string
  kind: SwordTalentKind
  baseValue: number
  perLevel: number
  maxLevel: number
}

export const SWORD_TALENTS: readonly SwordTalentDef[] = [
  // Sơ Thập talents
  {
    id: 'bon-loi-tat-hanh',
    name: 'Bôn Lôi Tật Hành',
    tier: 3,
    description: 'Thân kiếm như tia chớp vàng rực rỡ, tốc độ xuất kiếm tăng nhanh chóng mặt.',
    kind: 'atkSpeed',
    baseValue: 0.1,
    perLevel: 0.02,
    maxLevel: 10,
  },
  {
    id: 'pha-khong-sat-giap',
    name: 'Phá Không Sát Giáp',
    tier: 4,
    description: 'Kiếm khí sắc bén tột đỉnh, xé rách hư không, bỏ qua giáp phòng ngự của kẻ địch.',
    kind: 'armorPen',
    baseValue: 0.15,
    perLevel: 0.03,
    maxLevel: 10,
  },

  // Thập Ngũ talents
  {
    id: 'thien-quan-ap-dinh',
    name: 'Thiên Quân Áp Đỉnh',
    tier: 4,
    description: 'Kiếm nặng như núi cao vạn trượng, đánh ra uy lực kinh thiên và làm chậm đối thủ.',
    kind: 'heavyDmg',
    baseValue: 0.15,
    perLevel: 0.03,
    maxLevel: 10,
  },
  {
    id: 'khi-phu-uan-khi',
    name: 'Khí Phủ Uẩn Khí',
    tier: 3,
    description: 'Kiếm khí phản phệ bồi bổ khí phủ, mỗi đòn đánh trúng đều tăng tốc độ tích tụ linh khí.',
    kind: 'qiRate',
    baseValue: 0.1,
    perLevel: 0.02,
    maxLevel: 10,
  },

  // Tỉnh Để talents
  {
    id: 'toa-tinh-cam-gioi',
    name: 'Tọa Tỉnh Cấm Giới',
    tier: 4,
    description: 'Thiên địa vạn dặm thu nhỏ vào đáy giếng, phong tỏa sát thương hiểm độc của địch.',
    kind: 'damageReduction',
    baseValue: 0.1,
    perLevel: 0.02,
    maxLevel: 10,
  },
  {
    id: 'kinh-hoa-thuy-nguyet',
    name: 'Kính Hoa Thủy Nguyệt',
    tier: 3,
    description: 'Bóng kiếm hư ảo như trăng dưới nước hoa trong gương, né tránh đòn công chí mạng.',
    kind: 'dodgeCounter',
    baseValue: 0.08,
    perLevel: 0.015,
    maxLevel: 10,
  },

  // Mạch Thượng talents
  {
    id: 'xuan-phong-hoa-vu',
    name: 'Xuân Phong Hóa Vũ',
    tier: 3,
    description: 'Kiếm ý ấm áp như gió xuân, hút sinh mệnh đối phương để tự hồi phục cho bản thân.',
    kind: 'lifesteal',
    baseValue: 0.08,
    perLevel: 0.015,
    maxLevel: 10,
  },

  // Ánh Tuyết talents
  {
    id: 'bang-phach-tuyet-hon',
    name: 'Băng Phách Tuyết Hồn',
    tier: 4,
    description: 'Hàn băng ngưng kết cửu tiêu, tăng tỷ lệ bạo kích và khả năng đông cứng kẻ địch.',
    kind: 'critBuff',
    baseValue: 0.12,
    perLevel: 0.025,
    maxLevel: 10,
  },

  // Huyền Hoàng Trảm Tiên talents
  {
    id: 'nhat-kiem-pha-van-phap',
    name: 'Nhất Kiếm Phá Vạn Pháp',
    tier: 5,
    description: 'Chí cao kiếm đạo vô địch thế gian, gia tăng toàn diện sát thương uy lực của kiếm tu.',
    kind: 'allDmg',
    baseValue: 0.25,
    perLevel: 0.05,
    maxLevel: 10,
  },
  {
    id: 'tuyet-canh-tram-than',
    name: 'Tuyệt Cảnh Trảm Thần',
    tier: 5,
    description: 'Khi kẻ địch rơi vào trạng thái suy yếu (dưới 15% máu), kiếm quang lập tức trảm sát hành quyết!',
    kind: 'execute',
    baseValue: 0.15,
    perLevel: 0.01,
    maxLevel: 10,
  },
]

export const SWORD_TALENT_BY_ID: Readonly<Record<string, SwordTalentDef>> = Object.fromEntries(
  SWORD_TALENTS.map((t) => [t.id, t]),
)

export interface NatalSwordDef {
  id: string
  name: string
  chineseName: string
  originLore: string
  element: string
  color: string
  initialTalentIds: string[]
  unlockableTalentIds: string[]
  minRealmIndex: number
  tier: number
  maxLevel: number
}

export const NATAL_SWORDS: readonly NatalSwordDef[] = [
  {
    id: 'so-thap',
    name: 'Sơ Thập',
    chineseName: '初十',
    originLore: 'Bản mệnh phi kiếm đầu tiên của Trần Bình An ngưng tụ trong lò rồng trấn nhỏ. Thân kiếm như sợi tơ vàng rực, tốc độ xé rách hư không.',
    element: 'Thuần Dương Phong Lôi',
    color: '#e0bf4a',
    initialTalentIds: ['bon-loi-tat-hanh'],
    unlockableTalentIds: ['pha-khong-sat-giap'],
    minRealmIndex: 0,
    tier: 3,
    maxLevel: 10,
  },
  {
    id: 'thap-ngu',
    name: 'Thập Ngũ',
    chineseName: '十五',
    originLore: 'Bản mệnh phi kiếm thứ hai của Trần Bình An, màu mực thẫm, nặng tựa núi Thái Sơn. Khí phách trầm hùng, uy áp vạn dặm.',
    element: 'Trầm Trọng Sơn Nhạc',
    color: '#7f7fb3',
    initialTalentIds: ['thien-quan-ap-dinh'],
    unlockableTalentIds: ['khi-phu-uan-khi'],
    minRealmIndex: REALM_INDEX_BY_ID['khi-cot-1'],
    tier: 3,
    maxLevel: 10,
  },
  {
    id: 'tinh-de',
    name: 'Tỉnh Để',
    chineseName: '井底',
    originLore: 'Phi kiếm không gian bí ẩn sinh ra từ đạo tâm "Tọa tỉnh quan thiên", có thể phong ấn cấm cố không gian chiến trường.',
    element: 'Hư Không Cấm Giới',
    color: '#38bdf8',
    initialTalentIds: ['toa-tinh-cam-gioi'],
    unlockableTalentIds: ['kinh-hoa-thuy-nguyet'],
    minRealmIndex: REALM_INDEX_BY_ID['truc-the-1'],
    tier: 4,
    maxLevel: 10,
  },
  {
    id: 'mach-thuong',
    name: 'Mạch Thượng',
    chineseName: '陌上',
    originLore: 'Phi kiếm mộc linh tràn trề sinh mệnh lực, kiếm ý tựa như hoa nở ven đường xuân, chuyển thương thế thành sinh cơ.',
    element: 'Trường Xuân Mộc Ý',
    color: '#5aa391',
    initialTalentIds: ['xuan-phong-hoa-vu'],
    unlockableTalentIds: ['bon-loi-tat-hanh'],
    minRealmIndex: REALM_INDEX_BY_ID['dong-phu-1'],
    tier: 4,
    maxLevel: 10,
  },
  {
    id: 'anh-tuyet',
    name: 'Ánh Tuyết',
    chineseName: '映雪',
    originLore: 'Phi kiếm hàn băng rèn từ tuyết ngàn năm trên đỉnh Bắc Câu Lô Châu, kiếm phong lạnh thấu tâm can, phong bế sát khí đối thủ.',
    element: 'Cực Hàn Băng Sương',
    color: '#a9ccff',
    initialTalentIds: ['bang-phach-tuyet-hon'],
    unlockableTalentIds: ['pha-khong-sat-giap'],
    minRealmIndex: REALM_INDEX_BY_ID['quan-hai-1'],
    tier: 4,
    maxLevel: 10,
  },
  {
    id: 'huyen-hoang-tram-tien',
    name: 'Huyền Hoàng Trảm Tiên',
    chineseName: '玄黄斩仙',
    originLore: 'Phi kiếm viễn cổ xuất xứ từ Kiếm Khí Trường Thành, hấp thu vạn kiếm oán khí và máu đại yêu viễn cổ, sát phạt đỉnh phong cửu châu.',
    element: 'Hồng Hoang Viễn Cổ',
    color: '#ef4444',
    initialTalentIds: ['nhat-kiem-pha-van-phap'],
    unlockableTalentIds: ['tuyet-canh-tram-than'],
    minRealmIndex: REALM_INDEX_BY_ID['kim-dan-1'],
    tier: 5,
    maxLevel: 10,
  },
]

export const NATAL_SWORD_BY_ID: Readonly<Record<string, NatalSwordDef>> = Object.fromEntries(
  NATAL_SWORDS.map((s) => [s.id, s]),
)

export interface SwordRankTier {
  tier: number
  title: string
  minPower: number
  minSwords: number
  buffDesc: string
  color: string
}

export const SWORD_RANKS: readonly SwordRankTier[] = [
  {
    tier: 1,
    title: 'Kiếm Đồ Sơ Khởi',
    minPower: 0,
    minSwords: 0,
    buffDesc: 'Mới bước chân vào kiếm đạo, kiếm ý còn sơ khai.',
    color: '#9e9e9e',
  },
  {
    tier: 2,
    title: 'Khí Phủ Kiếm Sĩ',
    minPower: 100,
    minSwords: 1,
    buffDesc: 'Uẩn dưỡng 1 thanh bản mệnh phi kiếm, đòn đánh tăng +3% công kích.',
    color: '#5aa391',
  },
  {
    tier: 3,
    title: 'Ngự Kiếm Chân Nhân',
    minPower: 250,
    minSwords: 1,
    buffDesc: 'Phi kiếm bồi đắp thuần thục, tăng +6% công kích và +3% tốc độ đánh.',
    color: '#7f7fb3',
  },
  {
    tier: 4,
    title: 'Song Tuyệt Kiếm Tiên',
    minPower: 450,
    minSwords: 2,
    buffDesc: 'Uẩn dưỡng 2 phi kiếm bản mệnh (như Sơ Thập & Thập Ngũ), tăng +12% công kích, +5% bạo kích.',
    color: '#e0bf4a',
  },
  {
    tier: 5,
    title: 'Đại Lạc Kiếm Quân',
    minPower: 800,
    minSwords: 2,
    buffDesc: 'Kiếm khí tung hoành khắp cõi giới, tăng +18% công kích, +10% xuyên giáp.',
    color: '#38bdf8',
  },
  {
    tier: 6,
    title: 'Ẩn Quan Kiếm Tôn',
    minPower: 1400,
    minSwords: 3,
    buffDesc: 'Uẩn dưỡng 3 phi kiếm bản mệnh, trấn thủ một phương thiên hạ, tăng +25% công kích, +15% bạo kích.',
    color: '#a855f7',
  },
  {
    tier: 7,
    title: 'Thập Tứ Cảnh Tuyệt Đỉnh Kiếm Tiên',
    minPower: 2200,
    minSwords: 4,
    buffDesc: 'Tứ kiếm tề xuất nghịch thiên trảm tiên, vô địch cùng cảnh giới, sát thương tăng +40%, bỏ qua 20% giáp.',
    color: '#ef4444',
  },
]
