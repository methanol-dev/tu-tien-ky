import { describe, expect, it } from 'vitest'
import { REALMS } from '@/content/realms'
import { applyOfflineProgress, createInitialState, DEFAULT_OFFLINE_CAP_MS } from '@/engine'

const HOUR = 3_600_000

describe('offline progress', () => {
  it('applies the full elapsed time when under the cap', () => {
    const s0 = createInitialState(0)
    const { state, report } = applyOfflineProgress(s0, 2 * HOUR)
    expect(report.capped).toBe(false)
    expect(report.appliedMs).toBe(2 * HOUR)
    expect(report.qiGained).toBeCloseTo(REALMS[0].qiRate * 2 * 3600)
    expect(state.qi).toBeCloseTo(report.qiGained)
    expect(state.lastSavedAt).toBe(2 * HOUR)
  })

  it('caps at DEFAULT_OFFLINE_CAP_MS by default', () => {
    const s0 = createInitialState(0)
    const { report } = applyOfflineProgress(s0, 30 * HOUR)
    expect(report.capped).toBe(true)
    expect(report.elapsedMs).toBe(30 * HOUR)
    expect(report.appliedMs).toBe(DEFAULT_OFFLINE_CAP_MS)
    expect(report.qiGained).toBeCloseTo((REALMS[0].qiRate * DEFAULT_OFFLINE_CAP_MS) / 1000)
  })

  it('honours a custom cap', () => {
    const s0 = createInitialState(0)
    const { report } = applyOfflineProgress(s0, 5 * HOUR, 1 * HOUR)
    expect(report.appliedMs).toBe(HOUR)
  })

  it('treats clock going backwards as zero elapsed', () => {
    const s0 = createInitialState(10 * HOUR)
    const { state, report } = applyOfflineProgress(s0, 1 * HOUR)
    expect(report.elapsedMs).toBe(0)
    expect(state.qi).toBe(0)
    expect(state.log).toHaveLength(0)
  })

  it('writes a log entry only for meaningful absences', () => {
    const s0 = createInitialState(0)
    expect(applyOfflineProgress(s0, 30_000).state.log).toHaveLength(0)
    expect(applyOfflineProgress(s0, 5 * 60_000).state.log).toHaveLength(1)
  })

  it('does not consume lifespan during offline progress (bế quan trú nhan)', () => {
    const s0 = createInitialState(0)
    const initialAge = s0.ageDays
    const { state } = applyOfflineProgress(s0, 8 * HOUR)
    expect(state.ageDays).toBe(initialAge)
  })
})
