import { describe, expect, it } from 'vitest'
import {
  bn,
  bnAdd,
  bnSub,
  bnSubZero,
  bnMul,
  bnDiv,
  bnPow,
  bnCmp,
  bnGte,
  bnLte,
  bnGt,
  bnLt,
  bnEq,
  bnMax,
  bnMin,
  bnToNumber,
  bnToString,
  BN_ZERO,
  BN_ONE,
} from '@/engine/math'

describe('BigNumber Math Engine', () => {
  describe('Khởi tạo và Chuẩn hóa (bn)', () => {
    it('khởi tạo từ số 0 và 1', () => {
      expect(bn(0)).toEqual(BN_ZERO)
      expect(bn(1)).toEqual(BN_ONE)
    })

    it('khởi tạo từ số nguyên và số thực', () => {
      expect(bn(100)).toEqual({ m: 1, e: 2 })
      expect(bn(54321)).toEqual({ m: 5.4321, e: 4 })
      expect(bn(0.005)).toEqual({ m: 5, e: -3 })
    })

    it('khởi tạo từ chuỗi số và chuỗi scientific', () => {
      expect(bn('12345')).toEqual({ m: 1.2345, e: 4 })
      expect(bn('3.5e12')).toEqual({ m: 3.5, e: 12 })
      expect(bn('1e100')).toEqual({ m: 1, e: 100 })
    })

    it('tái chuẩn hóa BigNumber hợp lệ', () => {
      expect(bn({ m: 50, e: 2 })).toEqual({ m: 5, e: 3 })
      expect(bn({ m: 0.2, e: 4 })).toEqual({ m: 2, e: 3 })
    })
  })

  describe('Phép Cộng (bnAdd)', () => {
    it('cộng các số cùng bậc mũ', () => {
      const a = bn(300) // 3e2
      const b = bn(400) // 4e2
      expect(bnAdd(a, b)).toEqual({ m: 7, e: 2 })
    })

    it('cộng các số lệch bậc mũ', () => {
      const a = bn(1000) // 1e3
      const b = bn(50)   // 5e1
      expect(bnAdd(a, b)).toEqual({ m: 1.05, e: 3 })
    })

    it('tối ưu khi chênh lệch quá 15 bậc mũ', () => {
      const huge = bn('1e20')
      const tiny = bn(10)
      expect(bnAdd(huge, tiny)).toEqual(huge)
      expect(bnAdd(tiny, huge)).toEqual(huge)
    })
  })

  describe('Phép Trừ (bnSub & bnSubZero)', () => {
    it('trừ hai số bình thường', () => {
      const a = bn(1000)
      const b = bn(250)
      expect(bnSub(a, b)).toEqual({ m: 7.5, e: 2 })
    })

    it('trừ ra số âm', () => {
      const a = bn(100)
      const b = bn(300)
      expect(bnSub(a, b)).toEqual({ m: -2, e: 2 })
    })

    it('bnSubZero không để số âm', () => {
      const a = bn(100)
      const b = bn(300)
      expect(bnSubZero(a, b)).toEqual(BN_ZERO)
    })
  })

  describe('Phép Nhân và Chia (bnMul & bnDiv)', () => {
    it('nhân hai số lớn vượt MAX_SAFE_INTEGER', () => {
      const a = bn('5e10')
      const b = bn('4e10')
      // 5 * 4 = 20e20 = 2e21
      expect(bnMul(a, b)).toEqual({ m: 2, e: 21 })
    })

    it('nhân với số 0', () => {
      expect(bnMul(bn('1e50'), 0)).toEqual(BN_ZERO)
    })

    it('chia hai số lớn', () => {
      const a = bn('9e25')
      const b = bn('3e10')
      expect(bnDiv(a, b)).toEqual({ m: 3, e: 15 })
    })

    it('chia cho 0 an toàn không crash', () => {
      expect(bnDiv(bn('1e50'), 0)).toEqual(BN_ZERO)
    })
  })

  describe('Phép Lũy Thừa (bnPow)', () => {
    it('tính lũy thừa', () => {
      const base = bn(10) // 1e1
      expect(bnPow(base, 5)).toEqual({ m: 1, e: 5 })
      expect(bnPow(bn(2), 10)).toEqual(bn(1024))
    })

    it('lũy thừa mũ 0 và 1', () => {
      expect(bnPow(bn(999), 0)).toEqual(BN_ONE)
      expect(bnPow(bn(999), 1)).toEqual(bn(999))
    })
  })

  describe('So Sánh (bnCmp & bnGte...)', () => {
    it('so sánh bậc mũ', () => {
      expect(bnCmp(bn('1e10'), bn('9e9'))).toBe(1)
      expect(bnCmp(bn('9e9'), bn('1e10'))).toBe(-1)
      expect(bnCmp(bn('5e15'), bn('5e15'))).toBe(0)
    })

    it('hàm helper boolean', () => {
      expect(bnGt(100, 50)).toBe(true)
      expect(bnGte(100, 100)).toBe(true)
      expect(bnLt(50, 100)).toBe(true)
      expect(bnLte(100, 100)).toBe(true)
      expect(bnEq(1234, 1234)).toBe(true)
    })

    it('bnMax và bnMin', () => {
      expect(bnMax(100, 200)).toEqual(bn(200))
      expect(bnMin(100, 200)).toEqual(bn(100))
    })
  })

  describe('Chuyển đổi và Lưu trữ', () => {
    it('bnToNumber an toàn', () => {
      expect(bnToNumber(bn(12345))).toBe(12345)
      expect(bnToNumber(bn('1e400'))).toBe(Number.MAX_VALUE)
    })

    it('bnToString serialize', () => {
      expect(bnToString(bn(0))).toBe('0')
      expect(bnToString(bn('2.5e18'))).toBe('2.5e18')
    })
  })
})

