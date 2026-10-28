import { AVATARS, AVATAR_BY_ID, getEvolutionStage } from '@/content/avatars'

export interface CharacterDisplayProps {
  realmIndex: number
  progress: number
  ready: boolean
  avatarId?: string
  onAvatarClick?: () => void
  compact?: boolean
}

export function CharacterDisplay({
  realmIndex,
  progress,
  ready,
  avatarId = 'tran-binh-an',
  onAvatarClick,
  compact = false,
}: CharacterDisplayProps) {
  const avatar = AVATAR_BY_ID[avatarId] ?? AVATARS[0]
  const stage = getEvolutionStage(realmIndex)
  const auraOpacity = 0.35 + 0.55 * Math.min(1, Math.max(0, progress))

  // Nếu người chơi dùng avatar mặc định Trần Bình An -> dùng ảnh tiến hóa 4 giai đoạn
  // Nếu người chơi chọn các NPC huyền thoại khác (Ninh Diệu, A Lương...) -> dùng chân dung của NPC đó
  const displayImage = avatarId === 'tran-binh-an' || !avatarId ? stage.image : avatar.image

  const cardSize = compact
    ? 'w-36 h-48 sm:w-40 sm:h-56'
    : 'w-44 h-60 sm:w-52 sm:h-72'

  return (
    <div className="relative flex flex-col items-center text-center select-none">
      {/* Vùng Khí Tượng Dị Tượng Sau Lưng (Aura & Concentric Array) */}
      <div className="relative flex items-center justify-center">
        {/* Vòng Trận Đồ Bát Quái Xoay Vần (Tale of Immortal Background Disk) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 flex items-center justify-center transition-opacity duration-700"
          style={{
            opacity: auraOpacity,
            filter: `drop-shadow(0 0 20px ${stage.ringColor})`,
          }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_30s_linear_infinite]">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={stage.ringColor}
              strokeWidth="1.2"
              strokeDasharray="10 5 2 5"
              opacity="0.85"
            />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke={stage.ringColor}
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* 8 quẻ hào thiên địa bát quái */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 100 100)`}>
                <line x1="100" y1="12" x2="100" y2="22" stroke={stage.ringColor} strokeWidth="2.5" />
                <circle cx="100" cy="28" r="2" fill={stage.ringColor} />
              </g>
            ))}
          </svg>
        </div>

        {/* Hào quang rực sáng khi 100% linh khí sẵn sàng Đột Phá */}
        {ready && (
          <div
            className="pointer-events-none absolute -inset-3 rounded-2xl blur-lg animate-pulse"
            style={{ backgroundColor: stage.glowColor }}
          />
        )}

        {/* Các Phi Kiếm Hoàng Kim bay lượn quanh Đạo Thân */}
        {stage.swordCount > 0 && (
          <div className="pointer-events-none absolute -inset-4 animate-[spin_12s_linear_infinite] z-20">
            {Array.from({ length: stage.swordCount }).map((_, idx) => {
              const angle = (360 / stage.swordCount) * idx
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <svg
                    viewBox="0 0 16 36"
                    className="h-8 w-4 -translate-y-3 drop-shadow-[0_0_10px_#fde047]"
                    fill="none"
                  >
                    <path
                      d="M8 2 L13 12 L10 30 L8 34 L6 30 L3 12 Z"
                      fill={stage.ringColor}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <path d="M8 6 L8 28" stroke="#ffffff" strokeWidth="1" />
                  </svg>
                </div>
              )
            })}
          </div>
        )}

        {/* ================= TRANH LẬP HỘI ĐỨNG BÁN THÂN (3:4 STANDING BUST) ================= */}
        <button
          type="button"
          onClick={onAvatarClick}
          title={`${avatar.name} · Bấm để hoán đổi diện mạo`}
          className={`group relative z-10 flex ${cardSize} cursor-pointer flex-col overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] ${
            ready
              ? 'border-gold-400 ring-4 ring-gold-400/50 shadow-[0_0_30px_#e0bf4a]'
              : 'border-gold-500/40 hover:border-gold-400 shadow-ink'
          }`}
          style={{ backgroundColor: '#12100e' }}
        >
          {/* Bức Tranh Lập Hội Nhân Vật */}
          <img
            src={displayImage}
            alt={avatar.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />

          {/* Lớp sương khói thủy mặc hòa tan vạt áo ở chân tranh */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />

          {/* Viền hoa văn cổ phong quanh tranh */}
          <div className="pointer-events-none absolute inset-1.5 rounded-lg border border-gold-500/20" />

          {/* Nút bấm Đổi Diện Mạo khi hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
            <span className="rounded-md border border-gold-400 bg-ink-950/90 px-3 py-1 font-han text-xs font-bold text-gold-300 shadow-lg">
              Hoán Đổi Đạo Thân
            </span>
          </div>

          {/* Huy hiệu Đột Phá Khí Tràng */}
          {ready && (
            <div className="absolute top-2 right-2 rounded-full bg-vermilion-600 px-2.5 py-0.5 text-[10px] font-bold text-paper-100 shadow-lg border border-vermilion-300 animate-bounce">
              ⚡ ĐỘT PHÁ
            </div>
          )}

          {/* Tag Giai Đoạn Đạo Thân dưới đáy tranh */}
          <div className="absolute bottom-2 inset-x-2 z-10 text-center">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md shadow-md"
              style={{
                color: stage.ringColor,
                borderColor: `${stage.ringColor}66`,
                backgroundColor: 'rgba(10, 10, 10, 0.75)',
              }}
            >
              {stage.name}
            </span>
          </div>
        </button>
      </div>

      {/* Thông tin Đạo Hiệu & Thần Vật Bản Mệnh */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-han text-lg font-bold text-paper-100">
            {avatar.name}
          </h3>
          <span className="text-[11px] text-paper-400 font-serif">
            ({avatar.origin})
          </span>
        </div>

        <p className="text-xs text-paper-300 font-serif line-clamp-1">
          {stage.subtitle}
        </p>

        <div className="flex items-center justify-center gap-3 text-[11px] text-paper-300 pt-0.5">
          <span className="flex items-center gap-1 text-gold-400">
            <span>🗡️</span>
            <span className="text-paper-200">{stage.weapon}</span>
          </span>
          <span className="text-paper-400/50">·</span>
          <span className="flex items-center gap-1 text-jade-400">
            <span>👘</span>
            <span className="text-paper-200">{stage.outfit}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
