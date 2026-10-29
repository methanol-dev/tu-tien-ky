import type { ClassId } from '@/content/classes'
import { pushLog } from './log'
import type { FormationSlot, FormationState, GameState } from './types'

export const FORMATION_SLOTS: readonly FormationSlot[] = [
  'front-left',
  'front-mid',
  'front-right',
  'back-left',
  'back-mid',
  'back-right',
]

export const FORMATION_SLOT_NAMES: Record<FormationSlot, string> = {
  'front-left': 'Tiền Tả (Cánh Trái)',
  'front-mid': 'Tiền Trung (Tiên Phong)',
  'front-right': 'Tiền Hữu (Cánh Phải)',
  'back-left': 'Hậu Tả (Yểm Trợ Trái)',
  'back-mid': 'Hậu Trung (Trận Nhãn)',
  'back-right': 'Hậu Hữu (Yểm Trợ Phải)',
}

export function isFrontline(slot: FormationSlot): boolean {
  return slot.startsWith('front-')
}

export function isBackline(slot: FormationSlot): boolean {
  return slot.startsWith('back-')
}

export function getDefaultFormationSlot(classId: ClassId): FormationSlot {
  if (classId === 'vo-phu' || classId === 'phat-gia' || classId === 'binh-gia') {
    return 'front-mid'
  }
  return 'back-mid'
}

export function createInitialFormation(classId: ClassId = 'kiem-tu'): FormationState {
  return {
    playerSlot: getDefaultFormationSlot(classId),
  }
}

export interface PositionModifiers {
  hpMult: number
  defMult: number
  atkMult: number
  atkSpeedMult: number
  critBonus: number
}

/** Hệ số thuộc tính dựa theo vị trí đứng trên sa bàn */
export function getPositionModifiers(slot: FormationSlot): PositionModifiers {
  if (isFrontline(slot)) {
    return {
      hpMult: 1.15, // +15% HP
      defMult: 1.2, // +20% Thủ
      atkMult: 1.0,
      atkSpeedMult: 0.9, // -10% Tốc đánh (chịu đòn)
      critBonus: 0,
    }
  }
  // Hàng Hậu
  return {
    hpMult: 1.0,
    defMult: 0.85, // -15% Thủ (mỏng manh)
    atkMult: 1.15, // +15% Công (hỏa lực tự do)
    atkSpeedMult: 1.0,
    critBonus: 0.1, // +10% Tỷ lệ bạo kích
  }
}

/**
 * Vòng Ngũ Môn Tương Khắc (Kiếm Lai Five Factions Cycle):
 * Kiếm Tu > Nho Gia > Võ Phu > Đạo Gia > Phật Gia > Kiếm Tu
 */
const COUNTER_TARGETS: Record<ClassId, ClassId[]> = {
  'kiem-tu': ['nho-gia'],
  'nho-gia': ['vo-phu'],
  'vo-phu': ['dao-gia'],
  'dao-gia': ['phat-gia'],
  'phat-gia': ['kiem-tu'],
  'binh-gia': ['vo-phu', 'am-duong-gia'],
  'am-duong-gia': ['dao-gia', 'duoc-gia'],
  'duoc-gia': ['am-duong-gia'],
  'thuong-gia': ['mac-gia'],
  'mac-gia': ['kiem-tu', 'binh-gia'],
}

export interface CounterEffect {
  status: 'advantage' | 'disadvantage' | 'neutral'
  dmgDealMult: number
  dmgTakeMult: number
  desc: string
}

/** Xác định môn phái của kẻ địch / Boss */
export function getEnemyClass(enemy: { classId?: ClassId; silhouette?: string; id?: string }): ClassId {
  if (enemy?.classId) return enemy.classId

  // Suy đoán theo hình bóng (silhouette)
  switch (enemy?.silhouette) {
    case 'cultist':
    case 'dragonling':
      return 'dao-gia'
    case 'demon-general':
      return 'binh-gia'
    case 'skeleton-lord':
    case 'demon':
    case 'skeleton':
      return 'am-duong-gia'
    case 'wolf':
    case 'bear':
    case 'yeti':
    case 'serpent':
    case 'lizard':
    case 'bat':
    case 'snake':
    default:
      return 'vo-phu'
  }
}

/**
 * Tính toán hiệu ứng khắc chế giữa 2 môn phái
 */
export function getClassCounterEffect(attackerClass: ClassId, defenderClass: ClassId): CounterEffect {
  const isAdvantage = COUNTER_TARGETS[attackerClass]?.includes(defenderClass) ?? false
  const isDisadvantage = COUNTER_TARGETS[defenderClass]?.includes(attackerClass) ?? false

  if (isAdvantage) {
    return {
      status: 'advantage',
      dmgDealMult: 1.25, // +25% Sát thương gây ra
      dmgTakeMult: 0.85, // -15% Sát thương gánh chịu
      desc: 'Khắc chế (+25% Công, -15% Sát thương nhận)',
    }
  }

  if (isDisadvantage) {
    return {
      status: 'disadvantage',
      dmgDealMult: 0.85, // -15% Sát thương gây ra
      dmgTakeMult: 1.25, // +25% Sát thương gánh chịu
      desc: 'Bị áp chế (-15% Công, +25% Sát thương nhận)',
    }
  }

  return {
    status: 'neutral',
    dmgDealMult: 1.0,
    dmgTakeMult: 1.0,
    desc: 'Cân bằng thế cục',
  }
}

/** Chuyển vị trí đứng của người chơi trên sa bàn */
export function setPlayerFormationSlot(state: GameState, slot: FormationSlot): GameState {
  if (state.formation.playerSlot === slot) return state

  const posName = FORMATION_SLOT_NAMES[slot]
  let next: GameState = {
    ...state,
    formation: {
      ...state.formation,
      playerSlot: slot,
    },
  }

  const isFront = isFrontline(slot)
  next = pushLog(
    next,
    `Trận thế biến chuyển: Di chuyển tới [${posName}] (${isFront ? 'Hàng Tiền: +20% Thủ, +15% HP' : 'Hàng Hậu: +15% Công, +10% Bạo'})`,
    'info',
  )

  return next
}
