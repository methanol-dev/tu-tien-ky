import {
  AFFIX_BY_KEY,
  AFFIX_COUNT,
  AFFIXES,
  affixTierMult,
  type AffixKey,
  type ChestKind,
  RARITIES,
  RARITY_NAME,
  RARITY_RANK,
  RARITY_TABLE,
  type Rarity,
  SALVAGE_SECONDS,
} from '@/content/affixes'
import {
  GEAR_DEF_BY_ID,
  GEAR_DEFS,
  GEAR_SLOTS,
  GEAR_TYPES,
  type GearDef,
  type GearSlot,
  type GearType,
  getSlotsForType,
  NAMED_GEAR,
  rollableGearFor,
  SLOT_NAME,
} from '@/content/gear'
import { GEAR_SET_BY_ID, type GearSetDef } from '@/content/gearSets'
import { type Difficulty, gearTier, REGION_BY_ID, REGIONS } from '@/content/regions'
import { GEAR_CAP } from './constants'
import { getStoneRate } from './economy'
import { pushLog } from './log'
import type { ActionResult, Affix, GameState, GearInstance, Rng } from './types'

export type AffixTotals = Record<AffixKey, number>

const ZERO_TOTALS: AffixTotals = {
  atk: 0,
  hp: 0,
  def: 0,
  crit: 0,
  critDmg: 0,
  atkSpeed: 0,
  lifesteal: 0,
  qiRate: 0,
  stoneRate: 0,
  lootChance: 0,
}

export function getGearByUid(state: GameState, uid: string): GearInstance | undefined {
  return state.gear.find((g) => g.uid === uid)
}

export function getEquippedGear(state: GameState): GearInstance[] {
  const out: GearInstance[] = []
  for (const slot of GEAR_SLOTS) {
    const uid = state.equipped[slot]
    const g = uid ? getGearByUid(state, uid) : undefined
    if (g && !out.some((x) => x.uid === g.uid)) out.push(g)
  }
  return out
}

export interface ActiveSetBonus {
  setId: string
  setName: string
  count: number
  threshold: number
  description: string
  affixes: { key: AffixKey; value: number }[]
}

/** Đếm số món trang bị cùng bộ đang mặc và trả về các mốc hiệu ứng kích hoạt. */
export function getActiveSetBonuses(state: GameState): ActiveSetBonus[] {
  const equipped = getEquippedGear(state)
  const counts: Record<string, number> = {}
  for (const g of equipped) {
    const def = getGearDef(g)
    if (def?.setId) {
      counts[def.setId] = (counts[def.setId] ?? 0) + 1
    }
  }
  const out: ActiveSetBonus[] = []
  for (const [setId, count] of Object.entries(counts)) {
    const setDef: GearSetDef | undefined = GEAR_SET_BY_ID[setId]
    if (!setDef) continue
    for (const b of setDef.bonuses) {
      if (count >= b.threshold) {
        out.push({
          setId,
          setName: setDef.name,
          count,
          threshold: b.threshold,
          description: b.description,
          affixes: b.affixes,
        })
      }
    }
  }
  return out
}

/** Tổng hợp toàn bộ thuộc tính từ 12 ô trang bị + các mốc hiệu ứng bộ (Set Bonus) kích hoạt. */
export function getAffixTotals(state: GameState): AffixTotals {
  const t: AffixTotals = { ...ZERO_TOTALS }
  // Thuộc tính từng món đồ đang mặc
  for (const g of getEquippedGear(state)) {
    for (const a of g.affixes) {
      if (t[a.key] !== undefined) t[a.key] += a.value
    }
  }
  // Thuộc tính từ các Set Bonus kích hoạt
  for (const setBonus of getActiveSetBonuses(state)) {
    for (const a of setBonus.affixes) {
      if (t[a.key] !== undefined) t[a.key] += a.value
    }
  }
  return t
}

export function isEquipped(state: GameState, uid: string): boolean {
  return GEAR_SLOTS.some((s) => state.equipped[s] === uid)
}

export function getGearDef(g: GearInstance): GearDef {
  return GEAR_DEF_BY_ID[g.defId]
}

export function getGearName(g: GearInstance): string {
  return getGearDef(g)?.name ?? g.defId
}

/** Rough power number for sorting/compare; the bot and the UI "better than equipped" hint use it. */
const SCORE_WEIGHT: AffixTotals = {
  atk: 1,
  hp: 0.6,
  def: 0.6,
  crit: 1.2,
  critDmg: 0.5,
  atkSpeed: 1,
  lifesteal: 1,
  qiRate: 2.5,
  stoneRate: 1,
  lootChance: 0.6,
}

export function gearScore(g: GearInstance): number {
  return g.affixes.reduce((s, a) => s + a.value * SCORE_WEIGHT[a.key], 0)
}

export function pickWeightedIndex(weights: readonly number[], roll: number): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let acc = 0
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i]
    if (roll * total < acc) return i
  }
  return weights.length - 1
}

export function rollRarity(kind: ChestKind, difficulty: Difficulty, rng: Rng): Rarity {
  return RARITIES[pickWeightedIndex(RARITY_TABLE[kind][difficulty], rng())]
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000
}

export function rollAffixes(type: GearType, rarity: Rarity, tier: number, rng: Rng): Affix[] {
  const pool = AFFIXES.filter((a) => a.slots.includes(type))
  const out: Affix[] = []
  const mult = affixTierMult(tier)
  const n = Math.min(AFFIX_COUNT[rarity], pool.length)
  const remaining = [...pool]
  for (let i = 0; i < n; i++) {
    const idx = pickWeightedIndex(
      remaining.map((a) => a.weight),
      rng()
    )
    const def = remaining.splice(idx, 1)[0]
    out.push({ key: def.key, value: round3((def.min + rng() * (def.max - def.min)) * mult) })
  }
  return out
}

export function rollGear(type: GearType, rarity: Rarity, tier: number, uid: string, rng: Rng): GearInstance {
  const bases = rollableGearFor(type, tier)
  const def = bases[Math.floor(rng() * bases.length)]
  return { uid, defId: def.id, rarity, tier, affixes: rollAffixes(type, rarity, tier, rng) }
}

export function createNamedGear(defId: string, uid: string, tier = 1): GearInstance {
  const def = GEAR_DEF_BY_ID[defId]
  if (!def?.named) throw new Error(`not named gear: ${defId}`)
  return { uid, defId, rarity: def.named.rarity, tier, affixes: def.named.affixes.map((a) => ({ ...a })) }
}

export function isGearFull(state: GameState): boolean {
  return state.gear.length >= GEAR_CAP
}

export interface ChestResult {
  state: GameState
  gear: GearInstance
}

/** Open one chest of `kind` from the current region. Red chests may hold the region's named gear. */
export function openChest(state: GameState, kind: ChestKind, rng: Rng): ActionResult<ChestResult> {
  if (state.journey.chests[kind] <= 0) return { ok: false, error: kind === 'red' ? 'Không có rương đỏ' : 'Không có rương' }
  if (isGearFull(state)) return { ok: false, error: `Túi pháp bảo đã đầy (${GEAR_CAP}). Phân giải bớt đi.` }
  const region = REGION_BY_ID[state.journey.regionId] ?? REGIONS[0]
  const tier = gearTier(region, state.journey.difficulty)
  const uid = `g${state.nextGearUid}`
  let gear: GearInstance
  if (kind === 'red' && region.namedGear && rng() < region.namedGear.chance) {
    gear = createNamedGear(region.namedGear.gearId, uid, tier)
  } else {
    const type = GEAR_TYPES[Math.floor(rng() * GEAR_TYPES.length)]
    gear = rollGear(type, rollRarity(kind, state.journey.difficulty, rng), tier, uid, rng)
  }
  let next: GameState = {
    ...state,
    gear: [...state.gear, gear],
    nextGearUid: state.nextGearUid + 1,
    journey: { ...state.journey, chests: { ...state.journey.chests, [kind]: state.journey.chests[kind] - 1 } },
    stats: { ...state.stats, chestsOpened: state.stats.chestsOpened + 1, gearFound: state.stats.gearFound + 1 },
  }
  if (RARITY_RANK[gear.rarity] >= RARITY_RANK.tien || getGearDef(gear).named) {
    next = pushLog(next, `Mở rương được ${getGearName(gear)} (${RARITY_NAME[gear.rarity]})!`, 'success')
  }
  return { ok: true, state: { state: next, gear } }
}

/** Open up to `max` chests of a kind (stops when empty or gear is full). */
export function openChests(state: GameState, kind: ChestKind, max: number, rng: Rng): { state: GameState; opened: GearInstance[]; error?: string } {
  let s = state
  const opened: GearInstance[] = []
  for (let i = 0; i < max; i++) {
    const r = openChest(s, kind, rng)
    if (!r.ok) return { state: s, opened, error: opened.length === 0 ? r.error : undefined }
    s = r.state.state
    opened.push(r.state.gear)
  }
  return { state: s, opened }
}

/** Trang bị pháp bảo: tự tìm slot trống nếu là nhẫn/bông tai, hoặc lắp vào targetSlot cụ thể. */
export function equip(state: GameState, uid: string, targetSlot?: GearSlot): ActionResult {
  const g = getGearByUid(state, uid)
  if (!g) return { ok: false, error: 'Không tìm thấy pháp bảo' }
  const def = getGearDef(g)
  const validSlots = getSlotsForType(def.slot)

  let chosenSlot: GearSlot
  if (targetSlot) {
    if (!validSlots.includes(targetSlot)) {
      return { ok: false, error: `Không thể trang bị ${def.name} vào ô ${SLOT_NAME[targetSlot]}` }
    }
    chosenSlot = targetSlot
  } else {
    // Ưu tiên ô đang trống
    const emptySlot = validSlots.find((s) => !state.equipped[s])
    chosenSlot = emptySlot ?? validSlots[0]
  }

  if (state.equipped[chosenSlot] === uid) return { ok: false, error: 'Đang mặc rồi' }
  return { ok: true, state: { ...state, equipped: { ...state.equipped, [chosenSlot]: uid } } }
}

export function unequip(state: GameState, slot: GearSlot): ActionResult {
  if (!state.equipped[slot]) return { ok: false, error: 'Ô này đang trống' }
  return { ok: true, state: { ...state, equipped: { ...state.equipped, [slot]: null } } }
}

export function getSalvageValue(state: GameState, items: GearInstance[]): number {
  const rate = getStoneRate(state)
  return Math.round(items.reduce((s, g) => s + SALVAGE_SECONDS[g.rarity] * rate, 0))
}

/** Break gear down into spirit stones. Equipped gear is skipped. */
export function salvage(state: GameState, uids: string[]): ActionResult<{ state: GameState; stones: number; count: number }> {
  const set = new Set(uids)
  const victims = state.gear.filter((g) => set.has(g.uid) && !isEquipped(state, g.uid))
  if (victims.length === 0) return { ok: false, error: 'Không có gì để phân giải (đồ đang mặc không phân giải được)' }
  const stones = getSalvageValue(state, victims)
  const gone = new Set(victims.map((g) => g.uid))
  return {
    ok: true,
    state: {
      state: {
        ...state,
        gear: state.gear.filter((g) => !gone.has(g.uid)),
        stones: state.stones + stones,
      },
      stones,
      count: victims.length,
    },
  }
}

export function salvageByRarity(state: GameState, rarities: Rarity[]): ActionResult<{ state: GameState; stones: number; count: number }> {
  const uids = state.gear.filter((g) => rarities.includes(g.rarity) && !isEquipped(state, g.uid)).map((g) => g.uid)
  return salvage(state, uids)
}

/** Content sanity check used by tests. Returns a list of problems (empty = ok). */
export function validateGear(): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const g of GEAR_DEFS) {
    if (ids.has(g.id)) errors.push(`duplicate gear id ${g.id}`)
    ids.add(g.id)
    if (!GEAR_TYPES.includes(g.slot)) errors.push(`${g.id}: bad slot`)
    if (g.named) {
      if (g.named.affixes.length === 0) errors.push(`${g.id}: named gear without affixes`)
      for (const a of g.named.affixes) if (!AFFIX_BY_KEY[a.key]) errors.push(`${g.id}: unknown affix ${a.key}`)
    }
  }
  for (const type of GEAR_TYPES) {
    for (let tier = 1; tier <= 9; tier++) {
      if (rollableGearFor(type, tier).length === 0) errors.push(`no rollable gear for ${type} at tier ${tier}`)
    }
    if (AFFIXES.filter((a) => a.slots.includes(type)).length < AFFIX_COUNT.than) {
      errors.push(`${type}: fewer affixes than a Thần item needs`)
    }
  }
  for (const r of REGIONS) {
    if (r.namedGear && !NAMED_GEAR.some((g) => g.id === r.namedGear!.gearId)) {
      errors.push(`${r.id}: unknown named gear ${r.namedGear.gearId}`)
    }
  }
  return errors
}
