/**
 * Hệ thống 11 Cảnh Giới Võ Đạo (Võ Phu) trong Kiếm Lai.
 * Tham chiếu từ: https://thuvienanime.net/kiem-lai/#Tong-quan-ve-Kiem-Lai
 *
 * Con đường rèn luyện nhục thân và ý chí của Trần Bình An:
 * - Luyện Thể Tam Cảnh: Nê Phôi, Mộc Thai, Thủy Ngân
 * - Luyện Khí Tam Cảnh: Anh Hồn, Hùng Phách, Võ Đảm
 * - Luyện Thần Tam Cảnh: Kim Thân, Viễn Du, Sơn Điên
 * - Chỉ Cảnh (Thập Cảnh): Khí Thịnh, Quy Chân, Thần Đáo
 * - Thập Nhất Cảnh: Võ Thần Cảnh
 */

export interface MartialStage {
  id: string
  name: string
  group: 'Luyện Thể Tam Cảnh' | 'Luyện Khí Tam Cảnh' | 'Luyện Thần Tam Cảnh' | 'Chỉ Cảnh (Thập Cảnh)' | 'Thập Nhất Cảnh'
  minPunches: number
  description: string
  bonus: {
    atkPercent: number
    defPercent: number
    hpPercent: number
  }
}

export const MARTIAL_STAGES: readonly MartialStage[] = [
  {
    id: 'ne-phoi',
    name: 'Nê Phôi Cảnh',
    group: 'Luyện Thể Tam Cảnh',
    minPunches: 0,
    description: 'Võ phu sơ nhập, nhục thân như bùn đất lò gốm, bắt đầu gọt giũa kình lực.',
    bonus: { atkPercent: 0, defPercent: 0, hpPercent: 0 },
  },
  {
    id: 'moc-thai',
    name: 'Mộc Thai Cảnh',
    group: 'Luyện Thể Tam Cảnh',
    minPunches: 50,
    description: 'Gân cốt vững như thân cây già, lực quyền phát ra đã có tiếng gió rít.',
    bonus: { atkPercent: 0.05, defPercent: 0.03, hpPercent: 0.05 },
  },
  {
    id: 'thuy-ngan',
    name: 'Thủy Ngân Cảnh',
    group: 'Luyện Thể Tam Cảnh',
    minPunches: 200,
    description: 'Khí huyết cô đọng chảy cuồn cuộn như thủy ngân, lực bộc phát mạnh mẽ.',
    bonus: { atkPercent: 0.1, defPercent: 0.06, hpPercent: 0.1 },
  },
  {
    id: 'anh-hon',
    name: 'Anh Hồn Cảnh',
    group: 'Luyện Khí Tam Cảnh',
    minPunches: 600,
    description: 'Hơi thở ngưng tụ anh hồn, quyền ý câu thông ý chí sinh tử.',
    bonus: { atkPercent: 0.18, defPercent: 0.1, hpPercent: 0.16 },
  },
  {
    id: 'hung-phach',
    name: 'Hùng Phách Cảnh',
    group: 'Luyện Khí Tam Cảnh',
    minPunches: 1_500,
    description: 'Phách lực dâng trào hùng hậu, khí thế áp đảo tà ma ngoại đạo.',
    bonus: { atkPercent: 0.28, defPercent: 0.16, hpPercent: 0.24 },
  },
  {
    id: 'vo-dam',
    name: 'Võ Đảm Cảnh',
    group: 'Luyện Khí Tam Cảnh',
    minPunches: 3_500,
    description: 'Đúc thành võ đảm kiên cường, đứng trước cường địch trời đất không chút dao động.',
    bonus: { atkPercent: 0.4, defPercent: 0.24, hpPercent: 0.35 },
  },
  {
    id: 'kim-than',
    name: 'Kim Thân Cảnh',
    group: 'Luyện Thần Tam Cảnh',
    minPunches: 8_000,
    description: 'Nhục thân đúc thành Kim Thân bất hoại, đao kiếm phàm tục chém vào như gãi ngứa.',
    bonus: { atkPercent: 0.6, defPercent: 0.38, hpPercent: 0.5 },
  },
  {
    id: 'vien-du',
    name: 'Viễn Du Cảnh',
    group: 'Luyện Thần Tam Cảnh',
    minPunches: 18_000,
    description: 'Thần du vạn dặm, quyền phong vượt ngàn dặm chấn động sơn hà.',
    bonus: { atkPercent: 0.85, defPercent: 0.55, hpPercent: 0.7 },
  },
  {
    id: 'son-dien',
    name: 'Sơn Điên Cảnh',
    group: 'Luyện Thần Tam Cảnh',
    minPunches: 40_000,
    description: 'Đứng trên đỉnh núi nhìn xuống nhân gian, võ đạo chín tầng viên mãn.',
    bonus: { atkPercent: 1.2, defPercent: 0.8, hpPercent: 1.0 },
  },
  {
    id: 'chi-canh',
    name: 'Chỉ Cảnh (Quy Chân)',
    group: 'Chỉ Cảnh (Thập Cảnh)',
    minPunches: 80_000,
    description: 'Võ phu thập cảnh chí tôn! Cảnh giới của Trần Bình An, sánh ngang đại tu sĩ Thượng Ngũ Cảnh.',
    bonus: { atkPercent: 1.7, defPercent: 1.2, hpPercent: 1.5 },
  },
  {
    id: 'vo-than',
    name: 'Võ Thần Cảnh',
    group: 'Thập Nhất Cảnh',
    minPunches: 150_000,
    description: 'Vô địch thiên hạ, một quyền phá vạn pháp, trường sinh cùng nhật nguyệt đất trời!',
    bonus: { atkPercent: 2.5, defPercent: 1.8, hpPercent: 2.2 },
  },
]

/** Tính toán số quyền đã xuất (võ ý) dựa trên tiến trình chơi của Trần Bình An */
export function getMartialPunches(stats: {
  enemiesSlain: number
  bossesSlain: number
  stagesCleared: number
  breakthroughs: number
}): number {
  return (
    stats.enemiesSlain +
    stats.bossesSlain * 10 +
    stats.stagesCleared * 5 +
    stats.breakthroughs * 50
  )
}

/** Lấy cảnh giới võ đạo hiện tại dựa trên tổng số quyền */
export function getMartialRealm(punches: number): MartialStage {
  for (let i = MARTIAL_STAGES.length - 1; i >= 0; i--) {
    if (punches >= MARTIAL_STAGES[i].minPunches) {
      return MARTIAL_STAGES[i]
    }
  }
  return MARTIAL_STAGES[0]
}

/** Lấy cảnh giới võ đạo kế tiếp nếu chưa đạt đỉnh */
export function getNextMartialRealm(punches: number): MartialStage | null {
  for (let i = 0; i < MARTIAL_STAGES.length; i++) {
    if (punches < MARTIAL_STAGES[i].minPunches) {
      return MARTIAL_STAGES[i]
    }
  }
  return null
}
