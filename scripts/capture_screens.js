import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const OUT_DIR = path.resolve('screenshots')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

async function run() {
  console.log(`[Screenshot Tool] Launching browser: ${CHROME_PATH}`)
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })

  console.log('[Screenshot Tool] Navigating to http://localhost:4173')
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)))

  // Sử dụng __GAME_STORE__ để thiết lập state kiểm thử hoàn chỉnh
  await page.evaluate(() => {
    // @ts-ignore
    const store = window.__GAME_STORE__
    if (store) {
      store.setState((s) => ({
        growthFundModalOpen: false,
        characterModalOpen: false,
        formationModalOpen: false,
        state: {
          ...s.state,
          realmIndex: 3,
          flags: {
            ...s.state.flags,
            'story:seen:scene-0-1': true,
            'story:seen:scene-0-2': true,
            'story:seen:scene-1-1': true,
            'story:seen:scene-1-2': true,
            'story:seen:scene-1-3': true,
            'story:seen:scene-2-1': true,
          },
          storyProgress: { ...s.state.storyProgress, currentChapter: 99, currentSceneIndex: 99 },
          pendingEvent: null,
          forge: {
            ...s.state.forge,
            fireCount: 50,
            pityCount: 7, // 7/10 pity count để kiểm tra thanh Bảo Hiểm Khí Vận
          },
        },
      }))
    }
  })

  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)))

  // 1. Chụp Động Phủ
  await page.evaluate(() => window.__GAME_STORE__?.getState().setScreen('cultivate'))
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)))
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_cultivate.png'), fullPage: false })
  console.log('✅ Captured: screenshots/mobile_cultivate.png')

  // 2. Chụp Luyện Khí (Cái Lò khi chưa có pendingGear)
  await page.evaluate(() => {
    window.__GAME_STORE__?.getState().setScreen('forge')
    window.__GAME_STORE__?.setState((s) => ({
      state: {
        ...s.state,
        forge: {
          ...s.state.forge,
          pendingGear: null,
        },
      },
    }))
  })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)))
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_forge_empty.png'), fullPage: false })
  console.log('✅ Captured: screenshots/mobile_forge_empty.png')

  // 2b. Chụp Luyện Khí (Khi có pendingGear - So sánh trang bị)
  await page.evaluate(() => {
    window.__GAME_STORE__?.setState((s) => ({
      state: {
        ...s.state,
        forge: {
          ...s.state.forge,
          pendingGear: {
            uid: 'test-pending-1',
            defId: 'huyen-bi-kho',
            tier: 3,
            rarity: 'bao',
            baseStats: {},
            affixes: [
              { key: 'hp', value: 0.1 },
              { key: 'stonerate', value: 0.07 },
              { key: 'atkspeed', value: 0.11 },
            ],
            quality: 85,
            level: 1,
            exp: 0,
            bound: false,
          },
        },
      },
    }))
  })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)))
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_forge_pending.png'), fullPage: false })
  console.log('✅ Captured: screenshots/mobile_forge_pending.png')

  // 3. Chụp Túi Đồ
  await page.evaluate(() => {
    window.__GAME_STORE__?.setState((s) => ({
      state: { ...s.state, forge: { ...s.state.forge, pendingGear: null } },
    }))
    window.__GAME_STORE__?.getState().setScreen('inventory')
  })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)))
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_inventory.png'), fullPage: false })
  console.log('✅ Captured: screenshots/mobile_inventory.png')

  // 4. Chụp Hành Tẩu
  await page.evaluate(() => window.__GAME_STORE__?.getState().setScreen('journey'))
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)))
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_journey.png'), fullPage: false })
  console.log('✅ Captured: screenshots/mobile_journey.png')

  // 5. Chuyển sang Desktop Viewport để kiểm tra Desktop Forge & Growth Fund Modal
  await page.setViewport({ width: 1280, height: 800, isMobile: false })
  await page.evaluate(() => {
    window.__GAME_STORE__?.getState().setScreen('forge')
    window.__GAME_STORE__?.setState((s) => ({
      state: { ...s.state, forge: { ...s.state.forge, pendingGear: null } },
    }))
  })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)))
  await page.screenshot({ path: path.join(OUT_DIR, 'desktop_forge_empty.png'), fullPage: false })
  console.log('✅ Captured: screenshots/desktop_forge_empty.png')

  await page.evaluate(() => {
    window.__GAME_STORE__?.setState((s) => ({
      state: {
        ...s.state,
        forge: {
          ...s.state.forge,
          pendingGear: {
            uid: 'test-pending-1',
            defId: 'huyen-bi-kho',
            tier: 3,
            rarity: 'bao',
            baseStats: {},
            affixes: [
              { key: 'hp', value: 0.1 },
              { key: 'stonerate', value: 0.07 },
              { key: 'atkspeed', value: 0.11 },
            ],
            quality: 85,
            level: 1,
            exp: 0,
            bound: false,
          },
        },
      },
    }))
  })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)))
  await page.screenshot({ path: path.join(OUT_DIR, 'desktop_forge_pending.png'), fullPage: false })
  console.log('✅ Captured: screenshots/desktop_forge_pending.png')

  // Mở Quỹ Trưởng Thành trên Desktop
  await page.evaluate(() => {
    window.__GAME_STORE__?.getState().setGrowthFundModalOpen(true)
  })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)))
  await page.screenshot({ path: path.join(OUT_DIR, 'desktop_growth_fund.png'), fullPage: false })
  console.log('✅ Captured: screenshots/desktop_growth_fund.png')

  await browser.close()
  console.log('[Screenshot Tool] Completed all captures!')
}

run().catch((err) => {
  console.error('Error running screenshot tool:', err)
  process.exit(1)
})
