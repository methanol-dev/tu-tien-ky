const DB_NAME = 'tu-tien-ky-db'
const DB_VERSION = 1
const STORE_NAME = 'saves'
export const IDB_SAVE_KEY = 'primary'

/**
 * Open or initialize the IndexedDB instance.
 * Gracefully returns null if IndexedDB is not supported (e.g. Node/SSR).
 */
export function openSaveDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
}

/**
 * Load raw save data from IndexedDB.
 */
export async function loadFromIdb(key = IDB_SAVE_KEY): Promise<string | null> {
  const db = await openSaveDb()
  if (!db) return null

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onsuccess = () => {
        const val = request.result
        resolve(typeof val === 'string' ? val : null)
      }
      request.onerror = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
}

/**
 * Save raw save data into IndexedDB.
 */
export async function saveToIdb(data: string, key = IDB_SAVE_KEY): Promise<boolean> {
  const db = await openSaveDb()
  if (!db) return false

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.put(data, key)

      request.onsuccess = () => resolve(true)
      request.onerror = () => resolve(false)
    } catch {
      resolve(false)
    }
  })
}

/**
 * Clear save data from IndexedDB.
 */
export async function clearFromIdb(key = IDB_SAVE_KEY): Promise<boolean> {
  const db = await openSaveDb()
  if (!db) return false

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.delete(key)

      request.onsuccess = () => resolve(true)
      request.onerror = () => resolve(false)
    } catch {
      resolve(false)
    }
  })
}

export interface StorageEstimateInfo {
  supported: boolean
  persisted: boolean
  usageBytes: number
  quotaBytes: number
}

/**
 * Request persistent storage permission from the browser so the OS/browser
 * will not clear the game's IndexedDB when disk space is tight.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    try {
      const alreadyPersisted = await navigator.storage.persisted?.()
      if (alreadyPersisted) return true
      return await navigator.storage.persist()
    } catch {
      return false
    }
  }
  return false
}

/**
 * Inspect storage quota and persistent state.
 */
export async function getStorageEstimate(): Promise<StorageEstimateInfo> {
  const result: StorageEstimateInfo = {
    supported: false,
    persisted: false,
    usageBytes: 0,
    quotaBytes: 0,
  }

  if (typeof navigator === 'undefined' || !navigator.storage) {
    return result
  }

  result.supported = true

  try {
    if (navigator.storage.persisted) {
      result.persisted = await navigator.storage.persisted()
    }
    if (navigator.storage.estimate) {
      const est = await navigator.storage.estimate()
      result.usageBytes = est.usage ?? 0
      result.quotaBytes = est.quota ?? 0
    }
  } catch {
    // Non-fatal if browser blocks estimate
  }

  return result
}
