import { REALM_INDEX_BY_ID as R, REALMS } from './realms'

export interface EnemyDef {
  name: string
  hp: number
  atk: number
  def: number
  boss?: boolean
}

export interface LootEntry {
  itemId: string
  /** Independent drop chance 0..1. */
  chance: number
  min: number
  max: number
}

export interface DungeonDef {
  id: string
  name: string
  description: string
  minRealmIndex: number
  durationMs: number
  enemies: EnemyDef[]
  loot: LootEntry[]
  /** Spirit stones on victory, in seconds of current income. */
  stonesSeconds: number
  /** Boss drop: treasure id + chance. */
  bossLoot?: { itemId: string; chance: number }
}

const MIN = 60_000

/** Player baseline at a realm (see engine/combat getCombatStats); enemies are multiples of it. */
function baseline(realmIndex: number) {
  const p = REALMS[realmIndex].qiRate
  return { hp: 100 + 40 * p, atk: 10 + 4 * p, def: 2 + p }
}

function mob(name: string, realmIndex: number, hp = 0.35, atk = 0.4, def = 0.3): EnemyDef {
  const b = baseline(realmIndex)
  return { name, hp: Math.round(b.hp * hp), atk: Math.round(b.atk * atk), def: Math.round(b.def * def) }
}

function boss(name: string, realmIndex: number, hp = 1.1, atk = 0.85, def = 0.5): EnemyDef {
  return { ...mob(name, realmIndex, hp, atk, def), boss: true }
}

export const DUNGEONS: readonly DungeonDef[] = [
  {
    id: 'hau-son-lam',
    name: 'Hậu Sơn Lâm',
    description: 'Khu rừng sau núi, yêu thú cấp thấp lảng vảng. Nơi tập sự của tán tu mới nhập đạo.',
    minRealmIndex: R['luyen-khi-1'],
    durationMs: 3 * MIN,
    enemies: [mob('Lang yêu', R['luyen-khi-1']), mob('Lang yêu', R['luyen-khi-1']), boss('Hùng yêu', R['luyen-khi-1'], 1.1, 0.95, 0.5)],
    loot: [{ itemId: 'linh-thao', chance: 1, min: 3, max: 6 }, { itemId: 'huyet-tinh-chi', chance: 0.3, min: 1, max: 1 }],
    stonesSeconds: 150,
    bossLoot: { itemId: 'thiet-kiem', chance: 0.1 },
  },
  {
    id: 'hac-phong-dong',
    name: 'Hắc Phong Động',
    description: 'Hang gió đen hun hút, ma tu thường ẩn náu luyện tà công.',
    minRealmIndex: R['luyen-khi-4'],
    durationMs: 5 * MIN,
    enemies: [mob('Bức yêu', R['luyen-khi-4'], 0.3, 0.5, 0.2), mob('Độc xà', R['luyen-khi-4'], 0.4, 0.55, 0.3), boss('Hắc Phong Ma Tu', R['luyen-khi-4'], 1.15, 0.9, 0.5)],
    loot: [{ itemId: 'huyet-tinh-chi', chance: 1, min: 2, max: 4 }, { itemId: 'tu-linh-chi', chance: 0.25, min: 1, max: 1 }, { itemId: 'tu-khi-dan', chance: 0.3, min: 1, max: 1 }],
    stonesSeconds: 250,
    bossLoot: { itemId: 'huyen-quy-giap', chance: 0.08 },
  },
  {
    id: 'van-cot-quat',
    name: 'Vạn Cốt Quật',
    description: 'Hố xương vạn người, âm khí ngút trời. Khô lâu đứng dậy khi có hơi người sống.',
    minRealmIndex: R['luyen-khi-7'],
    durationMs: 8 * MIN,
    enemies: [mob('Khô lâu binh', R['luyen-khi-7']), mob('Khô lâu binh', R['luyen-khi-7']), mob('Khô lâu tướng', R['luyen-khi-7'], 0.5, 0.5, 0.4), boss('Thi Vương', R['luyen-khi-7'], 1.2, 0.8, 0.55)],
    loot: [{ itemId: 'tu-linh-chi', chance: 1, min: 1, max: 3 }, { itemId: 'pha-canh-dan', chance: 0.2, min: 1, max: 1 }],
    stonesSeconds: 350,
    bossLoot: { itemId: 'ngung-than-phu', chance: 0.08 },
  },
  {
    id: 'tuyet-son-dinh',
    name: 'Tuyết Sơn Đỉnh',
    description: 'Đỉnh núi tuyết quanh năm, nơi Thiên Tâm Liên nở giữa băng giá.',
    minRealmIndex: R['truc-co-1'],
    durationMs: 10 * MIN,
    enemies: [mob('Băng lang', R['truc-co-1']), mob('Tuyết yêu', R['truc-co-1'], 0.45, 0.5, 0.4), boss('Băng Giao', R['truc-co-1'], 1.15, 0.8, 0.6)],
    loot: [{ itemId: 'thien-tam-lien', chance: 0.8, min: 1, max: 2 }, { itemId: 'tu-linh-chi', chance: 1, min: 2, max: 3 }, { itemId: 'ngung-than-dan', chance: 0.3, min: 1, max: 1 }],
    stonesSeconds: 450,
    bossLoot: { itemId: 'bang-tam-chau', chance: 0.07 },
  },
  {
    id: 'hoa-diem-coc',
    name: 'Hỏa Diệm Cốc',
    description: 'Sơn cốc dung nham sôi sục. Hậu duệ của rồng lửa canh giữ kho báu cổ.',
    minRealmIndex: R['truc-co-3'],
    durationMs: 12 * MIN,
    enemies: [mob('Hỏa lân', R['truc-co-3'], 0.4, 0.55, 0.3), mob('Hỏa lân', R['truc-co-3'], 0.4, 0.55, 0.3), boss('Viêm Long Tử', R['truc-co-3'], 1.2, 0.8, 0.55)],
    loot: [{ itemId: 'thien-tam-lien', chance: 1, min: 1, max: 3 }, { itemId: 'tang-tho-dan', chance: 0.15, min: 1, max: 1 }],
    stonesSeconds: 600,
    bossLoot: { itemId: 'phi-kiem-tu-vi', chance: 0.06 },
  },
  {
    id: 'thien-ma-chien-truong',
    name: 'Thiên Ma Cổ Chiến Trường',
    description: 'Chiến trường thượng cổ nơi tiên ma đại chiến. Sát khí ngàn năm chưa tan.',
    minRealmIndex: R['kim-dan-1'],
    durationMs: 15 * MIN,
    enemies: [mob('Ma binh', R['kim-dan-1']), mob('Ma binh', R['kim-dan-1']), mob('Ma tướng', R['kim-dan-1'], 0.45, 0.5, 0.35), boss('Thiên Ma Tướng', R['kim-dan-1'], 1.2, 0.8, 0.55)],
    loot: [{ itemId: 'cuu-chuyen-can', chance: 0.6, min: 1, max: 1 }, { itemId: 'thien-tam-lien', chance: 1, min: 2, max: 4 }, { itemId: 'kim-nguyen-dan', chance: 0.15, min: 1, max: 1 }],
    stonesSeconds: 900,
    bossLoot: { itemId: 'thien-ma-giap', chance: 0.05 },
  },
]

export const DUNGEON_BY_ID: Readonly<Record<string, DungeonDef>> = Object.fromEntries(
  DUNGEONS.map((d) => [d.id, d]),
)
