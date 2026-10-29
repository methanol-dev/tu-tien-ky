import { describe, expect, it } from 'vitest'
import {
  canClaimGrowthFund,
  claimGrowthFund,
  unlockPremiumGrowthFund,
  checkReliefTrigger,
  recordBossDefeat,
  claimReliefPack,
  consumeReliefBattleBuff,
  addWeeklyEventPoints,
  claimWeeklyMilestone,
  getSimulatedLeaderboard,
} from '@/engine/retention'
import { getCombatStats } from '@/engine/combat'
import { createInitialState } from '@/engine/state'

describe('Retention & Monetization Engine (Phase 6)', () => {
  describe('Growth Fund (Quỹ Trưởng Thành Đạo Đồ)', () => {
    it('only allows claiming unlocked milestones', () => {
      const s = createInitialState(0) // realmIndex 0 (Phàm Tục)
      expect(canClaimGrowthFund(s, 1, false)).toBe(false)

      s.realmIndex = 1 // Đồng Bì Cảnh
      expect(canClaimGrowthFund(s, 1, false)).toBe(true)
      expect(canClaimGrowthFund(s, 2, false)).toBe(false)
    })

    it('claims free milestone and prevents double claiming', () => {
      let s = createInitialState(0)
      s.realmIndex = 1
      const initialStones = s.stones
      const initialFire = s.forge.fireCount

      const res = claimGrowthFund(s, 1, false)
      expect(res.ok).toBe(true)
      if (!res.ok) return

      s = res.state
      expect(s.stones).toBe(initialStones + 1_000)
      expect(s.forge.fireCount).toBe(initialFire + 10)
      expect(s.growthFund.claimedFree).toContain(1)

      // Claim again should fail
      const res2 = claimGrowthFund(s, 1, false)
      expect(res2.ok).toBe(false)
    })

    it('unlocks premium tier and allows claiming premium rewards', () => {
      let s = createInitialState(0)
      s.realmIndex = 5 // Động Phủ Cảnh
      s.stones = 600_000

      // Cannot claim premium before unlocking
      expect(canClaimGrowthFund(s, 1, true)).toBe(false)

      // Unlock with stones
      const unlockRes = unlockPremiumGrowthFund(s, 'stones')
      expect(unlockRes.ok).toBe(true)
      if (!unlockRes.ok) return
      s = unlockRes.state
      expect(s.growthFund.premiumUnlocked).toBe(true)
      expect(s.stones).toBe(100_000) // 600k - 500k

      // Now can claim premium mốc 1
      const claimRes = claimGrowthFund(s, 1, true)
      expect(claimRes.ok).toBe(true)
      if (!claimRes.ok) return
      s = claimRes.state
      expect(s.growthFund.claimedPremium).toContain(1)
      expect(s.journey.chests.red).toBeGreaterThan(0)
      expect(s.inventory['quy-nguyen-dan']).toBe(2)
    })
  })

  describe('Emergency Relief Pack (Gói Cứu Viện Khi Kẹt Boss)', () => {
    it('triggers relief after 3 consecutive boss defeats', () => {
      let s = createInitialState(0)
      expect(checkReliefTrigger(s)).toBe(false)

      s = recordBossDefeat(s, false)
      s = recordBossDefeat(s, false)
      expect(s.relief.bossFailStreak).toBe(2)
      expect(checkReliefTrigger(s)).toBe(false)

      s = recordBossDefeat(s, false)
      expect(s.relief.bossFailStreak).toBe(3)
      expect(checkReliefTrigger(s)).toBe(true)

      // Defeating boss resets fail streak
      s = recordBossDefeat(s, true)
      expect(s.relief.bossFailStreak).toBe(0)
      expect(checkReliefTrigger(s)).toBe(false)
    })

    it('claims relief pack, grants items, and activates combat buff', () => {
      let s = createInitialState(0)
      const initialFire = s.forge.fireCount
      s = recordBossDefeat(s, false)
      s = recordBossDefeat(s, false)
      s = recordBossDefeat(s, false)

      const baseStats = getCombatStats(s)
      const res = claimReliefPack(s)
      expect(res.ok).toBe(true)
      if (!res.ok) return
      s = res.state

      expect(s.relief.activePack).not.toBeNull()
      expect(s.relief.activePack?.buffBattlesLeft).toBe(10)
      expect(s.inventory['ho-tam-dan']).toBe(3)
      expect(s.forge.fireCount).toBe(initialFire + 20)

      // Combat stats should be buffed by 20%
      const buffedStats = getCombatStats(s)
      expect(buffedStats.atk).toBeGreaterThan(baseStats.atk)
      expect(buffedStats.def).toBeGreaterThan(baseStats.def)

      // Buff decreases with battles
      s = consumeReliefBattleBuff(s)
      expect(s.relief.activePack?.buffBattlesLeft).toBe(9)
    })
  })

  describe('Weekly LiveOps Events & Simulated Leaderboard', () => {
    it('accumulates event points and allows claiming milestones', () => {
      let s = createInitialState(0)
      s.weeklyEvent.cycleWeek = 0 // Vạn Lô Tranh Huy

      s = addWeeklyEventPoints(s, 0, 150)
      expect(s.weeklyEvent.points).toBe(150)

      // Claim milestone 0 (100 points)
      const initialStones = s.stones
      const res = claimWeeklyMilestone(s, 0)
      expect(res.ok).toBe(true)
      if (!res.ok) return
      s = res.state

      expect(s.stones).toBe(initialStones + 5_000)
      expect(s.weeklyEvent.claimedMilestones).toContain(0)

      // Double claim fails
      const res2 = claimWeeklyMilestone(s, 0)
      expect(res2.ok).toBe(false)

      // Milestone 1 (500 pts) not reached yet
      const res3 = claimWeeklyMilestone(s, 1)
      expect(res3.ok).toBe(false)
    })

    it('places player in leaderboard based on points', () => {
      const s = createInitialState(0)
      s.weeklyEvent.points = 2_700 // higher than Ninh Diêu (2600), below Trần Bình An (3200)

      const board = getSimulatedLeaderboard(s)
      const player = board.find((e) => e.isPlayer)
      expect(player).toBeDefined()
      expect(player?.rank).toBe(2)
      expect(board[0].name).toBe('Trần Bình An')
      expect(board[1].name).toBe('Bản Đạo')
    })
  })
})
