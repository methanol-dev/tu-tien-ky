import { RARITIES, RARITY_NAME, type Rarity, SALVAGE_SECONDS } from '@/content/affixes'
import {
  GEAR_TYPES,
  type GearSlot,
  getSlotsForType,
} from '@/content/gear'
import { getStoneRate } from './economy'
import { compareGearStats, gearScore, getGearDef, isGearFull, rollGear } from './gear'
import { pushLog } from './log'
import { addWeeklyEventPoints } from './retention'
import type { ActionResult, ForgeAutoFilters, ForgeState, GameState, GearInstance, Rng } from './types'

export const FORGE_MAX_LEVEL = 20

/** EXP required to advance from level L to L+1 (index 0 is unused, index 1 is level 1 -> 2). */
export const FORGE_EXP_TABLE: readonly number[] = [
  0,
  10, // Lv 1 -> 2
  25, // Lv 2 -> 3
  50, // Lv 3 -> 4
  90, // Lv 4 -> 5
  150, // Lv 5 -> 6
  230, // Lv 6 -> 7
  350, // Lv 7 -> 8
  520, // Lv 8 -> 9
  750, // Lv 9 -> 10
  1100, // Lv 10 -> 11
  1600, // Lv 11 -> 12
  2300, // Lv 12 -> 13
  3300, // Lv 13 -> 14
  4800, // Lv 14 -> 15
  7000, // Lv 15 -> 16
  10000, // Lv 16 -> 17
  15000, // Lv 17 -> 18
  22000, // Lv 18 -> 19
  32000, // Lv 19 -> 20
]

/**
 * Phẩm chất trang bị rớt ra theo cấp Đan Lô (index 0 = Lv 1, index 19 = Lv 20).
 * Thứ tự trọng số: [Phàm, Linh, Bảo, Tiên, Thần]
 */
export const FORGE_RARITY_TABLE: readonly (readonly number[])[] = [
  [85, 14.5, 0.5, 0, 0], // Lv 1
  [75, 22, 3, 0, 0], // Lv 2
  [65, 28, 6.8, 0.2, 0], // Lv 3
  [55, 34, 10.5, 0.5, 0], // Lv 4
  [45, 38, 15.5, 1.5, 0], // Lv 5
  [35, 42, 20.5, 2.5, 0], // Lv 6
  [25, 45, 26, 4, 0], // Lv 7
  [18, 46, 31, 5, 0], // Lv 8
  [12, 45, 36, 6.8, 0.2], // Lv 9
  [8, 42, 41, 8.5, 0.5], // Lv 10
  [5, 38, 45, 11, 1], // Lv 11
  [3, 33, 48, 14.5, 1.5], // Lv 12
  [1.5, 27.5, 50, 18.5, 2.5], // Lv 13
  [0.5, 22, 50, 23.5, 4], // Lv 14
  [0, 17, 49, 28, 6], // Lv 15
  [0, 12, 46, 33, 9], // Lv 16
  [0, 8, 42, 37, 13], // Lv 17
  [0, 5, 36, 41, 18], // Lv 18
  [0, 2, 30, 44, 24], // Lv 19
  [0, 0, 20, 50, 30], // Lv 20
]

export const FORGE_EXP_BY_RARITY: Record<Rarity, number> = {
  pham: 1,
  linh: 2,
  bao: 5,
  tien: 15,
  than: 50,
}

export const FORGE_PITY_THRESHOLD = 10

export function createInitialForge(): ForgeState {
  return {
    level: 1,
    exp: 0,
    fireCount: 50, // Tặng 50 Chân Hỏa ban đầu cho người chơi trải nghiệm
    pendingGear: null,
    autoFilters: {
      stopOnHigherScore: true,
      minRarity: 'bao',
    },
    pityCount: 0,
  }
}

/** Tỷ lệ quay phẩm chất dựa trên cấp Đan Lô (hỗ trợ ép phẩm chất tối thiểu từ Bảo Hiểm Pity) */
export function rollForgeRarity(level: number, rng: Rng, forceMinRarity?: Rarity): Rarity {
  const tableIndex = Math.min(FORGE_MAX_LEVEL - 1, Math.max(0, level - 1))
  const weights = [...FORGE_RARITY_TABLE[tableIndex]]

  if (forceMinRarity) {
    const minIdx = RARITIES.indexOf(forceMinRarity)
    for (let i = 0; i < minIdx; i++) {
      weights[i] = 0
    }
  }

  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return forceMinRarity ?? 'bao'

  let roll = Math.min(total - 1e-9, rng() * total)
  let lastNonZero = 0
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] <= 0) continue
    lastNonZero = i
    roll -= weights[i]
    if (roll <= 0) return RARITIES[i]
  }
  return RARITIES[lastNonZero]
}

/** Tính toán tier trang bị rèn ra từ Đan Lô theo cảnh giới người chơi */
export function getForgeGearTier(state: GameState): number {
  return Math.max(1, Math.min(8, Math.floor(state.realmIndex / 3) + 1))
}

/** Tìm ô slot trang bị phù hợp nhất cho 1 món đồ mới */
export function getTargetSlotForGear(state: GameState, gear: GearInstance): GearSlot {
  const def = getGearDef(gear)
  const slots = getSlotsForType(def.slot)
  if (slots.length === 1) return slots[0]

  // Nếu có 2 slot cùng loại (như 2 nhẫn, 2 bông tai):
  // Ưu tiên slot đang trống hoặc slot có món yếu hơn
  const slot1 = slots[0]
  const slot2 = slots[1]
  const g1 = state.gear.find((g) => g.uid === state.equipped[slot1])
  const g2 = state.gear.find((g) => g.uid === state.equipped[slot2])

  if (!g1) return slot1
  if (!g2) return slot2

  return gearScore(g1) <= gearScore(g2) ? slot1 : slot2
}

/** Kiểm tra xem có thể đập lò được không */
export function canForge(state: GameState): boolean {
  if (state.forge.pendingGear !== null) return false
  if (state.forge.fireCount <= 0) return false
  if (isGearFull(state)) return false
  return true
}

export interface ForgeResult {
  state: GameState
  gear: GearInstance
  slot: GearSlot
  isUpgrade: boolean
  scoreDiff: number
  isPity: boolean
  luckyCrit: boolean
}

/**
 * Thực hiện 1 cú Đập Lô Luyện Khí (1-Click Gacha)
 */
export function forgeGear(state: GameState, rng: Rng): ActionResult<ForgeResult> {
  if (state.forge.pendingGear) {
    return { ok: false, error: 'Hãy quyết định trang bị đang luyện trước' }
  }
  if (state.forge.fireCount <= 0) {
    return { ok: false, error: 'Hết Chân Hỏa. Hãy tích lũy khi hành tẩu hoặc đổi bằng linh thạch.' }
  }
  if (isGearFull(state)) {
    return { ok: false, error: 'Túi trang bị đã đầy. Hãy phân giải bớt đồ rác.' }
  }

  const level = state.forge.level
  const currentPity = state.forge.pityCount ?? 0
  const isPity = currentPity >= FORGE_PITY_THRESHOLD - 1
  const rarity = isPity ? rollForgeRarity(level, rng, 'bao') : rollForgeRarity(level, rng)
  const isHighRarity = rarity === 'bao' || rarity === 'tien' || rarity === 'than'
  const newPityCount = isHighRarity ? 0 : currentPity + 1

  // 5% tỉ lệ nổ "Đại Bạo Kích Luyện Khí" (Lucky Forge Jackpot)
  const luckyCrit = rng() < 0.05
  const fireDelta = luckyCrit ? 0 : -1 // Hoàn trả 1 Chân Hỏa khi đại bạo kích
  const bonusStones = luckyCrit ? 200 : 0

  const type = GEAR_TYPES[Math.floor(rng() * GEAR_TYPES.length)]
  const tier = getForgeGearTier(state)
  const uid = `forge_${Date.now()}_${state.nextGearUid}`

  const gear = rollGear(type, rarity, tier, uid, rng)
  const slot = getTargetSlotForGear(state, gear)
  const currentUid = state.equipped[slot]
  const currentGear = currentUid ? state.gear.find((g) => g.uid === currentUid) ?? null : null
  const comp = compareGearStats(currentGear, gear)
  const isUpgrade = comp.scoreDiff > 0

  let next: GameState = {
    ...state,
    stones: state.stones + bonusStones,
    nextGearUid: state.nextGearUid + 1,
    forge: {
      ...state.forge,
      fireCount: state.forge.fireCount + fireDelta,
      pendingGear: gear,
      pityCount: newPityCount,
    },
    stats: {
      ...state.stats,
      stonesTotal: state.stats.stonesTotal + bonusStones,
      gearFound: state.stats.gearFound + 1,
    },
  }

  const rarityColor = rarity === 'than' || rarity === 'tien' || luckyCrit ? 'event' : 'info'
  const pts = rarity === 'than' || rarity === 'tien' || rarity === 'bao' ? 30 : 10
  next = addWeeklyEventPoints(next, 0, pts)

  const pityText = isPity ? ' [🎁 BẢO HIỂM NỔ HŨ]' : ''
  const critText = luckyCrit ? ' [🎉 ĐẠI BẠO KÍCH: Hoàn Chân Hỏa + 200 Linh Thạch!]' : ''
  next = pushLog(
    next,
    `🔥 Đan Lô bùng nổ${pityText}${critText}, rèn ra [${RARITY_NAME[rarity]}] phẩm trang bị! (${isUpgrade ? `+${comp.scoreDiff} Lực Chiến` : `${comp.scoreDiff} Lực Chiến`})`,
    rarityColor,
  )

  return {
    ok: true,
    state: {
      state: next,
      gear,
      slot,
      isUpgrade,
      scoreDiff: comp.scoreDiff,
      isPity,
      luckyCrit,
    },
  }
}

/**
 * Phân giải trang bị đang chờ để lấy EXP Đan Lô và Linh Thạch
 */
export function salvagePendingGear(state: GameState): GameState {
  const gear = state.forge.pendingGear
  if (!gear) return state

  const expGained = FORGE_EXP_BY_RARITY[gear.rarity]
  const stoneGained = Math.round(SALVAGE_SECONDS[gear.rarity] * getStoneRate(state))

  let newLevel = state.forge.level
  let newExp = state.forge.exp + expGained

  // Xử lý thăng cấp Đan Lô
  while (newLevel < FORGE_MAX_LEVEL) {
    const needed = FORGE_EXP_TABLE[newLevel] ?? 999999
    if (newExp >= needed) {
      newExp -= needed
      newLevel += 1
    } else {
      break
    }
  }

  let next: GameState = {
    ...state,
    stones: state.stones + stoneGained,
    forge: {
      ...state.forge,
      level: newLevel,
      exp: newExp,
      pendingGear: null,
    },
    stats: {
      ...state.stats,
      stonesTotal: state.stats.stonesTotal + stoneGained,
    },
  }

  if (newLevel > state.forge.level) {
    next = pushLog(
      next,
      `✨ Đan Lô thăng cấp lên Cấp ${newLevel}! Tỷ lệ rèn trang bị phẩm cao tăng vọt!`,
      'success',
    )
  }

  return next
}

/**
 * Mặc trang bị đang chờ vào người (thay thế món cũ)
 */
export function equipPendingGear(state: GameState): GameState {
  const gear = state.forge.pendingGear
  if (!gear) return state

  const slot = getTargetSlotForGear(state, gear)
  const oldUid = state.equipped[slot]

  // Cho món mới vào kho đồ gear và gắn vào equipped
  const updatedGearList = [...state.gear, gear]
  const updatedEquipped = { ...state.equipped, [slot]: gear.uid }

  // Tự động phân giải món cũ để lấy EXP và chỗ trống (nếu có món cũ)
  let nextState: GameState = {
    ...state,
    gear: updatedGearList,
    equipped: updatedEquipped,
    forge: {
      ...state.forge,
      pendingGear: null,
    },
  }

  if (oldUid) {
    const oldGear = state.gear.find((g) => g.uid === oldUid)
    if (oldGear) {
      // Phân giải món cũ tự động
      const expGained = FORGE_EXP_BY_RARITY[oldGear.rarity]
      const stoneGained = Math.round(SALVAGE_SECONDS[oldGear.rarity] * getStoneRate(state))

      let newLevel = nextState.forge.level
      let newExp = nextState.forge.exp + expGained
      while (newLevel < FORGE_MAX_LEVEL) {
        const needed = FORGE_EXP_TABLE[newLevel] ?? 999999
        if (newExp >= needed) {
          newExp -= needed
          newLevel += 1
        } else {
          break
        }
      }

      nextState = {
        ...nextState,
        stones: nextState.stones + stoneGained,
        gear: nextState.gear.filter((g) => g.uid !== oldUid),
        forge: {
          ...nextState.forge,
          level: newLevel,
          exp: newExp,
        },
        stats: {
          ...nextState.stats,
          stonesTotal: nextState.stats.stonesTotal + stoneGained,
        },
      }
    }
  }

  nextState = pushLog(
    nextState,
    `🗡️ Trang bị thành công [${gear.defId}]. Lực chiến tăng vọt!`,
    'success',
  )

  return nextState
}

/** Bổ sung Chân Hỏa */
export function addFire(state: GameState, amount: number): GameState {
  if (amount <= 0) return state
  return {
    ...state,
    forge: {
      ...state.forge,
      fireCount: state.forge.fireCount + amount,
    },
  }
}

/** Mua Chân Hỏa bằng Linh Thạch */
export function buyFire(state: GameState, count: number): ActionResult {
  if (count <= 0) return { ok: false, error: 'Số lượng không hợp lệ' }
  const unitPrice = Math.max(50, Math.round(getStoneRate(state) * 10))
  const totalCost = unitPrice * count
  if (state.stones < totalCost) {
    return { ok: false, error: `Không đủ linh thạch (Cần ${totalCost} linh thạch)` }
  }

  let next: GameState = {
    ...state,
    stones: state.stones - totalCost,
    forge: {
      ...state.forge,
      fireCount: state.forge.fireCount + count,
    },
  }

  next = pushLog(next, `Mua ${count} Chân Hỏa tiêu hao ${totalCost} linh thạch.`, 'info')
  return { ok: true, state: next }
}

/** Cập nhật bộ lọc tự động Auto-Forge */
export function updateForgeFilters(state: GameState, filters: Partial<ForgeAutoFilters>): GameState {
  return {
    ...state,
    forge: {
      ...state.forge,
      autoFilters: {
        ...state.forge.autoFilters,
        ...filters,
      },
    },
  }
}
