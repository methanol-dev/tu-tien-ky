import { DUNGEON_BY_ID, DUNGEONS } from '@/content/dungeons'
import { ITEM_BY_ID } from '@/content/items'
import { REALMS } from '@/content/realms'
import {
  canStartExpedition,
  getCombatStats,
  getExpeditionProgress,
  isDungeonUnlocked,
  isExpeditionReady,
} from '@/engine'
import { formatDurationMs, formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { StatRow } from '@/ui/molecules/StatRow'

export function ExpeditionScreen() {
  const state = useGameStore((s) => s.state)
  const start = useGameStore((s) => s.startExpedition)
  const complete = useGameStore((s) => s.completeExpedition)

  const stats = getCombatStats(state)
  const job = state.expedition
  const jobDungeon = job ? DUNGEON_BY_ID[job.dungeonId] : null
  const ready = isExpeditionReady(state)
  const progress = getExpeditionProgress(state)

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h2 className="font-han text-2xl text-gold-400">Bí cảnh</h2>
        <StatRow
          stats={[
            { label: 'Khí huyết (HP)', value: formatNumber(stats.hp) },
            { label: 'Công', value: formatNumber(stats.atk) },
            { label: 'Thủ', value: formatNumber(stats.def) },
            { label: 'Chiến tích', value: `${state.stats.expeditionWins} / ${state.stats.expeditions}` },
          ]}
        />
      </header>

      {job && jobDungeon && (
        <section className="space-y-3 rounded-lg border border-gold-500/20 bg-ink-800/70 p-5">
          <p className="font-han text-lg text-paper-100">Đang thám hiểm {jobDungeon.name}</p>
          <div className="h-3 overflow-hidden rounded-full bg-ink-950" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className={`h-full rounded-full transition-[width] duration-300 ${ready ? 'bg-gold-400' : 'bg-gradient-to-r from-jade-500 to-qi-400'}`} style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-paper-400 tabular-nums">
              {ready ? 'Đã tới nơi, chuẩn bị giao chiến' : `Còn ${formatDurationMs(job.finishAtMs - state.playedMs)}`}
            </span>
            <Button variant="primary" disabled={!ready} onClick={complete} className={ready ? 'animate-pulse' : ''}>
              Khai chiến
            </Button>
          </div>
        </section>
      )}

      <ul className="grid gap-3 md:grid-cols-2">
        {DUNGEONS.map((d) => {
          const unlocked = isDungeonUnlocked(state, d)
          const can = canStartExpedition(state, d.id)
          const bossName = d.enemies.at(-1)?.name
          return (
            <li key={d.id} className={`flex flex-col gap-2 rounded-lg border p-4 ${unlocked ? 'border-paper-400/15 bg-ink-800/60' : 'border-paper-400/5 bg-ink-900/40 opacity-70'}`}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-han text-lg text-paper-100">{d.name}</h3>
                <span className="shrink-0 text-xs text-paper-400">{formatDurationMs(d.durationMs)}</span>
              </div>
              <p className="text-xs text-paper-400">{d.description}</p>
              <p className="text-sm text-paper-300">
                {d.enemies.length} đợt · Boss: <span className="text-vermilion-400">{bossName}</span>
              </p>
              <p className="text-xs text-jade-400">
                Rơi: {d.loot.map((l) => ITEM_BY_ID[l.itemId].name).join(', ')}
                {d.bossLoot && <span className="text-gold-400"> · {ITEM_BY_ID[d.bossLoot.itemId].name} (hiếm)</span>}
              </p>
              <div className="mt-auto flex items-center justify-between pt-1">
                {!unlocked ? <span className="text-xs text-vermilion-400">Cần {REALMS[d.minRealmIndex].name}</span> : <span className="text-xs text-paper-400">Đề nghị: {REALMS[d.minRealmIndex].name}+</span>}
                {unlocked && (
                  <Button variant={can ? 'primary' : 'secondary'} disabled={!can} onClick={() => start(d.id)}>
                    Xuất phát
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
