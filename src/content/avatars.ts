export interface AvatarDef {
  id: string
  name: string
  title: string
  image: string
  description: string
  origin: string
}

export const AVATARS: AvatarDef[] = [
  {
    id: 'tran-binh-an',
    name: 'Trần Bình An',
    title: 'Ẩn Quan Kiếm Khí Trường Thành',
    image: 'assets/portraits/tran-binh-an.jpg',
    description: 'Thiếu niên giày cỏ ngõ Nê Bình, cõng gùi trúc nhỏ, tu luyện Hám Sơn Quyền và Dưỡng Kiếm Khí.',
    origin: 'Ly Châu Động Thiên',
  },
  {
    id: 'ninh-dieu',
    name: 'Ninh Diệu',
    title: 'Kiếm Tiên Đệ Nhất Thiên Hạ',
    image: 'assets/portraits/ninh-dieu.jpg',
    description: 'Thiên tài kiếm tu Kiếm Khí Trường Thành, kiếm ý vô song, đạo lữ của Trần Bình An.',
    origin: 'Kiếm Khí Trường Thành',
  },
  {
    id: 'a-luong',
    name: 'A Lương',
    title: 'Mãnh Nam Cõng Rổ Rau Muống',
    image: 'assets/portraits/a-luong.jpg',
    description: 'Kiếm thuật trác tuyệt thiên hạ, tính tình phóng khoáng tiêu sái, một kiếm bổ đôi thiên hạ.',
    origin: 'Hạo Nhiên Thiên Hạ',
  },
  {
    id: 'te-tinh-xuan',
    name: 'Tề Tĩnh Xuân',
    title: 'Sơn Nhai Thư Viện Tiên Sinh',
    image: 'assets/portraits/te-tinh-xuan.jpg',
    description: 'Nho gia thánh nhân, người gánh vác thiên đạo Ly Châu, người thầy dẫn lối Trần Bình An.',
    origin: 'Sơn Nhai Thư Viện',
  },
  {
    id: 'thoi-dong-son',
    name: 'Thôi Đông Sơn',
    title: 'Đại Đệ Tử Lạc Phách Sơn',
    image: 'assets/portraits/thoi-dong-son.jpg',
    description: 'Bạch y thiếu niên áo rộng tay dài, cựu tú tài đệ tử Văn Thánh, mưu tính thiên hạ.',
    origin: 'Lạc Phách Sơn',
  },
  {
    id: 'ly-bao-binh',
    name: 'Lý Bảo Bình',
    title: 'Tiểu Nữ Hiệp Áo Đỏ',
    image: 'assets/portraits/ly-bao-binh.jpg',
    description: 'Tiểu cô nương áo đỏ đeo hồ lô chương bản, đệ tử đầu tiên của Trần Bình An trên đường cầu đạo.',
    origin: 'Ly Châu Động Thiên',
  },
  {
    id: 'nguy-bach',
    name: 'Ngụy Bách',
    title: 'Bắc Nhạc Sơn Thần Phi Vân Sơn',
    image: 'assets/portraits/nguy-bach.jpg',
    description: 'Thần linh thổ địa khoác áo bào trắng kim tuyến, bạn tri giao của Lạc Phách Sơn.',
    origin: 'Phi Vân Sơn',
  },
  {
    id: 'tran-thanh-do',
    name: 'Trần Thanh Đô',
    title: 'Lão Đại Kiếm Tiên Kiếm Khí Trường Thành',
    image: 'assets/portraits/tran-thanh-do.jpg',
    description: 'Kiếm đạo đỉnh phong vạn năm, một người một kiếm trấn thủ Man Hoang, định hải thần châm.',
    origin: 'Kiếm Khí Trường Thành',
  },
]

export const AVATAR_BY_ID: Record<string, AvatarDef> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a]),
)

export interface EvolutionStage {
  id: string
  name: string
  subtitle: string
  weapon: string
  outfit: string
  ringColor: string
  glowColor: string
  swordCount: number
  image: string
}

export function getEvolutionStage(realmIndex: number): EvolutionStage {
  if (realmIndex < 4) {
    return {
      id: 'thieu-nien',
      name: 'Thiếu Niên Giày Cỏ',
      subtitle: 'Ngõ Nê Bình · Cõng gùi trúc',
      weapon: 'Hòe Mộc Kiếm',
      outfit: 'Áo vải thô xắn gấu',
      ringColor: '#bfae88',
      glowColor: 'rgba(191, 174, 136, 0.25)',
      swordCount: 0,
      image: 'assets/characters/stage-1.jpg',
    }
  }
  if (realmIndex < 16) {
    return {
      id: 'du-hiep',
      name: 'Dưỡng Kiếm Du Hiệp',
      subtitle: 'Hành tẩu giang hồ · Nuôi dưỡng phi kiếm',
      weapon: 'Lung Trung Tước & Kiếm Hồ Lô',
      outfit: 'Thanh y du hiệp',
      ringColor: '#34d399',
      glowColor: 'rgba(52, 211, 153, 0.3)',
      swordCount: 1,
      image: 'assets/characters/stage-2.jpg',
    }
  }
  if (realmIndex < 28) {
    return {
      id: 'an-quan',
      name: 'Bào Xanh Ẩn Quan',
      subtitle: 'Kiếm Khí Trường Thành · Trâm bích ngọc',
      weapon: 'Song Phi Kiếm & Dạ Du Kiếm',
      outfit: 'Bào xanh Ẩn Quan',
      ringColor: '#e0bf4a',
      glowColor: 'rgba(224, 191, 74, 0.4)',
      swordCount: 2,
      image: 'assets/characters/stage-3.jpg',
    }
  }
  return {
    id: 'kiem-tien',
    name: 'Tuyệt Đỉnh Kiếm Tiên',
    subtitle: 'Vạn Kiếm Quy Tông · Pháp tướng thông thiên',
    weapon: 'Vạn Cổ Kiếm Ý & Trảm Tiên Kiếm Trận',
    outfit: 'Bạch y tiên bào',
    ringColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    swordCount: 4,
    image: 'assets/characters/stage-4.jpg',
  }
}
