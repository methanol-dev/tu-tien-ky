import type { ItemKind } from '@/content/items'

interface ItemIconProps {
  id: string
  kind: ItemKind
  tier: number
  size?: 'sm' | 'md' | 'lg'
}

const TIER_COLORS = [
  '#9e9e9e', // Tier 0/default
  '#5aa391', // Tier 1: Thanh Lục (Jade green)
  '#7f7fb3', // Tier 2: Tử Hà (Purple mist)
  '#e0bf4a', // Tier 3: Kim Sắc (Gold)
  '#d1443b', // Tier 4: Chu Sa (Vermilion red)
  '#f59e0b', // Tier 5: Thần Phẩm (Radiant Amber)
]

export function ItemIcon({ id, kind, tier, size = 'md' }: ItemIconProps) {
  const color = TIER_COLORS[Math.min(tier, TIER_COLORS.length - 1)]
  const dim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'

  return (
    <div
      className={`relative flex ${dim} shrink-0 items-center justify-center overflow-hidden rounded-lg border border-paper-400/20 bg-ink-950/80 shadow-inner`}
      style={{ borderColor: `${color}44` }}
    >
      {/* Vòng hào quang phát sáng nhẹ theo Tier */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-20"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className="relative z-10 h-[80%] w-[80%]"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Linh Dược (Herbs) */}
        {kind === 'herb' && (
          <>
            {id === 'linh-thao' && (
              /* Cụm cỏ xanh ba lá */
              <g strokeWidth="1.8">
                <path d="M20 34 Q20 22 14 14 Q22 18 20 34" fill={`${color}33`} />
                <path d="M20 34 Q21 18 27 12 Q24 22 20 34" fill={`${color}44`} />
                <path d="M20 34 Q19 24 20 10 Q21 22 20 34" />
                <circle cx="20" cy="9" r="1.5" fill={color} />
              </g>
            )}

            {id === 'huyet-tinh-chi' && (
              /* Nấm linh chi huyết tinh đỏ thắm */
              <g strokeWidth="1.8">
                <path d="M18 34 Q19 22 19 18" strokeWidth="2.5" />
                <path d="M9 18 Q20 6 31 18 Q20 12 9 18 Z" fill={`${color}44`} />
                <path d="M13 14 Q20 9 27 14" opacity="0.8" />
                <circle cx="15" cy="12" r="1" fill={color} />
                <circle cx="25" cy="11" r="1" fill={color} />
              </g>
            )}

            {id === 'tu-linh-chi' && (
              /* Nấm linh chi tím trăm năm uốn lượn kép */
              <g strokeWidth="1.8">
                <path d="M16 34 Q18 24 16 19 M22 34 Q20 26 24 21" strokeWidth="2" />
                <path d="M8 19 Q18 9 28 17 Q18 13 8 19 Z" fill={`${color}55`} />
                <path d="M18 15 Q26 7 34 14 Q26 10 18 15 Z" fill={`${color}33`} />
              </g>
            )}

            {id === 'thien-tam-lien' && (
              /* Đóa sen tuyết trắng băng tâm nở rộ */
              <g strokeWidth="1.5">
                <path d="M20 34 V28" strokeWidth="2" />
                <path d="M20 28 Q14 20 12 14 Q20 18 20 28" fill={`${color}33`} />
                <path d="M20 28 Q26 20 28 14 Q20 18 20 28" fill={`${color}33`} />
                <path d="M20 28 Q17 17 20 9 Q23 17 20 28" fill={`${color}55`} />
                <circle cx="20" cy="12" r="2" fill={color} />
              </g>
            )}

            {id === 'cuu-chuyen-can' && (
              /* Rễ thần mộc cửu chuyển uốn khúc như rồng */
              <g strokeWidth="2">
                <path d="M20 6 Q28 12 18 18 Q8 24 22 28 Q14 32 20 36" />
                <path d="M18 18 Q26 20 24 24" strokeWidth="1.5" opacity="0.7" />
                <path d="M12 24 Q8 26 10 30" strokeWidth="1.5" opacity="0.6" />
                <circle cx="20" cy="6" r="2" fill={color} />
              </g>
            )}

            {/* Fallback cho các thảo dược khác */}
            {!['linh-thao', 'huyet-tinh-chi', 'tu-linh-chi', 'thien-tam-lien', 'cuu-chuyen-can'].includes(id) && (
              <g strokeWidth="1.8">
                <path d="M20 34 V16 M20 22 Q12 18 14 12 Q20 18 20 22 M20 20 Q28 16 26 10 Q20 16 20 20" fill={`${color}33`} />
              </g>
            )}
          </>
        )}

        {/* Đan Dược (Pills) */}
        {kind === 'pill' && (
          <g>
            {/* Vòng hào quang đan khí xoay tròn */}
            <circle cx="20" cy="20" r="14" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            {/* Viên kim đan chính */}
            <circle cx="20" cy="20" r="10" strokeWidth="2" fill={`${color}33`} />

            {/* Đan văn (hoa văn mây/lôi điện/hào quang trên thân đan) */}
            {id === 'tu-khi-dan' && (
              /* Vân mây tụ khí */
              <path d="M16 20 Q20 16 24 20 Q20 23 18 21" strokeWidth="1.5" />
            )}

            {id === 'ngung-than-dan' && (
              /* Đạo ấn tĩnh tâm */
              <path d="M15 17 H25 M20 17 V24 M16 24 H24" strokeWidth="1.5" />
            )}

            {id === 'pha-canh-dan' && (
              /* Tia lôi điện phá vỡ bình cảnh */
              <path d="M20 14 L17 20 H23 L20 26" strokeWidth="1.8" />
            )}

            {id === 'tang-tho-dan' && (
              /* Hình đào tiên trường thọ */
              <path d="M20 14 Q24 16 23 21 Q20 26 20 26 Q20 26 17 21 Q16 16 20 14 Z" fill={`${color}55`} strokeWidth="1.2" />
            )}

            {id === 'kim-nguyen-dan' && (
              /* Cực phẩm cửu chuyển thái cực kim đan */
              <g strokeWidth="1.4">
                <path d="M20 10 A5 5 0 0 1 20 20 A5 5 0 0 0 20 30" />
                <circle cx="20" cy="15" r="1.5" fill={color} />
                <circle cx="20" cy="25" r="1.5" fill={color} />
              </g>
            )}

            {/* Điểm sáng phản chiếu trên mặt ngọc đan */}
            <circle cx="16.5" cy="16.5" r="1.5" fill="#ffffff" opacity="0.8" />
          </g>
        )}
      </svg>

      {/* Hiệu ứng rung ring nếu là Tier 4 hoặc Tier 5 */}
      {tier >= 4 && (
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-gold-400/60 animate-pulse" />
      )}
    </div>
  )
}

