import { REALM_INDEX_BY_ID as R } from '../realms'
import type { EventDef } from './types'

const MIN = 60_000

/** Đời thường: low-stakes flavour, available early. */
export const DAILY_EVENTS: readonly EventDef[] = [
  {
    id: 'giac-mong-la',
    title: 'Giấc mộng kỳ lạ',
    text: 'Đêm qua ngươi mơ thấy mình đứng trên đỉnh núi, dưới chân là biển mây, có người gọi tên ngươi từ rất xa.',
    weight: 7,
    cooldownMs: 15 * MIN,
    choices: [
      { id: 'tinh-day', label: 'Tỉnh dậy tu luyện ngay', outcomes: [{ weight: 1, text: 'Dư âm giấc mộng khiến tâm thần sáng rõ, linh khí dễ tụ hơn.', effects: [{ type: 'qi', fraction: 0.08 }] }] },
      { id: 'ngu-tiep', label: 'Ngủ tiếp xem mơ gì', outcomes: [{ weight: 5, text: 'Người trong mộng trao ngươi một pho công pháp. Tỉnh dậy vẫn còn nhớ vài câu.', effects: [{ type: 'technique', levels: 1 }] }, { weight: 5, text: 'Ngươi ngủ quên mất nửa ngày. Chẳng mơ thấy gì thêm.', effects: [] }] },
    ],
  },
  {
    id: 'dua-tre-lac',
    title: 'Đứa trẻ lạc',
    text: 'Một đứa trẻ phàm nhân khóc thút thít trước động phủ, lạc cha mẹ khi lên núi hái củi.',
    weight: 6,
    once: true,
    choices: [
      { id: 'dua-ve', label: 'Đưa nó xuống núi', outcomes: [{ weight: 1, text: 'Cha mẹ đứa trẻ quỳ lạy cảm tạ, dúi cho ngươi mấy bó dược thảo hái được.', effects: [{ type: 'item', id: 'linh-thao', count: 4 }, { type: 'flag', key: 'nhan-nghia', value: true }] }] },
      { id: 'cho-tien', label: 'Cho ít linh thạch, chỉ đường', hint: 'Mất 5% linh thạch', outcomes: [{ weight: 1, text: 'Đứa trẻ lau nước mắt, lon ton chạy xuống núi.', effects: [{ type: 'stonesFraction', fraction: -0.05 }] }] },
      { id: 'mac-ke', label: 'Mặc kệ, đóng cửa động', outcomes: [{ weight: 1, text: 'Tiếng khóc xa dần. Đêm đó ngươi ngủ không yên.', effects: [{ type: 'qiLoss', fraction: 0.05 }] }] },
    ],
  },
  {
    id: 'hoi-cho-tu-si',
    title: 'Hội chợ tu sĩ',
    text: 'Tu sĩ bốn phương tụ về phường thị mở hội. Có sạp bán đan dược giá chợ đen.',
    weight: 6,
    cooldownMs: 25 * MIN,
    condition: { minRealmIndex: R['luyen-khi-3'] },
    choices: [
      { id: 'mua-dan', label: 'Mua một viên Ngưng Thần Đan', hint: 'Giá 150 linh thạch', requires: { stones: 150 }, outcomes: [{ weight: 1, text: 'Đan dược chính hiệu, không phải hàng giả.', effects: [{ type: 'item', id: 'ngung-than-dan', count: 1 }] }] },
      { id: 'xem', label: 'Dạo chơi xem hàng', outcomes: [{ weight: 6, text: 'Ngươi nhặt được một viên linh thạch ai đó đánh rơi.', effects: [{ type: 'stones', seconds: 120 }] }, { weight: 4, text: 'Chen lấn một hồi, về đến nhà phát hiện mất túi tiền nhỏ.', effects: [{ type: 'stonesFraction', fraction: -0.05 }] }] },
    ],
  },
  {
    id: 'lao-nong',
    title: 'Lão nông dưới chân núi',
    text: 'Lão nông gánh rau đi ngang, than thở ruộng vườn năm nay mất mùa vì không có nước.',
    weight: 7,
    cooldownMs: 20 * MIN,
    choices: [
      { id: 'dan-nuoc', label: 'Dùng pháp thuật dẫn nước giúp lão', outcomes: [{ weight: 1, text: 'Lão mừng rơi nước mắt, hẹn mùa sau mang rau tươi lên tạ.', effects: [{ type: 'qiLoss', fraction: 0.05 }, { type: 'item', id: 'linh-thao', count: 3 }, { type: 'flag', key: 'nhan-nghia', value: true }] }] },
      { id: 'mua-rau', label: 'Mua ít rau rồi đi', outcomes: [{ weight: 1, text: 'Rau tươi, bữa cơm hôm nay ngon hơn.', effects: [{ type: 'stones', seconds: -30 }, { type: 'qi', fraction: 0.02 }] }] },
    ],
  },
  {
    id: 'ngu-ong',
    title: 'Ngư ông bên hồ',
    text: 'Một lão ngư ngồi câu bên hồ tĩnh lặng. Lão không dùng mồi, lưỡi câu cũng thẳng. "Câu cá hay câu đạo?" lão hỏi.',
    weight: 4,
    once: true,
    condition: { minRealmIndex: R['luyen-khi-5'] },
    choices: [
      { id: 'ngoi-cung', label: 'Ngồi xuống câu cùng lão', outcomes: [{ weight: 1, text: 'Ba ngày ba đêm không ai nói một lời. Khi đứng dậy, ngươi thấy thời gian trôi chậm lại trong người mình.', effects: [{ type: 'lifespan', years: 10 }, { type: 'breakthroughBonus', bonus: 0.08 }] }] },
      { id: 'cuoi', label: 'Cười lão gàn, bỏ đi', outcomes: [{ weight: 1, text: 'Sau lưng, lão ngư cũng cười.', effects: [] }] },
    ],
  },
]
