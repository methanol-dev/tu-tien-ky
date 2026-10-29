import { REALM_INDEX_BY_ID } from '@/content/realms'
import { isReincarnationForced } from './prestige'
import type { GameState } from './types'

export type FeatureId =
  | 'techniques'
  | 'forge'
  | 'formation'
  | 'swords'
  | 'alchemy'
  | 'legacy'

export interface FeatureUnlockDef {
  id: FeatureId
  name: string
  requirementDesc: string
  isUnlocked: (state: GameState) => boolean
}

export const FEATURE_UNLOCKS: Record<FeatureId, FeatureUnlockDef> = {
  techniques: {
    id: 'techniques',
    name: 'Công Pháp',
    requirementDesc: 'Vượt Ải 1-3 hoặc đạt Đồng Bì Cảnh',
    isUnlocked: (state) =>
      state.stats.stagesCleared >= 3 ||
      state.realmIndex >= REALM_INDEX_BY_ID['dong-bi-1'] ||
      (state.legacy?.lives ?? 1) > 1,
  },
  forge: {
    id: 'forge',
    name: 'Đan Lô Luyện Khí',
    requirementDesc: 'Vượt Ải 1-5 hoặc đạt Đồng Bì Cảnh',
    isUnlocked: (state) =>
      state.stats.stagesCleared >= 5 ||
      state.realmIndex >= REALM_INDEX_BY_ID['dong-bi-1'] ||
      (state.legacy?.lives ?? 1) > 1,
  },
  formation: {
    id: 'formation',
    name: 'Bố Trận Bát Quái',
    requirementDesc: 'Vượt Ải 1-8 hoặc đạt Thao Căn Cảnh',
    isUnlocked: (state) =>
      state.stats.stagesCleared >= 8 ||
      state.realmIndex >= REALM_INDEX_BY_ID['thao-can-1'] ||
      (state.legacy?.lives ?? 1) > 1,
  },
  swords: {
    id: 'swords',
    name: 'Bản Mệnh Phi Kiếm',
    requirementDesc: 'Vượt Ải 2-1 (Hắc Sơn Lâm) hoặc đạt Liễu Cốt Cảnh',
    isUnlocked: (state) =>
      state.stats.stagesCleared >= 10 ||
      state.stats.bossesSlain >= 1 ||
      state.realmIndex >= REALM_INDEX_BY_ID['lieu-can-1'] ||
      (state.legacy?.lives ?? 1) > 1,
  },
  alchemy: {
    id: 'alchemy',
    name: 'Luyện Đan Lô',
    requirementDesc: 'Vượt Ải 3-1 (Thư Giản Hồ) hoặc đạt Khí Cốt Cảnh',
    isUnlocked: (state) =>
      state.stats.stagesCleared >= 20 ||
      state.stats.bossesSlain >= 2 ||
      state.realmIndex >= REALM_INDEX_BY_ID['khi-cot-1'] ||
      (state.legacy?.lives ?? 1) > 1,
  },
  legacy: {
    id: 'legacy',
    name: 'Luân Hồi Chuyển Thế',
    requirementDesc: 'Đạt Kim Đan Cảnh hoặc cạn kiệt Thọ Nguyên',
    isUnlocked: (state) =>
      state.realmIndex >= REALM_INDEX_BY_ID['kim-dan-1'] ||
      isReincarnationForced(state) ||
      (state.legacy?.lives ?? 1) > 1,
  },
}

/** Kiểm tra xem tính năng đã được mở khóa chưa */
export function isFeatureUnlocked(state: GameState, feature: FeatureId): boolean {
  const def = FEATURE_UNLOCKS[feature]
  if (!def) return true
  return def.isUnlocked(state)
}

/** Lấy mô tả điều kiện mở khóa */
export function getFeatureUnlockRequirement(feature: FeatureId): string {
  return FEATURE_UNLOCKS[feature]?.requirementDesc ?? ''
}
