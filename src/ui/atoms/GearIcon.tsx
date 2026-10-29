import type { GearSlot, GearType } from '@/content/gear'
import type { Rarity } from '@/content/affixes'

interface GearIconProps {
  slot: GearType | GearSlot
  glyph: string
  rarity: Rarity
  gearId?: string
  size?: 'sm' | 'md' | 'lg'
}

const RARITY_COLORS: Record<Rarity, { main: string; glow: string; border: string }> = {
  pham: { main: '#9e9e9e', glow: 'rgba(158, 158, 158, 0.2)', border: '#4a4a4a' },
  linh: { main: '#5aa391', glow: 'rgba(90, 163, 145, 0.3)', border: '#3b7a6b' },
  bao: { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.35)', border: '#0284c7' },
  tien: { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)', border: '#b91c1c' },
  than: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', border: '#d97706' },
}

export function GearIcon({ slot, glyph, rarity, gearId, size = 'md' }: GearIconProps) {
  const isFlyingSword = gearId === 'phi-kiem-tu-vi'
  const isBambooArmor = gearId === 'huyen-quy-giap'
  const isHairpin = gearId === 'bang-tam-chau'
  const isYinGuanRobe = gearId === 'thien-ma-giap'

  const normalizedSlot: string = slot.startsWith('nhan')
    ? 'nhan'
    : slot.startsWith('bong-tai')
    ? 'bong-tai'
    : slot

  const theme = RARITY_COLORS[rarity] ?? RARITY_COLORS.pham
  const dim = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-16 w-16' : 'h-12 w-12'

  return (
    <div
      className={`relative flex ${dim} shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-ink-900 to-ink-950 shadow-inner select-none transition-transform duration-150`}
      style={{
        borderColor: theme.border,
        boxShadow: `0 0 10px ${theme.glow}`,
      }}
    >
      {/* 4 Góc Khung Chạm Trổ Cổ Phong (Corner Engravings) */}
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        fill="none"
        stroke={theme.main}
        strokeWidth="1.2"
      >
        {/* Góc trên-trái */}
        <path d="M 2 8 L 2 2 L 8 2" />
        <line x1="4" y1="4" x2="6" y2="4" />
        {/* Góc trên-phải */}
        <path d="M 40 2 L 46 2 L 46 8" />
        <line x1="44" y1="4" x2="42" y2="4" />
        {/* Góc dưới-trái */}
        <path d="M 2 40 L 2 46 L 8 46" />
        <line x1="4" y1="44" x2="6" y2="44" />
        {/* Góc dưới-phải */}
        <path d="M 40 46 L 46 46 L 46 40" />
        <line x1="44" y1="44" x2="42" y2="44" />
      </svg>

      {/* Vòng hào quang trung tâm */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-25"
        style={{ background: `radial-gradient(circle, ${theme.main} 0%, transparent 75%)` }}
      />

      {/* Vector hình ảnh trang bị chính - sắc nét, rõ ràng */}
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className="relative z-10 h-[75%] w-[75%] drop-shadow"
        fill="none"
        stroke={theme.main}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 1. VŨ KHÍ */}
        {normalizedSlot === 'vu-khi' && (
          <g strokeWidth="2">
            {/* Lưỡi kiếm sáng lóa */}
            <path d="M12 36 L36 12 L38 8 L34 10 L10 34 Z" fill={theme.main} fillOpacity="0.25" />
            <line x1="12" y1="36" x2="36" y2="12" strokeWidth="2.5" />
            <line x1="16" y1="32" x2="35" y2="13" strokeWidth="1" strokeDasharray="3 2" />
            {/* Đốc kiếm vàng */}
            <path d="M7 41 L12 36" strokeWidth="3.5" />
            <line x1="6" y1="36" x2="13" y2="43" strokeWidth="2.5" stroke="#f59e0b" />
            <circle cx="6" cy="42" r="1.5" fill="#f59e0b" />
            {/* Phi kiếm có vòng kiếm khí xoay vần */}
            {isFlyingSword && (
              <g stroke="#f59e0b" strokeWidth="1.2" opacity="0.9">
                <circle cx="24" cy="24" r="16" strokeDasharray="4 2" />
                <path d="M15 12 Q24 6 33 12 M15 36 Q24 42 33 36" />
              </g>
            )}
          </g>
        )}

        {/* 2. ĐẦU */}
        {normalizedSlot === 'dau' && (
          <g strokeWidth="1.8">
            {isHairpin ? (
              <g strokeWidth="2">
                <path d="M10 38 L34 14" strokeWidth="2.5" />
                <circle cx="37" cy="11" r="5" fill={theme.main} fillOpacity="0.4" />
                <circle cx="37" cy="11" r="2" fill="#ffffff" />
                <path d="M35 16 Q30 22 34 26" strokeWidth="1.2" />
              </g>
            ) : (
              <>
                <path d="M13 36 C13 25 18 15 24 11 C30 15 35 25 35 36 Z" fill={theme.main} fillOpacity="0.25" />
                <path d="M10 36 H38" strokeWidth="2.5" />
                <circle cx="24" cy="10" r="3.5" fill="#f59e0b" />
                <line x1="7" y1="20" x2="41" y2="20" strokeWidth="2" stroke="#f59e0b" />
                <circle cx="8" cy="20" r="1.5" fill="#ffffff" />
              </>
            )}
          </g>
        )}

        {/* 3. ÁO */}
        {normalizedSlot === 'ao' && (
          <g strokeWidth="1.8">
            <path
              d="M14 10 L7 22 L13 24 L11 39 H37 L35 24 L41 22 L34 10 Z"
              fill={theme.main}
              fillOpacity="0.2"
            />
            {/* Cổ áo giao lĩnh */}
            <path d="M17 10 L24 22 L31 10" strokeWidth="2" />
            {/* Hộ tâm kính trước ngực */}
            <circle cx="24" cy="28" r="4.5" fill="#f59e0b" fillOpacity="0.5" strokeWidth="1.5" />
            <circle cx="24" cy="28" r="1.5" fill="#ffffff" />
            {isBambooArmor && (
              <path d="M24 10 V38 M16 20 H32 M16 30 H32" strokeWidth="1" strokeDasharray="2 2" />
            )}
            {isYinGuanRobe && (
              <path d="M11 28 Q6 38 13 42 M37 28 Q42 38 35 42" strokeWidth="1.5" stroke="#ef4444" />
            )}
          </g>
        )}

        {/* 4. ĐAI LƯNG */}
        {normalizedSlot === 'dai-lung' && (
          <g strokeWidth="2">
            <rect x="7" y="19" width="34" height="10" rx="2" fill={theme.main} fillOpacity="0.2" />
            <rect x="19" y="17" width="10" height="14" rx="2" fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" />
            <circle cx="24" cy="24" r="2.5" fill="#ffffff" />
            <path d="M22 31 V43 L24 41 L26 43 V31" strokeWidth="1.5" />
          </g>
        )}

        {/* 5. QUẦN */}
        {normalizedSlot === 'quan' && (
          <g strokeWidth="1.8">
            <path d="M11 12 H37 V16 H11 Z" fill={theme.main} fillOpacity="0.4" />
            <path
              d="M11 16 L9 39 H19 L24 25 L29 39 H39 L37 16 Z"
              fill={theme.main}
              fillOpacity="0.2"
            />
            <line x1="12" y1="24" x2="19" y2="24" strokeWidth="1.2" />
            <line x1="29" y1="24" x2="36" y2="24" strokeWidth="1.2" />
          </g>
        )}

        {/* 6. GIÀY */}
        {normalizedSlot === 'giay' && (
          <g strokeWidth="1.8">
            <path
              d="M11 14 V26 C11 31 14 35 23 35 H27 V28 L19 28 V14 Z"
              fill={theme.main}
              fillOpacity="0.25"
            />
            <path d="M23 35 Q28 35 29 30" strokeWidth="2.2" stroke="#f59e0b" />
            <path d="M14 20 Q18 18 18 23" strokeWidth="1.2" />
            <line x1="11" y1="14" x2="19" y2="14" strokeWidth="2.5" stroke="#f59e0b" />
          </g>
        )}

        {/* 7. PHÙ LỤC */}
        {normalizedSlot === 'phu-luc' && (
          <g strokeWidth="1.6">
            <path
              d="M13 8 H35 V38 C35 38 29 36 24 38 C19 36 13 38 13 38 Z"
              fill={theme.main}
              fillOpacity="0.25"
            />
            <circle cx="24" cy="16" r="4.5" strokeWidth="1.5" />
            <path d="M24 11.5 A2.25 2.25 0 0 1 24 16 A2.25 2.25 0 0 0 24 20.5" strokeWidth="1" stroke="#f59e0b" />
            <path d="M24 22 V28 M19 25 H29 M20 31 Q24 28 28 31 M24 31 V35" strokeWidth="1.8" stroke="#ef4444" />
          </g>
        )}

        {/* 8. DÂY CHUYỀN */}
        {normalizedSlot === 'day-chuyen' && (
          <g strokeWidth="1.8">
            <path d="M11 10 C11 25 37 25 37 10" strokeDasharray="3 2" strokeWidth="1.5" />
            <path d="M19 22 H29 L28 29 H20 Z" fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" />
            <circle cx="24" cy="25" r="2" fill="#ffffff" />
            <path d="M24 29 V35" strokeWidth="1.5" />
            <circle cx="24" cy="37" r="3" fill={theme.main} fillOpacity="0.5" />
          </g>
        )}

        {/* 9. NHẪN */}
        {normalizedSlot === 'nhan' && (
          <g strokeWidth="1.8">
            <ellipse cx="24" cy="26" rx="14" ry="7" fill={theme.main} fillOpacity="0.15" />
            <ellipse cx="24" cy="22" rx="14" ry="7" strokeWidth="2.2" />
            <polygon points="24,11 31,17 24,23 17,17" fill="#f59e0b" fillOpacity="0.6" stroke="#f59e0b" />
            <circle cx="24" cy="17" r="2.5" fill="#ffffff" />
            <line x1="24" y1="7" x2="24" y2="9" strokeWidth="1.5" stroke="#f59e0b" />
            <line x1="33" y1="12" x2="35" y2="10" strokeWidth="1.5" stroke="#f59e0b" />
            <line x1="15" y1="12" x2="13" y2="10" strokeWidth="1.5" stroke="#f59e0b" />
          </g>
        )}

        {/* 10. BÔNG TAI */}
        {normalizedSlot === 'bong-tai' && (
          <g strokeWidth="1.8">
            <path d="M20 9 C20 6 26 6 26 12 L24 18" strokeWidth="2" stroke="#f59e0b" />
            <path
              d="M24 19 C20 23 16 28 16 32 C16 36 20 40 24 40 C28 40 32 36 32 32 C32 28 28 23 24 19 Z"
              fill={theme.main}
              fillOpacity="0.35"
            />
            <circle cx="24" cy="32" r="2.5" fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Glyph chữ Hán dạng ấn triện nhỏ ở góc dưới phải */}
      <span
        className="pointer-events-none absolute bottom-0.5 right-1 z-20 font-han text-[9px] font-black opacity-85 select-none"
        style={{ color: theme.main }}
      >
        {glyph}
      </span>

      {/* Hiệu ứng Ring lấp lánh cho Thần Phẩm & Tiên Phẩm */}
      {(rarity === 'than' || rarity === 'tien') && (
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-gold-400/70 animate-pulse" />
      )}
    </div>
  )
}
