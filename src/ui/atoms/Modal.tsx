import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  maxWidth?: string
}

export function Modal({ open, title, onClose, children, footer, maxWidth = 'max-w-md' }: ModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} max-h-[90dvh] flex flex-col rounded-lg border border-gold-500/30 bg-ink-800 p-6 shadow-ink animate-rise`}
      >
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h2 id="modal-title" className="font-han text-2xl text-gold-400">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded px-2 py-1 text-sm text-paper-400 hover:text-paper-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 text-paper-200 pr-1">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3 shrink-0">{footer}</div>}
      </div>
    </div>
  )
}
