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
import { calculateGearDelta, formatCPDelta, formatCombatPower } from '@/engine/combatPower'
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
  const [lastAutoLog, setLastAutoLog] = useState<string | null>(null)
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

  // So sánh chỉ số thô
  const comparison = useMemo(() => {
    if (!pendingGear) return null
    return compareGearStats(equippedGear, pendingGear)
  }, [equippedGear, pendingGear])

  // Tính toán Lực Chiến Tổng Hợp (CP Delta)
  const cpDelta = useMemo(() => {
    if (!pendingGear) return null
    return calculateGearDelta(state, pendingGear)
  }, [state, pendingGear])

  const formattedDelta = useMemo(() => {
    if (!cpDelta) return null
    return formatCPDelta(cpDelta.delta)
  }, [cpDelta])

  // Dừng Auto-Forge khi unmount
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current)
    }
  }, [])

  // Xử lý vòng lặp Auto-Forge nguyên tử (Atomic Auto-Forge Loop - Zero Layout Shift)
  useEffect(() => {
    if (!isAutoForging) {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
        autoIntervalRef.current = null
      }
      return
    }

    autoIntervalRef.current = window.setInterval(() => {
      const curState = useGameStore.getState().state
      const currentPending = curState.forge.pendingGear

      // 1. Nếu có pendingGear tồn đọng từ trước (do người chơi rèn tay hoặc pause)
      if (currentPending) {
        const slot = getTargetSlotForGear(curState, currentPending)
        const curUid = curState.equipped[slot]
        const curGear = curUid ? curState.gear.find((g) => g.uid === curUid) ?? null : null
        const comp = compareGearStats(curGear, currentPending)

        const filterStop = curState.forge.autoFilters
        const isBetter = comp.scoreDiff > 0
        const rarityRank = RARITIES.indexOf(currentPending.rarity)
        const minRank = RARITIES.indexOf(filterStop.minRarity)
        const meetsRarity = rarityRank >= minRank

        if ((filterStop.stopOnHigherScore && isBetter) || meetsRarity) {
          setIsAutoForging(false)
          const def = GEAR_DEF_BY_ID[currentPending.defId]
          setLastAutoLog(`✨ Bảo vật xuất thế: [${RARITY_NAME[currentPending.rarity]}] ${def?.name ?? currentPending.defId}!`)
          return
        }

        // Đồ rác tồn đọng: phân giải luôn
        salvagePendingGear()
        return
      }

      // 2. Kiểm tra Chân Hỏa
      if (curState.forge.fireCount <= 0) {
        setIsAutoForging(false)
        setLastAutoLog('Đã cạn kiệt Chân Hỏa! Hãy nạp thêm.')
        return
      }

      // 3. Tiến hành Khai Lò
      const ok = forgeGear()
      if (!ok) {
        setIsAutoForging(false)
        return
      }

      // 4. Đánh giá món vừa rèn ngay lập tức
      const freshState = useGameStore.getState().state
      const newGear = freshState.forge.pendingGear
      if (!newGear) return

      const slot = getTargetSlotForGear(freshState, newGear)
      const curUid = freshState.equipped[slot]
      const curGear = curUid ? freshState.gear.find((g) => g.uid === curUid) ?? null : null
      const comp = compareGearStats(curGear, newGear)

      const filterStop = freshState.forge.autoFilters
      const isBetter = comp.scoreDiff > 0
      const rarityRank = RARITIES.indexOf(newGear.rarity)
      const minRank = RARITIES.indexOf(filterStop.minRarity)
      const meetsRarity = rarityRank >= minRank

      const def = GEAR_DEF_BY_ID[newGear.defId]
      const gearName = def?.name ?? newGear.defId
      const rName = RARITY_NAME[newGear.rarity]

      if ((filterStop.stopOnHigherScore && isBetter) || meetsRarity) {
        // Trúng bảo vật hoặc trang bị tăng LC: DỪNG AUTO, GIỮ NGUYÊN PENDING GEAR ĐỂ HIỆN SO SÁNH!
        setIsAutoForging(false)
        setLastAutoLog(`✨ Bảo vật xuất thế: [${rName}] ${gearName}!`)
        return
      }

      // Đồ yếu: TỰ ĐỘNG PHÂN GIẢI NGAY TRONG CÙNG TICK!
      // React 19 sẽ tự động batch update này với forgeGear(), pendingGear trở lại null ngay lập tức.
      // Khung Lò không hề bị chớp tắt sang Khung So Sánh!
      salvagePendingGear()
      setLastAutoLog(`♻️ Đã phân giải [${rName}] ${gearName} (+EXP Lò)`)
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-2 sm:px-4 py-4 md:py-6 pb-28 md:pb-8">
      {/* 1. Header Lò Luyện Khí & EXP */}
      <div className="relative rounded-2xl border border-paper-400/20 bg-ink-900/80 p-4 sm:p-5 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-vermilion-950/60 border border-vermilion-500/40 text-vermilion-400">
                <IconFlame className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
              </span>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-paper-100 tracking-wide">
                Đan Lô Luyện Khí
              </h1>
              <span className="rounded-full bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 font-serif text-[11px] sm:text-xs font-semibold text-gold-400">
                Cấp {forge.level} {maxLevel ? '(Đỉnh phong)' : ''}
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-paper-400">
              Thiêu đốt Chân Hỏa tôi luyện thiên địa thần binh · Phẩm chất tăng theo cấp lò
            </p>
          </div>

          {/* Cụm Chân Hỏa & Mua thêm */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-vermilion-500/30 bg-ink-950/70 px-3 py-1.5">
              <span className="text-sm">🔥</span>
              <span className="font-mono text-sm font-bold text-vermilion-300">
                {forge.fireCount}
              </span>
              <span className="text-[11px] text-paper-400">Chân Hỏa</span>
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => buyFire(10)}
                disabled={state.stones < cost10}
                className="rounded-lg border border-paper-400/20 bg-ink-800/80 px-2.5 py-1 text-xs font-medium text-paper-200 transition hover:border-gold-500/50 hover:text-gold-300 disabled:opacity-40"
                title={`Mua 10 Chân Hỏa giá ${formatNumber(cost10)} linh thạch`}
              >
                +10 🔥
              </button>
              <button
                type="button"
                onClick={() => buyFire(50)}
                disabled={state.stones < cost50}
                className="rounded-lg border border-paper-400/20 bg-ink-800/80 px-2.5 py-1 text-xs font-medium text-paper-200 transition hover:border-gold-500/50 hover:text-gold-300 disabled:opacity-40"
                title={`Mua 50 Chân Hỏa giá ${formatNumber(cost50)} linh thạch`}
              >
                +50 🔥
              </button>
            </div>
          </div>
        </div>

        {/* Thanh tiến trình EXP Lò */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] sm:text-xs text-paper-400">
            <span>Tiến độ thăng cấp lò</span>
            <span className="font-mono">
              {maxLevel ? 'Đã đạt cấp tối đa' : `${currentExp} / ${neededExp} EXP (${expPercent}%)`}
            </span>
          </div>
          <div className="mt-1 h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-ink-950/80 border border-paper-400/10">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-gold-500 to-amber-300 transition-all duration-300"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        {/* Nút bật popup bảng tỷ lệ */}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowRarityTable(!showRarityTable)}
            className="text-[11px] sm:text-xs text-gold-400/80 hover:text-gold-300 underline underline-offset-4"
          >
            {showRarityTable ? 'Đóng bảng xác suất' : 'Xem xác suất phẩm chất lò cấp ' + forge.level}
          </button>
        </div>

        {/* Bảng xác suất phẩm chất */}
        {showRarityTable && (
          <div className="mt-2.5 rounded-xl border border-paper-400/20 bg-ink-950/90 p-3 text-xs">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
              {RARITIES.map((r, idx) => {
                const tableIndex = Math.min(FORGE_MAX_LEVEL - 1, Math.max(0, forge.level - 1))
                const rate = FORGE_RARITY_TABLE[tableIndex][idx]
                return (
                  <div key={r} className="rounded-lg border border-paper-400/10 p-1.5 sm:p-2 bg-ink-900/60">
                    <div className="font-serif font-bold text-[10px] sm:text-xs text-paper-200">{RARITY_NAME[r]}</div>
                    <div className="mt-0.5 font-mono text-[11px] sm:text-xs text-gold-400 font-semibold">{rate}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. KHUNG TRUNG TÂM: CỐ ĐỊNH CHIỀU CAO (ZERO LAYOUT SHIFT) */}
      {pendingGear && comparison ? (
        <div className="flex min-h-[410px] sm:min-h-[430px] flex-col justify-between rounded-2xl border border-gold-500/40 bg-ink-900/90 p-3.5 sm:p-5 backdrop-blur-md shadow-2xl animate-fade-in">
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left border-b border-paper-400/15 pb-2.5 mb-3">
              <span className="inline-block rounded-full bg-vermilion-500/20 border border-vermilion-500/40 px-2.5 py-0.5 text-xs font-serif text-vermilion-300">
                🔥 Bảo Vật Vừa Xuất Lò · Ô {targetSlot ? SLOT_NAME[targetSlot] : ''}
              </span>

              {/* Tag Chênh Lệch Lực Chiến Tổng Hợp (CP Delta) */}
              {formattedDelta && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold border shadow ${
                      formattedDelta.isPositive
                        ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-400 animate-pulse'
                        : formattedDelta.isZero
                          ? 'bg-ink-800 border-paper-500/30 text-paper-300'
                          : 'bg-vermilion-950/90 border-vermilion-500/60 text-vermilion-400'
                    }`}
                  >
                    {formattedDelta.text}
                  </span>
                </div>
              )}
            </div>

            {/* Bố Cục Side-by-Side 2 Cột Song Song Ngay Cả Trên Mobile */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {/* Cột Trái: Đang mặc trên người */}
              <div className="rounded-xl border border-paper-400/20 bg-ink-950/70 p-2.5 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-paper-400/10 pb-1.5 mb-1.5">
                    <span className="text-[10px] sm:text-xs font-serif text-paper-400">Đang mặc</span>
                    {equippedGear && (
                      <span className="font-mono text-[10px] sm:text-xs text-gold-400">
                        LC: {formatNumber(gearScore(equippedGear))}
                      </span>
                    )}
                  </div>

                  {equippedGear ? (
                    <GearCardItem gear={equippedGear} />
                  ) : (
                    <div className="flex h-24 sm:h-36 items-center justify-center text-[11px] text-paper-500 italic text-center">
                      Ô này đang trống
                    </div>
                  )}
                </div>
              </div>

              {/* Cột Phải: Món Mới Xuất Lò */}
              <div
                className={`rounded-xl border ${RARITY_BORDER_CLASSES[pendingGear.rarity]} ${RARITY_BG_CLASSES[pendingGear.rarity]} p-2.5 sm:p-4 relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-paper-400/20 pb-1.5 mb-1.5">
                    <span className="text-[10px] sm:text-xs font-serif font-semibold text-paper-200">
                      Vừa rèn
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-gold-300">
                      LC: {formatNumber(gearScore(pendingGear))}
                    </span>
                  </div>

                  <GearCardItem gear={pendingGear} isNew />
                </div>
              </div>
            </div>
          </div>

          {/* STICKY ACTION BAR TRÊN MOBILE (Hoặc inline trên Desktop): Bấm 1 chạm không cần cuộn */}
          <div className="mt-4 flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={equipPendingGear}
              className={`flex-[1.4] rounded-xl border py-3 sm:py-3.5 font-serif text-xs sm:text-sm font-bold text-paper-100 shadow-xl transition-all active:scale-95 ${
                cpDelta?.isUpgrade
                  ? 'border-emerald-400/80 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 animate-pulse'
                  : 'border-emerald-500/50 bg-gradient-to-r from-emerald-700 to-teal-700'
              }`}
            >
              🗡️ Mặc Vào {cpDelta?.delta && cpDelta.delta > 0 ? `(+${formatCombatPower(cpDelta.delta)} ⚔️)` : ''}
            </button>
            <button
              type="button"
              onClick={salvagePendingGear}
              className="flex-1 rounded-xl border border-paper-400/30 bg-ink-800/90 py-3 sm:py-3.5 font-serif text-xs sm:text-sm font-medium text-paper-300 shadow transition-colors active:scale-95 hover:bg-ink-700 hover:text-paper-100"
            >
              ♻️ Phân Giải
            </button>
          </div>
        </div>
      ) : (
        /* KHI CHƯA CÓ PENDING GEAR: NÚT ĐẬP ĐỒ TO BẢN HOÀNH TRÁNG / TRẠNG THÁI AUTO CỰC ÊM */
        <div className="flex min-h-[410px] sm:min-h-[430px] flex-col items-center justify-center rounded-2xl border border-paper-400/20 bg-ink-900/60 p-6 sm:p-8 text-center backdrop-blur-md">
          {/* Lò luyện khí khói lửa */}
          <div
            className={`relative mb-4 sm:mb-5 flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-full bg-gradient-to-b from-ink-800 to-ink-950 border-2 transition-all duration-300 ${
              isAutoForging
                ? 'border-vermilion-500/70 shadow-[0_0_35px_rgba(239,68,68,0.35)] scale-105'
                : 'border-gold-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
            }`}
          >
            <IconCauldron
              className={`h-16 w-16 sm:h-20 sm:w-20 transition-all duration-300 ${
                isAutoForging
                  ? 'text-vermilion-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                  : 'text-gold-400/80 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              }`}
            />
            <div
              className={`absolute inset-0 rounded-full border pointer-events-none ${
                isAutoForging
                  ? 'border-vermilion-500/40 animate-ping opacity-30'
                  : 'border-gold-500/20 animate-ping opacity-20'
              }`}
            />
          </div>

          <h2 className="font-serif text-base sm:text-lg font-bold text-paper-200">
            {isAutoForging ? 'Đang Tự Động Khai Lò... 🔥' : 'Cửu U Chân Hỏa Lô'}
          </h2>

          <div className="mt-1 min-h-[2rem] flex items-center justify-center">
            {isAutoForging ? (
              <span className="inline-block rounded-full bg-ink-950/80 border border-paper-400/20 px-3 py-1 font-serif text-xs text-paper-200 animate-fade-in shadow">
                {lastAutoLog ?? 'Đang thiêu đốt Chân Hỏa tôi luyện thiên địa thần binh...'}
              </span>
            ) : (
              <p className="max-w-md text-[11px] sm:text-xs text-paper-400">
                Mỗi lần khai lò tiêu hao 1 Chân Hỏa, rèn ra trang bị ngẫu nhiên 12 ô phù hợp cảnh giới hiện tại (Cấp {getForgeGearTier(state)}).
              </p>
            )}
          </div>

          {isAutoForging ? (
            <button
              type="button"
              onClick={() => setIsAutoForging(false)}
              className="mt-5 flex items-center justify-center gap-2 rounded-2xl border-2 border-vermilion-500/70 bg-gradient-to-r from-vermilion-700 via-red-600 to-vermilion-700 px-6 sm:px-8 py-3 sm:py-3.5 font-serif text-sm sm:text-base font-bold text-paper-100 shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all active:scale-95 hover:brightness-110 animate-pulse"
            >
              <span className="text-base sm:text-lg">⏹</span>
              <span>DỪNG TỰ ĐỘNG</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => forgeGear()}
              disabled={forge.fireCount <= 0}
              className="mt-5 flex items-center justify-center gap-2 rounded-2xl border-2 border-gold-500/60 bg-gradient-to-r from-amber-600 via-gold-600 to-amber-700 px-6 sm:px-8 py-3 sm:py-3.5 font-serif text-sm sm:text-base font-bold text-ink-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-lg sm:text-xl">🔥</span>
              <span>ĐẬP LÔ LUYỆN KHÍ</span>
              <span className="text-[11px] sm:text-xs font-mono font-normal opacity-90">(-1 🔥)</span>
            </button>
          )}
        </div>
      )}

      {/* 3. BẢNG ĐIỀU KHIỂN AUTO-FORGE (TỰ ĐỘNG ĐẬP ĐỒ) */}
      <div className="rounded-2xl border border-paper-400/20 bg-ink-900/80 p-4 sm:p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-xs sm:text-sm font-bold text-paper-200 flex items-center gap-2">
              <IconRefresh className="h-4 w-4 text-cyan-400" />
              Tự Động Đập Lô (Auto-Forge)
            </h3>
            <p className="mt-0.5 text-[11px] sm:text-xs text-paper-400">
              Tự động khai lò liên tục, phân giải đồ yếu và dừng lại khi trúng bảo vật
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAutoForging(!isAutoForging)}
            disabled={forge.fireCount <= 0 && !pendingGear}
            className={`rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 font-serif text-xs font-bold transition-all active:scale-95 shadow ${
              isAutoForging
                ? 'bg-vermilion-600 text-paper-100 hover:bg-vermilion-500 animate-pulse'
                : 'bg-gold-500 text-ink-950 hover:bg-gold-400'
            } disabled:opacity-40`}
          >
            {isAutoForging ? '⏹ DỪNG TỰ ĐỘNG' : '▶ BẮT ĐẦU TỰ ĐỘNG'}
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-3 border-t border-paper-400/10">
          <label className="flex items-center gap-2 text-xs text-paper-300 cursor-pointer">
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
              className="rounded-lg border border-paper-400/20 bg-ink-950 px-2 py-1 text-xs text-gold-400 focus:outline-none"
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
const GearCardItem: FC<{ gear: GearInstance; isNew?: boolean }> = ({ gear, isNew }) => {
  const def = GEAR_DEF_BY_ID[gear.defId]
  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-ink-900 border border-paper-400/20 text-xs sm:text-sm font-serif">
          {def?.glyph ?? '⚔️'}
        </span>
        <div className="overflow-hidden">
          <div className="font-serif text-xs sm:text-sm font-bold text-paper-100 truncate" title={def?.name ?? gear.defId}>
            {def?.name ?? gear.defId}
          </div>
          <div className="text-[10px] sm:text-[11px] text-paper-400 truncate">
            {RARITY_NAME[gear.rarity]} · Bậc {gear.tier}
          </div>
        </div>
      </div>

      <div className="mt-1 space-y-0.5 rounded-lg bg-ink-950/60 p-1.5 sm:p-2 text-[10px] sm:text-xs">
        {gear.affixes.map((affix, idx) => (
          <div key={idx} className="flex justify-between text-paper-300">
            <span className="truncate pr-1">{affix.key.toUpperCase()}</span>
            <span className={`font-mono font-semibold ${isNew ? 'text-gold-300' : 'text-paper-300'}`}>
              +{Math.round(affix.value * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
