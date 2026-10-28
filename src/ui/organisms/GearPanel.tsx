import { RARITY_RANK } from '@/content/affixes'
import { GEAR_SLOTS, getSlotsForType, SLOT_NAME } from '@/content/gear'
import {
  type GameState,
  GEAR_CAP,
  gearScore,
  getActiveSetBonuses,
  getCombatStats,
  getGearDef,
  isEquipped,
} from '@/engine'
import { formatNumber, formatPercent } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { StatRow } from '@/ui/molecules/StatRow'
import { GearCard } from '@/ui/organisms/GearCard'

export function GearPanel({ state }: { state: GameState }) {
  const equip = useGameStore((s) => s.equip)
  const unequip = useGameStore((s) => s.unequip)
  const salvage = useGameStore((s) => s.salvage)
  const salvageByRarity = useGameStore((s) => s.salvageByRarity)
  const setCharacterModalOpen = useGameStore((s) => s.setCharacterModalOpen)

  const combat = getCombatStats(state)
  const activeSets = getActiveSetBonuses(state)
  const byUid = new Map(state.gear.map((g) => [g.uid, g]))
  const bag = state.gear
    .filter((g) => !isEquipped(state, g.uid))
    .sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || gearScore(b) - gearScore(a))

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-han text-lg text-paper-100">Pháp bảo (12 Ô)</h3>
        <span className="text-xs text-paper-400 tabular-nums">
          {state.gear.length} / {GEAR_CAP}
        </span>
      </div>

      {/* Thuộc tính chiến đấu tổng hợp */}
      <div className="rounded-lg border border-paper-400/10 bg-ink-900/60 p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-han text-xs text-paper-300">Thuộc tính chiến đấu hiện tại</span>
          <button
            type="button"
            onClick={() => setCharacterModalOpen(true)}
            className="text-xs text-gold-400 hover:text-gold-300 hover:underline"
          >
            Chi tiết đạo thân ›
          </button>
        </div>
        <StatRow
          stats={[
            { label: 'Khí huyết', value: formatNumber(combat.hp) },
            {
              label: 'Công',
              value: formatNumber(combat.atk),
              hint: `Bạo kích ${formatPercent(combat.crit)}`,
            },
            { label: 'Thủ', value: formatNumber(combat.def) },
            { label: 'Tốc đánh', value: `${(1000 / combat.attackMs).toFixed(2)}/s` },
          ]}
        />
      </div>

      {/* Hiệu ứng bộ (Set Bonus) nếu có kích hoạt */}
      {activeSets.length > 0 && (
        <div className="rounded-lg border border-gold-500/30 bg-ink-950/80 p-3 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">✨</span>
            <h4 className="font-han text-xs font-bold text-gold-300 uppercase tracking-wide">
              Hiệu Ứng Bộ Pháp Bảo Đang Kích Hoạt ({activeSets.length})
            </h4>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {activeSets.map((s, idx) => (
              <div
                key={`${s.setId}-${s.threshold}-${idx}`}
                className="rounded border border-gold-500/20 bg-ink-900/50 p-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-han font-bold text-gold-400">{s.setName}</span>
                  <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[10px] font-mono text-gold-300">
                    Mốc {s.threshold} món (Có {s.count})
                  </span>
                </div>
                <p className="mt-1 text-paper-300">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12 Ô Trang Bị Hiện Tại */}
      <div>
        <h4 className="mb-2 font-han text-xs font-bold text-paper-400">
          Trang Bị Đang Mặc Trên Người
        </h4>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {GEAR_SLOTS.map((slot) => {
            const uid = state.equipped[slot]
            const g = uid ? byUid.get(uid) : undefined
            if (!g) {
              return (
                <li
                  key={slot}
                  className="flex min-h-16 flex-col items-center justify-center rounded-lg border border-dashed border-paper-400/20 bg-ink-950/30 p-2 text-center text-xs text-paper-400"
                >
                  <span className="font-han text-paper-300 text-xs font-medium">{SLOT_NAME[slot]}</span>
                  <span className="mt-0.5 text-[10px] text-paper-400">Trống</span>
                </li>
              )
            }
            return <GearCard key={slot} gear={g} equipped onUnequip={() => unequip(slot)} dense />
          })}
        </ul>
      </div>

      {/* Kho Đồ Pháp Bảo */}
      <div className="pt-2">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-han text-xs font-bold text-paper-400">
            Kho Pháp Bảo Chưa Trang Bị ({bag.length})
          </h4>
        </div>

        {bag.length === 0 ? (
          <p className="text-sm text-paper-400 py-3 text-center border border-paper-400/10 rounded-lg">
            Kho đồ đang trống. Hãy hành tẩu mở rương để thu thập thần binh bảo vật!
          </p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className="border border-paper-400/15 text-xs"
                onClick={() => salvageByRarity(['pham', 'linh'])}
              >
                Phân giải Phàm + Linh
              </Button>
              <Button
                variant="ghost"
                className="border border-paper-400/15 text-xs"
                onClick={() => salvage(bag.map((g) => g.uid))}
              >
                Phân giải tất cả chưa mặc
              </Button>
            </div>
            <ul className="grid gap-2 md:grid-cols-2">
              {bag.map((g) => {
                const targetSlots = getSlotsForType(getGearDef(g).slot)
                const wornUid = targetSlots.map((s) => state.equipped[s]).find(Boolean) ?? null
                const worn = wornUid ? byUid.get(wornUid) ?? null : null
                return (
                  <GearCard
                    key={g.uid}
                    gear={g}
                    worn={worn}
                    onEquip={(uid) => equip(uid)}
                    onSalvage={(uid) => salvage([uid])}
                    dense
                  />
                )
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
