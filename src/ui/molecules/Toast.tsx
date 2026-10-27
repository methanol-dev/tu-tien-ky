import { useEffect } from 'react'
import type { Notice } from '@/store/gameStore'

const KIND_CLASS: Record<Notice['kind'], string> = {
  info: 'border-paper-400/30 text-paper-100',
  success: 'border-gold-500/50 text-gold-400',
  error: 'border-vermilion-500/50 text-vermilion-400',
}

export function Toast({ notice, onDismiss }: { notice: Notice | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!notice) return
    const t = window.setTimeout(onDismiss, 2600)
    return () => window.clearTimeout(t)
  }, [notice, onDismiss])

  if (!notice) return null
  return (
    <div
      key={notice.id}
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto w-fit max-w-[90vw] rounded-md border bg-ink-800/95 px-4 py-2 text-sm shadow-ink animate-rise ${KIND_CLASS[notice.kind]}`}
    >
      {notice.text}
    </div>
  )
}
