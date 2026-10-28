import type { GearType, GearSlot } from '@/content/gear'
import type { Rarity } from '@/content/affixes'

interface GearIconProps {
  slot: GearType | GearSlot
  glyph: string
  rarity: Rarity
  gearId?: string
}

export function GearIcon({ slot, glyph, rarity, gearId }: GearIconProps) {
  const isFlyingSword = gearId === 'phi-kiem-tu-vi'
  const isBambooArmor = gearId === 'huyen-quy-giap'
  const isHairpin = gearId === 'bang-tam-chau'
  const isYinGuanRobe = gearId === 'thien-ma-giap'
  const isWoodSword = gearId === 'thiet-kiem'

  // Chuẩn hóa slot về GearType nếu là slot cụ thể như nhan-1, bong-tai-2
  const normalizedSlot: string = slot.startsWith('nhan')
    ? 'nhan'
    : slot.startsWith('bong-tai')
    ? 'bong-tai'
    : slot

  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-current/30 bg-ink-950/85 shadow-inner">
      {/* Nền hoa văn thủy mặc vector tinh xảo phía sau */}
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25 transition-opacity hover:opacity-40"
        fill="none"
        stroke="currentColor"
      >
        {normalizedSlot === 'vu-khi' && (
          <>
            <path d="M10 38 L36 12 M34 10 L38 14 M36 12 L40 8 L38 6 L34 10 M8 40 L12 36" strokeWidth="2" strokeLinecap="round" />
            {isFlyingSword && (
              <g stroke="#e0bf4a" strokeWidth="1.2" opacity="0.8">
                <circle cx="24" cy="24" r="16" strokeDasharray="3 3" />
                <path d="M16 12 Q24 6 32 12 M16 36 Q24 42 32 36" />
              </g>
            )}
            {isWoodSword && (
              <path d="M22 26 Q25 24 28 27" strokeWidth="1" strokeDasharray="2 1" opacity="0.6" />
            )}
          </>
        )}

        {normalizedSlot === 'dau' && (
          <>
            {/* Đạo Quán / Trâm / Khôi */}
            {isHairpin ? (
              <g stroke="#5aa391" strokeWidth="1.8">
                <path d="M10 38 L34 14" />
                <circle cx="37" cy="11" r="4" fill="currentColor" opacity="0.5" />
              </g>
            ) : (
              <>
                <path d="M12 36 H36 L32 18 L24 10 L16 18 Z" strokeWidth="1.8" />
                <circle cx="24" cy="12" r="2" fill="currentColor" />
              </>
            )}
          </>
        )}

        {normalizedSlot === 'ao' && (
          <>
            <path d="M16 10 L24 6 L32 10 L36 18 L32 40 L16 40 L12 18 Z" strokeWidth="1.8" />
            {isBambooArmor && (
              <path d="M24 10 V38 M18 20 H30 M18 30 H30" strokeWidth="1" strokeDasharray="2 2" />
            )}
            {isYinGuanRobe && (
              <path d="M12 28 Q8 38 14 42 M36 28 Q40 38 34 42" strokeWidth="1.5" />
            )}
          </>
        )}

        {normalizedSlot === 'quan' && (
          <>
            <path d="M14 12 H34 L36 40 L26 40 L24 22 L22 40 L12 40 Z" strokeWidth="1.8" />
          </>
        )}

        {normalizedSlot === 'giay' && (
          <>
            <path d="M12 16 L20 16 L22 30 L36 32 L36 38 L12 38 Z" strokeWidth="1.8" />
          </>
        )}

        {normalizedSlot === 'dai-lung' && (
          <>
            <rect x="8" y="20" width="32" height="8" rx="2" strokeWidth="1.8" />
            <circle cx="24" cy="24" r="3" fill="currentColor" />
          </>
        )}

        {normalizedSlot === 'phu-luc' && (
          <>
            <rect x="14" y="10" width="20" height="28" rx="2" strokeWidth="1.8" />
            <path d="M18 16 H30 M24 16 V32 M20 28 Q24 34 28 28" strokeWidth="1.2" />
          </>
        )}

        {normalizedSlot === 'day-chuyen' && (
          <>
            <path d="M14 12 Q24 28 34 12" strokeWidth="1.8" />
            <circle cx="24" cy="28" r="4" fill="currentColor" />
          </>
        )}

        {normalizedSlot === 'nhan' && (
          <>
            <ellipse cx="24" cy="24" rx="14" ry="10" strokeWidth="2" />
            <circle cx="24" cy="14" r="3" fill="currentColor" />
          </>
        )}

        {normalizedSlot === 'bong-tai' && (
          <>
            <circle cx="24" cy="16" r="6" strokeWidth="1.8" />
            <path d="M24 22 V34" strokeWidth="2" />
            <circle cx="24" cy="34" r="3" fill="currentColor" />
          </>
        )}
      </svg>

      {/* Glyph chữ Hán ở giữa */}
      <span className="relative z-10 font-han text-2xl font-bold select-none drop-shadow">
        {glyph}
      </span>

      {/* Viền sáng nếu là Thần Phẩm / Tiên Phẩm */}
      {(rarity === 'than' || rarity === 'tien') && (
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gold-400/50 animate-pulse" />
      )}
    </div>
  )
}
