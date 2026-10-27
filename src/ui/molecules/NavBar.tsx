import type { Screen } from '@/store/gameStore'

const TABS: { id: Screen; label: string; glyph: string }[] = [
  { id: 'cultivate', label: 'Động phủ', glyph: '洞' },
  { id: 'techniques', label: 'Công pháp', glyph: '法' },
  { id: 'inventory', label: 'Túi đồ', glyph: '囊' },
  { id: 'alchemy', label: 'Luyện đan', glyph: '丹' },
  { id: 'expedition', label: 'Bí cảnh', glyph: '境' },
  { id: 'settings', label: 'Cài đặt', glyph: '設' },
]

interface NavBarProps {
  current: Screen
  onChange: (s: Screen) => void
  alchemyReady?: boolean
  expeditionReady?: boolean
}

export function NavBar({ current, onChange, alchemyReady, expeditionReady }: NavBarProps) {
  return (
    <nav
      aria-label="Điều hướng"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-400/10 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none"
    >
      <ul className="mx-auto flex max-w-5xl justify-around md:justify-end md:gap-1">
        {TABS.map((t) => {
          const active = t.id === current
          return (
            <li key={t.id} className="relative">
              <button
                type="button"
                onClick={() => onChange(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-14 min-w-12 flex-col items-center justify-center gap-0.5 px-2 transition-colors md:min-h-11 md:flex-row md:gap-2 md:rounded-md md:px-3 ${
                  active ? 'text-gold-400 md:bg-ink-700' : 'text-paper-400 hover:text-paper-100'
                }`}
              >
                <span aria-hidden className="font-han text-xl leading-none md:text-base">
                  {t.glyph}
                </span>
                <span className="text-[11px] md:text-sm">{t.label}</span>
                {((t.id === 'alchemy' && alchemyReady) || (t.id === 'expedition' && expeditionReady)) && (
                  <span
                    aria-label="Sẵn sàng"
                    className="absolute top-2 right-3 h-2 w-2 animate-pulse rounded-full bg-gold-400 md:top-1 md:right-1"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
