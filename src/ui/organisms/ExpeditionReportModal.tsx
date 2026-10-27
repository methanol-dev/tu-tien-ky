import { ITEM_BY_ID } from '@/content/items'
import type { ExpeditionReport } from '@/engine'
import { formatNumber } from '@/lib/format'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface Props {
  report: ExpeditionReport | null
  onClose: () => void
}

export function ExpeditionReportModal({ report, onClose }: Props) {
  if (!report) return null
  const { combat, dungeon, loot, stones, treasure } = report
  const hpPct = combat.playerMax > 0 ? Math.round((combat.playerHpLeft / combat.playerMax) * 100) : 0
  return (
    <Modal
      open
      title={combat.victory ? `Chiến thắng · ${dungeon.name}` : `Bại trận · ${dungeon.name}`}
      onClose={onClose}
      footer={
        <Button variant="primary" onClick={onClose} autoFocus>
          Trở về động phủ
        </Button>
      }
    >
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-paper-400">
          <span>Khí huyết còn lại</span>
          <span className="tabular-nums">{combat.playerHpLeft} / {combat.playerMax}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-950">
          <div className={`h-full ${hpPct > 40 ? 'bg-jade-500' : 'bg-vermilion-500'}`} style={{ width: `${hpPct}%` }} />
        </div>
      </div>

      <ul className="flex flex-wrap gap-2 text-xs">
        {combat.waves.map((w, i) => (
          <li key={i} className={`rounded-full border px-2 py-0.5 ${w.won ? 'border-jade-500/40 text-jade-400' : 'border-vermilion-500/50 text-vermilion-400'}`}>
            {w.boss ? '👹 ' : ''}{w.enemy} · {w.rounds} hiệp
          </li>
        ))}
      </ul>

      {combat.victory ? (
        <div className="space-y-1 text-sm">
          <p className="text-gold-400">+{formatNumber(stones)} linh thạch</p>
          {Object.entries(loot).map(([id, n]) => (
            <p key={id} className="text-paper-200">+{n} {ITEM_BY_ID[id]?.name ?? id}</p>
          ))}
          {treasure && <p className="font-han text-vermilion-400">✦ Pháp bảo: {ITEM_BY_ID[treasure]?.name ?? treasure}</p>}
        </div>
      ) : (
        <p className="text-sm text-vermilion-400">Mất 10% linh khí, trọng thương 5 phút.</p>
      )}

      <details className="text-xs text-paper-400">
        <summary className="cursor-pointer select-none hover:text-paper-200">Chi tiết trận đấu</summary>
        <ol className="mt-2 max-h-48 space-y-0.5 overflow-y-auto font-mono">
          {combat.log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </details>
    </Modal>
  )
}
