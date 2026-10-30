import type { LogEntry } from '@/engine/types'

interface MiniTickerProps {
  entries: LogEntry[]
  onOpenFullHistory: () => void
  className?: string
}

const KIND_COLORS: Record<string, string> = {
  info: 'text-paper-300',
  success: 'text-jade-400',
  danger: 'text-vermilion-400',
  event: 'text-gold-400',
}

const KIND_ICONS: Record<string, string> = {
  info: '✦',
  success: '✨',
  danger: '⚠️',
  event: '📜',
}

export function MiniTicker({ entries, onOpenFullHistory, className = '' }: MiniTickerProps) {
  const latest = entries.length > 0 ? entries[entries.length - 1] : null

  return (
    <div
      onClick={onOpenFullHistory}
      role="button"
      tabIndex={0}
      className={`group relative flex items-center justify-between gap-2 rounded-lg border border-paper-400/15 bg-ink-900/80 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs backdrop-blur transition-all hover:border-gold-500/30 active:scale-[0.99] cursor-pointer min-w-0 w-full ${className}`}
      title="Bấm để xem toàn bộ Nhật ký tu luyện"
    >
      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
        <span className="font-han text-paper-400 font-bold shrink-0 flex items-center gap-1 text-[11px] sm:text-xs">
          <span>📜</span>
          <span className="hidden sm:inline">Nhật ký tu luyện:</span>
          <span className="sm:hidden">Nhật ký</span>
        </span>

        {latest ? (
          <div className="flex items-center gap-1.5 overflow-hidden text-[11px] sm:text-xs min-w-0 flex-1">
            <span className="text-gold-400/80 font-mono text-[10px] shrink-0">
              [Ngày {latest.day}]
            </span>
            <span className={`${KIND_COLORS[latest.kind] ?? 'text-paper-300'} truncate min-w-0 block`}>
              <span className="mr-1">{KIND_ICONS[latest.kind] ?? '✦'}</span>
              {latest.text}
            </span>
          </div>
        ) : (
          <span className="text-paper-500 italic text-[11px] truncate">Gió thoảng mây trôi, tâm cảnh tĩnh lặng...</span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0 text-[11px] text-gold-400/80 group-hover:text-gold-300 font-serif">
        <span className="hidden sm:inline">Lịch sử</span>
        <span>›</span>
      </div>
    </div>
  )
}

