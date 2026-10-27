// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { useGameStore } from '@/store/gameStore'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root

function button(label: string): HTMLButtonElement {
  const el = Array.from(container.querySelectorAll('button')).find((b) =>
    b.textContent?.trim().startsWith(label),
  )
  if (!el) throw new Error(`button "${label}" not found`)
  return el
}

describe('App smoke', () => {
  beforeEach(() => {
    localStorage.clear()
    useGameStore.setState({ screen: 'cultivate', offlineReport: null })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('hydrates, renders the realm, reacts to Tu luyện and switches screens', async () => {
    await act(async () => {
      root.render(<App />)
    })
    expect(container.textContent).toContain('Phàm Nhân')
    expect(container.textContent).toContain('Nhật ký tu luyện')

    const before = container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')
    await act(async () => {
      button('Tu luyện').click()
    })
    const after = container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')
    expect(Number(after)).toBeGreaterThan(Number(before))
    expect(button('Đột phá').disabled).toBe(true)

    await act(async () => {
      button('Cài đặt').click()
    })
    expect(container.textContent).toContain('Xuất save')
    expect(button('Nhập').disabled).toBe(true)
  })

  it('persists to localStorage on unmount', async () => {
    await act(async () => {
      root.render(<App />)
    })
    await act(async () => {
      button('Tu luyện').click()
    })
    act(() => root.unmount())
    root = createRoot(container) // afterEach will unmount this fresh root safely
    const saved = Object.keys(localStorage).find((k) => k.startsWith('tu-tien-ky:save'))
    expect(saved).toBeDefined()
    expect(JSON.parse(localStorage.getItem(saved!)!).qi).toBeGreaterThan(0)
  })
})
