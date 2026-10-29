import { create } from 'zustand'
import type { ChestKind, Rarity } from '@/content/affixes'
import type { ClassId, CultivationPath } from '@/content/classes'
import type { GearSlot } from '@/content/gear'
import type { Difficulty } from '@/content/regions'
import {
  type ActionResult,
  adminAddChests,
  adminAddHerbsAndPills,
  adminAddPunches,
  adminAddQi,
  adminAddStones,
  adminGiveFullGear,
  adminInstantBreakthrough,
  adminSetRealm,
  adminSetTimeScale,
  adminUnlockAllRegions,
  applyOfflineProgress,
  attemptBreakthrough,
  autoEquipBestGear as engineAutoEquipBestGear,
  unequipAllGear as engineUnequipAllGear,
  type BreakthroughResult,
  buyItem as engineBuyItem,
  buyLegacyUpgrade as engineBuyLegacyUpgrade,
  changeClass as engineChangeClass,
  setCultivationPath as engineSetCultivationPath,
  type BoltResult,
  reincarnate as engineReincarnate,
  resolveBolt as engineResolveBolt,
  type TribulationAction,
  type BattleSpeed,
  collectAlchemy as engineCollectAlchemy,
  createHybridStorage,
  createInitialState,
  defaultRng,
  deserialize,
  equip as engineEquip,
  exportSave as engineExportSave,
  type ForgeAutoFilters,
  forgeGear as engineForgeGear,
  salvagePendingGear as engineSalvagePendingGear,
  equipPendingGear as engineEquipPendingGear,
  buyFire as engineBuyFire,
  updateForgeFilters as engineUpdateForgeFilters,
  type FormationSlot,
  setPlayerFormationSlot as engineSetPlayerFormationSlot,
  claimGrowthFund as engineClaimGrowthFund,
  unlockPremiumGrowthFund as engineUnlockPremiumGrowthFund,
  claimReliefPack as engineClaimReliefPack,
  dismissReliefPack as engineDismissReliefPack,
  claimWeeklyMilestone as engineClaimWeeklyMilestone,
  forgeNatalSword as engineForgeNatalSword,
  temperNatalSword as engineTemperNatalSword,
  upgradeSwordTalent as engineUpgradeSwordTalent,
  gather as engineGather,
  type GameState,
  type GearInstance,
  importSave as engineImportSave,
  journeyTick,
  meditate as engineMeditate,
  MIN_OFFLINE_REPORT_MS,
  type EventResolution,
  type OfflineReport,
  openChests as engineOpenChests,
  resolveEvent as engineResolveEvent,
  resolveStoryScene as engineResolveStoryScene,
  rollEvent,
  salvage as engineSalvage,
  salvageByRarity as engineSalvageByRarity,
  setAutoAdvance as engineSetAutoAdvance,
  shouldRollEvent,
  pushLog,
  type Rng,
  type SaveStorage,
  serialize,
  startAlchemy as engineStartAlchemy,
  startRegion as engineStartRegion,
  tick as engineTick,
  unequip as engineUnequip,
  upgradeTechnique as engineUpgradeTechnique,
  usePill as engineUsePill,
} from '@/engine'

export type Screen =
  | 'cultivate'
  | 'techniques'
  | 'inventory'
  | 'alchemy'
  | 'forge'
  | 'journey'
  | 'legacy'
  | 'settings'
  | 'hub'

export interface FxEvent {
  id: number
  kind: 'breakthrough-success' | 'breakthrough-fail'
}

export interface Notice {
  id: number
  text: string
  kind: 'info' | 'success' | 'error'
}

export interface GameStore {
  state: GameState
  hydrated: boolean
  offlineReport: OfflineReport | null
  screen: Screen
  fx: FxEvent | null
  notice: Notice | null
  /** Outcome of the last resolved event, shown until dismissed. */
  eventResult: EventResolution | null
  /** Gear from the last chest opening, shown until dismissed. */
  chestResult: GearInstance[] | null
  /** Last bolt outcome, for the tribulation dialog's final screen. */
  tribulationResult: BoltResult | null
  /** Whether the full character stats sheet dialog is open. */
  characterModalOpen: boolean
  setCharacterModalOpen: (open: boolean) => void
  /** Whether the Natal Sword Pavilion modal is open. */
  natalSwordModalOpen: boolean
  setNatalSwordModalOpen: (open: boolean) => void
  /** Whether the Pre-Combat Formation modal is open. */
  formationModalOpen: boolean
  setFormationModalOpen: (open: boolean) => void
  setPlayerFormationSlot: (slot: FormationSlot) => void
  /** Whether the Battery Saver AFK overlay is active manually. */
  afkSaverOpen: boolean
  setAfkSaverOpen: (open: boolean) => void
  /** Growth Fund modal state and actions. */
  growthFundModalOpen: boolean
  setGrowthFundModalOpen: (open: boolean) => void
  claimGrowthFund: (realmIndex: number, isPremium: boolean) => boolean
  unlockPremiumGrowthFund: (currency: 'daoVan' | 'stones') => boolean
  /** Emergency Relief modal state and actions. */
  reliefModalOpen: boolean
  setReliefModalOpen: (open: boolean) => void
  claimReliefPack: () => boolean
  dismissReliefPack: () => void
  /** Weekly LiveOps Event modal state and actions. */
  weeklyEventModalOpen: boolean
  setWeeklyEventModalOpen: (open: boolean) => void
  claimWeeklyMilestone: (milestoneIdx: number) => boolean
  forgeNatalSword: (swordDefId: string) => boolean
  temperNatalSword: (swordUid: string) => boolean
  upgradeSwordTalent: (swordUid: string, talentId: string) => boolean
  hydrate: (now?: number) => void
  tick: (dtMs: number) => void
  resume: (now?: number) => void
  meditate: () => void
  breakthrough: () => BreakthroughResult | null
  gather: () => boolean
  upgradeTechnique: (id: string) => boolean
  useItem: (id: string) => boolean
  buyItem: (id: string, qty?: number) => boolean
  startAlchemy: (recipeId: string) => boolean
  collectAlchemy: () => boolean
  resolveEvent: (choiceId: string) => boolean
  dismissEventResult: () => void
  resolveStoryScene: (sceneId: string, choiceId?: string) => void
  setPauseOnEvent: (value: boolean) => void
  setAvatar: (avatarId: string) => void
  setBattleSpeed: (speed: BattleSpeed) => void
  startRegion: (regionId: string, difficulty: Difficulty) => boolean
  setAutoAdvance: (value: boolean) => void
  openChests: (kind: ChestKind, count: number) => boolean
  dismissChestResult: () => void
  equip: (uid: string, targetSlot?: GearSlot) => boolean
  autoEquipBest: () => boolean
  unequipAll: () => void
  unequip: (slot: GearSlot) => boolean
  salvage: (uids: string[]) => boolean
  salvageByRarity: (rarities: Rarity[]) => boolean
  forgeGear: () => boolean
  salvagePendingGear: () => void
  equipPendingGear: () => void
  buyFire: (count: number) => boolean
  updateForgeFilters: (filters: Partial<ForgeAutoFilters>) => void
  changeClass: (classId: ClassId) => boolean
  setCultivationPath: (path: CultivationPath, classId: ClassId) => boolean
  resolveBolt: (action: TribulationAction) => boolean
  dismissTribulationResult: () => void
  reincarnate: () => boolean
  buyLegacyUpgrade: (id: string) => boolean
  save: (now?: number) => void
  dismissOffline: () => void
  notify: (text: string, kind?: Notice['kind']) => void
  dismissNotice: () => void
  setScreen: (screen: Screen) => void
  exportSave: () => string
  importSave: (text: string) => { ok: true } | { ok: false; error: string }
  recoverFromIdb: (now?: number) => Promise<boolean>
  resetGame: (now?: number) => void
  adminAddStones: (amount: number) => void
  adminAddQi: (amount: number) => void
  adminSetRealm: (realmIndex: number) => void
  adminAddPunches: (punches: number) => void
  adminAddChests: (normal: number, red: number) => void
  adminUnlockAllRegions: () => void
  adminGiveFullGear: () => void
  adminAddHerbsAndPills: (count?: number) => void
  adminInstantBreakthrough: () => void
  adminSetTimeScale: (scale: number) => void
}

export interface GameStoreDeps {
  storage?: SaveStorage
  rng?: Rng
}

const WELCOME_TEXT =
  'Ngươi sinh ra là một phàm nhân, trong người ẩn chứa một tia linh căn. Con đường tu tiên bắt đầu từ đây.'

function freshState(now: number): GameState {
  return pushLog(createInitialState(now), WELCOME_TEXT, 'event')
}

export function createGameStore(deps: GameStoreDeps = {}) {
  const storage = deps.storage ?? createHybridStorage()
  const rng = deps.rng ?? defaultRng
  let fxCounter = 0
  let noticeCounter = 0

  return create<GameStore>()((set, get) => {
    /** Apply an engine ActionResult; surface refusals as a notice. */
    const apply = (r: ActionResult, success?: string): boolean => {
      if (!r.ok) {
        get().notify(r.error, 'error')
        return false
      }
      set({ state: r.state })
      if (success) get().notify(success, 'success')
      return true
    }

    return {
      state: createInitialState(0),
      hydrated: false,
      offlineReport: null,
      screen: 'cultivate',
      fx: null,
      notice: null,
      eventResult: null,
      chestResult: null,
      tribulationResult: null,
      characterModalOpen: false,
      setCharacterModalOpen: (open) => set({ characterModalOpen: open }),
      natalSwordModalOpen: false,
      setNatalSwordModalOpen: (open) => set({ natalSwordModalOpen: open }),
      formationModalOpen: false,
      setFormationModalOpen: (open) => set({ formationModalOpen: open }),
      afkSaverOpen: false,
      setAfkSaverOpen: (open) => set({ afkSaverOpen: open }),
      growthFundModalOpen: false,
      setGrowthFundModalOpen: (open) => set({ growthFundModalOpen: open }),
      claimGrowthFund: (realmIndex, isPremium) => {
        const ok = apply(engineClaimGrowthFund(get().state, realmIndex, isPremium))
        if (ok) get().save()
        return ok
      },
      unlockPremiumGrowthFund: (currency) => {
        const ok = apply(engineUnlockPremiumGrowthFund(get().state, currency))
        if (ok) get().save()
        return ok
      },
      reliefModalOpen: false,
      setReliefModalOpen: (open) => set({ reliefModalOpen: open }),
      claimReliefPack: () => {
        const ok = apply(engineClaimReliefPack(get().state))
        if (ok) {
          set({ reliefModalOpen: false })
          get().save()
        }
        return ok
      },
      dismissReliefPack: () => {
        set((s) => ({
          reliefModalOpen: false,
          state: engineDismissReliefPack(s.state),
        }))
        get().save()
      },
      weeklyEventModalOpen: false,
      setWeeklyEventModalOpen: (open) => set({ weeklyEventModalOpen: open }),
      claimWeeklyMilestone: (milestoneIdx) => {
        const ok = apply(engineClaimWeeklyMilestone(get().state, milestoneIdx))
        if (ok) get().save()
        return ok
      },
      setPlayerFormationSlot: (slot) => {
        set((s) => ({ state: engineSetPlayerFormationSlot(s.state, slot) }))
        get().save()
      },

      hydrate: (now = Date.now()) => {
        const raw = storage.load()
        if (!raw) {
          // If synchronous localStorage is empty, try async IndexedDB healing
          if (storage.loadAsync) {
            void storage.loadAsync().then((idbRaw) => {
              if (idbRaw) {
                const parsed = deserialize(idbRaw)
                if (parsed.ok) {
                  const { state, report } = applyOfflineProgress(parsed.state, now, undefined, rng)
                  set({
                    state,
                    hydrated: true,
                    offlineReport: report.appliedMs >= MIN_OFFLINE_REPORT_MS ? report : null,
                  })
                  get().notify('Đã khôi phục đạo hạnh từ kho lưu trữ IndexedDB!', 'success')
                }
              }
            })
          }
          set({ state: freshState(now), hydrated: true, offlineReport: null })
          return
        }
        const parsed = deserialize(raw)
        if (!parsed.ok) {
          set({
            state: pushLog(freshState(now), `Save cũ không đọc được (${parsed.error}).`, 'danger'),
            hydrated: true,
          })
          return
        }
        const { state, report } = applyOfflineProgress(parsed.state, now, undefined, rng)
        set({
          state,
          hydrated: true,
          offlineReport: report.appliedMs >= MIN_OFFLINE_REPORT_MS ? report : null,
        })
      },

      tick: (dtMs) =>
        set((s) => {
          const speed = s.state.settings.battleSpeed ?? 1
          const ticked = journeyTick(engineTick(s.state, dtMs), dtMs * speed, rng)
          return { state: shouldRollEvent(ticked) ? rollEvent(ticked, rng) : ticked }
        }),

      resume: (now = Date.now()) => {
        const { state, report } = applyOfflineProgress(get().state, now, undefined, rng)
        set({
          state,
          offlineReport: report.appliedMs >= MIN_OFFLINE_REPORT_MS ? report : get().offlineReport,
        })
      },

      meditate: () => set((s) => ({ state: engineMeditate(s.state) })),

      breakthrough: () => {
        const result = attemptBreakthrough(get().state, rng)
        if (result.state === get().state) return null
        fxCounter += 1
        set({
          state: result.state,
          fx: { id: fxCounter, kind: result.success ? 'breakthrough-success' : 'breakthrough-fail' },
        })
        get().save()
        return result
      },

      gather: () => {
        const r = engineGather(get().state, rng)
        if (!r.ok) return apply(r)
        set({ state: r.state.state })
        return true
      },

      upgradeTechnique: (id) => apply(engineUpgradeTechnique(get().state, id)),
      forgeNatalSword: (swordDefId) => apply(engineForgeNatalSword(get().state, swordDefId)),
      temperNatalSword: (swordUid) => apply(engineTemperNatalSword(get().state, swordUid)),
      upgradeSwordTalent: (swordUid, talentId) => apply(engineUpgradeSwordTalent(get().state, swordUid, talentId)),
      useItem: (id) => apply(engineUsePill(get().state, id)),
      buyItem: (id, qty = 1) => apply(engineBuyItem(get().state, id, qty)),
      startAlchemy: (recipeId) => apply(engineStartAlchemy(get().state, recipeId)),

      collectAlchemy: () => {
        const r = engineCollectAlchemy(get().state, rng)
        if (!r.ok) return apply(r)
        set({ state: r.state.state })
        get().notify(
          r.state.success ? 'Đan thành!' : 'Đan lô nổ, luyện đan thất bại.',
          r.state.success ? 'success' : 'error',
        )
        return true
      },

      resolveEvent: (choiceId) => {
        const r = engineResolveEvent(get().state, choiceId, rng)
        if (!r.ok) return apply(r)
        set({ state: r.state.state, eventResult: r.state.outcome.text ? r.state : null })
        get().save()
        return true
      },
      dismissEventResult: () => set({ eventResult: null }),
      resolveStoryScene: (sceneId, choiceId) => {
        const { state } = engineResolveStoryScene(get().state, sceneId, choiceId)
        set({ state })
        get().save()
      },

      startRegion: (regionId, difficulty) => apply(engineStartRegion(get().state, regionId, difficulty)),
      setAutoAdvance: (value) => set((s) => ({ state: engineSetAutoAdvance(s.state, value) })),

      openChests: (kind, count) => {
        const r = engineOpenChests(get().state, kind, count, rng)
        if (r.error) {
          get().notify(r.error, 'error')
          return false
        }
        set({ state: r.state, chestResult: [...(get().chestResult ?? []), ...r.opened] })
        get().save()
        return true
      },
      dismissChestResult: () => set({ chestResult: null }),

      equip: (uid, targetSlot) => apply(engineEquip(get().state, uid, targetSlot)),
      autoEquipBest: () => {
        const { state, equippedCount } = engineAutoEquipBestGear(get().state)
        set({ state })
        get().save()
        if (equippedCount > 0) {
          get().notify(`Đã tự động trang bị ${equippedCount} món pháp bảo tối ưu!`, 'success')
        } else {
          get().notify('Đang mặc các món pháp bảo tốt nhất hiện có rồi.', 'info')
        }
        return equippedCount > 0
      },
      unequipAll: () => {
        const nextState = engineUnequipAllGear(get().state)
        set({ state: nextState })
        get().save()
        get().notify('Đã tháo toàn bộ 12 ô trang bị vào túi đồ.', 'info')
      },
      unequip: (slot) => apply(engineUnequip(get().state, slot)),
      salvage: (uids) => {
        const r = engineSalvage(get().state, uids)
        if (!r.ok) return apply(r)
        set({ state: r.state.state })
        get().notify(`Phân giải ${r.state.count} món, thu ${Math.round(r.state.stones)} linh thạch.`, 'success')
        return true
      },
      salvageByRarity: (rarities) => {
        const r = engineSalvageByRarity(get().state, rarities)
        if (!r.ok) return apply(r)
        set({ state: r.state.state })
        get().notify(`Phân giải ${r.state.count} món, thu ${Math.round(r.state.stones)} linh thạch.`, 'success')
        return true
      },

      forgeGear: () => {
        let success = false
        set((s) => {
          const res = engineForgeGear(s.state, rng)
          if (!res.ok) {
            return {
              notice: { id: Date.now(), text: res.error, kind: 'error' },
            }
          }
          success = true
          return { state: res.state.state }
        })
        if (success) get().save()
        return success
      },

      salvagePendingGear: () => {
        set((s) => ({ state: engineSalvagePendingGear(s.state) }))
        get().save()
      },

      equipPendingGear: () => {
        set((s) => ({ state: engineEquipPendingGear(s.state) }))
        get().save()
      },

      buyFire: (count: number) => {
        let success = false
        set((s) => {
          const res = engineBuyFire(s.state, count)
          if (!res.ok) {
            return {
              notice: { id: Date.now(), text: res.error, kind: 'error' },
            }
          }
          success = true
          return { state: res.state }
        })
        if (success) {
          get().save()
          get().notify(`Đã nạp ${count} Chân Hỏa vào Đan Lô!`, 'success')
        }
        return success
      },

      updateForgeFilters: (filters: Partial<ForgeAutoFilters>) => {
        set((s) => ({ state: engineUpdateForgeFilters(s.state, filters) }))
        get().save()
      },

      changeClass: (classId) => apply(engineChangeClass(get().state, classId)),

      setCultivationPath: (path, classId) => apply(engineSetCultivationPath(get().state, path, classId)),

      resolveBolt: (action) => {
        const r = engineResolveBolt(get().state, action, rng)
        if (!r.ok) return apply(r)
        fxCounter += 1
        set({
          state: r.state.state,
          tribulationResult: r.state.finished ? r.state : null,
          fx: r.state.finished
            ? { id: fxCounter, kind: r.state.success ? 'breakthrough-success' : 'breakthrough-fail' }
            : get().fx,
        })
        if (r.state.finished) get().save()
        return true
      },
      dismissTribulationResult: () => set({ tribulationResult: null }),

      reincarnate: () => {
        const r = engineReincarnate(get().state, Date.now())
        if (!r.ok) return apply(r)
        set({ state: r.state, offlineReport: null, eventResult: null, chestResult: null, screen: 'cultivate' })
        get().save()
        get().notify('Chuyển thế thành công. Một kiếp mới bắt đầu.', 'success')
        return true
      },
      buyLegacyUpgrade: (id) => apply(engineBuyLegacyUpgrade(get().state, id)),
      setPauseOnEvent: (value) =>
        set((s) => ({ state: { ...s.state, settings: { ...s.state.settings, pauseOnEvent: value } } })),

      setAvatar: (avatarId) => {
        set((s) => ({ state: { ...s.state, settings: { ...s.state.settings, avatarId } } }))
        get().save()
      },

      setBattleSpeed: (speed) => {
        set((s) => ({ state: { ...s.state, settings: { ...s.state.settings, battleSpeed: speed } } }))
        get().save()
      },

      save: (now = Date.now()) => {
        const state = { ...get().state, lastSavedAt: now }
        storage.save(serialize(state))
        set({ state })
      },

      dismissOffline: () => set({ offlineReport: null }),

      notify: (text, kind = 'info') => {
        noticeCounter += 1
        set({ notice: { id: noticeCounter, text, kind } })
      },
      dismissNotice: () => set({ notice: null }),

      setScreen: (screen) => set({ screen }),

      exportSave: () => engineExportSave({ ...get().state, lastSavedAt: Date.now() }),

      importSave: (text) => {
        const parsed = engineImportSave(text)
        if (!parsed.ok) return parsed
        const { state, report } = applyOfflineProgress(parsed.state, Date.now(), undefined, rng)
        set({
          state: pushLog(state, 'Đã nhập save thành công.', 'info'),
          offlineReport: report.appliedMs >= MIN_OFFLINE_REPORT_MS ? report : null,
          screen: 'cultivate',
        })
        get().save()
        return { ok: true }
      },

      recoverFromIdb: async (now = Date.now()) => {
        if (!storage.loadAsync) return false
        const idbRaw = await storage.loadAsync()
        if (!idbRaw) {
          get().notify('Không tìm thấy bản lưu nào trong IndexedDB.', 'error')
          return false
        }
        const parsed = deserialize(idbRaw)
        if (!parsed.ok) {
          get().notify(`Bản lưu trong IndexedDB bị lỗi: ${parsed.error}`, 'error')
          return false
        }
        const { state, report } = applyOfflineProgress(parsed.state, now, undefined, rng)
        set({
          state,
          hydrated: true,
          offlineReport: report.appliedMs >= MIN_OFFLINE_REPORT_MS ? report : null,
        })
        get().save()
        get().notify('Đã khôi phục đạo hạnh thành công từ IndexedDB!', 'success')
        return true
      },

      resetGame: (now = Date.now()) => {
        storage.clear()
        set({ state: freshState(now), offlineReport: null, fx: null, chestResult: null, screen: 'cultivate' })
        get().save(now)
      },

      adminAddStones: (amount) => {
        set({ state: adminAddStones(get().state, amount) })
        get().save()
      },
      adminAddQi: (amount) => {
        set({ state: adminAddQi(get().state, amount) })
        get().save()
      },
      adminSetRealm: (realmIndex) => {
        set({ state: adminSetRealm(get().state, realmIndex) })
        get().save()
      },
      adminAddPunches: (punches) => {
        set({ state: adminAddPunches(get().state, punches) })
        get().save()
      },
      adminAddChests: (normal, red) => {
        set({ state: adminAddChests(get().state, normal, red) })
        get().save()
      },
      adminUnlockAllRegions: () => {
        set({ state: adminUnlockAllRegions(get().state) })
        get().save()
      },
      adminGiveFullGear: () => {
        set({ state: adminGiveFullGear(get().state) })
        get().save()
      },
      adminAddHerbsAndPills: (count) => {
        set({ state: adminAddHerbsAndPills(get().state, count) })
        get().save()
      },
      adminInstantBreakthrough: () => {
        set({ state: adminInstantBreakthrough(get().state) })
        get().save()
      },
      adminSetTimeScale: (scale) => {
        set({ state: adminSetTimeScale(get().state, scale) })
        get().save()
      },
    }
  })
}

export type GameStoreApi = ReturnType<typeof createGameStore>

export const useGameStore = createGameStore()
