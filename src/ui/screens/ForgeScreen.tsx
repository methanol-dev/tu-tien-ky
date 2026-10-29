import { useState, useEffect, useRef, useMemo, type FC } from 'react'
import { RARITIES, RARITY_NAME, type Rarity } from '@/content/affixes'
import {
  GEAR_DEF_BY_ID,
  SLOT_NAME,
} from '@/content/gear'
import {
  FORGE_EXP_TABLE,
  FORGE_MAX_LEVEL,
  FORGE_RARITY_TABLE,
  getForgeGearTier,
  getTargetSlotForGear,
} from '@/engine/forge'
import { compareGearStats, gearScore } from '@/engine/gear'
import { getStoneRate } from '@/engine/economy'
import type { GearInstance } from '@/engine/types'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { IconFlame, IconCauldron, IconRefresh } from '@/ui/atoms/icons'

const RARITY_BORDER_CLASSES: Record<Rarity, string> = {
  pham: 'border-paper-600/40 text-paper-300',
  linh: 'border-cyan-500/60 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]',
  bao: 'border-purple-500/60 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]',
  tien: 'border-amber-400/80 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]',
  than: 'border-red-500 text-red-400 animate-pulse drop-shadow-[0_0_16px_rgba(239,68,68,0.7)]',
}

const RARITY_BG_CLASSES: Record<Rarity, string> = {
  pham: 'bg-ink-800/60',
  linh: 'bg-cyan-950/20',
  bao: 'bg-purple-950/20',
  tien: 'bg-amber-950/20',
  than: 'bg-red-950/30',
}

export function ForgeScreen() {
  const state = useGameStore((s) => s.state)
  const forgeGear = useGameStore((s) => s.forgeGear)
  const salvagePendingGear = useGameStore((s) => s.salvagePendingGear)
  const equipPendingGear = useGameStore((s) => s.equipPendingGear)
  const buyFire = useGameStore((s) => s.buyFire)
  const updateForgeFilters = useGameStore((s) => s.updateForgeFilters)

  const [isAutoForging, setIsAutoForging] = useState(false)
  const [showRarityTable, setShowRarityTable] = useState(false)
  const autoIntervalRef = useRef<number | null>(null)

  const forge = state.forge
  const pendingGear = forge.pendingGear

  // Tính chi phí mua Chân Hỏa
  const fireUnitPrice = Math.max(50, Math.round(getStoneRate(state) * 10))
  const cost10 = fireUnitPrice * 10
  const cost50 = fireUnitPrice * 50

  // Xác định trang bị đang mặc đối xứng với pendingGear
  const targetSlot = useMemo(() => {
    if (!pendingGear) return null
    return getTargetSlotForGear(state, pendingGear)
  }, [state, pendingGear])

  const equippedGear = useMemo(() => {
    if (!targetSlot) return null
    const uid = state.equipped[targetSlot]
    return uid ? state.gear.find((g) => g.uid === uid) ?? null : null
  }, [state, targetSlot])

  // So sánh chỉ số
  const comparison = useMemo(() => {
    if (!pendingGear) return null
    return compareGearStats(equippedGear, pendingGear)
  }, [equippedGear, pendingGear])

  // Dừng Auto-Forge khi unmount
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current)
    }
  }, [])

  // Xử lý vòng lặp Auto-Forge
  useEffect(() => {
    if (!isAutoForging) {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
        autoIntervalRef.current = null
      }
      return
    }

    autoIntervalRef.current = window.setInterval(() => {
      const currentPending = useGameStore.getState().state.forge.pendingGear
      const currentFire = useGameStore.getState().state.forge.fireCount

      // Hết chân hỏa thì dừng
      if (currentFire <= 0 && !currentPending) {
        setIsAutoForging(false)
        return
      }

      // Nếu đang có pendingGear từ nhịp trước
      if (currentPending) {
        const slot = getTargetSlotForGear(useGameStore.getState().state, currentPending)
        const curUid = useGameStore.getState().state.equipped[slot]
        const curGear = curUid ? useGameStore.getState().state.gear.find((g) => g.uid === curUid) ?? null : null
        const comp = compareGearStats(curGear, currentPending)

        const filterStop = useGameStore.getState().state.forge.autoFilters
        const isBetter = comp.scoreDiff > 0
        const rarityRank = RARITIES.indexOf(currentPending.rarity)
        const minRank = RARITIES.indexOf(filterStop.minRarity)
        const meetsRarity = rarityRank >= minRank

        // Nếu thoả mãn điều kiện dừng: giữ nguyên món đó và dừng Auto
        if ((filterStop.stopOnHigherScore && isBetter) || meetsRarity) {
          setIsAutoForging(false)
          return
        }

        // Nếu không thoả mãn: phân giải món rác này đi và tiếp tục nhịp sau
        salvagePendingGear()
        return
      }

      // Nếu chưa có pendingGear: đập 1 món mới
      const ok = forgeGear()
      if (!ok) {
        setIsAutoForging(false)
      }
    }, 450)

    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
        autoIntervalRef.current = null
      }
    }
  }, [isAutoForging, forgeGear, salvagePendingGear])

  const maxLevel = forge.level >= FORGE_MAX_LEVEL
  const currentExp = forge.exp
  const neededExp = FORGE_EXP_TABLE[forge.level] ?? 0
  const expPercent = maxLevel ? 100 : Math.min(100, Math.floor((currentExp / neededExp) * 100))

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:py-8">
      {/* 1. Header Lò Luyện Khí & EXP */}
      <div className="relative rounded-2xl border border-paper-400/20 bg-ink-900/80 p-5 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-vermilion-950/60 border border-vermilion-500/40 text-vermilion-400">
                <IconFlame className="h-5 w-5 animate-pulse" />
              </span>
              <h1 className="font-serif text-xl font-bold text-paper-100 tracking-wide">
                Đan Lô Luyện Khí
              </h1>
              <span className="rounded-full bg-gold-500/10 border border-gold-500/30 px-2.5 py-0.5 font-serif text-xs font-semibold text-gold-400">
                Cấp {forge.level} {maxLevel ? '(Đỉnh phong)' : ''}
              </span>
            </div>
            <p className="mt-1 text-xs text-paper-400">
              Thiêu đốt Chân Hỏa tôi luyện thiên địa thần binh · Phẩm chất tăng theo cấp lò
            </p>
          </div>

          {/* Cụm Chân Hỏa & Mua thêm */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-vermilion-500/30 bg-ink-950/70 px-3.5 py-2">
              <span className="text-base">🔥</span>
              <span className="font-mono text-sm font-bold text-vermilion-300">
                {forge.fireCount}
              </span>
              <span className="text-xs text-paper-400">Chân Hỏa</span>
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => buyFire(10)}
                disabled={state.stones < cost10}
                className="rounded-lg border border-paper-400/20 bg-ink-800/80 px-2.5 py-1.5 text-xs font-medium text-paper-200 transition hover:border-gold-500/50 hover:text-gold-300 disabled:opacity-40"
                title={`Mua 10 Chân Hỏa giá ${formatNumber(cost10)} linh thạch`}
              >
                +10 🔥
              </button>
              <button
                type="button"
                onClick={() => buyFire(50)}
                disabled={state.stones < cost50}
                className="rounded-lg border border-paper-400/20 bg-ink-800/80 px-2.5 py-1.5 text-xs font-medium text-paper-200 transition hover:border-gold-500/50 hover:text-gold-300 disabled:opacity-40"
                title={`Mua 50 Chân Hỏa giá ${formatNumber(cost50)} linh thạch`}
              >
                +50 🔥
              </button>
            </div>
          </div>
        </div>

        {/* Thanh tiến trình EXP Lò */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-paper-400">
            <span>Tiến độ thăng cấp lò</span>
            <span className="font-mono">
              {maxLevel ? 'Đã đạt cấp tối đa' : `${currentExp} / ${neededExp} EXP (${expPercent}%)`}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-950/80 border border-paper-400/10">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-gold-500 to-amber-300 transition-all duration-300"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        {/* Nút bật popup bảng tỷ lệ */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setShowRarityTable(!showRarityTable)}
            className="text-xs text-gold-400/80 hover:text-gold-300 underline underline-offset-4"
          >
            {showRarityTable ? 'Đóng bảng xác suất' : 'Xem xác suất phẩm chất lò cấp ' + forge.level}
          </button>
        </div>

        {/* Bảng xác suất phẩm chất */}
        {showRarityTable && (
          <div className="mt-3 rounded-xl border border-paper-400/20 bg-ink-950/90 p-3.5 text-xs">
            <div className="grid grid-cols-5 gap-2 text-center">
              {RARITIES.map((r, idx) => {
                const tableIndex = Math.min(FORGE_MAX_LEVEL - 1, Math.max(0, forge.level - 1))
                const rate = FORGE_RARITY_TABLE[tableIndex][idx]
                return (
                  <div key={r} className="rounded-lg border border-paper-400/10 p-2 bg-ink-900/60">
                    <div className="font-serif font-bold text-paper-200">{RARITY_NAME[r]}</div>
                    <div className="mt-1 font-mono text-gold-400 font-semibold">{rate}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. KHUNG TRUNG TÂM: SO SÁNH TRANG BỊ HOẶC LÒ ĐANG CHỜ ĐẬP */}
      {pendingGear && comparison ? (
        <div className="rounded-2xl border border-gold-500/40 bg-ink-900/90 p-5 backdrop-blur-md shadow-2xl animate-fade-in">
          <div className="text-center">
            <span className="inline-block rounded-full bg-vermilion-500/20 border border-vermilion-500/40 px-3 py-1 text-xs font-serif text-vermilion-300">
              Lò Lửa Bùng Nổ · Bảo Vật Vừa Xuất Lò
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Cột Trái: Đang mặc trên người */}
            <div className="rounded-xl border border-paper-400/20 bg-ink-950/70 p-4">
              <div className="flex items-center justify-between border-b border-paper-400/10 pb-2">
                <span className="text-xs font-serif text-paper-400">Đang trang bị ({targetSlot ? SLOT_NAME[targetSlot] : ''})</span>
                {equippedGear && (
                  <span className="font-mono text-xs text-gold-400">
                    LC: {formatNumber(gearScore(equippedGear))}
                  </span>
                )}
              </div>

              {equippedGear ? (
                <GearCardItem gear={equippedGear} />
              ) : (
                <div className="flex h-36 items-center justify-center text-xs text-paper-500 italic">
                  Chưa có trang bị ở ô này
                </div>
              )}
            </div>

            {/* Cột Phải: Món Mới Xuất Lò */}
            <div
              className={`rounded-xl border ${RARITY_BORDER_CLASSES[pendingGear.rarity]} ${RARITY_BG_CLASSES[pendingGear.rarity]} p-4 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between border-b border-paper-400/20 pb-2">
                <span className="text-xs font-serif font-semibold text-paper-200">
                  Món mới rèn ra ({targetSlot ? SLOT_NAME[targetSlot] : ''})
                </span>
                <span className="font-mono text-xs font-bold text-gold-300">
                  LC: {formatNumber(gearScore(pendingGear))}
                </span>
              </div>

              <GearCardItem gear={pendingGear} />

              {/* Tag chênh lệch lực chiến */}
              <div className="mt-3 flex items-center justify-center">
                {comparison.scoreDiff > 0 ? (
                  <span className="rounded-full bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 font-mono text-xs font-bold text-emerald-400 shadow-lg animate-pulse">
                    ▲ +{comparison.scoreDiff} Lực Chiến (Mạnh hơn)
                  </span>
                ) : comparison.scoreDiff < 0 ? (
                  <span className="rounded-full bg-vermilion-950/80 border border-vermilion-500/50 px-3 py-1 font-mono text-xs font-bold text-vermilion-400">
                    ▼ {comparison.scoreDiff} Lực Chiến (Yếu hơn)
                  </span>
                ) : (
                  <span className="rounded-full bg-paper-800/80 border border-paper-400/30 px-3 py-1 font-mono text-xs text-paper-300">
                    Ngang bằng lực chiến
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hai Nút Quyết Định: MẶC VÀO vs PHÂN GIẢI */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={equipPendingGear}
              className="flex-1 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-700 to-teal-600 py-3 font-serif text-sm font-bold text-paper-100 shadow-lg transition-transform active:scale-95 hover:from-emerald-600 hover:to-teal-500"
            >
              🗡️ Mặc Vào (Tự giải đồ cũ)
            </button>
            <button
              type="button"
              onClick={salvagePendingGear}
              className="flex-1 rounded-xl border border-paper-400/30 bg-ink-800/90 py-3 font-serif text-sm font-medium text-paper-300 shadow transition-colors active:scale-95 hover:bg-ink-700 hover:text-paper-100"
            >
              ♻️ Phân Giải (Nhận EXP + Linh thạch)
            </button>
          </div>
        </div>
      ) : (
        /* KHI CHƯA CÓ PENDING GEAR: NÚT ĐẬP ĐỒ TO BẢN HOÀNH TRÁNG */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-paper-400/20 bg-ink-900/60 p-8 text-center backdrop-blur-md">
          {/* Lò luyện khí khói lửa */}
          <div className="relative mb-6 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-b from-ink-800 to-ink-950 border-2 border-gold-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <IconCauldron className="h-20 w-20 text-gold-400/80 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
            <div className="absolute inset-0 rounded-full border border-gold-500/20 animate-ping opacity-20 pointer-events-none" />
          </div>

          <h2 className="font-serif text-lg font-bold text-paper-200">
            Cửu U Chân Hỏa Lô
          </h2>
          <p className="mt-1 max-w-md text-xs text-paper-400">
            Mỗi lần khai lò tiêu hao 1 Chân Hỏa, rèn ra trang bị ngẫu nhiên 12 ô phù hợp cảnh giới hiện tại (Cấp {getForgeGearTier(state)}).
          </p>

          <button
            type="button"
            onClick={() => forgeGear()}
            disabled={forge.fireCount <= 0 || isAutoForging}
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl border-2 border-gold-500/60 bg-gradient-to-r from-amber-600 via-gold-600 to-amber-700 px-8 py-3.5 font-serif text-base font-bold text-ink-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-xl">🔥</span>
            <span>ĐẬP LÔ LUYỆN KHÍ</span>
            <span className="text-xs font-mono font-normal opacity-90">(-1 🔥)</span>
          </button>
        </div>
      )}

      {/* 3. BẢNG ĐIỀU KHIỂN AUTO-FORGE (TỰ ĐỘNG ĐẬP ĐỒ) */}
      <div className="rounded-2xl border border-paper-400/20 bg-ink-900/80 p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-sm font-bold text-paper-200 flex items-center gap-2">
              <IconRefresh className="h-4 w-4 text-cyan-400" />
              Tự Động Đập Lô (Auto-Forge)
            </h3>
            <p className="mt-0.5 text-xs text-paper-400">
              Tự động khai lò liên tục, phân giải đồ yếu và dừng lại khi trúng bảo vật
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAutoForging(!isAutoForging)}
            disabled={forge.fireCount <= 0 && !pendingGear}
            className={`rounded-xl px-5 py-2.5 font-serif text-xs font-bold transition-all active:scale-95 shadow ${
              isAutoForging
                ? 'bg-vermilion-600 text-paper-100 hover:bg-vermilion-500 animate-pulse'
                : 'bg-gold-500 text-ink-950 hover:bg-gold-400'
            } disabled:opacity-40`}
          >
            {isAutoForging ? '⏹ DỪNG TỰ ĐỘNG' : '▶ BẮT ĐẦU TỰ ĐỘNG'}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 pt-3 border-t border-paper-400/10">
          <label className="flex items-center gap-2.5 text-xs text-paper-300 cursor-pointer">
            <input
              type="checkbox"
              checked={forge.autoFilters.stopOnHigherScore}
              onChange={(e) => updateForgeFilters({ stopOnHigherScore: e.target.checked })}
              className="rounded border-paper-400/30 bg-ink-950 text-gold-500 focus:ring-0"
            />
            <span>Dừng khi mở ra đồ tăng Lực Chiến</span>
          </label>

          <div className="flex items-center gap-2 text-xs text-paper-300">
            <span>Dừng khi đạt phẩm chất:</span>
            <select
              value={forge.autoFilters.minRarity}
              onChange={(e) => updateForgeFilters({ minRarity: e.target.value as Rarity })}
              className="rounded-lg border border-paper-400/20 bg-ink-950 px-2.5 py-1 text-xs text-gold-400 focus:outline-none"
            >
              {RARITIES.map((r) => (
                <option key={r} value={r}>
                  {RARITY_NAME[r]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Component hiển thị chi tiết thông tin 1 món trang bị */
const GearCardItem: FC<{ gear: GearInstance }> = ({ gear }) => {
  const def = GEAR_DEF_BY_ID[gear.defId]
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 border border-paper-400/20 text-sm font-serif">
          {def?.glyph ?? '⚔️'}
        </span>
        <div>
          <div className="font-serif text-sm font-bold text-paper-100">
            {def?.name ?? gear.defId}
          </div>
          <div className="text-[11px] text-paper-400">
            {RARITY_NAME[gear.rarity]} · Bậc {gear.tier}
          </div>
        </div>
      </div>

      <div className="mt-1 space-y-0.5 rounded-lg bg-ink-950/50 p-2 text-xs">
        {gear.affixes.map((affix, idx) => (
          <div key={idx} className="flex justify-between text-[11px] text-paper-300">
            <span>{affix.key.toUpperCase()}</span>
            <span className="font-mono text-gold-400">+{Math.round(affix.value * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
