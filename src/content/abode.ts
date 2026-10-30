/**
 * Hệ thống Động Phủ Kiếm Lai (Abode System)
 * Phỏng theo nguyên tác Kiếm Lai của Phong Hỏa Hí Chư Hầu:
 * Khởi đầu từ gian nhà đất Ngõ Nê Bình (Ly Châu Động Thiên)
 * bồi đắp và thăng hoa thành đệ nhất phúc địa Lạc Phách Sơn & Thượng Hạ Nhị Tông.
 */

export type AbodeFacilityId =
  | 'gatheringArray' // Tụ Linh Trận (Tăng Qi/s)
  | 'herbGarden' // Linh Điền Bách Thảo (Sản sinh dược liệu)
  | 'paperPuppets' // Chỉ Nhân Viện (Tự động hóa & bổ trợ)
  | 'spiritSpring' // Linh Tuyền Trì (Tăng Linh thạch/s)
  | 'spiritBeast' // Linh Thú Ô (Tăng may mắn & kỳ ngộ)

export interface AbodeTierDef {
  tier: number
  id: string
  name: string
  subTitle: string
  minRealmIndex: number
  costStones: number
  maxFacilityLevel: number
  maxHerbPlots: number
  description: string
  lore: string
}

export interface FacilityDef {
  id: AbodeFacilityId
  name: string
  hanName: string
  icon: string
  description: string
  lore: string
  baseCost: number
  costMultiplier: number
  unlockTier: number
}

export const ABODE_TIERS: readonly AbodeTierDef[] = [
  {
    tier: 1,
    id: 'ngo-ne-binh',
    name: 'Ngõ Nê Bình',
    subTitle: 'Cố Hương Ly Châu',
    minRealmIndex: 0,
    costStones: 0,
    maxFacilityLevel: 10,
    maxHerbPlots: 2,
    description: 'Gian nhà tranh vách đất mộc mạc, giếng nước trong veo bên cạnh cây hòe già.',
    lore: 'Thiếu niên chân trần cõng gùi trúc nhỏ, đốt lò gốm, uống nước giếng, chưa từng oán hận thiên địa bất công.',
  },
  {
    tier: 2,
    id: 'lac-phach-son',
    name: 'Lạc Phách Sơn',
    subTitle: 'Đệ Nhất Sơn Đầu',
    minRealmIndex: 5, // Động Phủ Cảnh
    costStones: 50_000,
    maxFacilityLevel: 25,
    maxHerbPlots: 4,
    description: 'Trúc Lâu Thôi Sàm lưu quyền ý, đỉnh Tễ Sắc mây sương vờn quanh, tiểu chỉ nhân quét tước bậc thềm.',
    lore: 'Một ngọn núi vô danh ở Bảo Bình Châu, trải qua mưa gió rèn giũa, dần trở thành chốn về ấm áp nhất gian trần.',
  },
  {
    tier: 3,
    id: 'tien-gia-phuc-dia',
    name: 'Tiên Gia Phúc Địa',
    subTitle: 'Liên Vân Sơn Đoạn',
    minRealmIndex: 10, // Ngọc Phác Cảnh
    costStones: 500_000,
    maxFacilityLevel: 50,
    maxHerbPlots: 6,
    description: 'Khí tượng ngàn dặm, suối linh ngọc thạch chảy róc rách, đại trận hộ sơn uy nghiêm rực sáng.',
    lore: 'Sơn thủy kết minh, ngọc các lầu đài cao vút chín tầng mây, là thánh địa tu hành của vạn người hướng đạo.',
  },
  {
    tier: 4,
    id: 'thuong-ha-tong',
    name: 'Thượng Hạ Nhị Tông',
    subTitle: 'Bách Niên Đạo Tràng',
    minRealmIndex: 13, // Phi Thăng Cảnh
    costStones: 5_000_000,
    maxFacilityLevel: 100,
    maxHerbPlots: 8,
    description: 'Thượng tông Lạc Phách cửu châu vọng bái, hạ tông Man Hoang hoành không kiếm trấn vạn yêu.',
    lore: 'Chư thánh Văn Miếu gật đầu, Đạo tổ Bạch Ngọc Kinh tán thưởng. Đạo tràng vạn năm truyền thừa bất diệt.',
  },
]

export const ABODE_TIER_BY_NUMBER: Record<number, AbodeTierDef> = Object.fromEntries(
  ABODE_TIERS.map((t) => [t.tier, t]),
)

export const ABODE_FACILITIES: readonly FacilityDef[] = [
  {
    id: 'gatheringArray',
    name: 'Tụ Linh Trận',
    hanName: '聚灵阵',
    icon: '🌀',
    description: 'Tụ tập thiên địa linh khí bốn phương, tăng tốc độ thu nạp tu vi (+5% Linh khí/s mỗi cấp).',
    lore: 'Khắc trận văn bát quái xuống nền đá, dẫn dắt linh mạch tự nhiên chảy về động phủ.',
    baseCost: 200,
    costMultiplier: 1.35,
    unlockTier: 1,
  },
  {
    id: 'herbGarden',
    name: 'Linh Điền Bách Thảo',
    hanName: '百草灵田',
    icon: '🌱',
    description: 'Đất linh dưỡng thảo, tự động ươm mầm và sản sinh thảo dược quý theo thời gian thực.',
    lore: 'Đất phù sa lấy từ chân núi, tưới bằng linh dịch tuyền thủy, cỏ thơm thoang thoảng mười dặm.',
    baseCost: 350,
    costMultiplier: 1.4,
    unlockTier: 1,
  },
  {
    id: 'paperPuppets',
    name: 'Chỉ Nhân Viện',
    hanName: '纸人院',
    icon: '🏮',
    description: 'Tiểu Chỉ Nhân tay áo tự động quét dọn, thu hoạch linh điền và tăng hiệu suất toàn động phủ.',
    lore: 'Cắt giấy thành người, điểm linh khí vào mắt, ban ngày bận rộn tưới cây, ban đêm xếp hàng về tay áo ngủ.',
    baseCost: 500,
    costMultiplier: 1.45,
    unlockTier: 1,
  },
  {
    id: 'spiritSpring',
    name: 'Linh Tuyền Thạch Trì',
    hanName: '灵泉池',
    icon: '💧',
    description: 'Mạch suối linh thạch kết tinh, tăng sản lượng Linh Thạch thu nạp tự nhiên (+5% Linh thạch/s mỗi cấp).',
    lore: 'Dưới động phủ có mạch suối ngầm rỉ ra giọt ngọc, tích tụ lâu ngày kết thành linh thạch tinh thuần.',
    baseCost: 300,
    costMultiplier: 1.35,
    unlockTier: 1,
  },
  {
    id: 'spiritBeast',
    name: 'Linh Thú Ô',
    hanName: '灵兽坞',
    icon: '🦜',
    description: 'Nuôi dưỡng Ngũ Thải Oanh Vũ báo tin thiên thời, tăng +2% rớt Rương Đỏ và +3% gặp Kỳ Ngộ May Mắn mỗi cấp.',
    lore: 'Chim ngũ sắc thông linh tính, đậu trên vai hót véo von, mỗi lần vỗ cánh bay xa đều mang về phúc duyên.',
    baseCost: 1000,
    costMultiplier: 1.5,
    unlockTier: 2, // Mở ở Lạc Phách Sơn
  },
]

export const FACILITY_BY_ID: Record<AbodeFacilityId, FacilityDef> = Object.fromEntries(
  ABODE_FACILITIES.map((f) => [f.id, f]),
) as Record<AbodeFacilityId, FacilityDef>
