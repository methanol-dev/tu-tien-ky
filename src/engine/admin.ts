import { ITEMS } from '@/content/items'
import { REALMS } from '@/content/realms'
import { REGIONS } from '@/content/regions'
import { GEAR_DEFS, GEAR_SLOTS, type GearSlot } from '@/content/gear'
import { pushLog } from './log'
import type { GameState, GearInstance } from './types'

/**
 * Các quyền năng Thiên Đạo (Admin Mode / Dev Tools).
 * Phục vụ test nhanh tính năng, cân bằng và gỡ lỗi mà không phá vỡ logic save.
 */

export function adminAddStones(state: GameState, amount: number): GameState {
  const stones = Math.max(0, state.stones + amount)
  const next = {
    ...state,
    stones,
    stats: { ...state.stats, stonesTotal: state.stats.stonesTotal + (amount > 0 ? amount : 0) },
  }
  return pushLog(next, `[Thiên Đạo] Ban thưởng ${amount.toLocaleString('vi-VN')} Linh Thạch.`, 'event')
}

export function adminAddQi(state: GameState, amount: number): GameState {
  const qi = Math.max(0, state.qi + amount)
  const next = {
    ...state,
    qi,
    stats: { ...state.stats, qiTotal: state.stats.qiTotal + (amount > 0 ? amount : 0) },
  }
  return pushLog(next, `[Thiên Đạo] Rót vào kinh mạch ${amount.toLocaleString('vi-VN')} Linh Khí.`, 'event')
}

export function adminSetRealm(state: GameState, realmIndex: number): GameState {
  const targetIndex = Math.max(0, Math.min(REALMS.length - 1, realmIndex))
  const targetRealm = REALMS[targetIndex]
  const next = {
    ...state,
    realmIndex: targetIndex,
    qi: 0,
    tribulation: null,
  }
  return pushLog(next, `[Thiên Đạo] Thăng hoa cảnh giới tức thì -> [${targetRealm.name}].`, 'event')
}

export function adminAddPunches(state: GameState, punches: number): GameState {
  const currentSlain = state.stats.enemiesSlain
  const nextSlain = Math.max(0, currentSlain + punches)
  const next = {
    ...state,
    stats: { ...state.stats, enemiesSlain: nextSlain },
  }
  return pushLog(next, `[Thiên Đạo] Đốn ngộ quyền ý: Luyện thêm ${punches.toLocaleString('vi-VN')} quyền Hám Sơn.`, 'event')
}

export function adminAddChests(state: GameState, normal: number, red: number): GameState {
  const next = {
    ...state,
    journey: {
      ...state.journey,
      chests: {
        normal: Math.max(0, state.journey.chests.normal + normal),
        red: Math.max(0, state.journey.chests.red + red),
      },
    },
  }
  return pushLog(next, `[Thiên Đạo] Giáng hạ cơ duyên: +${normal} Rương Thường, +${red} Rương Đỏ (Boss).`, 'event')
}

export function adminUnlockAllRegions(state: GameState): GameState {
  // Đánh dấu đã clear độ khó cao nhất (3) cho toàn bộ regions
  const cleared: Record<string, number> = {}
  for (const r of REGIONS) {
    cleared[r.id] = 3
  }
  const next = {
    ...state,
    journey: {
      ...state.journey,
      cleared: { ...state.journey.cleared, ...cleared },
    },
  }
  return pushLog(next, `[Thiên Đạo] Mở phong ấn toàn bộ 5 Tòa Thiên Hạ và 9 Vùng Đất.`, 'event')
}

export function adminGiveFullGear(state: GameState): GameState {
  // Tạo bộ trang bị Thần (phẩm Thần bậc 9) cho đủ 12 slots
  const newGear: GearInstance[] = []
  const newEquipped = { ...state.equipped }
  let uidCounter = state.nextGearUid

  const slotTemplates: Record<GearSlot, { defId: string }> = {
    'vu-khi': { defId: 'thiet-kiem' },
    dau: { defId: 'tram-huong-khoi' },
    ao: { defId: 'thien-ma-giap' },
    quan: { defId: 'thanh-van-khoa' },
    giay: { defId: 'van-du-ly' },
    'dai-lung': { defId: 'han-ngoc-yeu-dai' },
    'phu-luc': { defId: 'ngung-than-phu' },
    'day-chuyen': { defId: 'bang-tam-chau' },
    'nhan-1': { defId: 'thanh-ngoc-hoan' },
    'nhan-2': { defId: 'tu-tieu-gioi' },
    'bong-tai-1': { defId: 'minh-nguyet-tai' },
    'bong-tai-2': { defId: 'tinh-ha-truy' },
  }

  for (const slot of GEAR_SLOTS) {
    const tmpl = slotTemplates[slot]
    const def = GEAR_DEFS.find((g) => g.id === tmpl.defId) ?? GEAR_DEFS[0]
    const uid = `admin_g${uidCounter++}`
    const instance: GearInstance = {
      uid,
      defId: def.id,
      rarity: 'than',
      tier: 9,
      affixes: [
        { key: 'atk', value: 0.8 },
        { key: 'hp', value: 0.8 },
        { key: 'def', value: 0.8 },
        { key: 'crit', value: 0.25 },
        { key: 'atkSpeed', value: 0.5 },
      ],
    }
    newGear.push(instance)
    newEquipped[slot] = uid
  }

  const next = {
    ...state,
    gear: [...state.gear, ...newGear],
    equipped: newEquipped,
    nextGearUid: uidCounter,
  }
  return pushLog(next, `[Thiên Đạo] Ban cấp Đại La Thần Binh: Full 12 Món Trang Bị Thần Bậc 9.`, 'event')
}

export function adminAddHerbsAndPills(state: GameState, count = 99): GameState {
  const newInventory = { ...state.inventory }
  for (const it of ITEMS) {
    newInventory[it.id] = (newInventory[it.id] ?? 0) + count
  }
  const next = {
    ...state,
    inventory: newInventory,
  }
  return pushLog(next, `[Thiên Đạo] Đổ đầy linh khố: +${count} cho mỗi loại Thảo dược & Đan dược.`, 'event')
}

export function adminInstantBreakthrough(state: GameState): GameState {
  if (state.realmIndex >= REALMS.length - 1) return state
  const nextRealm = REALMS[state.realmIndex + 1]
  const next = {
    ...state,
    realmIndex: state.realmIndex + 1,
    qi: 0,
    tribulation: null,
    stats: { ...state.stats, breakthroughs: state.stats.breakthroughs + 1 },
  }
  return pushLog(next, `[Thiên Đạo] Phá cảnh nghịch thiên -> Thành công đột phá [${nextRealm.name}].`, 'event')
}

export function adminSetTimeScale(state: GameState, scale: number): GameState {
  const safeScale = Math.max(1, Math.min(100, scale))
  const next = {
    ...state,
    settings: {
      ...state.settings,
      timeScale: safeScale,
    },
  }
  return pushLog(next, `[Thiên Đạo] Bẻ cong thời không: Tốc độ mô phỏng thiết lập ×${safeScale}.`, 'event')
}
