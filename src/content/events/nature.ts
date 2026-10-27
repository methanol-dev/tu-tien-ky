import { REALM_INDEX_BY_ID as R } from '../realms'
import type { EventDef } from './types'

const MIN = 60_000

/** Thiên tượng: weather and heaven. Mostly buffs/debuffs. */
export const NATURE_EVENTS: readonly EventDef[] = [
  {
    id: 'linh-khi-trieu-tich',
    title: 'Linh khí triều tịch',
    text: 'Trăng tròn, linh khí trời đất dâng lên như thủy triều. Đây là thời cơ hiếm có.',
    weight: 8,
    cooldownMs: 15 * MIN,
    choices: [
      { id: 'tu-luyen', label: 'Toàn lực tu luyện', outcomes: [{ weight: 1, text: 'Linh khí ùa vào cơ thể như nước vỡ đê.', effects: [{ type: 'buff', id: 'trieu-tich', name: 'Linh khí triều tịch', mult: 3, durationMs: 6 * MIN }] }] },
      { id: 'hai-thuoc', label: 'Tranh thủ hái thuốc', outcomes: [{ weight: 1, text: 'Dược liệu dưới trăng tròn dược lực tăng gấp bội.', effects: [{ type: 'item', id: 'linh-thao', count: 4 }, { type: 'item', id: 'huyet-tinh-chi', count: 2 }, { type: 'item', id: 'tu-linh-chi', count: 1 }] }] },
    ],
  },
  {
    id: 'loi-vu',
    title: 'Lôi vũ',
    text: 'Sấm sét xé trời. Mỗi tia chớp mang theo lôi linh lực tinh thuần.',
    weight: 7,
    cooldownMs: 12 * MIN,
    condition: { minRealmIndex: R['luyen-khi-3'] },
    choices: [
      { id: 'don-loi', label: 'Đứng giữa mưa đón lôi', outcomes: [{ weight: 5, text: 'Lôi lực tôi luyện thân thể. Lần đột phá tới sẽ dễ dàng hơn.', effects: [{ type: 'breakthroughBonus', bonus: 0.12 }] }, { weight: 5, text: 'Một tia sét đánh thẳng vào đầu. Ngươi cháy đen, tóc dựng đứng.', effects: [{ type: 'qiLoss', fraction: 0.2 }, { type: 'buff', id: 'chay-den', name: 'Cháy đen', mult: 0.6, durationMs: 4 * MIN }] }] },
      { id: 'tru-mua', label: 'Vào động trú mưa', outcomes: [{ weight: 1, text: 'Nghe mưa, uống trà, tâm cảnh an nhiên.', effects: [{ type: 'qi', fraction: 0.05 }] }] },
    ],
  },
  {
    id: 'suong-mu-doc',
    title: 'Sương độc',
    text: 'Sương mù tím bao phủ sơn cốc. Hít vào thấy đầu óc quay cuồng.',
    weight: 6,
    cooldownMs: 10 * MIN,
    condition: { minRealmIndex: R['luyen-khi-4'] },
    choices: [
      { id: 'be-khi', label: 'Bế khí chờ sương tan', outcomes: [{ weight: 1, text: 'Nửa ngày sau sương tan. Ngươi mệt lả nhưng không sao.', effects: [{ type: 'qiLoss', fraction: 0.05 }] }] },
      { id: 'tim-nguon', label: 'Lần theo nguồn sương', outcomes: [{ weight: 5, text: 'Nguồn sương là một gốc Huyết Tinh Chi khổng lồ đang nở!', effects: [{ type: 'item', id: 'huyet-tinh-chi', count: 5 }] }, { weight: 5, text: 'Ngươi trúng độc nặng, bò về động phủ.', effects: [{ type: 'buff', id: 'trung-doc', name: 'Trúng độc', mult: 0.5, durationMs: 6 * MIN }] }] },
    ],
  },
  {
    id: 'sao-bang',
    title: 'Sao băng',
    text: 'Một vệt sáng xé ngang trời đêm rồi rơi xuống phía sau núi.',
    weight: 4,
    cooldownMs: 30 * MIN,
    condition: { minRealmIndex: R['luyen-khi-5'] },
    choices: [
      { id: 'tim', label: 'Đi tìm thiên thạch', outcomes: [{ weight: 4, text: 'Thiên thạch còn nóng, bên trong là tinh thiết hiếm có. Bán được giá cao.', effects: [{ type: 'stones', seconds: 2400 }] }, { weight: 3, text: 'Thiên thạch nứt ra, bên trong là một hạt giống phát sáng.', effects: [{ type: 'item', id: 'thien-tam-lien', count: 1 }] }, { weight: 3, text: 'Tìm cả đêm chỉ thấy một hố đất.', effects: [] }] },
      { id: 'uoc', label: 'Nhắm mắt ước một điều', outcomes: [{ weight: 1, text: 'Không biết có linh nghiệm không, nhưng lòng thấy nhẹ nhõm.', effects: [{ type: 'qi', fraction: 0.08 }] }] },
    ],
  },
  {
    id: 'han-dong',
    title: 'Đại hàn',
    text: 'Mùa đông năm nay lạnh bất thường. Linh khí trời đất đông cứng, khó hấp thu.',
    weight: 6,
    cooldownMs: 20 * MIN,
    choices: [
      { id: 'chiu', label: 'Cắn răng tu luyện', outcomes: [{ weight: 1, text: 'Tu luyện trong giá lạnh chậm hơn, nhưng ý chí được tôi rèn.', effects: [{ type: 'buff', id: 'dai-han', name: 'Đại hàn', mult: 0.7, durationMs: 5 * MIN }, { type: 'breakthroughBonus', bonus: 0.05 }] }] },
      { id: 'dot-lua', label: 'Đốt linh thạch sưởi ấm', hint: 'Mất 10% linh thạch', outcomes: [{ weight: 1, text: 'Ấm áp, tu luyện bình thường.', effects: [{ type: 'stonesFraction', fraction: -0.1 }] }] },
    ],
  },
  {
    id: 'cau-vong-linh',
    title: 'Cầu vồng linh khí',
    text: 'Sau cơn mưa, một cầu vồng bảy sắc bắc qua sơn cốc, mỗi màu là một loại linh khí.',
    weight: 3,
    cooldownMs: 40 * MIN,
    condition: { minRealmIndex: R['truc-co-1'] },
    choices: [
      { id: 'hap-thu', label: 'Hấp thu thất sắc linh khí', outcomes: [{ weight: 1, text: 'Bảy loại linh khí dung hợp trong đan điền. Tu vi tăng mạnh!', effects: [{ type: 'qi', fraction: 0.4 }, { type: 'buff', id: 'that-sac', name: 'Thất sắc linh khí', mult: 2, durationMs: 10 * MIN }] }] },
    ],
  },
  {
    id: 'ngo-dao',
    title: 'Ngộ đạo',
    text: 'Nhìn lá rơi, ngươi bỗng thấy cả vòng sinh diệt của thiên địa. Một khoảnh khắc ngộ đạo hiếm có.',
    weight: 3,
    cooldownMs: 45 * MIN,
    condition: { minRealmIndex: R['luyen-khi-8'] },
    choices: [
      { id: 'tham-ngo', label: 'Nhập định tham ngộ', outcomes: [{ weight: 7, text: 'Ngươi ngộ ra một tầng công pháp cao hơn.', effects: [{ type: 'technique', levels: 1 }, { type: 'breakthroughBonus', bonus: 0.1 }] }, { weight: 3, text: 'Cảm ngộ đứt đoạn giữa chừng. Dù vậy vẫn thu hoạch không nhỏ.', effects: [{ type: 'qi', fraction: 0.3 }] }] },
    ],
  },
]
