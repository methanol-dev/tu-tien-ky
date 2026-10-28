import { describe, expect, it } from 'vitest'
import {
  MARTIAL_STAGES,
  getMartialPunches,
  getMartialRealm,
  getNextMartialRealm,
} from '@/content/martialRealms'

describe('martialRealms content', () => {
  it('defines 11 martial stages from Ne Phoi to Vo Than', () => {
    expect(MARTIAL_STAGES).toHaveLength(11)
    expect(MARTIAL_STAGES[0].name).toBe('Nê Phôi Cảnh')
    expect(MARTIAL_STAGES[0].minPunches).toBe(0)
    expect(MARTIAL_STAGES[9].name).toBe('Chỉ Cảnh (Quy Chân)')
    expect(MARTIAL_STAGES[10].name).toBe('Võ Thần Cảnh')
  })

  it('calculates punches correctly from stats', () => {
    const stats = {
      enemiesSlain: 100,
      bossesSlain: 5,
      stagesCleared: 10,
      breakthroughs: 2,
    }
    // 100 + 5*10 + 10*5 + 2*50 = 100 + 50 + 50 + 100 = 300
    expect(getMartialPunches(stats)).toBe(300)
  })

  it('resolves martial realms and next stage', () => {
    // 0 punches -> Ne Phoi
    expect(getMartialRealm(0).id).toBe('ne-phoi')
    expect(getNextMartialRealm(0)?.id).toBe('moc-thai')

    // 250 punches -> Thuy Ngan Canh (min 200, next Anh Hon at 600)
    expect(getMartialRealm(250).id).toBe('thuy-ngan')
    expect(getNextMartialRealm(250)?.id).toBe('anh-hon')

    // 85,000 punches -> Chi Canh (Quy Chan)
    expect(getMartialRealm(85_000).id).toBe('chi-canh')
    expect(getNextMartialRealm(85_000)?.id).toBe('vo-than')

    // 200,000 punches -> Vo Than (max stage)
    expect(getMartialRealm(200_000).id).toBe('vo-than')
    expect(getNextMartialRealm(200_000)).toBeNull()
  })
})
