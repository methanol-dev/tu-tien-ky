import { describe, expect, it } from 'vitest'

describe('toolchain smoke', () => {
  it('runs vitest with TypeScript', () => {
    const realms = ['Phàm Nhân', 'Luyện Khí', 'Trúc Cơ'] as const
    expect(realms).toHaveLength(3)
  })
})
