import { formatNumber } from '@/lib/format'
import { getCombatStats, type CombatStats } from './combat'
import { getGearDef } from './gear'
import { getTargetSlotForGear } from './forge'
import type { GameState, GearInstance } from './types'

/**
 * Tính toán Lực Chiến Tổng Hợp (Combat Power - CP ⚔️) dựa trên chỉ số thực chiến.
 * Trọng số được cân bằng để phản ánh chính xác hiệu năng chiến đấu (EHP & DPS).
 */
export function calculateCombatPower(stats: CombatStats): number {
  const hpScore = stats.hp * 0.2
  const atkScore = stats.atk * 2.5
  const defScore = stats.def * 1.8
  const critScore = stats.crit * 1500
  const critDmgScore = Math.max(0, stats.critMult - 1.5) * 800
  const lifestealScore = stats.lifesteal * 1200
  const dodgeScore = (stats.dodgeChance ?? 0) * 1200
  const armorPenScore = (stats.armorPen ?? 0) * 1000
  const dmgReductionScore = (stats.damageReduction ?? 0) * 2000
  const heavyDmgScore = (stats.heavyDmgPct ?? 0) * 800

  const basePower =
    hpScore +
    atkScore +
    defScore +
    critScore +
    critDmgScore +
    lifestealScore +
    dodgeScore +
    armorPenScore +
    dmgReductionScore +
    heavyDmgScore

  // Chuẩn hóa theo tần suất xuất chiêu (1000ms là mốc cơ sở)
  const attackSpeedMult = 1000 / Math.max(250, stats.attackMs)
  const totalCp = Math.round(basePower * attackSpeedMult)

  return Math.max(1, totalCp)
}

/**
 * Lấy Lực Chiến Hiện Tại của nhân vật từ GameState
 */
export function getCombatPower(state: GameState): number {
  const stats = getCombatStats(state)
  return calculateCombatPower(stats)
}

export interface GearDeltaResult {
  currentCP: number
  newCP: number
  delta: number
  isUpgrade: boolean
}

/**
 * Giả lập thay trang bị mới và tính toán độ chênh lệch Lực Chiến (CP Delta)
 */
export function calculateGearDelta(
  state: GameState,
  newGear: GearInstance | null,
): GearDeltaResult {
  const currentCP = getCombatPower(state)
  if (!newGear) {
    return {
      currentCP,
      newCP: currentCP,
      delta: 0,
      isUpgrade: false,
    }
  }

  const def = getGearDef(newGear)
  if (!def) {
    return {
      currentCP,
      newCP: currentCP,
      delta: 0,
      isUpgrade: false,
    }
  }

  const slot = getTargetSlotForGear(state, newGear)
  const currentEquippedUid = state.equipped[slot]

  // Nếu món mới chính là món đang mặc
  if (currentEquippedUid === newGear.uid) {
    return {
      currentCP,
      newCP: currentCP,
      delta: 0,
      isUpgrade: false,
    }
  }

  // Tạo state tạm giả lập thay đồ
  // Bảo đảm newGear có trong danh sách gear giả lập để getEquippedGear tìm thấy
  const hasNewGearInGear = state.gear.some((g) => g.uid === newGear.uid)
  const simulatedGear = hasNewGearInGear ? state.gear : [...state.gear, newGear]

  const simulatedState: GameState = {
    ...state,
    equipped: {
      ...state.equipped,
      [slot]: newGear.uid,
    },
    gear: simulatedGear,
  }

  const newCP = getCombatPower(simulatedState)
  const delta = newCP - currentCP

  return {
    currentCP,
    newCP,
    delta,
    isUpgrade: delta > 0,
  }
}

/**
 * Format hiển thị CP dạng chuẩn (VD: "1,250", "45.2K", "1.20M")
 */
export function formatCombatPower(cp: number): string {
  return formatNumber(cp, { style: 'standard' })
}

export interface FormattedCPDelta {
  text: string
  isPositive: boolean
  isZero: boolean
}

/**
 * Format hiển thị huy hiệu Delta so sánh đồ 1-chạm
 */
export function formatCPDelta(delta: number): FormattedCPDelta {
  if (delta === 0) {
    return { text: '— Tương đương', isPositive: false, isZero: true }
  }
  if (delta > 0) {
    return {
      text: `▲ +${formatCombatPower(delta)} ⚔️`,
      isPositive: true,
      isZero: false,
    }
  }
  return {
    text: `▼ -${formatCombatPower(Math.abs(delta))} ⚔️`,
    isPositive: false,
    isZero: false,
  }
}
