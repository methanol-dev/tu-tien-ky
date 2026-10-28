import { ITEM_BY_ID } from '@/content/items'
import { REALMS } from '@/content/realms'
import { RECIPE_BY_ID, RECIPES } from '@/content/recipes'
import { canStartAlchemy, getAlchemyProgress, getItemCount, isAlchemyReady, isRecipeUnlocked } from '@/engine'
import { describePillEffect } from '@/lib/describe'
import { formatDurationMs, formatNumber, formatPercent } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { ItemIcon } from '@/ui/atoms/ItemIcon'
import { AlchemyCauldron } from '@/ui/organisms/AlchemyCauldron'

export function AlchemyScreen() {
  const state = useGameStore((s) => s.state)
  const start = useGameStore((s) => s.startAlchemy)
  const collect = useGameStore((s) => s.collectAlchemy)

  const job = state.alchemy
  const jobRecipe = job ? RECIPE_BY_ID[job.recipeId] : null
  const ready = isAlchemyReady(state)
  const progress = getAlchemyProgress(state)
  const remainingMs = job ? Math.max(0, job.finishAtMs - state.playedMs) : 0

  return (
    <div className="space-y-6">
      {/* Sân Khấu Luyện Đan Lô Thủy Mặc */}
      <AlchemyCauldron
        recipe={jobRecipe}
        progress={progress}
        ready={ready}
        remainingMs={remainingMs}
        onCollect={collect}
      />

      <div className="flex items-center justify-between pt-1">
        <h3 className="font-han text-lg text-paper-200">Bách Thảo Đan Phương</h3>
        <span className="text-xs text-paper-400">Chọn đan phương để khai lò</span>
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {RECIPES.map((r) => {
          const unlocked = isRecipeUnlocked(state, r)
          const output = ITEM_BY_ID[r.output]
          const can = canStartAlchemy(state, r.id)
          return (
            <li
              key={r.id}
              className={`flex flex-col justify-between gap-3 rounded-lg border p-4 ${
                unlocked ? 'border-paper-400/15 bg-ink-800/60' : 'border-paper-400/5 bg-ink-900/40 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                <ItemIcon id={output.id} kind={output.kind} tier={output.tier} size="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-han text-lg text-paper-100">{output.name}</h3>
                  {output.effect && <p className="text-xs text-jade-400">{describePillEffect(output.effect)}</p>}
                </div>
              </div>

              {/* Nguyên liệu cần thiết */}
              <ul className="space-y-1.5 text-xs rounded bg-ink-950/40 p-2.5">
                {Object.entries(r.ingredients).map(([id, need]) => {
                  const have = getItemCount(state, id)
                  const ing = ITEM_BY_ID[id]
                  return (
                    <li key={id} className={`flex items-center justify-between ${have >= need ? 'text-paper-300' : 'text-vermilion-400'}`}>
                      <div className="flex items-center gap-2">
                        <ItemIcon id={id} kind={ing.kind} tier={ing.tier} size="sm" />
                        <span>{ing.name}</span>
                      </div>
                      <span className="tabular-nums font-mono">
                        {have}/{need}
                      </span>
                    </li>
                  )
                })}
                <li className={`flex items-center justify-between pt-1 border-t border-paper-400/10 ${state.stones >= r.stones ? 'text-paper-300' : 'text-vermilion-400'}`}>
                  <span>Linh thạch tiêu hao</span>
                  <span className="tabular-nums font-mono">{formatNumber(r.stones)}</span>
                </li>
              </ul>

              <div className="mt-auto flex items-center justify-between pt-1 text-xs">
                <span className="text-paper-400">
                  {formatDurationMs(r.durationMs)} · thành công {formatPercent(r.successChance)}
                </span>
                {!unlocked ? (
                  <span className="text-xs text-vermilion-400">Cần {REALMS[r.minRealmIndex].name}</span>
                ) : (
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
