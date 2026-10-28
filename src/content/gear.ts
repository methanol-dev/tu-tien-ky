/**
 * Gear (pháp bảo) definitions. A GearDef is a template; the engine rolls GearInstances
 * from it (see engine/gear). Named gear has fixed rarity and affixes and drops from bosses.
 */
import type { AffixKey, Rarity } from './affixes'

export type GearSlot = 'kiem' | 'giap' | 'phap-khi'
export const GEAR_SLOTS: readonly GearSlot[] = ['kiem', 'giap', 'phap-khi']
export const SLOT_NAME: Record<GearSlot, string> = { kiem: 'Kiếm', giap: 'Giáp', 'phap-khi': 'Pháp khí' }

export interface GearDef {
  id: string
  slot: GearSlot
  name: string
  /** Single Hán glyph used as the item's "portrait". */
  glyph: string
  description: string
  /** Lowest tier at which this base drops. Ignored for named gear. */
  minTier: number
  /** Named gear: fixed rarity + affixes, never rolled randomly. */
  named?: { rarity: Rarity; affixes: { key: AffixKey; value: number }[] }
}

export const GEAR_DEFS: readonly GearDef[] = [
  // Kiếm
  { id: 'thiet-kiem-tho', slot: 'kiem', name: 'Thiết Kiếm', glyph: '鐵', description: 'Kiếm sắt rèn thô, có còn hơn không.', minTier: 1 },
  { id: 'thanh-cuong-kiem', slot: 'kiem', name: 'Thanh Cương Kiếm', glyph: '鋼', description: 'Thép xanh trăm luyện, lưỡi sắc lạnh.', minTier: 3 },
  { id: 'linh-kiem', slot: 'kiem', name: 'Linh Kiếm', glyph: '靈', description: 'Kiếm có linh tính, hợp với linh khí người cầm.', minTier: 5 },
  { id: 'phi-kiem', slot: 'kiem', name: 'Phi Kiếm', glyph: '飛', description: 'Ngự kiếm phi hành, chém địch ngoài trăm bước.', minTier: 7 },
  { id: 'tien-kiem', slot: 'kiem', name: 'Tiên Kiếm', glyph: '仙', description: 'Kiếm khí nối trời, một kiếm phá vạn pháp.', minTier: 9 },
  // Giáp
  { id: 'bo-giap', slot: 'giap', name: 'Bố Giáp', glyph: '布', description: 'Áo vải độn bông, đỡ được vài vết cào.', minTier: 1 },
  { id: 'bi-giap', slot: 'giap', name: 'Bì Giáp', glyph: '皮', description: 'Da yêu thú thuộc kỹ, dẻo dai.', minTier: 3 },
  { id: 'lan-giap', slot: 'giap', name: 'Lân Giáp', glyph: '鱗', description: 'Vảy giao long kết thành, nước lửa khó xâm.', minTier: 5 },
  { id: 'huyen-giap', slot: 'giap', name: 'Huyền Giáp', glyph: '玄', description: 'Huyền thiết đen tuyền, nặng mà kín.', minTier: 7 },
  { id: 'tien-giap', slot: 'giap', name: 'Tiên Giáp', glyph: '甲', description: 'Giáp tiên gia, kim quang hộ thể.', minTier: 9 },
  // Pháp khí
  { id: 'moc-phu', slot: 'phap-khi', name: 'Mộc Phù', glyph: '符', description: 'Bùa gỗ đào khắc chú, trấn tà sơ cấp.', minTier: 1 },
  { id: 'ngoc-boi', slot: 'phap-khi', name: 'Ngọc Bội', glyph: '珮', description: 'Ngọc bội ôn nhuận, dưỡng thần tĩnh khí.', minTier: 3 },
  { id: 'linh-chau', slot: 'phap-khi', name: 'Linh Châu', glyph: '珠', description: 'Viên châu tụ linh, sáng mờ trong đêm.', minTier: 5 },
  { id: 'phap-an', slot: 'phap-khi', name: 'Pháp Ấn', glyph: '印', description: 'Ấn pháp trấn áp, một ấn định sơn hà.', minTier: 7 },
  { id: 'tien-khi', slot: 'phap-khi', name: 'Tiên Khí', glyph: '器', description: 'Khí cụ tiên gia, uy năng khó lường.', minTier: 9 },
  // Named (bosses). Mirrors the six treasures from before Phase 9.
  { id: 'thiet-kiem', slot: 'kiem', name: 'Thiết Kiếm · Hùng Yêu', glyph: '鐵', description: 'Kiếm sắt rút từ xác Hùng yêu, dính máu không rửa sạch.', minTier: 1, named: { rarity: 'linh', affixes: [{ key: 'atk', value: 0.2 }, { key: 'lifesteal', value: 0.03 }] } },
  { id: 'huyen-quy-giap', slot: 'giap', name: 'Huyền Quy Giáp', glyph: '龜', description: 'Giáp làm từ mai rùa đen, cứng như đá.', minTier: 1, named: { rarity: 'bao', affixes: [{ key: 'def', value: 0.3 }, { key: 'hp', value: 0.15 }, { key: 'lootChance', value: 0.05 }] } },
  { id: 'ngung-than-phu', slot: 'phap-khi', name: 'Ngưng Thần Phù', glyph: '神', description: 'Bùa giúp tâm thần ngưng tụ khi tu luyện.', minTier: 1, named: { rarity: 'bao', affixes: [{ key: 'qiRate', value: 0.08 }, { key: 'crit', value: 0.03 }, { key: 'stoneRate', value: 0.05 }] } },
  { id: 'bang-tam-chau', slot: 'phap-khi', name: 'Băng Tâm Châu', glyph: '冰', description: 'Viên châu lạnh buốt, hộ thể cực tốt.', minTier: 1, named: { rarity: 'tien', affixes: [{ key: 'hp', value: 0.3 }, { key: 'def', value: 0.2 }, { key: 'qiRate', value: 0.05 }, { key: 'atkSpeed', value: 0.06 }] } },
  { id: 'phi-kiem-tu-vi', slot: 'kiem', name: 'Phi Kiếm Tử Vi', glyph: '紫', description: 'Phi kiếm ngự không, chém sắt như bùn.', minTier: 1, named: { rarity: 'tien', affixes: [{ key: 'atk', value: 0.5 }, { key: 'crit', value: 0.08 }, { key: 'critDmg', value: 0.3 }, { key: 'atkSpeed', value: 0.1 }] } },
  { id: 'thien-ma-giap', slot: 'giap', name: 'Thiên Ma Giáp', glyph: '魔', description: 'Chiến giáp của Thiên Ma Tướng, nhuốm sát khí ngàn năm.', minTier: 1, named: { rarity: 'than', affixes: [{ key: 'hp', value: 0.4 }, { key: 'atk', value: 0.3 }, { key: 'def', value: 0.4 }, { key: 'qiRate', value: 0.1 }, { key: 'lifesteal', value: 0.05 }] } },
]

export const GEAR_DEF_BY_ID: Readonly<Record<string, GearDef>> = Object.fromEntries(GEAR_DEFS.map((g) => [g.id, g]))
export const ROLLABLE_GEAR: readonly GearDef[] = GEAR_DEFS.filter((g) => !g.named)
export const NAMED_GEAR: readonly GearDef[] = GEAR_DEFS.filter((g) => Boolean(g.named))

/** Base templates eligible at a tier for a slot: the highest `minTier` band at or below `tier`, plus the band below for variety. */
export function rollableGearFor(slot: GearSlot, tier: number): GearDef[] {
  const bySlot = ROLLABLE_GEAR.filter((g) => g.slot === slot && g.minTier <= tier).sort((a, b) => b.minTier - a.minTier)
  return bySlot.slice(0, 2)
}
