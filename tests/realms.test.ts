import { describe, expect, it } from 'vitest'
import { REALMS, REALM_INDEX_BY_ID } from '@/content/realms'

describe('realm table', () => {
  it('starts at Phàm Nhân and ends at a terminal Phi Thăng', () => {
    expect(REALMS[0].id).toBe('pham-nhan')
    expect(REALMS.at(-1)?.id).toBe('phi-thang')
    expect(REALMS.at(-1)?.terminal).toBe(true)
    expect(REALMS.slice(0, -1).every((r) => !r.terminal)).toBe(true)
  })

  it('has unique ids and a matching index map', () => {
    const ids = REALMS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id, i) => expect(REALM_INDEX_BY_ID[id]).toBe(i))
  })

  it('has strictly increasing qiRequired and qiRate across non-terminal stages', () => {
    const nonTerminal = REALMS.filter((r) => !r.terminal)
    for (let i = 1; i < nonTerminal.length; i++) {
      expect(nonTerminal[i].qiRequired).toBeGreaterThan(nonTerminal[i - 1].qiRequired)
      expect(nonTerminal[i].qiRate).toBeGreaterThan(nonTerminal[i - 1].qiRate)
    }
  })

  it('keeps breakthrough chance within [0, 1] and lifespan non-decreasing', () => {
    for (let i = 0; i < REALMS.length; i++) {
      const r = REALMS[i]
      expect(r.breakthroughChance).toBeGreaterThanOrEqual(0)
      expect(r.breakthroughChance).toBeLessThanOrEqual(1)
      if (i > 0) expect(r.lifespanYears).toBeGreaterThanOrEqual(REALMS[i - 1].lifespanYears)
    }
  })

  it('flags tribulation only on the last stage before a tribulation realm', () => {
    const lk9 = REALMS[REALM_INDEX_BY_ID['luyen-khi-9']]
    const tc4 = REALMS[REALM_INDEX_BY_ID['truc-co-4']]
    expect(lk9.tribulation).toBe(false)
    expect(tc4.tribulation).toBe(true)
    expect(REALMS[REALM_INDEX_BY_ID['truc-co-1']].tribulation).toBe(false)
  })

  it('names stages in Vietnamese', () => {
    expect(REALMS[REALM_INDEX_BY_ID['luyen-khi-3']].name).toBe('Luyện Khí Tầng 3')
    expect(REALMS[REALM_INDEX_BY_ID['kim-dan-1']].name).toBe('Kim Đan Sơ kỳ')
    expect(REALMS[0].name).toBe('Phàm Nhân')
  })
})
