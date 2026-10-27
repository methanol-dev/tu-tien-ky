interface Stat {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'warn'
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-md border border-paper-400/10 bg-ink-800/60 px-3 py-2"
          title={s.hint}
        >
          <dt className="text-xs text-paper-400">{s.label}</dt>
          <dd
            className={`font-han text-lg tabular-nums ${s.tone === 'warn' ? 'text-vermilion-400' : 'text-paper-100'}`}
          >
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
