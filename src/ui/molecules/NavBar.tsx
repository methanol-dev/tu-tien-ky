import { getFeatureUnlockRequirement, isFeatureUnlocked, type FeatureId } from '@/engine'
import type { GameState } from '@/engine/types'
import type { Screen } from '@/store/gameStore'
import { SCREEN_ICONS } from '@/ui/atoms/icons'

const TAB_FEATURE_MAP: Partial<Record<Screen, FeatureId>> = {
  techniques: 'techniques',
  forge: 'forge',
  alchemy: 'alchemy',
  legacy: 'legacy',
  hub: 'alchemy',
}

/** 5 Tabs chuẩn Mobile Ergonomics cho ngón cái một tay */
const MOBILE_TABS: { id: Screen; label: string }[] = [
  { id: 'cultivate', label: 'Động phủ' },
  { id: 'forge', label: 'Luyện khí' },
  { id: 'journey', label: 'Hành tẩu' },
  { id: 'inventory', label: 'Túi đồ' },
  { id: 'hub', label: 'Bách nghệ' },
]

/** Tabs chi tiết trên màn hình rộng Desktop */
const DESKTOP_TABS: { id: Screen; label: string }[] = [
  { id: 'cultivate', label: 'Động phủ' },
  { id: 'techniques', label: 'Công pháp' },
  { id: 'inventory', label: 'Túi đồ' },
  { id: 'forge', label: 'Luyện khí' },
  { id: 'alchemy', label: 'Luyện đan' },
  { id: 'journey', label: 'Hành tẩu' },
  { id: 'legacy', label: 'Luân hồi' },
  { id: 'settings', label: 'Cài đặt' },
]

interface NavBarProps {
  current: Screen
  onChange: (s: Screen) => void
  state?: GameState
  onNotifyLocked?: (msg: string) => void
  alchemyReady?: boolean
  forgeAlert?: boolean
  journeyAlert?: boolean
  legacyAlert?: boolean
}

export function NavBar({
  current,
  onChange,
  state,
  onNotifyLocked,
  alchemyReady,
  forgeAlert,
  journeyAlert,
  legacyAlert,
}: NavBarProps) {
  // Kiểm tra xem screen hiện tại có thuộc nhóm Bách Nghệ trên mobile không
  const isHubActive = current === 'hub' || current === 'alchemy' || current === 'techniques' || current === 'legacy'

  const renderTabItem = (t: { id: Screen; label: string }, isMobile: boolean) => {
    const isThisTabHub = t.id === 'hub'
    const active = isMobile && isThisTabHub ? isHubActive : t.id === current
    const TabIcon = SCREEN_ICONS[t.id]
    const featureId = TAB_FEATURE_MAP[t.id]
    const isLocked = state && featureId ? !isFeatureUnlocked(state, featureId) : false

    const hasAlert =
      !isLocked &&
      ((t.id === 'alchemy' && alchemyReady) ||
        (t.id === 'forge' && forgeAlert) ||
        (t.id === 'journey' && journeyAlert) ||
        (t.id === 'legacy' && legacyAlert) ||
        (isThisTabHub && (alchemyReady || legacyAlert)))

    const handleClick = () => {
      if (isLocked) {
        const req = featureId ? getFeatureUnlockRequirement(featureId) : ''
        onNotifyLocked?.(`🔒 Tính năng ${t.label} chưa mở khóa: ${req}`)
        return
      }
      onChange(t.id)
    }

    return (
      <li key={t.id} className="relative flex-1 md:flex-initial">
        <button
          type="button"
          onClick={handleClick}
          aria-current={active ? 'page' : undefined}
          className={`flex w-full min-h-14 md:min-h-11 flex-col items-center justify-center gap-1 px-1 transition-colors md:w-auto md:flex-row md:gap-2 md:rounded-md md:px-3 ${
            active
              ? 'text-gold-400 font-bold md:bg-ink-700'
              : isLocked
                ? 'text-paper-500 opacity-60 hover:opacity-100 hover:text-paper-300'
                : 'text-paper-400 hover:text-paper-100'
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
          <span className="text-[11px] leading-tight md:text-sm font-serif font-medium flex items-center gap-0.5">
            {t.label}
            {isLocked && <span className="text-[9px] text-paper-500">🔒</span>}
          </span>
          {hasAlert && (
            <span
              aria-label="Sẵn sàng"
              className="absolute top-2 right-3 h-2 w-2 animate-pulse rounded-full bg-vermilion-500 ring-1 ring-ink-900 md:top-1 md:right-1 md:h-1.5 md:w-1.5 md:bg-gold-400"
            />
          )}
        </button>
      </li>
    )
  }

  return (
    <nav
      aria-label="Điều hướng"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-400/10 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none"
    >
      {/* 5 Tabs to rõ trên Mobile */}
      <ul className="mx-auto flex w-full max-w-5xl items-center justify-around md:hidden">
        {MOBILE_TABS.map((t) => renderTabItem(t, true))}
      </ul>

      {/* Tabs đầy đủ trên Desktop */}
      <ul className="mx-auto hidden w-full max-w-5xl items-center justify-end gap-1 md:flex">
        {DESKTOP_TABS.map((t) => renderTabItem(t, false))}
      </ul>
    </nav>
  )
}
