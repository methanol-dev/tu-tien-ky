import type { GearSlot } from '@/content/gear'
import type { Rarity } from '@/content/affixes'

interface GearIconProps {
  slot: GearSlot
  glyph: string
  rarity: Rarity
  gearId?: string
}

export function GearIcon({ slot, glyph, rarity, gearId }: GearIconProps) {
  // Trâm bích ngọc hoặc phi kiếm Lung Trung Tước có hiệu ứng đặc biệt
  const isFlyingSword = gearId === 'phi-kiem-tu-vi'
  const isBamboo = gearId === 'ngung-than-phu' || gearId === 'huyen-quy-giap'

  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-current/30 bg-ink-950/80 shadow-inner">
      {/* Nền hoa văn thủy mặc vector mờ phía sau */}
      <svg
        viewBox="0 0 48 48"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20 transition-opacity hover:opacity-35"
        fill="none"
        stroke="currentColor"
      >
        {slot === 'kiem' && (
          <>
            {/* Thanh kiếm dài chéo */}
            <path d="M10 38 L36 12 M34 10 L38 14 M36 12 L40 8 L38 6 L34 10 M8 40 L12 36" strokeWidth="2" strokeLinecap="round" />
            {isFlyingSword && (
              <circle cx="24" cy="24" r="16" strokeDasharray="3 3" strokeWidth="1" opacity="0.6" />
            )}
          </>
        )}
        {slot === 'giap' && (
          <>
            {/* Chiếc giáp bảo hộ hoặc áo trúc y */}
            <path d="M16 10 L24 6 L32 10 L36 18 L32 40 L16 40 L12 18 Z" strokeWidth="1.8" />
            {isBamboo && <path d="M24 10 V38 M18 20 H30 M18 30 H30" strokeWidth="1" strokeDasharray="2 2" />}
          </>
        )}
        {slot === 'phap-khi' && (
          <>
            {/* Thái cực đồ hoặc pháp bảo linh châu */}
            <circle cx="24" cy="24" r="14" strokeWidth="1.8" />
            <path d="M24 10 A7 7 0 0 1 24 24 A7 7 0 0 0 24 38" strokeWidth="1.5" />
            <circle cx="24" cy="17" r="2" fill="currentColor" />
            <circle cx="24" cy="31" r="2" fill="currentColor" />
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
