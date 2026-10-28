import { useState } from 'react'
import { getSlotsForType } from '@/content/gear'
import { ITEM_BY_ID } from '@/content/items'
import { REALMS } from '@/content/realms'
import { type Difficulty, DIFFICULTY_NAMES, REGIONS } from '@/content/regions'
import { WORLDS, WORLD_BY_ID, type WorldId } from '@/content/worlds'
import { getCombatStats, getGearDef, isDifficultyAvailable, isRegionUnlocked } from '@/engine'
import { formatNumber, formatPercent } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { ChestIcon } from '@/ui/atoms/ChestIcon'
import { ItemIcon } from '@/ui/atoms/ItemIcon'
import { StatRow } from '@/ui/molecules/StatRow'
import { GearCard } from '@/ui/organisms/GearCard'
import { JourneyStage } from '@/ui/organisms/JourneyStage'

const DIFFS: Difficulty[] = [0, 1, 2, 3]

export function JourneyScreen() {
  const state = useGameStore((s) => s.state)
  const startRegion = useGameStore((s) => s.startRegion)
  const setAutoAdvance = useGameStore((s) => s.setAutoAdvance)
  const openChests = useGameStore((s) => s.openChests)
  const equip = useGameStore((s) => s.equip)
  const salvage = useGameStore((s) => s.salvage)
  const setCharacterModalOpen = useGameStore((s) => s.setCharacterModalOpen)

  const j = state.journey
  const stats = getCombatStats(state)
  const chests = j.chests.normal + j.chests.red
  const recentGear = state.gear.slice(-4).reverse()
  const [selectedWorld, setSelectedWorld] = useState<WorldId | 'all'>('all')

  const displayedRegions =
    selectedWorld === 'all' ? REGIONS : REGIONS.filter((r) => r.worldId === selectedWorld)

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-han text-2xl text-gold-400">Hành tẩu</h2>
          <button
            type="button"
            onClick={() => setCharacterModalOpen(true)}
            className="text-xs text-gold-400 hover:text-gold-300 hover:underline"
          >
            Chi tiết chỉ số ›
          </button>
        </div>
        <JourneyStage state={state} />
        <StatRow
          stats={[
            { label: 'Khí huyết', value: formatNumber(stats.hp) },
            {
              label: 'Công',
              value: formatNumber(stats.atk),
              hint: `Bạo kích ${formatPercent(stats.crit)} · ×${stats.critMult.toFixed(2)}`,
            },
            { label: 'Thủ', value: formatNumber(stats.def) },
            {
              label: 'Tốc đánh',
              value: `${(1000 / stats.attackMs).toFixed(2)}/s`,
              hint: stats.lifesteal > 0 ? `Hấp huyết ${formatPercent(stats.lifesteal)}` : undefined,
            },
          ]}
        />
      </header>

      {/* ================= KHU VỰC HÒM RƯƠNG CƠ DUYÊN ================= */}
      <section className="flex flex-wrap items-center gap-4 rounded-lg border border-gold-500/25 bg-gradient-to-r from-ink-900/90 via-ink-950/95 to-ink-900/90 p-4 shadow-ink">
        <div className="flex items-center gap-3">
          <ChestIcon kind="normal" count={j.chests.normal} size="md" animated />
          <ChestIcon kind="red" count={j.chests.red} size="md" animated />
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="font-han text-lg text-paper-100">
            Kho Rương Cơ Duyên{' '}
            <span className="text-paper-400 text-sm font-mono font-normal">
              ({j.chests.normal} thường,
            </span>
            <span className="text-vermilion-400 text-sm font-mono font-bold"> {j.chests.red} đỏ)</span>
          </p>
          <p className="text-xs text-paper-400">
            Quái rơi rương thường, boss rơi rương đỏ. Tụ Bảo Quyết tầng 5 tự mở rương thường, tầng 10 tự mở cả rương đỏ.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled={j.chests.normal === 0} onClick={() => openChests('normal', 1)}>
            Mở 1
          </Button>
          <Button
            variant="primary"
            disabled={j.chests.red === 0}
            onClick={() => openChests('red', 1)}
            className={j.chests.red > 0 ? 'animate-pulse shadow-[0_0_12px_#ef4444]' : ''}
          >
            Mở rương đỏ
          </Button>
          <Button
            disabled={chests === 0}
            onClick={() => {
              if (j.chests.red > 0) openChests('red', j.chests.red)
              if (j.chests.normal > 0) openChests('normal', j.chests.normal)
            }}
          >
            Mở hết ({chests})
          </Button>
        </div>
      </section>

      {/* Tùy chọn Tự lượng sức */}
      <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md border border-paper-400/15 bg-ink-800/60 px-4 py-2">
        <span>
          <span className="block text-paper-100 font-medium">Tự lượng sức</span>
          <span className="block text-xs text-paper-400">
            Quét sạch không chết thì tiến lên vùng/độ khó kế; gục 3 lần liên tiếp thì lui xuống.
          </span>
        </span>
        <input
          type="checkbox"
          className="h-5 w-5 accent-gold-500"
          checked={j.autoAdvance}
          onChange={(e) => setAutoAdvance(e.target.checked)}
        />
      </label>

      {/* ================= BẢN ĐỒ 5 TÒA THIÊN HẠ KIẾM LAI ================= */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-han text-xl text-paper-100 flex items-center gap-2">
              <span>Bản Đồ Thiên Hạ</span>
              <span className="text-xs text-gold-400 font-serif">· 5 Tòa Thiên Hạ & Biên Ải</span>
            </h3>
            <p className="text-xs text-paper-400">Khám phá các cõi giới, đối đầu đại yêu và các thế lực chư tử bách gia</p>
          </div>
          <span className="text-xs text-paper-400">Chọn vùng & độ khó để bắt đầu hành tẩu</span>
        </div>

        {/* Thanh chuyển đổi Thiên Hạ */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-paper-400/15 pb-2">
          <button
            type="button"
            onClick={() => setSelectedWorld('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedWorld === 'all'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
                : 'bg-ink-900/60 text-paper-400 hover:text-paper-200 border border-paper-400/10'
            }`}
          >
            Tất cả vùng ({REGIONS.length})
          </button>
          {WORLDS.map((w) => {
            const active = selectedWorld === w.id
            const count = REGIONS.filter((r) => r.worldId === w.id).length
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWorld(w.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'border shadow-md'
                    : 'bg-ink-900/60 text-paper-400 hover:text-paper-200 border border-paper-400/10'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: w.accentColor + '22',
                        borderColor: w.accentColor,
                        color: w.accentColor,
                      }
                    : undefined
                }
              >
                <span className="font-han font-bold">{w.glyph}</span>
                <span>{w.name}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Banner giới thiệu Thiên Hạ khi chọn cụ thể */}
        {selectedWorld !== 'all' && (
          <div
            className="relative overflow-hidden rounded-xl border p-4 shadow-ink"
            style={{
              borderColor: WORLD_BY_ID[selectedWorld].accentColor + '44',
              background: `linear-gradient(135deg, ${WORLD_BY_ID[selectedWorld].accentColor}15 0%, rgba(10,10,14,0.95) 100%)`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-han font-bold text-sm border"
                    style={{
                      borderColor: WORLD_BY_ID[selectedWorld].accentColor,
                      color: WORLD_BY_ID[selectedWorld].accentColor,
                      backgroundColor: WORLD_BY_ID[selectedWorld].accentColor + '22',
                    }}
                  >
                    {WORLD_BY_ID[selectedWorld].glyph}
                  </span>
                  <h4 className="font-han text-lg font-bold text-paper-100">
                    {WORLD_BY_ID[selectedWorld].name}
                  </h4>
                  <span className="text-xs text-paper-300 font-serif">
                    · {WORLD_BY_ID[selectedWorld].title}
                  </span>
                </div>
                <p className="mt-1 text-xs text-paper-300 max-w-2xl leading-relaxed">
                  {WORLD_BY_ID[selectedWorld].description}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-paper-400">
                  <span>
                    Chúa tể cai quản:{' '}
                    <strong className="text-paper-200 font-medium">{WORLD_BY_ID[selectedWorld].ruler}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Thế lực chủ đạo:{' '}
                    <strong className="text-paper-200 font-medium">{WORLD_BY_ID[selectedWorld].dominantFaction}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <ul className="grid gap-4 md:grid-cols-2">
          {displayedRegions.map((r) => {
            const unlocked = isRegionUnlocked(state, r)
            const cleared = j.cleared[r.id]
            const current = j.regionId === r.id
            const namedGearDef = r.namedGear
              ? getGearDef({ uid: '', defId: r.namedGear.gearId, rarity: 'pham', tier: 1, affixes: [] })
              : null

            return (
              <li
                key={r.id}
                className={`group relative overflow-hidden flex flex-col justify-between rounded-xl border transition-all duration-300 p-5 ${
                  current
                    ? 'border-gold-400 ring-2 ring-gold-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                    : unlocked
                      ? 'border-paper-400/20 bg-ink-900/80 hover:border-gold-500/50'
                      : 'border-paper-400/10 bg-ink-950/60 opacity-60'
                }`}
              >
                {/* Ảnh tranh phong cảnh nền của Vùng Đất */}
                {r.backdropUrl && (
                  <div
                    className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-35"
                    style={{ backgroundImage: `url(${r.backdropUrl})` }}
                    aria-hidden
                  />
                )}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-900/60"
                  aria-hidden
                />

                {/* Nội dung trên thẻ */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-han text-xl font-bold text-paper-100">{r.name}</h4>
                        {current && (
                          <span className="rounded bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-gold-400 border border-gold-500/40 animate-pulse">
                            Đang Hành Tẩu
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-paper-300 line-clamp-2">{r.description}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold border"
                      style={{
                        background: r.palette.accent + '22',
                        color: r.palette.accent,
                        borderColor: r.palette.accent + '55',
                      }}
                    >
                      Bậc {r.tier}
                    </span>
                  </div>

                  {/* Thông tin Boss & Thành Tích Quét Sạch */}
                  <div className="rounded-md border border-paper-400/10 bg-ink-950/70 p-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-paper-300">
                        Thủ lĩnh: <strong className="text-vermilion-400 font-han font-normal text-sm">{r.boss.name}</strong>
                      </span>
                      {cleared !== undefined && (
                        <span className="text-jade-400 text-[11px] font-medium">
                          ✓ Đã quét: {DIFFICULTY_NAMES[cleared]}
                        </span>
                      )}
                    </div>
                    {namedGearDef && (
                      <p className="mt-1 text-[11px] text-gold-400 font-serif">
                        ✨ Báu vật Boss: <span className="font-medium text-paper-100">{namedGearDef.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Dược liệu & Chiến lợi phẩm rơi */}
                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-[11px] text-paper-400 font-serif block">Chiến lợi phẩm:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {r.loot.map((l) => {
                        const item = ITEM_BY_ID[l.itemId]
                        if (!item) return null
                        return (
                          <div
                            key={l.itemId}
                            className="flex items-center gap-1 rounded bg-ink-900/90 border border-paper-400/15 px-2 py-0.5 text-[11px] text-paper-200"
                            title={`${item.name} (Tỉ lệ ${(l.chance * 100).toFixed(0)}%)`}
                          >
                            <ItemIcon id={item.id} kind={item.kind} tier={item.tier} size="sm" />
                            <span>{item.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Các nút chọn độ khó */}
                <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2 border-t border-paper-400/10 pt-3">
                  {!unlocked ? (
                    <div className="flex items-center gap-1.5 text-xs text-vermilion-400 font-medium">
                      <span>🔒</span>
                      <span>Yêu cầu cảnh giới: {REALMS[r.minRealmIndex].name}</span>
                    </div>
                  ) : (
                    DIFFS.map((d) => {
                      const available = isDifficultyAvailable(state, r.id, d)
                      const active = current && j.difficulty === d
                      return (
                        <Button
                          key={d}
                          variant={active ? 'primary' : 'secondary'}
                          disabled={!available || active}
                          className={`min-h-9 px-3 text-xs sm:text-sm ${
                            active ? 'ring-2 ring-gold-400/50 shadow-md' : ''
                          }`}
                          onClick={() => startRegion(r.id, d)}
                          title={available ? `Độ khó ${DIFFICULTY_NAMES[d]} (Quái ×${3 ** d})` : 'Quét sạch độ khó trước để mở'}
                        >
                          {DIFFICULTY_NAMES[d]}
                        </Button>
                      )
                    })
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Trang bị mới nhặt */}
      {recentGear.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-han text-lg text-paper-100">Mới nhặt</h3>
          <ul className="grid gap-2 md:grid-cols-2">
            {recentGear.map((g) => {
              const targetSlots = getSlotsForType(getGearDef(g).slot)
              const wornUid = targetSlots.map((s) => state.equipped[s]).find(Boolean) ?? null
              const worn = wornUid ? state.gear.find((x) => x.uid === wornUid) ?? null : null
              return (
                <GearCard
                  key={g.uid}
                  gear={g}
                  worn={worn}
                  equipped={wornUid === g.uid}
                  onEquip={equip}
                  onSalvage={(uid) => salvage([uid])}
                  dense
                />
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
