import type { OfflineReport } from '@/engine'
import { formatDurationMs, formatNumber } from '@/lib/format'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

interface OfflineModalProps {
  report: OfflineReport | null
  onClose: () => void
}

export function OfflineModal({ report, onClose }: OfflineModalProps) {
  return (
    <Modal
      open={report !== null}
      title="Xuất quan"
      onClose={onClose}
      footer={
        <Button variant="primary" onClick={onClose} autoFocus>
          Tiếp tục tu luyện
        </Button>
      }
    >
      {report && (
        <>
          <p>
            Ngươi đã bế quan <span className="text-paper-100">{formatDurationMs(report.appliedMs)}</span>
            {' '}({Math.floor(report.daysPassed)} ngày trong tu tiên giới).
          </p>
          <p>
            Hấp thu được{' '}
            <span className="font-han text-xl text-qi-400">{formatNumber(report.qiGained)}</span> linh khí, nhặt được{' '}
            <span className="font-han text-xl text-gold-400">{formatNumber(report.stonesGained)}</span> linh thạch.
          </p>
          {report.stagesCleared > 0 && (
            <p className="text-sm text-paper-300">
              Trên đường hành tẩu vượt <span className="text-paper-100 tabular-nums">{report.stagesCleared}</span> ải, nhặt{' '}
              <span className="text-gold-400 tabular-nums">{report.chestsGained}</span> rương
              {report.fireGained > 0 && (
                <span>, thu hoạch <span className="text-amber-400 font-bold tabular-nums">🔥 {report.fireGained}</span> Chân Hỏa</span>
              )}
              {report.deaths > 0 && <span className="text-vermilion-400">, gục ngã {report.deaths} lần</span>}.
            </p>
          )}
          {report.capped && (
            <p className="text-xs text-paper-400">
              Thời gian bế quan tối đa hiện là {formatDurationMs(report.appliedMs)}. Rời đi{' '}
              {formatDurationMs(report.elapsedMs)} nhưng chỉ tính phần trong giới hạn.
            </p>
          )}
        </>
      )}
    </Modal>
  )
}
