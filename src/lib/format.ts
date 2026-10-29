import { bn, type BigNumber } from '@/engine/math'

const STANDARD_SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi']

/** Các đơn vị số lớn Tiên Hiệp Hán Việt cổ phong Kiếm Lai */
export const ANCIENT_TIERS: { exp: number; name: string }[] = [
  { exp: 80, name: ' Vô Lượng' },
  { exp: 72, name: ' Bất Tư Nghị' },
  { exp: 64, name: ' Na Do Tha' },
  { exp: 56, name: ' A Tăng Kỳ' },
  { exp: 48, name: ' Hằng Hà Sa' },
  { exp: 40, name: ' Cực' },
  { exp: 36, name: ' Thấu' },
  { exp: 32, name: ' Giản' },
  { exp: 28, name: ' Câu' },
  { exp: 24, name: ' Bổ' },
  { exp: 20, name: ' Cai' },
  { exp: 16, name: ' Kinh' },
  { exp: 12, name: ' Triệu' },
  { exp: 8, name: ' Ức' },
  { exp: 4, name: ' Vạn' },
]

export interface FormatOptions {
  style?: 'standard' | 'ancient'
  decimals?: number
}

/**
 * Định dạng số lớn theo phong cách Tiên Hiệp Cổ Phong Kiếm Lai
 * (Vạn, Ức, Triệu, Kinh, Cai... hoặc Scientific nếu vượt 10^100)
 */
export function formatAncientNumber(val: BigNumber | number | string): string {
  const num = typeof val === 'object' && 'm' in val ? val : bn(val)
  if (num.m === 0) return '0'

  const sign = num.m < 0 ? '-' : ''
  const absM = Math.abs(num.m)
  const exp = num.e

  // Dưới 10.000 (10^4): hiển thị số tự nhiên
  if (exp < 4) {
    const raw = absM * 10 ** exp
    if (raw < 10) return `${sign}${raw.toFixed(1).replace(/\.0$/, '')}`
    return `${sign}${Math.floor(raw).toLocaleString('en-US')}`
  }

  // Quá 100 bậc mũ: hiển thị số khoa học
  if (exp >= 100) {
    const expSign = exp >= 0 ? '+' : ''
    return `${sign}${absM.toFixed(2)}e${expSign}${exp}`
  }

  // Khớp với bậc Tiên Hiệp lớn nhất
  for (const tier of ANCIENT_TIERS) {
    if (exp >= tier.exp) {
      const remainderExp = exp - tier.exp
      const scaledVal = absM * 10 ** remainderExp
      const dec = scaledVal < 10 ? 2 : scaledVal < 100 ? 1 : 0
      return `${sign}${scaledVal.toFixed(dec)}${tier.name}`
    }
  }

  const expSign = exp >= 0 ? '+' : ''
  return `${sign}${absM.toFixed(2)}e${expSign}${exp}`
}

/**
 * Hàm format số chuẩn cho toàn bộ hệ thống (Hỗ trợ cả BigNumber và number)
 */
export function formatNumber(
  val: BigNumber | number,
  options?: FormatOptions,
): string {
  if (typeof val === 'object' && 'm' in val) {
    if (options?.style === 'standard') {
      const n = val.m * 10 ** val.e
      return formatStandardNumber(n)
    }
    return formatAncientNumber(val)
  }

  const n = val
  if (!Number.isFinite(n)) return '∞'

  if (options?.style === 'ancient') {
    return formatAncientNumber(n)
  }

  return formatStandardNumber(n)
}

function formatStandardNumber(n: number): string {
  const abs = Math.abs(n)
  if (abs < 1000) return abs < 10 ? n.toFixed(1).replace(/\.0$/, '') : Math.floor(n).toString()
  const tier = Math.min(Math.floor(Math.log10(abs) / 3), STANDARD_SUFFIXES.length - 1)
  if (tier >= STANDARD_SUFFIXES.length - 1 && abs >= 1e21) return n.toExponential(2)
  const scaled = n / 10 ** (tier * 3)
  return `${scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0)}${STANDARD_SUFFIXES[tier]}`
}

export function formatRate(perSec: BigNumber | number): string {
  return `${formatNumber(perSec)}/s`
}

export function formatPercent(p: number): string {
  return `${Math.round(p * 100)}%`
}

/** In-game days -> "16 năm 3 tháng" (360-day years, 30-day months). */
export function formatAge(days: number): string {
  const years = Math.floor(days / 360)
  const months = Math.floor((days % 360) / 30)
  if (years === 0) return `${months} tháng`
  return months > 0 ? `${years} năm ${months} tháng` : `${years} năm`
}

export function formatDurationMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`
  if (m > 0) return `${m} phút`
  return `${s} giây`
}
