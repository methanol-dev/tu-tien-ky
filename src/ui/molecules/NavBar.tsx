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
  { id: 'journey', label: 'Hành tẩu' },
  { id: 'inventory', label: 'Túi đồ' },
  { id: 'forge', label: 'Luyện khí' },
  { id: 'alchemy', label: 'Luyện đan' },
  { id: 'techniques', label: 'Công pháp' },
  { id: 'legacy', label: 'Luân hồi' },
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

    if (isMobile) {
      return (
        <li key={t.id} className="relative flex-1">
          <button
            type="button"
            onClick={handleClick}
            aria-current={active ? 'page' : undefined}
            className={`flex w-full min-h-14 flex-col items-center justify-center gap-1 px-1 transition-colors ${
              active
                ? 'text-gold-400 font-bold'
                : isLocked
                  ? 'text-paper-500 opacity-60 hover:opacity-100 hover:text-paper-300'
                  : 'text-paper-400 hover:text-paper-100'
            }`}
          >
            {TabIcon && (
              <TabIcon
                className={`h-5 w-5 shrink-0 transition-transform active:scale-90 ${
                  active ? 'stroke-[2] drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'stroke-[1.6]'
                }`}
                aria-hidden
              />
            )}
            <span className="text-[11px] leading-tight font-serif font-medium flex items-center gap-0.5 whitespace-nowrap">
              {t.label}
              {isLocked && <span className="text-[9px] text-paper-500">🔒</span>}
            </span>
            {hasAlert && (
              <span
                aria-label="Sẵn sàng"
                className="absolute top-2 right-3 h-2 w-2 animate-pulse rounded-full bg-vermilion-500 ring-1 ring-ink-900"
              />
            )}
          </button>
        </li>
      )
    }

    // Render Tab trên Desktop: Dải Sub-Nav Strip thanh mảnh, tao nhã, phong vị thủy mặc
    return (
      <li key={t.id} className="relative shrink-0">
        <button
          type="button"
          onClick={handleClick}
          aria-current={active ? 'page' : undefined}
          className={`group flex items-center gap-2 px-3.5 pb-2.5 pt-1.5 text-sm font-serif transition-all border-b-2 -mb-[1px] cursor-pointer ${
            active
              ? 'border-gold-400 text-gold-300 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
              : isLocked
                ? 'border-transparent text-paper-500/60 hover:text-paper-400'
                : 'border-transparent text-paper-400 hover:text-paper-100 hover:border-paper-400/40'
          }`}
        >
          {TabIcon && (
            <TabIcon
              className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                active ? 'stroke-[2] text-gold-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'stroke-[1.6]'
              }`}
              aria-hidden
            />
          )}
          <span className="flex items-center gap-1 whitespace-nowrap">
            {t.label}
            {isLocked && <span className="text-[10px] text-paper-500">🔒</span>}
          </span>
          {hasAlert && (
            <span
              aria-label="Sẵn sàng"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-vermilion-500"
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

      {/* Tabs thanh lịch trải rộng trên Desktop - Dải Sub-Nav Strip Thủy Mặc */}
      <ul className="mx-auto hidden w-full max-w-5xl items-center justify-center gap-4 sm:gap-6 border-b border-paper-400/15 md:flex">
        {DESKTOP_TABS.map((t) => renderTabItem(t, false))}
      </ul>
    </nav>
  )
}
