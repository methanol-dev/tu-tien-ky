import type { RealmStage } from '@/content/realms'
import { formatPercent } from '@/lib/format'
import type { FxEvent } from '@/store/gameStore'
import { QiMotes } from '@/ui/atoms/QiMotes'

interface RealmPanelProps {
  realm: RealmStage
  nextRealm: RealmStage | null
  chance: number
  pendingBonus: number
  progress: number
  fx: FxEvent | null
}

const FX_CLASS: Record<FxEvent['kind'], string> = {
  'breakthrough-success': 'animate-ink-burst',
  'breakthrough-fail': 'animate-shake',
}

export function RealmPanel({ realm, nextRealm, chance, pendingBonus, progress, fx }: RealmPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-gold-500/20 bg-ink-800/70 px-6 py-8 text-center shadow-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-han text-[11rem] leading-none text-paper-100/[0.035] select-none"
      >
        道
      </div>
      <QiMotes progress={progress} />
      <p className="relative text-xs tracking-[0.4em] text-paper-400 uppercase">Cảnh giới</p>
      <h2
        key={fx?.id ?? 'static'}
        className={`relative mt-2 font-han text-4xl font-black tracking-wider text-paper-100 sm:text-5xl ${fx ? FX_CLASS[fx.kind] : ''}`}
      >
        {realm.majorName}
      </h2>
      {realm.stageLabel && (
        <p className="relative mt-1 font-han text-xl text-gold-400">{realm.stageLabel}</p>
      )}
      <p className="relative mt-4 text-sm text-paper-300">
        {nextRealm ? (
          <>
            Cảnh giới kế: <span className="text-paper-100">{nextRealm.name}</span>
            <span className="text-paper-400"> · tỉ lệ </span>
            <span className={pendingBonus > 0 ? 'text-gold-400' : 'text-paper-400'}>{formatPercent(chance)}</span>
          </>
        ) : (
          'Đại đạo viên mãn, không còn gì để đột phá.'
        )}
      </p>
      {realm.tribulation && (
        <p className="relative mt-2 text-xs text-vermilion-400">⚡ Đột phá lần này sẽ dẫn động Thiên Kiếp</p>
      )}
    </section>
  )
}
