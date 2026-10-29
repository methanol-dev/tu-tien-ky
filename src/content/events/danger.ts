import { REALM_INDEX_BY_ID as R } from '../realms'
import type { EventDef } from './types'

const MIN = 60_000

/** Nguy hiểm: fights, robbery, inner demons. Choices trade risk for reward. */
export const DANGER_EVENTS: readonly EventDef[] = [
  {
    id: 'ma-tu-chan-duong',
    title: 'Ma tu chặn đường',
    text: 'Một gã ma tu mặt sẹo chặn ngươi lại: "Để lại linh thạch, ta tha mạng."',
    weight: 10,
    cooldownMs: 10 * MIN,
    condition: { minRealmIndex: R['dong-bi-2'] },
    choices: [
      {
        id: 'danh',
        label: 'Đánh',
        outcomes: [
          { weight: 5, text: 'Một chiêu hạ gục! Ngươi lục túi hắn lấy sạch linh thạch.', effects: [{ type: 'stones', seconds: 600 }, { type: 'item', id: 'huyet-tinh-chi', count: 1 }] },
          { weight: 5, text: 'Hắn mạnh hơn tưởng tượng. Ngươi bị thương nặng, may mà chạy thoát.', effects: [{ type: 'qiLoss', fraction: 0.2 }, { type: 'buff', id: 'trong-thuong', name: 'Trọng thương', mult: 0.5, durationMs: 5 * MIN }] },
        ],
      },
      { id: 'chay', label: 'Bỏ chạy', outcomes: [{ weight: 7, text: 'Ngươi chạy thục mạng, mất chút linh khí nhưng toàn mạng.', effects: [{ type: 'qiLoss', fraction: 0.08 }] }, { weight: 3, text: 'Hắn ném ám khí trúng lưng ngươi.', effects: [{ type: 'qiLoss', fraction: 0.15 }] }] },
      { id: 'hoi-lo', label: 'Nộp linh thạch', hint: 'Mất 30% linh thạch', outcomes: [{ weight: 1, text: 'Hắn cười khẩy nhận linh thạch rồi biến mất.', effects: [{ type: 'stonesFraction', fraction: -0.3 }] }] },
    ],
  },
  {
    id: 'tam-ma',
    title: 'Tâm ma quấy nhiễu',
    text: 'Giữa lúc nhập định, hình ảnh quá khứ ùa về. Một giọng nói thì thầm: "Tu tiên làm gì? Về nhà đi..."',
    weight: 9,
    cooldownMs: 8 * MIN,
    condition: { minRealmIndex: R['thao-can-1'] },
    choices: [
      {
        id: 'dinh-tam',
        label: 'Định tâm, đối diện tâm ma',
        outcomes: [
          { weight: 6, text: 'Ngươi nhìn thẳng vào tâm ma, nó tan như khói. Đạo tâm vững chắc hơn.', effects: [{ type: 'breakthroughBonus', bonus: 0.1 }] },
          { weight: 4, text: 'Tâm ma quá mạnh, ngươi lạc trong ảo cảnh hồi lâu, linh khí tản mất.', effects: [{ type: 'qiLoss', fraction: 0.25 }] },
        ],
      },
      { id: 'xuat-dinh', label: 'Xuất định ngay', outcomes: [{ weight: 1, text: 'Ngươi mở mắt, mồ hôi đầm đìa. An toàn nhưng mất một phần linh khí vừa tụ.', effects: [{ type: 'qiLoss', fraction: 0.1 }] }] },
    ],
  },
  {
    id: 'yeu-thu',
    title: 'Yêu thú đói mồi',
    text: 'Một con lang yêu mắt đỏ lao ra từ bụi rậm, hàm răng nhỏ dãi.',
    weight: 8,
    cooldownMs: 10 * MIN,
    choices: [
      {
        id: 'giet',
        label: 'Giết nó',
        outcomes: [
          { weight: 6, text: 'Ngươi hạ gục lang yêu, mổ lấy yêu đan bán được không ít.', effects: [{ type: 'stones', seconds: 400 }] },
          { weight: 4, text: 'Nó cắn vào vai ngươi trước khi chết.', effects: [{ type: 'stones', seconds: 200 }, { type: 'buff', id: 'vet-can', name: 'Vết cắn yêu thú', mult: 0.7, durationMs: 4 * MIN }] },
        ],
      },
      { id: 'tranh', label: 'Leo lên cây tránh', outcomes: [{ weight: 1, text: 'Lang yêu gầm gừ dưới gốc cây cả buổi rồi bỏ đi. Ngươi mất thời gian nhưng không mất gì.', effects: [] }] },
    ],
  },
  {
    id: 'cuop-dong-phu',
    title: 'Kẻ trộm động phủ',
    text: 'Về đến động phủ, ngươi thấy cửa trận bị phá. Có kẻ đã lục lọi bên trong!',
    weight: 6,
    cooldownMs: 25 * MIN,
    condition: { minRealmIndex: R['lieu-can-1'], forbiddenFlags: ['nhan-nghia'] },
    choices: [
      { id: 'duoi', label: 'Đuổi theo dấu vết', outcomes: [{ weight: 5, text: 'Ngươi bắt kịp tên trộm, lấy lại tất cả và thêm cả của hắn.', effects: [{ type: 'stones', seconds: 300 }] }, { weight: 5, text: 'Dấu vết mất hút. Ngươi đã mất một phần linh thạch.', effects: [{ type: 'stonesFraction', fraction: -0.2 }] }] },
      { id: 'kiem-tra', label: 'Kiểm kê thiệt hại', outcomes: [{ weight: 1, text: 'Mất một ít linh thạch. May mà bí tịch còn nguyên.', effects: [{ type: 'stonesFraction', fraction: -0.1 }] }] },
    ],
  },
  {
    id: 'tau-hoa-nhap-ma',
    title: 'Tẩu hỏa nhập ma',
    text: 'Vận công quá gấp, linh khí trong đan điền quay cuồng mất kiểm soát!',
    weight: 5,
    cooldownMs: 15 * MIN,
    condition: { minRealmIndex: R['khi-cot-1'] },
    choices: [
      { id: 'cuong-ep', label: 'Cưỡng ép trấn áp', outcomes: [{ weight: 5, text: 'Ngươi nghiến răng ép linh khí về đan điền. Thành công, tu vi còn tinh thuần hơn.', effects: [{ type: 'qi', fraction: 0.15 }] }, { weight: 5, text: 'Kinh mạch đứt mấy chỗ, ngươi thổ huyết ngất đi.', effects: [{ type: 'qiLoss', fraction: 0.35 }, { type: 'buff', id: 'kinh-mach-ton', name: 'Kinh mạch tổn thương', mult: 0.5, durationMs: 8 * MIN }] }] },
      { id: 'dung-dan', label: 'Nuốt Tụ Khí Đan ổn định', hint: 'Cần 1 Tụ Khí Đan', requires: { items: { 'tu-khi-dan': 1 } }, outcomes: [{ weight: 1, text: 'Dược lực lan ra, linh khí dần bình ổn.', effects: [{ type: 'item', id: 'tu-khi-dan', count: -1 }] }] },
      { id: 'buong', label: 'Buông xuôi, để linh khí tự tản', outcomes: [{ weight: 1, text: 'Linh khí tản đi gần hết, nhưng ngươi an toàn.', effects: [{ type: 'qiLoss', fraction: 0.5 }] }] },
    ],
  },
  {
    id: 'ke-thu-cu',
    title: 'Kẻ thù cũ',
    text: 'Gã ma tu mặt sẹo năm nào quay lại, lần này dẫn theo hai tên đồng bọn. "Ngươi nhớ ta chứ?"',
    weight: 7,
    once: true,
    condition: { minRealmIndex: R['truc-the-1'] },
    choices: [
      { id: 'danh', label: 'Một mình chọi ba', outcomes: [{ weight: 5, text: 'Tu vi ngươi giờ đã khác xưa. Ba tên ma tu nằm la liệt.', effects: [{ type: 'stones', seconds: 1500 }, { type: 'item', id: 'tu-linh-chi', count: 2 }] }, { weight: 5, text: 'Ba đánh một không chột cũng què. Ngươi thoát được nhưng thương tích đầy mình.', effects: [{ type: 'qiLoss', fraction: 0.3 }, { type: 'buff', id: 'trong-thuong', name: 'Trọng thương', mult: 0.4, durationMs: 10 * MIN }] }] },
      { id: 'dam-phan', label: 'Mua chuộc chúng', hint: 'Mất 40% linh thạch', outcomes: [{ weight: 1, text: 'Tiền bạc giải quyết được nhiều thứ. Chúng bỏ đi.', effects: [{ type: 'stonesFraction', fraction: -0.4 }] }] },
    ],
  },
]
