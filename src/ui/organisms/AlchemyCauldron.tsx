import { formatDurationMs } from '@/lib/format'
import { Button } from '@/ui/atoms/Button'
import { ItemIcon } from '@/ui/atoms/ItemIcon'
import { ITEM_BY_ID } from '@/content/items'
import type { RecipeDef } from '@/content/recipes'

interface AlchemyCauldronProps {
  recipe: RecipeDef | null
  progress: number
  ready: boolean
  remainingMs: number
  onCollect: () => void
}

export function AlchemyCauldron({
  recipe,
  progress,
  ready,
  remainingMs,
  onCollect,
}: AlchemyCauldronProps) {
  const isBrewing = recipe !== null && !ready
  const outputItem = recipe ? ITEM_BY_ID[recipe.output] : null

  return (
    <div className="relative overflow-hidden rounded-xl border border-gold-500/25 bg-gradient-to-b from-ink-900/90 via-ink-950/95 to-ink-900/90 p-6 shadow-ink">
      {/* Khí tràng bát quái mờ phía sau */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-han text-[10rem] leading-none text-gold-500/[0.03] select-none"
      >
        鼎
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Hình vẽ Luyện Đan Lô Thủy Mặc */}
        <div className="relative flex h-36 w-36 items-center justify-center">
          {/* Làn khói thơm bốc lên từ nắp lò khi đang luyện hoặc đan thành */}
          {(isBrewing || ready) && (
            <div className="pointer-events-none absolute -top-4 inset-x-0 flex justify-center opacity-80 animate-pulse">
              <svg viewBox="0 0 60 40" className="h-10 w-16 fill-none stroke-paper-300/40" strokeWidth="1.5">
                <path d="M20 30 Q15 15 25 5 Q35 0 28 -10" strokeDasharray="3 3" />
                <path d="M30 32 Q40 18 32 8 Q24 0 35 -10" strokeDasharray="4 2" />
                <path d="M40 30 Q48 16 38 6" strokeDasharray="2 2" />
              </svg>
            </div>
          )}

          {/* Vầng hào quang khi Đan Thành (ready) */}
          {ready && (
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gold-400/20 blur-xl animate-pulse" />
          )}

          {/* Lò luyện đan SVG chi tiết */}
          <svg
            viewBox="0 0 100 100"
            className={`h-full w-full drop-shadow-md transition-transform duration-500 ${ready ? 'scale-105 animate-bounce' : ''}`}
            fill="none"
          >
            {/* Chân đỉnh vạc 3 chân vững chãi */}
            <path d="M30 76 L22 96 L28 98 L36 78 Z" fill="#2d2926" stroke="#bfae88" strokeWidth="1.5" />
            <path d="M70 76 L78 96 L72 98 L64 78 Z" fill="#2d2926" stroke="#bfae88" strokeWidth="1.5" />
            <path d="M47 78 L47 98 L53 98 L53 78 Z" fill="#201c19" stroke="#bfae88" strokeWidth="1.5" />

            {/* Thân Đan Lô (vạc đồng cổ hoặc gốm Long Diêu) */}
            <path
              d="M24 40 Q14 58 26 76 H74 Q86 58 76 40 Z"
              fill={isBrewing ? 'url(#cauldron-body-hot)' : '#1a1817'}
              stroke="#bfae88"
              strokeWidth="2"
            />

            {/* Tai vạc hai bên */}
            <path d="M22 46 Q10 42 12 56 Q14 66 24 64" stroke="#bfae88" strokeWidth="2.5" fill="none" />
            <path d="M78 46 Q90 42 88 56 Q86 66 76 64" stroke="#bfae88" strokeWidth="2.5" fill="none" />

            {/* Nắp Đan Lô có núm hình hồ lô */}
            <path d="M28 40 Q50 30 72 40 Z" fill="#2d2926" stroke="#bfae88" strokeWidth="2" />
            <ellipse cx="50" cy="28" rx="6" ry="4" fill="#bfae88" />
            <circle cx="50" cy="22" r="3" fill="#e0bf4a" />

            {/* Hoa văn Bát Quái đồ án giữa thân lò */}
            <g stroke="#bfae88" strokeWidth="1.2" opacity="0.6">
              <circle cx="50" cy="58" r="10" />
              <path d="M50 48 A5 5 0 0 1 50 58 A5 5 0 0 0 50 68" />
              <circle cx="50" cy="53" r="1" fill="#bfae88" />
              <circle cx="50" cy="63" r="1" fill="#bfae88" />
            </g>

            {/* Ngọn Lửa Tam Muội Chân Hỏa dưới đáy lò khi đang luyện */}
            {isBrewing && (
              <g className="animate-pulse">
                <path d="M36 78 Q42 66 48 76 Q54 64 64 78 Q50 74 36 78 Z" fill="url(#tam-muoi-hoa)" />
                <path d="M42 78 Q48 70 50 78 Q52 70 58 78 Z" fill="#fef08a" />
              </g>
            )}

            <defs>
              <linearGradient id="cauldron-body-hot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a1d17" />
                <stop offset="70%" stopColor="#4a2118" />
                <stop offset="100%" stopColor="#6b2716" />
              </linearGradient>
              <linearGradient id="tam-muoi-hoa" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="60%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Trạng thái Lô Đan */}
        <div className="mt-4 w-full max-w-md">
          {recipe && outputItem ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <ItemIcon id={outputItem.id} kind={outputItem.kind} tier={outputItem.tier} size="sm" />
                <div className="text-left">
                  <h3 className="font-han text-lg font-bold text-gold-400">
                    {recipe.name}
                  </h3>
                  <p className="text-xs text-paper-300">
                    Đan phẩm xuất lô:{' '}
                    <span className="text-paper-100 font-medium">{outputItem.name}</span>
                  </p>
                </div>
              </div>

              {/* Thanh tiến độ ngưng tụ đan khí */}
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-ink-950/80 border border-paper-400/10"
                role="progressbar"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    ready
                      ? 'bg-gold-400 shadow-[0_0_12px_#e0bf4a]'
                      : 'bg-gradient-to-r from-vermilion-500 via-orange-400 to-gold-400'
                  }`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-paper-400 tabular-nums">
                  {ready ? (
                    <span className="text-gold-400 font-bold font-han animate-pulse">
                      ✨ Đan thành viên mãn! Mời đạo hữu thu đan.
                    </span>
                  ) : (
                    `Lửa lò rực cháy · Còn ${formatDurationMs(remainingMs)}`
                  )}
                </span>
                <Button
                  variant="primary"
                  disabled={!ready}
                  onClick={onCollect}
                  className={`min-h-10 px-4 text-sm ${ready ? 'animate-pulse shadow-lg ring-2 ring-gold-400/60' : ''}`}
                >
                  Thu đan
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="font-han text-base text-paper-300">
                Đan Lô Lạc Phách Sơn · Lò Nguội
              </h3>
              <p className="text-xs text-paper-400">
                Lửa lò đang tắt. Hãy chọn một đan phương bên dưới để chuẩn bị dược liệu khai lò luyện đan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
