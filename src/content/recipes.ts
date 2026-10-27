import { REALM_INDEX_BY_ID } from './realms'

export interface RecipeDef {
  id: string
  name: string
  /** Item id produced on success. */
  output: string
  ingredients: Record<string, number>
  stones: number
  durationMs: number
  successChance: number
  minRealmIndex: number
}

const SEC = 1_000

export const RECIPES: readonly RecipeDef[] = [
  { id: 'r-tu-khi-dan', name: 'Luyện Tụ Khí Đan', output: 'tu-khi-dan', ingredients: { 'linh-thao': 3 }, stones: 20, durationMs: 60 * SEC, successChance: 0.9, minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-1'] },
  { id: 'r-ngung-than-dan', name: 'Luyện Ngưng Thần Đan', output: 'ngung-than-dan', ingredients: { 'linh-thao': 2, 'huyet-tinh-chi': 2 }, stones: 100, durationMs: 180 * SEC, successChance: 0.8, minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-4'] },
  { id: 'r-pha-canh-dan', name: 'Luyện Phá Cảnh Đan', output: 'pha-canh-dan', ingredients: { 'huyet-tinh-chi': 3, 'tu-linh-chi': 1 }, stones: 300, durationMs: 300 * SEC, successChance: 0.7, minRealmIndex: REALM_INDEX_BY_ID['luyen-khi-6'] },
  { id: 'r-tang-tho-dan', name: 'Luyện Tăng Thọ Đan', output: 'tang-tho-dan', ingredients: { 'tu-linh-chi': 2, 'thien-tam-lien': 1 }, stones: 1_000, durationMs: 600 * SEC, successChance: 0.6, minRealmIndex: REALM_INDEX_BY_ID['truc-co-1'] },
  { id: 'r-kim-nguyen-dan', name: 'Luyện Kim Nguyên Đan', output: 'kim-nguyen-dan', ingredients: { 'thien-tam-lien': 2, 'cuu-chuyen-can': 1 }, stones: 5_000, durationMs: 900 * SEC, successChance: 0.5, minRealmIndex: REALM_INDEX_BY_ID['kim-dan-1'] },
]

export const RECIPE_BY_ID: Readonly<Record<string, RecipeDef>> = Object.fromEntries(
  RECIPES.map((r) => [r.id, r]),
)
