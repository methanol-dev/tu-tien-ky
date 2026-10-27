import { describe, expect, it } from 'vitest'
import {
  createInitialState,
  createMemoryStorage,
  deserialize,
  exportSave,
  importSave,
  LOG_LIMIT,
  pushLog,
  SAVE_VERSION,
  serialize,
} from '@/engine'

describe('save / load', () => {
  it('round-trips a state through serialize/deserialize', () => {
    let s = createInitialState(123)
    s = pushLog(s, 'Khởi đầu con đường tu tiên', 'event')
    s = { ...s, qi: 42.5, realmIndex: 3 }
    const r = deserialize(serialize(s))
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.state).toEqual(s)
  })

  it('round-trips through base64 export/import with Vietnamese text', () => {
    let s = createInitialState(1)
    s = pushLog(s, 'Đột phá Trúc Cơ, thiên địa biến sắc', 'success')
    const r = importSave(exportSave(s))
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.state.log[0].text).toBe('Đột phá Trúc Cơ, thiên địa biến sắc')
  })

  it('rejects garbage input without throwing', () => {
    expect(deserialize('not json').ok).toBe(false)
    expect(deserialize('[1,2,3]').ok).toBe(false)
    expect(deserialize('{"version":1}').ok).toBe(false)
    expect(importSave('!!!not base64!!!').ok).toBe(false)
  })

  it('rejects out-of-range realmIndex and negative qi', () => {
    const s = createInitialState(0)
    expect(deserialize(serialize({ ...s, realmIndex: 999 })).ok).toBe(false)
    expect(deserialize(serialize({ ...s, qi: -1 })).ok).toBe(false)
  })

  it('migrates a version-0 save to the current version', () => {
    const s = createInitialState(0)
    const legacy: Record<string, unknown> = { ...s, version: 0 }
    const stats = { ...s.stats } as Record<string, unknown>
    delete stats.qiTotal
    legacy.stats = stats
    const r = deserialize(JSON.stringify(legacy))
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.state.version).toBe(SAVE_VERSION)
      expect(r.state.stats.qiTotal).toBe(0)
    }
  })

  it('refuses saves from a newer version', () => {
    const s = { ...createInitialState(0), version: SAVE_VERSION + 1 }
    const r = deserialize(serialize(s))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/newer/)
  })

  it('caps the log ring buffer', () => {
    let s = createInitialState(0)
    for (let i = 0; i < LOG_LIMIT + 25; i++) s = pushLog(s, `entry ${i}`)
    expect(s.log).toHaveLength(LOG_LIMIT)
    expect(s.log[0].text).toBe('entry 25')
    expect(s.log.at(-1)?.text).toBe(`entry ${LOG_LIMIT + 24}`)
    expect(deserialize(serialize(s)).ok).toBe(true)
  })

  it('memory storage behaves like a key-value slot', () => {
    const st = createMemoryStorage()
    expect(st.load()).toBeNull()
    st.save('x')
    expect(st.load()).toBe('x')
    st.clear()
    expect(st.load()).toBeNull()
  })
})
