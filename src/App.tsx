import { useEffect } from 'react'
import { getPendingEvent, getPendingStoryScene, isAlchemyReady, isReincarnationForced } from '@/engine'
import { formatNumber } from '@/lib/format'
import { startGameLoop } from '@/store/gameLoop'
import { useGameStore } from '@/store/gameStore'
import { InkSplash } from '@/ui/atoms/InkSplash'
import { NavBar } from '@/ui/molecules/NavBar'
import { Toast } from '@/ui/molecules/Toast'
import { CharacterModal } from '@/ui/organisms/CharacterModal'
import { EventModal } from '@/ui/organisms/EventModal'
import { StoryModal } from '@/ui/organisms/StoryModal'
import { ChestModal } from '@/ui/organisms/ChestModal'
import { TribulationModal } from '@/ui/organisms/TribulationModal'
import { OfflineModal } from '@/ui/organisms/OfflineModal'
import { AlchemyScreen } from '@/ui/screens/AlchemyScreen'
import { GameScreen } from '@/ui/screens/GameScreen'
import { InventoryScreen } from '@/ui/screens/InventoryScreen'
import { JourneyScreen } from '@/ui/screens/JourneyScreen'
import { LegacyScreen } from '@/ui/screens/LegacyScreen'
import { SettingsScreen } from '@/ui/screens/SettingsScreen'
import { TechniquesScreen } from '@/ui/screens/TechniquesScreen'

const SCREENS = {
  cultivate: GameScreen,
  techniques: TechniquesScreen,
  inventory: InventoryScreen,
  alchemy: AlchemyScreen,
  journey: JourneyScreen,
  legacy: LegacyScreen,
  settings: SettingsScreen,
} as const

export default function App() {
  const hydrated = useGameStore((s) => s.hydrated)
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)
  const stones = useGameStore((s) => s.state.stones)
  const alchemyReady = useGameStore((s) => isAlchemyReady(s.state))
  const journeyAlert = useGameStore((s) => s.state.journey.chests.red > 0 || s.state.journey.chests.normal >= 10)
  const legacyAlert = useGameStore((s) => isReincarnationForced(s.state))
  const tribulationResult = useGameStore((s) => s.tribulationResult)
  const resolveBolt = useGameStore((s) => s.resolveBolt)
  const dismissTribulationResult = useGameStore((s) => s.dismissTribulationResult)
  const chestResult = useGameStore((s) => s.chestResult)
  const dismissChestResult = useGameStore((s) => s.dismissChestResult)
  const openChests = useGameStore((s) => s.openChests)
  const equip = useGameStore((s) => s.equip)
  const salvage = useGameStore((s) => s.salvage)
  const offlineReport = useGameStore((s) => s.offlineReport)
  const dismissOffline = useGameStore((s) => s.dismissOffline)
  const notice = useGameStore((s) => s.notice)
  const fx = useGameStore((s) => s.fx)
  const dismissNotice = useGameStore((s) => s.dismissNotice)
  const state = useGameStore((s) => s.state)
  const characterModalOpen = useGameStore((s) => s.characterModalOpen)
  const setCharacterModalOpen = useGameStore((s) => s.setCharacterModalOpen)
  const pendingEvent = useGameStore((s) => getPendingEvent(s.state))
  const pendingStory = getPendingStoryScene(state)
  const resolveStoryScene = useGameStore((s) => s.resolveStoryScene)
  const eventResult = useGameStore((s) => s.eventResult)
  const resolveEvent = useGameStore((s) => s.resolveEvent)
  const dismissEventResult = useGameStore((s) => s.dismissEventResult)

  useEffect(() => {
    useGameStore.getState().hydrate()
    return startGameLoop(useGameStore)
  }, [])

  if (!hydrated) {
    return (
      <main className="flex min-h-dvh items-center justify-center font-han text-2xl text-paper-400">
        Đang ngưng thần...
      </main>
    )
  }

  const Screen = SCREENS[screen]

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-4 pt-6 pb-24 md:pb-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-han text-3xl font-black tracking-widest text-paper-100">劍來</h1>
          <span className="hidden font-han text-sm text-gold-400 sm:inline">Kiếm Lai · Tu Tiên Ký</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCharacterModalOpen(true)}
            className="flex min-h-8 items-center gap-1.5 rounded-md border border-gold-500/30 bg-ink-800/80 px-2.5 py-1 text-xs text-paper-200 transition-colors hover:border-gold-500 hover:text-gold-400"
            title="Xem chỉ số nhân vật (Đạo thân)"
          >
            <span aria-hidden className="font-han text-sm text-gold-400">身</span>
            <span>Chỉ số</span>
          </button>
          <p className="font-han text-sm text-paper-300 tabular-nums" title="Linh thạch">
            <span aria-hidden className="mr-1 text-gold-400">◆</span>
            {formatNumber(stones)}
          </p>
          <div className="hidden md:block">
            <NavBar current={screen} onChange={setScreen} alchemyReady={alchemyReady} journeyAlert={journeyAlert} legacyAlert={legacyAlert} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Screen />
      </main>

      <div className="md:hidden">
        <NavBar current={screen} onChange={setScreen} alchemyReady={alchemyReady} journeyAlert={journeyAlert} legacyAlert={legacyAlert} />
      </div>

      <OfflineModal report={offlineReport} onClose={dismissOffline} />
      <CharacterModal
        open={characterModalOpen}
        onClose={() => setCharacterModalOpen(false)}
        state={state}
      />
      <ChestModal
        result={chestResult}
        state={state}
        onEquip={equip}
        onSalvage={(uid) => salvage([uid])}
        onOpenMore={() => {
          if (state.journey.chests.red > 0) openChests('red', state.journey.chests.red)
          else openChests('normal', Math.min(10, state.journey.chests.normal))
        }}
        onClose={dismissChestResult}
      />
      <TribulationModal state={state} result={tribulationResult} onAct={resolveBolt} onDismissResult={dismissTribulationResult} />
      {!offlineReport && !chestResult && (
        <EventModal
          event={pendingEvent}
          result={eventResult}
          state={state}
          onChoose={resolveEvent}
          onDismissResult={dismissEventResult}
        />
      )}
      {!offlineReport && !chestResult && !pendingEvent && (
        <StoryModal
          scene={pendingStory}
          onResolve={(choiceId) => {
            if (pendingStory) resolveStoryScene(pendingStory.id, choiceId)
          }}
        />
      )}
      <Toast notice={notice} onDismiss={dismissNotice} />
      <InkSplash fx={fx} />
    </div>
  )
}
