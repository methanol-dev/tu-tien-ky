import { RARITY_RANK } from '@/content/affixes'
import { GEAR_SLOTS, SLOT_NAME } from '@/content/gear'
import { type GameState, GEAR_CAP, gearScore, getCombatStats, getGearDef, isEquipped } from '@/engine'
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
  const byUid = new Map(state.gear.map((g) => [g.uid, g]))
  const bag = state.gear
    .filter((g) => !isEquipped(state, g.uid))
    .sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || gearScore(b) - gearScore(a))

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-han text-lg text-paper-100">Pháp bảo</h3>
        <span className="text-xs text-paper-400 tabular-nums">{state.gear.length} / {GEAR_CAP}</span>
      </div>

      <div className="rounded-lg border border-paper-400/10 bg-ink-900/60 p-3">
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

      <ul className="grid gap-2 sm:grid-cols-3">
        {GEAR_SLOTS.map((slot) => {
          const uid = state.equipped[slot]
          const g = uid ? byUid.get(uid) : undefined
          if (!g) {
            return (
              <li key={slot} className="flex min-h-20 items-center justify-center rounded-lg border border-dashed border-paper-400/20 text-sm text-paper-400">
                {SLOT_NAME[slot]} · trống
              </li>
            )
          }
          return <GearCard key={slot} gear={g} equipped onUnequip={() => unequip(slot)} dense />
        })}
      </ul>

      {bag.length === 0 ? (
        <p className="text-sm text-paper-400">Túi trống. Mở rương nhặt được trên đường hành tẩu.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" className="border border-paper-400/15 text-sm" onClick={() => salvageByRarity(['pham', 'linh'])}>
              Phân giải Phàm + Linh
            </Button>
            <Button variant="ghost" className="border border-paper-400/15 text-sm" onClick={() => salvage(bag.map((g) => g.uid))}>
              Phân giải tất cả chưa mặc
            </Button>
          </div>
          <ul className="grid gap-2 md:grid-cols-2">
            {bag.map((g) => {
              const wornUid = state.equipped[getGearDef(g).slot]
              const worn = wornUid ? byUid.get(wornUid) ?? null : null
              return <GearCard key={g.uid} gear={g} worn={worn} onEquip={equip} onSalvage={(uid) => salvage([uid])} dense />
            })}
          </ul>
        </>
      )}
    </section>
  )
}
