import { getSlotsForType } from '@/content/gear'
import { type GameState, type GearInstance, getGearDef } from '@/engine'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'
import { GearCard } from '@/ui/organisms/GearCard'

interface Props {
  result: GearInstance[] | null
  state: GameState
  onEquip: (uid: string) => void
  onSalvage: (uid: string) => void
  onOpenMore: () => void
  onClose: () => void
}

/** What came out of the chests just opened. Items already salvaged/equipped update live. */
export function ChestModal({ result, state, onEquip, onSalvage, onOpenMore, onClose }: Props) {
  if (!result) return null
  const stillOwned = result.filter((g) => state.gear.some((x) => x.uid === g.uid))
  const remaining = state.journey.chests.normal + state.journey.chests.red
  const hasJackpot = stillOwned.some((g) => g.rarity === 'than' || g.rarity === 'tien')
  const hasRare = stillOwned.some((g) => g.rarity === 'bao')

  return (
    <Modal
      open
      title={`Mở rương · ${result.length} món`}
      onClose={onClose}
      footer={
        <>
          {remaining > 0 && (
            <Button variant="secondary" onClick={onOpenMore}>
              Mở tiếp ({remaining})
            </Button>
          )}
          <Button variant="primary" onClick={onClose} autoFocus>
            Xong
          </Button>
        </>
      }
    >
      {hasJackpot ? (
        <div className="mb-3 rounded-xl border border-amber-400/60 bg-gradient-to-r from-amber-950/60 via-gold-950/40 to-amber-950/60 p-2.5 text-center text-xs text-amber-300 font-serif font-bold animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.2)]">
          ✨ THIÊN ĐỊA DỊ TƯỢNG! Khai mở được Thần Binh Tiên Giáp xuất thế!
        </div>
      ) : hasRare ? (
        <div className="mb-3 rounded-xl border border-purple-500/40 bg-purple-950/30 p-2 text-center text-xs text-purple-300 font-serif font-bold">
          🌟 KHÍ VẬN HANH THÔNG! Mở ra bảo vật trân quý!
        </div>
      ) : null}

      {stillOwned.length === 0 ? (
        <p className="text-sm text-paper-400">Đã xử lý hết.</p>
      ) : (
        <ul className="space-y-2 pr-1">
          {stillOwned.map((g) => {
            const targetSlots = getSlotsForType(getGearDef(g).slot)
            const wornUid = targetSlots.map((s) => state.equipped[s]).find(Boolean) ?? null
            const worn = wornUid ? state.gear.find((x) => x.uid === wornUid) ?? null : null
            return (
              <GearCard key={g.uid} gear={g} worn={worn} equipped={wornUid === g.uid} onEquip={onEquip} onSalvage={onSalvage} dense />
            )
          })}
        </ul>
      )}
    </Modal>
  )
}
