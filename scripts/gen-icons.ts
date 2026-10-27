/**
 * Generates PWA icons without any image library: an ink-black rounded square with a
 * gold "dao" ring and a vermilion seal dot. Pure Node (zlib) PNG encoder.
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(buf: Uint8Array): number {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type: string, data: Uint8Array): Uint8Array {
  const len = new Uint8Array(4)
  new DataView(len.buffer).setUint32(0, data.length)
  const typeBytes = new TextEncoder().encode(type)
  const crcInput = new Uint8Array(typeBytes.length + data.length)
  crcInput.set(typeBytes)
  crcInput.set(data, typeBytes.length)
  const crc = new Uint8Array(4)
  new DataView(crc.buffer).setUint32(0, crc32(crcInput))
  return new Uint8Array([...len, ...typeBytes, ...data, ...crc])
}
function encodePng(size: number, rgba: Uint8Array): Uint8Array {
  const raw = new Uint8Array((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    raw.set(rgba.subarray(y * size * 4, (y + 1) * size * 4), y * (size * 4 + 1) + 1)
  }
  const ihdr = new Uint8Array(13)
  const dv = new DataView(ihdr.buffer)
  dv.setUint32(0, size)
  dv.setUint32(4, size)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
  return new Uint8Array([...sig, ...chunk('IHDR', ihdr), ...chunk('IDAT', deflateSync(raw)), ...chunk('IEND', new Uint8Array())])
}

function draw(size: number, maskable: boolean): Uint8Array {
  const px = new Uint8Array(size * size * 4)
  const c = size / 2
  const pad = maskable ? 0 : size * 0.08
  const radius = maskable ? 0 : size * 0.2
  const ringR = size * (maskable ? 0.27 : 0.3)
  const ringW = size * 0.045
  const sealR = size * 0.07
  const sealX = c + ringR * 0.72
  const sealY = c + ringR * 0.72
  const set = (i: number, r: number, g: number, b: number, a = 255) => {
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      // rounded square mask
      const dx = Math.max(pad + radius - x, x - (size - pad - radius), 0)
      const dy = Math.max(pad + radius - y, y - (size - pad - radius), 0)
      const inside = maskable || (x >= pad && x < size - pad && y >= pad && y < size - pad && dx * dx + dy * dy <= radius * radius)
      if (!inside) { set(i, 0, 0, 0, 0); continue }
      // ink background with a faint vignette
      const d = Math.hypot(x - c, y - c) / c
      const shade = Math.round(15 + 10 * (1 - d))
      set(i, shade, shade + 2, shade + 6)
      // gold ring
      const dr = Math.abs(Math.hypot(x - c, y - c) - ringR)
      if (dr < ringW) {
        const t = 1 - dr / ringW
        set(i, Math.round(shade + (201 - shade) * t), Math.round(shade + (162 - shade) * t), Math.round(shade + (39 - shade) * t))
      }
      // vermilion seal
      if (Math.hypot(x - sealX, y - sealY) < sealR) set(i, 179, 38, 30)
    }
  }
  return px
}

mkdirSync('public/icons', { recursive: true })
for (const [name, size, maskable] of [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, true],
] as const) {
  writeFileSync(`public/icons/${name}`, encodePng(size, draw(size, maskable)))
  console.log(`wrote public/icons/${name}`)
}
