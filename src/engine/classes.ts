import { CLASS_BY_ID, type ClassId, type CultivationPath } from '@/content/classes'
import { pushLog } from './log'
import type { ActionResult, GameState } from './types'

/**
 * Khởi lập hoặc thay đổi Đạo Đồ (Võ Phu vs Luyện Khí Sĩ vs Song Tu).
 */
export function setCultivationPath(
  state: GameState,
  path: CultivationPath,
  classId: ClassId
): ActionResult {
  const targetClass = CLASS_BY_ID[classId]
  if (!targetClass) {
    return { ok: false, error: 'Đạo thống không tồn tại' }
  }

  let next = {
    ...state,
    cultivationPath: path,
    classId,
  }

  const pathName =
    path === 'martial'
      ? 'Thuần Túy Võ Phu'
      : path === 'dual'
        ? 'Kiếm Võ Song Tu'
        : 'Luyện Khí Sĩ'

  next = pushLog(
    next,
    `Khởi Lập Đạo Tâm: Vấn đạo tiến vào [${pathName} · ${targetClass.name}]: Kích hoạt thiên phú ${targetClass.signatureMechanic}.`,
    'success'
  )

  return { ok: true, state: next }
}

/**
 * Thay đổi trường phái tu đạo (Class Archetype).
 * Cập nhật thuộc tính đạo thân và ghi nhật ký giang hồ.
 */
export function changeClass(state: GameState, classId: ClassId): ActionResult {
  const targetClass = CLASS_BY_ID[classId]
  if (!targetClass) {
    return { ok: false, error: 'Đạo thống không tồn tại' }
  }

  if (state.classId === classId) {
    return { ok: false, error: 'Đạo hữu đã đang theo đuổi đạo thống này' }
  }

  const path: CultivationPath =
    classId === 'vo-phu'
      ? 'martial'
      : state.cultivationPath === 'dual'
        ? 'dual'
        : 'qi'

  let next = {
    ...state,
    classId,
    cultivationPath: path,
  }

  next = pushLog(
    next,
    `Đổi sang đạo thống [${targetClass.name} · ${targetClass.title}]: Kích hoạt chân truyền ${targetClass.passiveName}.`,
    'success'
  )

  return { ok: true, state: next }
}
