import type { Screen } from '@/store/gameStore'
import { SCREEN_ICONS } from '@/ui/atoms/icons'

const TABS: { id: Screen; label: string }[] = [
  { id: 'cultivate', label: 'Động phủ' },
  { id: 'techniques', label: 'Công pháp' },
  { id: 'inventory', label: 'Túi đồ' },
  { id: 'alchemy', label: 'Luyện đan' },
  { id: 'journey', label: 'Hành tẩu' },
  { id: 'legacy', label: 'Luân hồi' },
  { id: 'settings', label: 'Cài đặt' },
]

interface NavBarProps {
  current: Screen
  onChange: (s: Screen) => void
  alchemyReady?: boolean
  journeyAlert?: boolean
  legacyAlert?: boolean
}

export function NavBar({ current, onChange, alchemyReady, journeyAlert, legacyAlert }: NavBarProps) {
  return (
    <nav
      aria-label="Điều hướng"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-400/10 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none"
    >
      <ul className="mx-auto flex w-full max-w-5xl items-center justify-between md:justify-end md:gap-1">
        {TABS.map((t) => {
          const active = t.id === current
          const TabIcon = SCREEN_ICONS[t.id]
          return (
            <li key={t.id} className="relative flex-1 md:flex-initial">
              <button
                type="button"
                onClick={() => onChange(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full min-h-13 flex-col items-center justify-center gap-1 px-0.5 transition-colors md:min-h-11 md:w-auto md:flex-row md:gap-2 md:rounded-md md:px-3 ${
                  active ? 'text-gold-400 md:bg-ink-700' : 'text-paper-400 hover:text-paper-100'
                }`}
              >
                {TabIcon && (
                  <TabIcon
                    className={`h-5 w-5 shrink-0 transition-transform active:scale-90 md:h-4 md:w-4 ${
                      active ? 'stroke-[2] drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'stroke-[1.6]'
                    }`}
                    aria-hidden
                  />
                )}
                <span className="text-[10px] leading-tight md:text-sm font-serif font-medium">{t.label}</span>
                {((t.id === 'alchemy' && alchemyReady) || (t.id === 'journey' && journeyAlert) || (t.id === 'legacy' && legacyAlert)) && (
                  <span
                    aria-label="Sẵn sàng"
                    className="absolute top-1.5 right-2 h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400 md:top-1 md:right-1"
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
