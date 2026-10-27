import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/ui/atoms/Button'
import { Modal } from '@/ui/atoms/Modal'

export function SettingsScreen() {
  const exportSave = useGameStore((s) => s.exportSave)
  const importSave = useGameStore((s) => s.importSave)
  const resetGame = useGameStore((s) => s.resetGame)
  const pauseOnEvent = useGameStore((s) => s.state.settings.pauseOnEvent)
  const setPauseOnEvent = useGameStore((s) => s.setPauseOnEvent)

  const [exported, setExported] = useState('')
  const [copied, setCopied] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleExport = async () => {
    const text = exportSave()
    setExported(text)
    setCopied(false)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Clipboard may be unavailable (http, permissions); textarea below is the fallback.
    }
  }

  const handleImport = () => {
    const r = importSave(importText)
    setImportError(r.ok ? null : r.error)
    if (r.ok) setImportText('')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section className="space-y-3">
        <h2 className="font-han text-xl text-gold-400">Tu luyện</h2>
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md border border-paper-400/15 bg-ink-800/60 px-4 py-2">
          <span>
            <span className="block text-paper-100">Dừng tu luyện khi có sự kiện</span>
            <span className="block text-xs text-paper-400">
              Bật: thế giới đứng yên cho tới khi ngươi chọn. Tắt (mặc định): linh khí vẫn tích, bế quan offline không bị gián đoạn.
            </span>
          </span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-gold-500"
            checked={pauseOnEvent}
            onChange={(e) => setPauseOnEvent(e.target.checked)}
          />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="font-han text-xl text-gold-400">Xuất save</h2>
        <p className="text-sm text-paper-300">
          Sao chép chuỗi này để sao lưu hoặc chuyển sang máy khác.
        </p>
        <Button onClick={handleExport}>{copied ? 'Đã sao chép ✓' : 'Tạo & sao chép'}</Button>
        {exported && (
          <textarea
            readOnly
            value={exported}
            onFocus={(e) => e.currentTarget.select()}
            className="h-28 w-full rounded-md border border-paper-400/20 bg-ink-950 p-3 font-mono text-xs text-paper-300"
            aria-label="Chuỗi save đã xuất"
          />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-han text-xl text-gold-400">Nhập save</h2>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Dán chuỗi save vào đây..."
          className="h-28 w-full rounded-md border border-paper-400/20 bg-ink-950 p-3 font-mono text-xs text-paper-100 placeholder:text-paper-400/50"
          aria-label="Chuỗi save cần nhập"
        />
        {importError && <p className="text-sm text-vermilion-400">{importError}</p>}
        <Button onClick={handleImport} disabled={!importText.trim()}>
          Nhập
        </Button>
      </section>

      <section className="space-y-3 border-t border-paper-400/10 pt-6">
        <h2 className="font-han text-xl text-vermilion-400">Vùng nguy hiểm</h2>
        <p className="text-sm text-paper-300">Xóa toàn bộ tiến trình và bắt đầu lại từ phàm nhân.</p>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          Trọng tu từ đầu
        </Button>
      </section>

      <Modal
        open={confirmReset}
        title="Trọng tu từ đầu?"
        onClose={() => setConfirmReset(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                resetGame()
                setConfirmReset(false)
              }}
            >
              Xóa và bắt đầu lại
            </Button>
          </>
        }
      >
        <p>Toàn bộ cảnh giới, linh khí và nhật ký sẽ mất. Hãy xuất save trước nếu còn tiếc.</p>
      </Modal>
    </div>
  )
}
