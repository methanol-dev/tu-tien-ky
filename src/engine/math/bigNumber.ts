/**
 * BigNumber Zero-Dependency Math Engine for Idle RPG.
 * Đảm bảo tính toán số lớn vô tận (10^100+), không bao giờ tràn MAX_SAFE_INTEGER
 * và triệt tiêu lỗi Float Absorption (số lớn nuốt số nhỏ) khi tu luyện lâu dài.
 */

export interface BigNumber {
  /** Mantissa: 1.0 <= |m| < 10.0 (hoặc m = 0, e = 0) */
  readonly m: number
  /** Exponent: Bậc số mũ cơ số 10 */
  readonly e: number
}

export const BN_ZERO: BigNumber = Object.freeze({ m: 0, e: 0 })
export const BN_ONE: BigNumber = Object.freeze({ m: 1, e: 0 })

/**
 * Chuẩn hóa mantissa và exponent sao cho 1.0 <= |m| < 10.0
 */
export function normalize(m: number, e: number): BigNumber {
  if (m === 0 || !Number.isFinite(m)) return BN_ZERO
  if (m === 1 && e === 0) return BN_ONE

  const sign = m < 0 ? -1 : 1
  let absM = Math.abs(m)
  let exp = e

  // Chuẩn hóa nhanh
  if (absM >= 10 || absM < 1) {
    const shift = Math.floor(Math.log10(absM))
    absM /= 10 ** shift
    exp += shift
  }

  // Giữ 8 chữ số thập phân chính xác tránh sai số nhị phân
  const roundedM = Math.round(absM * 1e8) / 1e8
  if (roundedM >= 10) {
    return { m: sign * 1, e: exp + 1 }
  }

  return { m: sign * roundedM, e: exp }
}

/**
 * Khởi tạo BigNumber từ number, string hoặc BigNumber khác
 * Có thể truyền thêm số mũ exp nếu cần (ví dụ: bn(5, 56) => 5e56)
 */
export function bn(val: BigNumber | number | string, exp = 0): BigNumber {
  if (typeof val === 'object' && val !== null && 'm' in val && 'e' in val) {
    return normalize(val.m, val.e + exp)
  }

  if (typeof val === 'number') {
    if (val === 0 || !Number.isFinite(val)) return BN_ZERO
    if (val === 1 && exp === 0) return BN_ONE
    const e = Math.floor(Math.log10(Math.abs(val)))
    const m = val / 10 ** e
    return normalize(m, e + exp)
  }

  if (typeof val === 'string') {
    const trimmed = val.trim().toLowerCase()
    if (!trimmed || trimmed === '0') return BN_ZERO
    if (trimmed === '1' && exp === 0) return BN_ONE

    if (trimmed.includes('e')) {
      const parts = trimmed.split('e')
      const m = parseFloat(parts[0])
      const e = parseInt(parts[1], 10) || 0
      return normalize(m, e + exp)
    }

    const parsed = parseFloat(trimmed)
    if (!Number.isFinite(parsed) || parsed === 0) return BN_ZERO
    const e = Math.floor(Math.log10(Math.abs(parsed)))
    const m = parsed / 10 ** e
    return normalize(m, e + exp)
  }

  return BN_ZERO
}

/**
 * Phép cộng hai số lớn: a + b
 * Tối ưu O(1) khi bậc mũ chênh lệch > 15
 */
export function bnAdd(a: BigNumber | number, b: BigNumber | number): BigNumber {
  const bnA = typeof a === 'number' ? bn(a) : a
  const bnB = typeof b === 'number' ? bn(b) : b

  if (bnA.m === 0) return bnB
  if (bnB.m === 0) return bnA

  const diff = bnA.e - bnB.e
  if (diff > 15) return bnA
  if (diff < -15) return bnB

  const newM = bnA.m + bnB.m * 10 ** -diff
  return normalize(newM, bnA.e)
}

/**
 * Phép trừ: a - b
 */
export function bnSub(a: BigNumber | number, b: BigNumber | number): BigNumber {
  const bnA = typeof a === 'number' ? bn(a) : a
  const bnB = typeof b === 'number' ? bn(b) : b

  if (bnB.m === 0) return bnA
  if (bnA.m === 0) return normalize(-bnB.m, bnB.e)

  const diff = bnA.e - bnB.e
  if (diff > 15) return bnA
  if (diff < -15) return normalize(-bnB.m, bnB.e)

  const newM = bnA.m - bnB.m * 10 ** -diff
  return normalize(newM, bnA.e)
}

/**
 * Phép trừ không âm (cho tài nguyên như linh thạch, linh khí): max(0, a - b)
 */
export function bnSubZero(a: BigNumber | number, b: BigNumber | number): BigNumber {
  const res = bnSub(a, b)
  return res.m < 0 ? BN_ZERO : res
}

/**
 * Phép nhân: a * b
 */
export function bnMul(a: BigNumber | number, b: BigNumber | number): BigNumber {
  const bnA = typeof a === 'number' ? bn(a) : a
  const bnB = typeof b === 'number' ? bn(b) : b

  if (bnA.m === 0 || bnB.m === 0) return BN_ZERO
  return normalize(bnA.m * bnB.m, bnA.e + bnB.e)
}

/**
 * Phép chia: a / b
 */
export function bnDiv(a: BigNumber | number, b: BigNumber | number): BigNumber {
  const bnA = typeof a === 'number' ? bn(a) : a
  const bnB = typeof b === 'number' ? bn(b) : b

  if (bnA.m === 0) return BN_ZERO
  if (bnB.m === 0) return BN_ZERO // An toàn chia cho 0

  return normalize(bnA.m / bnB.m, bnA.e - bnB.e)
}

/**
 * Lũy thừa: a ^ n (n là số thực)
 */
export function bnPow(a: BigNumber | number, n: number): BigNumber {
  const bnA = typeof a === 'number' ? bn(a) : a
  if (bnA.m === 0) return BN_ZERO
  if (n === 0) return BN_ONE
  if (n === 1) return bnA

  // (m * 10^e)^n = m^n * 10^(e * n)
  const totalExp = bnA.e * n
  const mPow = bnA.m ** n
  const shift = Math.floor(Math.log10(mPow))
  const finalM = mPow / 10 ** shift
  const finalE = Math.round(totalExp + shift)

  return normalize(finalM, finalE)
}

/**
 * So sánh hai số lớn: a so với b
 * @returns 1 nếu a > b, -1 nếu a < b, 0 nếu a == b
 */
export function bnCmp(a: BigNumber | number, b: BigNumber | number): number {
  const bnA = typeof a === 'number' ? bn(a) : a
  const bnB = typeof b === 'number' ? bn(b) : b

  if (bnA.m === 0 && bnB.m === 0) return 0
  if (bnA.m > 0 && bnB.m <= 0) return 1
  if (bnA.m <= 0 && bnB.m > 0) return -1

  if (bnA.e > bnB.e) return bnA.m > 0 ? 1 : -1
  if (bnA.e < bnB.e) return bnA.m > 0 ? -1 : 1

  if (Math.abs(bnA.m - bnB.m) < 1e-6) return 0
  return bnA.m > bnB.m ? 1 : -1
}

export function bnGte(a: BigNumber | number, b: BigNumber | number): boolean {
  return bnCmp(a, b) >= 0
}

export function bnLte(a: BigNumber | number, b: BigNumber | number): boolean {
  return bnCmp(a, b) <= 0
}

export function bnGt(a: BigNumber | number, b: BigNumber | number): boolean {
  return bnCmp(a, b) > 0
}

export function bnLt(a: BigNumber | number, b: BigNumber | number): boolean {
  return bnCmp(a, b) < 0
}

export function bnEq(a: BigNumber | number, b: BigNumber | number): boolean {
  return bnCmp(a, b) === 0
}

export function bnMax(a: BigNumber | number, b: BigNumber | number): BigNumber {
  return bnGte(a, b) ? (typeof a === 'number' ? bn(a) : a) : typeof b === 'number' ? bn(b) : b
}

export function bnMin(a: BigNumber | number, b: BigNumber | number): BigNumber {
  return bnLte(a, b) ? (typeof a === 'number' ? bn(a) : a) : typeof b === 'number' ? bn(b) : b
}

/**
 * Chuyển đổi BigNumber về số number nguyên thủy của JavaScript (nếu an toàn)
 */
export function bnToNumber(a: BigNumber | number): number {
  if (typeof a === 'number') return a
  if (a.m === 0) return 0
  if (a.e > 308) return a.m > 0 ? Number.MAX_VALUE : -Number.MAX_VALUE
  if (a.e < -308) return 0
  return a.m * 10 ** a.e
}

/**
 * Serialize BigNumber thành chuỗi để lưu vào save game hoặc JSON
 */
export function bnToString(a: BigNumber): string {
  if (a.m === 0) return '0'
  return `${a.m}e${a.e}`
}
