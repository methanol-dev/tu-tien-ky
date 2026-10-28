import { useState } from 'react'
import { RARITY_NAME } from '@/content/affixes'
import { GEAR_SLOTS, SLOT_NAME } from '@/content/gear'
import { baselineStats } from '@/content/regions'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import {
  type GameState,
  getActiveBuffs,
  getAffixTotals,
  getBreakthroughChance,
  getCombatStats,
  getLifespanDays,
  getModifiers,
  getNextRealm,
  getQiRate,
  getRealm,
  getStoneRate,
  isLifespanExceeded,
  getGearDef,
} from '@/engine'
import { describeAffix, RARITY_BG, RARITY_CLASS } from '@/lib/gearUi'
import { describeTechniqueEffect } from '@/lib/describe'
import { formatAge, formatDurationMs, formatNumber, formatPercent, formatRate } from '@/lib/format'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface CharacterModalProps {
  open: boolean
  onClose: () => void
  state: GameState
}

type Tab = 'combat' | 'cultivation' | 'gear'

export function CharacterModal({ open, onClose, state }: CharacterModalProps) {
  const [tab, setTab] = useState<Tab>('combat')

  if (!open) return null

  const realm = getRealm(state)
  const nextRealm = getNextRealm(state)
  const combat = getCombatStats(state)
  const baseline = baselineStats(state.realmIndex)
  const affixes = getAffixTotals(state)
  const mods = getModifiers(state)
  const buffs = getActiveBuffs(state)
  const expired = isLifespanExceeded(state)
  const lifespanYears = Math.floor(getLifespanDays(state) / 360)

  const byUid = new Map(state.gear.map((g) => [g.uid, g]))
  const learnedTechniques = Object.entries(state.techniques)
    .filter(([, lvl]) => lvl > 0)
    .map(([id, lvl]) => ({ def: TECHNIQUE_BY_ID[id], lvl }))
    .filter((t) => t.def !== undefined)

  return (
    <Modal
      open={open}
      title="Đạo Thân · Chỉ Số Nhân Vật"
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <Button variant="primary" onClick={onClose} autoFocus>
          Đóng
        </Button>
      }
    >
      {/* Căn cốt tổng quan */}
      <div className="rounded-lg border border-gold-500/20 bg-ink-900/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-han text-xl font-bold text-paper-100">{realm.name}</span>
              {realm.stageLabel && (
                <span className="rounded bg-gold-500/10 px-2 py-0.5 text-xs text-gold-400 border border-gold-500/30">
                  {realm.stageLabel}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-paper-400">
              Tuổi thọ:{' '}
              <span className={`tabular-nums ${expired ? 'text-vermilion-400' : 'text-paper-200'}`}>
                {formatAge(state.ageDays)}
              </span>{' '}
              / <span className="tabular-nums text-paper-300">{lifespanYears} năm</span>
              {expired && <span className="ml-1 text-vermilion-400">(Đã tận)</span>}
            </p>
          </div>
          <div className="text-right text-xs text-paper-400 space-y-0.5">
            <p>
              Luân hồi:{' '}
              <span className="font-han text-gold-400 tabular-nums">
                {state.legacy.lives} kiếp
              </span>
            </p>
            <p>
              Đạo Vận: <span className="text-jade-400 tabular-nums">{state.legacy.daoVan}</span>
            </p>
            <p>
              Linh thạch: <span className="text-paper-100 tabular-nums">{formatNumber(state.stones)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-paper-400/15">
        <button
          type="button"
          onClick={() => setTab('combat')}
          className={`flex-1 border-b-2 py-2 text-center text-sm font-medium transition-colors ${
            tab === 'combat'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          ⚔️ Chiến Lực (Hành Tẩu)
        </button>
        <button
          type="button"
          onClick={() => setTab('cultivation')}
          className={`flex-1 border-b-2 py-2 text-center text-sm font-medium transition-colors ${
            tab === 'cultivation'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          🧘 Tu Vi & Căn Cơ
        </button>
        <button
          type="button"
          onClick={() => setTab('gear')}
          className={`flex-1 border-b-2 py-2 text-center text-sm font-medium transition-colors ${
            tab === 'gear'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          🛡️ Pháp Bảo ({Object.values(state.equipped).filter(Boolean).length}/3)
        </button>
      </div>

      {/* Tab 1: Chiến lực */}
      {tab === 'combat' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Khí huyết (HP)</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {formatNumber(combat.hp)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc: {formatNumber(baseline.hp)} {affixes.hp > 0 && <span className="text-jade-400">(+{formatPercent(affixes.hp)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Công kích</span>
              <p className="font-han text-lg font-bold text-vermilion-400 tabular-nums">
                {formatNumber(combat.atk)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc: {formatNumber(baseline.atk)} {affixes.atk > 0 && <span className="text-jade-400">(+{formatPercent(affixes.atk)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Phòng ngự</span>
              <p className="font-han text-lg font-bold text-qi-400 tabular-nums">
                {formatNumber(combat.def)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc: {formatNumber(baseline.def)} {affixes.def > 0 && <span className="text-jade-400">(+{formatPercent(affixes.def)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tốc độ đánh</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                {(1000 / combat.attackMs).toFixed(2)}/s
              </p>
              <p className="text-[10px] text-paper-400">
                {combat.attackMs}ms/đòn {affixes.atkSpeed > 0 && <span className="text-jade-400">(+{formatPercent(affixes.atkSpeed)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tỉ lệ bạo kích</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {formatPercent(combat.crit)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc 5% {affixes.crit > 0 && <span className="text-jade-400">(+{formatPercent(affixes.crit)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Sát thương bạo</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                ×{combat.critMult.toFixed(2)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc ×1.50 {affixes.critDmg > 0 && <span className="text-jade-400">(+{formatPercent(affixes.critDmg)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Hấp huyết (Hút máu)</span>
              <p className="font-han text-lg font-bold text-jade-400 tabular-nums">
                {formatPercent(combat.lifesteal)}
              </p>
              <p className="text-[10px] text-paper-400">Hồi HP theo sát thương</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Cơ duyên tìm bảo</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                +{formatPercent(mods.lootChanceMult - 1)}
              </p>
              <p className="text-[10px] text-paper-400">Tăng tỉ lệ rơi rương</p>
            </div>
          </div>

          <div className="rounded-md border border-paper-400/10 bg-ink-900/30 p-3 text-xs text-paper-400">
            💡 <strong className="text-paper-300">Quy tắc chiến lực</strong>: Cảnh giới nâng cao chỉ số căn bản (Khí huyết, Công, Thủ). Pháp bảo và thuộc tính (Affix) sẽ nhân phần trăm lên chỉ số căn bản đó.
          </div>
        </div>
      )}

      {/* Tab 2: Tu vi & Căn cơ */}
      {tab === 'cultivation' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tốc độ tụ khí</span>
              <p className="font-han text-lg font-bold text-qi-400 tabular-nums">
                {formatRate(getQiRate(state))}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc {formatRate(realm.qiRate)} · ×{mods.qiRateMult.toFixed(2)}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Thu hoạch linh thạch</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                {formatRate(getStoneRate(state))}
              </p>
              <p className="text-[10px] text-paper-400">
                Hệ số ×{mods.stoneRateMult.toFixed(2)}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Xác suất đột phá</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {formatPercent(getBreakthroughChance(state))}
              </p>
              <p className="text-[10px] text-paper-400">
                {nextRealm ? `Đích: ${nextRealm.name}` : 'Đã viên mãn'}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tổn thất thất bại</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                -{Math.round((1 - mods.failPenaltyMult) * 100)}%
              </p>
              <p className="text-[10px] text-paper-400">Giảm trừ linh khí khi hỏng</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Vận công thiền định</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                +{mods.meditateSeconds}s
              </p>
              <p className="text-[10px] text-paper-400">Linh khí mỗi lần nhấp</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Bế quan tối đa</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {(mods.offlineCapMs / 3600000).toFixed(1)} giờ
              </p>
              <p className="text-[10px] text-paper-400">Tích lũy offline</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Thọ nguyên gia tăng</span>
              <p className="font-han text-lg font-bold text-jade-400 tabular-nums">
                +{mods.lifespanBonusYears} năm
              </p>
              <p className="text-[10px] text-paper-400">Từ công pháp & luân hồi</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Dược lực tạm thời</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                {state.pendingBreakthroughBonus > 0 ? `+${formatPercent(state.pendingBreakthroughBonus)}` : '0%'}
              </p>
              <p className="text-[10px] text-paper-400">Cộng dồn đột phá lần tới</p>
            </div>
          </div>

          {/* Dược lực đang phát huy */}
          {buffs.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-han text-sm text-jade-400">Dược lực đang phát huy ({buffs.length})</h4>
              <ul className="flex flex-wrap gap-2 text-xs">
                {buffs.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-full border border-jade-500/40 bg-jade-500/10 px-3 py-1 text-jade-300 tabular-nums"
                  >
                    {b.name} ×{b.qiRateMult} · còn {formatDurationMs(b.expiresAtMs - state.playedMs)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Công pháp đã đắc ngộ */}
          <div className="space-y-1.5">
            <h4 className="font-han text-sm text-paper-200">
              Công pháp đã đắc ngộ ({learnedTechniques.length})
            </h4>
            {learnedTechniques.length === 0 ? (
              <p className="text-xs text-paper-400">Chưa tu luyện công pháp nào. Vào tab Công pháp để mua.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2 text-xs">
                {learnedTechniques.map(({ def, lvl }) => (
                  <li
                    key={def.id}
                    className="rounded-md border border-paper-400/10 bg-ink-900/50 p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-han font-medium text-gold-400">{def.name}</span>
                      <span className="text-paper-400 tabular-nums">Tầng {lvl}/{def.maxLevel}</span>
                    </div>
                    <p className="mt-1 text-paper-300">{describeTechniqueEffect(def, lvl)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Pháp bảo */}
      {tab === 'gear' && (
        <div className="space-y-4 pt-1">
          <ul className="grid gap-3 sm:grid-cols-3">
            {GEAR_SLOTS.map((slot) => {
              const uid = state.equipped[slot]
              const g = uid ? byUid.get(uid) : undefined
              if (!g) {
                return (
                  <li
                    key={slot}
                    className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-paper-400/20 bg-ink-900/30 p-3 text-center text-xs text-paper-400"
                  >
                    <span className="font-han text-sm text-paper-300">{SLOT_NAME[slot]}</span>
                    <span className="mt-1 text-paper-400">Chưa trang bị</span>
                  </li>
                )
              }
              const def = getGearDef(g)
              return (
                <li
                  key={slot}
                  className={`flex flex-col justify-between rounded-lg border p-3 ${RARITY_CLASS[g.rarity]} ${RARITY_BG[g.rarity]}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-han text-sm font-semibold">{def.name}</h4>
                      <span className="text-[10px] uppercase">{RARITY_NAME[g.rarity]}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-paper-400">
                      {SLOT_NAME[slot]} · Bậc {g.tier}
                    </p>
                    <ul className="mt-2 space-y-0.5 text-xs">
                      {g.affixes.map((a, i) => (
                        <li key={i} className="text-paper-200">
                          {describeAffix(a)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="rounded-md border border-paper-400/10 bg-ink-900/50 p-3">
            <h4 className="font-han text-xs font-semibold text-paper-300 mb-2">
              Tổng cộng thuộc tính từ pháp bảo đang mặc:
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3">
              {affixes.hp > 0 && <span className="text-paper-300">Khí huyết: <strong className="text-jade-400">+{formatPercent(affixes.hp)}</strong></span>}
              {affixes.atk > 0 && <span className="text-paper-300">Công kích: <strong className="text-vermilion-400">+{formatPercent(affixes.atk)}</strong></span>}
              {affixes.def > 0 && <span className="text-paper-300">Phòng ngự: <strong className="text-qi-400">+{formatPercent(affixes.def)}</strong></span>}
              {affixes.atkSpeed > 0 && <span className="text-paper-300">Thân pháp: <strong className="text-gold-400">+{formatPercent(affixes.atkSpeed)}</strong></span>}
              {affixes.crit > 0 && <span className="text-paper-300">Bạo kích: <strong className="text-paper-100">+{formatPercent(affixes.crit)}</strong></span>}
              {affixes.critDmg > 0 && <span className="text-paper-300">Bạo thương: <strong className="text-paper-100">+{formatPercent(affixes.critDmg)}</strong></span>}
              {affixes.lifesteal > 0 && <span className="text-paper-300">Hấp huyết: <strong className="text-jade-400">+{formatPercent(affixes.lifesteal)}</strong></span>}
              {affixes.qiRate > 0 && <span className="text-paper-300">Tụ khí: <strong className="text-qi-400">+{formatPercent(affixes.qiRate)}</strong></span>}
              {affixes.stoneRate > 0 && <span className="text-paper-300">Tụ bảo: <strong className="text-gold-400">+{formatPercent(affixes.stoneRate)}</strong></span>}
              {affixes.lootChance > 0 && <span className="text-paper-300">Cơ duyên: <strong className="text-gold-400">+{formatPercent(affixes.lootChance)}</strong></span>}
              {Object.values(affixes).every((v) => v === 0) && (
                <span className="text-paper-400 col-span-3">Chưa có thuộc tính nào từ pháp bảo.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
