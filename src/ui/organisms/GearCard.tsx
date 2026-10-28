import { SLOT_NAME } from '@/content/gear'
import { type GearInstance, gearScore, getGearDef, getGearName } from '@/engine'
import { describeAffix, RARITY_BG, RARITY_CLASS, rarityLabel } from '@/lib/gearUi'
import { Button } from '@/ui/atoms/Button'

interface Props {
  gear: GearInstance
  /** Currently worn piece in the same slot, for the "better" hint. */
  worn?: GearInstance | null
  equipped?: boolean
  onEquip?: (uid: string) => void
  onUnequip?: () => void
  onSalvage?: (uid: string) => void
  dense?: boolean
}

export function GearCard({ gear, worn, equipped = false, onEquip, onUnequip, onSalvage, dense = false }: Props) {
  const def = getGearDef(gear)
  const better = !equipped && worn ? gearScore(gear) > gearScore(worn) : !equipped && !worn
  return (
    <li className={`flex gap-3 rounded-lg border p-3 ${RARITY_CLASS[gear.rarity]} ${RARITY_BG[gear.rarity]} ${equipped ? 'ring-1 ring-gold-500/40' : ''}`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-current/30 bg-ink-950/60 font-han text-2xl" aria-hidden>
        {def.glyph}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="font-han text-base">{getGearName(gear)}</p>
          <span className="text-xs opacity-80">
            {rarityLabel(gear.rarity)} · {SLOT_NAME[def.slot]} · Bậc {gear.tier}
          </span>
          {equipped && <span className="text-xs text-gold-400">Đang mặc</span>}
          {better && !equipped && <span className="text-xs text-jade-400">↑ tốt hơn</span>}
        </div>
        {!dense && def.named && <p className="text-xs text-paper-400 italic">{def.description}</p>}
        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-paper-200">
          {gear.affixes.map((a) => (
            <li key={a.key} className="tabular-nums">{describeAffix(a)}</li>
          ))}
        </ul>
      </div>
      <div className="flex shrink-0 flex-col justify-center gap-1">
        {equipped ? (
          onUnequip && <Button variant="ghost" className="min-h-9 px-2 text-sm" onClick={onUnequip}>Cởi</Button>
        ) : (
          <>
            {onEquip && (
              <Button variant={better ? 'primary' : 'secondary'} className="min-h-9 px-2 text-sm" onClick={() => onEquip(gear.uid)}>
                Mặc
              </Button>
            )}
            {onSalvage && (
              <Button variant="ghost" className="min-h-9 px-2 text-xs text-paper-400" onClick={() => onSalvage(gear.uid)}>
                Phân giải
              </Button>
            )}
          </>
        )}
      </div>
    </li>
  )
}
