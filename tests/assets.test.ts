import { describe, expect, it } from 'vitest'
import { resolveAsset } from '@/lib/assets'

describe('resolveAsset helper', () => {
  it('returns empty string for empty input', () => {
    expect(resolveAsset('')).toBe('')
    expect(resolveAsset(undefined)).toBe('')
  })

  it('keeps external or data urls untouched', () => {
    expect(resolveAsset('https://example.com/art.png')).toBe('https://example.com/art.png')
    expect(resolveAsset('http://example.com/art.png')).toBe('http://example.com/art.png')
    expect(resolveAsset('data:image/png;base64,123')).toBe('data:image/png;base64,123')
  })

  it('prepends base url properly without double slash', () => {
    const res1 = resolveAsset('/assets/monsters/thuy-quy-tuong.png')
    const res2 = resolveAsset('assets/monsters/thuy-quy-tuong.png')
    expect(res1).toMatch(/assets\/monsters\/thuy-quy-tuong\.png$/)
    expect(res2).toMatch(/assets\/monsters\/thuy-quy-tuong\.png$/)
    expect(res1).not.toContain('//assets')
  })
})

