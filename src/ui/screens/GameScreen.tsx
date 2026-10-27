import {
  canBreakthrough,
  getBreakthroughProgress,
  getLifespanDays,
  getNextRealm,
  getQiRate,
  getRealm,
  isLifespanExceeded,
} from '@/engine'
import { formatAge, formatRate } from '@/lib/format'
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

  const realm = getRealm(state)
  const nextRealm = getNextRealm(state)
  const ready = canBreakthrough(state)
  const expired = isLifespanExceeded(state)

  return (
    <div className="grid gap-6 md:grid-cols-[1.25fr_1fr]">
      <section className="space-y-5">
        <RealmPanel realm={realm} nextRealm={nextRealm} fx={fx} />

        <QiBar
          qi={state.qi}
          required={realm.qiRequired}
          progress={getBreakthroughProgress(state)}
          terminal={realm.terminal}
        />

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
        </div>

        {expired && (
          <p className="rounded-md border border-vermilion-500/40 bg-vermilion-500/10 px-4 py-3 text-sm text-vermilion-400">
            Thọ nguyên đã cạn. Linh khí không còn tụ lại được nữa. (Chuyển thế sẽ mở ở phiên bản sau.)
          </p>
        )}

        <StatRow
          stats={[
            { label: 'Tốc độ', value: formatRate(getQiRate(state)), hint: 'Linh khí mỗi giây' },
            { label: 'Tuổi', value: formatAge(state.ageDays), tone: expired ? 'warn' : 'default' },
            { label: 'Thọ nguyên', value: `${getLifespanDays(state) / 360} năm` },
            { label: 'Đột phá', value: `${state.stats.breakthroughs} / ${state.stats.breakthroughFailures} bại` },
          ]}
        />
      </section>

      <CultivationLog entries={state.log} />
    </div>
  )
}
