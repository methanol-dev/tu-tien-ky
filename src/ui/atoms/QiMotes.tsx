import type { CSSProperties } from 'react'

interface QiMotesProps {
  /** 0..1 progress towards breakthrough; more motes as you get closer. */
  progress: number
}

const MOTES = [
  { r: 42, t: 9, d: 0 },
  { r: 48, t: 13, d: -4 },
  { r: 38, t: 7, d: -2 },
  { r: 52, t: 17, d: -9 },
  { r: 45, t: 11, d: -6 },
  { r: 56, t: 21, d: -12 },
]

/** Decorative motes orbiting the centre of the parent (parent must be position: relative). */
export function QiMotes({ progress }: QiMotesProps) {
  const count = Math.max(1, Math.round(1 + progress * (MOTES.length - 1)))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {MOTES.slice(0, count).map((m, i) => (
        <span
          key={i}
          className="qi-mote"
          style={{ '--orbit-r': `${m.r}%`, '--orbit-t': `${m.t}s`, '--orbit-d': `${m.d}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}
