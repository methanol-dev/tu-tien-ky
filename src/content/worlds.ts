import { REALM_INDEX_BY_ID } from './realms'

export type WorldId =
  | 'hao-nhien'
  | 'kiem-khi'
  | 'man-hoang'
  | 'ngu-thai'
  | 'thanh-minh'
  | 'lien-hoa'

export interface WorldDef {
  id: WorldId
  name: string
  title: string
  description: string
  ruler: string
  dominantFaction: string
  glyph: string
  minRealmIndex: number
  accentColor: string
}

export const WORLDS: readonly WorldDef[] = [
  {
    id: 'hao-nhien',
    name: 'Hạo Nhiên Thiên Hạ',
    title: 'Cửu Châu Văn Đạo',
    description: 'Nho Gia độc tôn, 72 Thư Viện và Văn Miếu cai quản trật tự nhân gian. Nơi khởi đầu của thiếu niên giày cỏ ngõ Nê Bình.',
    ruler: 'Chí Thánh Tiên Sư & Lễ Thánh',
    dominantFaction: 'Nho Gia Thư Viện',
    glyph: '🌏',
    minRealmIndex: 0,
    accentColor: '#5aa391',
  },
  {
    id: 'kiem-khi',
    name: 'Kiếm Khí Trường Thành',
    title: 'Biên Ải Sinh Tử',
    description: 'Chiến lũy vạn dặm ngăn cách Hạo Nhiên và Man Hoang. Mười ngàn năm chém giết, nơi ngạo cốt kiếm tu rực cháy.',
    ruler: 'Lão Kiếm Đầu Trần Thanh Đô & Ẩn Quan',
    dominantFaction: 'Thuần Túy Kiếm Tu',
    glyph: '🗡️',
    minRealmIndex: REALM_INDEX_BY_ID['truc-the-1'] ?? 13,
    accentColor: '#d1443b',
  },
  {
    id: 'man-hoang',
    name: 'Man Hoang Thiên Hạ',
    title: 'Vạn Tộc Yêu Giới',
    description: 'Vùng đất hoang sơ khát máu của Yêu Tộc. Luật rừng nhược nhục cường thực, nơi Thập Tứ Vương Tọa đại yêu ngự trị.',
    ruler: 'Đại Tổ Man Hoang & Thập Tứ Vương Tọa',
    dominantFaction: 'Yêu Tộc Quân Trướng',
    glyph: '🏜️',
    minRealmIndex: REALM_INDEX_BY_ID['dong-phu-1'] ?? 16,
    accentColor: '#e0bf4a',
  },
  {
    id: 'ngu-thai',
    name: 'Ngũ Thải Thiên Hạ',
    title: 'Tân Giới Kiếm Đạo',
    description: 'Thiên hạ thứ năm do nửa tòa Kiếm Khí Trường Thành thăng hoa kiến tạo. Đất lành thuần khiết của kiếm tu thế hệ mới.',
    ruler: 'Đệ Nhất Nhân Ninh Diệu',
    dominantFaction: 'Phi Thăng Thành Kiếm Tu',
    glyph: '🌈',
    minRealmIndex: REALM_INDEX_BY_ID['quan-hai-1'] ?? 19,
    accentColor: '#a855f7',
  },
  {
    id: 'thanh-minh',
    name: 'Thanh Minh Thiên Hạ',
    title: 'Thập Lục Châu Đạo Môn',
    description: 'Đạo gia độc tôn dưới Bạch Ngọc Kinh thần thoại. Năm Thành Mười Hai Lầu chọc thủng chín tầng mây.',
    ruler: 'Đạo Tổ & Tam Đại Chưởng Giáo',
    dominantFaction: 'Bạch Ngọc Kinh Đạo Gia',
    glyph: '☁️',
    minRealmIndex: REALM_INDEX_BY_ID['long-mon-1'] ?? 22,
    accentColor: '#38bdf8',
  },
  {
    id: 'lien-hoa',
    name: 'Liên Hoa Thiên Hạ',
    title: 'Phật Môn Tịnh Độ',
    description: 'Cõi Phật thanh tịnh ngập tràn hoa sen bồ đề. Tu Di Sơn sừng sững hóa giải vô lượng nghiệp lực nhân gian.',
    ruler: 'Phật Tổ Đại Giác Ngộ',
    dominantFaction: 'Bát Đại Thiền Tông',
    glyph: '🪷',
    minRealmIndex: REALM_INDEX_BY_ID['kim-dan-1'] ?? 25,
    accentColor: '#fbbf24',
  },
]

export const WORLD_BY_ID: Readonly<Record<WorldId, WorldDef>> = Object.fromEntries(
  WORLDS.map((w) => [w.id, w])
) as Record<WorldId, WorldDef>

