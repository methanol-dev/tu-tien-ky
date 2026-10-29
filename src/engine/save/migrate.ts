import { RARITY_RANK } from '@/content/affixes'
import { GEAR_DEF_BY_ID, type GearSlot } from '@/content/gear'
import { LEGACY_REALM_ID_MAP, REALM_INDEX_BY_ID } from '@/content/realms'
import { SAVE_VERSION } from '../constants'
import { createInitialJourney } from '../state'

type RawSave = Record<string, unknown>
type Migration = (raw: RawSave) => RawSave

const OLD_REALM_IDS = [
  'pham-nhan',
  'luyen-khi-1', 'luyen-khi-2', 'luyen-khi-3', 'luyen-khi-4', 'luyen-khi-5', 'luyen-khi-6', 'luyen-khi-7', 'luyen-khi-8', 'luyen-khi-9',
  'truc-co-1', 'truc-co-2', 'truc-co-3', 'truc-co-4',
  'kim-dan-1', 'kim-dan-2', 'kim-dan-3', 'kim-dan-4',
  'nguyen-anh-1', 'nguyen-anh-2', 'nguyen-anh-3', 'nguyen-anh-4',
  'hoa-than-1', 'hoa-than-2', 'hoa-than-3', 'hoa-than-4',
  'luyen-hu-1', 'luyen-hu-2', 'luyen-hu-3', 'luyen-hu-4',
  'hop-the-1', 'hop-the-2', 'hop-the-3', 'hop-the-4',
  'dai-thua-1', 'dai-thua-2', 'dai-thua-3', 'dai-thua-4',
  'do-kiep', 'phi-thang',
]

function mapLegacyRealmIndex(oldIdx: unknown): number {
  if (typeof oldIdx !== 'number' || Number.isNaN(oldIdx)) return 0
  const oldId = OLD_REALM_IDS[oldIdx] ?? 'pham-nhan'
  const newId = LEGACY_REALM_ID_MAP[oldId] ?? 'pham-tuc'
  return REALM_INDEX_BY_ID[newId] ?? 0
}

/**
 * Keyed by the version they migrate FROM. Adding a field to GameState?
 * Bump SAVE_VERSION, add `MIGRATIONS[old] = ...`, update schema.ts. No exceptions.
 */
export const MIGRATIONS: Record<number, Migration> = {
  // 8 -> 9: Thay thế hệ thống tu tiên cổ điển bằng 15 Cảnh Giới Luyện Khí Sĩ Kiếm Lai.
  8: (raw) => {
    const realmIndex = mapLegacyRealmIndex(raw.realmIndex)
    const legacy = (raw.legacy as RawSave | undefined) ?? {}
    const bestRealmIndex = mapLegacyRealmIndex(legacy.bestRealmIndex)
    return {
      ...raw,
      version: 9,
      realmIndex,
      legacy: {
        ...legacy,
        bestRealmIndex,
      },
    }
  },
  // 7 -> 8: Hỗ trợ 10 Class Archetypes Tu Đạo & 5 Tòa Thiên Hạ.
  7: (raw) => {
    return {
      ...raw,
      version: 8,
      classId: raw.classId ?? 'kiem-tu',
    }
  },
  // 5 -> 6: journey replaces expeditions; treasures become named gear instances (Phase 9).
  5: (raw) => {
    const inventory = { ...((raw.inventory as Record<string, number> | undefined) ?? {}) }
    const gear: unknown[] = []
    const equipped: Record<string, string | null> = { kiem: null, giap: null, 'phap-khi': null }
    const bestRank: Partial<Record<string, number>> = {}
    let uid = 1
    for (const id of ['thiet-kiem', 'huyen-quy-giap', 'ngung-than-phu', 'bang-tam-chau', 'phi-kiem-tu-vi', 'thien-ma-giap']) {
      const owned = (inventory[id] ?? 0) > 0
      delete inventory[id]
      const def = GEAR_DEF_BY_ID[id]
      if (!owned || !def?.named) continue
      const instance = { uid: `g${uid}`, defId: id, rarity: def.named.rarity, tier: 1, affixes: def.named.affixes.map((a) => ({ ...a })) }
      uid += 1
      gear.push(instance)
      const rank = RARITY_RANK[def.named.rarity]
      if ((bestRank[def.slot] ?? -1) < rank) {
        bestRank[def.slot] = rank
        equipped[def.slot] = instance.uid
      }
    }
    const { expeditions: _e, expeditionWins: _w, ...stats } = ((raw.stats as RawSave | undefined) ?? {}) as RawSave
    void _e
    void _w
    const { expedition: _x, ...rest } = raw
    void _x
    return {
      ...rest,
      version: 6,
      inventory,
      gear,
      equipped,
      nextGearUid: uid,
      journey: createInitialJourney(),
      stats: { enemiesSlain: 0, bossesSlain: 0, stagesCleared: 0, chestsOpened: 0, gearFound: 0, ...stats },
    }
  },
  // 6 -> 7: Mở rộng 12 ô trang bị (đầu, áo, quần, giày, đai, vũ khí, phù, dây chuyền, 2 nhẫn, 2 bông tai) và hệ thống Set.
  6: (raw) => {
    const oldEquipped = (raw.equipped as Record<string, string | null> | undefined) ?? {}
    const equipped: Record<GearSlot, string | null> = {
      'vu-khi': oldEquipped['kiem'] ?? oldEquipped['vu-khi'] ?? null,
      dau: oldEquipped['dau'] ?? null,
      ao: oldEquipped['giap'] ?? oldEquipped['ao'] ?? null,
      quan: oldEquipped['quan'] ?? null,
      giay: oldEquipped['giay'] ?? null,
      'dai-lung': oldEquipped['dai-lung'] ?? null,
      'phu-luc': oldEquipped['phap-khi'] ?? oldEquipped['phu-luc'] ?? null,
      'day-chuyen': oldEquipped['day-chuyen'] ?? null,
      'nhan-1': oldEquipped['nhan-1'] ?? null,
      'nhan-2': oldEquipped['nhan-2'] ?? null,
      'bong-tai-1': oldEquipped['bong-tai-1'] ?? null,
      'bong-tai-2': oldEquipped['bong-tai-2'] ?? null,
    }
    return {
      ...raw,
      version: 7,
      equipped,
    }
  },
  // 0 -> 1: pre-release saves had no `stats.qiTotal`.
  0: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    return {
      ...raw,
      version: 1,
      stats: { breakthroughs: 0, breakthroughFailures: 0, qiTotal: 0, ...stats },
    }
  },
  // 4 -> 5: tribulation + legacy (Phase 6).
  4: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    return {
      ...raw,
      version: 5,
      tribulation: null,
      legacy: { daoVan: 0, lives: 1, upgrades: {}, bestRealmIndex: 0 },
      stats: { tribulationsPassed: 0, tribulationsFailed: 0, ...stats },
    }
  },
  // 3 -> 4: expeditions (Phase 5).
  3: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    return { ...raw, version: 4, expedition: null, stats: { expeditions: 0, expeditionWins: 0, ...stats } }
  },
  // 2 -> 3: random events (Phase 4).
  2: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    const settings = (raw.settings as RawSave | undefined) ?? {}
    return {
      ...raw,
      version: 3,
      pendingEvent: null,
      nextEventAtMs: typeof raw.playedMs === 'number' ? raw.playedMs + 90_000 : 90_000,
      eventCooldowns: {},
      flags: {},
      stats: { eventsResolved: 0, ...stats },
      settings: { pauseOnEvent: false, ...settings },
    }
  },
  // 1 -> 2: economy, techniques, inventory, alchemy (Phase 3).
  1: (raw) => {
    const stats = (raw.stats as RawSave | undefined) ?? {}
    return {
      ...raw,
      version: 2,
      lifespanBonusYears: 0,
      stones: 0,
      techniques: {},
      inventory: {},
      buffs: [],
      pendingBreakthroughBonus: 0,
      alchemy: null,
      gatherReadyAtMs: 0,
      stats: { stonesTotal: 0, pillsUsed: 0, alchemyCrafted: 0, ...stats },
    }
  },
}

export class MigrationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MigrationError'
  }
}

export function migrateSave(input: unknown): RawSave {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new MigrationError('Save is not an object')
  }
  let raw = input as RawSave
  let version = typeof raw.version === 'number' ? raw.version : 0
  if (version > SAVE_VERSION) {
    throw new MigrationError(`Save version ${version} is newer than supported ${SAVE_VERSION}`)
  }
  while (version < SAVE_VERSION) {
    const step = MIGRATIONS[version]
    if (!step) throw new MigrationError(`No migration from version ${version}`)
    raw = step(raw)
    const nextVersion = typeof raw.version === 'number' ? raw.version : version + 1
    if (nextVersion <= version) throw new MigrationError(`Migration ${version} did not advance`)
    version = nextVersion
  }
  return raw
}
