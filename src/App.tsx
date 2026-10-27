import { useEffect } from 'react'
import { startGameLoop } from '@/store/gameLoop'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { OfflineModal } from '@/ui/organisms/OfflineModal'
import { GameScreen } from '@/ui/screens/GameScreen'
import { SettingsScreen } from '@/ui/screens/SettingsScreen'

export default function App() {
  const hydrated = useGameStore((s) => s.hydrated)
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)
  const offlineReport = useGameStore((s) => s.offlineReport)
  const dismissOffline = useGameStore((s) => s.dismissOffline)

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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-han text-3xl font-black tracking-widest text-paper-100">修仙記</h1>
          <span className="hidden font-han text-sm text-gold-400 sm:inline">Tu Tiên Ký</span>
        </div>
        <nav className="flex gap-1" aria-label="Điều hướng">
          <Button
            variant={screen === 'cultivate' ? 'secondary' : 'ghost'}
            onClick={() => setScreen('cultivate')}
            aria-current={screen === 'cultivate' ? 'page' : undefined}
          >
            Động phủ
          </Button>
          <Button
            variant={screen === 'settings' ? 'secondary' : 'ghost'}
            onClick={() => setScreen('settings')}
            aria-current={screen === 'settings' ? 'page' : undefined}
          >
            Cài đặt
          </Button>
        </nav>
      </header>

      <main className="flex-1">{screen === 'cultivate' ? <GameScreen /> : <SettingsScreen />}</main>

      <OfflineModal report={offlineReport} onClose={dismissOffline} />
    </div>
  )
}
