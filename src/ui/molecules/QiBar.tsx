import { formatNumber, formatPercent } from '@/lib/format'

interface QiBarProps {
  qi: number
  required: number
  progress: number
  terminal: boolean
  label?: string
  colorClass?: string
}

export function QiBar({
  qi,
  required,
  progress,
  terminal,
  label = 'Linh khí',
  colorClass,
}: QiBarProps) {
  const pct = Math.round(progress * 1000) / 10
  const barGradient =
    colorClass ??
    'bg-gradient-to-r from-qi-500/70 via-qi-400 to-paper-100'

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between font-han text-sm text-paper-300">
        <span>{label}</span>
        <span className="tabular-nums">
          {formatNumber(qi)}
          {!terminal && <span className="text-paper-400"> / {formatNumber(required)}</span>}
        </span>
      </div>
      <div
        className="relative h-4 overflow-hidden rounded-full border border-gold-500/30 bg-ink-950"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Tiến độ ${label.toLowerCase()}`}
      >
        <div
          className={`h-full rounded-full ${barGradient} transition-[width] duration-300 ease-out`}
          style={{ width: `${pct}%` }}
        />
        <div className="qi-shimmer pointer-events-none absolute inset-0" />
      </div>
      <div className="text-right text-xs text-paper-400 tabular-nums">
        {terminal ? 'Đã đạt đỉnh đại đạo' : formatPercent(progress)}
      </div>
    </div>
  )
}
