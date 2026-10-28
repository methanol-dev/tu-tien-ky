import type { GearSlot } from '@/content/gear'
import type { Rarity } from '@/content/affixes'

interface GearIconProps {
  slot: GearSlot
  glyph: string
  rarity: Rarity
  gearId?: string
}

export function GearIcon({ slot, glyph, rarity, gearId }: GearIconProps) {
  const isFlyingSword = gearId === 'phi-kiem-tu-vi'
  const isBambooArmor = gearId === 'huyen-quy-giap'
  const isBambooBasket = gearId === 'ngung-than-phu'
  const isHairpin = gearId === 'bang-tam-chau'
  const isYinGuanRobe = gearId === 'thien-ma-giap'
  const isWoodSword = gearId === 'thiet-kiem'

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
        {slot === 'kiem' && (
          <>
            {/* Thân kiếm dài */}
            <path d="M10 38 L36 12 M34 10 L38 14 M36 12 L40 8 L38 6 L34 10 M8 40 L12 36" strokeWidth="2" strokeLinecap="round" />
            {isFlyingSword && (
              /* Vòng lồng chim Lung Trung Tước bao bọc phi kiếm */
              <g stroke="#e0bf4a" strokeWidth="1.2" opacity="0.8">
                <circle cx="24" cy="24" r="16" strokeDasharray="3 3" />
                <path d="M16 12 Q24 6 32 12 M16 36 Q24 42 32 36" />
              </g>
            )}
            {isWoodSword && (
              /* Vân gỗ Hòe Mộc Kiếm */
              <path d="M22 26 Q25 24 28 27" strokeWidth="1" strokeDasharray="2 1" opacity="0.6" />
            )}
          </>
        )}

        {slot === 'giap' && (
          <>
            {/* Chiếc giáp bảo hộ hoặc chiến bào */}
            <path d="M16 10 L24 6 L32 10 L36 18 L32 40 L16 40 L12 18 Z" strokeWidth="1.8" />
            {isBambooArmor && (
              /* Nan tre đan áo Trúc Y */
              <path d="M24 10 V38 M18 20 H30 M18 30 H30" strokeWidth="1" strokeDasharray="2 2" />
            )}
            {isYinGuanRobe && (
              /* Vạt đại bào phơ phất */
              <path d="M12 28 Q8 38 14 42 M36 28 Q40 38 34 42" strokeWidth="1.5" />
            )}
          </>
        )}

        {slot === 'phap-khi' && (
          <>
            {isHairpin ? (
              /* Chiếc Trâm Bích Ngọc cài tóc thanh tú */
              <g stroke="#5aa391" strokeWidth="1.8">
                <path d="M10 38 L34 14" />
                <circle cx="37" cy="11" r="4" fill="currentColor" opacity="0.5" />
                <path d="M37 7 Q41 11 37 15" strokeWidth="1" />
              </g>
            ) : isBambooBasket ? (
              /* Gùi Trúc & Giày Cỏ ngõ Nê Bình */
              <g stroke="#bfae88" strokeWidth="1.5">
                <rect x="14" y="14" width="20" height="22" rx="3" strokeDasharray="3 2" />
                <path d="M20 14 V36 M28 14 V36" strokeWidth="1" />
              </g>
            ) : (
              /* Thái cực đồ / Pháp bảo linh châu */
              <>
                <circle cx="24" cy="24" r="14" strokeWidth="1.8" />
                <path d="M24 10 A7 7 0 0 1 24 24 A7 7 0 0 0 24 38" strokeWidth="1.5" />
                <circle cx="24" cy="17" r="2" fill="currentColor" />
                <circle cx="24" cy="31" r="2" fill="currentColor" />
              </>
            )}
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
