import { clearFromIdb, loadFromIdb, saveToIdb } from './indexedDb'

export interface SaveStorage {
  load(): string | null
  save(data: string): void
  clear(): void
  loadAsync?(): Promise<string | null>
  saveAsync?(data: string): Promise<void>
}

export const DEFAULT_SAVE_KEY = 'tu-tien-ky:save:v1'

export function createMemoryStorage(): SaveStorage {
  let value: string | null = null
  return {
    load: () => value,
    save: (d) => {
      value = d
    },
    clear: () => {
      value = null
    },
    loadAsync: () => Promise.resolve(value),
    saveAsync: (d) => {
      value = d
      return Promise.resolve()
    },
  }
}

export function createLocalStorage(key: string = DEFAULT_SAVE_KEY): SaveStorage {
  const ls = (globalThis as { localStorage?: Storage }).localStorage
  if (!ls) return createMemoryStorage()
  return {
    load: () => ls.getItem(key),
    save: (d) => ls.setItem(key, d),
    clear: () => ls.removeItem(key),
  }
}

/**
 * Dual-Layer Hybrid Storage:
 * 1. Fast synchronous reads & writes via localStorage.
 * 2. Deep persistent background storage via IndexedDB.
 * 3. Auto-healing: If localStorage is wiped by browser eviction or user cleaning cookies,
 *    `loadAsync` pulls data from IndexedDB and restores the localStorage cache.
 */
export function createHybridStorage(key: string = DEFAULT_SAVE_KEY): SaveStorage {
  const ls = (globalThis as { localStorage?: Storage }).localStorage

  return {
    load: () => {
      return ls ? ls.getItem(key) : null
    },

    save: (data: string) => {
      if (ls) {
        try {
          ls.setItem(key, data)
        } catch {
          // LocalStorage quota might be exceeded, IDB will still save below
        }
      }
      // Background persistent save
      void saveToIdb(data)
    },

    clear: () => {
      if (ls) {
        ls.removeItem(key)
      }
      void clearFromIdb()
    },

    loadAsync: async () => {
      // 1. Try localStorage first for instant retrieval
      let data = ls ? ls.getItem(key) : null
      if (data) return data

      // 2. Fallback to IndexedDB (in case localStorage was cleared/evicted)
      data = await loadFromIdb()
      if (data && ls) {
        // Auto-heal localStorage cache
        try {
          ls.setItem(key, data)
        } catch {
          // Ignore quota error
        }
      }
      return data
    },

    saveAsync: async (data: string) => {
      if (ls) {
        try {
          ls.setItem(key, data)
        } catch {
          // ignore
        }
      }
      await saveToIdb(data)
    },
  }
}
