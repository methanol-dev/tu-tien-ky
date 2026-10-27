import { ITEM_BY_ID } from '@/content/items'
import { REALMS } from '@/content/realms'
import { RECIPE_BY_ID, RECIPES } from '@/content/recipes'
import { canStartAlchemy, getAlchemyProgress, getItemCount, isAlchemyReady, isRecipeUnlocked } from '@/engine'
import { describePillEffect } from '@/lib/describe'
import { formatDurationMs, formatNumber, formatPercent } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'

export function AlchemyScreen() {
  const state = useGameStore((s) => s.state)
  const start = useGameStore((s) => s.startAlchemy)
  const collect = useGameStore((s) => s.collectAlchemy)

  const job = state.alchemy
  const jobRecipe = job ? RECIPE_BY_ID[job.recipeId] : null
  const ready = isAlchemyReady(state)
  const progress = getAlchemyProgress(state)

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gold-500/20 bg-ink-800/70 p-5">
        <h2 className="font-han text-2xl text-gold-400">Đan lô</h2>
        {job && jobRecipe ? (
          <div className="mt-3 space-y-3">
            <p className="text-paper-100">{jobRecipe.name}</p>
            <div
              className="h-3 overflow-hidden rounded-full bg-ink-950"
              role="progressbar"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${ready ? 'bg-gold-400' : 'bg-gradient-to-r from-vermilion-500 to-gold-500'}`}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-paper-400 tabular-nums">
                {ready ? 'Đan khí đã ngưng tụ' : `Còn ${formatDurationMs(job.finishAtMs - state.playedMs)}`}
              </span>
              <Button variant="primary" disabled={!ready} onClick={collect} className={ready ? 'animate-pulse' : ''}>
                Thu đan
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-paper-400">Đan lô đang nguội. Chọn một đan phương bên dưới.</p>
        )}
      </section>

      <ul className="grid gap-3 md:grid-cols-2">
        {RECIPES.map((r) => {
          const unlocked = isRecipeUnlocked(state, r)
          const output = ITEM_BY_ID[r.output]
          const can = canStartAlchemy(state, r.id)
          return (
            <li
              key={r.id}
              className={`flex flex-col gap-2 rounded-lg border p-4 ${
                unlocked ? 'border-paper-400/15 bg-ink-800/60' : 'border-paper-400/5 bg-ink-900/40 opacity-70'
              }`}
            >
              <div>
                <h3 className="font-han text-lg text-paper-100">{output.name}</h3>
                {output.effect && <p className="text-xs text-jade-400">{describePillEffect(output.effect)}</p>}
              </div>
              <ul className="space-y-0.5 text-sm">
                {Object.entries(r.ingredients).map(([id, need]) => {
                  const have = getItemCount(state, id)
                  return (
                    <li key={id} className={have >= need ? 'text-paper-300' : 'text-vermilion-400'}>
                      {ITEM_BY_ID[id].name}{' '}
                      <span className="tabular-nums">
                        {have}/{need}
                      </span>
                    </li>
                  )
                })}
                <li className={state.stones >= r.stones ? 'text-paper-300' : 'text-vermilion-400'}>
                  Linh thạch <span className="tabular-nums">{formatNumber(r.stones)}</span>
                </li>
              </ul>
              <p className="text-xs text-paper-400">
                {formatDurationMs(r.durationMs)} · thành công {formatPercent(r.successChance)}
              </p>
              <div className="mt-auto flex items-center justify-between pt-1">
                {!unlocked ? <span className="text-xs text-vermilion-400">Cần {REALMS[r.minRealmIndex].name}</span> : <span />}
                {unlocked && (
                  <Button variant={can ? 'primary' : 'secondary'} disabled={!can} onClick={() => start(r.id)}>
                    Luyện
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
