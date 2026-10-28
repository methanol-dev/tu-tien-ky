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
    b.textContent?.includes(label),
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
    await act(async () => {
      button('Công pháp').click()
    })
    expect(container.textContent).toContain('Khí Thao Long Diêu')
    await act(async () => {
      button('Luyện đan').click()
    })
    expect(container.textContent).toContain('Đan Lô')
    await act(async () => {
      button('Túi đồ').click()
    })
    expect(container.textContent).toContain('Phường thị')
    expect(container.textContent).toContain('Pháp bảo')
    await act(async () => {
      button('Hành tẩu').click()
    })
    expect(container.textContent).toContain('Ly Châu Động Thiên')
    expect(container.textContent).toContain('Tĩnh tọa')
    expect(container.querySelector('[role="img"]')).not.toBeNull()
    await act(async () => {
      button('Cài đặt').click()
    })
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

  it('displays character stats and opens character modal', async () => {
    await act(async () => {
      root.render(<App />)
    })
    expect(container.textContent).toContain('Căn cơ tu vi')
    expect(container.textContent).toContain('Chiến lực hành tẩu')
    expect(container.textContent).toContain('Khí huyết')
    expect(container.textContent).toContain('Công')
    expect(container.textContent).toContain('Thủ')

    // Open CharacterModal from header
    await act(async () => {
      button('Chỉ số').click()
    })
    expect(container.textContent).toContain('Đạo Thân · Chỉ Số Nhân Vật')
    expect(container.textContent).toContain('⚔️ Chiến Lực')
    expect(container.textContent).toContain('Tỉ lệ bạo kích')
    expect(container.textContent).toContain('Sát thương bạo')

    // Switch to cultivation tab (Luyện Khí Sĩ 15 Cảnh)
    await act(async () => {
      button('🧘 Luyện Khí Sĩ').click()
    })
    expect(container.textContent).toContain('Tốc độ tụ khí')
    expect(container.textContent).toContain('15 Cảnh Giới Luyện Khí Sĩ')
    expect(container.textContent).toContain('Hạ Ngũ Cảnh')

    // Switch to martial tab (Võ Đạo 11 Cảnh)
    await act(async () => {
      button('👊 Võ Đạo').click()
    })
    expect(container.textContent).toContain('11 Cảnh Giới Võ Đạo Kiếm Lai')
    expect(container.textContent).toContain('Nê Phôi Cảnh')

    // Switch to gear tab
    await act(async () => {
      button('🛡️ Pháp Bảo').click()
    })
    expect(container.textContent).toContain('Vũ khí')
    expect(container.textContent).toContain('Áo')
    expect(container.textContent).toContain('Phù lục')

    // Close modal
    await act(async () => {
      button('Đóng').click()
    })
    expect(container.textContent).not.toContain('Đạo Thân · Chỉ Số Nhân Vật')
  })
})
