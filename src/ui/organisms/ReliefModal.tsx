import type { FC } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

export const ReliefModal: FC = () => {
  const open = useGameStore((s) => s.reliefModalOpen)
  const claimReliefPack = useGameStore((s) => s.claimReliefPack)
  const dismissReliefPack = useGameStore((s) => s.dismissReliefPack)

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={dismissReliefPack}
      title="THÔI THÀNH ĐIỂM HÓA · HỘ MỆNH PHÙ LỤC"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button variant="ghost" onClick={dismissReliefPack} className="text-xs">
            Tự lực cánh sinh (Bỏ qua)
          </Button>
          <Button
            variant="primary"
            onClick={claimReliefPack}
            className="animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)] text-xs font-bold"
          >
            Lĩnh Nhận Cơ Duyên 🌟
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-vermilion-500/40 bg-vermilion-950/40 text-3xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          📜
        </div>

        <div>
          <h3 className="font-serif text-base font-bold text-paper-100">
            Trắc Trở Bức Tường · Tiên Nhân Tương Trợ
          </h3>
          <p className="mt-1 text-xs text-paper-300 font-serif italic leading-relaxed">
            “Đường tu tiên trắc trở, ngã ngựa mấy lần há đáng nản lòng? Lão phu lưu lại đạo Kim Quang Hộ Mệnh Phù này, giúp ngươi vững tâm phá vỡ gông cùm!”
          </p>
        </div>

        {/* Các bảo vật cứu trợ */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border border-gold-500/30 bg-ink-900/80 p-3">
            <div className="text-xl">🔥</div>
            <div className="mt-1 font-serif font-bold text-gold-300">+20 Chân Hỏa</div>
            <div className="mt-0.5 text-[10px] text-paper-400">Rèn đồ mới tăng lực chiến</div>
          </div>

          <div className="rounded-lg border border-jade-500/30 bg-ink-900/80 p-3">
            <div className="text-xl">💊</div>
            <div className="mt-1 font-serif font-bold text-jade-300">+3 Hộ Tâm Đan</div>
            <div className="mt-0.5 text-[10px] text-paper-400">Bảo vệ tâm cảnh đột phá</div>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-ink-900/80 p-3">
            <div className="text-xl">🛡️</div>
            <div className="mt-1 font-serif font-bold text-cyan-300">+20% Công Thủ</div>
            <div className="mt-0.5 text-[10px] text-paper-400">Hiệu lực trong 10 trận</div>
          </div>
        </div>

        <div className="rounded-md border border-paper-400/10 bg-ink-950/60 p-2 text-[11px] text-paper-400">
          Gói cứu trợ khẩn cấp kích hoạt khi ngã ngựa liên tiếp trước Boss. Hoàn toàn miễn phí, mỗi cảnh giới chỉ xuất hiện một lần duy nhất.
        </div>
      </div>
    </Modal>
  )
}
