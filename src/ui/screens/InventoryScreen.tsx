import { HERBS, PILLS } from '@/content/items'
import { getActiveBuffs, getItemCount } from '@/engine'
import { describePillEffect, TIER_CLASS } from '@/lib/describe'
import { formatDurationMs, formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { GearPanel } from '@/ui/organisms/GearPanel'

export function InventoryScreen() {
  const state = useGameStore((s) => s.state)
  const consume = useGameStore((s) => s.useItem)
  const buy = useGameStore((s) => s.buyItem)

  const buffs = getActiveBuffs(state)
  const ownedPills = PILLS.filter((p) => getItemCount(state, p.id) > 0)
  const shopHerbs = HERBS.filter((h) => h.minRealmIndex <= state.realmIndex && h.price !== undefined)

  return (
    <div className="space-y-8">
      <header className="flex items-baseline justify-between">
        <h2 className="font-han text-2xl text-gold-400">Túi càn khôn</h2>
        <p className="text-sm text-paper-400">
          Linh thạch: <span className="text-paper-100 tabular-nums">{formatNumber(state.stones)}</span>
        </p>
      </header>

      {(buffs.length > 0 || state.pendingBreakthroughBonus > 0) && (
        <section className="space-y-2">
          <h3 className="font-han text-lg text-paper-100">Dược lực đang phát huy</h3>
          <ul className="flex flex-wrap gap-2 text-sm">
            {buffs.map((b) => (
              <li key={b.id} className="rounded-full border border-jade-500/40 px-3 py-1 text-jade-400 tabular-nums">
                {b.name} x{b.qiRateMult} · {formatDurationMs(b.expiresAtMs - state.playedMs)}
              </li>
            ))}
            {state.pendingBreakthroughBonus > 0 && (
              <li className="rounded-full border border-gold-500/40 px-3 py-1 text-gold-400">
                Đột phá kế tiếp +{Math.round(state.pendingBreakthroughBonus * 100)}%
              </li>
            )}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <h3 className="font-han text-lg text-paper-100">Đan dược</h3>
        {ownedPills.length === 0 ? (
          <p className="text-sm text-paper-400">Chưa có viên đan nào. Qua Luyện đan mà luyện.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {ownedPills.map((p) => (
              <li key={p.id} className={`flex items-center justify-between gap-3 rounded-lg border bg-ink-800/60 p-3 ${TIER_CLASS[p.tier]}`}>
                <div>
                  <p className="font-han">
                    {p.name} <span className="text-paper-400 tabular-nums">×{getItemCount(state, p.id)}</span>
                  </p>
                  {p.effect && <p className="text-xs text-paper-400">{describePillEffect(p.effect)}</p>}
                </div>
                <Button onClick={() => consume(p.id)}>Dùng</Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <GearPanel state={state} />

      <section className="space-y-2">
        <h3 className="font-han text-lg text-paper-100">Dược liệu</h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {HERBS.map((h) => {
            const n = getItemCount(state, h.id)
            return (
              <li key={h.id} className={`rounded-md border px-3 py-2 ${TIER_CLASS[h.tier]} ${n === 0 ? 'opacity-50' : ''}`} title={h.description}>
                <p className="font-han text-sm">{h.name}</p>
                <p className="text-xs text-paper-400 tabular-nums">×{n}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-han text-lg text-paper-100">Phường thị</h3>
        <p className="text-xs text-paper-400">Mua dược liệu bằng linh thạch. Hàng hiếm hơn mở theo cảnh giới.</p>
        <ul className="space-y-2">
          {shopHerbs.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-paper-400/10 bg-ink-800/40 px-3 py-2">
              <span className={`font-han ${TIER_CLASS[h.tier].split(' ')[0]}`}>
                {h.name} <span className="text-xs text-paper-400 tabular-nums">· {formatNumber(h.price!)} / viên</span>
              </span>
              <div className="flex gap-2">
                <Button disabled={state.stones < h.price!} onClick={() => buy(h.id, 1)}>×1</Button>
                <Button disabled={state.stones < h.price! * 10} onClick={() => buy(h.id, 10)}>×10</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
