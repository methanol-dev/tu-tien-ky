import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    'bg-vermilion-500 text-paper-100 hover:bg-vermilion-400 active:scale-[0.98] disabled:bg-ink-700 disabled:text-paper-400/50 shadow-ink',
  secondary:
    'bg-ink-700 text-paper-100 hover:bg-ink-600 active:scale-[0.98] disabled:opacity-50 border border-paper-400/20',
  ghost: 'bg-transparent text-paper-300 hover:bg-ink-800 hover:text-paper-100 active:scale-[0.98]',
  danger: 'bg-transparent text-vermilion-400 border border-vermilion-500/50 hover:bg-vermilion-500/10',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'secondary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-4 py-2 font-han text-base tracking-wide transition-all duration-150 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
