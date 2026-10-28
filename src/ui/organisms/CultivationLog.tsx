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
      className="flex h-80 flex-col overflow-hidden rounded-lg border border-paper-400/10 bg-ink-950/60 shadow-ink md:sticky md:top-6 md:h-[620px] md:max-h-[calc(100vh-6rem)]"
    >
      <div className="flex items-center justify-between border-b border-paper-400/10 px-4 py-2.5">
        <h3 className="font-han text-sm tracking-widest text-paper-300">
          Nhật ký tu luyện
        </h3>
        <span className="font-mono text-[11px] text-paper-400">
          {entries.length} ghi chép
        </span>
      </div>
      <ol
        ref={listRef}
        className="flex-1 min-h-0 space-y-1.5 overflow-y-auto px-4 py-3 text-sm leading-relaxed"
      >
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
