import { RARITY_NAME } from '@/content/affixes'
import {
  type GearSlot,
  getSlotsForType,
  getTypeForSlot,
  SLOT_NAME,
} from '@/content/gear'
import { GEAR_SET_BY_ID } from '@/content/gearSets'
import {
  compareGearStats,
  type GameState,
  gearScore,
  type GearInstance,
  getGearDef,
  getGearName,
  isEquipped,
} from '@/engine'
import { describeAffix, RARITY_BG, RARITY_CLASS } from '@/lib/gearUi'
import { formatPercent } from '@/lib/format'
import { Button } from '@/ui/atoms/Button'
import { GearIcon } from '@/ui/atoms/GearIcon'
import { Modal } from '@/ui/atoms/Modal'

interface GearInspectModalProps {
  open: boolean
  onClose: () => void
  slot: GearSlot | null
  gearUid: string | null
  state: GameState
  onEquip: (uid: string, targetSlot?: GearSlot) => void
  onUnequip: (slot: GearSlot) => void
  onSalvage?: (uid: string) => void
}

export function GearInspectModal({
  open,
  onClose,
  slot,
  gearUid,
  state,
  onEquip,
  onUnequip,
  onSalvage,
}: GearInspectModalProps) {
  if (!open) return null

  const byUid = new Map(state.gear.map((g) => [g.uid, g]))

  // Xác định món đồ đang được inspect hoặc slot đang xem
  let inspectedGear: GearInstance | null = null
  let activeSlot: GearSlot | null = slot

  if (gearUid) {
    inspectedGear = byUid.get(gearUid) ?? null
    if (inspectedGear && !activeSlot) {
      const def = getGearDef(inspectedGear)
      const validSlots = getSlotsForType(def.slot)
      activeSlot = validSlots.find((s) => state.equipped[s] === gearUid) ?? validSlots[0]
    }
  } else if (slot) {
    const equippedUid = state.equipped[slot]
    if (equippedUid) {
      inspectedGear = byUid.get(equippedUid) ?? null
    }
  }

  // Nếu đang xem 1 slot, tìm các món đồ trong túi có thể lắp vào slot này
  const slotType = activeSlot ? getTypeForSlot(activeSlot) : inspectedGear ? getGearDef(inspectedGear).slot : null
  const bagCandidates = slotType
    ? state.gear
        .filter((g) => !isEquipped(state, g.uid) && getGearDef(g).slot === slotType)
        .sort((a, b) => gearScore(b) - gearScore(a))
    : []

  const title = activeSlot
    ? `Vị Trí Trang Bị: ${SLOT_NAME[activeSlot]}`
    : inspectedGear
    ? getGearName(inspectedGear)
    : 'Chi Tiết Pháp Bảo'

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-lg">
      <div className="space-y-4">
        {/* ================= THẺ MÓN ĐANG MẶC (HOẶC MÓN ĐANG CHỌN) ================= */}
        {inspectedGear ? (
          <div
            className={`relative rounded-xl border p-4 shadow-lg ${RARITY_CLASS[inspectedGear.rarity]} ${RARITY_BG[inspectedGear.rarity]}`}
          >
            {/* Header món đồ */}
            <div className="flex items-start gap-3.5">
              <GearIcon
                slot={getGearDef(inspectedGear).slot}
                glyph={getGearDef(inspectedGear).glyph}
                rarity={inspectedGear.rarity}
                gearId={inspectedGear.defId}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-han text-base font-bold truncate ${RARITY_CLASS[inspectedGear.rarity]}`}>
                    {getGearName(inspectedGear)}
                  </h3>
                  <span className="rounded bg-ink-950/80 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-paper-200">
                    {RARITY_NAME[inspectedGear.rarity]}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-paper-400 font-serif">
                  <span>Bậc {inspectedGear.tier}</span>
                  <span>·</span>
                  <span className="font-mono text-gold-300">
                    Lực chiến: {Math.round(gearScore(inspectedGear))}
                  </span>
                </div>
                <p className="mt-1 text-xs text-paper-400 font-serif italic">
                  "{getGearDef(inspectedGear).description}"
                </p>
              </div>
            </div>

            {/* Danh sách Dòng Affixes */}
            <div className="mt-3.5 border-t border-paper-400/15 pt-3">
              <h4 className="font-han text-xs font-bold text-gold-400 mb-1.5">Thuộc tính pháp bảo:</h4>
              <ul className="space-y-1 text-xs">
                {inspectedGear.affixes.map((a, i) => (
                  <li key={i} className="flex items-center justify-between font-mono text-paper-100">
                    <span className="text-paper-300">· {describeAffix(a)}</span>
                    <span className="text-jade-400 font-bold">+{formatPercent(a.value)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Thông tin Set nếu có */}
            {getGearDef(inspectedGear).setId && (
              <div className="mt-3 rounded-lg border border-gold-500/20 bg-ink-950/60 p-2.5 text-xs">
                <div className="flex items-center justify-between text-gold-400 font-han font-bold">
                  <span>Bộ: {GEAR_SET_BY_ID[getGearDef(inspectedGear).setId!].name}</span>
                </div>
                <ul className="mt-1 space-y-1 text-[11px] text-paper-300">
                  {GEAR_SET_BY_ID[getGearDef(inspectedGear).setId!].bonuses.map((b, idx) => (
                    <li key={idx} className="flex gap-1">
                      <span className="text-gold-300">({b.threshold} món):</span>
                      <span className="text-paper-400">{b.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Các nút hành động chính */}
            <div className="mt-4 flex gap-2 border-t border-paper-400/15 pt-3">
              {activeSlot && state.equipped[activeSlot] === inspectedGear.uid ? (
                <Button
                  variant="danger"
                  className="flex-1 text-xs"
                  onClick={() => {
                    onUnequip(activeSlot!)
                    onClose()
                  }}
                >
                  Gỡ Ra Khỏi Người
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="flex-1 text-xs"
                  onClick={() => {
                    onEquip(inspectedGear!.uid, activeSlot ?? undefined)
                    onClose()
                  }}
                >
                  Trang Bị Ngay
                </Button>
              )}

              {onSalvage && !isEquipped(state, inspectedGear.uid) && (
                <Button
                  variant="ghost"
                  className="border border-paper-400/20 text-xs"
                  onClick={() => {
                    onSalvage(inspectedGear!.uid)
                    onClose()
                  }}
                >
                  Phân Giải
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP Ô ĐANG TRỐNG */
          <div className="rounded-xl border border-dashed border-paper-400/20 bg-ink-950/40 p-4 text-center">
            <p className="font-han text-sm text-paper-300">
              Vị trí <strong className="text-gold-400">{activeSlot ? SLOT_NAME[activeSlot] : ''}</strong> hiện đang bỏ trống.
            </p>
            <p className="mt-1 text-xs text-paper-400 font-serif">
              Chọn một món pháp bảo tương thích bên dưới để mặc vào tăng cường chiến lực.
            </p>
          </div>
        )}

        {/* ================= DANH SÁCH MÓN ĐỒ TRONG KHO CÙNG LOẠI ================= */}
        <div className="space-y-2 pt-1">
          <h4 className="font-han text-xs font-bold text-paper-300 flex items-center justify-between">
            <span>Pháp bảo tương thích trong túi càn khôn ({bagCandidates.length})</span>
            {activeSlot && <span className="text-[11px] text-paper-400 font-serif">Ô {SLOT_NAME[activeSlot]}</span>}
          </h4>

          {bagCandidates.length === 0 ? (
            <p className="rounded-lg border border-paper-400/10 bg-ink-950/50 p-4 text-center text-xs text-paper-400">
              Không có món pháp bảo cùng loại nào trong túi đồ. Hãy hành tẩu khai sơn phá thạch để thu thập thêm!
            </p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {bagCandidates.map((cand) => {
                const cmp = compareGearStats(inspectedGear, cand)
                const def = getGearDef(cand)

                return (
                  <div
                    key={cand.uid}
                    className={`flex items-center justify-between rounded-lg border p-2.5 transition-colors ${RARITY_CLASS[cand.rarity]} bg-ink-900/70 hover:bg-ink-900`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <GearIcon
                        slot={def.slot}
                        glyph={def.glyph}
                        rarity={cand.rarity}
                        gearId={cand.defId}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-han text-xs font-bold truncate ${RARITY_CLASS[cand.rarity]}`}>
                            {getGearName(cand)}
                          </h5>
                          <span className="font-mono text-[10px] text-paper-400">T{cand.tier}</span>
                        </div>

                        {/* So sánh điểm lực chiến hơn kém */}
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="text-paper-400">Lực chiến: {Math.round(gearScore(cand))}</span>
                          {inspectedGear && (
                            <span
                              className={`font-bold ${
                                cmp.scoreDiff > 0
                                  ? 'text-jade-400'
                                  : cmp.scoreDiff < 0
                                  ? 'text-vermilion-400'
                                  : 'text-paper-400'
                              }`}
                            >
                              ({cmp.scoreDiff > 0 ? `+${Math.round(cmp.scoreDiff)} ▲` : cmp.scoreDiff < 0 ? `${Math.round(cmp.scoreDiff)} ▼` : '0'})
                            </span>
                          )}
                        </div>

                        {/* Danh sách các dòng chỉ số diff */}
                        <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] font-mono">
                          {cand.affixes.map((a, i) => (
                            <span key={i} className="text-paper-300">
                              {a.key}: +{formatPercent(a.value)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant={cmp.isBetter ? 'primary' : 'secondary'}
                      className="shrink-0 text-xs px-3 min-h-8"
                      onClick={() => {
                        onEquip(cand.uid, activeSlot ?? undefined)
                        onClose()
                      }}
                    >
                      {inspectedGear ? 'Thay Thế' : 'Trang Bị'}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
