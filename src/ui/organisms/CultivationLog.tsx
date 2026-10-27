import { useEffect, useRef } from 'react'
import type { LogEntry, LogKind } from '@/engine'

const KIND_CLASS: Record<LogKind, string> = {
  info: 'text-paper-300',
  success: 'text-gold-400',
  danger: 'text-vermilion-400',
  event: 'text-jade-400',
}

export function CultivationLog({ entries }: { entries: LogEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null)
  const lastId = entries.at(-1)?.id

  // Keep the newest entry in view without scrolling the whole page.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lastId])

  return (
    <section
      aria-label="Nhật ký tu luyện"
      className="flex h-72 flex-col rounded-lg border border-paper-400/10 bg-ink-950/60 md:h-full md:min-h-96"
    >
      <h3 className="border-b border-paper-400/10 px-4 py-2 font-han text-sm tracking-widest text-paper-400">
        Nhật ký tu luyện
      </h3>
      <ol ref={listRef} className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3 text-sm leading-relaxed">
        {entries.map((e) => (
          <li key={e.id} className={KIND_CLASS[e.kind]}>
            <span className="mr-2 text-xs text-paper-400/60 tabular-nums">
              N{e.day.toLocaleString('vi-VN')}
            </span>
            {e.text}
          </li>
        ))}
      </ol>
    </section>
  )
}
