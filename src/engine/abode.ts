import {
  ABODE_TIER_BY_NUMBER,
  ABODE_TIERS,
  type AbodeFacilityId,
  type AbodeTierDef,
  FACILITY_BY_ID,
  type FacilityDef,
} from '@/content/abode'
import { getGatherableHerbs, pickHerb } from './gather'
import { addItems } from './inventory'
import { pushLog } from './log'
import type { ActionResult, GameState, Rng } from './types'

export function getAbodeTierDef(state: GameState): AbodeTierDef {
  const tier = state.abode?.tier ?? 1
  return ABODE_TIER_BY_NUMBER[tier] ?? ABODE_TIERS[0]
}

export function getNextAbodeTierDef(state: GameState): AbodeTierDef | null {
  const currentTier = state.abode?.tier ?? 1
  return ABODE_TIER_BY_NUMBER[currentTier + 1] ?? null
}

export function canUpgradeAbodeTier(state: GameState): { can: boolean; reason?: string } {
  const next = getNextAbodeTierDef(state)
  if (!next) return { can: false, reason: 'Động phủ đã đạt đẳng cấp tối cao' }
  if (state.realmIndex < next.minRealmIndex) {
    return { can: false, reason: `Cần đạt cảnh giới cao hơn để thăng cấp ${next.name}` }
  }
  if (state.stones < next.costStones) {
    return { can: false, reason: `Không đủ linh thạch (cần ${next.costStones.toLocaleString()})` }
  }
  return { can: true }
}

export function upgradeAbodeTier(state: GameState): ActionResult {
  const check = canUpgradeAbodeTier(state)
  if (!check.can) return { ok: false, error: check.reason ?? 'Không thể thăng cấp' }
  const next = getNextAbodeTierDef(state)!
  const nextState: GameState = {
    ...state,
    stones: state.stones - next.costStones,
    abode: {
      ...state.abode,
      tier: next.tier,
    },
  }
  const logged = pushLog(
    nextState,
    `Động phủ thăng hoa tiến nhập 【${next.name}】! ${next.description}`,
    'success',
  )
  return { ok: true, state: logged }
}

export function getFacilityDef(id: AbodeFacilityId): FacilityDef {
  return FACILITY_BY_ID[id]
}

export function getFacilityCost(state: GameState, facilityId: AbodeFacilityId): number {
  const def = getFacilityDef(facilityId)
  const currentLvl = state.abode?.facilities[facilityId]?.level ?? 0
  return Math.floor(def.baseCost * (def.costMultiplier ** currentLvl))
}

export function canUpgradeFacility(
  state: GameState,
  facilityId: AbodeFacilityId,
): { can: boolean; reason?: string; cost: number } {
  const def = getFacilityDef(facilityId)
  const tierDef = getAbodeTierDef(state)
  const currentLvl = state.abode?.facilities[facilityId]?.level ?? 0
  const cost = getFacilityCost(state, facilityId)

  if (tierDef.tier < def.unlockTier) {
    return { can: false, reason: `Cần mở khóa ${ABODE_TIER_BY_NUMBER[def.unlockTier]?.name ?? 'Động phủ cấp cao'}`, cost }
  }
  if (currentLvl >= tierDef.maxFacilityLevel) {
    return { can: false, reason: 'Đã đạt cấp tối đa của tầng Động phủ hiện tại', cost }
  }
  if (state.stones < cost) {
    return { can: false, reason: `Cần ${cost.toLocaleString()} linh thạch`, cost }
  }
  return { can: true, cost }
}

export function upgradeFacility(state: GameState, facilityId: AbodeFacilityId): ActionResult {
  const check = canUpgradeFacility(state, facilityId)
  if (!check.can) return { ok: false, error: check.reason ?? 'Không thể nâng cấp' }
  const def = getFacilityDef(facilityId)
  const currentLvl = state.abode?.facilities[facilityId]?.level ?? 0
  const nextLvl = currentLvl + 1

  const nextState: GameState = {
    ...state,
    stones: state.stones - check.cost,
    abode: {
      ...state.abode,
      facilities: {
        ...state.abode.facilities,
        [facilityId]: { level: nextLvl },
      },
    },
  }
  const logged = pushLog(
    nextState,
    `【${def.name}】thăng cấp đạt Cấp ${nextLvl}. Hiệu suất Động phủ tăng tiến!`,
    'info',
  )
  return { ok: true, state: logged }
}

/** Thời gian sinh trưởng dược liệu ở Linh Điền: 60s cơ bản, giảm xuống tối đa 20s */
export function getHerbGardenIntervalMs(herbGardenLevel: number): number {
  return Math.max(20_000, 60_000 - herbGardenLevel * 1_500)
}

/** Số lượng dược liệu mỗi mẻ sản sinh */
export function getHerbGardenBatchCount(herbGardenLevel: number): number {
  return 1 + Math.floor(herbGardenLevel / 4)
}

/** Thu hoạch thủ công toàn bộ thảo dược trong kho Động Phủ */
export function harvestAbodeHerbs(
  state: GameState,
): ActionResult<{ state: GameState; gained: Record<string, number> }> {
  const stored = state.abode.storedHerbs
  const entries = Object.entries(stored).filter(([, count]) => count > 0)
  if (entries.length === 0) {
    return { ok: false, error: 'Linh điền chưa kết tinh thảo dược mới' }
  }

  const gained: Record<string, number> = { ...stored }
  let nextState = addItems(state, gained)
  nextState = {
    ...nextState,
    abode: {
      ...nextState.abode,
      storedHerbs: {},
    },
  }

  const summary = entries.map(([id, n]) => `${n} ${id}`).join(', ')
  const logged = pushLog(nextState, `Thu hoạch Linh Điền Động Phủ: ${summary}`, 'info')
  return { ok: true, state: { state: logged, gained } }
}

/**
 * Xử lý sinh trưởng Linh Điền & Chỉ Nhân tự động hóa theo thời gian
 */
export function simulateAbodeTick(state: GameState, rng: Rng): GameState {
  if (!state.abode) return state
  const herbLvl = state.abode.facilities.herbGarden?.level ?? 0
  if (herbLvl <= 0) return state

  const intervalMs = getHerbGardenIntervalMs(herbLvl)
  const elapsedSinceLast = state.playedMs - state.abode.lastHerbTickMs
  if (elapsedSinceLast < intervalMs) return state

  const availableHerbs = getGatherableHerbs(state)
  if (availableHerbs.length === 0) return state

  const cycles = Math.min(10, Math.floor(elapsedSinceLast / intervalMs))
  const batchCount = getHerbGardenBatchCount(herbLvl)
  const totalHerbsToPick = cycles * batchCount

  const newlyGained: Record<string, number> = {}
  for (let i = 0; i < totalHerbsToPick; i++) {
    const herb = pickHerb(availableHerbs, rng())
    newlyGained[herb.id] = (newlyGained[herb.id] ?? 0) + 1
  }

  const paperPuppetLvl = state.abode.facilities.paperPuppets?.level ?? 0
  const isAutoCollect = paperPuppetLvl >= 1 // Cấp 1 Chỉ Nhân tự gom vào túi đồ

  if (isAutoCollect) {
    const withItems = addItems(state, newlyGained)
    return {
      ...withItems,
      abode: {
        ...withItems.abode,
        lastHerbTickMs: state.playedMs,
      },
    }
  }

  // Tích lũy vào kho Động phủ chờ người chơi bấm gom
  const updatedStored: Record<string, number> = { ...state.abode.storedHerbs }
  for (const [id, count] of Object.entries(newlyGained)) {
    updatedStored[id] = (updatedStored[id] ?? 0) + count
  }

  return {
    ...state,
    abode: {
      ...state.abode,
      lastHerbTickMs: state.playedMs,
      storedHerbs: updatedStored,
    },
  }
}
