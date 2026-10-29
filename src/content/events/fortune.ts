import { REALM_INDEX_BY_ID as R } from '../realms'
import type { EventDef } from './types'

const MIN = 60_000

/** Kỳ ngộ: mostly positive, some with a catch. */
export const FORTUNE_EVENTS: readonly EventDef[] = [
  {
    id: 'bi-tich-rach',
    title: 'Bí tịch rách nát',
    text: 'Trong khe đá sau động phủ, ngươi tìm thấy một quyển bí tịch cũ nát, chữ còn chữ mất.',
    weight: 10,
    condition: { minRealmIndex: R['dong-bi-1'] },
    cooldownMs: 20 * MIN,
    choices: [
      {
        id: 'doc',
        label: 'Tham ngộ ngay',
        outcomes: [
          { weight: 6, text: 'Trong mớ chữ loạn, ngươi ngộ ra một tầng công pháp.', effects: [{ type: 'technique', levels: 1 }] },
          { weight: 3, text: 'Đọc nửa ngày chỉ toàn vẽ bùa, nhưng đầu óc cũng thanh thản hơn.', effects: [{ type: 'qi', fraction: 0.05 }] },
          { weight: 1, text: 'Bí tịch có độc! Ngươi trúng độc mực, tu luyện chậm lại.', effects: [{ type: 'buff', id: 'doc-muc', name: 'Trúng độc mực', mult: 0.6, durationMs: 5 * MIN }] },
        ],
      },
      { id: 'ban', label: 'Mang ra phường thị bán', outcomes: [{ weight: 1, text: 'Một lão giả mua lại với giá hời.', effects: [{ type: 'stones', seconds: 300 }] }] },
    ],
  },
  {
    id: 'linh-tuyen',
    title: 'Linh tuyền ẩn mật',
    text: 'Một dòng suối nhỏ phát ra linh khí nồng đậm. Nước suối trong vắt, lạnh thấu xương.',
    weight: 8,
    cooldownMs: 15 * MIN,
    choices: [
      {
        id: 'tam',
        label: 'Ngâm mình tu luyện',
        outcomes: [
          { weight: 7, text: 'Linh khí thấm vào từng lỗ chân lông, tốc độ tu luyện tăng vọt.', effects: [{ type: 'buff', id: 'linh-tuyen', name: 'Linh tuyền tẩy thể', mult: 2.5, durationMs: 8 * MIN }] },
          { weight: 3, text: 'Nước quá lạnh, ngươi bị hàn khí xâm nhập.', effects: [{ type: 'buff', id: 'han-khi', name: 'Hàn khí nhập thể', mult: 0.7, durationMs: 4 * MIN }] },
        ],
      },
      { id: 'uong', label: 'Uống vài ngụm rồi đi', outcomes: [{ weight: 1, text: 'Thanh mát, linh khí tăng chút ít.', effects: [{ type: 'qi', fraction: 0.1 }] }] },
    ],
  },
  {
    id: 'thien-tai-dia-bao',
    title: 'Thiên tài địa bảo',
    text: 'Sương mù tan, trước mắt ngươi là một vạt linh thảo mọc dày quanh gốc cổ thụ.',
    weight: 9,
    cooldownMs: 12 * MIN,
    choices: [
      { id: 'hai', label: 'Hái sạch', outcomes: [{ weight: 1, text: 'Túi càn khôn đầy ắp dược liệu.', effects: [{ type: 'item', id: 'linh-thao', count: 6 }, { type: 'item', id: 'huyet-tinh-chi', count: 2 }] }] },
      {
        id: 'dao',
        label: 'Đào xuống gốc cây xem có gì',
        outcomes: [
          { weight: 4, text: 'Dưới gốc có một củ linh chi tím già!', effects: [{ type: 'item', id: 'tu-linh-chi', count: 2 }] },
          { weight: 6, text: 'Chỉ có rễ cây và giun đất. Ngươi vẫn hái được ít cỏ.', effects: [{ type: 'item', id: 'linh-thao', count: 3 }] },
        ],
      },
    ],
  },
  {
    id: 'tien-boi-truyen-cong',
    title: 'Tiền bối truyền công',
    text: 'Một lão tu sĩ hấp hối bên đường. Lão nắm tay ngươi: "Hậu bối, ta sắp tọa hóa, tu vi này không nỡ bỏ phí..."',
    weight: 4,
    once: true,
    condition: { minRealmIndex: R['dong-bi-3'] },
    choices: [
      {
        id: 'nhan',
        label: 'Nhận truyền công',
        outcomes: [
          { weight: 7, text: 'Một luồng linh lực khổng lồ đổ vào kinh mạch. Ngươi lập tức đầy linh khí!', effects: [{ type: 'qi', fraction: 1 }] },
          { weight: 3, text: 'Linh lực quá mạnh, kinh mạch bị tổn thương. Nhưng tu vi vẫn tăng không ít.', effects: [{ type: 'qi', fraction: 0.6 }, { type: 'buff', id: 'kinh-mach-ton', name: 'Kinh mạch tổn thương', mult: 0.5, durationMs: 10 * MIN }] },
        ],
      },
      { id: 'tu-choi', label: 'Chôn cất tử tế rồi đi', outcomes: [{ weight: 1, text: 'Ngươi chôn lão dưới gốc tùng. Đêm đó mộng thấy lão cười, tặng ngươi một viên đan.', effects: [{ type: 'item', id: 'pha-canh-dan', count: 1 }, { type: 'flag', key: 'nhan-nghia', value: true }] }] },
    ],
  },
  {
    id: 'lao-quy',
    title: 'Lão quy ngàn năm',
    text: 'Một con rùa đá khổng lồ mở mắt nhìn ngươi. Nó đã ngủ ở đây từ thuở khai thiên.',
    weight: 3,
    once: true,
    condition: { minRealmIndex: R['dong-phu-1'] },
    choices: [
      { id: 'bai', label: 'Cúi lạy xin chỉ giáo', outcomes: [{ weight: 1, text: 'Lão quy thở ra một hơi dài. Ngươi cảm thấy thọ nguyên kéo dài.', effects: [{ type: 'lifespan', years: 30 }] }] },
      {
        id: 'danh',
        label: 'Thử sức với nó',
        outcomes: [
          { weight: 3, text: 'Lão quy rụt đầu, ngươi cạy được một mảnh mai rùa quý.', effects: [{ type: 'stones', seconds: 1800 }] },
          { weight: 7, text: 'Nó quật đuôi một cái, ngươi văng xa mười trượng.', effects: [{ type: 'qiLoss', fraction: 0.3 }] },
        ],
      },
    ],
  },
  {
    id: 'dong-phu-co',
    title: 'Động phủ cổ',
    text: 'Vách núi nứt ra để lộ một cửa động khắc trận văn mờ nhạt. Bên trong tối đen.',
    weight: 5,
    cooldownMs: 30 * MIN,
    condition: { minRealmIndex: R['thao-can-2'] },
    choices: [
      {
        id: 'vao',
        label: 'Tiến vào',
        outcomes: [
          { weight: 4, text: 'Chủ nhân động phủ đã hóa thành bụi, để lại một rương linh thạch.', effects: [{ type: 'stones', seconds: 1200 }] },
          { weight: 3, text: 'Ngươi tìm thấy một lò đan nhỏ cùng vài viên đan còn dược lực.', effects: [{ type: 'item', id: 'tu-khi-dan', count: 2 }, { type: 'item', id: 'ngung-than-dan', count: 1 }] },
          { weight: 3, text: 'Trận pháp phòng ngự vẫn còn hoạt động! Ngươi bị đánh bật ra, hộc máu.', effects: [{ type: 'qiLoss', fraction: 0.25 }, { type: 'buff', id: 'trong-thuong', name: 'Trọng thương', mult: 0.5, durationMs: 6 * MIN }] },
        ],
      },
      { id: 'danh-dau', label: 'Đánh dấu rồi rời đi', outcomes: [{ weight: 1, text: 'Ngươi khắc một ký hiệu lên đá. Biết đâu có ngày quay lại.', effects: [{ type: 'flag', key: 'biet-dong-co', value: true }] }] },
    ],
  },
  {
    id: 'quay-lai-dong-co',
    title: 'Quay lại động phủ cổ',
    text: 'Ngươi nhớ tới ký hiệu đã khắc năm xưa. Gi giờ tu vi đã khác, có lẽ nên quay lại.',
    weight: 6,
    once: true,
    condition: { requiredFlags: ['biet-dong-co'], minRealmIndex: R['dong-phu-1'] },
    choices: [
      { id: 'pha-tran', label: 'Phá trận tiến vào', outcomes: [{ weight: 1, text: 'Với tu vi hiện tại, trận pháp vỡ như giấy. Bên trong là cả một kho tàng!', effects: [{ type: 'stones', seconds: 3600 }, { type: 'item', id: 'thien-tam-lien', count: 2 }, { type: 'technique', levels: 2 }] }] },
    ],
  },
]
