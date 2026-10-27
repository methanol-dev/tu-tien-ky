import { REALM_INDEX_BY_ID as R } from '../realms'
import type { EventDef } from './types'

const MIN = 60_000

/** Xã hội: people, sects, trade. Karma flags chain into later events. */
export const SOCIAL_EVENTS: readonly EventDef[] = [
  {
    id: 'tan-tu-xin-giup',
    title: 'Tán tu cầu cứu',
    text: 'Một tán tu gầy gò quỳ trước động phủ: "Đạo hữu, mẹ già ta bệnh nặng, xin ít linh thạch mua thuốc..."',
    weight: 9,
    once: true,
    condition: { minRealmIndex: R['luyen-khi-2'] },
    choices: [
      { id: 'giup', label: 'Cho hắn linh thạch', hint: 'Mất 15% linh thạch', outcomes: [{ weight: 1, text: 'Hắn dập đầu cảm tạ rồi vội vã rời đi.', effects: [{ type: 'stonesFraction', fraction: -0.15 }, { type: 'flag', key: 'giup-tan-tu', value: true }, { type: 'flag', key: 'nhan-nghia', value: true }] }] },
      { id: 'duoi', label: 'Đuổi đi', outcomes: [{ weight: 1, text: 'Hắn nhìn ngươi một cái rất lâu rồi bỏ đi.', effects: [{ type: 'flag', key: 'duoi-tan-tu', value: true }] }] },
    ],
  },
  {
    id: 'tan-tu-bao-an',
    title: 'Báo ân',
    text: 'Tán tu năm xưa quay lại, giờ đã là một tu sĩ đĩnh đạc. "Mẹ ta đã khỏi. Ân này không dám quên."',
    weight: 8,
    once: true,
    condition: { requiredFlags: ['giup-tan-tu'], minRealmIndex: R['luyen-khi-6'] },
    choices: [
      { id: 'nhan', label: 'Nhận lễ vật', outcomes: [{ weight: 1, text: 'Hắn dâng lên một hộp ngọc đựng đan dược và linh thạch.', effects: [{ type: 'stones', seconds: 1800 }, { type: 'item', id: 'pha-canh-dan', count: 1 }, { type: 'item', id: 'ngung-than-dan', count: 2 }] }] },
    ],
  },
  {
    id: 'tan-tu-bao-thu',
    title: 'Báo thù',
    text: 'Tán tu ngươi từng đuổi đi năm xưa quay lại, giờ mắt đỏ ngầu. "Mẹ ta chết vì ngươi!"',
    weight: 8,
    once: true,
    condition: { requiredFlags: ['duoi-tan-tu'], minRealmIndex: R['luyen-khi-6'] },
    choices: [
      { id: 'danh', label: 'Nghênh chiến', outcomes: [{ weight: 6, text: 'Hận thù không bù được tu vi. Hắn thua, bỏ chạy.', effects: [{ type: 'qiLoss', fraction: 0.1 }] }, { weight: 4, text: 'Hắn liều mạng tự bạo, ngươi trọng thương.', effects: [{ type: 'qiLoss', fraction: 0.4 }, { type: 'buff', id: 'trong-thuong', name: 'Trọng thương', mult: 0.4, durationMs: 10 * MIN }] }] },
      { id: 'xin-loi', label: 'Cúi đầu tạ lỗi, bồi thường', hint: 'Mất 50% linh thạch', outcomes: [{ weight: 1, text: 'Hắn nhận linh thạch, nước mắt lưng tròng, quay đi.', effects: [{ type: 'stonesFraction', fraction: -0.5 }, { type: 'flag', key: 'nhan-nghia', value: true }] }] },
    ],
  },
  {
    id: 'thuong-nhan',
    title: 'Thương nhân lưu động',
    text: 'Một thương nhân đẩy xe hàng đi ngang, bày ra đủ loại dược liệu. "Giá rẻ, chỉ hôm nay!"',
    weight: 9,
    cooldownMs: 12 * MIN,
    choices: [
      { id: 'mua-re', label: 'Mua một lô dược liệu', hint: 'Mất 20% linh thạch', outcomes: [{ weight: 8, text: 'Hàng tốt, giá hời.', effects: [{ type: 'stonesFraction', fraction: -0.2 }, { type: 'item', id: 'linh-thao', count: 5 }, { type: 'item', id: 'huyet-tinh-chi', count: 3 }] }, { weight: 2, text: 'Về nhà mới phát hiện toàn cỏ dại trộn lẫn!', effects: [{ type: 'stonesFraction', fraction: -0.2 }, { type: 'item', id: 'linh-thao', count: 2 }] }] },
      { id: 'khong', label: 'Không mua', outcomes: [{ weight: 1, text: 'Thương nhân nhún vai đẩy xe đi.', effects: [] }] },
    ],
  },
  {
    id: 'tong-mon-chieu-mo',
    title: 'Tông môn chiêu mộ',
    text: 'Một trưởng lão Thanh Vân Môn dừng chân trước động phủ. "Căn cốt không tệ. Muốn vào tông môn ta không?"',
    weight: 5,
    once: true,
    condition: { minRealmIndex: R['luyen-khi-7'] },
    choices: [
      { id: 'gia-nhap', label: 'Bái sư gia nhập', outcomes: [{ weight: 1, text: 'Ngươi được ban công pháp nhập môn và một ít tài nguyên. Từ nay là đệ tử Thanh Vân.', effects: [{ type: 'technique', levels: 1 }, { type: 'stones', seconds: 900 }, { type: 'flag', key: 'thanh-van-de-tu', value: true }] }] },
      { id: 'tu-choi', label: 'Thích tự do, từ chối', outcomes: [{ weight: 1, text: 'Trưởng lão gật đầu: "Tán tu cũng có cái hay." Rồi bỏ đi.', effects: [{ type: 'breakthroughBonus', bonus: 0.05 }] }] },
    ],
  },
  {
    id: 'nhiem-vu-tong-mon',
    title: 'Nhiệm vụ tông môn',
    text: 'Tông môn truyền tin: cần dược liệu gấp để luyện đan cho trưởng lão bế quan.',
    weight: 7,
    cooldownMs: 20 * MIN,
    condition: { requiredFlags: ['thanh-van-de-tu'] },
    choices: [
      { id: 'nop', label: 'Nộp 5 Linh Thảo', requires: { items: { 'linh-thao': 5 } }, outcomes: [{ weight: 1, text: 'Tông môn ban thưởng hậu hĩnh.', effects: [{ type: 'item', id: 'linh-thao', count: -5 }, { type: 'stones', seconds: 900 }, { type: 'item', id: 'tu-khi-dan', count: 1 }] }] },
      { id: 'bo-qua', label: 'Đang bế quan, bỏ qua', outcomes: [{ weight: 1, text: 'Không ai trách, nhưng cũng chẳng ai thưởng.', effects: [] }] },
    ],
  },
  {
    id: 'dao-lu',
    title: 'Gặp gỡ',
    text: 'Dưới gốc đào, một nữ tu áo trắng đang luyện kiếm. Ánh mắt hai người chạm nhau.',
    weight: 4,
    once: true,
    condition: { minRealmIndex: R['truc-co-1'] },
    choices: [
      { id: 'lam-quen', label: 'Tiến tới làm quen', outcomes: [{ weight: 6, text: 'Hai người đàm đạo suốt đêm. Nàng tặng ngươi một viên đan trước khi chia tay.', effects: [{ type: 'item', id: 'ngung-than-dan', count: 2 }, { type: 'flag', key: 'gap-nu-tu', value: true }] }, { weight: 4, text: 'Nàng nhìn ngươi lạnh lùng: "Phiền." rồi bay đi.', effects: [{ type: 'qiLoss', fraction: 0.02 }] }] },
      { id: 'quay-di', label: 'Đạo tâm bất động, quay đi', outcomes: [{ weight: 1, text: 'Tu tiên là con đường cô độc. Đạo tâm ngươi thêm vững.', effects: [{ type: 'breakthroughBonus', bonus: 0.08 }] }] },
    ],
  },
]
