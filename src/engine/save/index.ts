import { REALMS } from '@/content/realms'
import type { GameState } from '../types'
import { MigrationError, migrateSave } from './migrate'
import { gameStateSchema } from './schema'

export * from './migrate'
export * from './schema'
export * from './storage'

export type DeserializeResult = { ok: true; state: GameState } | { ok: false; error: string }

export function serialize(state: GameState): string {
  return JSON.stringify(state)
}

export function deserialize(json: string): DeserializeResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { ok: false, error: 'Dữ liệu không phải JSON hợp lệ' }
  }
  try {
    const migrated = migrateSave(parsed)
    const result = gameStateSchema.safeParse(migrated)
    if (!result.success) {
      const issue = result.error.issues[0]
      return { ok: false, error: `Save không hợp lệ: ${issue.path.join('.')} ${issue.message}` }
    }
    const state = result.data
    if (state.realmIndex >= REALMS.length) {
      return { ok: false, error: 'Save không hợp lệ: cảnh giới vượt quá bảng' }
    }
    return { ok: true, state }
  } catch (e) {
    if (e instanceof MigrationError) return { ok: false, error: e.message }
    throw e
  }
}

/** Human-shareable export string (base64 of JSON, UTF-8 safe). */
export function exportSave(state: GameState): string {
  const bytes = new TextEncoder().encode(serialize(state))
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

/** Accepts either raw JSON or the base64 string produced by exportSave. */
export function importSave(text: string): DeserializeResult {
  const trimmed = text.trim()
  if (trimmed.startsWith('{')) return deserialize(trimmed)
  try {
    const bin = atob(trimmed)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return deserialize(new TextDecoder().decode(bytes))
  } catch {
    return { ok: false, error: 'Chuỗi save không đọc được (không phải JSON hay base64)' }
  }
}
