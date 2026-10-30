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

  console.log('[Screenshot Tool] Navigating to http://localhost:5173')
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)))

  // Đóng story modal qua nhiều bước nếu có
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const btn = btns.find((b) =>
        b.textContent &&
        (b.textContent.includes('Lĩnh ngộ') ||
          b.textContent.includes('Tiếp tục') ||
          b.textContent.includes('Thả cá') ||
          b.textContent.includes('✕')),
      )
      if (btn) btn.click()
    })
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)))
  }

  // 1. Chụp Động Phủ
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_cultivate.png'), fullPage: false })
  console.log('✅ Captured: screenshots/mobile_cultivate.png')

  // Helper chuyển tab trên mobile nav
  async function clickTab(text) {
    const clicked = await page.evaluate((tabText) => {
      const buttons = Array.from(document.querySelectorAll('nav button, button'))
      const target = buttons.find((b) => b.textContent && b.textContent.includes(tabText))
      if (target) {
        target.click()
        return true
      }
      return false
    }, text)
    if (clicked) {
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)))
    }
    return clicked
  }

  // 2. Chuyển sang Luyện Khí
  if (await clickTab('Luyện khí')) {
    await page.screenshot({ path: path.join(OUT_DIR, 'mobile_forge.png'), fullPage: false })
    console.log('✅ Captured: screenshots/mobile_forge.png')
  }

  // 3. Chuyển sang Túi Đồ
  if (await clickTab('Túi đồ')) {
    await page.screenshot({ path: path.join(OUT_DIR, 'mobile_inventory.png'), fullPage: false })
    console.log('✅ Captured: screenshots/mobile_inventory.png')
  }

  // 4. Chuyển sang Hành Tẩu
  if (await clickTab('Hành tẩu')) {
    await page.screenshot({ path: path.join(OUT_DIR, 'mobile_journey.png'), fullPage: false })
    console.log('✅ Captured: screenshots/mobile_journey.png')
  }

  await browser.close()
  console.log('[Screenshot Tool] Completed all captures!')
}

run().catch((err) => {
  console.error('Error running screenshot tool:', err)
  process.exit(1)
})
