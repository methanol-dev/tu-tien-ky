import { REALMS } from '@/content/realms'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface AdminModalProps {
  open: boolean
  onClose: () => void
}

const SHORTCUT_REALMS = [
  { name: 'Phàm Nhân', index: 0 },
  { name: 'Luyện Khí Tầng 1', index: 1 },
  { name: 'Trúc Cơ Sơ Kỳ', index: 4 },
  { name: 'Kim Đan Sơ Kỳ', index: 7 },
  { name: 'Nguyên Anh Sơ Kỳ', index: 10 },
  { name: 'Hóa Thần Sơ Kỳ', index: 13 },
  { name: 'Đại Thừa Sơ Kỳ', index: 22 },
  { name: 'Phi Thăng Cảnh', index: 28 },
]

const TIME_SCALES = [1, 2, 5, 10, 20, 50]

export function AdminModal({ open, onClose }: AdminModalProps) {
  const state = useGameStore((s) => s.state)
  const adminAddStones = useGameStore((s) => s.adminAddStones)
  const adminAddQi = useGameStore((s) => s.adminAddQi)
  const adminSetRealm = useGameStore((s) => s.adminSetRealm)
  const adminAddPunches = useGameStore((s) => s.adminAddPunches)
  const adminAddChests = useGameStore((s) => s.adminAddChests)
  const adminUnlockAllRegions = useGameStore((s) => s.adminUnlockAllRegions)
  const adminGiveFullGear = useGameStore((s) => s.adminGiveFullGear)
  const adminAddHerbsAndPills = useGameStore((s) => s.adminAddHerbsAndPills)
  const adminInstantBreakthrough = useGameStore((s) => s.adminInstantBreakthrough)
  const adminSetTimeScale = useGameStore((s) => s.adminSetTimeScale)

  if (!open) return null

  const currentRealm = REALMS[state.realmIndex]
  const currentScale = state.settings.timeScale ?? 1

  return (
    <Modal
      open={open}
      title="⚡ Thiên Đạo Chi Nhãn · Admin Dev Panel"
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-paper-400 font-serif">
            Mẹo: Click 5 lần vào chữ 劍來 hoặc nhấn Ctrl+Shift+D để mở lại bảng này.
          </span>
          <Button variant="primary" onClick={onClose} autoFocus>
            Đóng bảng
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Banner cảnh báo bảo mật */}
        <div className="rounded-lg border border-gold-500/30 bg-ink-950/80 p-3 text-xs">
          <p className="text-gold-300 font-han font-bold flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Chế độ Ẩn Thiên Đạo (Không hiển thị cho người chơi thường)</span>
          </p>
          <p className="mt-1 text-paper-300">
            Hiện tại: Cảnh giới <strong className="text-paper-100">{currentRealm.name}</strong> ·{' '}
            Linh thạch <strong className="text-gold-400">{formatNumber(state.stones)}</strong> ·{' '}
            Tốc độ <strong className="text-jade-400">×{currentScale}</strong>
          </p>
        </div>

        {/* ================= 1. TU VI & CẢNH GIỚI ================= */}
        <section className="space-y-2 rounded-lg border border-paper-400/15 bg-ink-900/60 p-3.5">
          <h4 className="font-han text-sm text-qi-300 flex items-center gap-2">
            <span>🧘</span>
            <span>Tu Vi & Cảnh Giới Luyện Khí Sĩ</span>
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddQi(100_000)}>
              +100K Khí
            </Button>
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddQi(1_000_000)}>
              +1 Triệu Khí
            </Button>
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddQi(10_000_000)}>
              +10 Triệu Khí
            </Button>
            <Button
              variant="primary"
              className="px-3 py-1 text-xs shadow-md"
              onClick={() => adminInstantBreakthrough()}
            >
              ⚡ Đột Phá Tức Thì (100%)
            </Button>
          </div>

          <div className="pt-2">
            <span className="text-[11px] text-paper-400 block mb-1.5">Nhảy cóc cảnh giới:</span>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {SHORTCUT_REALMS.map((r) => (
                <button
                  key={r.index}
                  type="button"
                  onClick={() => adminSetRealm(r.index)}
                  className={`rounded border px-2 py-1 text-xs transition-colors ${
                    state.realmIndex === r.index
                      ? 'border-gold-400 bg-gold-500/20 text-gold-300 font-bold'
                      : 'border-paper-400/20 bg-ink-950/70 text-paper-300 hover:border-gold-500/40'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 2. VÕ ĐẠO QUYỀN Ý ================= */}
        <section className="space-y-2 rounded-lg border border-paper-400/15 bg-ink-900/60 p-3.5">
          <h4 className="font-han text-sm text-vermilion-300 flex items-center gap-2">
            <span>👊</span>
            <span>Thuần Túy Võ Đạo (Hám Sơn Quyền)</span>
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddPunches(500)}>
              +500 Quyền (Lên Luyện Cốt)
            </Button>
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddPunches(2_000)}>
              +2,000 Quyền (Lên Kim Thân)
            </Button>
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddPunches(10_000)}>
              +10,000 Quyền (Lên Viễn Du/Quy Chân)
            </Button>
          </div>
        </section>

        {/* ================= 3. TÀI PHÚ & PHÁP BẢO 12 Ô ================= */}
        <section className="space-y-2 rounded-lg border border-paper-400/15 bg-ink-900/60 p-3.5">
          <h4 className="font-han text-sm text-gold-400 flex items-center gap-2">
            <span>🪙</span>
            <span>Linh Thạch, Rương Báu & 12 Ô Trang Bị</span>
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddStones(100_000)}>
              +100K Linh Thạch
            </Button>
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddStones(1_000_000)}>
              +1M Linh Thạch
            </Button>
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddChests(50, 50)}>
              🎁 +50 Rương Thường & +50 Rương Đỏ
            </Button>
            <Button
              variant="primary"
              className="px-3 py-1 text-xs border border-vermilion-500/50 bg-gradient-to-r from-vermilion-700 to-vermilion-900 shadow-md"
              onClick={() => adminGiveFullGear()}
            >
              🛡️ Nhận Full 12 Món Thần Bậc 9
            </Button>
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => adminAddHerbsAndPills(99)}>
              🌿 +99 Mọi Loại Thảo Dược & Đan Dược
            </Button>
          </div>
        </section>

        {/* ================= 4. THIÊN HẠ & GIA TỐC ================= */}
        <section className="space-y-3 rounded-lg border border-paper-400/15 bg-ink-900/60 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-han text-sm text-jade-400 flex items-center gap-2">
              <span>🗺️</span>
              <span>5 Tòa Thiên Hạ & Gia Tốc Thời Gian</span>
            </h4>
            <Button
              variant="secondary"
              className="px-3 py-1 text-xs text-jade-300 border-jade-500/40 hover:bg-jade-950/40"
              onClick={() => adminUnlockAllRegions()}
            >
              Mở Khóa Toàn Bộ 9 Vùng Đất
            </Button>
          </div>

          <div className="pt-1">
            <span className="text-[11px] text-paper-400 block mb-1.5">Tốc độ mô phỏng game (Time Scale):</span>
            <div className="flex flex-wrap items-center gap-2">
              {TIME_SCALES.map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => adminSetTimeScale(scale)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                    currentScale === scale
                      ? 'border border-gold-400 bg-gold-500/30 text-gold-300 ring-1 ring-gold-400'
                      : 'border border-paper-400/20 bg-ink-950/80 text-paper-300 hover:border-gold-500/40'
                  }`}
                >
                  ×{scale}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Modal>
  )
}
