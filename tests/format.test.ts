import { describe, expect, it } from 'vitest'
import { formatAge, formatDurationMs, formatNumber } from '@/lib/format'

describe('format helpers', () => {
  it('formats numbers with suffixes', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(7.25)).toBe('7.3')
    expect(formatNumber(999)).toBe('999')
    expect(formatNumber(1500)).toBe('1.50K')
    expect(formatNumber(2_500_000)).toBe('2.50M')
    expect(formatNumber(123_456_789_000)).toBe('123B')
  })

  it('formats age and durations in Vietnamese', () => {
    expect(formatAge(16 * 360)).toBe('16 năm')
    expect(formatAge(16 * 360 + 95)).toBe('16 năm 3 tháng')
    expect(formatDurationMs(45_000)).toBe('45 giây')
    expect(formatDurationMs(5 * 60_000)).toBe('5 phút')
    expect(formatDurationMs(2 * 3_600_000 + 15 * 60_000)).toBe('2 giờ 15 phút')
  })
})
