import type { CSSProperties } from 'react'
import { REALMS } from '@/content/realms'
import { DIFFICULTY_NAMES, STAGES_PER_REGION } from '@/content/regions'
import { type GameState, getPhaseProgress, getRegion, isRegionUnlocked } from '@/engine'
import { formatDurationMs } from '@/lib/format'
import { EnemySilhouette, HeroSilhouette } from '@/ui/silhouettes'

interface Props {
  state: GameState
  /** 56–72px strip layout: figures only, no captions. */
  compact?: boolean
}

/** How long (played ms) a damage number stays on screen. */
const FLOAT_MS = 900
const FLASH_MS = 260

const ENEMY_X = ['66%', '82%', '92%']
const FAR = 'M0 120 L0 70 Q80 30 160 60 T320 50 T480 75 T640 45 T800 65 T960 40 T1120 60 L1200 55 L1200 120 Z'
const MID = 'M0 120 L0 85 Q60 55 140 80 T300 70 T440 90 T600 65 T760 85 T900 60 T1060 80 L1200 72 L1200 120 Z'
const NEAR = 'M0 120 L0 100 Q40 86 100 96 T240 92 T380 104 T520 90 T660 100 T800 88 T940 98 T1080 92 L1200 96 L1200 120 Z'

function Layer({ d, color, duration, running, opacity }: { d: string; color: string; duration: number; running: boolean; opacity: number }) {
  const style: CSSProperties = { animationDuration: `${duration}s`, animationPlayState: running ? 'running' : 'paused', color, opacity }
  return (
    <div className="journey-layer absolute inset-x-0 bottom-0 flex w-[200%]" style={style} aria-hidden>
      {[0, 1].map((i) => (
        <svg key={i} viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-1/2 fill-current">
          <path d={d} />
        </svg>
      ))}
    </div>
  )
}

export function JourneyStage({ state, compact = false }: Props) {
  const j = state.journey
  const region = getRegion(state)
  const p = region.palette
  const unlocked = isRegionUnlocked(state, region)
  const now = state.playedMs
  const player = j.party[0]
  const hpPct = player.maxHp > 0 ? Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100)) : 0
  const walking = j.phase === 'walk'

  const recent = j.events.filter((e) => now - e.atMs < FLOAT_MS)
  const lastPlayerHit = j.events.filter((e) => (e.kind === 'hit' || e.kind === 'crit') && now - e.atMs < FLASH_MS).at(-1)
  const lastHurt = j.events.filter((e) => e.kind === 'hurt' && now - e.atMs < FLASH_MS).at(-1)
  const lastDeath = j.events.filter((e) => e.kind === 'death' && now - e.atMs < 1500).at(-1)

  const heroAnim =
    j.phase === 'retreat' ? 'journey-limp' : j.phase === 'rest' ? 'journey-breathe' : walking ? 'journey-walk' : lastPlayerHit ? 'journey-lunge' : 'journey-breathe'

  const phaseText = (() => {
    if (!unlocked) return `Tĩnh tọa · cần ${REALMS[region.minRealmIndex].name}`
    switch (j.phase) {
      case 'rest':
        return 'Tĩnh tọa'
      case 'walk':
        return j.stage >= STAGES_PER_REGION ? 'Tiến vào sào huyệt' : 'Đang đi'
      case 'fight':
        return j.enemies.some((e) => e.boss) ? 'Giao chiến với boss' : 'Giao chiến'
      case 'retreat':
        return `Dưỡng thương · ${formatDurationMs(Math.max(0, j.phaseUntilMs - now))}`
    }
  })()

  const h = compact ? 'h-full' : 'h-44 md:h-60'
  const figure = compact ? 'h-[78%]' : 'h-[58%]'

  return (
    <div
      className={`relative ${h} w-full overflow-hidden ${compact ? '' : 'rounded-lg border border-paper-400/10 shadow-ink'}`}
      style={{ background: `linear-gradient(to bottom, ${p.sky} 0%, ${p.far} 70%, ${p.ground} 100%)` }}
      role="img"
      aria-label={`${region.name}, ${phaseText}`}
    >
      <Layer d={FAR} color={p.far} duration={60} running={walking} opacity={0.9} />
      <Layer d={MID} color={p.mid} duration={32} running={walking} opacity={0.95} />
      <Layer d={NEAR} color={p.near} duration={16} running={walking} opacity={1} />
      <div className="absolute inset-x-0 bottom-0 h-[12%]" style={{ background: p.ground }} aria-hidden />

      {/* Lớp tranh nền thủy mặc phong cảnh vùng đất */}
      {region.backdropUrl && (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity transition-opacity duration-700"
          style={{ backgroundImage: `url(${region.backdropUrl})` }}
          aria-hidden
        />
      )}

      <div className="journey-mist pointer-events-none absolute inset-0" aria-hidden />

      {/* Hiệu ứng kiếm ý / quyền phong khi nhân vật ra đòn */}
      {lastPlayerHit && (
        <div
          key={`hit-fx-${lastPlayerHit.atMs}`}
          className="pointer-events-none absolute bottom-[30%] left-[22%] h-1 w-[46%] rounded-full bg-gradient-to-r from-gold-400 via-paper-100 to-transparent opacity-90 shadow-[0_0_10px_#e0bf4a] animate-pulse"
          style={{ transform: 'rotate(-6deg)' }}
          aria-hidden
        />
      )}

      {/* Hero */}
      <div
        key={lastPlayerHit?.atMs ?? (lastHurt ? `h${lastHurt.atMs}` : 'idle')}
        className={`absolute bottom-[12%] left-[12%] ${figure} aspect-square text-ink-950 ${heroAnim} ${lastHurt ? 'journey-hurt' : ''}`}
        style={{ filter: `drop-shadow(0 0 ${compact ? 2 : 6}px ${p.accent}55)` }}
      >
        <HeroSilhouette className="h-full w-full" />
        <div className="absolute -top-2 left-1/2 h-1 w-[80%] -translate-x-1/2 overflow-hidden rounded-full bg-ink-950/60">
          <div className={`h-full ${hpPct > 40 ? 'bg-jade-400' : 'bg-vermilion-400'}`} style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      {/* Enemies */}
      {j.enemies.map((e, i) => {
        const ePct = e.maxHp > 0 ? Math.max(0, (e.hp / e.maxHp) * 100) : 0
        const hitNow = lastPlayerHit?.target === i
        const dead = e.hp <= 0
        const size = e.boss ? (compact ? 'h-[95%]' : 'h-[78%]') : figure
        return (
          <div
            key={`${j.stage}-${i}-${e.id}`}
            className={`absolute bottom-[12%] ${size} aspect-square -translate-x-1/2 text-ink-950 journey-enter ${dead ? 'journey-dissolve' : hitNow ? 'journey-flash' : ''}`}
            style={{ left: ENEMY_X[i] ?? '80%', filter: e.boss ? `drop-shadow(0 0 ${compact ? 3 : 10}px ${p.accent}aa)` : undefined }}
          >
            <EnemySilhouette id={e.silhouette} className="h-full w-full -scale-x-100" />
            {!dead && (
              <div className="absolute -top-2 left-1/2 h-1 w-[80%] -translate-x-1/2 overflow-hidden rounded-full bg-ink-950/60">
                <div className={`h-full ${e.boss ? 'bg-gold-400' : 'bg-vermilion-400'}`} style={{ width: `${ePct}%` }} />
              </div>
            )}
            {!compact && !dead && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-han text-[10px] whitespace-nowrap text-paper-200/80">
                {e.boss ? '👹 ' : ''}{e.name}
              </span>
            )}
          </div>
        )
      })}

      {/* Damage numbers */}
      {recent.map((e, idx) => {
        if (e.kind !== 'hit' && e.kind !== 'crit' && e.kind !== 'hurt') return null
        const x = e.target === 'player' ? '16%' : ENEMY_X[typeof e.target === 'number' ? e.target : 0]
        const cls = e.kind === 'crit' ? 'text-gold-400 text-base md:text-xl' : e.kind === 'hurt' ? 'text-vermilion-400' : 'text-paper-100'
        return (
          <span
            key={`${e.atMs}-${idx}`}
            className={`journey-float pointer-events-none absolute bottom-[62%] font-han text-sm tabular-nums ${cls} ${compact ? 'text-[10px] md:text-xs' : ''}`}
            style={{ left: x, animationDelay: `-${Math.min(FLOAT_MS, now - e.atMs)}ms` }}
            aria-hidden
          >
            {e.kind === 'hurt' ? '-' : ''}{e.amount}{e.kind === 'crit' ? '!' : ''}
          </span>
        )
      })}

      {lastDeath && !compact && (
        <div className="pointer-events-none absolute inset-0 bg-vermilion-500/20 animate-rise" aria-hidden />
      )}

      {/* Captions */}
      {!compact && (
        <>
          <div className="absolute top-2 left-3 font-han text-xs text-paper-200/90 drop-shadow">
            <span className="text-paper-100">{region.name}</span>
            <span className="text-paper-400"> · {DIFFICULTY_NAMES[j.difficulty]} · Ải {j.stage}/{STAGES_PER_REGION}</span>
          </div>
          <div className="absolute top-2 right-3 text-xs text-paper-200/90 drop-shadow">{phaseText}</div>
        </>
      )}
      {compact && (
        <div className="absolute top-0.5 right-2 font-han text-[10px] leading-none text-paper-200/80">
          {region.name} · {j.stage}/{STAGES_PER_REGION}
        </div>
      )}
      {(j.phase === 'walk' || j.phase === 'retreat') && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-950/40" aria-hidden>
          <div className={`h-full ${j.phase === 'retreat' ? 'bg-vermilion-400/70' : 'bg-paper-100/50'}`} style={{ width: `${getPhaseProgress(state) * 100}%` }} />
        </div>
      )}
    </div>
  )
}
