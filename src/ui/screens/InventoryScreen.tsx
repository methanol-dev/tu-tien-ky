import { CURRENCIES, HERBS, MANUALS, MATERIALS, PILLS } from '@/content/items'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import { getActiveBuffs, getItemCount } from '@/engine'
import { describePillEffect, TIER_CLASS } from '@/lib/describe'
import { formatDurationMs, formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { ItemIcon } from '@/ui/atoms/ItemIcon'
import { GearPanel } from '@/ui/organisms/GearPanel'

export function InventoryScreen() {
  const state = useGameStore((s) => s.state)
  const consume = useGameStore((s) => s.useItem)
  const buy = useGameStore((s) => s.buyItem)

  const buffs = getActiveBuffs(state)
  const ownedPills = PILLS.filter((p) => getItemCount(state, p.id) > 0)
  const ownedCurrencies = CURRENCIES.filter((c) => getItemCount(state, c.id) > 0)
  const ownedManuals = MANUALS.filter((m) => getItemCount(state, m.id) > 0)
  const shopHerbs = HERBS.filter((h) => h.minRealmIndex <= state.realmIndex && h.price !== undefined)

  return (
    <div className="space-y-8">
      {/* Header Túi Càn Khôn */}
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-han text-2xl text-gold-400">Túi Càn Khôn</h2>
          <p className="text-xs text-paper-400 font-serif">
            Quản lý thần binh bảo giáp võ lâm và linh đan diệu dược
          </p>
        </div>
        <p className="text-sm text-paper-400">
          Linh thạch: <span className="text-gold-300 tabular-nums font-mono font-bold text-base">{formatNumber(state.stones)}</span>
        </p>
      </header>

      {/* Dược lực đang phát huy nếu có */}
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

      {/* ================= GIAO DIỆN PAPER DOLL ĐẠO THÂN TRANG BỊ VÕ LÂM & KHO ĐỒ ================= */}
      <GearPanel state={state} />

      {/* ================= TIỀN THẦN TIÊN KIẾM LAI ================= */}
      {ownedCurrencies.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-han text-lg text-gold-400 flex items-center gap-2">
            <span>🪙 Tiền Thần Tiên</span>
            <span className="text-xs text-paper-400 font-serif font-normal">· Bảo vật tiền tệ rơi từ Boss & Tinh Anh</span>
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {ownedCurrencies.map((c) => {
              const count = getItemCount(state, c.id)
              return (
                <li
                  key={c.id}
                  className={`flex items-center justify-between gap-3 rounded-lg border bg-gradient-to-r from-ink-900/90 to-ink-950/90 p-3 shadow-md ${TIER_CLASS[c.tier]}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ItemIcon id={c.id} kind={c.kind} tier={c.tier} size="md" />
                    <div className="min-w-0">
                      <p className="font-han text-sm text-paper-100 truncate">
                        {c.name} <span className="text-gold-400 font-mono font-bold">×{count}</span>
                      </p>
                      <p className="text-[11px] text-paper-400">
                        = {formatNumber(c.currencyValue ?? 0)} Linh thạch / đồng
                      </p>
                    </div>
                  </div>
                  <Button variant="primary" onClick={() => consume(c.id)}>
                    Đổi 1
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* ================= SÁCH THẦN THÔNG & TÀN QUYỂN BÍ TỊCH ================= */}
      <section className="space-y-2">
        <h3 className="font-han text-lg text-gold-400 flex items-center gap-2">
          <span>📜 Sách Thần Thông & Tàn Quyển Bí Tịch</span>
          <span className="text-xs text-paper-400 font-serif font-normal">· Lĩnh ngộ khai mở tuyệt học</span>
        </h3>
        {ownedManuals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-paper-400/20 bg-ink-900/40 p-4 text-center">
            <p className="text-xs text-paper-400 font-serif">
              Chưa thu thập được cuốn bí tịch nào. Khi thảo phạt Quái Tinh Anh và Trấn Sát Boss các cõi giới sẽ có cơ duyên rớt bí điển thất truyền!
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {ownedManuals.map((m) => {
              const count = getItemCount(state, m.id)
              const tech = m.techniqueId ? TECHNIQUE_BY_ID[m.techniqueId] : null
              const currentLvl = m.techniqueId ? state.techniques[m.techniqueId] ?? 0 : 0
              const isMax = tech ? currentLvl >= tech.maxLevel : false

              return (
                <li
                  key={m.id}
                  className={`flex flex-col justify-between gap-3 rounded-lg border bg-ink-900/80 p-3.5 shadow-ink ${TIER_CLASS[m.tier]}`}
                >
                  <div className="flex items-start gap-3">
                    <ItemIcon id={m.id} kind={m.kind} tier={m.tier} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-han font-bold text-sm text-gold-300 truncate">{m.name}</p>
                        <span className="text-xs text-paper-300 font-mono font-bold">×{count}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-paper-400 line-clamp-2">{m.description}</p>
                      {tech && (
                        <div className="mt-2 flex items-center justify-between border-t border-paper-400/10 pt-1.5 text-[11px]">
                          <span className="text-paper-300">
                            Công pháp: <strong className="text-jade-400">{tech.name}</strong>
                          </span>
                          <span className="font-mono text-paper-400">
                            {isMax ? 'Viên mãn' : `Tầng ${currentLvl}/${tech.maxLevel}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    disabled={isMax}
                    onClick={() => consume(m.id)}
                    className="w-full"
                  >
                    {isMax ? 'Đã viên mãn' : currentLvl === 0 ? 'Lĩnh Ngộ Tuyệt Học' : 'Tu Luyện Tiến Tầng (+1)'}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ================= ĐAN DƯỢC ================= */}
      <section className="space-y-2">
        <h3 className="font-han text-lg text-paper-100">Đan dược</h3>
        {ownedPills.length === 0 ? (
          <p className="text-sm text-paper-400">Chưa có viên đan nào. Qua Luyện đan mà luyện.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {ownedPills.map((p) => (
              <li key={p.id} className={`flex items-center justify-between gap-3 rounded-lg border bg-ink-800/60 p-3 ${TIER_CLASS[p.tier]}`}>
                <div className="flex items-center gap-3">
                  <ItemIcon id={p.id} kind={p.kind} tier={p.tier} size="md" />
                  <div>
                    <p className="font-han">
                      {p.name} <span className="text-paper-400 tabular-nums">×{getItemCount(state, p.id)}</span>
                    </p>
                    {p.effect && <p className="text-xs text-paper-400">{describePillEffect(p.effect)}</p>}
                  </div>
                </div>
                <Button onClick={() => consume(p.id)}>Dùng</Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ================= DƯỢC LIỆU & YÊU ĐAN LINH VẬT ================= */}
      <section className="space-y-2">
        <h3 className="font-han text-lg text-paper-100 flex items-center justify-between">
          <span>Dược liệu & Nguyên liệu Yêu Đan</span>
          <span className="text-xs text-paper-400 font-serif">Dùng cho Luyện đan & Luyện khí</span>
        </h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...HERBS, ...MATERIALS].map((item) => {
            const n = getItemCount(state, item.id)
            return (
              <li
                key={item.id}
                className={`flex items-center gap-2.5 rounded-md border p-2.5 ${TIER_CLASS[item.tier]} ${n === 0 ? 'opacity-40' : ''}`}
                title={item.description}
              >
                <ItemIcon id={item.id} kind={item.kind} tier={item.tier} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-han text-xs truncate font-medium text-paper-200">{item.name}</p>
                  <p className="text-[11px] text-paper-400 tabular-nums font-mono">×{n}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ================= PHƯỜNG THỊ ================= */}
      <section className="space-y-2">
        <h3 className="font-han text-lg text-paper-100">Phường thị</h3>
        <p className="text-xs text-paper-400">Mua dược liệu bằng linh thạch. Hàng hiếm hơn mở theo cảnh giới.</p>
        <ul className="space-y-2">
          {shopHerbs.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-paper-400/10 bg-ink-800/40 px-3 py-2">
              <div className="flex items-center gap-2.5">
                <ItemIcon id={h.id} kind={h.kind} tier={h.tier} size="sm" />
                <span className={`font-han ${TIER_CLASS[h.tier].split(' ')[0]}`}>
                  {h.name} <span className="text-xs text-paper-400 tabular-nums">· {formatNumber(h.price!)} / cây</span>
                </span>
              </div>
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
