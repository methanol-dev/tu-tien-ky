import { CLASS_BY_ID, type ClassId } from '@/content/classes'
import { pushLog } from './log'
import type { ActionResult, GameState } from './types'

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

  let next = {
    ...state,
    classId,
  }

  next = pushLog(
    next,
    `Đổi sang đạo thống [${targetClass.name} · ${targetClass.title}]: Kích hoạt chân truyền ${targetClass.passiveName}.`,
    'success'
  )

  return { ok: true, state: next }
}
