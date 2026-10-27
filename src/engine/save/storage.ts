export interface SaveStorage {
  load(): string | null
  save(data: string): void
  clear(): void
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
