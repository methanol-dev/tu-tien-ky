import { GEAR_TYPE_NAME } from '@/content/gear'
import { GEAR_SET_BY_ID } from '@/content/gearSets'
import { type GearInstance, gearScore, getGearDef, getGearName } from '@/engine'
import { describeAffix, RARITY_BG, RARITY_CLASS, rarityLabel } from '@/lib/gearUi'
import { Button } from '@/ui/atoms/Button'
import { GearIcon } from '@/ui/atoms/GearIcon'

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
  const setDef = def?.setId ? GEAR_SET_BY_ID[def.setId] : undefined
  const better = !equipped && worn ? gearScore(gear) > gearScore(worn) : !equipped && !worn

  return (
    <li
      className={`flex gap-3 rounded-lg border p-3 transition-colors ${RARITY_CLASS[gear.rarity]} ${RARITY_BG[gear.rarity]} ${
        equipped ? 'ring-1 ring-gold-500/50 shadow-[0_0_10px_rgba(234,179,8,0.15)]' : ''
      }`}
    >
      <GearIcon slot={def.slot} glyph={def.glyph} rarity={gear.rarity} gearId={gear.defId} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-han text-base font-bold">{getGearName(gear)}</p>
          <span className="text-xs opacity-80">
            {rarityLabel(gear.rarity)} · {GEAR_TYPE_NAME[def.slot]} · Bậc {gear.tier}
          </span>
          {setDef && (
            <span className="rounded border border-gold-500/50 bg-ink-950/80 px-1.5 py-0.2 text-[10px] font-han font-bold text-gold-300 shadow-sm">
              Bộ: {setDef.name}
            </span>
          )}
          {equipped && <span className="text-xs font-bold text-gold-400">Đang mặc</span>}
          {better && !equipped && <span className="text-xs text-jade-400 font-bold">↑ tốt hơn</span>}
        </div>

        {!dense && def.named && <p className="mt-0.5 text-xs text-paper-400 italic">{def.description}</p>}

        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-paper-200">
          {gear.affixes.map((a) => (
            <li key={a.key} className="tabular-nums">
              {describeAffix(a)}
            </li>
          ))}
        </ul>

        {/* Thông tin Set Bonus gợi ý nếu thuộc bộ */}
        {!dense && setDef && (
          <div className="mt-1.5 rounded border border-paper-400/10 bg-ink-950/40 px-2 py-1 text-[11px] text-paper-300">
            <span className="font-bold text-gold-400/90">Hiệu ứng bộ {setDef.name}:</span>
            <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-paper-400">
              {setDef.bonuses.map((b) => (
                <li key={b.threshold}>
                  ({b.threshold} món): {b.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col justify-center gap-1">
        {equipped ? (
          onUnequip && (
            <Button variant="ghost" className="min-h-9 px-2 text-sm text-vermilion-300 hover:text-vermilion-200" onClick={onUnequip}>
              Cởi
            </Button>
          )
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
