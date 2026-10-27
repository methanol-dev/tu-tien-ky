import { create } from 'zustand'
import {
  applyOfflineProgress,
  attemptBreakthrough,
  type BreakthroughResult,
  createInitialState,
  createLocalStorage,
  defaultRng,
  deserialize,
  exportSave as engineExportSave,
  type GameState,
  importSave as engineImportSave,
  meditate as engineMeditate,
  MIN_OFFLINE_REPORT_MS,
  type OfflineReport,
  pushLog,
  type Rng,
  type SaveStorage,
  serialize,
  tick as engineTick,
} from '@/engine'

export type Screen = 'cultivate' | 'settings'

export interface FxEvent {
  id: number
  kind: 'breakthrough-success' | 'breakthrough-fail'
}

export interface GameStore {
  state: GameState
  hydrated: boolean
  offlineReport: OfflineReport | null
  screen: Screen
  fx: FxEvent | null
  hydrate: (now?: number) => void
  tick: (dtMs: number) => void
  resume: (now?: number) => void
  meditate: () => void
  breakthrough: () => BreakthroughResult | null
  save: (now?: number) => void
  dismissOffline: () => void
  setScreen: (screen: Screen) => void
  setTimeScale: (timeScale: number) => void
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

  return create<GameStore>()((set, get) => ({
    state: createInitialState(0),
    hydrated: false,
    offlineReport: null,
    screen: 'cultivate',
    fx: null,

    hydrate: (now = Date.now()) => {
      const raw = storage.load()
      if (!raw) {
        set({ state: freshState(now), hydrated: true, offlineReport: null })
        return
      }
      const parsed = deserialize(raw)
      if (!parsed.ok) {
        // Corrupt save: keep a copy for the user, start fresh.
        storage.save(raw)
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

    save: (now = Date.now()) => {
      const state = { ...get().state, lastSavedAt: now }
      storage.save(serialize(state))
      set({ state })
    },

    dismissOffline: () => set({ offlineReport: null }),
    setScreen: (screen) => set({ screen }),

    setTimeScale: (timeScale) =>
      set((s) => ({ state: { ...s.state, settings: { ...s.state.settings, timeScale } } })),

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
  }))
}

export type GameStoreApi = ReturnType<typeof createGameStore>

export const useGameStore = createGameStore()
