import type { FC } from 'react'
import {
  getSimulatedLeaderboard,
  WEEKLY_CYCLES,
  WEEKLY_MILESTONES,
} from '@/engine/retention'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

export const WeeklyEventModal: FC = () => {
  const open = useGameStore((s) => s.weeklyEventModalOpen)
  const setOpen = useGameStore((s) => s.setWeeklyEventModalOpen)
  const state = useGameStore((s) => s.state)
  const claimWeeklyMilestone = useGameStore((s) => s.claimWeeklyMilestone)

  if (!open) return null

  const eventState = state.weeklyEvent
  const currentCycle = WEEKLY_CYCLES[eventState.cycleWeek] ?? WEEKLY_CYCLES[0]
  const leaderboard = getSimulatedLeaderboard(state)

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="SỰ KIỆN TUẦN HOÀN · BẢNG VINH DANH KIẾM LAI"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-paper-400">
            Điểm sự kiện hiện có:{' '}
            <span className="font-mono font-bold text-gold-300">{eventState.points} điểm</span>
          </span>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Banner sự kiện tuần hiện tại */}
        <div className="rounded-xl border border-gold-500/30 bg-gradient-to-r from-ink-900 via-ink-950 to-ink-900 p-4 shadow-ink">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentCycle.icon}</span>
            <div>
              <div className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase">
                Chủ Đề Tuần Này · {currentCycle.theme}
              </div>
              <h3 className="font-serif text-lg font-bold text-paper-100">
                {currentCycle.name}
              </h3>
              <p className="mt-0.5 text-xs text-paper-300">{currentCycle.desc}</p>
            </div>
          </div>
        </div>

        {/* Các mốc điểm tích lũy */}
        <div className="space-y-2">
          <h4 className="font-serif text-sm font-bold text-paper-200">
            Mốc Thưởng Điểm Tích Lũy
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WEEKLY_MILESTONES.map((m, idx) => {
              const reached = eventState.points >= m.points
              const claimed = eventState.claimedMilestones.includes(idx)
              const canClaim = reached && !claimed

              return (
                <div
                  key={m.points}
                  className={`flex flex-col justify-between rounded-lg border p-2.5 text-xs transition-colors ${
                    reached
                      ? 'border-gold-500/40 bg-ink-900/90'
                      : 'border-paper-400/10 bg-ink-950/60 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gold-300 font-bold">{m.points} Điểm</span>
                      <span className={reached ? 'text-jade-400' : 'text-paper-500'}>
                        {reached ? '✓' : `${eventState.points}/${m.points}`}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-paper-300">
                      +{formatNumber(m.reward.stones)} đá
                      <div>+{m.reward.fireCount} Chân Hỏa</div>
                      {m.reward.redChests && (
                        <div className="text-vermilion-300">+{m.reward.redChests} Rương đỏ</div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant={canClaim ? 'primary' : 'ghost'}
                    disabled={!canClaim}
                    onClick={() => claimWeeklyMilestone(idx)}
                    className="mt-2 w-full py-1 text-[11px]"
                  >
                    {claimed ? 'Đã nhận' : 'Lĩnh nhận'}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bảng Vinh Danh Kiếm Tu Kiếm Lai */}
        <div className="space-y-2 pt-2 border-t border-paper-400/10">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-gold-300">
              Bảng Vinh Danh Kiếm Tu Kiếm Khí Trường Thành
            </h4>
            <span className="text-[11px] text-paper-400 font-serif">Mô phỏng bảng xếp hạng</span>
          </div>

          <div className="divide-y divide-paper-400/10 rounded-lg border border-paper-400/15 bg-ink-900/60 text-xs">
            {leaderboard.map((e) => (
              <div
                key={e.name}
                className={`flex items-center justify-between px-3 py-2 ${
                  e.isPlayer ? 'bg-gold-500/10 font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center font-mono font-bold ${
                      e.rank === 1
                        ? 'text-gold-400 text-sm'
                        : e.rank === 2
                          ? 'text-paper-200'
                          : e.rank === 3
                            ? 'text-amber-500'
                            : 'text-paper-500'
                    }`}
                  >
                    #{e.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={e.isPlayer ? 'text-gold-300' : 'text-paper-100'}>
                        {e.name}
                      </span>
                      {e.isPlayer && (
                        <span className="rounded bg-gold-500/20 px-1 py-0.2 text-[9px] text-gold-300">
                          BẠN
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-paper-400 font-serif">{e.title}</div>
                  </div>
                </div>

                <div className="font-mono text-gold-300 text-right">
                  {formatNumber(e.points)}{' '}
                  <span className="text-[10px] text-paper-400">điểm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

