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
  const auraOpacity = 0.3 + 0.5 * Math.min(1, Math.max(0, progress))

  return (
    <div className={`relative flex flex-col items-center text-center ${compact ? 'scale-90' : ''}`}>
      {/* Vùng Hào Quang Bát Quái & Kiếm Trận */}
      <div className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
        {/* Khí tràng Thái Cực / Vòng hào quang xoay chậm */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 flex items-center justify-center transition-opacity duration-700"
          style={{
            opacity: auraOpacity,
            filter: `drop-shadow(0 0 16px ${stage.ringColor})`,
          }}
        >
          <svg viewBox="0 0 140 140" className="h-full w-full animate-[spin_24s_linear_infinite]">
            {/* Vòng kinh văn Bát quái cổ */}
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke={stage.ringColor}
              strokeWidth="1.2"
              strokeDasharray="8 4 2 4"
              opacity="0.8"
            />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke={stage.ringColor}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            {/* 8 vạch quẻ hào */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="70"
                y1="8"
                x2="70"
                y2="14"
                stroke={stage.ringColor}
                strokeWidth="2"
                transform={`rotate(${deg} 70 70)`}
              />
            ))}
          </svg>
        </div>

        {/* Vầng hào quang sáng rực khi đạt 100% linh khí sẵn sàng Đột Phá */}
        {ready && (
          <div
            className="pointer-events-none absolute -inset-2 rounded-full blur-md animate-pulse"
            style={{ backgroundColor: stage.glowColor }}
          />
        )}

        {/* Các Phi Kiếm bay lượn quanh Đạo Thân */}
        {stage.swordCount > 0 && (
          <div className="pointer-events-none absolute inset-0 animate-[spin_10s_linear_infinite]">
            {Array.from({ length: stage.swordCount }).map((_, idx) => {
              const angle = (360 / stage.swordCount) * idx
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <svg
                    viewBox="0 0 16 32"
                    className="h-6 w-3 -translate-y-2 drop-shadow-[0_0_8px_#e0bf4a]"
                    fill="none"
                  >
                    <path
                      d="M8 2 L12 10 L10 26 L8 30 L6 26 L4 10 Z"
                      fill={stage.ringColor}
                      stroke="#fff"
                      strokeWidth="0.8"
                    />
                    <path d="M8 6 L8 24" stroke="#fff" strokeWidth="0.8" />
                  </svg>
                </div>
              )
            })}
          </div>
        )}

        {/* Khung Chân Dung Nhân Vật Thủy Mặc */}
        <button
          type="button"
          onClick={onAvatarClick}
          title={`${avatar.name} · Bấm để đổi diện mạo`}
          className={`group relative z-10 flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-300 hover:scale-105 ${
            ready
              ? 'border-gold-400 ring-4 ring-gold-400/40 shadow-[0_0_20px_#e0bf4a]'
              : 'border-gold-500/50 hover:border-gold-400 shadow-ink'
          }`}
          style={{ backgroundColor: '#141210' }}
        >
          <img
            src={avatar.image}
            alt={avatar.name}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />

          {/* Lớp phủ sương khói thủy mặc chân dung */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-black/20" />

          {/* Icon bút cọ đổi avatar khi hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
            <span className="font-han text-xs font-bold text-gold-300">Đổi Diện Mạo</span>
          </div>

          {/* Huy hiệu nhỏ khi sẵn sàng đột phá */}
          {ready && (
            <span className="absolute bottom-1 rounded-full bg-vermilion-600 px-2 py-0.5 text-[9px] font-bold text-paper-100 shadow-md animate-bounce">
              ĐỘT PHÁ
            </span>
          )}
        </button>
      </div>

      {/* Thông tin Giai Đoạn Đạo Thân Kiếm Lai */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-han text-sm font-bold text-gold-400 sm:text-base">
            {avatar.name}
          </span>
          <span
            className="rounded px-1.5 py-0.2 text-[10px] font-medium border"
            style={{
              color: stage.ringColor,
              borderColor: `${stage.ringColor}55`,
              backgroundColor: `${stage.ringColor}15`,
            }}
          >
            {stage.name}
          </span>
        </div>

        <p className="text-[11px] text-paper-400 font-serif">
          {stage.subtitle}
        </p>

        <div className="inline-flex items-center gap-1.5 text-[10px] text-paper-300">
          <span className="text-gold-400">🗡️</span>
          <span>{stage.weapon}</span>
        </div>
      </div>
    </div>
  )
}
