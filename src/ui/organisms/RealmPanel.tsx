import type { RealmStage } from '@/content/realms'
import { formatPercent } from '@/lib/format'
import type { FxEvent } from '@/store/gameStore'
import { QiMotes } from '@/ui/atoms/QiMotes'
import { CharacterDisplay } from './CharacterDisplay'

interface RealmPanelProps {
  realm: RealmStage
  nextRealm: RealmStage | null
  chance: number
  pendingBonus: number
  progress: number
  fx: FxEvent | null
  realmIndex?: number
  ready?: boolean
  avatarId?: string
  onAvatarClick?: () => void
}

const FX_CLASS: Record<FxEvent['kind'], string> = {
  'breakthrough-success': 'animate-ink-burst',
  'breakthrough-fail': 'animate-shake',
}

export function RealmPanel({
  realm,
  nextRealm,
  chance,
  pendingBonus,
  progress,
  fx,
  realmIndex = 0,
  ready = false,
  avatarId,
  onAvatarClick,
}: RealmPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-gold-500/20 bg-ink-800/70 p-5 sm:p-6 shadow-ink">
      {/* Thủy mặc thư pháp chữ Đạo nền sau */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-han text-[11rem] leading-none text-paper-100/[0.035] select-none"
      >
        道
      </div>

      <QiMotes progress={progress} />

      <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-around sm:text-left">
        {/* Đạo Thân Sống Động Với Khí Tràng Tiến Hóa */}
        <div className="shrink-0">
          <CharacterDisplay
            realmIndex={realmIndex}
            progress={progress}
            ready={ready}
            avatarId={avatarId}
            onAvatarClick={onAvatarClick}
          />
        </div>

        {/* Khối Thông Tin Cảnh Giới */}
        <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left">
          <p className="text-xs tracking-[0.4em] text-paper-400 uppercase">Cảnh giới</p>
          <h2
            key={fx?.id ?? 'static'}
            className={`mt-1 font-han text-3xl font-black tracking-wider text-paper-100 sm:text-4xl lg:text-5xl ${
              fx ? FX_CLASS[fx.kind] : ''
            }`}
          >
            {realm.majorName}
          </h2>

          {realm.stageLabel && (
            <p className="mt-1 font-han text-lg text-gold-400 sm:text-xl">{realm.stageLabel}</p>
          )}

          {realm.kiemLaiRealm && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs text-gold-300">
                <span className="text-gold-400">📜</span>
                <span>{realm.kiemLaiRealm}</span>
              </span>
            </div>
          )}

          <p className="mt-3 text-sm text-paper-300">
            {nextRealm ? (
              <>
                Cảnh giới kế: <span className="text-paper-100 font-medium">{nextRealm.name}</span>
                <span className="text-paper-400"> · tỉ lệ </span>
                <span className={pendingBonus > 0 ? 'text-gold-400 font-bold' : 'text-paper-400'}>
                  {formatPercent(chance)}
                </span>
              </>
            ) : (
              'Đại đạo viên mãn, không còn gì để đột phá.'
            )}
          </p>

          {realm.tribulation && (
            <p className="mt-2 text-xs text-vermilion-400 font-medium animate-pulse">
              ⚡ Đột phá lần này sẽ dẫn động Thiên Kiếp!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
