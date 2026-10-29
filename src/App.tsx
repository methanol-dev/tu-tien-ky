import { useEffect, useRef, useState } from 'react'
import { CLASS_BY_ID } from '@/content/classes'
import {
  canClaimGrowthFund,
  checkReliefTrigger,
  getFeatureUnlockRequirement,
  getPendingEvent,
  getPendingStoryScene,
  GROWTH_FUND_MILESTONES,
  isAlchemyReady,
  isFeatureUnlocked,
  isReincarnationForced,
  requestPersistentStorage,
  WEEKLY_MILESTONES,
} from '@/engine'
import { formatNumber } from '@/lib/format'
import { startGameLoop } from '@/store/gameLoop'
import { useGameStore } from '@/store/gameStore'
import { CLASS_ICONS, IconDaoistBody, IconFlyingSword } from '@/ui/atoms/icons'
import { InkSplash } from '@/ui/atoms/InkSplash'
import { NavBar } from '@/ui/molecules/NavBar'
import { Toast } from '@/ui/molecules/Toast'
import { AdminModal } from '@/ui/organisms/AdminModal'
import { BatterySaverOverlay } from '@/ui/organisms/BatterySaverOverlay'
import { CharacterModal } from '@/ui/organisms/CharacterModal'
import { FormationModal } from '@/ui/organisms/FormationModal'
import { NatalSwordModal } from '@/ui/organisms/NatalSwordModal'
import { EventModal } from '@/ui/organisms/EventModal'
import { StoryModal } from '@/ui/organisms/StoryModal'
import { ChestModal } from '@/ui/organisms/ChestModal'
import { TribulationModal } from '@/ui/organisms/TribulationModal'
import { OfflineModal } from '@/ui/organisms/OfflineModal'
import { GrowthFundModal } from '@/ui/organisms/GrowthFundModal'
import { ReliefModal } from '@/ui/organisms/ReliefModal'
import { WeeklyEventModal } from '@/ui/organisms/WeeklyEventModal'
import { AlchemyScreen } from '@/ui/screens/AlchemyScreen'
import { ForgeScreen } from '@/ui/screens/ForgeScreen'
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
  forge: ForgeScreen,
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
  const forgeAlert = useGameStore((s) => s.state.forge.pendingGear !== null || s.state.forge.fireCount >= 20)
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
  const notify = useGameStore((s) => s.notify)
  const fx = useGameStore((s) => s.fx)
  const dismissNotice = useGameStore((s) => s.dismissNotice)
  const state = useGameStore((s) => s.state)
  const characterModalOpen = useGameStore((s) => s.characterModalOpen)
  const setCharacterModalOpen = useGameStore((s) => s.setCharacterModalOpen)
  const formationModalOpen = useGameStore((s) => s.formationModalOpen)
  const setFormationModalOpen = useGameStore((s) => s.setFormationModalOpen)
  const setNatalSwordModalOpen = useGameStore((s) => s.setNatalSwordModalOpen)
  const setGrowthFundModalOpen = useGameStore((s) => s.setGrowthFundModalOpen)
  const setReliefModalOpen = useGameStore((s) => s.setReliefModalOpen)
  const setWeeklyEventModalOpen = useGameStore((s) => s.setWeeklyEventModalOpen)
  const pendingEvent = useGameStore((s) => getPendingEvent(s.state))
  const pendingStory = getPendingStoryScene(state)
  const resolveStoryScene = useGameStore((s) => s.resolveStoryScene)
  const eventResult = useGameStore((s) => s.eventResult)
  const resolveEvent = useGameStore((s) => s.resolveEvent)
  const dismissEventResult = useGameStore((s) => s.dismissEventResult)

  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [secretClicks, setSecretClicks] = useState(0)
  const lastClickTimeRef = useRef<number>(0)

  const handleSecretLogoClick = () => {
    const now = Date.now()
    if (now - lastClickTimeRef.current > 2500) {
      setSecretClicks(1)
    } else {
      const next = secretClicks + 1
      if (next >= 5) {
        setAdminModalOpen(true)
        setSecretClicks(0)
      } else {
        setSecretClicks(next)
      }
    }
    lastClickTimeRef.current = now
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') || e.key === 'F2') {
        e.preventDefault()
        setAdminModalOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // Gắn DevTools API cho Console F12
    ;(window as unknown as { admin: unknown }).admin = {
      open: () => setAdminModalOpen(true),
      close: () => setAdminModalOpen(false),
      addStones: (n: number) => useGameStore.getState().adminAddStones(n),
      addQi: (n: number) => useGameStore.getState().adminAddQi(n),
      setRealm: (idx: number) => useGameStore.getState().adminSetRealm(idx),
      addPunches: (n: number) => useGameStore.getState().adminAddPunches(n),
      addChests: (normal: number, red: number) => useGameStore.getState().adminAddChests(normal, red),
      unlockAllRegions: () => useGameStore.getState().adminUnlockAllRegions(),
      fullGear: () => useGameStore.getState().adminGiveFullGear(),
      setTimeScale: (scale: number) => useGameStore.getState().adminSetTimeScale(scale),
    }
  }, [])

  useEffect(() => {
    useGameStore.getState().hydrate()
    void requestPersistentStorage()
    return startGameLoop(useGameStore)
  }, [])

  useEffect(() => {
    if (checkReliefTrigger(state)) {
      setReliefModalOpen(true)
    }
  }, [state, setReliefModalOpen])

  const hasFundReward = GROWTH_FUND_MILESTONES.some(
    (m) =>
      canClaimGrowthFund(state, m.realmIndex, false) ||
      canClaimGrowthFund(state, m.realmIndex, true),
  )
  const hasWeeklyReward = WEEKLY_MILESTONES.some(
    (m, idx) =>
      state.weeklyEvent.points >= m.points &&
      !state.weeklyEvent.claimedMilestones.includes(idx),
  )

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
        <div
          className="flex items-baseline gap-3 cursor-pointer select-none group"
          onClick={handleSecretLogoClick}
          role="button"
          tabIndex={0}
          title="Kiếm Lai · Tu Tiên Ký"
        >
          <h1 className="font-han text-3xl font-black tracking-widest text-paper-100 transition-transform active:scale-95 group-hover:text-gold-300">
            Kiếm Lai
          </h1>
          <span className="hidden font-han text-sm text-gold-400 sm:inline">· Tu Tiên Ký</span>
        </div>
        <div className="flex items-center gap-3">
          {(() => {
            const curClass = CLASS_BY_ID[state.classId] ?? CLASS_BY_ID['kiem-tu']
            const ClassIcon = CLASS_ICONS[state.classId] ?? CLASS_ICONS['kiem-tu']
            return (
              <button
                type="button"
                onClick={() => setCharacterModalOpen(true)}
                className="hidden sm:flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors hover:opacity-90"
                style={{
                  borderColor: curClass.accentColor + '66',
                  backgroundColor: curClass.accentColor + '18',
                  color: curClass.accentColor,
                }}
                title={`Đạo Thống: ${curClass.name} (${curClass.faction}) - Bấm để xem và chuyển đổi`}
              >
                {ClassIcon && <ClassIcon className="h-3.5 w-3.5" />}
                <span className="font-serif font-bold">{curClass.name}</span>
              </button>
            )
          })()}
          <button
            type="button"
            onClick={() => setNatalSwordModalOpen(true)}
            className="flex min-h-8 items-center gap-1.5 rounded-md border border-jade-500/30 bg-ink-800/80 px-2.5 py-1 text-xs text-jade-300 transition-colors hover:border-jade-400 hover:text-jade-200"
            title="Khí Phủ Kiếm Thai - Xem và uẩn dưỡng Phi Kiếm Bản Mệnh"
          >
            <IconFlyingSword className="h-3.5 w-3.5 text-jade-400" />
            <span className="hidden sm:inline font-serif font-medium">Kiếm Thai</span>
            <span className="text-[10px] font-mono text-jade-400">({state.natalSwords?.length ?? 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setCharacterModalOpen(true)}
            className="flex min-h-8 items-center gap-1.5 rounded-md border border-gold-500/30 bg-ink-800/80 px-2.5 py-1 text-xs text-paper-200 transition-colors hover:border-gold-500 hover:text-gold-400"
            title="Xem chỉ số nhân vật (Đạo thân)"
          >
            <IconDaoistBody className="h-3.5 w-3.5 text-gold-400" />
            <span className="font-serif font-medium">Chỉ số</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isFeatureUnlocked(state, 'formation')) {
                notify(`🔒 Bố Trận chưa mở: ${getFeatureUnlockRequirement('formation')}`, 'info')
                return
              }
              setFormationModalOpen(true)
            }}
            className={`flex min-h-8 items-center gap-1.5 rounded-md border border-cyan-500/30 bg-ink-800/80 px-2.5 py-1 text-xs text-paper-200 transition-colors hover:border-cyan-500 hover:text-cyan-400 ${
              !isFeatureUnlocked(state, 'formation') ? 'opacity-50' : ''
            }`}
            title={
              isFeatureUnlocked(state, 'formation')
                ? 'Bố trận Bát Quái & Tương khắc Ngũ Môn'
                : `Chưa mở: ${getFeatureUnlockRequirement('formation')}`
            }
          >
            <span className="text-xs">☯️</span>
            <span className="font-serif font-medium">Bố trận</span>
            {!isFeatureUnlocked(state, 'formation') && <span className="text-[10px]">🔒</span>}
          </button>
          <button
            type="button"
            onClick={() => setGrowthFundModalOpen(true)}
            className="relative flex min-h-8 items-center gap-1.5 rounded-md border border-amber-500/30 bg-ink-800/80 px-2.5 py-1 text-xs text-paper-200 transition-colors hover:border-amber-500 hover:text-amber-400"
            title="Quỹ Trưởng Thành · Đạo Đồ Cơ Duyên"
          >
            <span className="text-xs">🎁</span>
            <span className="hidden sm:inline font-serif font-medium">Quỹ Đạo Đồ</span>
            {hasFundReward && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-vermilion-500 ring-2 ring-ink-950 animate-pulse" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setWeeklyEventModalOpen(true)}
            className="relative flex min-h-8 items-center gap-1.5 rounded-md border border-gold-500/30 bg-ink-800/80 px-2.5 py-1 text-xs text-paper-200 transition-colors hover:border-gold-500 hover:text-gold-400"
            title="Sự Kiện Tuần Hoàn & Bảng Vinh Danh"
          >
            <span className="text-xs">🏆</span>
            <span className="hidden sm:inline font-serif font-medium">Sự Kiện</span>
            {hasWeeklyReward && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-vermilion-500 ring-2 ring-ink-950 animate-pulse" />
            )}
          </button>
          <p className="font-han text-sm text-paper-300 tabular-nums" title="Linh thạch">
            <span aria-hidden className="mr-1 text-gold-400">◆</span>
            {formatNumber(stones)}
          </p>
          <div className="hidden md:block">
            <NavBar
              current={screen}
              onChange={setScreen}
              state={state}
              onNotifyLocked={(msg) => notify(msg, 'info')}
              alchemyReady={alchemyReady}
              forgeAlert={forgeAlert}
              journeyAlert={journeyAlert}
              legacyAlert={legacyAlert}
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Screen />
      </main>

      <div className="md:hidden">
        <NavBar
          current={screen}
          onChange={setScreen}
          state={state}
          onNotifyLocked={(msg) => notify(msg, 'info')}
          alchemyReady={alchemyReady}
          forgeAlert={forgeAlert}
          journeyAlert={journeyAlert}
          legacyAlert={legacyAlert}
        />
      </div>

      <OfflineModal report={offlineReport} onClose={dismissOffline} />
      <CharacterModal
        open={characterModalOpen}
        onClose={() => setCharacterModalOpen(false)}
        state={state}
      />
      <FormationModal
        open={formationModalOpen}
        onClose={() => setFormationModalOpen(false)}
      />
      <NatalSwordModal />
      <AdminModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
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
      <BatterySaverOverlay />
      <GrowthFundModal />
      <ReliefModal />
      <WeeklyEventModal />
    </div>
  )
}
