export type ClassId =
  | 'kiem-tu'
  | 'vo-phu'
  | 'nho-gia'
  | 'dao-gia'
  | 'phat-gia'
  | 'binh-gia'
  | 'duoc-gia'
  | 'thuong-gia'
  | 'mac-gia'
  | 'am-duong-gia'

export type CombatRange = 'melee' | 'ranged'
export type CultivationPath = 'martial' | 'qi' | 'dual'

export interface ClassMultipliers {
  atk?: number
  hp?: number
  def?: number
  crit?: number
  atkSpeed?: number
  qiRate?: number
  stoneRate?: number
  lootChance?: number
}

export interface ClassDef {
  id: ClassId
  name: string
  faction: string
  title: string
  description: string
  glyph: string
  accentColor: string
  path: 'martial' | 'qi'
  combatRange: CombatRange
  role: string
  weapon: string
  signatureMechanic: string
  signatureSkill: string
  passiveName: string
  passiveDesc: string
  multipliers: ClassMultipliers
}

export const CLASSES: readonly ClassDef[] = [
  {
    id: 'kiem-tu',
    name: 'Kiếm Tu',
    faction: 'Kiếm Khí Trường Thành',
    title: 'Nhất Kiếm Phá Vạn Pháp',
    description: 'Chỉ tu một thanh bản mệnh phi kiếm, sát lực đứng đầu cửu châu. Kiếm xuất như rồng cuộn, trảm phá hư không.',
    glyph: '🗡️',
    accentColor: '#f59e0b',
    path: 'qi',
    combatRange: 'ranged',
    role: 'Carry / Burst DPS',
    weapon: 'Bản Mệnh Phi Kiếm & Kiếm Hồ',
    signatureMechanic: 'Bản Mệnh Phi Kiếm bạo kích xuyên giáp cực đại, trảm kích từ xa.',
    signatureSkill: 'Vạn Kiếm Quy Tông',
    passiveName: 'Kiếm Khí Tung Hoành',
    passiveDesc: '+25% Sát thương Công, +10% Tỉ lệ Bạo kích, -10% Phòng thủ.',
    multipliers: { atk: 1.25, crit: 0.1, def: 0.9 },
  },
  {
    id: 'vo-phu',
    name: 'Thuần Võ Phu',
    faction: 'Thuần Túy Võ Đạo',
    title: 'Hám Sơn Quyền Ý',
    description: 'Không mượn thiên địa linh khí, chỉ rèn một thân thể phách kim cương. Đấm vỡ núi non, khí huyết như hồng lô.',
    glyph: '👊',
    accentColor: '#ef4444',
    path: 'martial',
    combatRange: 'melee',
    role: 'Bruiser / Juggernaut',
    weapon: 'Quyền Cước & Trường Đao',
    signatureMechanic: 'Khu vực áp chế 10 trượng (+35% sát thương khi cận chiến), miễn nhiễm lôi kiếp.',
    signatureSkill: 'Hám Sơn Thập Cửu Quyền',
    passiveName: 'Bất Diệt Thần Thể',
    passiveDesc: '+35% Khí huyết, +15% Phòng thủ, +10% Tốc đánh.',
    multipliers: { hp: 1.35, def: 1.15, atkSpeed: 1.1 },
  },
  {
    id: 'dao-gia',
    name: 'Đạo Gia Phương Sĩ',
    faction: 'Bạch Ngọc Kinh',
    title: 'Thanh Tĩnh Vô Vi',
    description: 'Thuận theo tự nhiên, đạo pháp tự nhiên cửu tiêu. Phù lục ngũ lôi giáng thế, kim quang hộ thể tiêu tai giải nạn.',
    glyph: '☯️',
    accentColor: '#38bdf8',
    path: 'qi',
    combatRange: 'ranged',
    role: 'Mage / AoE / Control',
    weapon: 'Phù Lục, Phất Trần & Pháp Kiếm',
    signatureMechanic: 'Huyền Vũ Hộ Thân Phù (khiên chắn 25% HP) và lôi phù gây tê liệt quái.',
    signatureSkill: 'Nhất Khí Hóa Tam Thanh',
    passiveName: 'Đạo Pháp Tự Nhiên',
    passiveDesc: '+15% Tốc độ Tu luyện Linh khí, +15% Tỉ lệ Bạo kích, +10% Tốc đánh.',
    multipliers: { qiRate: 1.15, crit: 0.15, atkSpeed: 1.1 },
  },
  {
    id: 'nho-gia',
    name: 'Nho Sĩ',
    faction: 'Sơn Nhai Thư Viện / Văn Miếu',
    title: 'Hạo Nhiên Chính Khí',
    description: 'Đọc vạn cuốn sách, dưỡng một luồng hạo nhiên chính khí. Khẩu tru bút phạt, lấy đạo lý và quy củ áp chế vạn tà.',
    glyph: '📜',
    accentColor: '#10b981',
    path: 'qi',
    combatRange: 'ranged',
    role: 'Control / Buffer / True Damage',
    weapon: 'Bút Lông, Sách Cổ & Ngọc Hốt',
    signatureMechanic: 'Khẩu Hàm Thiên Hiến (Ngôn Xuất Pháp Tùy), áp chế giảm công thủ địch, tăng cơ duyên.',
    signatureSkill: 'Thánh Nhân Lời Khuyên',
    passiveName: 'Học Hải Vô Nhai',
    passiveDesc: '+30% Tốc độ Tu luyện Linh khí, +15% Phòng thủ.',
    multipliers: { qiRate: 1.3, def: 1.15 },
  },
  {
    id: 'phat-gia',
    name: 'Phật Môn Kim Cương',
    faction: 'Liên Hoa Tu Di Sơn',
    title: 'Kim Cương Bồ Đề',
    description: 'Đại từ đại bi hóa giải kiếp nạn. Thân tỏa kim quang vạn trượng, tâm như gương sáng, phản đòn hóa giải ma tâm.',
    glyph: '📿',
    accentColor: '#fbbf24',
    path: 'qi',
    combatRange: 'melee',
    role: 'Tanker / Healer / Counter',
    weapon: 'Thiền Trượng, Tràng Hạt & Kim Bát',
    signatureMechanic: 'Họa Địa Vi Lao & La Hán Kim Thân phản đòn và hóa giải tâm ma.',
    signatureSkill: 'Đại Bi Chú',
    passiveName: 'Kim Cương Bất Hoại',
    passiveDesc: '+40% Phòng thủ, +20% Khí huyết, -10% Tốc đánh.',
    multipliers: { def: 1.4, hp: 1.2, atkSpeed: 0.9 },
  },
  {
    id: 'mac-gia',
    name: 'Mặc Gia Cơ Quan Sư',
    faction: 'Mặc Môn Cơ Quan Sơn',
    title: 'Cơ Quan Khôi Lỗi',
    description: 'Phi công kiêm ái, cơ quan thuật tinh xảo bậc nhất cửu châu. Khôi lỗi hộ thể, thành lũy kiên cố bất phá.',
    glyph: '⚙️',
    accentColor: '#64748b',
    path: 'qi',
    combatRange: 'ranged',
    role: 'Tactical / Turret / Siege',
    weapon: 'Cự Giáp, Khôi Lỗi & Cơ Quan Hạp',
    signatureMechanic: 'Khôi Lỗi thú gánh sát thương và bào mòn vĩnh viễn 30% giáp của Boss.',
    signatureSkill: 'Thiên Cơ Khôi Lỗi',
    passiveName: 'Kim Thạch Khôi Giáp',
    passiveDesc: '+25% Phòng thủ, +15% Sát thương Công.',
    multipliers: { def: 1.25, atk: 1.15 },
  },
  {
    id: 'binh-gia',
    name: 'Binh Gia',
    faction: 'Đại Lệ Quân Đội',
    title: 'Thiết Huyết Quân Trận',
    description: 'Lấy sát dừng sát, vạn quân xung trận máu nhuộm chiến giáp. Sát phạt quyết đoán, dũng cảm tiến tới không lùi.',
    glyph: '🚩',
    accentColor: '#b91c1c',
    path: 'qi',
    combatRange: 'melee',
    role: 'Vanguard / Lifesteal Berserker',
    weapon: 'Thiết Thương & Chiến Phủ',
    signatureMechanic: 'Hút máu và cuồng nộ bộc phát công kích khi sinh lực xuống thấp.',
    signatureSkill: 'Thập Diện Mai Phục',
    passiveName: 'Phá Quân Trận',
    passiveDesc: '+20% Sát thương Công, +15% Tốc đánh, +10% Khí huyết.',
    multipliers: { atk: 1.2, atkSpeed: 1.15, hp: 1.1 },
  },
  {
    id: 'am-duong-gia',
    name: 'Âm Dương Gia',
    faction: 'Quan Tinh Đài / U Minh',
    title: 'Diễn Toán Thiên Cơ',
    description: 'Quan sát tinh tú, suy diễn biến hóa âm dương ngũ hành. Biết trước vận số, đoạt lấy cơ duyên trong cõi u minh.',
    glyph: '✨',
    accentColor: '#8b5cf6',
    path: 'qi',
    combatRange: 'ranged',
    role: 'Occultist / DoT Corrosion',
    weapon: 'Bát Quái Bàn & U Minh Đăng',
    signatureMechanic: 'Trớ chú rút máu liên tục bỏ qua giáp và tăng tỷ lệ tầm bảo cơ duyên.',
    signatureSkill: 'Bát Quái Diễn Thiên',
    passiveName: 'Cơ Duyên Hóa Cát',
    passiveDesc: '+35% Tỉ lệ rớt trang bị hiếm, +15% Tỉ lệ Bạo kích.',
    multipliers: { lootChance: 1.35, crit: 0.15 },
  },
  {
    id: 'duoc-gia',
    name: 'Dược Gia',
    faction: 'Bách Thảo Đường',
    title: 'Đan Đạo Huyền Cơ',
    description: 'Thấu hiểu dược lý đất trời, lấy dược dưỡng mệnh. Một viên linh đan cởi bỏ tử kiếp, cải tử hoàn sinh.',
    glyph: '🌿',
    accentColor: '#059669',
    path: 'qi',
    combatRange: 'ranged',
    role: 'Support / Alchemist',
    weapon: 'Luyện Đan Lô & Dược Dữu',
    signatureMechanic: 'Cải tử hoàn sinh và tăng mạnh hiệu lực linh dược.',
    signatureSkill: 'Thần Nông Bản Thảo',
    passiveName: 'Dược Hương Hộ Thể',
    passiveDesc: '+25% Khí huyết, +20% Tốc độ Tu luyện Linh khí.',
    multipliers: { hp: 1.25, qiRate: 1.2 },
  },
  {
    id: 'thuong-gia',
    name: 'Thương Gia',
    faction: 'Bảo Bình Châu Hội Buôn',
    title: 'Phú Khả Địch Quốc',
    description: 'Lấy tiền tài thông thần, tụ bảo bồn thu gom thiên hạ kỳ trân. Thần tài hiển linh, buôn bán vạn giới phong vân.',
    glyph: '💰',
    accentColor: '#f59e0b',
    path: 'qi',
    combatRange: 'ranged',
    role: 'Economist / Fortune Hunter',
    weapon: 'Hoàng Kim Bàn Tính',
    signatureMechanic: 'Tài thông thiên địa, tăng mạnh tỷ lệ linh thạch và bảo vật hiếm.',
    signatureSkill: 'Kim Ngọc Mãn Đường',
    passiveName: 'Tụ Bảo Bồn',
    passiveDesc: '+50% Linh thạch nhận được, +10% Tỉ lệ nhặt trang bị hiếm.',
    multipliers: { stoneRate: 1.5, lootChance: 1.1 },
  },
]

export const CLASS_BY_ID: Readonly<Record<ClassId, ClassDef>> = Object.fromEntries(
  CLASSES.map((c) => [c.id, c])
) as Record<ClassId, ClassDef>
