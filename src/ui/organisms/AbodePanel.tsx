import { type FC, useMemo } from 'react'
import { ABODE_FACILITIES } from '@/content/abode'
import {
  canUpgradeAbodeTier,
  canUpgradeFacility,
  getAbodeTierDef,
  getFacilityCost,
  getHerbGardenIntervalMs,
  getNextAbodeTierDef,
} from '@/engine/abode'
import { ITEM_BY_ID } from '@/content/items'
import { formatDurationMs, formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { ItemIcon } from '@/ui/atoms/ItemIcon'

export const AbodePanel: FC = () => {
  const state = useGameStore((s) => s.state)
  const upgradeTier = useGameStore((s) => s.upgradeAbodeTier)
  const upgradeFacility = useGameStore((s) => s.upgradeFacility)
  const harvestAbode = useGameStore((s) => s.harvestAbode)

  const abode = state.abode
  const tierDef = useMemo(() => getAbodeTierDef(state), [state])
  const nextTierDef = useMemo(() => getNextAbodeTierDef(state), [state])
  const tierUpgradeCheck = useMemo(() => canUpgradeAbodeTier(state), [state])

  const storedHerbs = abode.storedHerbs ?? {}
  const storedEntries = Object.entries(storedHerbs).filter(([, count]) => count > 0)
  const totalStoredCount = storedEntries.reduce((sum, [, c]) => sum + c, 0)

  const herbLvl = abode.facilities.herbGarden?.level ?? 0
  const puppetLvl = abode.facilities.paperPuppets?.level ?? 0
  const arrayLvl = abode.facilities.gatheringArray?.level ?? 0
  const springLvl = abode.facilities.spiritSpring?.level ?? 0
  const beastLvl = abode.facilities.spiritBeast?.level ?? 0

  const herbIntervalMs = getHerbGardenIntervalMs(herbLvl)

  // Puppet helper info
  const puppetTitle =
    puppetLvl >= 3
      ? 'Chỉ Nhân Cánh Tay'
      : puppetLvl >= 2
        ? 'Chỉ Nhân Bàn Tay'
        : puppetLvl >= 1
          ? 'Chỉ Nhân Ngón Tay'
          : 'Chưa bồi dưỡng'

  return (
    <div className="space-y-4 min-w-0 w-full">
      {/* 1. Header Khung Cảnh Động Phủ & Sơn Đầu */}
      <section className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-gold-500/30 bg-gradient-to-b from-ink-900/90 via-ink-950/90 to-ink-950 p-3.5 sm:p-5 shadow-xl backdrop-blur-md min-w-0">
        {/* Họa tiết hoa văn góc cổ phong */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gold-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-xl" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="rounded-full bg-gold-500/20 px-2 py-0.5 font-han text-[11px] sm:text-xs font-bold text-gold-300 border border-gold-500/30">
                Bậc {tierDef.tier} · {tierDef.subTitle}
              </span>
              <span className="text-[11px] sm:text-xs text-paper-400">
                Giới hạn công trình: Cấp {tierDef.maxFacilityLevel}
              </span>
            </div>
            <h2 className="font-han text-xl sm:text-2xl md:text-3xl font-black text-paper-100 tracking-wide drop-shadow-sm flex items-center gap-2">
              <span>{tierDef.name}</span>
            </h2>
            <p className="font-serif text-xs sm:text-sm text-paper-300 leading-relaxed italic max-w-xl">
              &ldquo;{tierDef.lore}&rdquo;
            </p>
          </div>

          {/* Nút Thăng Cấp Động Phủ */}
          <div className="w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
            {nextTierDef ? (
              <Button
                variant={tierUpgradeCheck.can ? 'primary' : 'ghost'}
                onClick={upgradeTier}
                disabled={!tierUpgradeCheck.can}
                className="w-full sm:w-auto text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-md justify-center"
                title={tierUpgradeCheck.reason}
              >
                <span className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Thăng Cấp: {nextTierDef.name}</span>
                  <span className="font-mono text-gold-300">({formatNumber(nextTierDef.costStones)} ◆)</span>
                </span>
              </Button>
            ) : (
              <span className="inline-block text-center w-full sm:w-auto rounded-lg border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 font-serif text-xs font-bold text-gold-300">
                Động Phủ Tối Thượng
              </span>
            )}
            {nextTierDef && !tierUpgradeCheck.can && (
              <div className="mt-1 text-left sm:text-right text-[11px] text-vermilion-400/90 font-serif">
                {tierUpgradeCheck.reason}
              </div>
            )}
          </div>
        </div>

        {/* Thống kê nhanh hiệu suất Động Phủ (4 Ô Gọn Gàng) */}
        <div className="mt-3.5 grid grid-cols-2 gap-1.5 sm:gap-2 sm:grid-cols-4 border-t border-paper-400/15 pt-3">
          <div className="rounded-lg bg-ink-950/60 p-2 sm:p-2.5 border border-paper-400/10 min-w-0">
            <span className="text-[10px] text-paper-400 block font-serif truncate">Tụ Linh Trận</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 truncate block">
              +{arrayLvl * 5}% Linh khí/s
            </span>
            {puppetLvl >= 3 && <span className="text-[10px] text-gold-300 block truncate">+10% Chỉ Nhân</span>}
          </div>

          <div className="rounded-lg bg-ink-950/60 p-2 sm:p-2.5 border border-paper-400/10 min-w-0">
            <span className="text-[10px] text-paper-400 block font-serif truncate">Linh Tuyền Trì</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-gold-300 truncate block">
              +{springLvl * 5}% Linh thạch/s
            </span>
            {puppetLvl >= 2 && <span className="text-[10px] text-gold-300 block truncate">+10% Chỉ Nhân</span>}
          </div>

          <div className="rounded-lg bg-ink-950/60 p-2 sm:p-2.5 border border-paper-400/10 min-w-0">
            <span className="text-[10px] text-paper-400 block font-serif truncate">Tiểu Chỉ Nhân</span>
            <span className="font-serif text-xs sm:text-sm font-bold text-amber-300 truncate block">
              {puppetTitle}
            </span>
            <span className="text-[10px] text-paper-400 block truncate">
              {puppetLvl >= 1 ? 'Tự thu hoạch' : 'Chưa kích hoạt'}
            </span>
          </div>

          <div className="rounded-lg bg-ink-950/60 p-2 sm:p-2.5 border border-paper-400/10 min-w-0">
            <span className="text-[10px] text-paper-400 block font-serif truncate">Ngũ Thải Oanh Vũ</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 truncate block">
              {beastLvl > 0 ? `+${beastLvl * 2}% Rương đỏ` : 'Chưa nuôi'}
            </span>
            <span className="text-[10px] text-paper-400 block truncate">
              {beastLvl > 0 ? `+${beastLvl * 3}% Kỳ ngộ` : 'Mở tại Lạc Phách Sơn'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Khu Vực Linh Điền Bách Thảo Đặc Sắc */}
      <section className="rounded-xl border border-paper-400/20 bg-ink-900/70 p-3 sm:p-4 space-y-2.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-400/15 pb-2.5 min-w-0">
          <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
            <span className="text-xl shrink-0 mt-0.5 sm:mt-0">🌱</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <h3 className="font-han text-sm sm:text-base font-bold text-paper-100">
                  Linh Điền Bách Thảo
                </h3>
                <span className="font-mono text-[11px] sm:text-xs text-jade-400">
                  (Cấp {herbLvl} · {formatDurationMs(herbIntervalMs)}/mẻ)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-paper-400 leading-snug mt-0.5">
                {puppetLvl >= 1
                  ? '✨ Tiểu Chỉ Nhân đang ngày đêm túc trực, tự động thu hoạch thảo dược vào túi đồ!'
                  : 'Đất linh kết tinh dược thảo, bấm gom dược liệu khi chín để luyện đan.'}
              </p>
            </div>
          </div>

          {/* Nút Gom Dược Liệu Thủ Công */}
          <div className="w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
            <Button
              variant={totalStoredCount > 0 ? 'primary' : 'ghost'}
              onClick={harvestAbode}
              disabled={totalStoredCount === 0}
              className="w-full sm:w-auto py-1.5 px-3 text-xs justify-center"
            >
              <span>Thu Hoạch ({totalStoredCount})</span>
            </Button>
          </div>
        </div>

        {/* Danh sách Dược liệu đang chờ gom trong kho Động Phủ */}
        {storedEntries.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {storedEntries.map(([id, count]) => {
              const herb = ITEM_BY_ID[id]
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 rounded-lg border border-jade-500/40 bg-jade-950/30 px-2 py-1 text-xs"
                >
                  {herb ? (
                    <ItemIcon id={herb.id} kind={herb.kind} tier={herb.tier} size="sm" />
                  ) : (
                    <span className="text-sm">🌿</span>
                  )}
                  <span className="font-serif text-paper-200 text-xs">{herb?.name ?? id}</span>
                  <span className="font-mono font-bold text-jade-300 text-xs">+{count}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-[11px] sm:text-xs text-paper-500 italic py-1 flex items-center gap-1.5">
            <span className="shrink-0">⏳</span>
            <span className="leading-snug">
              {herbLvl > 0
                ? puppetLvl >= 1
                  ? 'Tiểu Chỉ Nhân đã gom sạch vào túi đồ. Linh điền đang ươm đợt thảo dược mới...'
                  : 'Linh điền đang tụ khí kết tinh thảo dược, hãy kiên nhẫn đợi thêm chút...'
                : 'Hãy nâng cấp Linh Điền để bắt đầu ươm mầm thảo dược quý!'}
            </span>
          </div>
        )}
      </section>

      {/* 3. Lưới Các Công Trình Động Phủ (Facilities) */}
      <section className="space-y-2.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 border-b border-paper-400/10 pb-1.5">
          <h3 className="font-han text-sm sm:text-base font-bold text-paper-200">
            Kiến Trúc Động Phủ Tiên Gia
          </h3>
          <span className="text-[11px] sm:text-xs text-paper-400">
            Nâng cấp gia tăng căn cơ & tự động hóa tu hành
          </span>
        </div>

        <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 min-w-0">
          {ABODE_FACILITIES.map((facility) => {
            const currentLvl = abode.facilities[facility.id]?.level ?? 0
            const check = canUpgradeFacility(state, facility.id)
            const cost = getFacilityCost(state, facility.id)
            const isLocked = tierDef.tier < facility.unlockTier

            return (
              <div
                key={facility.id}
                className={`relative flex flex-col justify-between rounded-xl border p-3 sm:p-3.5 min-w-0 transition-all ${
                  isLocked
                    ? 'border-paper-400/10 bg-ink-950/40 opacity-60'
                    : 'border-paper-400/20 bg-ink-900/80 hover:border-gold-500/40 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0">{facility.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-han text-sm sm:text-base font-bold text-paper-100">
                            {facility.name}
                          </h4>
                          <span className="font-han text-xs text-gold-400/80 hidden sm:inline">
                            {facility.hanName}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] sm:text-xs font-semibold text-gold-300">
                          {isLocked ? '🔒 Chưa Mở Khóa' : `Cấp ${currentLvl} / ${tierDef.maxFacilityLevel}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-paper-300 leading-snug mb-1 font-serif">
                    {facility.description}
                  </p>
                  <p className="text-[11px] text-paper-500 italic mb-2 leading-tight">
                    &ldquo;{facility.lore}&rdquo;
                  </p>
                </div>

                {/* Footer Nút Nâng Cấp */}
                <div className="border-t border-paper-400/10 pt-2 mt-auto flex items-center justify-between gap-2">
                  <div className="text-xs font-mono">
                    {!isLocked && currentLvl < tierDef.maxFacilityLevel ? (
                      <span className={state.stones >= cost ? 'text-gold-300 font-semibold' : 'text-paper-500'}>
                        {formatNumber(cost)} ◆
                      </span>
                    ) : null}
                  </div>

                  <Button
                    variant={check.can ? 'secondary' : 'ghost'}
                    onClick={() => upgradeFacility(facility.id)}
                    disabled={!check.can}
                    className="text-xs py-1 px-3 min-h-8"
                    title={check.reason}
                  >
                    {isLocked ? (
                      <span>Khóa</span>
                    ) : currentLvl >= tierDef.maxFacilityLevel ? (
                      <span>Cực Hạn</span>
                    ) : (
                      <span>Thăng Cấp</span>
                    )}
                  </Button>
                </div>

                {/* Gợi ý lỗi khi không nâng cấp được */}
                {!isLocked && !check.can && check.reason && (
                  <div className="text-[10px] text-vermilion-400/90 text-right mt-1 font-serif">
                    {check.reason}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
