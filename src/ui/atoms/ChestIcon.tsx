import type { ChestKind } from '@/content/affixes'

interface ChestIconProps {
  kind: ChestKind
  count?: number
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function ChestIcon({
  kind,
  count = 0,
  size = 'md',
  animated = false,
}: ChestIconProps) {
  const isRed = kind === 'red'
  const hasChests = count > 0

  const sizeClass = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }[size]

  return (
    <div className={`relative flex items-center justify-center ${sizeClass}`}>
      {/* Vầng hào quang bảo vật khi có rương đỏ */}
      {isRed && hasChests && (
        <div className="pointer-events-none absolute inset-0 rounded-full bg-vermilion-500/25 blur-md animate-pulse" />
      )}

      {/* Vector Rương Báu Thủy Mặc */}
      <svg
        viewBox="0 0 64 64"
        className={`h-full w-full drop-shadow-md transition-transform duration-300 ${
          animated && hasChests ? 'animate-[bounce_2s_infinite] hover:scale-110' : ''
        }`}
        fill="none"
      >
        <defs>
          {/* Gradient Rương Thường (Gỗ mun bọc đồng) */}
          <linearGradient id="chest-normal-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3f35" />
            <stop offset="60%" stopColor="#2e2722" />
            <stop offset="100%" stopColor="#1a1614" />
          </linearGradient>
          <linearGradient id="chest-normal-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8c7853" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#6e5c3e" />
          </linearGradient>

          {/* Gradient Rương Đỏ (Chu Sa Thần Mộc dát vàng) */}
          <linearGradient id="chest-red-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="50%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <linearGradient id="chest-red-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>

        {isRed ? (
          // ================= RƯƠNG ĐỎ KIẾM LAI =================
          <g>
            {/* Thân rương */}
            <rect
              x="10"
              y="28"
              width="44"
              height="28"
              rx="4"
              fill="url(#chest-red-body)"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            {/* Nẹp viền vàng quanh thân */}
            <rect x="18" y="28" width="6" height="28" fill="url(#chest-red-gold)" />
            <rect x="40" y="28" width="6" height="28" fill="url(#chest-red-gold)" />
            <line x1="10" y1="46" x2="54" y2="46" stroke="#fbbf24" strokeWidth="1.5" />

            {/* Nắp vòm rương */}
            <path
              d="M8 28 C8 16 20 12 32 12 C44 12 56 16 56 28 Z"
              fill="url(#chest-red-body)"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            {/* Nẹp viền vàng trên nắp */}
            <path d="M18 28 C18 18 22 14 24 13 L24 28 Z" fill="url(#chest-red-gold)" />
            <path d="M40 28 C40 18 44 14 46 13 L46 28 Z" fill="url(#chest-red-gold)" />
            {/* Quai cầm trên đỉnh nắp */}
            <path d="M26 12 Q32 8 38 12" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Ổ khóa hoàng kim phong ấn */}
            <circle cx="32" cy="30" r="5" fill="url(#chest-red-gold)" stroke="#78350f" strokeWidth="1" />
            <path d="M32 28 L32 32" stroke="#451a03" strokeWidth="1.5" />
            <circle cx="32" cy="30" r="1.5" fill="#fde047" />

            {/* Hạt linh khí phát sáng */}
            {hasChests && (
              <g className="animate-pulse">
                <circle cx="14" cy="18" r="1.5" fill="#fde047" />
                <circle cx="50" cy="18" r="1.5" fill="#fde047" />
              </g>
            )}
          </g>
        ) : (
          // ================= RƯƠNG THƯỜNG =================
          <g>
            {/* Thân rương */}
            <rect
              x="10"
              y="28"
              width="44"
              height="28"
              rx="3"
              fill="url(#chest-normal-wood)"
              stroke="#8c7853"
              strokeWidth="1.8"
            />
            {/* Nẹp đồng gia cố */}
            <rect x="18" y="28" width="5" height="28" fill="url(#chest-normal-metal)" opacity="0.8" />
            <rect x="41" y="28" width="5" height="28" fill="url(#chest-normal-metal)" opacity="0.8" />
            <line x1="10" y1="44" x2="54" y2="44" stroke="#8c7853" strokeWidth="1.5" />

            {/* Nắp vòm rương */}
            <path
              d="M9 28 C9 18 20 14 32 14 C44 14 55 18 55 28 Z"
              fill="url(#chest-normal-wood)"
              stroke="#8c7853"
              strokeWidth="1.8"
            />
            {/* Nẹp đồng trên nắp */}
            <path d="M18 28 C18 20 20 16 23 15 L23 28 Z" fill="url(#chest-normal-metal)" opacity="0.8" />
            <path d="M41 28 C41 20 43 16 46 15 L46 28 Z" fill="url(#chest-normal-metal)" opacity="0.8" />

            {/* Ổ khóa đồng */}
            <rect x="29" y="26" width="6" height="8" rx="1.5" fill="url(#chest-normal-metal)" stroke="#3e3223" strokeWidth="1" />
            <circle cx="32" cy="29" r="1" fill="#1a1614" />
          </g>
        )}
      </svg>

      {/* Huy hiệu số lượng rương */}
      {count > 0 && (
        <span
          className={`absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-md ${
            isRed
              ? 'bg-vermilion-600 text-white border border-vermilion-300'
              : 'bg-gold-500 text-ink-950 border border-gold-300'
          }`}
        >
          {count}
        </span>
      )}
    </div>
  )
}
