/**
 * Realm (cảnh giới) table. Generated from per-major-realm parameters so the
 * balance pass (Phase 6) can tune a handful of numbers instead of 40 rows.
 */

export type MajorRealmId =
  | 'pham-nhan'
  | 'luyen-khi'
  | 'truc-co'
  | 'kim-dan'
  | 'nguyen-anh'
  | 'hoa-than'
  | 'luyen-hu'
  | 'hop-the'
  | 'dai-thua'
  | 'do-kiep'
  | 'phi-thang'

export interface RealmStage {
  /** Unique id, e.g. `luyen-khi-3`. */
  id: string
  majorId: MajorRealmId
  /** Display name of the major realm, e.g. "Luyện Khí". */
  majorName: string
  /** Stage label within the major realm, e.g. "Tầng 3" / "Sơ kỳ"; null for single-stage realms. */
  stageLabel: string | null
  /** Full display name, e.g. "Luyện Khí Tầng 3". */
  name: string
  /** Base qi gained per real second at this stage. */
  qiRate: number
  /** Qi needed to attempt a breakthrough to the next stage. 0 when terminal. */
  qiRequired: number
  /** Base success chance (0..1) of the breakthrough out of this stage. */
  breakthroughChance: number
  /** Total lifespan granted while in this major realm. */
  lifespanYears: number
  /** True if the breakthrough out of this stage triggers a heavenly tribulation. */
  tribulation: boolean
  /** True for the final stage; no further breakthrough possible. */
  terminal: boolean
  /** True if this is the first stage of its major realm. */
  firstOfMajor: boolean
}

interface MajorRealmDef {
  id: MajorRealmId
  name: string
  stages: (string | null)[]
  baseRate: number
  baseReq: number
  rateGrowth: number
  reqGrowth: number
  chanceStart: number
  chanceEnd: number
  lifespanYears: number
  tribulationOnEnter?: boolean
  terminal?: boolean
}

const TANG_9 = Array.from({ length: 9 }, (_, i) => `Tầng ${i + 1}`)
const KY_4 = ['Sơ kỳ', 'Trung kỳ', 'Hậu kỳ', 'Viên mãn']

export const MAJOR_REALM_DEFS: readonly MajorRealmDef[] = [
  { id: 'pham-nhan', name: 'Phàm Nhân', stages: [null], baseRate: 1, baseReq: 50, rateGrowth: 1, reqGrowth: 1, chanceStart: 1, chanceEnd: 1, lifespanYears: 80 },
  { id: 'luyen-khi', name: 'Luyện Khí', stages: TANG_9, baseRate: 2, baseReq: 100, rateGrowth: 1.35, reqGrowth: 1.5, chanceStart: 0.95, chanceEnd: 0.75, lifespanYears: 120 },
  { id: 'truc-co', name: 'Trúc Cơ', stages: KY_4, baseRate: 40, baseReq: 5_000, rateGrowth: 1.6, reqGrowth: 2.0, chanceStart: 0.7, chanceEnd: 0.5, lifespanYears: 250 },
  { id: 'kim-dan', name: 'Kim Đan', stages: KY_4, baseRate: 400, baseReq: 150_000, rateGrowth: 1.7, reqGrowth: 2.2, chanceStart: 0.6, chanceEnd: 0.4, lifespanYears: 500, tribulationOnEnter: true },
  { id: 'nguyen-anh', name: 'Nguyên Anh', stages: KY_4, baseRate: 5_000, baseReq: 4_000_000, rateGrowth: 1.8, reqGrowth: 2.4, chanceStart: 0.55, chanceEnd: 0.35, lifespanYears: 1_000, tribulationOnEnter: true },
  { id: 'hoa-than', name: 'Hóa Thần', stages: KY_4, baseRate: 80_000, baseReq: 1.5e8, rateGrowth: 1.9, reqGrowth: 2.5, chanceStart: 0.5, chanceEnd: 0.3, lifespanYears: 2_000, tribulationOnEnter: true },
  { id: 'luyen-hu', name: 'Luyện Hư', stages: KY_4, baseRate: 1.5e6, baseReq: 6e9, rateGrowth: 2.0, reqGrowth: 2.6, chanceStart: 0.45, chanceEnd: 0.28, lifespanYears: 4_000, tribulationOnEnter: true },
  { id: 'hop-the', name: 'Hợp Thể', stages: KY_4, baseRate: 3e7, baseReq: 3e11, rateGrowth: 2.0, reqGrowth: 2.7, chanceStart: 0.4, chanceEnd: 0.25, lifespanYears: 8_000, tribulationOnEnter: true },
  { id: 'dai-thua', name: 'Đại Thừa', stages: KY_4, baseRate: 7e8, baseReq: 1.5e13, rateGrowth: 2.1, reqGrowth: 2.8, chanceStart: 0.35, chanceEnd: 0.2, lifespanYears: 16_000, tribulationOnEnter: true },
  { id: 'do-kiep', name: 'Độ Kiếp', stages: [null], baseRate: 2e10, baseReq: 1e15, rateGrowth: 1, reqGrowth: 1, chanceStart: 0.15, chanceEnd: 0.15, lifespanYears: 30_000, tribulationOnEnter: true },
  { id: 'phi-thang', name: 'Phi Thăng', stages: [null], baseRate: 1e12, baseReq: 0, rateGrowth: 1, reqGrowth: 1, chanceStart: 0, chanceEnd: 0, lifespanYears: 1_000_000, tribulationOnEnter: true, terminal: true },
]

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function buildRealms(defs: readonly MajorRealmDef[]): RealmStage[] {
  const out: RealmStage[] = []
  defs.forEach((def, majorIdx) => {
    const n = def.stages.length
    const next = defs[majorIdx + 1]
    def.stages.forEach((label, k) => {
      const isLast = k === n - 1
      const t = n === 1 ? 0 : k / (n - 1)
      out.push({
        id: n === 1 ? def.id : `${def.id}-${k + 1}`,
        majorId: def.id,
        majorName: def.name,
        stageLabel: label,
        name: label ? `${def.name} ${label}` : def.name,
        qiRate: round(def.baseRate * def.rateGrowth ** k),
        qiRequired: def.terminal ? 0 : round(def.baseReq * def.reqGrowth ** k),
        breakthroughChance: def.terminal ? 0 : lerp(def.chanceStart, def.chanceEnd, t),
        lifespanYears: def.lifespanYears,
        tribulation: isLast && !def.terminal && Boolean(next?.tribulationOnEnter),
        terminal: Boolean(def.terminal),
        firstOfMajor: k === 0,
      })
    })
  })
  return out
}

function round(n: number): number {
  return n >= 1000 ? Math.round(n) : Math.round(n * 100) / 100
}

export const REALMS: readonly RealmStage[] = buildRealms(MAJOR_REALM_DEFS)

export const REALM_INDEX_BY_ID: Readonly<Record<string, number>> = Object.fromEntries(
  REALMS.map((r, i) => [r.id, i]),
)
