import { describe, expect, it } from 'vitest'
import { REALMS, REALM_INDEX_BY_ID } from '@/content/realms'

describe('realm table', () => {
  it('starts at Phàm Tục and ends at a terminal Thập Ngũ Cảnh', () => {
    expect(REALMS[0].id).toBe('pham-tuc')
    expect(REALMS.at(-1)?.id).toBe('thap-ngu')
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

  it('flags tribulation only on stages before big leaps (Kim Đan, Nguyên Anh)', () => {
    const lm3 = REALMS[REALM_INDEX_BY_ID['long-mon-3']]
    const tt3 = REALMS[REALM_INDEX_BY_ID['truc-the-3']]
    const kd4 = REALMS[REALM_INDEX_BY_ID['kim-dan-4']]
    expect(tt3.tribulation).toBe(false)
    expect(lm3.tribulation).toBe(true)
    expect(kd4.tribulation).toBe(true)
    expect(REALMS[REALM_INDEX_BY_ID['dong-bi-1']].tribulation).toBe(false)
  })

  it('names stages in Vietnamese with Kiếm Lai lore', () => {
    expect(REALMS[0].name).toBe('Phàm Tục')
    expect(REALMS[REALM_INDEX_BY_ID['dong-bi-1']].name).toBe('Đồng Bì Cảnh · Sơ kỳ')
    expect(REALMS[REALM_INDEX_BY_ID['kim-dan-1']].name).toBe('Kim Đan Cảnh · Sơ kỳ')
    expect(REALMS[REALM_INDEX_BY_ID['thap-ngu']].name).toBe('Thập Ngũ Cảnh')
    expect(REALMS[REALM_INDEX_BY_ID['thap-ngu']].group).toBe('Thất Truyền Nhị Cảnh')
  })
})
