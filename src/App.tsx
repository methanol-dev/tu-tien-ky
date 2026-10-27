import { useEffect } from 'react'
import { isAlchemyReady } from '@/engine'
import { formatNumber } from '@/lib/format'
import { startGameLoop } from '@/store/gameLoop'
import { useGameStore } from '@/store/gameStore'
import { NavBar } from '@/ui/molecules/NavBar'
import { Toast } from '@/ui/molecules/Toast'
import { OfflineModal } from '@/ui/organisms/OfflineModal'
import { AlchemyScreen } from '@/ui/screens/AlchemyScreen'
import { GameScreen } from '@/ui/screens/GameScreen'
import { InventoryScreen } from '@/ui/screens/InventoryScreen'
import { SettingsScreen } from '@/ui/screens/SettingsScreen'
import { TechniquesScreen } from '@/ui/screens/TechniquesScreen'

const SCREENS = {
  cultivate: GameScreen,
  techniques: TechniquesScreen,
  inventory: InventoryScreen,
  alchemy: AlchemyScreen,
  settings: SettingsScreen,
} as const

export default function App() {
  const hydrated = useGameStore((s) => s.hydrated)
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)
  const stones = useGameStore((s) => s.state.stones)
  const alchemyReady = useGameStore((s) => isAlchemyReady(s.state))
  const offlineReport = useGameStore((s) => s.offlineReport)
  const dismissOffline = useGameStore((s) => s.dismissOffline)
  const notice = useGameStore((s) => s.notice)
  const dismissNotice = useGameStore((s) => s.dismissNotice)

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
          <h1 className="font-han text-3xl font-black tracking-widest text-paper-100">修仙記</h1>
          <span className="hidden font-han text-sm text-gold-400 sm:inline">Tu Tiên Ký</span>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-han text-sm text-paper-300 tabular-nums" title="Linh thạch">
            <span aria-hidden className="mr-1 text-gold-400">◆</span>
            {formatNumber(stones)}
          </p>
          <div className="hidden md:block">
            <NavBar current={screen} onChange={setScreen} alchemyReady={alchemyReady} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Screen />
      </main>

      <div className="md:hidden">
        <NavBar current={screen} onChange={setScreen} alchemyReady={alchemyReady} />
      </div>

      <OfflineModal report={offlineReport} onClose={dismissOffline} />
      <Toast notice={notice} onDismiss={dismissNotice} />
    </div>
  )
}
