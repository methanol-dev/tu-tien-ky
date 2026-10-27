import type { GameStoreApi } from './gameStore'

export interface GameLoopOptions {
  /** Persist this often while the tab is visible. */
  autosaveMs?: number
  /** Frames longer than this are treated as a pause and routed through offline catch-up. */
  maxFrameMs?: number
}

/**
 * Drives the engine with requestAnimationFrame. Time is measured with timestamps,
 * never counted in frames, so throttled tabs do not slow the game down.
 * Returns a cleanup function.
 */
export function startGameLoop(store: GameStoreApi, opts: GameLoopOptions = {}): () => void {
  const autosaveMs = opts.autosaveMs ?? 30_000
  const maxFrameMs = opts.maxFrameMs ?? 1_000
  let last = performance.now()
  let rafId = 0
  let running = true

  const frame = (now: number) => {
    if (!running) return
    const dt = now - last
    last = now
    if (dt > maxFrameMs) {
      store.getState().resume()
    } else if (dt > 0) {
      store.getState().tick(dt)
    }
    rafId = requestAnimationFrame(frame)
  }

  const onVisibility = () => {
    if (document.hidden) {
      store.getState().save()
    } else {
      last = performance.now()
      store.getState().resume()
    }
  }
  const onPageHide = () => store.getState().save()

  const autosave = window.setInterval(() => {
    if (!document.hidden) store.getState().save()
  }, autosaveMs)

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', onPageHide)
  rafId = requestAnimationFrame(frame)

  return () => {
    running = false
    cancelAnimationFrame(rafId)
    window.clearInterval(autosave)
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pagehide', onPageHide)
    store.getState().save()
  }
}
