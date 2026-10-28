import type { ReactElement, SVGProps } from 'react'
import type { SilhouetteId } from '@/content/regions'

/**
 * Ink silhouettes chuẩn Kiếm Lai.
 * Every figure lives in a 100x100 box, feet on y=100, facing +x
 * (enemies are flipped by the stage). Fill is `currentColor` so the palette decides the ink.
 */
type Props = SVGProps<SVGSVGElement>

function Frame({ children, ...rest }: Props) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" fill="currentColor" aria-hidden {...rest}>
      {children}
    </svg>
  )
}

/**
 * Trần Bình An: Thiếu niên giày cỏ ngõ Nê Bình, cõng gùi trúc nhỏ,
 * thủ thế quyền Hám Sơn, có phi kiếm Lung Trung Tước lượn quanh đầu.
 */
export function HeroSilhouette(props: Props) {
  return (
    <Frame {...props}>
      {/* Phi kiếm Lung Trung Tước hoàng kim sắc bén bay lượn trên vai */}
      <g className="animate-pulse">
        <path d="M68 8 l16 -6 l-8 12 l-3 -3 z" fill="#fde047" stroke="#ffffff" strokeWidth="0.8" />
        <path d="M60 16 q12 -12 24 -14" stroke="#facc15" strokeWidth="1.5" fill="none" opacity="0.8" strokeDasharray="3 2" />
        <circle cx="76" cy="5" r="1.5" fill="#ffffff" />
      </g>

      {/* Gùi trúc (bamboo basket) sau lưng */}
      <path
        d="M20 32 h14 l-3 36 h-10 q-3 -16 -1 -36 z"
        fill="#92400e"
        stroke="#78350f"
        strokeWidth="1"
      />
      {/* Hoa văn đan trúc */}
      <path d="M22 42 h10 M21 52 h10 M23 62 h8" stroke="#b45309" strokeWidth="1" opacity="0.8" />
      {/* Dây đeo gùi trúc vắt qua vai */}
      <path d="M30 32 l12 14 l-3 4 l-11 -12 z" fill="#78350f" opacity="0.9" />

      {/* Thân áo trường sam / thanh y du hiệp */}
      <path
        d="M40 26 h18 l4 16 l-4 2 l-2 -8 l2 44 h-5 l-4 -22 l-5 22 h-5 l2 -40 l-4 6 l-4 -3 z"
        fill="#0f766e"
        stroke="#115e59"
        strokeWidth="1.2"
      />
      {/* Thắt lưng da & đai ngọc */}
      <rect x="39" y="48" width="20" height="4" fill="#78350f" rx="1" />
      <circle cx="49" cy="50" r="1.5" fill="#34d399" />

      {/* Đầu & khuôn mặt thiếu niên */}
      <circle cx="48" cy="18" r="8.5" fill="#e5c9b0" />
      {/* Tóc đen & búi tóc buộc dây vải đỏ */}
      <path d="M42 10 q6 -6 10 2 z" fill="#1c1917" />
      <path d="M43 14 Q48 10 53 14 Q56 18 56 22 L41 22 Q41 18 43 14 Z" fill="#1c1917" />
      <path d="M39 12 q-4 8 2 12" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.9" />

      {/* Tay sau giữ thế quyền */}
      <path d="M36 36 l-8 8 l4 4 l8 -6 z" fill="#e5c9b0" />

      {/* Tay trước thủ thế Hám Sơn Quyền (nắm đấm vung về trước) */}
      <path d="M54 36 l18 -4 l6 4 l-4 5 l-18 2 z" fill="#0f766e" />
      <circle cx="78" cy="36" r="3.5" fill="#e5c9b0" stroke="#d97706" strokeWidth="0.8" /> {/* Nắm đấm có quyền phong */}

      {/* Quần xắn gấu */}
      <path d="M42 70 h7 v14 h-7 z M51 70 h7 v14 h-7 z" fill="#334155" />

      {/* Bắp chân & chân mang giày cỏ bện */}
      <path d="M43 84 l-2 16 h6 l1 -16 z M52 84 l-1 16 h6 l2 -16 z" fill="#e5c9b0" />
      <path d="M40 96 l4 4 h6 l-2 -4 z M50 96 l3 4 h6 l-2 -4 z" fill="#78350f" stroke="#b45309" strokeWidth="0.8" />

      {/* Vạt áo thanh y bay nhẹ đón gió */}
      <path d="M32 58 q-8 16 -3 36 h4 q-3 -18 3 -32 z" fill="#0d9488" opacity="0.9" />
    </Frame>
  )
}

function Wolf(props: Props) {
  return (
    <Frame {...props}>
      <path d="M8 60 q10 -22 40 -20 l20 -4 l14 -10 l2 8 l6 2 l-6 8 l-10 4 l-6 10 q10 10 6 42 h-7 q1 -22 -6 -28 l-10 3 l-2 25 h-7 l-1 -26 l-12 -2 l-3 28 h-7 l-1 -30 q-10 -4 -10 -10 z" />
      {/* Tai nhọn và đuôi sói hoang dã */}
      <path d="M68 28 l6 -12 l4 8 z" />
      <path d="M4 64 q-6 12 2 24 h4 q-4 -12 2 -20 z" opacity="0.8" />
    </Frame>
  )
}

/** Trấn Long Mãng Xà: Đại mãng xà hóa rồng ngàn năm, thân vảy cuộn sóng, đầu mọc sừng rồng */
function Bear(props: Props) {
  return (
    <Frame {...props}>
      {/* Thân mãng xà khổng lồ uốn lượn cuộn trào */}
      <path d="M6 100 q14 -32 44 -26 q28 6 32 -18 q3 -20 -16 -28 q-16 -6 -24 6 q-6 10 4 14 q10 4 14 -4 l5 5 q-8 14 -24 8 q-16 -6 -10 -22 q8 -20 34 -14 q28 8 24 38 q-4 28 -38 24 q-22 -2 -34 17 z" />
      {/* Đầu rồng mở miệng gầm thét & sừng rồng */}
      <path d="M68 46 l22 -8 l-4 12 l12 4 l-26 6 z" />
      <path d="M72 38 l8 -16 l4 8 l6 -10 l-2 18 z" /> {/* Sừng rồng */}
      {/* Râu rồng uốn lượn */}
      <path d="M86 52 q12 8 8 18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.75" />
      {/* Vây gai lưng sắc nhọn */}
      <path d="M38 72 l4 -10 l6 8 z M52 68 l4 -10 l6 8 z M66 60 l4 -10 l6 8 z" opacity="0.85" />
    </Frame>
  )
}

function Bat(props: Props) {
  return (
    <Frame {...props}>
      <path d="M50 44 q-4 -12 -14 -12 q-16 -2 -34 10 q12 8 20 22 q6 -8 14 -4 q6 4 8 14 q2 -10 8 -14 q8 -4 14 4 q8 -14 20 -22 q-18 -12 -34 -10 q-10 0 -14 12 z" />
      <path d="M46 28 l2 -8 l2 8 M52 28 l2 -8 l2 8" strokeWidth="3" stroke="currentColor" />
    </Frame>
  )
}

function Snake(props: Props) {
  return (
    <Frame {...props}>
      <path d="M6 96 q10 -16 30 -10 q22 8 30 -6 q10 -16 -4 -26 q-10 -6 -20 2 q-6 6 2 12 q10 6 16 -4 l4 4 q-6 14 -22 8 q-14 -8 -8 -22 q8 -16 28 -10 q24 10 14 38 q-8 18 -32 14 q-18 -4 -30 4 z" />
      <path d="M66 50 l12 -4 l-2 6 l6 4 l-14 2 z" />
      <path d="M76 48 l6 -2 l-2 4 z" opacity="0.8" />
    </Frame>
  )
}

/** Hắc Sơn Lão Quái: Dã tu tà ma trượng cao, áo choàng rách rưới bay trong gió, vuốt quỷ cầm hồn trượng */
function Cultist(props: Props) {
  return (
    <Frame {...props}>
      {/* Nón lá tà tu rách hoặc mũ trùm đầu */}
      <circle cx="50" cy="18" r="8" />
      <path d="M30 18 l20 -10 l20 10 l-10 4 h-20 z" />
      {/* Thân áo choàng rách rưới */}
      <path d="M34 26 h32 l14 24 l-8 3 l-6 -12 l8 59 h-14 l-6 -30 l-6 30 h-14 l4 -59 l-8 12 l-8 -3 z" />
      {/* Tay cầm hồn trượng (quỷ trượng có đầu lâu u uất) */}
      <path d="M72 40 l16 -24 l3 2 l-15 26 z" />
      <path d="M88 12 v88 h3 v-88 z" opacity="0.9" /> {/* Trượng dài */}
      <circle cx="89.5" cy="12" r="6" /> {/* Đầu lâu trên trượng */}
      {/* Khói quỷ tà khí quanh thân */}
      <path d="M22 62 q-12 12 -4 28 h4 q-6 -16 6 -24 z" opacity="0.6" />
    </Frame>
  )
}

function Skeleton(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="14" r="9" />
      <path d="M46 24 h8 v10 h-8 z" />
      <path d="M38 34 h24 l2 24 h-6 l-1 -14 h-14 l-1 14 h-6 z" />
      <path d="M40 40 h20 v3 h-20 z M41 46 h18 v3 h-18 z M42 52 h16 v3 h-16 z" opacity="0.8" />
      <path d="M62 36 l22 -14 l3 3 l-21 18 z M38 36 l-12 14 l3 3 l12 -12 z" />
      <path d="M44 58 l-6 42 h6 l6 -34 l6 34 h6 l-6 -42 z" />
      <path d="M80 10 l6 -2 l-4 10 z" />
    </Frame>
  )
}

/** Lưu Chí Mậu: Đại địa kiêu hùng Thư Giản Hồ, tay áo rộng ngự phi kiếm, khí chất tà quyến hiểm ác */
function SkeletonLord(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="16" r="10" />
      {/* Vương miện / trâm cài tà tu */}
      <path d="M44 6 l6 -6 l6 6 l-2 4 h-8 z" />
      {/* Áo bào đại tụ rộng thênh thang của Lưu Chí Mậu */}
      <path d="M30 28 h40 l14 30 l-10 4 l-8 -18 l8 56 h-18 l-6 -34 l-6 34 h-18 l4 -56 l-10 18 l-10 -4 z" />
      {/* Tay kết kiếm quyết ngự phi kiếm */}
      <path d="M72 40 l18 -16 l3 3 l-17 18 z" />
      {/* Phi kiếm âm sát lượn phía trước */}
      <path d="M84 14 l14 -8 l-6 16 l-4 -3 z" />
      <path d="M78 30 q16 -16 20 -24" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" strokeDasharray="3 2" />
    </Frame>
  )
}

function Yeti(props: Props) {
  return (
    <Frame {...props}>
      <path d="M50 4 q22 0 24 22 l6 10 q6 24 -4 40 l2 24 h-12 l-2 -20 l-10 2 l-6 18 h-12 l-2 -22 q-12 -14 -6 -40 l6 -12 q2 -22 16 -22 z" />
      <path d="M22 44 q-14 0 -18 14 l6 2 q4 -10 14 -10 z M78 44 q14 0 18 14 l-6 2 q-4 -10 -14 -10 z" />
    </Frame>
  )
}

/** Bắc Nhạc Cổ Thần: Thần linh núi non vĩ đại, kim thân ngưng tụ như đỉnh núi, uy nghiêm bao trùm */
function Serpent(props: Props) {
  return (
    <Frame {...props}>
      {/* Vương miện thần vị cổ xưa */}
      <path d="M42 4 l8 -4 l8 4 l4 8 h-24 z" />
      <circle cx="50" cy="18" r="11" />
      {/* Thần khu to lớn như khối đá khổng lồ */}
      <path d="M24 30 h52 l14 26 l-8 4 l-8 -14 l8 54 h-22 l-6 -30 l-6 30 h-22 l4 -54 l-10 14 l-8 -4 z" />
      {/* Sơn thần ấn bảo vật trấn áp càn khôn trên tay */}
      <path d="M76 44 l16 -10 l2 4 l-14 12 z" />
      <rect x="88" y="24" width="10" height="10" rx="2" /> {/* Ngọc ấn */}
      {/* Hào quang núi non hộ thể */}
      <path d="M14 50 q-10 24 6 50 h6 q-12 -22 -4 -46 z" opacity="0.7" />
    </Frame>
  )
}

function Lizard(props: Props) {
  return (
    <Frame {...props}>
      <path d="M4 90 q8 -8 26 -8 l10 -16 q6 -10 20 -10 l14 -2 l16 -10 l2 8 l8 4 l-8 6 l-14 4 l-6 12 q6 8 4 22 h-8 q0 -12 -6 -16 l-12 2 l-2 14 h-8 l0 -16 l-10 0 l-4 10 h-8 l2 -14 q-10 2 -16 10 z" />
      <path d="M46 48 l4 -14 l4 12 M58 46 l4 -12 l4 10" opacity="0.9" />
    </Frame>
  )
}

/** Đại Yêu Man Hoang: Thú yêu sừng nhọn dữ tợn nơi Kiếm Khí Trường Thành, răng nanh vuốt nhọn xé rách trời đất */
function Dragonling(props: Props) {
  return (
    <Frame {...props}>
      {/* Thân quái thú viễn cổ cuồn cuộn cơ bắp */}
      <path d="M2 94 q10 -14 30 -16 l8 -16 q4 -12 20 -14 l14 -4 l10 -14 l6 2 l0 10 l8 4 l-10 8 l-14 6 l-4 14 q10 8 8 26 h-8 q0 -14 -8 -18 l-12 4 l-2 14 h-8 l2 -16 l-12 2 l-4 12 h-8 l2 -14 q-12 2 -18 10 z" />
      {/* Cặp cánh yêu ma xòe rộng */}
      <path d="M36 58 q-20 -38 12 -54 q-10 22 2 48 z" opacity="0.85" />
      {/* Sừng đại yêu cong vút và gai lưng */}
      <path d="M60 38 l8 -18 l4 12 M74 32 l10 -18 l2 12" />
      <path d="M84 42 l12 -4 l-4 8 l6 2 l-12 4 z" /> {/* Miệng đầy nanh */}
    </Frame>
  )
}

function Demon(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="18" r="10" />
      <path d="M40 10 l-8 -10 l2 12 z M60 10 l8 -10 l-2 12 z" />
      <path d="M34 28 h32 l8 20 l-6 2 l-6 -10 l6 60 h-14 l-4 -36 l-4 36 h-14 l6 -60 l-6 10 l-6 -2 z" />
      <path d="M74 44 l18 -8 l2 4 l-18 10 z" />
      <path d="M90 30 l8 6 l-4 14 l-6 -8 z" />
    </Frame>
  )
}

/** Yêu Hoàng Thần Thoại: Yêu vương vô thượng Man Hoang, đại xích kiếm ngút trời, khí tức hủy diệt */
function DemonGeneral(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="18" r="11" />
      {/* Đại sừng vương giả Yêu Hoàng */}
      <path d="M38 8 l-16 -12 l6 18 z M62 8 l16 -12 l-6 18 z" />
      {/* Thân chiến giáp ma vương */}
      <path d="M28 30 h44 l12 22 l-6 3 l-8 -12 l6 57 h-18 l-4 -34 l-4 34 h-18 l6 -57 l-8 12 l-6 -3 z" />
      {/* Cánh yêu hoàng đen kịt */}
      <path d="M20 32 q-22 -18 -16 -32 q8 12 18 24 z" opacity="0.75" />
      {/* Tay cầm trảm thiên cự kiếm */}
      <path d="M78 40 l22 -16 l3 3 l-20 20 z" />
      <path d="M96 14 l6 12 l-10 12 l-2 -12 z" /> {/* Chuôi kiếm */}
      <path d="M86 42 l14 56 h-3 l-14 -54 z" /> {/* Lưỡi đại kiếm cắm đất */}
      <path d="M50 44 l-6 10 h12 z" opacity="0.6" />
    </Frame>
  )
}

export const ENEMY_SILHOUETTES: Record<SilhouetteId, (p: Props) => ReactElement> = {
  wolf: Wolf,
  bear: Bear,
  bat: Bat,
  snake: Snake,
  cultist: Cultist,
  skeleton: Skeleton,
  'skeleton-lord': SkeletonLord,
  yeti: Yeti,
  serpent: Serpent,
  lizard: Lizard,
  dragonling: Dragonling,
  demon: Demon,
  'demon-general': DemonGeneral,
}

export function EnemySilhouette({ id, ...rest }: Props & { id: SilhouetteId }) {
  const Comp = ENEMY_SILHOUETTES[id] ?? Wolf
  return <Comp {...rest} />
}
