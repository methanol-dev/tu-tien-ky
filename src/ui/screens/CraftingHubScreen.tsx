import { useState } from 'react'
import { isAlchemyReady, isReincarnationForced } from '@/engine'
import { useGameStore } from '@/store/gameStore'
import { AlchemyScreen } from './AlchemyScreen'
import { LegacyScreen } from './LegacyScreen'
import { TechniquesScreen } from './TechniquesScreen'

export type HubTab = 'alchemy' | 'techniques' | 'legacy'

interface CraftingHubScreenProps {
  initialTab?: HubTab
}

export function CraftingHubScreen({ initialTab = 'alchemy' }: CraftingHubScreenProps) {
  const [activeTab, setActiveTab] = useState<HubTab>(initialTab)
  const state = useGameStore((s) => s.state)

  const alchemyAlert = isAlchemyReady(state)
  const legacyAlert = isReincarnationForced(state)

  const tabs: { id: HubTab; label: string; icon: string; badge?: boolean }[] = [
    { id: 'alchemy', label: 'Luyện đan', icon: '🏺', badge: alchemyAlert },
    { id: 'techniques', label: 'Công pháp', icon: '📜' },
    { id: 'legacy', label: 'Luân hồi', icon: '🔄', badge: legacyAlert },
  ]

  return (
    <div className="space-y-4">
      {/* Segmented Control cho Bách Nghệ */}
      <div className="flex items-center justify-center border-b border-paper-400/15 pb-2">
        <div className="flex w-full max-w-md items-center justify-around rounded-lg bg-ink-800/80 p-1 border border-paper-400/10 backdrop-blur">
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`relative flex flex-1 items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-serif font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-ink-700 text-gold-400 shadow-sm border border-gold-500/30'
                    : 'text-paper-400 hover:text-paper-200'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {t.badge && (
                  <span className="h-1.5 w-1.5 rounded-full bg-vermilion-500 animate-pulse ring-1 ring-ink-900" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Nội dung sub-screen tương ứng */}
      <div>
        {activeTab === 'alchemy' && <AlchemyScreen />}
        {activeTab === 'techniques' && <TechniquesScreen />}
        {activeTab === 'legacy' && <LegacyScreen />}
      </div>
    </div>
  )
}

