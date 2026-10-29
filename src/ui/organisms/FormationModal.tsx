import { useMemo, type FC } from 'react'
import { CLASS_BY_ID } from '@/content/classes'
import { REGION_BY_ID, REGIONS } from '@/content/regions'
import {
  FORMATION_SLOT_NAMES,
  getClassCounterEffect,
  getEnemyClass,
} from '@/engine/formation'
import { useGameStore } from '@/store/gameStore'
import { CLASS_ICONS } from '@/ui/atoms/icons'
import type { FormationSlot } from '@/engine/types'

interface FormationModalProps {
  open: boolean
  onClose: () => void
}

export const FormationModal: FC<FormationModalProps> = ({ open, onClose }) => {
  const state = useGameStore((s) => s.state)
  const setPlayerFormationSlot = useGameStore((s) => s.setPlayerFormationSlot)

  const playerClassDef = CLASS_BY_ID[state.classId] ?? CLASS_BY_ID['kiem-tu']
  const PlayerIcon = CLASS_ICONS[state.classId]

  // Boss vùng đất hiện tại
  const currentRegion = REGION_BY_ID[state.journey.regionId] ?? REGIONS[0]
  const currentBoss = currentRegion.boss
  const bossClassId = useMemo(() => getEnemyClass(currentBoss), [currentBoss])
  const bossClassDef = CLASS_BY_ID[bossClassId]
  const BossIcon = CLASS_ICONS[bossClassId]

  // Tương khắc giữa người chơi và Boss
  const counterEffect = useMemo(
    () => getClassCounterEffect(state.classId, bossClassId),
    [state.classId, bossClassId],
  )

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="formation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-gold-500/40 bg-ink-900/95 p-5 shadow-2xl backdrop-blur-md overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-paper-400/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">☯️</span>
            <div>
              <h2 id="formation-modal-title" className="font-serif text-lg font-bold text-paper-100">
                Trận Đồ Bát Quái · Tiền Tuyến Bố Trận
              </h2>
              <p className="text-xs text-paper-400">
                Điều chuyển vị trí hàng tiền / hàng hậu · Tận dụng tương khắc môn phái Kiếm Lai
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-paper-400 hover:bg-ink-800 hover:text-paper-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 1. ĐỐI KHÁNG BOSS VÙNG ĐẤT HIỆN TẠI & TƯƠNG KHẮC */}
        <div className="mt-4 rounded-xl border border-paper-400/20 bg-ink-950/60 p-4">
          <div className="text-xs font-serif font-semibold text-paper-300 mb-2">
            Đối Kháng Boss Hiện Tại: <span className="text-gold-400">{currentRegion.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Bạn */}
            <div className="flex items-center gap-2.5 rounded-lg border border-paper-400/10 bg-ink-900/70 p-2.5 w-full sm:w-auto">
              {PlayerIcon && <PlayerIcon className="h-6 w-6 text-gold-400 shrink-0" />}
              <div>
                <div className="font-serif text-xs font-bold text-paper-100">{playerClassDef.name} (Quân Ta)</div>
                <div className="text-[11px] text-paper-400">{playerClassDef.title}</div>
              </div>
            </div>

            {/* Mũi Tên & Trạng Thái Khắc Chế */}
            <div className="text-center">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-serif font-bold ${
                  counterEffect.status === 'advantage'
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 animate-pulse'
                    : counterEffect.status === 'disadvantage'
                      ? 'bg-vermilion-950/80 border border-vermilion-500/50 text-vermilion-400 animate-bounce'
                      : 'bg-paper-800/80 border border-paper-400/30 text-paper-300'
                }`}
              >
                {counterEffect.desc}
              </span>
            </div>

            {/* Boss */}
            <div className="flex items-center gap-2.5 rounded-lg border border-paper-400/10 bg-ink-900/70 p-2.5 w-full sm:w-auto">
              {BossIcon && <BossIcon className="h-6 w-6 text-vermilion-400 shrink-0" />}
              <div>
                <div className="font-serif text-xs font-bold text-paper-100">{currentBoss.name}</div>
                <div className="text-[11px] text-vermilion-300 font-mono">Hệ: {bossClassDef?.name ?? 'Võ Phu'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SA BÀN TRẬN ĐỒ 2X3 */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="font-serif text-xs font-bold text-paper-200">
              Vị Trí Đứng Trên Sa Bàn (Bấm vào ô để đổi vị trí)
            </span>
            <span className="text-[11px] text-gold-400 font-mono">
              Đang đứng: {FORMATION_SLOT_NAMES[state.formation.playerSlot]}
            </span>
          </div>

          {/* Khung Sa Bàn 2 Hàng: Hàng Hậu ở trên, Hàng Tiền ở dưới */}
          <div className="space-y-3">
            {/* HÀNG HẬU */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/10 p-3">
              <div className="flex items-center justify-between text-[11px] text-purple-300 font-serif mb-2">
                <span>🛡️ HÀNG HẬU (Hậu Phương Chi Viện)</span>
                <span className="font-mono text-gold-400">+15% Công · +10% Bạo · -15% Thủ</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['back-left', 'back-mid', 'back-right'] as FormationSlot[]).map((slot) => {
                  const isCurrent = state.formation.playerSlot === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPlayerFormationSlot(slot)}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-all ${
                        isCurrent
                          ? 'border-gold-500 bg-gold-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
                          : 'border-paper-400/20 bg-ink-950/70 hover:border-purple-400/50 hover:bg-ink-800'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          {PlayerIcon && <PlayerIcon className="h-6 w-6 text-gold-400 mb-1" />}
                          <span className="font-serif text-xs font-bold text-gold-300">Đạo Thân</span>
                          <span className="text-[10px] text-paper-300">{FORMATION_SLOT_NAMES[slot]}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-paper-500 text-sm mb-1">◌</span>
                          <span className="text-xs text-paper-400">{FORMATION_SLOT_NAMES[slot]}</span>
                          <span className="text-[10px] text-purple-400/80">Chọn ô này</span>
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* HÀNG TIỀN */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-3">
              <div className="flex items-center justify-between text-[11px] text-cyan-300 font-serif mb-2">
                <span>⚔️ HÀNG TIỀN (Tiên Phong Đỡ Đòn)</span>
                <span className="font-mono text-emerald-400">+20% Thủ · +15% HP · -10% Tốc Đánh</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['front-left', 'front-mid', 'front-right'] as FormationSlot[]).map((slot) => {
                  const isCurrent = state.formation.playerSlot === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPlayerFormationSlot(slot)}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-all ${
                        isCurrent
                          ? 'border-gold-500 bg-gold-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
                          : 'border-paper-400/20 bg-ink-950/70 hover:border-cyan-400/50 hover:bg-ink-800'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          {PlayerIcon && <PlayerIcon className="h-6 w-6 text-gold-400 mb-1" />}
                          <span className="font-serif text-xs font-bold text-gold-300">Đạo Thân</span>
                          <span className="text-[10px] text-paper-300">{FORMATION_SLOT_NAMES[slot]}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-paper-500 text-sm mb-1">◌</span>
                          <span className="text-xs text-paper-400">{FORMATION_SLOT_NAMES[slot]}</span>
                          <span className="text-[10px] text-cyan-400/80">Chọn ô này</span>
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. VÒNG TRÒN KHẮC CHẾ NGŨ MÔN */}
        <div className="mt-5 rounded-xl border border-paper-400/10 bg-ink-950/40 p-3.5">
          <div className="text-xs font-serif font-bold text-paper-300 mb-2">
            Quy Luật Tương Khắc Ngũ Môn Kiếm Lai:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-serif text-paper-300">
            <span className="text-gold-400 font-semibold">🗡️ Kiếm Tu</span>
            <span className="text-paper-500">➔</span>
            <span className="text-cyan-400 font-semibold">📜 Nho Gia</span>
            <span className="text-paper-500">➔</span>
            <span className="text-emerald-400 font-semibold">👊 Võ Phu</span>
            <span className="text-paper-500">➔</span>
            <span className="text-purple-400 font-semibold">☯️ Đạo Gia</span>
            <span className="text-paper-500">➔</span>
            <span className="text-amber-300 font-semibold">📿 Phật Gia</span>
            <span className="text-paper-500">➔</span>
            <span className="text-gold-400 font-semibold">🗡️ Kiếm Tu</span>
          </div>
          <p className="mt-2 text-center text-[11px] text-paper-400">
            Bên thắng nhận <span className="text-emerald-400 font-bold">+25% Công</span> và <span className="text-emerald-400 font-bold">-15% Sát thương gánh chịu</span>.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gold-500/40 bg-gold-500/20 px-6 py-2 font-serif text-xs font-bold text-gold-300 transition-all hover:bg-gold-500/30 active:scale-95"
          >
            Đóng Trận Đồ
          </button>
        </div>
      </div>
    </div>
  )
}
