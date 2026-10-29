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
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-paper-400">
            Linh thạch hiện có: <span className="font-mono text-gold-300">◆{formatNumber(state.stones)}</span>
            {daoVan > 0 && (
              <span className="ml-3">
                Đạo Văn: <span className="font-mono text-cyan-300">{daoVan}</span>
              </span>
            )}
          </span>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Banner Mở khóa Tiên Thiên */}
        <div className="rounded-xl border border-gold-500/40 bg-gradient-to-r from-ink-900 via-amber-950/30 to-ink-900 p-4 shadow-ink">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
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
              <p className="mt-1 text-xs text-paper-300">
                Nhân gấp nhiều lần phần thưởng, tặng thêm Rương Đỏ và Đan Dược Đột Phá cho mỗi mốc cảnh giới.
              </p>
            </div>

            {!fund.premiumUnlocked && (
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  variant="primary"
                  onClick={() => unlockPremiumGrowthFund('stones')}
                  disabled={state.stones < 500_000}
                  className="text-xs"
                >
                  500,000 Linh Thạch
                </Button>
                {daoVan >= 50 && (
                  <Button
                    variant="secondary"
                    onClick={() => unlockPremiumGrowthFund('daoVan')}
                    className="text-xs"
                  >
                    50 Đạo Văn
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Danh sách 12 mốc cảnh giới */}
        <div className="space-y-2.5">
          {GROWTH_FUND_MILESTONES.map((m) => {
            const reached = currentRealm >= m.realmIndex
            const claimedFree = fund.claimedFree.includes(m.realmIndex)
            const claimedPrem = fund.claimedPremium.includes(m.realmIndex)
            const canFree = canClaimGrowthFund(state, m.realmIndex, false)
            const canPrem = canClaimGrowthFund(state, m.realmIndex, true)

            return (
              <div
                key={m.realmIndex}
                className={`rounded-lg border p-3 transition-colors ${
                  reached
                    ? 'border-gold-500/30 bg-ink-900/80'
                    : 'border-paper-400/10 bg-ink-950/60 opacity-70'
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  {/* Cột Tên cảnh giới */}
                  <div className="sm:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${reached ? 'text-gold-400' : 'text-paper-500'}`}>
                        {reached ? '●' : '○'}
                      </span>
                      <span className="font-serif text-sm font-bold text-paper-100">
                        {m.realmName}
                      </span>
                    </div>
                    <div className="text-[11px] text-paper-400">
                      {reached ? (
                        <span className="text-jade-400">Đã đạt cảnh giới</span>
                      ) : (
                        <span>Chưa đạt yêu cầu</span>
                      )}
                    </div>
                  </div>

                  {/* Cột Phổ thông */}
                  <div className="flex items-center justify-between sm:w-1/3 sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-paper-400/10 pt-2 sm:pt-0 sm:pl-3">
                    <div className="text-left sm:text-center text-xs">
                      <div className="text-[10px] text-paper-400">Đạo Đồ (Miễn phí)</div>
                      <div className="font-mono text-gold-300">
                        +{formatNumber(m.freeReward.stones)} đá · +{m.freeReward.fireCount} hỏa
                      </div>
                    </div>
                    <Button
                      variant={canFree ? 'primary' : 'ghost'}
                      disabled={!canFree}
                      onClick={() => claimGrowthFund(m.realmIndex, false)}
                      className="px-2.5 py-1 text-xs shrink-0"
                    >
                      {claimedFree ? 'Đã nhận ✓' : 'Lĩnh nhận'}
                    </Button>
                  </div>

                  {/* Cột Tiên Thiên */}
                  <div className="flex items-center justify-between sm:w-1/3 sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-paper-400/10 pt-2 sm:pt-0 sm:pl-3">
                    <div className="text-left sm:text-center text-xs">
                      <div className="text-[10px] text-amber-300">Tiên Thiên Cơ Duyên</div>
                      <div className="font-mono text-cyan-300">
                        +{formatNumber(m.premiumReward.stones)} đá
                        {Boolean(m.premiumReward.redChests && m.premiumReward.redChests > 0) &&
                          ` · +${m.premiumReward.redChests} rương đỏ`}
                      </div>
                    </div>
                    <Button
                      variant={canPrem ? 'secondary' : 'ghost'}
                      disabled={!canPrem}
                      onClick={() => claimGrowthFund(m.realmIndex, true)}
                      className="px-2.5 py-1 text-xs shrink-0"
                    >
                      {!fund.premiumUnlocked
                        ? 'Chưa mở 🔒'
                        : claimedPrem
                          ? 'Đã nhận ✓'
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
