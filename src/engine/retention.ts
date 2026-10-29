import { pushLog } from './log'
import type { ActionResult, GameState } from './types'

// =========================================================================
// 1. QUỸ TRƯỞNG THÀNH · ĐẠO ĐỒ CƠ DUYÊN (GROWTH FUND)
// =========================================================================

export interface GrowthFundReward {
  stones: number
  fireCount: number
  redChests?: number
  pills?: Record<string, number>
}

export interface GrowthFundMilestone {
  realmIndex: number
  realmName: string
  freeReward: GrowthFundReward
  premiumReward: GrowthFundReward
}

export const GROWTH_FUND_MILESTONES: GrowthFundMilestone[] = [
  {
    realmIndex: 1, // Đồng Bì Cảnh
    realmName: 'Đồng Bì Cảnh',
    freeReward: { stones: 1_000, fireCount: 10 },
    premiumReward: { stones: 5_000, fireCount: 30, redChests: 1, pills: { 'quy-nguyen-dan': 2 } },
  },
  {
    realmIndex: 2, // Thao Căn Cảnh
    realmName: 'Thao Căn Cảnh',
    freeReward: { stones: 3_000, fireCount: 15 },
    premiumReward: { stones: 15_000, fireCount: 40, redChests: 2, pills: { 'tu-linh-dan': 2 } },
  },
  {
    realmIndex: 3, // Liễu Cốt Cảnh
    realmName: 'Liễu Cốt Cảnh',
    freeReward: { stones: 8_000, fireCount: 20 },
    premiumReward: { stones: 40_000, fireCount: 50, redChests: 3 },
  },
  {
    realmIndex: 4, // Khí Cốt Cảnh
    realmName: 'Khí Cốt Cảnh',
    freeReward: { stones: 20_000, fireCount: 25 },
    premiumReward: { stones: 100_000, fireCount: 60, redChests: 5, pills: { 'ho-tam-dan': 3 } },
  },
  {
    realmIndex: 5, // Động Phủ Cảnh
    realmName: 'Động Phủ Cảnh',
    freeReward: { stones: 50_000, fireCount: 30, redChests: 1 },
    premiumReward: { stones: 250_000, fireCount: 80, redChests: 8, pills: { 'truc-co-dan': 2 } },
  },
  {
    realmIndex: 6, // Quán Đỉnh Cảnh
    realmName: 'Quán Đỉnh Cảnh',
    freeReward: { stones: 150_000, fireCount: 40, redChests: 2 },
    premiumReward: { stones: 600_000, fireCount: 100, redChests: 12 },
  },
  {
    realmIndex: 7, // Long Môn Cảnh
    realmName: 'Long Môn Cảnh',
    freeReward: { stones: 500_000, fireCount: 50, redChests: 3 },
    premiumReward: { stones: 2_000_000, fireCount: 150, redChests: 15, pills: { 'ho-tam-dan': 5 } },
  },
  {
    realmIndex: 8, // Kim Đan Cảnh
    realmName: 'Kim Đan Cảnh',
    freeReward: { stones: 1_500_000, fireCount: 60, redChests: 5 },
    premiumReward: { stones: 6_000_000, fireCount: 200, redChests: 20 },
  },
  {
    realmIndex: 9, // Nguyên Anh Cảnh
    realmName: 'Nguyên Anh Cảnh',
    freeReward: { stones: 5_000_000, fireCount: 80, redChests: 8 },
    premiumReward: { stones: 20_000_000, fireCount: 300, redChests: 30 },
  },
  {
    realmIndex: 10, // Ngọc Phác Cảnh
    realmName: 'Ngọc Phác Cảnh',
    freeReward: { stones: 15_000_000, fireCount: 100, redChests: 10 },
    premiumReward: { stones: 60_000_000, fireCount: 400, redChests: 40 },
  },
  {
    realmIndex: 11, // Tiên Nhân Cảnh
    realmName: 'Tiên Nhân Cảnh',
    freeReward: { stones: 50_000_000, fireCount: 150, redChests: 15 },
    premiumReward: { stones: 200_000_000, fireCount: 500, redChests: 50 },
  },
  {
    realmIndex: 12, // Phi Thăng Cảnh
    realmName: 'Phi Thăng Cảnh',
    freeReward: { stones: 200_000_000, fireCount: 200, redChests: 20 },
    premiumReward: { stones: 1_000_000_000, fireCount: 1_000, redChests: 100 },
  },
]

export function canClaimGrowthFund(state: GameState, realmIndex: number, isPremium: boolean): boolean {
  if (state.realmIndex < realmIndex) return false
  const fund = state.growthFund
  if (isPremium) {
    if (!fund.premiumUnlocked) return false
    return !fund.claimedPremium.includes(realmIndex)
  }
  return !fund.claimedFree.includes(realmIndex)
}

export function claimGrowthFund(
  state: GameState,
  realmIndex: number,
  isPremium: boolean,
): ActionResult {
  const milestone = GROWTH_FUND_MILESTONES.find((m) => m.realmIndex === realmIndex)
  if (!milestone) return { ok: false, error: 'Mốc cảnh giới không hợp lệ.' }

  if (!canClaimGrowthFund(state, realmIndex, isPremium)) {
    return { ok: false, error: 'Chưa đủ cảnh giới hoặc phần thưởng đã được lĩnh nhận.' }
  }

  const reward = isPremium ? milestone.premiumReward : milestone.freeReward
  let next = { ...state }

  // Nhận linh thạch
  next.stones += reward.stones

  // Nhận chân hỏa
  next.forge = {
    ...next.forge,
    fireCount: next.forge.fireCount + reward.fireCount,
  }

  // Nhận rương đỏ (nếu có)
  if (reward.redChests && reward.redChests > 0) {
    next.journey = {
      ...next.journey,
      chests: {
        ...next.journey.chests,
        red: next.journey.chests.red + reward.redChests,
      },
    }
  }

  // Nhận đan dược (nếu có)
  if (reward.pills) {
    const inv = { ...next.inventory }
    for (const [pillId, count] of Object.entries(reward.pills)) {
      inv[pillId] = (inv[pillId] ?? 0) + count
    }
    next.inventory = inv
  }

  // Cập nhật danh sách đã nhận
  const fund = { ...next.growthFund }
  if (isPremium) {
    fund.claimedPremium = [...fund.claimedPremium, realmIndex]
  } else {
    fund.claimedFree = [...fund.claimedFree, realmIndex]
  }
  next.growthFund = fund

  const tierName = isPremium ? 'Tiên Thiên Cơ Duyên' : 'Đạo Đồ Cơ Duyên'
  next = pushLog(
    next,
    `Lĩnh nhận phần thưởng ${tierName} mốc ${milestone.realmName}: +${reward.stones} linh thạch, +${reward.fireCount} Chân Hỏa.`,
    'success',
  )

  return { ok: true, state: next }
}

export function unlockPremiumGrowthFund(
  state: GameState,
  currency: 'daoVan' | 'stones',
): ActionResult {
  if (state.growthFund.premiumUnlocked) {
    return { ok: false, error: 'Tiên Thiên Cơ Duyên đã được mở khóa.' }
  }

  let next = { ...state }
  if (currency === 'daoVan') {
    if ((next.legacy?.daoVan ?? 0) < 50) {
      return { ok: false, error: 'Không đủ Đạo Văn (cần 50 Đạo Văn).' }
    }
    next.legacy = {
      ...next.legacy,
      daoVan: next.legacy.daoVan - 50,
    }
  } else {
    if (next.stones < 500_000) {
      return { ok: false, error: 'Không đủ Linh Thạch (cần 500,000 Linh Thạch).' }
    }
    next.stones -= 500_000
  }

  next.growthFund = {
    ...next.growthFund,
    premiumUnlocked: true,
  }

  next = pushLog(
    next,
    `Khai mở thành công Tiên Thiên Cơ Duyên bằng ${currency === 'daoVan' ? '50 Đạo Văn' : '500,000 Linh Thạch'}. Toàn bộ cơ duyên nhân ba!`,
    'success',
  )

  return { ok: true, state: next }
}

// =========================================================================
// 2. GÓI CỨU VIỆN KHI NGÃ NGỰA · HỘ MỆNH PHÙ LỤC (EMERGENCY RELIEF)
// =========================================================================

export function checkReliefTrigger(state: GameState): boolean {
  return (
    state.relief.bossFailStreak >= 3 &&
    state.relief.lastOfferedAtRealm !== state.realmIndex &&
    state.relief.activePack === null
  )
}

export function recordBossDefeat(state: GameState, won: boolean): GameState {
  const current = state.relief
  if (won) {
    if (current.bossFailStreak === 0) return state
    return {
      ...state,
      relief: {
        ...current,
        bossFailStreak: 0,
      },
    }
  }

  return {
    ...state,
    relief: {
      ...current,
      bossFailStreak: current.bossFailStreak + 1,
    },
  }
}

export function claimReliefPack(state: GameState): ActionResult {
  let next = { ...state }

  // Nhận 20 Chân hỏa
  next.forge = {
    ...next.forge,
    fireCount: next.forge.fireCount + 20,
  }

  // Nhận 3 Hộ Tâm Đan
  const inv = { ...next.inventory }
  inv['ho-tam-dan'] = (inv['ho-tam-dan'] ?? 0) + 3
  next.inventory = inv

  // Kích hoạt buff Kim Quang Phù trong 10 trận kế tiếp
  next.relief = {
    bossFailStreak: 0,
    lastOfferedAtRealm: next.realmIndex,
    activePack: {
      id: 'ho-menh-phu-luc',
      name: 'Kim Quang Hộ Thể Phù',
      buffBattlesLeft: 10,
      fireCount: 20,
    },
  }

  next = pushLog(
    next,
    `Thôi Thành Tiên Sinh ban tặng Hộ Mệnh Phù Lục: +20 Chân Hỏa, +3 Hộ Tâm Đan, +20% Công Thủ trong 10 trận trảm yêu kế tiếp!`,
    'event',
  )

  return { ok: true, state: next }
}

export function dismissReliefPack(state: GameState): GameState {
  return {
    ...state,
    relief: {
      ...state.relief,
      lastOfferedAtRealm: state.realmIndex,
    },
  }
}

export function consumeReliefBattleBuff(state: GameState): GameState {
  const active = state.relief.activePack
  if (!active || active.buffBattlesLeft <= 0) return state

  const nextLeft = active.buffBattlesLeft - 1
  return {
    ...state,
    relief: {
      ...state.relief,
      activePack: nextLeft > 0 ? { ...active, buffBattlesLeft: nextLeft } : null,
    },
  }
}

// =========================================================================
// 3. SỰ KIỆN XOAY VÒNG HÀNG TUẦN (LIVEOPS ROTATION & SIMULATED LEADERBOARD)
// =========================================================================

export const WEEKLY_CYCLES = [
  {
    week: 0,
    name: 'Vạn Lô Tranh Huy',
    theme: 'Đan Lô Luyện Khí',
    desc: 'Đập lò rèn đồ xuất thế, kích hoạt bảo khí thiên địa.',
    icon: '🔥',
  },
  {
    week: 1,
    name: 'Thí Kiếm Trường Thành',
    theme: 'Bản Mệnh Phi Kiếm',
    desc: 'Tôi luyện phi kiếm trong khí phủ, ngưng tụ kiếm khí sát địch.',
    icon: '🗡️',
  },
  {
    week: 2,
    name: 'Dược Vương Đỉnh',
    theme: 'Luyện Đan Diệu Thuật',
    desc: 'Hái linh thảo ngàn năm, luyện linh đan chuyển sinh.',
    icon: '🌿',
  },
  {
    week: 3,
    name: 'Đại Hoang Thí Luyện',
    theme: 'Hành Tẩu Trảm Yêu',
    desc: 'Trảm sát yêu ma quỷ quái, khai phá vùng đất hoang sơ.',
    icon: '⚔️',
  },
] as const

export const WEEKLY_MILESTONES = [
  { points: 100, reward: { stones: 5_000, fireCount: 10 } },
  { points: 500, reward: { stones: 20_000, fireCount: 20, redChests: 2 } },
  { points: 1_500, reward: { stones: 50_000, fireCount: 50, redChests: 5 } },
  { points: 3_000, reward: { stones: 150_000, fireCount: 100, redChests: 10 } },
]

const MS_PER_WEEK = 7 * 24 * 3600 * 1000

export function syncWeeklyEventCycle(state: GameState): GameState {
  const currentWeek = Math.floor(state.playedMs / MS_PER_WEEK) % 4
  if (state.weeklyEvent.cycleWeek === currentWeek) return state

  // Xoay vòng sang tuần mới: reset điểm và các mốc đã nhận
  return {
    ...state,
    weeklyEvent: {
      cycleWeek: currentWeek,
      points: 0,
      claimedMilestones: [],
    },
  }
}

export function addWeeklyEventPoints(
  state: GameState,
  targetCycle: number,
  points: number,
): GameState {
  const synced = syncWeeklyEventCycle(state)
  if (synced.weeklyEvent.cycleWeek !== targetCycle) return synced

  return {
    ...synced,
    weeklyEvent: {
      ...synced.weeklyEvent,
      points: synced.weeklyEvent.points + points,
    },
  }
}

export function claimWeeklyMilestone(
  state: GameState,
  milestoneIdx: number,
): ActionResult {
  const synced = syncWeeklyEventCycle(state)
  const milestone = WEEKLY_MILESTONES[milestoneIdx]
  if (!milestone) return { ok: false, error: 'Mốc phần thưởng không hợp lệ.' }

  if (synced.weeklyEvent.points < milestone.points) {
    return { ok: false, error: 'Chưa đủ điểm tích lũy.' }
  }

  if (synced.weeklyEvent.claimedMilestones.includes(milestoneIdx)) {
    return { ok: false, error: 'Phần thưởng này đã được lĩnh nhận.' }
  }

  let next = { ...synced }
  next.stones += milestone.reward.stones
  next.forge = {
    ...next.forge,
    fireCount: next.forge.fireCount + milestone.reward.fireCount,
  }

  if (milestone.reward.redChests && milestone.reward.redChests > 0) {
    next.journey = {
      ...next.journey,
      chests: {
        ...next.journey.chests,
        red: next.journey.chests.red + milestone.reward.redChests,
      },
    }
  }

  next.weeklyEvent = {
    ...next.weeklyEvent,
    claimedMilestones: [...next.weeklyEvent.claimedMilestones, milestoneIdx],
  }

  next = pushLog(
    next,
    `Lĩnh nhận phần thưởng sự kiện tuần mốc ${milestone.points} điểm: +${milestone.reward.stones} linh thạch, +${milestone.reward.fireCount} Chân Hỏa.`,
    'success',
  )

  return { ok: true, state: next }
}

export interface LeaderboardEntry {
  rank: number
  name: string
  title: string
  points: number
  isPlayer?: boolean
}

export function getSimulatedLeaderboard(state: GameState): LeaderboardEntry[] {
  const synced = syncWeeklyEventCycle(state)
  const playerPoints = synced.weeklyEvent.points

  const npcs = [
    { name: 'Trần Bình An', title: 'Cảnh Hưu Đạo Nhân', points: 3_200 },
    { name: 'Ninh Diêu', title: 'Kiếm Tiên Trường Thành', points: 2_600 },
    { name: 'A Lương', title: 'Mạnh Nhất Thập Tứ Cảnh', points: 2_150 },
    { name: 'Tề Tĩnh Xuân', title: 'Sơn Nhai Sơn Chủ', points: 1_700 },
    { name: 'Tùy Hữu Biên', title: 'Si Kiếm Tu Sĩ', points: 1_250 },
    { name: 'Ngụy Tấn', title: 'Phong Tuyết Miếu Kiếm Tiên', points: 820 },
    { name: 'Tống Tập Tân', title: 'Đại Ly Hoàng Đế', points: 410 },
    { name: 'Cố Xán', title: 'Thư Giản Hồ Tiểu Ma Đầu', points: 120 },
  ]

  const list: { name: string; title: string; points: number; isPlayer: boolean }[] = [
    ...npcs.map((n) => ({ ...n, isPlayer: false })),
    { name: 'Bản Đạo', title: 'Thiếu Niên Hành Tẩu', points: playerPoints, isPlayer: true },
  ]

  list.sort((a, b) => b.points - a.points)

  return list.map((item, idx) => ({
    rank: idx + 1,
    name: item.name,
    title: item.title,
    points: item.points,
    isPlayer: item.isPlayer,
  }))
}
