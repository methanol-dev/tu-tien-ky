import type { NpcDef } from './types'

export const NPCS: readonly NpcDef[] = [
  {
    id: 'tran-binh-an',
    name: 'Trần Bình An',
    glyph: '安',
    title: 'Thiếu niên ngõ Nê Bình · Ẩn Quan Lạc Phách Sơn',
    description: 'Người mang giày cỏ cõng gùi trúc, kiên trì nói đạo lý nhưng nắm đấm và kiếm pháp đều chấn động thế gian.',
  },
  {
    id: 'ninh-dieu',
    name: 'Ninh Diêu',
    glyph: '寧',
    title: 'Kiếm tu Kiếm Khí Trường Thành',
    description: 'Nữ kiếm tiên dung nhan tuyệt mỹ, tính cách cương trực quyết liệt, đạo lữ một đời của Trần Bình An.',
  },
  {
    id: 'te-tinh-xuan',
    name: 'Tề Tĩnh Xuân',
    glyph: '春',
    title: 'Đại Nho trấn thủ Ly Châu Động Thiên',
    description: 'Tiên sinh ngõ Nê Bình, học vấn quán thông trời đất, một mình gánh vác nhân quả trấn nhỏ che chở muôn dân.',
  },
  {
    id: 'a-luong',
    name: 'A Lương',
    glyph: '良',
    title: 'Đại kiếm tiên vạn dặm',
    description: 'Đội nón lá ngậm cọng cỏ, tính cách phóng khoáng giang hồ. "Kiếm khí dài ba vạn dặm, kiếm quang chiếu mười chín châu".',
  },
  {
    id: 'ly-bao-binh',
    name: 'Lý Bảo Bình',
    glyph: '瓶',
    title: 'Học trò Tề tiên sinh · Đệ tử mũ đỏ',
    description: 'Tiểu cô nương hoạt bát mang gùi trúc nhỏ và chiếc mũ đỏ đặc trưng, đệ tử chân truyền của Nho gia.',
  },
  {
    id: 'thoi-dong-son',
    name: 'Thôi Đông Sơn',
    glyph: '山',
    title: 'Đại đệ tử Lạc Phách Sơn',
    description: 'Thiếu niên áo trắng thông tuệ kỳ quái, tinh thông bách gia, một lòng phụng sự tiên sinh Trần Bình An.',
  },
  {
    id: 'nguy-bach',
    name: 'Ngụy Bách',
    glyph: '檗',
    title: 'Bắc Nhạc Chính Thần',
    description: 'Sơn thần áo trắng phiêu dật, tri kỷ hỗ trợ đắc lực cho sự phát triển của sơn mạch Lạc Phách Sơn.',
  },
  {
    id: 'tran-thanh-do',
    name: 'Trần Thanh Đô',
    glyph: '都',
    title: 'Lão kiếm tiên Trường Thành',
    description: 'Người đứng đầu Kiếm Khí Trường Thành trấn giữ Man Hoang suốt vạn năm, khí phách ngút ngàn cổ kim.',
  },
]

export const NPC_BY_ID: Readonly<Record<string, NpcDef>> = Object.fromEntries(
  NPCS.map((n) => [n.id, n]),
)
