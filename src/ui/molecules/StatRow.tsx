interface Stat {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'warn'
}

export function StatRow({ stats }: { stats: Stat[] }) {
  const isFive = stats.length === 5

  return (
    <dl className={`grid gap-2 sm:gap-3 ${isFive ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'}`}>
      {stats.map((s, idx) => (
        <div
          key={s.label}
          className={`rounded-md border border-paper-400/10 bg-ink-800/60 px-2.5 py-1.5 sm:px-3 sm:py-2 ${
            isFive && idx === 4 ? 'col-span-2 sm:col-span-1' : ''
          }`}
          title={s.hint}
        >
          <dt className="text-[10px] sm:text-xs text-paper-400">{s.label}</dt>
          <dd
            className={`font-han text-base sm:text-lg tabular-nums ${s.tone === 'warn' ? 'text-vermilion-400' : 'text-paper-100'}`}
          >
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
