import { RARITY_RANK } from '@/content/affixes'
import { getSlotsForType } from '@/content/gear'
import {
  type GameState,
  GEAR_CAP,
  gearScore,
  getGearDef,
  isEquipped,
} from '@/engine'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { GearCard } from '@/ui/organisms/GearCard'
import { EquipmentDoll } from './EquipmentDoll'

export function GearPanel({ state }: { state: GameState }) {
  const equip = useGameStore((s) => s.equip)
  const salvage = useGameStore((s) => s.salvage)
  const salvageByRarity = useGameStore((s) => s.salvageByRarity)

  const byUid = new Map(state.gear.map((g) => [g.uid, g]))
  const bag = state.gear
    .filter((g) => !isEquipped(state, g.uid))
    .sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || gearScore(b) - gearScore(a))

  return (
    <section className="space-y-6">
      {/* ================= GIAO DIỆN PAPER DOLL ĐẠO THÂN TRANG BỊ CHUẨN VÕ LÂM ================= */}
      <EquipmentDoll state={state} />

      {/* ================= KHO PHÁP BẢO CHƯA TRANG BỊ ================= */}
      <div className="rounded-2xl border border-paper-400/15 bg-ink-950/70 p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-400/15 pb-2.5">
          <div className="flex items-center gap-2">
            <h4 className="font-han text-sm sm:text-base font-bold text-gold-400">
              📦 Kho Pháp Bảo Trong Túi ({bag.length})
            </h4>
            <span className="text-xs text-paper-400 font-mono">
              Tổng sức chứa: {state.gear.length}/{GEAR_CAP}
            </span>
          </div>

          {bag.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className="border border-paper-400/20 text-xs px-2.5 py-1 min-h-8"
                onClick={() => salvageByRarity(['pham', 'linh'])}
                title="Phân giải các món Phàm Phẩm và Linh Phẩm thành Linh Thạch"
              >
                Phân giải Phàm + Linh
              </Button>
              <Button
                variant="ghost"
                className="border border-paper-400/20 text-xs px-2.5 py-1 min-h-8 text-vermilion-400 hover:bg-vermilion-500/10"
                onClick={() => salvage(bag.map((g) => g.uid))}
                title="Phân giải toàn bộ trang bị chưa mặc trong kho"
              >
                Phân giải tất cả chưa mặc
              </Button>
            </div>
          )}
        </div>

        {bag.length === 0 ? (
          <p className="text-xs sm:text-sm text-paper-400 py-6 text-center border border-dashed border-paper-400/15 rounded-xl font-serif">
            Kho đồ đang trống. Hãy hành tẩu khai sơn phá thạch hoặc mở rương để thu thập thần binh bảo vật!
          </p>
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2">
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
        )}
      </div>
    </section>
  )
}
