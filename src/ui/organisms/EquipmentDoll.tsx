import { useState } from 'react'
import { RARITY_NAME } from '@/content/affixes'
import { GEAR_SLOTS, type GearSlot, SLOT_NAME } from '@/content/gear'
import {
  type GameState,
  gearScore,
  getActiveSetBonuses,
  getCombatStats,
  getGearDef,
  getGearName,
} from '@/engine'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { GearIcon } from '@/ui/atoms/GearIcon'
import { SlotSilhouette } from '@/ui/atoms/SlotSilhouette'
import { CharacterDisplay } from './CharacterDisplay'
import { GearInspectModal } from './GearInspectModal'

interface EquipmentDollProps {
  state: GameState
}

export function EquipmentDoll({ state }: EquipmentDollProps) {
  const equip = useGameStore((s) => s.equip)
  const unequip = useGameStore((s) => s.unequip)
  const autoEquipBest = useGameStore((s) => s.autoEquipBest)
  const unequipAll = useGameStore((s) => s.unequipAll)
  const salvage = useGameStore((s) => s.salvage)

  // State cho Modal Inspect chi tiết món đồ
  const [inspectSlot, setInspectSlot] = useState<GearSlot | null>(null)
  const [inspectGearUid, setInspectGearUid] = useState<string | null>(null)

  const byUid = new Map(state.gear.map((g) => [g.uid, g]))
  const combat = getCombatStats(state)
  const activeSets = getActiveSetBonuses(state)

  // Tính tổng điểm lực chiến của 12 ô trang bị đang mặc
  const totalGearScore = GEAR_SLOTS.reduce((sum, slot) => {
    const uid = state.equipped[slot]
    const g = uid ? byUid.get(uid) : undefined
    return sum + (g ? gearScore(g) : 0)
  }, 0)

  // Đếm số món trang bị đang mặc
  const equippedCount = GEAR_SLOTS.filter((s) => state.equipped[s] !== null).length

  // Danh sách các slot bên trái (Phòng thủ / Thân thể)
  const leftSlots: GearSlot[] = ['dau', 'ao', 'dai-lung', 'quan', 'giay']
  // Danh sách các slot bên phải (Trang sức / Linh bảo)
  const rightSlots: GearSlot[] = ['day-chuyen', 'nhan-1', 'nhan-2', 'bong-tai-1', 'bong-tai-2']

  const handleSlotClick = (slot: GearSlot) => {
    setInspectSlot(slot)
    setInspectGearUid(state.equipped[slot] ?? null)
  }

  const renderSlot = (slot: GearSlot) => {
    const uid = state.equipped[slot]
    const gear = uid ? byUid.get(uid) : undefined

    if (gear) {
      const def = getGearDef(gear)
      return (
        <button
          key={slot}
          type="button"
          onClick={() => handleSlotClick(slot)}
          title={`${SLOT_NAME[slot]}: ${getGearName(gear)} (${RARITY_NAME[gear.rarity]})`}
          className="group relative flex h-14 w-14 sm:h-16 sm:w-16 flex-col items-center justify-center rounded-xl transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        >
          <GearIcon
            slot={slot}
            glyph={def.glyph}
            rarity={gear.rarity}
            gearId={gear.defId}
            size="lg"
          />
          {/* Nhãn Tier nhỏ ở góc trên trái */}
          <span className="pointer-events-none absolute top-1 left-1.5 z-20 rounded bg-ink-950/80 px-1 font-mono text-[9px] font-bold text-gold-300">
            T{gear.tier}
          </span>
          {/* Tên slot nhỏ mờ dưới đáy */}
          <span className="pointer-events-none absolute -bottom-4 text-[10px] font-han text-paper-400 group-hover:text-gold-300">
            {SLOT_NAME[slot]}
          </span>
        </button>
      )
    }

    // Ô TRỐNG: Hiển thị Silhouette bóng mờ cổ phong
    return (
      <button
        key={slot}
        type="button"
        onClick={() => handleSlotClick(slot)}
        title={`Ô ${SLOT_NAME[slot]} đang trống - Bấm để mặc đồ`}
        className="group relative flex h-14 w-14 sm:h-16 sm:w-16 flex-col items-center justify-center rounded-xl border border-dashed border-paper-400/25 bg-ink-950/50 shadow-inner transition-all hover:border-gold-400/60 hover:bg-ink-900/70 active:scale-95 focus:outline-none"
      >
        <SlotSilhouette
          slot={slot}
          className="h-7 w-7 text-paper-400 opacity-40 transition-opacity group-hover:opacity-75 group-hover:text-gold-300"
        />
        {/* Tên slot mờ */}
        <span className="pointer-events-none absolute -bottom-4 text-[10px] font-han text-paper-400/80 group-hover:text-gold-300">
          {SLOT_NAME[slot]}
        </span>
        {/* Dấu cộng nhỏ báo hiệu có thể trang bị */}
        <span className="pointer-events-none absolute top-1 right-1.5 text-[9px] font-mono text-paper-400/60 group-hover:text-gold-400">
          +
        </span>
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* ================= PAPER DOLL EQUIPMENT CONTAINER ================= */}
      <div className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-b from-ink-950/95 via-ink-900/90 to-ink-950/95 p-4 sm:p-6 shadow-2xl">
        {/* Hoa văn nền thủy mặc cổ phong Kiếm Lai */}
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#e0bf4a_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Thanh tiêu đề & các nút thao tác nhanh Võ Lâm */}
        <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-paper-400/15 pb-3">
          <div>
            <h3 className="font-han text-base sm:text-lg font-bold text-gold-400 flex items-center gap-2">
              <span>🥋 Pháp bảo · Đạo Thân Trang Bị</span>
              <span className="rounded-full bg-gold-500/20 px-2 py-0.5 font-mono text-xs text-gold-300">
                {equippedCount}/12 Ô
              </span>
            </h3>
            <p className="text-[11px] text-paper-400 font-serif">
              Bấm vào từng vị trí để thay đổi hoặc gỡ trang bị theo phong cách hiệp khách
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              className="text-xs px-3 py-1.5 min-h-8 font-bold shadow-md shadow-vermilion-500/20"
              onClick={() => autoEquipBest()}
              title="Tự động mặc vào các món có lực chiến cao nhất trong túi"
            >
              ⚔️ Mặc Nhanh
            </Button>
            {equippedCount > 0 && (
              <Button
                variant="ghost"
                className="text-xs px-2.5 py-1.5 min-h-8 border border-paper-400/20 text-paper-300 hover:text-vermilion-400"
                onClick={() => unequipAll()}
                title="Gỡ toàn bộ trang bị cất lại vào túi đồ"
              >
                Gỡ Hết
              </Button>
            )}
          </div>
        </div>

        {/* ================= KHUNG PAPER DOLL 3 CỘT (VÕ LÂM KINH ĐIỂN) ================= */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex w-full max-w-lg items-center justify-between gap-2 sm:gap-6 py-2">
            {/* CỘT BÊN TRÁI: 5 Ô PHÒNG NGỰ */}
            <div className="flex flex-col gap-6 sm:gap-7 items-center">
              {leftSlots.map(renderSlot)}
            </div>

            {/* CỘT TRUNG TÂM: ĐẠO THÂN AVATAR & CHIẾN LỰC */}
            <div className="flex flex-1 flex-col items-center justify-center text-center px-2">
              {/* Hình Nhân Vật Trung Tâm có Vòng Bát Quái Tu Vi */}
              <div className="relative mb-3 flex items-center justify-center">
                <CharacterDisplay
                  realmIndex={state.realmIndex}
                  progress={state.qi / Math.max(1, 1000)}
                  ready={false}
                  avatarId={state.settings.avatarId}
                  compact={true}
                />
              </div>

              {/* Huy hiệu Tổng Lực Chiến Pháp Bảo */}
              <div className="rounded-xl border border-gold-500/40 bg-ink-950/90 px-3.5 py-1.5 shadow-lg shadow-gold-500/10">
                <span className="block text-[10px] uppercase font-mono tracking-widest text-paper-400">
                  Pháp Bảo Khí Số
                </span>
                <span className="font-han text-base sm:text-lg font-black text-gold-300 tabular-nums">
                  ⚡ {formatNumber(Math.round(totalGearScore))}
                </span>
              </div>

              {/* Tóm tắt chỉ số chiến đấu */}
              <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-paper-300">
                <span>Công: <strong className="text-vermilion-400">{formatNumber(combat.atk)}</strong></span>
                <span>Thủ: <strong className="text-qi-400">{formatNumber(combat.def)}</strong></span>
                <span>HP: <strong className="text-jade-400">{formatNumber(combat.hp)}</strong></span>
                <span>Tốc: <strong className="text-gold-400">{(1000 / combat.attackMs).toFixed(2)}/s</strong></span>
              </div>
            </div>

            {/* CỘT BÊN PHẢI: 5 Ô TRANG SỨC */}
            <div className="flex flex-col gap-6 sm:gap-7 items-center">
              {rightSlots.map(renderSlot)}
            </div>
          </div>

          {/* HÀNG DƯỚI: 2 Ô VŨ KHÍ & PHÙ LỤC */}
          <div className="mt-7 flex w-full max-w-xs items-center justify-around border-t border-paper-400/15 pt-5">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] font-mono text-gold-400 uppercase tracking-wider">Tay Thuận</span>
              {renderSlot('vu-khi')}
            </div>
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] font-mono text-qi-400 uppercase tracking-wider">Pháp Bảo</span>
              {renderSlot('phu-luc')}
            </div>
          </div>
        </div>

        {/* Hiệu ứng bộ (Set Bonus) nếu đang kích hoạt */}
        {activeSets.length > 0 && (
          <div className="relative z-10 mt-6 rounded-xl border border-gold-500/30 bg-ink-950/80 p-3 shadow-md">
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
                  className="rounded-lg border border-gold-500/20 bg-ink-900/60 p-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-han font-bold text-gold-400">{s.setName}</span>
                    <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[10px] font-mono text-gold-300">
                      Mốc {s.threshold} món
                    </span>
                  </div>
                  <p className="mt-1 text-paper-300 text-[11px] font-serif">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL INSPECT & THAY THẾ MÓN ĐỒ ================= */}
      {inspectSlot && (
        <GearInspectModal
          open={Boolean(inspectSlot)}
          onClose={() => {
            setInspectSlot(null)
            setInspectGearUid(null)
          }}
          slot={inspectSlot}
          gearUid={inspectGearUid}
          state={state}
          onEquip={(uid, target) => equip(uid, target)}
          onUnequip={(s) => unequip(s)}
          onSalvage={(uid) => salvage([uid])}
        />
      )}
    </div>
  )
}
