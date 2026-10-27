import { useState } from 'react'
import { LEGACY_UPGRADES } from '@/content/legacy'
import { REALMS } from '@/content/realms'
import {
  canBuyLegacy,
  canReincarnate,
  computeDaoVan,
  getLegacyCost,
  getLegacyLevel,
  isReincarnationForced,
} from '@/engine'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

function describe(effect: string, perLevel: number, level: number): string {
  const cur = perLevel * level
  switch (effect) {
    case 'qiRateMult':
      return `Tốc độ tu luyện +${Math.round(perLevel * 100)}%/tầng (hiện +${Math.round(cur * 100)}%)`
    case 'startRealm':
      return level === 0 ? 'Khởi đầu ở Luyện Khí tầng 1 trở lên' : `Khởi đầu ở ${REALMS[level].name}`
    case 'lifespanYears':
      return `Thọ nguyên +${perLevel} năm/tầng (hiện +${cur} năm)`
    case 'breakthroughBonus':
      return `Tỉ lệ đột phá +${perLevel * 100}%/tầng, giảm sát thương thiên kiếp (hiện +${Math.round(cur * 100)}%)`
    case 'startStones':
      return `Khởi đầu với ${cur} linh thạch (+${perLevel}/tầng)`
    case 'keepTreasures':
      return level > 0 ? 'Pháp bảo được giữ qua các kiếp' : 'Giữ lại toàn bộ pháp bảo khi chuyển thế'
    default:
      return ''
  }
}

export function LegacyScreen() {
  const state = useGameStore((s) => s.state)
  const buy = useGameStore((s) => s.buyLegacyUpgrade)
  const reincarnate = useGameStore((s) => s.reincarnate)
  const [confirm, setConfirm] = useState(false)

  const gain = computeDaoVan(state)
  const forced = isReincarnationForced(state)
  const allowed = canReincarnate(state)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-han text-2xl text-gold-400">Luân hồi</h2>
          <p className="text-sm text-paper-400">Kiếp thứ {state.legacy.lives} · cảnh giới cao nhất: {REALMS[Math.max(state.legacy.bestRealmIndex, state.realmIndex)].name}</p>
        </div>
        <p className="font-han text-xl text-paper-100 tabular-nums">
          <span className="mr-1 text-gold-400">☯</span>
          {state.legacy.daoVan} Đạo Vận
        </p>
      </header>

      <section className={`space-y-3 rounded-lg border p-5 ${forced ? 'border-vermilion-500/50 bg-vermilion-500/10' : 'border-gold-500/20 bg-ink-800/70'}`}>
        <h3 className="font-han text-lg text-paper-100">{forced ? 'Thọ nguyên đã cạn' : 'Chuyển thế'}</h3>
        <p className="text-sm text-paper-300">
          {forced
            ? 'Thân xác này không trụ được nữa. Chuyển thế để nguyên thần mang Đạo Vận sang kiếp sau.'
            : 'Kết thúc kiếp này sớm để đổi lấy Đạo Vận. Cảnh giới, linh khí, công pháp, túi đồ sẽ mất; chỉ Đạo Vận và nâng cấp Luân hồi ở lại.'}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-paper-400">
            Chuyển thế bây giờ nhận <span className="font-han text-gold-400">{gain}</span> Đạo Vận
          </span>
          <Button variant={forced ? 'primary' : 'danger'} disabled={!allowed} onClick={() => setConfirm(true)}>
            Chuyển thế
          </Button>
        </div>
        {!allowed && <p className="text-xs text-paper-400">Cần đạt Trúc Cơ (hoặc hết thọ nguyên) mới có Đạo Vận để mang theo.</p>}
      </section>

      <ul className="grid gap-3 md:grid-cols-2">
        {LEGACY_UPGRADES.map((u) => {
          const level = getLegacyLevel(state, u.id)
          const maxed = level >= u.maxLevel
          const can = canBuyLegacy(state, u.id)
          return (
            <li key={u.id} className="flex flex-col gap-2 rounded-lg border border-paper-400/15 bg-ink-800/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-han text-lg text-paper-100">{u.name}</h3>
                  <p className="text-xs text-paper-400">{u.description}</p>
                </div>
                <span className="shrink-0 font-han text-sm text-gold-400 tabular-nums">{level}/{u.maxLevel}</span>
              </div>
              <p className="text-sm text-jade-400">{describe(u.effect, u.perLevel, level)}</p>
              <div className="mt-auto flex items-center justify-between pt-1">
                {maxed ? <span className="text-xs text-gold-400">Viên mãn</span> : <span className="text-sm text-paper-300 tabular-nums">{getLegacyCost(u, level)} Đạo Vận</span>}
                {!maxed && (
                  <Button variant={can ? 'primary' : 'secondary'} disabled={!can} onClick={() => buy(u.id)}>
                    Ngưng tụ
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <Modal
        open={confirm}
        title="Chuyển thế?"
        onClose={() => setConfirm(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>Khoan đã</Button>
            <Button variant="primary" onClick={() => { reincarnate(); setConfirm(false) }}>Luân hồi chuyển thế</Button>
          </>
        }
      >
        <p>Kiếp này kết thúc. Ngươi nhận {gain} Đạo Vận. Mọi thứ khác trừ pháp bảo (nếu có Tàng Bảo Các) sẽ tan biến.</p>
      </Modal>
    </div>
  )
}
