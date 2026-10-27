import { TREASURES } from '@/content/items'
import type { GameState } from '@/engine'
import { TIER_CLASS } from '@/lib/describe'

function describePassive(p: NonNullable<(typeof TREASURES)[number]['passive']>): string {
  const parts: string[] = []
  if (p.hp) parts.push(`HP +${Math.round(p.hp * 100)}%`)
  if (p.atk) parts.push(`Công +${Math.round(p.atk * 100)}%`)
  if (p.def) parts.push(`Thủ +${Math.round(p.def * 100)}%`)
  if (p.qiRate) parts.push(`Tu luyện +${Math.round(p.qiRate * 100)}%`)
  return parts.join(' · ')
}

export function TreasureList({ state }: { state: GameState }) {
  const owned = TREASURES.filter((t) => (state.inventory[t.id] ?? 0) > 0)
  return (
    <section className="space-y-2">
      <h3 className="font-han text-lg text-paper-100">Pháp bảo</h3>
      {owned.length === 0 ? (
        <p className="text-sm text-paper-400">Chưa có pháp bảo. Boss trong bí cảnh có tỉ lệ rơi.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {owned.map((t) => (
            <li key={t.id} className={`rounded-lg border bg-ink-800/60 p-3 ${TIER_CLASS[t.tier]}`}>
              <p className="font-han">{t.name}</p>
              <p className="text-xs text-paper-400">{t.description}</p>
              {t.passive && <p className="text-xs text-jade-400">{describePassive(t.passive)}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
