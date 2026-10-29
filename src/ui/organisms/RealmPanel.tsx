import type { RealmStage } from '@/content/realms'
import type { MartialStage } from '@/content/martialRealms'
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
  cultivationPath?: 'martial' | 'qi' | 'dual'
  martialStage?: MartialStage
  nextMartialStage?: MartialStage | null
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
  cultivationPath = 'qi',
  martialStage,
  nextMartialStage,
}: RealmPanelProps) {
  const isMartial = cultivationPath === 'martial' && martialStage

  return (
    <section className="relative overflow-hidden rounded-lg border border-gold-500/20 bg-ink-800/70 p-5 sm:p-6 shadow-ink">
      {/* Thủy mặc thư pháp chữ Đạo hoặc Võ nền sau */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center justify-center font-han text-[11rem] leading-none select-none ${
          isMartial ? 'text-vermilion-500/[0.045]' : 'text-paper-100/[0.035]'
        }`}
      >
        {isMartial ? '武' : '道'}
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
          <p className="text-xs tracking-[0.4em] text-paper-400 uppercase">
            {isMartial ? 'Cảnh giới Võ Đạo' : 'Cảnh giới Tiên Đạo'}
          </p>
          <h2
            key={fx?.id ?? 'static'}
            className={`mt-1 font-han text-3xl font-black tracking-wider text-paper-100 sm:text-4xl lg:text-5xl ${
              isMartial ? 'text-transparent bg-clip-text bg-gradient-to-r from-vermilion-400 via-paper-100 to-gold-400' : ''
            } ${fx ? FX_CLASS[fx.kind] : ''}`}
          >
            {isMartial ? martialStage.name : realm.majorName}
          </h2>

          <p className="mt-1 font-han text-lg text-gold-400 sm:text-xl">
            {isMartial ? martialStage.group : realm.stageLabel}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-xs text-gold-300">
              <span className="text-gold-400">{isMartial ? '👊' : '⚔️'}</span>
              <span>{isMartial ? 'Võ Đạo Thập Nhất Cảnh' : realm.group}</span>
              {!isMartial && realm.groupRank > 0 && <span className="text-paper-400">· Đệ {realm.groupRank} Cảnh</span>}
            </span>
          </div>

          <p className="mt-2 max-w-md text-xs italic text-paper-400 leading-relaxed font-serif">
            &ldquo;{isMartial ? martialStage.description : realm.kiemLaiLore}&rdquo;
          </p>

          <p className="mt-3 text-sm text-paper-300">
            {isMartial ? (
              nextMartialStage ? (
                <>
                  Cảnh giới kế: <span className="text-paper-100 font-medium">{nextMartialStage.name}</span>
                  <span className="text-paper-400"> · yêu cầu </span>
                  <span className="text-gold-400 font-bold">{nextMartialStage.minPunches} quyền</span>
                </>
              ) : (
                'Đạt đỉnh cao Võ Thần Cảnh, độc bộ thiên hạ!'
              )
            ) : nextRealm ? (
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

          {!isMartial && realm.tribulation && (
            <p className="mt-2 text-xs text-vermilion-400 font-medium animate-pulse">
              ⚡ Đột phá lần này sẽ dẫn động Thiên Kiếp!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
