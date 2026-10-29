import type { FC } from 'react'
import {
  canClaimGrowthFund,
  GROWTH_FUND_MILESTONES,
} from '@/engine/retention'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

export const GrowthFundModal: FC = () => {
  const open = useGameStore((s) => s.growthFundModalOpen)
  const setOpen = useGameStore((s) => s.setGrowthFundModalOpen)
  const state = useGameStore((s) => s.state)
  const claimGrowthFund = useGameStore((s) => s.claimGrowthFund)
  const unlockPremiumGrowthFund = useGameStore((s) => s.unlockPremiumGrowthFund)

  if (!open) return null

  const fund = state.growthFund
  const currentRealm = state.realmIndex
  const daoVan = state.legacy?.daoVan ?? 0

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="ĐẠO ĐỒ CƠ DUYÊN · QUỸ TRƯỞNG THÀNH"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-paper-400">
            Linh thạch hiện có: <span className="font-mono text-gold-300 font-bold">◆{formatNumber(state.stones)}</span>
            {daoVan > 0 && (
              <span className="ml-3">
                Đạo Vận: <span className="font-mono text-cyan-300 font-bold">{daoVan}</span>
              </span>
            )}
          </span>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Banner Mở khóa Tiên Thiên */}
        <div className="rounded-xl border border-gold-500/40 bg-gradient-to-r from-ink-900 via-amber-950/30 to-ink-900 p-4 shadow-ink">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-serif text-base font-bold text-gold-300">
                  Tiên Thiên Cơ Duyên
                </h3>
                {fund.premiumUnlocked && (
                  <span className="rounded bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-gold-300 border border-gold-500/40">
                    ĐÃ KHAI MỞ
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-paper-300 leading-relaxed">
                Nhân gấp nhiều lần phần thưởng, tặng thêm Rương Đỏ và Đan Dược Đột Phá cho mỗi mốc cảnh giới vượt qua.
              </p>
            </div>

            {!fund.premiumUnlocked && (
              <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={() => unlockPremiumGrowthFund('stones')}
                    disabled={state.stones < 500_000}
                    className="px-3.5 py-1.5 text-xs font-bold whitespace-nowrap"
                  >
                    Khai Mở · 500,000 Linh Thạch
                  </Button>
                  {daoVan >= 50 && (
                    <Button
                      variant="secondary"
                      onClick={() => unlockPremiumGrowthFund('daoVan')}
                      className="px-3 py-1.5 text-xs font-bold whitespace-nowrap"
                    >
                      50 Đạo Vận
                    </Button>
                  )}
                </div>
                {state.stones < 500_000 && (
                  <span className="text-[11px] text-paper-400">
                    (Hiện có: <span className="font-mono text-gold-400">◆{formatNumber(state.stones)}</span> / 500K)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Danh sách 12 mốc cảnh giới */}
        <div className="space-y-3">
          {GROWTH_FUND_MILESTONES.map((m) => {
            const reached = currentRealm >= m.realmIndex
            const claimedFree = fund.claimedFree.includes(m.realmIndex)
            const claimedPrem = fund.claimedPremium.includes(m.realmIndex)
            const canFree = canClaimGrowthFund(state, m.realmIndex, false)
            const canPrem = canClaimGrowthFund(state, m.realmIndex, true)

            return (
              <div
                key={m.realmIndex}
                className={`rounded-xl border p-3.5 transition-colors ${
                  reached
                    ? 'border-gold-500/30 bg-ink-900/90 shadow-sm'
                    : 'border-paper-400/10 bg-ink-950/60 opacity-75'
                }`}
              >
                {/* Header mốc: Tên Cảnh Giới & Trạng Thái Đạt */}
                <div className="flex items-center justify-between border-b border-paper-400/10 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${reached ? 'text-gold-400' : 'text-paper-500'}`}>
                      {reached ? '●' : '○'}
                    </span>
                    <span className="font-serif text-sm sm:text-base font-bold text-paper-100">
                      {m.realmName}
                    </span>
                    <span className="text-xs text-paper-400 font-serif hidden sm:inline">
                      · Đệ {m.realmIndex + 1} Cảnh
                    </span>
                  </div>
                  <div className="text-xs font-serif">
                    {reached ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-jade-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-jade-400 border border-jade-500/30">
                        ✓ Đã đạt cảnh giới
                      </span>
                    ) : (
                      <span className="text-[11px] text-paper-500 italic">
                        Chưa đạt yêu cầu
                      </span>
                    )}
                  </div>
                </div>

                {/* 2 Khối Quà Tách Biệt Rõ Ràng: Đạo Đồ & Tiên Thiên */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cột Phổ Thông / Đạo Đồ */}
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-paper-400/15 bg-ink-950/70 p-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-paper-400 uppercase tracking-wider">
                        Đạo Đồ (Miễn phí)
                      </div>
                      <div className="font-mono text-xs text-gold-300 font-semibold truncate mt-0.5">
                        +{formatNumber(m.freeReward.stones)} Linh Thạch
                      </div>
                      <div className="text-[11px] text-paper-300 font-mono">
                        +{m.freeReward.fireCount} Chân Hỏa
                      </div>
                    </div>
                    <Button
                      variant={canFree ? 'primary' : 'ghost'}
                      disabled={!canFree}
                      onClick={() => claimGrowthFund(m.realmIndex, false)}
                      className="px-3 py-1.5 text-xs shrink-0 whitespace-nowrap min-w-[80px]"
                    >
                      {claimedFree ? 'Đã nhận' : 'Lĩnh nhận'}
                    </Button>
                  </div>

                  {/* Cột Tiên Thiên Cơ Duyên */}
                  <div
                    className={`flex items-center justify-between gap-3 rounded-lg border p-2.5 ${
                      fund.premiumUnlocked
                        ? 'border-gold-500/30 bg-gold-500/5'
                        : 'border-amber-500/20 bg-ink-950/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <span>✨ Tiên Thiên</span>
                      </div>
                      <div className="font-mono text-xs text-cyan-300 font-semibold truncate mt-0.5">
                        +{formatNumber(m.premiumReward.stones)} Linh Thạch
                      </div>
                      <div className="text-[11px] text-vermilion-300 font-mono">
                        {(m.premiumReward.redChests ?? 0) > 0
                          ? `+${m.premiumReward.redChests} Rương Đỏ`
                          : '+ Đan Dược Đột Phá'}
                      </div>
                    </div>
                    <Button
                      variant={canPrem ? 'secondary' : 'ghost'}
                      disabled={!canPrem}
                      onClick={() => claimGrowthFund(m.realmIndex, true)}
                      className="px-3 py-1.5 text-xs shrink-0 whitespace-nowrap min-w-[80px]"
                    >
                      {!fund.premiumUnlocked
                        ? 'Chưa mở 🔒'
                        : claimedPrem
                          ? 'Đã nhận'
                          : 'Lĩnh nhận'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
