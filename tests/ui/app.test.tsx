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
    expect(container.textContent).toContain('Phàm Tục')
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

    // Khi chưa vượt ải, các tab bị khóa sẽ báo thông báo khi bấm
    await act(async () => {
      button('Công pháp').click()
    })
    expect(container.textContent).toContain('Tính năng Công pháp chưa mở khóa')

    // Giả lập đã vượt ải để mở khóa tất cả các tính năng
    act(() => {
      useGameStore.setState((s) => ({
        state: {
          ...s.state,
          stats: {
            ...s.state.stats,
            stagesCleared: 25,
            bossesSlain: 5,
          },
        },
      }))
    })

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

  it('navigates to Forge screen and performs forge & equip loop', async () => {
    await act(async () => {
      root.render(<App />)
    })

    // Mở khóa tính năng bằng cách đạt tiến trình ải
    act(() => {
      useGameStore.setState((s) => ({
        state: {
          ...s.state,
          stats: {
            ...s.state.stats,
            stagesCleared: 10,
          },
        },
      }))
    })

    // Click Luyện khí tab
    await act(async () => {
      button('Luyện khí').click()
    })

    expect(container.textContent).toContain('Đan Lô Luyện Khí')
    expect(container.textContent).toContain('Cửu U Chân Hỏa Lô')
    expect(container.textContent).toContain('ĐẬP LÔ LUYỆN KHÍ')

    // Click Đập Lô Luyện Khí
    await act(async () => {
      button('ĐẬP LÔ LUYỆN KHÍ').click()
    })

    expect(container.textContent).toContain('Bảo Vật Vừa Xuất Lò')
    expect(container.textContent).toContain('Mặc Vào')
    expect(container.textContent).toContain('Phân Giải')

    // Click Mặc Vào
    await act(async () => {
      button('Mặc Vào').click()
    })

    expect(container.textContent).not.toContain('Bảo Vật Vừa Xuất Lò')
    expect(container.textContent).toContain('ĐẬP LÔ LUYỆN KHÍ')
  })

  it('opens Formation modal and changes formation position', async () => {
    await act(async () => {
      root.render(<App />)
    })

    // Mở khóa tính năng bằng cách đạt tiến trình ải
    act(() => {
      useGameStore.setState((s) => ({
        state: {
          ...s.state,
          stats: {
            ...s.state.stats,
            stagesCleared: 10,
          },
        },
      }))
    })

    // Click Bố trận button on header
    await act(async () => {
      button('Bố trận').click()
    })

    expect(container.textContent).toContain('Trận Đồ Bát Quái · Tiền Tuyến Bố Trận')
    expect(container.textContent).toContain('HÀNG HẬU')
    expect(container.textContent).toContain('HÀNG TIỀN')
    expect(container.textContent).toContain('Quy Luật Tương Khắc Ngũ Môn Kiếm Lai')

    // Click a frontline slot button
    await act(async () => {
      button('Tiền Tả').click()
    })

    expect(useGameStore.getState().state.formation.playerSlot).toBe('front-left')

    // Close modal
    await act(async () => {
      button('Đóng Trận Đồ').click()
    })

    expect(container.textContent).not.toContain('Trận Đồ Bát Quái · Tiền Tuyến Bố Trận')
  })
})
