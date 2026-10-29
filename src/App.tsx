import { useEffect, useRef, useState } from 'react'
import { CLASS_BY_ID } from '@/content/classes'
import {
  canClaimGrowthFund,
  checkReliefTrigger,
  formatCombatPower,
  getCombatPower,
  getPendingEvent,
  getPendingStoryScene,
  GROWTH_FUND_MILESTONES,
  isAlchemyReady,
  isReincarnationForced,
  requestPersistentStorage,
  WEEKLY_MILESTONES,
} from '@/engine'
import { formatNumber } from '@/lib/format'
import { startGameLoop } from '@/store/gameLoop'
import { useGameStore } from '@/store/gameStore'
import { CLASS_ICONS } from '@/ui/atoms/icons'
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
import { CraftingHubScreen } from '@/ui/screens/CraftingHubScreen'

const SCREENS = {
  cultivate: GameScreen,
  techniques: TechniquesScreen,
  inventory: InventoryScreen,
  forge: ForgeScreen,
  alchemy: AlchemyScreen,
  journey: JourneyScreen,
  legacy: LegacyScreen,
  settings: SettingsScreen,
  hub: CraftingHubScreen,
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
  const combatPower = getCombatPower(state)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-5 px-4 pt-5 pb-24 md:pb-8">
      {/* 1. Single-Row Master Header (Logo, Đạo Thân, CP & Quick Actions) */}
      <header className="flex items-center justify-between gap-2 sm:gap-4 border-b border-paper-400/15 pb-2.5">
        {/* Nhóm Trái: Thương hiệu Kiếm Lai & Lệnh Bài Đạo Thân */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className="flex items-baseline gap-1.5 cursor-pointer select-none group"
            onClick={handleSecretLogoClick}
            role="button"
            tabIndex={0}
            title="Kiếm Lai · Tu Tiên Ký"
          >
            <h1 className="font-han text-xl sm:text-2xl font-black tracking-widest text-paper-100 transition-transform active:scale-95 group-hover:text-gold-300 whitespace-nowrap">
              Kiếm Lai
            </h1>
            <span className="hidden font-han text-xs text-gold-400/80 sm:inline whitespace-nowrap">· Tu Tiên Ký</span>
          </div>

          {/* Lệnh Bài Đạo Thân & Lực Chiến (Character Capsule) */}
          {(() => {
            const curClass = CLASS_BY_ID[state.classId] ?? CLASS_BY_ID['kiem-tu']
            const ClassIcon = CLASS_ICONS[state.classId] ?? CLASS_ICONS['kiem-tu']
            return (
              <button
                type="button"
                onClick={() => setCharacterModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-gold-500/30 bg-ink-950/70 px-2 sm:px-2.5 py-1 text-xs text-paper-200 transition-all hover:border-gold-400 hover:bg-ink-800/80 active:scale-95 shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
                title={`Đạo Thống: ${curClass.name} — Bấm xem hồ sơ Đạo Thân & Chỉ số`}
              >
                {ClassIcon && (
                  <ClassIcon
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: curClass.accentColor }}
                  />
                )}
                <span className="font-serif font-bold text-paper-100 hidden sm:inline">
                  {curClass.name}
                </span>
                <span className="text-[10px] text-paper-400 font-sans ml-0.5 hidden sm:inline">Chỉ số</span>
                <span className="flex items-center gap-1 rounded-full bg-gold-500/15 px-1.5 sm:px-2 py-0.5 font-mono font-bold text-gold-300 text-[11px]">
                  <span className="text-xs">⚔️</span>
                  <span>{formatCombatPower(combatPower)}</span>
                </span>
              </button>
            )
          })()}
        </div>

        {/* Nhóm Phải: Linh Thạch & Tiện Ích */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Linh thạch */}
          <div
            className="flex items-center gap-1 rounded-full border border-paper-400/15 bg-ink-950/60 px-2.5 py-1 font-serif text-xs sm:text-sm text-paper-200 tabular-nums shadow-sm shrink-0 whitespace-nowrap"
            title="Linh thạch"
          >
            <span aria-hidden className="text-gold-400 font-bold">◆</span>
            <span className="font-medium text-gold-200">{formatNumber(stones)}</span>
          </div>

          {/* Quỹ Đạo Đồ */}
          <button
            type="button"
            onClick={() => setGrowthFundModalOpen(true)}
            className="relative flex h-8 w-8 sm:h-8 sm:w-auto items-center justify-center sm:gap-1.5 rounded-full sm:rounded-md border border-amber-500/30 bg-ink-800/80 px-0 sm:px-2.5 text-xs text-paper-200 transition-colors hover:border-amber-400 hover:text-amber-300 shrink-0 cursor-pointer"
            title="Quỹ Trưởng Thành · Đạo Đồ Cơ Duyên"
          >
            <span className="text-sm">🎁</span>
            <span className="hidden sm:inline font-serif font-medium">Quỹ</span>
            {hasFundReward && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-vermilion-500 ring-2 ring-ink-950 animate-pulse" />
            )}
          </button>

          {/* Sự Kiện */}
          <button
            type="button"
            onClick={() => setWeeklyEventModalOpen(true)}
            className="relative flex h-8 w-8 sm:h-8 sm:w-auto items-center justify-center sm:gap-1.5 rounded-full sm:rounded-md border border-gold-500/30 bg-ink-800/80 px-0 sm:px-2.5 text-xs text-paper-200 transition-colors hover:border-gold-400 hover:text-gold-300 shrink-0 cursor-pointer"
            title="Sự Kiện Tuần Hoàn & Bảng Vinh Danh"
          >
            <span className="text-sm">🏆</span>
            <span className="hidden sm:inline font-serif font-medium">Sự Kiện</span>
            {hasWeeklyReward && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-vermilion-500 ring-2 ring-ink-950 animate-pulse" />
            )}
          </button>

          {/* Cài Đặt */}
          <button
            type="button"
            onClick={() => setScreen('settings')}
            className={`flex h-8 w-8 sm:h-8 sm:w-auto items-center justify-center sm:gap-1.5 rounded-full sm:rounded-md border px-0 sm:px-2.5 text-xs transition-colors shrink-0 cursor-pointer ${
              screen === 'settings'
                ? 'border-gold-400 bg-gold-500/20 text-gold-300'
                : 'border-paper-400/20 bg-ink-800/80 text-paper-300 hover:border-paper-300 hover:text-paper-100'
            }`}
            title="Cài đặt hệ thống & Âm thanh"
          >
            <span className="text-sm">⚙️</span>
            <span className="hidden sm:inline font-serif font-medium">Cài đặt</span>
          </button>
        </div>
      </header>

      {/* 2. Dải Sub-Nav Strip Điều Hướng Desktop (7 Tabs Gameplay Thanh Thoát) */}
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

      <main className="flex-1">
        <Screen />
      </main>

      {/* 3. Thanh Menu Điều Hướng Mobile (Thanh đáy cố định ngón cái) */}
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
