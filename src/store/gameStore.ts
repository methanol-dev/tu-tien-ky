import { create } from 'zustand'
import {
  type ActionResult,
  applyOfflineProgress,
  attemptBreakthrough,
  type BreakthroughResult,
  buyItem as engineBuyItem,
  collectAlchemy as engineCollectAlchemy,
  createInitialState,
  createLocalStorage,
  defaultRng,
  deserialize,
  exportSave as engineExportSave,
  gather as engineGather,
  type GameState,
  importSave as engineImportSave,
  meditate as engineMeditate,
  MIN_OFFLINE_REPORT_MS,
  type OfflineReport,
  pushLog,
  type Rng,
  type SaveStorage,
  serialize,
  startAlchemy as engineStartAlchemy,
  tick as engineTick,
  upgradeTechnique as engineUpgradeTechnique,
  usePill as engineUsePill,
} from '@/engine'

export type Screen = 'cultivate' | 'techniques' | 'inventory' | 'alchemy' | 'settings'

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
  save: (now?: number) => void
  dismissOffline: () => void
  notify: (text: string, kind?: Notice['kind']) => void
  dismissNotice: () => void
  setScreen: (screen: Screen) => void
  exportSave: () => string
  importSave: (text: string) => { ok: true } | { ok: false; error: string }
  resetGame: (now?: number) => void
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
  const storage = deps.storage ?? createLocalStorage()
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

      hydrate: (now = Date.now()) => {
        const raw = storage.load()
        if (!raw) {
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
        const { state, report } = applyOfflineProgress(parsed.state, now)
        set({
          state,
          hydrated: true,
          offlineReport: report.appliedMs >= MIN_OFFLINE_REPORT_MS ? report : null,
        })
      },

      tick: (dtMs) => set((s) => ({ state: engineTick(s.state, dtMs) })),

      resume: (now = Date.now()) => {
        const { state, report } = applyOfflineProgress(get().state, now)
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
        const { state, report } = applyOfflineProgress(parsed.state, Date.now())
        set({
          state: pushLog(state, 'Đã nhập save thành công.', 'info'),
          offlineReport: report.appliedMs >= MIN_OFFLINE_REPORT_MS ? report : null,
          screen: 'cultivate',
        })
        get().save()
        return { ok: true }
      },

      resetGame: (now = Date.now()) => {
        storage.clear()
        set({ state: freshState(now), offlineReport: null, fx: null, screen: 'cultivate' })
        get().save(now)
      },
    }
  })
}

export type GameStoreApi = ReturnType<typeof createGameStore>

export const useGameStore = createGameStore()
