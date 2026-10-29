import { useState } from 'react'
import { CLASSES, type ClassId, type CultivationPath } from '@/content/classes'
import { useGameStore } from '@/store/gameStore'

interface Props {
  open: boolean
  onClose: () => void
}

export function PathSelectionModal({ open, onClose }: Props) {
  const state = useGameStore((s) => s.state)
  const setCultivationPath = useGameStore((s) => s.setCultivationPath)
  const notify = useGameStore((s) => s.notify)

  // Khởi tạo lựa chọn ban đầu
  const [selectedPath, setSelectedPath] = useState<CultivationPath>(
    state.cultivationPath ?? 'qi'
  )
  const [selectedClassId, setSelectedClassId] = useState<ClassId>(
    state.classId ?? 'kiem-tu'
  )

  if (!open) return null

  const hasDualUpgrade = (state.legacy?.upgrades?.['kiem-vo-song-tu'] ?? 0) > 0 || state.legacy.lives >= 2

  const qiClasses = CLASSES.filter((c) => c.path === 'qi')
  const currentClassDef = CLASSES.find((c) => c.id === selectedClassId) ?? CLASSES[0]

  const handleConfirm = () => {
    const finalClassId = selectedPath === 'martial' ? 'vo-phu' : selectedClassId
    const ok = setCultivationPath(selectedPath, finalClassId)
    if (ok) {
      notify(
        `Đã lập Đạo Tâm: ${
          selectedPath === 'martial'
            ? 'Thuần Túy Võ Phu'
            : selectedPath === 'dual'
              ? 'Kiếm Võ Song Tu'
              : 'Luyện Khí Sĩ'
        } · ${currentClassDef.name}!`,
        'success'
      )
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl border border-gold-500/40 bg-gradient-to-b from-ink-900 to-ink-950 p-4 sm:p-6 shadow-2xl text-paper-100 flex flex-col gap-4">
        {/* Tiêu đề Thủy Mặc */}
        <div className="text-center space-y-1 border-b border-gold-500/20 pb-3">
          <div className="text-[11px] sm:text-xs uppercase tracking-widest text-gold-400 font-mono">
            Kiếm Lai · Khởi Lập Đạo Đồ
          </div>
          <h2 className="font-han text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-paper-100 to-gold-400 drop-shadow">
            Vấn Đạo Khởi Đầu · Hồng Mông Định Hướng
          </h2>
          <p className="text-xs text-paper-400 max-w-2xl mx-auto italic">
            &ldquo;Thiên hạ cửu châu, tiên ma mờ mịt. Ngươi muốn rèn một thân thể phách kim cương đấm nát hư không, hay nuốt ngụm linh khí phi kiếm ngự phong ngao du cửu thiên?&rdquo;
          </p>
        </div>

        {/* 2 Đại Đạo Lộ: Thuần Túy Võ Đạo vs Luyện Khí Tiên Đạo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Cánh Tả: THUẦN TÚY VÕ ĐẠO */}
          <div
            onClick={() => {
              setSelectedPath('martial')
              setSelectedClassId('vo-phu')
            }}
            className={`cursor-pointer rounded-lg border-2 p-3 sm:p-4 transition-all duration-200 flex flex-col justify-between ${
              selectedPath === 'martial'
                ? 'border-vermilion-500 bg-vermilion-950/30 shadow-[0_0_20px_rgba(239,68,68,0.25)] ring-1 ring-vermilion-400'
                : 'border-vermilion-900/30 bg-ink-900/60 hover:border-vermilion-700/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-han text-base sm:text-lg font-bold text-vermilion-400 flex items-center gap-2">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-vermilion-500/20 text-xs border border-vermilion-500/40">
                    武
                  </span>
                  THUẦN TÚY VÕ ĐẠO
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-vermilion-500/20 text-vermilion-300 border border-vermilion-500/30 font-mono">
                  CẬN CHIẾN · MELEE
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-paper-300 italic mt-1.5">
                &ldquo;Không kính thần phật, không cướp đoạt linh khí trời đất. Nắm đấm chính là đạo lý!&rdquo;
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-paper-300 border-t border-vermilion-500/20 pt-2.5">
                <div className="flex items-center gap-1.5 text-vermilion-300 font-semibold">
                  <span>💥</span>
                  <span>Khu vực Áp Chế 10 Trượng: +35% Sát thương khi áp sát cận thân</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🥋</span>
                  <span>11 Cảnh Giới Võ Đạo (Nê Phôi &rarr; Kim Thân &rarr; Chỉ Cảnh &rarr; Võ Thần)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>⚡</span>
                  <span className="text-jade-400">Miễn nhiễm hoàn toàn Lôi Kiếp Thiên Phạt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🩸</span>
                  <span>Tài nguyên: Luyện Quyền uẩn dưỡng Khí Huyết & Quyền Ý</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-vermilion-500/20 text-center">
              <span className={`text-xs font-bold ${selectedPath === 'martial' ? 'text-vermilion-400' : 'text-paper-400'}`}>
                {selectedPath === 'martial' ? '✓ ĐANG CHỌN ĐẠO LỘ NÀY' : 'Bấm để chọn Võ Đạo'}
              </span>
            </div>
          </div>

          {/* Cánh Hữu: LUYỆN KHÍ TIÊN ĐẠO */}
          <div
            onClick={() => {
              setSelectedPath('qi')
              if (selectedClassId === 'vo-phu') setSelectedClassId('kiem-tu')
            }}
            className={`cursor-pointer rounded-lg border-2 p-3 sm:p-4 transition-all duration-200 flex flex-col justify-between ${
              selectedPath === 'qi'
                ? 'border-gold-500 bg-gold-950/20 shadow-[0_0_20px_rgba(234,179,8,0.25)] ring-1 ring-gold-400'
                : 'border-gold-900/30 bg-ink-900/60 hover:border-gold-700/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-han text-base sm:text-lg font-bold text-gold-400 flex items-center gap-2">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-gold-500/20 text-xs border border-gold-500/40">
                    仙
                  </span>
                  LUYỆN KHÍ TIÊN ĐẠO
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-mono">
                  TẦM XA · RANGED
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-paper-300 italic mt-1.5">
                &ldquo;Thuận thiên ứng nhân, cướp đoạt tạo hóa trời đất. Phi kiếm ngự phong ngao du cửu thiên!&rdquo;
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-paper-300 border-t border-gold-500/20 pt-2.5">
                <div className="flex items-center gap-1.5 text-gold-300 font-semibold">
                  <span>⚔️</span>
                  <span>Sát lực tầm xa đệ nhất: Bản Mệnh Phi Kiếm & Phù Lục Thông Thiên</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📜</span>
                  <span>15 Cảnh Giới Luyện Khí Sĩ Kiếm Lai (Đồng Bì &rarr; Kim Đan &rarr; Phi Thăng)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>⚡</span>
                  <span className="text-vermilion-400">Sinh tử quan: Cửa ải Long Môn Cảnh & Lôi Kiếp Thiên Phạt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Tài nguyên: Vận Công Thiền Định hấp thu Linh Khí thiên địa</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gold-500/20 text-center">
              <span className={`text-xs font-bold ${selectedPath === 'qi' ? 'text-gold-400' : 'text-paper-400'}`}>
                {selectedPath === 'qi' ? '✓ ĐANG CHỌN ĐẠO LỘ NÀY' : 'Bấm để chọn Tiên Đạo'}
              </span>
            </div>
          </div>
        </div>

        {/* Lựa chọn Kiếm Võ Song Tu nếu đã mở khóa Luân Hồi kiếp 2 */}
        {hasDualUpgrade && (
          <div
            onClick={() => setSelectedPath('dual')}
            className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
              selectedPath === 'dual'
                ? 'border-purple-500 bg-purple-950/40 shadow-[0_0_24px_rgba(168,85,247,0.35)] ring-1 ring-purple-400'
                : 'border-purple-900/40 bg-ink-900/60 hover:border-purple-700/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-han text-sm sm:text-base font-bold text-purple-300 flex items-center gap-2">
                <span>🌟</span>
                KIẾM VÕ SONG TU (ĐẠO CỐT HUYỀN THOẠI TRẦN BÌNH AN)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/40 font-mono">
                CƠ DUYÊN LUÂN HỒI
              </span>
            </div>
            <p className="text-xs text-paper-300 mt-1">
              Đồng thời mở cả hai cột Khí Huyết và Linh Khí, vừa hưởng thụ Hám Sơn Quyền Ý cận chiến vừa điều khiển Bản Mệnh Phi Kiếm sát phạt tầm xa!
            </p>
          </div>
        )}

        {/* Lựa chọn Phái Tông (nếu là Luyện Khí Sĩ hoặc Song Tu) */}
        {selectedPath !== 'martial' && (
          <div className="space-y-2 border-t border-gold-500/20 pt-3">
            <div className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
              <span>📜</span>
              <span>Chọn Phái Tông Chân Truyền:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {qiClasses.map((c) => {
                const active = selectedClassId === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedClassId(c.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      active
                        ? 'border-gold-400 bg-gold-500/15 text-paper-100 shadow-md ring-1 ring-gold-400'
                        : 'border-gold-500/20 bg-ink-950/50 hover:border-gold-500/40 text-paper-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-han text-xs font-bold text-gold-300 flex items-center gap-1">
                          <span className="text-[11px] opacity-80">{c.glyph}</span>
                          {c.name}
                        </span>
                        <span className="text-[9px] text-paper-400 font-mono">{c.combatRange === 'melee' ? 'Cận chiến' : 'Đánh xa'}</span>
                      </div>
                      <p className="text-[10px] text-paper-400 line-clamp-2 mt-1">{c.signatureMechanic}</p>
                    </div>
                    <div className="text-[10px] text-jade-400 font-semibold mt-2 pt-1 border-t border-gold-500/10">
                      {c.passiveName}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gold-500/20 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gold-500/30 text-paper-300 hover:text-paper-100 hover:bg-gold-500/10 text-xs transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-ink-950 font-han font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all cursor-pointer active:scale-95"
          >
            Lập Đạo Tâm · Xuất Sơn!
          </button>
        </div>
      </div>
    </div>
  )
}

