import { describe, expect, it, vi } from 'vitest'
import {
  clearFromIdb,
  createHybridStorage,
  createMemoryStorage,
  getStorageEstimate,
  loadFromIdb,
  requestPersistentStorage,
  saveToIdb,
} from '@/engine'
import { createGameStore } from '@/store/gameStore'

describe('indexedDb & hybrid storage', () => {
  it('gracefully handles missing indexedDB in Node/SSR environment', async () => {
    // In Node.js environment without fake-indexeddb, openSaveDb returns null safely
    const saved = await saveToIdb('test-data')
    expect(saved).toBe(false)

    const loaded = await loadFromIdb()
    expect(loaded).toBeNull()

    const cleared = await clearFromIdb()
    expect(cleared).toBe(false)
  })

  it('inspects storage estimate safely without throwing', async () => {
    const est = await getStorageEstimate()
    expect(est).toBeDefined()
    expect(typeof est.supported).toBe('boolean')
    expect(typeof est.persisted).toBe('boolean')
    expect(typeof est.usageBytes).toBe('number')
    expect(typeof est.quotaBytes).toBe('number')
  })

  it('requests persistent storage gracefully', async () => {
    const res = await requestPersistentStorage()
    expect(typeof res).toBe('boolean')
  })

  it('createHybridStorage loads and saves with localStorage when available', async () => {
    const fakeStore: Record<string, string> = {}
    const fakeLocalStorage = {
      getItem: (k: string) => fakeStore[k] ?? null,
      setItem: (k: string, v: string) => {
        fakeStore[k] = v
      },
      removeItem: (k: string) => {
        delete fakeStore[k]
      },
    }

    vi.stubGlobal('localStorage', fakeLocalStorage)

    const storage = createHybridStorage('test-key')
    expect(storage.load()).toBeNull()

    storage.save('test-save-content')
    expect(storage.load()).toBe('test-save-content')
    expect(fakeStore['test-key']).toBe('test-save-content')

    const asyncVal = await storage.loadAsync?.()
    expect(asyncVal).toBe('test-save-content')

    storage.clear()
    expect(storage.load()).toBeNull()

    vi.unstubAllGlobals()
  })

  it('recoverFromIdb notifies when no save is found in storage', async () => {
    const storage = createMemoryStorage()
    const store = createGameStore({ storage })
    store.getState().hydrate(0)

    const recovered = await store.getState().recoverFromIdb()
    expect(recovered).toBe(false)
    expect(store.getState().notice?.text).toContain('Không tìm thấy bản lưu nào')
  })
})

