import {
  canBreakthrough,
  canGather,
  getActiveBuffs,
  getBreakthroughChance,
  getBreakthroughProgress,
  getCombatStats,
  getGatherCooldownMs,
  getLifespanDays,
  getNextRealm,
  getQiRate,
  getRealm,
  getStoneRate,
  isLifespanExceeded,
} from '@/engine'
import { formatAge, formatDurationMs, formatNumber, formatPercent, formatRate } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { QiBar } from '@/ui/molecules/QiBar'
import { StatRow } from '@/ui/molecules/StatRow'
import { CultivationLog } from '@/ui/organisms/CultivationLog'
import { RealmPanel } from '@/ui/organisms/RealmPanel'

export function GameScreen() {
  const state = useGameStore((s) => s.state)
  const fx = useGameStore((s) => s.fx)
  const meditate = useGameStore((s) => s.meditate)
  const breakthrough = useGameStore((s) => s.breakthrough)
  const gather = useGameStore((s) => s.gather)
  const setCharacterModalOpen = useGameStore((s) => s.setCharacterModalOpen)

  const realm = getRealm(state)
  const nextRealm = getNextRealm(state)
  const ready = canBreakthrough(state)
  const expired = isLifespanExceeded(state)
  const gatherCd = getGatherCooldownMs(state)
  const buffs = getActiveBuffs(state)
  const combat = getCombatStats(state)

  return (
    <div className="grid gap-6 md:grid-cols-[1.25fr_1fr]">
      <section className="space-y-5">
        <RealmPanel
          realm={realm}
          nextRealm={nextRealm}
          chance={getBreakthroughChance(state)}
          pendingBonus={state.pendingBreakthroughBonus}
          progress={getBreakthroughProgress(state)}
          fx={fx}
        />

        <QiBar
          qi={state.qi}
          required={realm.qiRequired}
          progress={getBreakthroughProgress(state)}
          terminal={realm.terminal}
        />

        {buffs.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-xs">
            {buffs.map((b) => (
              <li key={b.id} className="rounded-full border border-jade-500/40 px-3 py-1 text-jade-400 tabular-nums">
                {b.name} x{b.qiRateMult} · {formatDurationMs(b.expiresAtMs - state.playedMs)}
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={meditate} disabled={expired} className="py-4 text-lg">
            Tu luyện
          </Button>
          <Button
            variant="primary"
            onClick={breakthrough}
            disabled={!ready}
            className={`py-4 text-lg ${ready ? 'animate-pulse' : ''}`}
          >
            Đột phá
          </Button>
          <Button
            variant="ghost"
            onClick={gather}
            disabled={!canGather(state)}
            className="col-span-2 border border-paper-400/15"
          >
            {gatherCd > 0 ? `Hái thuốc · ${formatDurationMs(gatherCd)}` : 'Hái thuốc'}
          </Button>
        </div>

        {expired && (
          <p className="rounded-md border border-vermilion-500/40 bg-vermilion-500/10 px-4 py-3 text-sm text-vermilion-400">
            Thọ nguyên đã cạn. Linh khí không còn tụ lại được nữa. Qua tab Luân hồi để chuyển thế.
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-han text-sm text-paper-300">Căn cơ tu vi</h3>
            <button
              type="button"
              onClick={() => setCharacterModalOpen(true)}
              className="text-xs text-gold-400 hover:text-gold-300 hover:underline"
            >
              Chi tiết đạo thân ›
            </button>
          </div>
          <StatRow
            stats={[
              { label: 'Tốc độ', value: formatRate(getQiRate(state)), hint: 'Linh khí mỗi giây' },
              { label: 'Linh thạch', value: formatRate(getStoneRate(state)), hint: 'Linh thạch mỗi giây' },
              { label: 'Tuổi', value: formatAge(state.ageDays), tone: expired ? 'warn' : 'default' },
              { label: 'Thọ nguyên', value: `${getLifespanDays(state) / 360} năm` },
            ]}
          />

          <div className="flex items-center justify-between pt-1">
            <h3 className="font-han text-sm text-paper-300">Chiến lực hành tẩu</h3>
            <span className="text-[11px] text-paper-400">Khí huyết · Công · Thủ · Tốc</span>
          </div>
          <StatRow
            stats={[
              { label: 'Khí huyết', value: formatNumber(combat.hp) },
              {
                label: 'Công',
                value: formatNumber(combat.atk),
                hint: `Bạo kích ${formatPercent(combat.crit)} · ×${combat.critMult.toFixed(2)}`,
              },
              { label: 'Thủ', value: formatNumber(combat.def) },
              {
                label: 'Tốc đánh',
                value: `${(1000 / combat.attackMs).toFixed(2)}/s`,
                hint: combat.lifesteal > 0 ? `Hấp huyết ${formatPercent(combat.lifesteal)}` : undefined,
              },
            ]}
          />
        </div>
      </section>

      <CultivationLog entries={state.log} />
    </div>
  )
}
