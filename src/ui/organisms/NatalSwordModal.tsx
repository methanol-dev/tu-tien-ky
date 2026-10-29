import { useState } from 'react'
import {
  NATAL_SWORD_BY_ID,
  NATAL_SWORDS,
  SWORD_TALENT_BY_ID,
} from '@/content/natalSwords'
import {
  calculateSwordDaoPower,
  getForgeSwordCost,
  getItemCount,
  getSwordRank,
} from '@/engine'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { IconFlyingSword, SWORD_ICONS } from '@/ui/atoms/icons'

export function NatalSwordModal() {
  const state = useGameStore((s) => s.state)
  const open = useGameStore((s) => s.natalSwordModalOpen)
  const setOpen = useGameStore((s) => s.setNatalSwordModalOpen)
  const forge = useGameStore((s) => s.forgeNatalSword)
  const temper = useGameStore((s) => s.temperNatalSword)
  const upgradeTalent = useGameStore((s) => s.upgradeSwordTalent)

  const [activeTab, setActiveTab] = useState<'swords' | 'forge'>('swords')

  if (!open) return null

  const swords = state.natalSwords ?? []
  const rank = getSwordRank(swords)
  const power = calculateSwordDaoPower(swords)
  const forgeCost = getForgeSwordCost(swords.length)

  // Danh sách các kiếm chưa uẩn dưỡng
  const ownedDefIds = new Set(swords.map((s) => s.swordDefId))
  const unownedSwords = NATAL_SWORDS.filter((def) => !ownedDefIds.has(def.id))

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Khí Phủ Kiếm Thai"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-3 sm:p-4 backdrop-blur-md animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gold-500/40 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-900 shadow-2xl shadow-gold-500/10 text-paper-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER: KIẾM TU BẢNG & DANH XƯNG ================= */}
        <header className="border-b border-gold-500/30 bg-gradient-to-r from-ink-950 via-gold-500/10 to-ink-950 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border bg-ink-950 p-2.5 shadow-inner"
                style={{ color: rank.color, borderColor: rank.color }}
              >
                <IconFlyingSword className="h-full w-full" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-han text-xl font-bold text-gold-300">Khí Phủ Kiếm Thai</h2>
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-xs font-bold font-serif shadow-sm"
                    style={{ borderColor: rank.color, color: rank.color, backgroundColor: `${rank.color}18` }}
                  >
                    {rank.title}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-paper-400">
                  Kiếm Đạo Khí Số:{' '}
                  <span className="font-mono font-bold text-gold-400">{formatNumber(power)}</span> · Đang uẩn dưỡng:{' '}
                  <span className="font-mono text-jade-400 font-bold">{swords.length}/4</span> Phi Kiếm
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-paper-400 hover:bg-paper-400/10 hover:text-paper-100 transition-colors"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Buff Danh Xưng */}
          <div className="mt-3 rounded-lg border border-gold-500/20 bg-ink-950/70 p-2.5 text-xs">
            <p className="text-gold-300 font-serif">
              <span className="font-bold">Đạo ý gia trì:</span> {rank.buffDesc}
            </p>
          </div>

          {/* Tab Chuyển Đổi */}
          <div className="mt-3 flex gap-2 border-t border-paper-400/10 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('swords')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'swords'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
                  : 'text-paper-400 hover:text-paper-200'
              }`}
            >
              Phi Kiếm Đang Uẩn Dưỡng ({swords.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('forge')}
              disabled={swords.length >= 4}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'forge'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
                  : 'text-paper-400 hover:text-paper-200'
              } ${swords.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Thai Nghén Phi Kiếm Mới ({unownedSwords.length})
            </button>
          </div>
        </header>

        {/* ================= NỘI DUNG CHÍNH ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'swords' && (
            <>
              {swords.length === 0 ? (
                <div className="rounded-xl border border-dashed border-paper-400/20 bg-ink-900/40 p-8 text-center">
                  <p className="font-han text-lg text-paper-300">Khí phủ trống rỗng</p>
                  <p className="mt-1 text-xs text-paper-400">
                    Ngươi chưa uẩn dưỡng phi kiếm bản mệnh nào. Hãy chuyển qua mục Thai Nghén Phi Kiếm để ngưng tụ thanh kiếm đầu tiên!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {swords.map((s) => {
                    const def = NATAL_SWORD_BY_ID[s.swordDefId]
                    const temperCost = Math.round(1_500 * 1.7 ** (s.level - 1))
                    const isMaxSword = def ? s.level >= def.maxLevel : false

                    return (
                      <div
                        key={s.uid}
                        className="rounded-xl border border-gold-500/25 bg-gradient-to-r from-ink-900/90 via-ink-950/95 to-ink-900/90 p-4 shadow-lg space-y-3"
                      >
                        {/* Tiêu đề phi kiếm */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-400/10 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            {(() => {
                              const SwordIcon = (def ? SWORD_ICONS[def.id] : null) ?? IconFlyingSword
                              return (
                                <span
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border p-1.5 shadow-sm"
                                  style={{ color: def?.color ?? '#f59e0b', borderColor: def?.color ?? '#f59e0b' }}
                                >
                                  <SwordIcon className="h-5 w-5" />
                                </span>
                              )
                            })()}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-han text-base font-bold text-paper-100">{s.name}</h3>
                                <span className="text-xs text-paper-400 font-serif">· {def?.element}</span>
                              </div>
                              <p className="text-[11px] text-gold-400 font-mono">
                                Cấp tôi luyện: <span className="font-bold">{s.level}/{def?.maxLevel ?? 10}</span>
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            disabled={isMaxSword || state.stones < temperCost}
                            onClick={() => temper(s.uid)}
                          >
                            {isMaxSword
                              ? 'Cực hạn viên mãn'
                              : `Tôi Kiếm (+1 Cấp) · ${formatNumber(temperCost)} đá`}
                          </Button>
                        </div>

                        {/* Điển tích nguồn gốc */}
                        {def?.originLore && (
                          <p className="text-xs text-paper-400 italic font-serif leading-relaxed">
                            "{def.originLore}"
                          </p>
                        )}

                        {/* Danh sách Thần Thông của Phi Kiếm */}
                        <div className="space-y-2 pt-1">
                          <h4 className="font-han text-xs font-bold text-gold-400 flex items-center justify-between">
                            <span>Bản Mệnh Thần Thông ({s.talents.length})</span>
                            <span className="text-[11px] text-paper-400 font-normal">
                              Cấp 3 và cấp 6 tự động thức tỉnh thêm thần thông mới
                            </span>
                          </h4>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {s.talents.map((t) => {
                              const tDef = SWORD_TALENT_BY_ID[t.id]
                              const tCost = Math.round(2_500 * 1.8 ** (t.level - 1))
                              const isMaxTalent = tDef ? t.level >= tDef.maxLevel : false
                              const curVal = tDef ? tDef.baseValue + (t.level - 1) * tDef.perLevel : 0

                              return (
                                <div
                                  key={t.id}
                                  className="flex flex-col justify-between rounded-lg border border-paper-400/15 bg-ink-950/80 p-2.5 space-y-2"
                                >
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-han text-xs font-bold text-paper-200">
                                        ⚡ {tDef?.name ?? t.id}
                                      </span>
                                      <span className="font-mono text-[10px] text-jade-400 font-bold">
                                        Tầng {t.level}/{tDef?.maxLevel ?? 10}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-paper-400 line-clamp-2">
                                      {tDef?.description}
                                    </p>
                                    <p className="mt-1 text-[10px] text-gold-300 font-mono">
                                      Hiệu ứng hiện tại: +{(curVal * 100).toFixed(1)}%
                                    </p>
                                  </div>

                                  <Button
                                    disabled={isMaxTalent || state.stones < tCost}
                                    onClick={() => upgradeTalent(s.uid, t.id)}
                                    className="w-full text-xs"
                                  >
                                    {isMaxTalent
                                      ? 'Viên mãn'
                                      : `Ngộ Đạo (+1 Tầng) · ${formatNumber(tCost)} đá`}
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'forge' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gold-500/20 bg-ink-950/80 p-3.5 space-y-2">
                <h3 className="font-han text-sm font-bold text-gold-300">
                  Quy Củ Thai Nghén Phi Kiếm ({swords.length + 1}/4)
                </h3>
                <p className="text-xs text-paper-400 leading-relaxed font-serif">
                  Kiếm tu uẩn dưỡng phi kiếm bản mệnh thứ hai, thứ ba, thứ tư đòi hỏi cảnh giới tương ứng cùng kiếm tài tinh thuần (Kiếm Khí Tinh Thạch & Tiền Thần Tiên nhặt được khi chinh phạt các cõi).
                </p>
                <div className="mt-2 text-xs text-paper-300 border-t border-paper-400/10 pt-2 font-mono">
                  <span className="text-paper-400">Yêu cầu kiếm thứ {swords.length + 1}: </span>
                  <span className="text-gold-400 font-bold">{formatNumber(forgeCost.stones)} đá</span>
                  {Object.entries(forgeCost.items).map(([id, n]) => {
                    const have = getItemCount(state, id)
                    return (
                      <span
                        key={id}
                        className={`ml-2 ${have >= n ? 'text-jade-400 font-bold' : 'text-vermilion-400 font-bold'}`}
                      >
                        · {id} ({have}/{n})
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {unownedSwords.map((def) => {
                  const realmOk = state.realmIndex >= def.minRealmIndex
                  const stonesOk = state.stones >= forgeCost.stones
                  const itemsOk = Object.entries(forgeCost.items).every(
                    ([id, n]) => getItemCount(state, id) >= n,
                  )
                  const canForge = realmOk && stonesOk && itemsOk

                  return (
                    <div
                      key={def.id}
                      className="flex flex-col justify-between rounded-xl border border-paper-400/20 bg-ink-900/70 p-3.5 shadow-md space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const SwordIcon = SWORD_ICONS[def.id] ?? IconFlyingSword
                              return (
                                <span
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border p-1.5 shadow-sm"
                                  style={{ color: def.color, borderColor: def.color }}
                                >
                                  <SwordIcon className="h-4 w-4" />
                                </span>
                              )
                            })()}
                            <div>
                              <h4 className="font-han text-sm font-bold text-paper-100">{def.name}</h4>
                              <span className="text-[11px] text-paper-400 font-serif">{def.element}</span>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-mono font-bold ${realmOk ? 'text-jade-400' : 'text-vermilion-400'}`}
                          >
                            {realmOk ? 'Đủ cảnh giới' : 'Cảnh giới chưa đủ'}
                          </span>
                        </div>
                        <p className="text-xs text-paper-400 font-serif leading-relaxed line-clamp-3">
                          {def.originLore}
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        disabled={!canForge}
                        onClick={() => forge(def.id)}
                        className="w-full"
                      >
                        {canForge ? 'Uẩn Dưỡng Kiếm Thai' : 'Chưa đủ điều kiện'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

