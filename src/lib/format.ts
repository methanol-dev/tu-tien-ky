const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi']

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '∞'
  const abs = Math.abs(n)
  if (abs < 1000) return abs < 10 ? n.toFixed(1).replace(/\.0$/, '') : Math.floor(n).toString()
  const tier = Math.min(Math.floor(Math.log10(abs) / 3), SUFFIXES.length - 1)
  if (tier >= SUFFIXES.length - 1 && abs >= 1e21) return n.toExponential(2)
  const scaled = n / 10 ** (tier * 3)
  return `${scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0)}${SUFFIXES[tier]}`
}

export function formatRate(perSec: number): string {
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
