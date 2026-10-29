import { describe, expect, it } from 'vitest'
import { bn } from '@/engine/math'
import { formatAge, formatAncientNumber, formatDurationMs, formatNumber } from '@/lib/format'

describe('format helpers', () => {
  it('formats numbers with suffixes', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(7.25)).toBe('7.3')
    expect(formatNumber(999)).toBe('999')
    expect(formatNumber(1500)).toBe('1.50K')
    expect(formatNumber(2_500_000)).toBe('2.50M')
    expect(formatNumber(123_456_789_000)).toBe('123B')
  })

  it('formats ancient Vietnamese Xianxia numbers for BigNumber and raw numbers', () => {
    expect(formatAncientNumber(0)).toBe('0')
    expect(formatAncientNumber(520)).toBe('520')
    expect(formatAncientNumber(12_500)).toBe('1.25 Vạn')
    expect(formatAncientNumber(350_000_000)).toBe('3.50 Ức')
    expect(formatAncientNumber(1e12)).toBe('1.00 Triệu')
    expect(formatAncientNumber(1e16)).toBe('1.00 Kinh')
    expect(formatAncientNumber(1e20)).toBe('1.00 Cai')
    expect(formatAncientNumber(1e24)).toBe('1.00 Bổ')
    expect(formatAncientNumber(1e48)).toBe('1.00 Hằng Hà Sa')

    // BigNumber object input
    const hugeBn = bn(5, 56) // 5e56: A Tăng Kỳ
    expect(formatAncientNumber(hugeBn)).toBe('5.00 A Tăng Kỳ')

    // Beyond defined units: scientific notation
    const extremeBn = bn(1.23, 150)
    expect(formatAncientNumber(extremeBn)).toBe('1.23e+150')
  })

  it('formats age and durations in Vietnamese', () => {
    expect(formatAge(16 * 360)).toBe('16 năm')
    expect(formatAge(16 * 360 + 95)).toBe('16 năm 3 tháng')
    expect(formatDurationMs(45_000)).toBe('45 giây')
    expect(formatDurationMs(5 * 60_000)).toBe('5 phút')
    expect(formatDurationMs(2 * 3_600_000 + 15 * 60_000)).toBe('2 giờ 15 phút')
  })
})
