import { REALMS } from '@/content/realms'
import { TECHNIQUES } from '@/content/techniques'
import { canUpgradeTechnique, getTechniqueCost, getTechniqueLevel, isTechniqueUnlocked } from '@/engine'
import { describeTechniqueEffect } from '@/lib/describe'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'

export function TechniquesScreen() {
  const state = useGameStore((s) => s.state)
  const upgrade = useGameStore((s) => s.upgradeTechnique)

  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between">
        <h2 className="font-han text-2xl text-gold-400">Công pháp</h2>
        <p className="text-sm text-paper-400">
          Linh thạch: <span className="text-paper-100 tabular-nums">{formatNumber(state.stones)}</span>
        </p>
      </header>

      <ul className="grid gap-3 md:grid-cols-2">
        {TECHNIQUES.map((def) => {
          const level = getTechniqueLevel(state, def.id)
          const unlocked = isTechniqueUnlocked(state, def)
          const maxed = level >= def.maxLevel
          const cost = getTechniqueCost(def, level)
          const can = canUpgradeTechnique(state, def.id)
          return (
            <li
              key={def.id}
              className={`flex flex-col gap-2 rounded-lg border p-4 ${
                unlocked ? 'border-paper-400/15 bg-ink-800/60' : 'border-paper-400/5 bg-ink-900/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-han text-lg text-paper-100">{def.name}</h3>
                  <p className="text-xs text-paper-400">{def.description}</p>
                </div>
                <span className="shrink-0 font-han text-sm text-gold-400 tabular-nums">
                  {level}/{def.maxLevel}
                </span>
              </div>
              <p className="text-sm text-jade-400">{describeTechniqueEffect(def, level)}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                {!unlocked ? (
                  <span className="text-xs text-vermilion-400">Cần {REALMS[def.minRealmIndex].name}</span>
                ) : maxed ? (
                  <span className="text-xs text-gold-400">Viên mãn</span>
                ) : (
                  <span className="text-sm text-paper-300 tabular-nums">{formatNumber(cost)} linh thạch</span>
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
