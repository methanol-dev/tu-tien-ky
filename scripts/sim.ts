import { formatReachedTable, simulate } from '../src/engine/sim'

// Usage: pnpm sim [hours=24] [seed=1] [passive]
const hours = Number(process.argv[2] ?? 24)
const seed = Number(process.argv[3] ?? 1)
const passive = process.argv[4] === 'passive'

const t0 = performance.now()
const r = passive
  ? simulate({ seconds: hours * 3600, seed, tapsPerSec: 0, events: false })
  : simulate({ seconds: hours * 3600, seed, tapsPerSec: 1, activeSeconds: 600, events: true })
const ms = Math.round(performance.now() - t0)

console.log(`Sim ${hours}h ${passive ? '(passive)' : '(active)'} seed ${seed} in ${ms}ms`)
console.log(formatReachedTable(r))
const f = r.final
console.log(`\nFinal: realm ${f.realmIndex}, stones ${Math.round(f.stones)}, fails ${r.breakthroughFails}, trib fails ${r.tribulationFails}`)
console.log(`Techniques: ${JSON.stringify(f.techniques)}`)
console.log(`Inventory: ${JSON.stringify(f.inventory)}`)
console.log(`Stats: ${JSON.stringify(f.stats)}`)
