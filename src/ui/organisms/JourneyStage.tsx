import { useState, type CSSProperties } from 'react'
import { AVATARS, AVATAR_BY_ID } from '@/content/avatars'
import { REALMS } from '@/content/realms'
import { DIFFICULTY_NAMES, STAGES_PER_REGION } from '@/content/regions'
import { type GameState, getPhaseProgress, getRegion, isRegionUnlocked } from '@/engine'
import { formatDurationMs, formatNumber } from '@/lib/format'
import { EnemySilhouette, HeroSilhouette } from '@/ui/silhouettes'

interface Props {
  state: GameState
  /** 56–72px strip layout: figures only, no captions. */
  compact?: boolean
}

/** How long (played ms) a damage number stays on screen. */
const FLOAT_MS = 900
const FLASH_MS = 260

const ENEMY_X = ['66%', '80%', '90%']
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
  const avatar = AVATAR_BY_ID[state.settings.avatarId ?? 'tran-binh-an'] ?? AVATARS[0]
  const [spriteError, setSpriteError] = useState(false)

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

  const h = compact ? 'h-full' : 'h-60 sm:h-72 md:h-80'
  const figure = compact ? 'h-[78%]' : 'h-[52%] sm:h-[58%]'
  const mainEnemy = j.enemies.find((e) => e.boss) ?? j.enemies[0]
  const mainEnemyPct = mainEnemy && mainEnemy.maxHp > 0 ? Math.max(0, (mainEnemy.hp / mainEnemy.maxHp) * 100) : 0

  return (
    <div
      className={`relative ${h} w-full overflow-hidden ${
        compact ? '' : 'rounded-lg border border-gold-500/20 shadow-ink'
      }`}
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
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transition-opacity duration-700"
          style={{ backgroundImage: `url(${region.backdropUrl})` }}
          aria-hidden
        />
      )}

      {/* Làn sương khói bay lượn */}
      <div className="journey-mist pointer-events-none absolute inset-0" aria-hidden />

      {/* ================= HUD ĐỐI ĐẦU (DUEL HEADER) ================= */}
      {!compact && (
        <div className="absolute top-2 inset-x-3 z-20 flex items-start justify-between gap-2 pointer-events-none">
          {/* Góc Trái: Đạo Thân Người Chơi */}
          <div className="flex items-center gap-2 rounded-lg border border-gold-500/30 bg-ink-950/80 p-1.5 pr-3 backdrop-blur-sm shadow-md">
            <img
              src={avatar.image}
              alt={avatar.name}
              className="h-9 w-9 rounded-full border border-gold-400 object-cover object-top shadow-sm"
            />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-han text-xs font-bold text-paper-100">{avatar.name}</span>
                <span className="text-[10px] text-jade-400 font-mono">
                  {formatNumber(player.hp)}/{formatNumber(player.maxHp)}
                </span>
              </div>
              <div className="mt-0.5 h-1.5 w-24 sm:w-32 overflow-hidden rounded-full bg-ink-900 border border-paper-400/20">
                <div
                  className={`h-full transition-all duration-300 ${
                    hpPct > 40 ? 'bg-gradient-to-r from-jade-600 to-jade-400' : 'bg-vermilion-500'
                  }`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Giữa: Thẻ Bài Ải & Trạng Thái */}
          <div className="flex flex-col items-center">
            <div className="rounded-full border border-gold-500/40 bg-ink-950/85 px-3 py-0.5 font-han text-xs font-bold text-gold-300 shadow-md backdrop-blur-sm">
              <span>{region.name}</span>
              <span className="text-paper-400"> · </span>
              <span className="text-paper-300 font-serif">{DIFFICULTY_NAMES[j.difficulty]}</span>
              <span className="text-paper-400"> · </span>
              <span className="text-gold-400">Ải {j.stage}/{STAGES_PER_REGION}</span>
            </div>
            <span className="mt-0.5 text-[10px] text-paper-300/80 font-serif drop-shadow">
              {phaseText}
            </span>
          </div>

          {/* Góc Phải: Boss hoặc Quái Chủ Lực (nếu có chiến đấu) */}
          {mainEnemy ? (
            <div className="flex items-center gap-2 rounded-lg border border-vermilion-500/40 bg-ink-950/80 p-1.5 pl-3 backdrop-blur-sm shadow-md">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-vermilion-400 font-mono">
                    {formatNumber(mainEnemy.hp)}/{formatNumber(mainEnemy.maxHp)}
                  </span>
                  <span className="font-han text-xs font-bold text-vermilion-300">
                    {mainEnemy.boss ? '👹 ' : ''}{mainEnemy.name}
                  </span>
                </div>
                <div className="mt-0.5 h-1.5 w-24 sm:w-32 overflow-hidden rounded-full bg-ink-900 border border-paper-400/20">
                  <div
                    className={`h-full transition-all duration-300 ${
                      mainEnemy.boss
                        ? 'bg-gradient-to-l from-gold-400 to-vermilion-500'
                        : 'bg-gradient-to-l from-vermilion-400 to-red-600'
                    }`}
                    style={{ width: `${mainEnemyPct}%` }}
                  />
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-vermilion-500/50 bg-ink-900 text-sm">
                {mainEnemy.boss ? '👑' : '⚔️'}
              </div>
            </div>
          ) : (
            <div className="w-24 sm:w-32" />
          )}
        </div>
      )}

      {/* ================= COMBAT VFX (KIẾM QUANG & QUYỀN Ý) ================= */}
      {lastPlayerHit && (
        <div
          key={`hit-fx-${lastPlayerHit.atMs}`}
          className="pointer-events-none absolute bottom-[18%] left-[22%] h-[40%] w-[52%] overflow-visible animate-pulse z-15"
          aria-hidden
        >
          <svg viewBox="0 0 200 100" className="h-full w-full drop-shadow-[0_0_14px_#fde047]">
            {/* Vệt chém Kiếm Khí bán nguyệt lấp lánh */}
            <path
              d="M12 78 Q95 12 188 38 Q108 28 12 78 Z"
              fill="url(#journey-sword-grad)"
              opacity="0.95"
            />
            {lastPlayerHit.kind === 'crit' && (
              <path
                d="M35 88 L125 18 L175 48"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.95"
              />
            )}
            <defs>
              <linearGradient id="journey-sword-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* ================= HERO (ĐẠO THÂN) ================= */}
      <div
        key={lastPlayerHit?.atMs ?? (lastHurt ? `h${lastHurt.atMs}` : 'idle')}
        className={`absolute bottom-[11%] left-[10%] sm:left-[12%] ${
          compact ? 'h-[82%]' : 'h-[58%] sm:h-[64%]'
        } aspect-[677/1091] flex items-end justify-center select-none ${heroAnim} ${
          lastHurt ? 'journey-hurt' : ''
        }`}
        style={{
          filter: `drop-shadow(0 6px 14px rgba(0,0,0,0.65)) drop-shadow(0 0 ${compact ? 2 : 6}px ${p.accent}88)`,
        }}
      >
        {!spriteError ? (
          <img
            src="/assets/characters/hero-sprite.png"
            alt={avatar.name}
            className="h-full w-auto max-w-none object-contain pointer-events-none drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]"
            onError={() => setSpriteError(true)}
          />
        ) : (
          <HeroSilhouette className="h-full w-full aspect-square text-ink-950" />
        )}
        {/* Bóng đổ & vệt hào quang dưới chân người chơi */}
        <div className="pointer-events-none absolute -bottom-1 left-1/2 h-2.5 w-4/5 -translate-x-1/2 rounded-full bg-ink-950/70 blur-[3px]" />
        <div
          className="pointer-events-none absolute -bottom-1 left-1/2 h-1.5 w-1/2 -translate-x-1/2 rounded-full opacity-60 blur-[2px]"
          style={{ backgroundColor: p.accent }}
        />
        {compact && (
          <div className="absolute -top-2 left-1/2 h-1 w-16 -translate-x-1/2 overflow-hidden rounded-full bg-ink-950/60">
            <div className={`h-full ${hpPct > 40 ? 'bg-jade-400' : 'bg-vermilion-400'}`} style={{ width: `${hpPct}%` }} />
          </div>
        )}
      </div>

      {/* ================= ENEMIES (QUÁI VẬT & BOSS) ================= */}
      {j.enemies.map((e, i) => {
        const hitNow = lastPlayerHit?.target === i
        const dead = e.hp <= 0
        const size = e.boss ? (compact ? 'h-[95%]' : 'h-[78%]') : figure
        return (
          <div
            key={`${j.stage}-${i}-${e.id}`}
            className={`absolute bottom-[12%] ${size} aspect-square -translate-x-1/2 text-ink-950 journey-enter ${
              dead ? 'journey-dissolve' : hitNow ? 'journey-flash' : ''
            }`}
            style={{
              left: ENEMY_X[i] ?? '80%',
              filter: e.boss
                ? `drop-shadow(0 0 ${compact ? 4 : 14}px #ef4444)`
                : `drop-shadow(0 0 ${compact ? 2 : 6}px ${p.accent}66)`,
            }}
          >
            <EnemySilhouette id={e.silhouette} className="h-full w-full -scale-x-100" />

            {/* Vòng hào quang hắc ám dưới chân Boss */}
            {e.boss && !dead && (
              <div className="pointer-events-none absolute -bottom-1 left-1/2 h-2.5 w-full -translate-x-1/2 rounded-full bg-vermilion-600/50 blur-sm animate-pulse" />
            )}

            {compact && !dead && (
              <div className="absolute -top-2 left-1/2 h-1 w-[80%] -translate-x-1/2 overflow-hidden rounded-full bg-ink-950/60">
                <div
                  className={`h-full ${e.boss ? 'bg-gold-400' : 'bg-vermilion-400'}`}
                  style={{ width: `${e.maxHp > 0 ? (e.hp / e.maxHp) * 100 : 0}%` }}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* ================= SỐ SÁT THƯƠNG BAY LÊN (DAMAGE FLOATS) ================= */}
      {recent.map((e, idx) => {
        if (e.kind !== 'hit' && e.kind !== 'crit' && e.kind !== 'hurt') return null
        const x = e.target === 'player' ? '16%' : ENEMY_X[typeof e.target === 'number' ? e.target : 0]
        const cls =
          e.kind === 'crit'
            ? 'text-gold-400 text-lg md:text-2xl font-black drop-shadow-[0_0_8px_#e0bf4a]'
            : e.kind === 'hurt'
              ? 'text-vermilion-400 text-base md:text-lg font-bold'
              : 'text-paper-100 text-sm md:text-base'

        return (
          <span
            key={`${e.atMs}-${idx}`}
            className={`journey-float pointer-events-none absolute bottom-[62%] font-han tabular-nums ${cls} ${
              compact ? 'text-[10px] md:text-xs' : ''
            }`}
            style={{ left: x, animationDelay: `-${Math.min(FLOAT_MS, now - e.atMs)}ms` }}
            aria-hidden
          >
            {e.kind === 'hurt' ? '-' : ''}
            {e.amount}
            {e.kind === 'crit' ? ' 💥' : ''}
          </span>
        )
      })}

      {/* Hiệu ứng chớp đỏ khi gục ngã */}
      {lastDeath && !compact && (
        <div className="pointer-events-none absolute inset-0 bg-vermilion-500/25 animate-rise" aria-hidden />
      )}

      {/* Thanh tiến độ bước đi khi đang cuốc bộ hoặc lui về dưỡng thương */}
      {(j.phase === 'walk' || j.phase === 'retreat') && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-ink-950/60 z-30" aria-hidden>
          <div
            className={`h-full transition-all duration-200 ${
              j.phase === 'retreat'
                ? 'bg-gradient-to-r from-vermilion-600 to-vermilion-400'
                : 'bg-gradient-to-r from-gold-500 to-paper-100'
            }`}
            style={{ width: `${getPhaseProgress(state) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}
