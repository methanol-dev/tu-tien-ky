import { useState } from 'react'
import { RARITY_NAME } from '@/content/affixes'
import { AVATARS, AVATAR_BY_ID } from '@/content/avatars'
import { CLASSES, CLASS_BY_ID } from '@/content/classes'
import { GEAR_SLOTS, SLOT_NAME } from '@/content/gear'
import {
  MARTIAL_STAGES,
  getMartialPunches,
  getMartialRealm,
  getNextMartialRealm,
} from '@/content/martialRealms'
import { baselineStats } from '@/content/regions'
import { TECHNIQUE_BY_ID } from '@/content/techniques'
import {
  type GameState,
  getActiveBuffs,
  getActiveSetBonuses,
  getAffixTotals,
  getBreakthroughChance,
  getCombatStats,
  getLifespanDays,
  getModifiers,
  getNextRealm,
  getQiRate,
  getRealm,
  getStoneRate,
  isLifespanExceeded,
  getGearDef,
} from '@/engine'
import { describeAffix, RARITY_BG, RARITY_CLASS } from '@/lib/gearUi'
import { describeTechniqueEffect } from '@/lib/describe'
import { formatAge, formatDurationMs, formatNumber, formatPercent, formatRate } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'
import { AvatarModal } from './AvatarModal'

interface CharacterModalProps {
  open: boolean
  onClose: () => void
  state: GameState
}

type Tab = 'combat' | 'cultivation' | 'martial' | 'gear' | 'class'

export function CharacterModal({ open, onClose, state }: CharacterModalProps) {
  const [tab, setTab] = useState<Tab>('combat')
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const setAvatar = useGameStore((s) => s.setAvatar)
  const changeClass = useGameStore((s) => s.changeClass)

  if (!open) return null

  const realm = getRealm(state)
  const nextRealm = getNextRealm(state)
  const combat = getCombatStats(state)
  const baseline = baselineStats(state.realmIndex)
  const affixes = getAffixTotals(state)
  const mods = getModifiers(state)
  const buffs = getActiveBuffs(state)
  const expired = isLifespanExceeded(state)
  const lifespanYears = Math.floor(getLifespanDays(state) / 360)

  const punches = getMartialPunches(state.stats)
  const martial = getMartialRealm(punches)
  const nextMartial = getNextMartialRealm(punches)

  const byUid = new Map(state.gear.map((g) => [g.uid, g]))
  const activeSets = getActiveSetBonuses(state)
  const learnedTechniques = Object.entries(state.techniques)
    .filter(([, lvl]) => lvl > 0)
    .map(([id, lvl]) => ({ def: TECHNIQUE_BY_ID[id], lvl }))
    .filter((t) => t.def !== undefined)

  const avatar = AVATAR_BY_ID[state.settings.avatarId ?? 'tran-binh-an'] ?? AVATARS[0]

  return (
    <>
      <Modal
        open={open}
        title="Đạo Thân · Chỉ Số Nhân Vật"
        onClose={onClose}
        maxWidth="max-w-2xl"
        footer={
          <Button variant="primary" onClick={onClose} autoFocus>
            Đóng
          </Button>
        }
      >
        {/* Căn cốt tổng quan */}
        <div className="rounded-lg border border-gold-500/20 bg-ink-900/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                title="Bấm để đổi diện mạo"
                className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-gold-500/50 shadow-ink transition-transform hover:scale-105 hover:border-gold-400"
              >
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="h-full w-full object-cover object-top shadow-ink"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="font-han text-[10px] text-gold-300">Đổi</span>
                </div>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-han text-xl font-bold text-paper-100">{avatar.name}</span>
                  <span className="font-han text-sm text-gold-400">({realm.name})</span>
                  {realm.stageLabel && (
                    <span className="rounded bg-gold-500/10 px-2 py-0.5 text-xs text-gold-400 border border-gold-500/30">
                      {realm.stageLabel}
                    </span>
                  )}
                </div>
              {realm.kiemLaiRealm && (
                <p className="mt-1 text-xs text-gold-300 font-serif">
                  📜 Luyện Khí Sĩ: <span className="text-paper-100 font-medium">{realm.kiemLaiRealm}</span>
                </p>
              )}
              <p className="mt-0.5 text-xs text-vermilion-300 font-serif">
                👊 Võ Đạo: <span className="text-paper-100 font-medium">{martial.name}</span> ({punches} quyền)
              </p>
              {(() => {
                const currentClass = CLASS_BY_ID[state.classId] ?? CLASS_BY_ID['kiem-tu']
                return (
                  <p className="mt-0.5 text-xs font-serif" style={{ color: currentClass.accentColor }}>
                    🏮 Đạo Thống: <span className="text-paper-100 font-medium">{currentClass.name} · {currentClass.title}</span>
                  </p>
                )
              })()}
              <p className="mt-1 text-xs text-paper-400">
                Tuổi thọ:{' '}
                <span className={`tabular-nums ${expired ? 'text-vermilion-400' : 'text-paper-200'}`}>
                  {formatAge(state.ageDays)}
                </span>{' '}
                / <span className="tabular-nums text-paper-300">{lifespanYears} năm</span>
                {expired && <span className="ml-1 text-vermilion-400">(Đã tận)</span>}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-paper-400 space-y-0.5">
            <p>
              Luân hồi:{' '}
              <span className="font-han text-gold-400 tabular-nums">
                {state.legacy.lives} kiếp
              </span>
            </p>
            <p>
              Đạo Vận: <span className="text-jade-400 tabular-nums">{state.legacy.daoVan}</span>
            </p>
            <p>
              Linh thạch: <span className="text-paper-100 tabular-nums">{formatNumber(state.stones)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-paper-400/15 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setTab('combat')}
          className={`flex-1 border-b-2 py-2 text-center font-medium transition-colors ${
            tab === 'combat'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          ⚔️ Chiến Lực
        </button>
        <button
          type="button"
          onClick={() => setTab('cultivation')}
          className={`flex-1 border-b-2 py-2 text-center font-medium transition-colors ${
            tab === 'cultivation'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          🧘 Luyện Khí Sĩ (15 Cảnh)
        </button>
        <button
          type="button"
          onClick={() => setTab('martial')}
          className={`flex-1 border-b-2 py-2 text-center font-medium transition-colors ${
            tab === 'martial'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          👊 Võ Đạo (11 Cảnh)
        </button>
        <button
          type="button"
          onClick={() => setTab('gear')}
          className={`flex-1 border-b-2 py-2 text-center font-medium transition-colors ${
            tab === 'gear'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          🛡️ Pháp Bảo ({Object.values(state.equipped).filter(Boolean).length}/12)
        </button>
        <button
          type="button"
          onClick={() => setTab('class')}
          className={`flex-1 border-b-2 py-2 text-center font-medium transition-colors ${
            tab === 'class'
              ? 'border-gold-400 text-gold-400'
              : 'border-transparent text-paper-400 hover:text-paper-200'
          }`}
        >
          🏮 Đạo Thống (10 Phái)
        </button>
      </div>

      {/* Tab 1: Chiến lực */}
      {tab === 'combat' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Khí huyết (HP)</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {formatNumber(combat.hp)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc: {formatNumber(baseline.hp)} {affixes.hp > 0 && <span className="text-jade-400">(+{formatPercent(affixes.hp)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Công kích</span>
              <p className="font-han text-lg font-bold text-vermilion-400 tabular-nums">
                {formatNumber(combat.atk)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc: {formatNumber(baseline.atk)} {affixes.atk > 0 && <span className="text-jade-400">(+{formatPercent(affixes.atk)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Phòng ngự</span>
              <p className="font-han text-lg font-bold text-qi-400 tabular-nums">
                {formatNumber(combat.def)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc: {formatNumber(baseline.def)} {affixes.def > 0 && <span className="text-jade-400">(+{formatPercent(affixes.def)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tốc độ đánh</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                {(1000 / combat.attackMs).toFixed(2)}/s
              </p>
              <p className="text-[10px] text-paper-400">
                {combat.attackMs}ms/đòn {affixes.atkSpeed > 0 && <span className="text-jade-400">(+{formatPercent(affixes.atkSpeed)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tỉ lệ bạo kích</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {formatPercent(combat.crit)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc 5% {affixes.crit > 0 && <span className="text-jade-400">(+{formatPercent(affixes.crit)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Sát thương bạo</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                ×{combat.critMult.toFixed(2)}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc ×1.50 {affixes.critDmg > 0 && <span className="text-jade-400">(+{formatPercent(affixes.critDmg)})</span>}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Hấp huyết (Hút máu)</span>
              <p className="font-han text-lg font-bold text-jade-400 tabular-nums">
                {formatPercent(combat.lifesteal)}
              </p>
              <p className="text-[10px] text-paper-400">Hồi HP theo sát thương</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Cơ duyên tìm bảo</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                +{formatPercent(mods.lootChanceMult - 1)}
              </p>
              <p className="text-[10px] text-paper-400">Tăng tỉ lệ rơi rương</p>
            </div>
          </div>

          <div className="rounded-md border border-paper-400/10 bg-ink-900/30 p-3 text-xs text-paper-400">
            💡 <strong className="text-paper-300">Quy tắc chiến lực</strong>: Cảnh giới nâng cao chỉ số căn bản (Khí huyết, Công, Thủ). Pháp bảo và thuộc tính (Affix) sẽ nhân phần trăm lên chỉ số căn bản đó.
          </div>
        </div>
      )}

      {/* Tab 2: Tu vi & Căn cơ */}
      {tab === 'cultivation' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tốc độ tụ khí</span>
              <p className="font-han text-lg font-bold text-qi-400 tabular-nums">
                {formatRate(getQiRate(state))}
              </p>
              <p className="text-[10px] text-paper-400">
                Gốc {formatRate(realm.qiRate)} · ×{mods.qiRateMult.toFixed(2)}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Thu hoạch linh thạch</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                {formatRate(getStoneRate(state))}
              </p>
              <p className="text-[10px] text-paper-400">
                Hệ số ×{mods.stoneRateMult.toFixed(2)}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Xác suất đột phá</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {formatPercent(getBreakthroughChance(state))}
              </p>
              <p className="text-[10px] text-paper-400">
                {nextRealm ? `Đích: ${nextRealm.name}` : 'Đã viên mãn'}
              </p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Tổn thất thất bại</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                -{Math.round((1 - mods.failPenaltyMult) * 100)}%
              </p>
              <p className="text-[10px] text-paper-400">Giảm trừ linh khí khi hỏng</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Vận công thiền định</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                +{mods.meditateSeconds}s
              </p>
              <p className="text-[10px] text-paper-400">Linh khí mỗi lần nhấp</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Bế quan tối đa</span>
              <p className="font-han text-lg font-bold text-paper-100 tabular-nums">
                {(mods.offlineCapMs / 3600000).toFixed(1)} giờ
              </p>
              <p className="text-[10px] text-paper-400">Tích lũy offline</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Thọ nguyên gia tăng</span>
              <p className="font-han text-lg font-bold text-jade-400 tabular-nums">
                +{mods.lifespanBonusYears} năm
              </p>
              <p className="text-[10px] text-paper-400">Từ công pháp & luân hồi</p>
            </div>

            <div className="rounded-md border border-paper-400/15 bg-ink-900/50 p-2.5">
              <span className="text-xs text-paper-400">Dược lực tạm thời</span>
              <p className="font-han text-lg font-bold text-gold-400 tabular-nums">
                {state.pendingBreakthroughBonus > 0 ? `+${formatPercent(state.pendingBreakthroughBonus)}` : '0%'}
              </p>
              <p className="text-[10px] text-paper-400">Cộng dồn đột phá lần tới</p>
            </div>
          </div>

          {/* 15 Cảnh Giới Luyện Khí Sĩ Kiếm Lai */}
          <div className="space-y-2 rounded-lg border border-gold-500/20 bg-ink-900/60 p-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-han text-sm font-semibold text-gold-400">
                📜 15 Cảnh Giới Luyện Khí Sĩ (Kiếm Lai)
              </h4>
              <span className="text-xs text-paper-300">
                Hiện tại: <strong className="text-paper-100">{realm.kiemLaiRealm ?? realm.name}</strong>
              </span>
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-3">
              <div className="rounded border border-paper-400/10 bg-ink-950/50 p-2 space-y-1">
                <span className="font-han text-gold-300 block font-medium">Hạ Ngũ Cảnh (Nhập Đạo)</span>
                <p className="text-[11px] text-paper-400">
                  1. Đồng Bì · 2. Thảo Căn · 3. Liễu Cốt · 4. Khí Phủ · 5. Dưỡng Khí
                </p>
                <p className="text-[10px] text-paper-400 italic">Rèn giũa thân xác phàm nhân, câu thông linh khí trời đất.</p>
              </div>
              <div className="rounded border border-paper-400/10 bg-ink-950/50 p-2 space-y-1">
                <span className="font-han text-gold-300 block font-medium">Trung Ngũ Cảnh (Đăng Đường)</span>
                <p className="text-[11px] text-paper-400">
                  6. Động Phủ · 7. Quan Hải · 8. Long Môn · 9. Kim Đan · 10. Nguyên Anh
                </p>
                <p className="text-[10px] text-paper-400 italic">Mở phủ ngắm biển, vượt long môn kết đan anh biến hóa.</p>
              </div>
              <div className="rounded border border-paper-400/10 bg-ink-950/50 p-2 space-y-1">
                <span className="font-han text-gold-300 block font-medium">Thượng Ngũ Cảnh (Đại La)</span>
                <p className="text-[11px] text-paper-400">
                  11. Ngọc Phác · 12. Tiên Nhân · 13. Phi Thăng · 14. Hợp Đạo · 15. Bản Nguyên
                </p>
                <p className="text-[10px] text-paper-400 italic">Phi thăng tuyệt đỉnh, chưởng khống quy tắc trời đất vạn cổ.</p>
              </div>
            </div>
          </div>

          {/* Dược lực đang phát huy */}
          {buffs.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-han text-sm text-jade-400">Dược lực đang phát huy ({buffs.length})</h4>
              <ul className="flex flex-wrap gap-2 text-xs">
                {buffs.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-full border border-jade-500/40 bg-jade-500/10 px-3 py-1 text-jade-300 tabular-nums"
                  >
                    {b.name} ×{b.qiRateMult} · còn {formatDurationMs(b.expiresAtMs - state.playedMs)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Công pháp đã đắc ngộ */}
          <div className="space-y-1.5">
            <h4 className="font-han text-sm text-paper-200">
              Công pháp đã đắc ngộ ({learnedTechniques.length})
            </h4>
            {learnedTechniques.length === 0 ? (
              <p className="text-xs text-paper-400">Chưa tu luyện công pháp nào. Vào tab Công pháp để mua.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2 text-xs">
                {learnedTechniques.map(({ def, lvl }) => (
                  <li
                    key={def.id}
                    className="rounded-md border border-paper-400/10 bg-ink-900/50 p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-han font-medium text-gold-400">{def.name}</span>
                      <span className="text-paper-400 tabular-nums">Tầng {lvl}/{def.maxLevel}</span>
                    </div>
                    <p className="mt-1 text-paper-300">{describeTechniqueEffect(def, lvl)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Võ Đạo Kiếm Lai */}
      {tab === 'martial' && (
        <div className="space-y-4 pt-1">
          {/* Cảnh giới võ đạo hiện tại */}
          <div className="rounded-lg border border-vermilion-500/30 bg-ink-900/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs tracking-wider text-vermilion-400 font-semibold uppercase">
                  {martial.group}
                </span>
                <h3 className="font-han text-2xl font-bold text-paper-100 mt-0.5">
                  {martial.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-paper-400">Quyền ý tích lũy</span>
                <p className="font-han text-xl font-bold text-gold-400 tabular-nums">
                  {formatNumber(punches)} <span className="text-xs font-normal text-paper-300">quyền</span>
                </p>
              </div>
            </div>

            <p className="mt-2 text-xs text-paper-300 italic border-l-2 border-vermilion-500/50 pl-3 py-0.5">
              "{martial.description}"
            </p>

            {/* Gia trì chiến lực */}
            <div className="mt-3 grid grid-cols-3 gap-2 rounded bg-ink-950/60 p-2 text-center text-xs">
              <div>
                <span className="text-paper-400 text-[11px] block">Khí huyết</span>
                <span className="font-han font-bold text-jade-400">
                  +{formatPercent(martial.bonus.hpPercent)}
                </span>
              </div>
              <div>
                <span className="text-paper-400 text-[11px] block">Công kích</span>
                <span className="font-han font-bold text-vermilion-400">
                  +{formatPercent(martial.bonus.atkPercent)}
                </span>
              </div>
              <div>
                <span className="text-paper-400 text-[11px] block">Phòng ngự</span>
                <span className="font-han font-bold text-qi-400">
                  +{formatPercent(martial.bonus.defPercent)}
                </span>
              </div>
            </div>

            {/* Tiến độ tới cảnh giới kế tiếp */}
            {nextMartial ? (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-paper-300">
                  <span>Cảnh giới kế: <strong className="text-paper-100">{nextMartial.name}</strong></span>
                  <span className="text-gold-400 tabular-nums">
                    {formatNumber(punches)} / {formatNumber(nextMartial.minPunches)} quyền
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-950">
                  <div
                    className="h-full bg-gradient-to-r from-vermilion-500 to-gold-400 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (punches / nextMartial.minPunches) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-center text-xs text-gold-400 font-han">
                Đã đạt tới đỉnh phong Võ Thần Cảnh! Một quyền toái toái chư thiên vạn giới.
              </p>
            )}
          </div>

          {/* Danh sách 11 Cảnh Giới Võ Phu */}
          <div className="space-y-2">
            <h4 className="font-han text-sm font-semibold text-paper-200">
              👊 11 Cảnh Giới Võ Đạo Kiếm Lai
            </h4>
            <div className="grid gap-2 sm:grid-cols-2 text-xs max-h-60 overflow-y-auto pr-1">
              {MARTIAL_STAGES.map((s) => {
                const reached = punches >= s.minPunches
                const isCurrent = martial.id === s.id
                return (
                  <div
                    key={s.id}
                    className={`rounded-md border p-2.5 transition-colors ${
                      isCurrent
                        ? 'border-vermilion-500/80 bg-vermilion-500/10'
                        : reached
                        ? 'border-paper-400/20 bg-ink-900/40 text-paper-300'
                        : 'border-paper-400/10 bg-ink-950/30 text-paper-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-han font-semibold ${isCurrent ? 'text-vermilion-400' : reached ? 'text-paper-100' : 'text-paper-400'}`}>
                        {s.name}
                      </span>
                      <span className="text-[10px] tabular-nums font-mono">
                        {s.minPunches === 0 ? 'Khởi đầu' : `${formatNumber(s.minPunches)} quyền`}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-paper-400 line-clamp-2">
                      {s.description}
                    </p>
                    <div className="mt-1.5 flex gap-2 text-[10px]">
                      <span className="text-vermilion-300">Công +{formatPercent(s.bonus.atkPercent)}</span>
                      <span className="text-qi-300">Thủ +{formatPercent(s.bonus.defPercent)}</span>
                      <span className="text-jade-300">HP +{formatPercent(s.bonus.hpPercent)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[11px] text-paper-400 italic">
              💡 Võ phu xuất quyền trong từng trận chiến hành tẩu: diệt quái (+1 quyền), hạ boss (+10 quyền), vượt ải (+5 quyền), phá cảnh (+50 quyền).
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Pháp bảo */}
      {tab === 'gear' && (
        <div className="space-y-4 pt-1">
          {/* Hiệu ứng Set Bonus kích hoạt */}
          {activeSets.length > 0 && (
            <div className="rounded-md border border-gold-500/30 bg-ink-950/70 p-3 shadow-inner">
              <h4 className="font-han text-xs font-bold text-gold-300 mb-2">
                Hiệu ứng bộ pháp bảo đang kích hoạt ({activeSets.length}):
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeSets.map((s, idx) => (
                  <div key={idx} className="rounded border border-gold-500/20 bg-ink-900/60 p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gold-400">{s.setName}</span>
                      <span className="text-[10px] text-paper-400">Mốc {s.threshold} món</span>
                    </div>
                    <p className="mt-1 text-paper-300">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {GEAR_SLOTS.map((slot) => {
              const uid = state.equipped[slot]
              const g = uid ? byUid.get(uid) : undefined
              if (!g) {
                return (
                  <li
                    key={slot}
                    className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-dashed border-paper-400/20 bg-ink-900/30 p-2 text-center text-xs text-paper-400"
                  >
                    <span className="font-han text-xs font-medium text-paper-300">{SLOT_NAME[slot]}</span>
                    <span className="mt-0.5 text-[10px] text-paper-400">Trống</span>
                  </li>
                )
              }
              const def = getGearDef(g)
              return (
                <li
                  key={slot}
                  className={`flex flex-col justify-between rounded-lg border p-2.5 ${RARITY_CLASS[g.rarity]} ${RARITY_BG[g.rarity]}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-han text-xs font-bold truncate">{def.name}</h4>
                      <span className="text-[9px] uppercase font-mono">{RARITY_NAME[g.rarity]}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-paper-400">
                      {SLOT_NAME[slot]} · Bậc {g.tier}
                    </p>
                    <ul className="mt-1 space-y-0.5 text-[11px]">
                      {g.affixes.map((a, i) => (
                        <li key={i} className="text-paper-200">
                          {describeAffix(a)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="rounded-md border border-paper-400/10 bg-ink-900/50 p-3">
            <h4 className="font-han text-xs font-semibold text-paper-300 mb-2">
              Tổng cộng thuộc tính từ pháp bảo đang mặc:
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3">
              {affixes.hp > 0 && <span className="text-paper-300">Khí huyết: <strong className="text-jade-400">+{formatPercent(affixes.hp)}</strong></span>}
              {affixes.atk > 0 && <span className="text-paper-300">Công kích: <strong className="text-vermilion-400">+{formatPercent(affixes.atk)}</strong></span>}
              {affixes.def > 0 && <span className="text-paper-300">Phòng ngự: <strong className="text-qi-400">+{formatPercent(affixes.def)}</strong></span>}
              {affixes.atkSpeed > 0 && <span className="text-paper-300">Thân pháp: <strong className="text-gold-400">+{formatPercent(affixes.atkSpeed)}</strong></span>}
              {affixes.crit > 0 && <span className="text-paper-300">Bạo kích: <strong className="text-paper-100">+{formatPercent(affixes.crit)}</strong></span>}
              {affixes.critDmg > 0 && <span className="text-paper-300">Bạo thương: <strong className="text-paper-100">+{formatPercent(affixes.critDmg)}</strong></span>}
              {affixes.lifesteal > 0 && <span className="text-paper-300">Hấp huyết: <strong className="text-jade-400">+{formatPercent(affixes.lifesteal)}</strong></span>}
              {affixes.qiRate > 0 && <span className="text-paper-300">Tụ khí: <strong className="text-qi-400">+{formatPercent(affixes.qiRate)}</strong></span>}
              {affixes.stoneRate > 0 && <span className="text-paper-300">Tụ bảo: <strong className="text-gold-400">+{formatPercent(affixes.stoneRate)}</strong></span>}
              {affixes.lootChance > 0 && <span className="text-paper-300">Cơ duyên: <strong className="text-gold-400">+{formatPercent(affixes.lootChance)}</strong></span>}
              {Object.values(affixes).every((v) => v === 0) && (
                <span className="text-paper-400 col-span-3">Chưa có thuộc tính nào từ pháp bảo.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Đạo Thống (10 Phái & Chư Tử Bách Gia) */}
      {tab === 'class' && (
        <div className="space-y-4 pt-1">
          <div className="rounded-lg border border-gold-500/20 bg-ink-900/60 p-3">
            <h4 className="font-han text-sm text-gold-300">Chư Tử Bách Gia & Đạo Thống Kiếm Lai</h4>
            <p className="mt-1 text-xs text-paper-300">
              Trời đất bao la, đạo hữu có thể quy y Phật môn, nhập thế Nho gia, thuận theo Đạo pháp tự nhiên, hoặc đúc rèn ngạo cốt Kiếm Tu / Võ Phu thuần túy. Mỗi phái mang theo thiên phú chân truyền và kỹ năng trấn phái độc nhất vô nhị.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {CLASSES.map((c) => {
              const active = state.classId === c.id
              return (
                <li
                  key={c.id}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                    active
                      ? 'border-gold-400 bg-ink-900/95 ring-2 ring-gold-500/30 shadow-lg'
                      : 'border-paper-400/20 bg-ink-950/70 hover:border-gold-500/40'
                  }`}
                  style={
                    active
                      ? {
                          borderColor: c.accentColor,
                          boxShadow: `0 0 16px ${c.accentColor}33`,
                        }
                      : undefined
                  }
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg font-han font-bold text-lg border"
                          style={{
                            borderColor: c.accentColor + '88',
                            color: c.accentColor,
                            backgroundColor: c.accentColor + '22',
                          }}
                        >
                          {c.glyph}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-han text-base font-bold text-paper-100">{c.name}</h5>
                            <span className="text-[11px] text-paper-400">({c.faction})</span>
                          </div>
                          <p className="text-xs font-serif" style={{ color: c.accentColor }}>
                            {c.title}
                          </p>
                        </div>
                      </div>

                      {active && (
                        <span className="shrink-0 rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-gold-400 border border-gold-500/40">
                          Chính Thống
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-paper-300 leading-relaxed">{c.description}</p>

                    <div className="space-y-1 rounded-md border border-paper-400/10 bg-ink-950/80 p-2.5 text-xs">
                      <div className="text-paper-200">
                        <span className="text-paper-400">Trấn phái: </span>
                        <strong className="text-gold-300 font-medium">{c.signatureSkill}</strong>
                      </div>
                      <div className="text-paper-200">
                        <span className="text-paper-400">Chân truyền: </span>
                        <strong className="text-jade-400 font-medium">{c.passiveName}</strong>
                      </div>
                      <p className="text-[11px] text-paper-300/90 font-serif pt-0.5">{c.passiveDesc}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-paper-400/10 flex justify-end">
                    {active ? (
                      <span className="text-xs font-han text-gold-400 flex items-center gap-1">
                        <span>✓</span> Đang theo đuổi
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        className="px-2.5 py-1 text-xs"
                        onClick={() => changeClass(c.id)}
                      >
                        Gia Nhập Đạo Thống
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      </Modal>

      <AvatarModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatarId={state.settings.avatarId ?? 'tran-binh-an'}
        onSelectAvatar={setAvatar}
      />
    </>
  )
}
