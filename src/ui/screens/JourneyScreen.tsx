import { ITEM_BY_ID } from '@/content/items'
import { REALMS } from '@/content/realms'
import { type Difficulty, DIFFICULTY_NAMES, REGIONS } from '@/content/regions'
import { getCombatStats, getGearDef, isDifficultyAvailable, isRegionUnlocked } from '@/engine'
import { formatNumber, formatPercent } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
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

  const j = state.journey
  const stats = getCombatStats(state)
  const chests = j.chests.normal + j.chests.red
  const recentGear = state.gear.slice(-4).reverse()

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h2 className="font-han text-2xl text-gold-400">Hành tẩu</h2>
        <JourneyStage state={state} />
        <StatRow
          stats={[
            { label: 'Khí huyết', value: formatNumber(stats.hp) },
            { label: 'Công', value: formatNumber(stats.atk), hint: `Bạo kích ${formatPercent(stats.crit)} · ×${stats.critMult.toFixed(2)}` },
            { label: 'Thủ', value: formatNumber(stats.def) },
            { label: 'Tốc đánh', value: `${(1000 / stats.attackMs).toFixed(2)}/s`, hint: stats.lifesteal > 0 ? `Hấp huyết ${formatPercent(stats.lifesteal)}` : undefined },
          ]}
        />
      </header>

      <section className="flex flex-wrap items-center gap-3 rounded-lg border border-gold-500/20 bg-ink-800/70 p-4">
        <div className="flex-1">
          <p className="font-han text-lg text-paper-100">
            Rương <span className="text-paper-400 tabular-nums">· {j.chests.normal} thường</span>
            <span className="text-vermilion-400 tabular-nums"> · {j.chests.red} đỏ</span>
          </p>
          <p className="text-xs text-paper-400">Quái rơi rương, boss rơi rương đỏ. Tụ Bảo Quyết tầng 5 tự mở rương thường, tầng 10 mở cả rương đỏ.</p>
        </div>
        <div className="flex gap-2">
          <Button disabled={j.chests.normal === 0} onClick={() => openChests('normal', 1)}>Mở 1</Button>
          <Button variant="primary" disabled={j.chests.red === 0} onClick={() => openChests('red', 1)} className={j.chests.red > 0 ? 'animate-pulse' : ''}>
            Mở rương đỏ
          </Button>
          <Button disabled={chests === 0} onClick={() => { if (j.chests.red > 0) openChests('red', j.chests.red); if (j.chests.normal > 0) openChests('normal', j.chests.normal) }}>
            Mở hết
          </Button>
        </div>
      </section>

      <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md border border-paper-400/15 bg-ink-800/60 px-4 py-2">
        <span>
          <span className="block text-paper-100">Tự lượng sức</span>
          <span className="block text-xs text-paper-400">Quét sạch không chết thì tiến lên vùng/độ khó kế; gục 3 lần liên tiếp thì lui xuống.</span>
        </span>
        <input type="checkbox" className="h-5 w-5 accent-gold-500" checked={j.autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} />
      </label>

      <section className="space-y-2">
        <h3 className="font-han text-lg text-paper-100">Vùng</h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {REGIONS.map((r) => {
            const unlocked = isRegionUnlocked(state, r)
            const cleared = j.cleared[r.id]
            const current = j.regionId === r.id
            return (
              <li key={r.id} className={`flex flex-col gap-2 rounded-lg border p-4 ${current ? 'border-gold-500/40 bg-ink-800/80' : unlocked ? 'border-paper-400/15 bg-ink-800/60' : 'border-paper-400/5 bg-ink-900/40 opacity-70'}`}>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-han text-lg text-paper-100">{r.name}</h4>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px]" style={{ background: r.palette.accent + '33', color: r.palette.accent }}>
                    Bậc {r.tier}
                  </span>
                </div>
                <p className="text-xs text-paper-400">{r.description}</p>
                <p className="text-sm text-paper-300">
                  Boss: <span className="text-vermilion-400">{r.boss.name}</span>
                  {cleared !== undefined && <span className="text-jade-400"> · đã quét {DIFFICULTY_NAMES[cleared]}</span>}
                </p>
                <p className="text-xs text-jade-400">
                  Rơi: {r.loot.map((l) => ITEM_BY_ID[l.itemId].name).join(', ')}
                  {r.namedGear && <span className="text-gold-400"> · {getGearDef({ uid: '', defId: r.namedGear.gearId, rarity: 'pham', tier: 1, affixes: [] }).name} (boss)</span>}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  {!unlocked ? (
                    <span className="text-xs text-vermilion-400">Cần {REALMS[r.minRealmIndex].name}</span>
                  ) : (
                    DIFFS.map((d) => {
                      const available = isDifficultyAvailable(state, r.id, d)
                      const active = current && j.difficulty === d
                      return (
                        <Button
                          key={d}
                          variant={active ? 'primary' : 'secondary'}
                          disabled={!available || active}
                          className="min-h-9 px-3 text-sm"
                          onClick={() => startRegion(r.id, d)}
                          title={available ? `×${3 ** d} sức quái` : 'Quét sạch độ khó trước đã'}
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

      {recentGear.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-han text-lg text-paper-100">Mới nhặt</h3>
          <ul className="grid gap-2 md:grid-cols-2">
            {recentGear.map((g) => {
              const wornUid = state.equipped[getGearDef(g).slot]
              const worn = wornUid ? state.gear.find((x) => x.uid === wornUid) ?? null : null
              return <GearCard key={g.uid} gear={g} worn={worn} equipped={wornUid === g.uid} onEquip={equip} onSalvage={(uid) => salvage([uid])} dense />
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
