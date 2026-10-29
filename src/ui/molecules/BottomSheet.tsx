import { useEffect, type ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxHeightClass?: string
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  maxHeightClass = 'max-h-[85vh]',
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Backdrop mờ cổ phong */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet trượt từ đáy màn hình */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-t-2xl md:rounded-xl border-t md:border border-gold-500/30 bg-ink-900/98 p-4 shadow-2xl flex flex-col ${maxHeightClass} pb-[max(1rem,env(safe-area-inset-bottom))]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Thanh gạt ngón tay (Drag Handle) */}
        <div className="mx-auto mb-2.5 h-1.5 w-12 rounded-full bg-paper-400/30 cursor-grab active:bg-gold-400/60" />

        {/* Header của Sheet */}
        <div className="flex items-center justify-between border-b border-paper-400/10 pb-2.5 mb-3">
          <h2 className="font-han text-base sm:text-lg font-bold text-gold-400">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-paper-400 hover:bg-ink-800 hover:text-paper-100 transition-colors"
            aria-label="Đóng"
          >
            <span className="text-sm font-bold">✕</span>
          </button>
        </div>

        {/* Nội dung cuộn bên trong */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm text-paper-200">
          {children}
        </div>
      </div>
    </div>
  )
}
