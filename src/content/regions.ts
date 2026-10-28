/**
 * Journey regions (vùng). Each region is a side-scrolling run of STAGES_PER_REGION stages;
 * the last stage is the boss. Enemy stats are multiples of the player baseline at the
 * region's minimum realm, scaled by stage and difficulty.
 */
import { REALM_INDEX_BY_ID as R, REALMS } from './realms'
import type { WorldId } from './worlds'

export type SilhouetteId =
  | 'wolf'
  | 'bear'
  | 'bat'
  | 'snake'
  | 'cultist'
  | 'skeleton'
  | 'skeleton-lord'
  | 'yeti'
  | 'serpent'
  | 'lizard'
  | 'dragonling'
  | 'demon'
  | 'demon-general'

/** Multipliers relative to the player baseline at the region's `minRealmIndex`. */
export interface EnemyTemplate {
  id: string
  name: string
  silhouette: SilhouetteId
  imageUrl?: string
  hp: number
  atk: number
  def: number
  boss?: boolean
}

export interface LootEntry {
  itemId: string
  /** Independent drop chance 0..1 (rolled per stage clear, see HERB_STAGE_CHANCE_SCALE). */
  chance: number
  min: number
  max: number
}

/** CSS colours for the parallax backdrop. */
export interface RegionPalette {
  sky: string
  far: string
  mid: string
  near: string
  ground: string
  accent: string
}

export interface RegionDef {
  id: string
  name: string
  description: string
  worldId: WorldId
  minRealmIndex: number
  /** 1..9, drives gear tier together with difficulty. */
  tier: number
  palette: RegionPalette
  backdropUrl?: string
  enemies: EnemyTemplate[]
  boss: EnemyTemplate
  loot: LootEntry[]
  /** Named gear the boss may drop from a red chest. */
  namedGear?: { gearId: string; chance: number }
}

export const STAGES_PER_REGION = 10
export const DIFFICULTY_NAMES = ['Thường', 'Hiểm', 'Tử', 'Tuyệt'] as const
export type Difficulty = 0 | 1 | 2 | 3
export const MAX_DIFFICULTY: Difficulty = 3

/** Player baseline combat stats at a realm (engine/combat applies gear on top). */
export function baselineStats(realmIndex: number): { hp: number; atk: number; def: number } {
  const p = REALMS[Math.min(realmIndex, REALMS.length - 1)].qiRate
  return { hp: 100 + 40 * p, atk: 10 + 4 * p, def: 2 + p }
}

export function difficultyMult(d: Difficulty): number {
  return 3 ** d
}

export function stageMult(stage: number): number {
  return 1 + 0.04 * (stage - 1)
}

export function enemyStats(region: RegionDef, t: EnemyTemplate, stage: number, d: Difficulty): { hp: number; atk: number; def: number } {
  const b = baselineStats(region.minRealmIndex)
  const m = stageMult(stage) * difficultyMult(d)
  return {
    hp: Math.max(1, Math.round(b.hp * t.hp * m)),
    atk: Math.max(1, Math.round(b.atk * t.atk * m)),
    def: Math.max(0, Math.round(b.def * t.def * m)),
  }
}

/** Gear tier found in a region at a difficulty (1..9). */
export function gearTier(region: RegionDef, d: Difficulty): number {
  return region.tier + d
}

const mob = (id: string, name: string, silhouette: SilhouetteId, hp = 0.35, atk = 0.4, def = 0.3, imageUrl?: string): EnemyTemplate => ({ id, name, silhouette, hp, atk, def, imageUrl })
const boss = (id: string, name: string, silhouette: SilhouetteId, hp = 1.0, atk = 0.65, def = 0.5, imageUrl?: string): EnemyTemplate => ({ id, name, silhouette, hp, atk, def, boss: true, imageUrl })

export const REGIONS: readonly RegionDef[] = [
  {
    id: 'hau-son-lam',
    name: 'Ly Châu Động Thiên',
    description: 'Trấn nhỏ ngõ Nê Bình thuộc Ly Châu Động Thiên. Quanh lò gốm Long Diêu yêu khí chực chờ, ngoại nhân dòm ngó cơ duyên.',
    worldId: 'hao-nhien',
    minRealmIndex: R['luyen-khi-1'],
    tier: 1,
    palette: { sky: '#121a16', far: '#1d2a23', mid: '#24362c', near: '#2d4536', ground: '#0d1411', accent: '#5aa391' },
    backdropUrl: 'assets/regions/ly-chau-dong-thien.jpg',
    enemies: [
      mob('da-khuyen', 'Dã khuyển', 'wolf', 0.35, 0.4, 0.3, '/assets/monsters/da-khuyen.png'),
      mob('bach-mang', 'Bạch mãng', 'snake', 0.3, 0.45, 0.2, '/assets/monsters/bach-mang.png'),
    ],
    boss: boss('tran-long-mang', 'Trấn Long Mãng Xà', 'bear', 1.0, 0.65, 0.5, '/assets/monsters/tran-long-mang.png'),
    loot: [{ itemId: 'linh-thao', chance: 1, min: 2, max: 4 }, { itemId: 'huyet-tinh-chi', chance: 0.3, min: 1, max: 1 }],
    namedGear: { gearId: 'thiet-kiem', chance: 0.25 },
  },
  {
    id: 'hac-phong-dong',
    name: 'Hoang Dã Nam Hạ',
    description: 'Đường thiên lý tống thư đưa nhóm trẻ Lý Bảo Bình nam hạ đến Sơn Nhai Thư Viện. Dã tu giang hồ rình rập ven đường.',
    worldId: 'hao-nhien',
    minRealmIndex: R['luyen-khi-4'],
    tier: 2,
    palette: { sky: '#101014', far: '#1a1a22', mid: '#23232e', near: '#2c2c3a', ground: '#0a0a0e', accent: '#7f7fb3' },
    backdropUrl: 'assets/regions/hoang-da-nam-ha.jpg',
    enemies: [
      mob('da-tu-cuop-bao', 'Dã tu cướp báu', 'cultist', 0.35, 0.5, 0.25, '/assets/monsters/da-tu-cuop-bao.png'),
      mob('hac-son-xa', 'Hắc sơn xà', 'snake', 0.4, 0.55, 0.3, '/assets/monsters/bach-mang.png'),
      mob('da-dieu-yeu', 'Dạ điểu yêu', 'bat', 0.3, 0.5, 0.2, '/assets/monsters/da-dieu-yeu.png'),
    ],
    boss: boss('hac-son-lao-quai', 'Hắc Sơn Lão Quái', 'cultist', 1.05, 0.7, 0.5, '/assets/monsters/hac-son-lao-quai.png'),
    loot: [{ itemId: 'huyet-tinh-chi', chance: 1, min: 1, max: 3 }, { itemId: 'tu-linh-chi', chance: 0.25, min: 1, max: 1 }, { itemId: 'tu-khi-dan', chance: 0.3, min: 1, max: 1 }],
    namedGear: { gearId: 'huyen-quy-giap', chance: 0.2 },
  },
  {
    id: 'van-cot-quat',
    name: 'Thư Giản Hồ',
    description: 'Chốn bùn lầy dã tu cá lớn nuốt cá bé. Nơi Trần Bình An nghiền nát văn đảm, dùng quy củ và nắm đấm định lại nhân tâm.',
    worldId: 'hao-nhien',
    minRealmIndex: R['luyen-khi-7'],
    tier: 3,
    palette: { sky: '#14121a', far: '#201c2b', mid: '#2a2538', near: '#352f46', ground: '#0d0b12', accent: '#bfae88' },
    backdropUrl: 'assets/regions/thu-gian-ho.jpg',
    enemies: [
      mob('thuy-phi-ta-tu', 'Thủy phỉ tà tu', 'skeleton', 0.35, 0.4, 0.3, '/assets/monsters/thuy-phi-ta-tu.png'),
      mob('thuy-quy-tuong', 'Thủy quỷ tướng', 'skeleton', 0.5, 0.5, 0.4, '/assets/monsters/thuy-quy-tuong.png'),
    ],
    boss: boss('luu-chi-mau', 'Lưu Chí Mậu', 'skeleton-lord', 1.1, 0.65, 0.55, '/assets/monsters/luu-chi-mau.png'),
    loot: [{ itemId: 'tu-linh-chi', chance: 1, min: 1, max: 2 }, { itemId: 'pha-canh-dan', chance: 0.2, min: 1, max: 1 }],
    namedGear: { gearId: 'ngung-than-phu', chance: 0.2 },
  },
  {
    id: 'tuyet-son-dinh',
    name: 'Lạc Phách Sơn',
    description: 'Ngọn núi tổ đình cơ nghiệp tại Bảo Bình Châu, quy tụ bằng hữu và đệ tử chân truyền dưới sự phù trợ của Ngụy Bách.',
    worldId: 'hao-nhien',
    minRealmIndex: R['truc-co-1'],
    tier: 4,
    palette: { sky: '#121a24', far: '#243447', mid: '#34495f', near: '#4a637c', ground: '#0e141c', accent: '#a9ccff' },
    backdropUrl: 'assets/regions/lac-phach-son.svg',
    enemies: [
      mob('son-da-di-thu', 'Sơn dã dị thú', 'wolf', 0.35, 0.4, 0.3, '/assets/monsters/da-khuyen.png'),
      mob('tuyet-yeu-ho-son', 'Tuyết yêu hộ sơn', 'yeti', 0.45, 0.5, 0.4, '/assets/monsters/bac-nhac-co-than.png'),
    ],
    boss: boss('bac-nhac-co-than', 'Bắc Nhạc Cổ Thần', 'serpent', 1.05, 0.65, 0.6, '/assets/monsters/bac-nhac-co-than.png'),
    loot: [{ itemId: 'thien-tam-lien', chance: 0.8, min: 1, max: 2 }, { itemId: 'tu-linh-chi', chance: 1, min: 1, max: 2 }, { itemId: 'ngung-than-dan', chance: 0.3, min: 1, max: 1 }],
    namedGear: { gearId: 'bang-tam-chau', chance: 0.18 },
  },
  {
    id: 'hoa-diem-coc',
    name: 'Kiếm Khí Trường Thành',
    description: 'Tường thành vạn trượng ngăn Man Hoang Yêu Tộc. Nơi kiếm tu ngàn năm đổ máu và danh xưng Ẩn Quan ra đời.',
    worldId: 'kiem-khi',
    minRealmIndex: R['truc-co-3'],
    tier: 5,
    palette: { sky: '#1a0f0c', far: '#2e1712', mid: '#42201a', near: '#5a2b20', ground: '#120907', accent: '#d1443b' },
    backdropUrl: 'assets/regions/kiem-khi-truong-thanh.svg',
    enemies: [
      mob('man-hoang-yeu-binh', 'Yêu binh tiền phong', 'lizard', 0.4, 0.55, 0.3, '/assets/monsters/yeu-hoang-than-thoai.png'),
      mob('tram-kiem-yeu-xa', 'Trảm kiếm yêu xà', 'snake', 0.35, 0.6, 0.25, '/assets/monsters/bach-mang.png'),
    ],
    boss: boss('dai-yeu-man-hoang', 'Đại Yêu Man Hoang', 'dragonling', 1.1, 0.65, 0.55, '/assets/monsters/yeu-hoang-than-thoai.png'),
    loot: [{ itemId: 'thien-tam-lien', chance: 1, min: 1, max: 2 }, { itemId: 'tang-tho-dan', chance: 0.15, min: 1, max: 1 }],
    namedGear: { gearId: 'phi-kiem-tu-vi', chance: 0.15 },
  },
  {
    id: 'thien-ma-chien-truong',
    name: 'Man Hoang Thiên Hạ',
    description: 'Chiến trường sào huyệt Yêu tộc, nơi Trần Bình An cùng Ninh Diêu vấn kiếm thiên hạ, hoàn thành ước hẹn mười năm.',
    worldId: 'man-hoang',
    minRealmIndex: R['kim-dan-1'],
    tier: 6,
    palette: { sky: '#160d14', far: '#261522', mid: '#361d30', near: '#48273f', ground: '#0e080d', accent: '#e0bf4a' },
    backdropUrl: 'assets/regions/man-hoang-thien-ha.svg',
    enemies: [
      mob('yeu-toc-ho-phap', 'Yêu tộc hộ pháp', 'demon', 0.35, 0.4, 0.3, '/assets/monsters/yeu-hoang-than-thoai.png'),
      mob('chien-truong-ma-tuong', 'Chiến trường ma tướng', 'demon', 0.45, 0.5, 0.35, '/assets/monsters/yeu-hoang-than-thoai.png'),
    ],
    boss: boss('yeu-hoang-than-thoai', 'Yêu Hoàng Thần Thoại', 'demon-general', 1.1, 0.65, 0.55, '/assets/monsters/yeu-hoang-than-thoai.png'),
    loot: [{ itemId: 'cuu-chuyen-can', chance: 0.6, min: 1, max: 1 }, { itemId: 'thien-tam-lien', chance: 1, min: 1, max: 3 }, { itemId: 'kim-nguyen-dan', chance: 0.15, min: 1, max: 1 }],
    namedGear: { gearId: 'thien-ma-giap', chance: 0.12 },
  },
  {
    id: 'phi-thang-thanh',
    name: 'Phi Thăng Thành',
    description: 'Tân Thiên Hạ do Kiếm Khí Trường Thành thăng hoa. Nơi Kiếm Tu trẻ tuổi mài giũa kiếm phong dưới sự chỉ điểm của Đệ Nhất Nhân Ninh Diệu.',
    worldId: 'ngu-thai',
    minRealmIndex: R['kim-dan-3'],
    tier: 7,
    palette: { sky: '#170f24', far: '#281a3e', mid: '#3a2559', near: '#4f3279', ground: '#0f0a17', accent: '#a855f7' },
    backdropUrl: 'assets/regions/lac-phach-son.svg',
    enemies: [
      mob('ngu-thai-kiem-linh', 'Ngũ Thải Kiếm Linh', 'dragonling', 0.45, 0.6, 0.35, '/assets/monsters/ninh-dieu-kiem-y.png'),
      mob('tinh-hoa-kiem-tu', 'Tinh hoa Kiếm Tu', 'cultist', 0.5, 0.65, 0.4, '/assets/monsters/da-tu-cuop-bao.png'),
    ],
    boss: boss('ninh-dieu-kiem-y', 'Ninh Diệu Kiếm Ý Huyễn Thân', 'demon-general', 1.15, 0.7, 0.6, '/assets/monsters/ninh-dieu-kiem-y.png'),
    loot: [{ itemId: 'cuu-chuyen-can', chance: 0.8, min: 1, max: 2 }, { itemId: 'kim-nguyen-dan', chance: 0.25, min: 1, max: 1 }],
    namedGear: { gearId: 'phi-kiem-tu-vi', chance: 0.2 },
  },
  {
    id: 'bach-ngoc-kinh',
    name: 'Bạch Ngọc Kinh',
    description: 'Thanh Minh Thiên Hạ đạo môn tổ đình. Mười hai lầu năm thành cao vút cửu tiêu, Đạo Tổ và Tam Đại Chưởng Giáo trấn giữ đạo mạch.',
    worldId: 'thanh-minh',
    minRealmIndex: R['nguyen-anh-1'],
    tier: 8,
    palette: { sky: '#0c1a24', far: '#152d3e', mid: '#1f435c', near: '#2c5c7d', ground: '#08121a', accent: '#38bdf8' },
    backdropUrl: 'assets/regions/thu-gian-ho.jpg',
    enemies: [
      mob('dao-mon-chan-nhan', 'Đạo Môn Đạo Đồng', 'cultist', 0.5, 0.65, 0.4, '/assets/monsters/da-tu-cuop-bao.png'),
      mob('thanh-hu-kiem-khi', 'Thanh Hư Kiếm Khí', 'serpent', 0.55, 0.7, 0.45, '/assets/monsters/ninh-dieu-kiem-y.png'),
    ],
    boss: boss('luc-tram-phan-than', 'Lục Trầm Hóa Thân', 'demon-general', 1.2, 0.75, 0.65, '/assets/monsters/luu-chi-mau.png'),
    loot: [{ itemId: 'cuu-chuyen-can', chance: 1, min: 2, max: 3 }],
  },
  {
    id: 'tu-di-son',
    name: 'Tu Di Sơn',
    description: 'Liên Hoa Thiên Hạ Phật Môn cực lạc tịnh độ. Vạn trượng kim thân phổ độ chúng sinh, hóa giải vạn trượng sát nghiệp cửu châu.',
    worldId: 'lien-hoa',
    minRealmIndex: R['hoa-than-1'],
    tier: 9,
    palette: { sky: '#241a0c', far: '#3e2d15', mid: '#5c431f', near: '#7d5c2c', ground: '#1a1208', accent: '#fbbf24' },
    backdropUrl: 'assets/regions/ly-chau-dong-thien.jpg',
    enemies: [
      mob('kim-cuong-la-han', 'Kim Cương La Hán', 'yeti', 0.6, 0.65, 0.55, '/assets/monsters/bac-nhac-co-than.png'),
      mob('bo-de-ho-phap', 'Bồ Đề Hộ Pháp', 'demon', 0.65, 0.7, 0.5, '/assets/monsters/bac-nhac-co-than.png'),
    ],
    boss: boss('phat-da-phap-tuong', 'Phật Đà Kim Thân Pháp Tượng', 'demon-general', 1.25, 0.8, 0.7, '/assets/monsters/bac-nhac-co-than.png'),
    loot: [{ itemId: 'cuu-chuyen-can', chance: 1, min: 2, max: 4 }],
  },
]

export const REGION_BY_ID: Readonly<Record<string, RegionDef>> = Object.fromEntries(REGIONS.map((r) => [r.id, r]))
export const REGION_INDEX_BY_ID: Readonly<Record<string, number>> = Object.fromEntries(REGIONS.map((r, i) => [r.id, i]))
