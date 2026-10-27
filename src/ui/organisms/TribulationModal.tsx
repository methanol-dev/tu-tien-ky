import { REALMS } from '@/content/realms'
import { type BoltResult, canUseTribulationPill, type GameState, type TribulationAction } from '@/engine'
import { formatNumber } from '@/lib/format'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface Props {
  state: GameState
  result: BoltResult | null
  onAct: (a: TribulationAction) => void
  onDismissResult: () => void
}

export function TribulationModal({ state, result, onAct, onDismissResult }: Props) {
  if (result) {
    return (
      <Modal
        open
        title={result.success ? 'Độ kiếp thành công' : 'Độ kiếp thất bại'}
        onClose={onDismissResult}
        footer={
          <Button variant="primary" onClick={onDismissResult} autoFocus>
            {result.success ? 'Thu công' : 'Dưỡng thương'}
          </Button>
        }
      >
        <p className={result.success ? 'text-gold-400' : 'text-vermilion-400'}>
          {result.success
            ? `Mây tan trời quang. Ngươi đã bước vào ${REALMS[state.realmIndex].name}.`
            : 'Thiên lôi đánh gục ngươi. Mất một nửa linh khí, trọng thương 10 phút.'}
        </p>
      </Modal>
    )
  }

  const t = state.tribulation
  if (!t) return null
  const hpPct = Math.round((t.hp / t.maxHp) * 100)
  const to = REALMS[t.toRealmIndex]
  const pillOk = canUseTribulationPill(state)

  return (
    <Modal open title={`⚡ Thiên kiếp · ${to.name}`} onClose={() => undefined}>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-paper-400">
          <span>Khí huyết</span>
          <span className="tabular-nums">{formatNumber(t.hp)} / {formatNumber(t.maxHp)}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-ink-950">
          <div className={`h-full transition-[width] duration-300 ${hpPct > 40 ? 'bg-jade-500' : 'bg-vermilion-500'}`} style={{ width: `${hpPct}%` }} />
        </div>
        <p className="text-xs text-paper-400">
          Đạo lôi {t.current + 1}/{t.bolts}
          {t.reduction > 0 && <span className="text-gold-400"> · giảm sát thương {Math.round(t.reduction * 100)}%</span>}
        </p>
      </div>

      <ol className="max-h-32 space-y-0.5 overflow-y-auto text-xs text-paper-300">
        {t.log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ol>

      <div className="grid gap-2 pt-2">
        <Button variant="primary" onClick={() => onAct('tank')} className="justify-between">
          <span>Ngạnh kháng</span>
          <span className="text-xs opacity-80">Chịu nguyên sát thương</span>
        </Button>
        <Button onClick={() => onAct('dodge')} className="justify-between">
          <span>Né tránh</span>
          <span className="text-xs opacity-80">50% né sạch · 50% ăn gấp rưỡi</span>
        </Button>
        <Button disabled={!pillOk} onClick={() => onAct('pill')} className="justify-between">
          <span>Nuốt Tụ Khí Đan hộ thể</span>
          <span className="text-xs opacity-80">{pillOk ? `Chỉ chịu 40% · còn ${state.inventory['tu-khi-dan']}` : 'Hết đan'}</span>
        </Button>
      </div>
    </Modal>
  )
}
