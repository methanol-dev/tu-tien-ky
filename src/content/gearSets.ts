import type { AffixKey } from './affixes'

export interface SetBonusDef {
  /** Số lượng món cùng bộ trang bị đang mặc để kích hoạt hiệu ứng. */
  threshold: number
  /** Mô tả chiêu thức / hiệu ứng kích hoạt. */
  description: string
  /** Danh sách thuộc tính cộng thêm khi kích hoạt mốc này. */
  affixes: { key: AffixKey; value: number }[]
}

export interface GearSetDef {
  id: string
  name: string
  description: string
  bonuses: SetBonusDef[]
}

export const GEAR_SETS: readonly GearSetDef[] = [
  {
    id: 'ne-binh',
    name: 'Nê Bình Khởi Thủy',
    description: 'Bộ pháp bảo thuở hàn vi của thiếu niên ngõ Nê Bình, mộc mạc chất phác nhưng tích tụ cơ duyên nghịch thiên.',
    bonuses: [
      {
        threshold: 2,
        description: 'Đạo tâm kiên định: Tăng 15% Tốc độ tu luyện linh khí.',
        affixes: [{ key: 'qiRate', value: 0.15 }],
      },
      {
        threshold: 4,
        description: 'Vạn dặm tống thư: Tăng 12% Cơ duyên nhặt đồ và 20% Tụ bảo linh thạch.',
        affixes: [
          { key: 'lootChance', value: 0.12 },
          { key: 'stoneRate', value: 0.2 },
        ],
      },
    ],
  },
  {
    id: 'kiem-khi',
    name: 'Kiếm Khí Trường Thành',
    description: 'Khí giới sát phạt nơi biên cương cô độc, nhuốm máu đại yêu Man Hoang, kiếm ý ngút trời.',
    bonuses: [
      {
        threshold: 2,
        description: 'Kiếm khí tung hoành: Tăng 15% Sát thương công kích.',
        affixes: [{ key: 'atk', value: 0.15 }],
      },
      {
        threshold: 4,
        description: 'Sát phạt quả quyết: Tăng 10% Tỷ lệ bạo kích và 35% Sát thương bạo kích.',
        affixes: [
          { key: 'crit', value: 0.1 },
          { key: 'critDmg', value: 0.35 },
        ],
      },
      {
        threshold: 6,
        description: 'Nhất kiếm phá vạn pháp: Tăng 20% Thân pháp tốc đánh và 8% Hấp huyết hút máu.',
        affixes: [
          { key: 'atkSpeed', value: 0.2 },
          { key: 'lifesteal', value: 0.08 },
        ],
      },
    ],
  },
  {
    id: 'thu-gian-ho',
    name: 'Thư Giản Hồ Mịch Đạo',
    description: 'Bảo vật tôi rèn giữa chốn bùn lầy gió tanh mưa máu Thư Giản Hồ, tôi luyện sinh tồn tàn khốc.',
    bonuses: [
      {
        threshold: 2,
        description: 'Hộ thể ngoan cường: Tăng 25% Khí huyết và 15% Phòng thủ.',
        affixes: [
          { key: 'hp', value: 0.25 },
          { key: 'def', value: 0.15 },
        ],
      },
      {
        threshold: 4,
        description: 'Huyết chiến vấn đạo: Tăng 12% Hấp huyết hút máu khi giao chiến.',
        affixes: [{ key: 'lifesteal', value: 0.12 }],
      },
    ],
  },
  {
    id: 'lac-phach-son',
    name: 'Lạc Phách Tông Phong',
    description: 'Khí cụ của Lạc Phách Sơn phái, dưỡng kiếm tĩnh tâm, gia phong nề nếp thanh tịnh.',
    bonuses: [
      {
        threshold: 2,
        description: 'Tĩnh tâm ngưng thần: Tăng 20% Tốc độ tu luyện linh khí và 15% Phòng thủ.',
        affixes: [
          { key: 'qiRate', value: 0.2 },
          { key: 'def', value: 0.15 },
        ],
      },
      {
        threshold: 4,
        description: 'Hám Sơn quyền ý: Tăng 20% Khí huyết và 15% Công kích.',
        affixes: [
          { key: 'hp', value: 0.2 },
          { key: 'atk', value: 0.15 },
        ],
      },
    ],
  },
]

export const GEAR_SET_BY_ID: Readonly<Record<string, GearSetDef>> = Object.fromEntries(
  GEAR_SETS.map((s) => [s.id, s])
)
