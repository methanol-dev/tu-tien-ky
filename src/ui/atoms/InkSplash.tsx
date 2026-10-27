import type { FxEvent } from '@/store/gameStore'

/** Full-screen ink blot that blooms once per fx event (keyed so it restarts). */
export function InkSplash({ fx }: { fx: FxEvent | null }) {
  if (!fx) return null
  return (
    <div
      key={fx.id}
      aria-hidden
      className={`ink-splash ${fx.kind === 'breakthrough-fail' ? 'ink-splash--fail' : ''}`}
    />
  )
}
