import { useState, useEffect, useRef, useCallback, type FC } from 'react'
import { getRealm } from '@/engine/cultivation'
import { getStoneRate } from '@/engine/economy'
import { formatNumber } from '@/lib/format'
import { useGameStore } from '@/store/gameStore'
import { IconSamsaraWheel } from '@/ui/atoms/icons'

const IDLE_TIMEOUT_MS = 180_000 // 3 phút không thao tác

export const BatterySaverOverlay: FC = () => {
  const state = useGameStore((s) => s.state)
  const afkSaverOpen = useGameStore((s) => s.afkSaverOpen)
  const setAfkSaverOpen = useGameStore((s) => s.setAfkSaverOpen)
  const [isIdle, setIsIdle] = useState(false)
  const [afkSeconds, setAfkSeconds] = useState(0)
  const idleTimerRef = useRef<number | null>(null)
  const afkIntervalRef = useRef<number | null>(null)

  const active = isIdle || afkSaverOpen

  const exitAfk = useCallback(() => {
    if (afkSaverOpen) {
      setAfkSaverOpen(false)
    }
    setIsIdle(false)
    setAfkSeconds(0)

    if (afkIntervalRef.current) {
      clearInterval(afkIntervalRef.current)
      afkIntervalRef.current = null
    }

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true)
    }, IDLE_TIMEOUT_MS)
  }, [afkSaverOpen, setAfkSaverOpen])

  // Lắng nghe thao tác người dùng khi chưa bế quan
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'pointerdown', 'wheel']
    const handler = () => {
      if (!active) {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
        idleTimerRef.current = window.setTimeout(() => {
          setIsIdle(true)
        }, IDLE_TIMEOUT_MS)
      }
    }

    events.forEach((ev) => window.addEventListener(ev, handler, { passive: true }))
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true)
    }, IDLE_TIMEOUT_MS)

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handler))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (afkIntervalRef.current) clearInterval(afkIntervalRef.current)
    }
  }, [active])

  // Đếm giây bế quan khi active
  useEffect(() => {
    if (active) {
      document.body.classList.add('afk-mode')
      afkIntervalRef.current = window.setInterval(() => {
        setAfkSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      document.body.classList.remove('afk-mode')
      if (afkIntervalRef.current) {
        clearInterval(afkIntervalRef.current)
        afkIntervalRef.current = null
      }
    }

    return () => {
      document.body.classList.remove('afk-mode')
      if (afkIntervalRef.current) clearInterval(afkIntervalRef.current)
    }
  }, [active])

  if (!active) return null

  const realm = getRealm(state)
  const qiPerSec = realm.qiRate
  const stonePerSec = getStoneRate(state)
  const estQi = Math.round(qiPerSec * afkSeconds)
  const estStones = Math.round(stonePerSec * afkSeconds)

  const hours = Math.floor(afkSeconds / 3600)
  const minutes = Math.floor((afkSeconds % 3600) / 60)
  const seconds = afkSeconds % 60
  const timeFormatted = `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={exitAfk}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') exitAfk()
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-950/95 p-6 backdrop-blur-md cursor-pointer select-none text-paper-200 transition-opacity duration-700 animate-fade-in"
    >
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">
        {/* Vòng Thái Cực Thiền Định */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/30 bg-ink-900/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <IconSamsaraWheel className="h-14 w-14 text-gold-400/80 animate-spin duration-10000" />
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold tracking-widest text-paper-100">
            BẾ QUAN THIỀN ĐỊNH
          </h2>
          <p className="mt-1 text-xs text-paper-400 font-serif italic">
            Chế độ tiết kiệm pin · Đang tự động tụ khí chu thiên
          </p>
        </div>

        {/* Đồng hồ Bế Quan */}
        <div className="rounded-2xl border border-paper-400/20 bg-ink-900/80 px-6 py-3 w-full">
          <div className="text-[11px] text-paper-400 font-serif">Thời gian tĩnh tọa</div>
          <div className="mt-1 font-mono text-2xl font-bold text-gold-300">
            {timeFormatted}
          </div>
        </div>

        {/* Thu hoạch ước tính */}
        <div className="grid grid-cols-2 gap-3 w-full text-xs">
          <div className="rounded-xl border border-paper-400/10 bg-ink-900/60 p-2.5">
            <div className="text-paper-400 text-[10px]">Linh khí tích lũy</div>
            <div className="mt-0.5 font-mono font-bold text-cyan-300">+{formatNumber(estQi)}</div>
          </div>
          <div className="rounded-xl border border-paper-400/10 bg-ink-900/60 p-2.5">
            <div className="text-paper-400 text-[10px]">Linh thạch ước tính</div>
            <div className="mt-0.5 font-mono font-bold text-gold-300">+{formatNumber(estStones)}</div>
          </div>
        </div>

        {/* Nhãn chạm để xuất quan */}
        <div className="mt-4 animate-pulse text-xs text-paper-400 font-serif">
          [Chạm vào màn hình hoặc bấm phím bất kỳ để Xuất Quan]
        </div>
      </div>
    </div>
  )
}
