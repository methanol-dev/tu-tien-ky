import { REALMS } from '@/content/realms'
import { TECHNIQUES } from '@/content/techniques'
import {
  canUpgradeTechnique,
  getCurrentTechniqueMilestone,
  getNextTechniqueMilestone,
  getTechniqueCost,
  getTechniqueLevel,
  getTechniqueMilestoneMultiplier,
  isTechniqueUnlocked,
} from '@/engine'
import { describeTechniqueEffect } from '@/lib/describe'
import { formatAncientNumber, formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'

export function TechniquesScreen() {
  const state = useGameStore((s) => s.state)
  const upgrade = useGameStore((s) => s.upgradeTechnique)

  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between border-b border-paper-400/10 pb-3">
        <div>
          <h2 className="font-han text-2xl text-gold-400">Công Pháp & Bí Kíp</h2>
          <p className="text-xs text-paper-400">Đột phá mốc tầng 5, 10, 25... để bùng nổ cấp số nhân uy lực</p>
        </div>
        <p className="text-sm text-paper-400">
          Linh thạch: <span className="text-gold-300 font-semibold tabular-nums">{formatAncientNumber(state.stones)}</span>
        </p>
      </header>

      <ul className="grid gap-3 md:grid-cols-2">
        {TECHNIQUES.map((def) => {
          const level = getTechniqueLevel(state, def.id)
          const unlocked = isTechniqueUnlocked(state, def)
          const maxed = level >= def.maxLevel
          const cost = getTechniqueCost(def, level)
          const can = canUpgradeTechnique(state, def.id)
          const curMilestone = getCurrentTechniqueMilestone(level)
          const nextMilestone = getNextTechniqueMilestone(level)
          const totalMult = getTechniqueMilestoneMultiplier(level)

          let progressPct = 100
          let progressLabel: string
          if (nextMilestone && nextMilestone.level <= def.maxLevel) {
            const prevLevel = curMilestone ? curMilestone.level : 0
            const totalSteps = nextMilestone.level - prevLevel
            const currentStep = level - prevLevel
            progressPct = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)))
            progressLabel = `Mốc kế: Tầng ${nextMilestone.level} (${nextMilestone.label} x${nextMilestone.mult})`
          } else {
            progressLabel = 'Viên mãn cực hạn'
          }

          const hasMilestone = totalMult > 1

          return (
            <li
              key={def.id}
              className={`flex flex-col gap-2.5 rounded-lg border p-4 transition-all ${
                !unlocked
                  ? 'border-paper-400/5 bg-ink-900/40 opacity-70'
                  : hasMilestone
                    ? 'border-gold-500/30 bg-ink-800/80 shadow-[0_0_12px_rgba(234,179,8,0.08)]'
                    : 'border-paper-400/15 bg-ink-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-han text-lg text-paper-100">{def.name}</h3>
                    {curMilestone && (
                      <span className="rounded border border-gold-500/40 bg-gold-950/50 px-1.5 py-0.5 text-[10px] font-medium text-gold-400">
                        {curMilestone.label} (x{totalMult})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-paper-400 leading-relaxed">{def.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-han text-sm text-gold-400 tabular-nums">
                    {level}/{def.maxLevel}
                  </span>
                </div>
              </div>

              {/* Hiệu quả công pháp */}
              <p className="text-sm text-jade-400 font-medium">{describeTechniqueEffect(def, level)}</p>

              {/* Thanh tiến độ mốc Milestone */}
              {unlocked && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-paper-400">
                    <span>{progressLabel}</span>
                    <span className="tabular-nums font-mono">{level}/{nextMilestone?.level ?? def.maxLevel}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-950 border border-paper-400/10">
                    <div
                      className={`h-full transition-all duration-300 ${
                        hasMilestone ? 'bg-gradient-to-r from-jade-500 to-gold-400' : 'bg-jade-500/80'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Nút nâng cấp và Chi phí */}
              <div className="mt-auto flex items-center justify-between gap-3 pt-1 border-t border-paper-400/10">
                {!unlocked ? (
                  <span className="text-xs text-vermilion-400">Cần đạt {REALMS[def.minRealmIndex].name}</span>
                ) : maxed ? (
                  <span className="text-xs text-gold-400 font-medium">✨ Công pháp viên mãn</span>
                ) : (
                  <span className="text-sm text-paper-300 tabular-nums">
                    {formatNumber(cost)} <span className="text-xs text-paper-400">linh thạch</span>
                  </span>
                )}
                {unlocked && !maxed && (
                  <Button variant={can ? 'primary' : 'secondary'} disabled={!can} onClick={() => upgrade(def.id)}>
                    {level === 0 ? 'Lĩnh ngộ' : 'Nâng cấp'}
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
