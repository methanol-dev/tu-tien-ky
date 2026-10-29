/**
 * Hành Tẩu: continuous side-scrolling auto-battle. Pure and deterministic given `rng`.
 * The world advances in fixed JOURNEY_STEP_MS steps against the played-time clock, so
 * a live 100 ms tick and an 8-hour offline catch-up produce the same kind of history.
 * No animation state lives here; the UI derives it from `phase` and `events`.
 */
import { ITEM_BY_ID } from '@/content/items'
import {
  baselineStats,
  type Difficulty,
  DIFFICULTY_NAMES,
  difficultyMult,
  enemyStats,
  MAX_DIFFICULTY,
  REGION_BY_ID,
  REGION_INDEX_BY_ID,
  REGIONS,
  type RegionDef,
  STAGES_PER_REGION,
} from '@/content/regions'
import { type CombatStats, getCombatStats, rollDamage } from './combat'
import {
  AUTO_OPEN_NORMAL_LEVEL,
  AUTO_OPEN_RED_LEVEL,
  AUTO_OPEN_TECHNIQUE,
  AUTO_STEP_DOWN_DEATHS,
  BOSS_STONE_SECONDS,
  CHEST_CAP,
  CHEST_DROP_CHANCE,
  ENEMY_ATTACK_MS,
  HERB_STAGE_CHANCE_SCALE,
  JOURNEY_BOSS_WALK_MS,
  JOURNEY_EVENT_LIMIT,
  JOURNEY_RETREAT_MAX_MULT,
  JOURNEY_RETREAT_MS,
  JOURNEY_STAGE_REGEN,
  JOURNEY_STEP_MS,
  JOURNEY_WALK_MS,
  KILL_STONE_SECONDS,
} from './constants'
import { getRealm } from './cultivation'
import { DAYS_PER_YEAR, STONE_RATE_FACTOR } from './constants'
import { isGearFull, openChests } from './gear'
import { addItems } from './inventory'
import { pushLog } from './log'
import { getModifiers, type Modifiers } from './modifiers'
import type { ActionResult, GameState, JourneyEnemy, JourneyEvent, JourneyState, Rng } from './types'

export function getRegion(state: GameState): RegionDef {
  return REGION_BY_ID[state.journey.regionId] ?? REGIONS[0]
}

export function isRegionUnlocked(state: GameState, region: RegionDef): boolean {
  return state.realmIndex >= region.minRealmIndex
}

/** Difficulty `d` opens once `d - 1` of the same region has been cleared. */
export function isDifficultyAvailable(state: GameState, regionId: string, d: Difficulty): boolean {
  if (d === 0) return true
  const cleared = state.journey.cleared[regionId]
  return cleared !== undefined && cleared >= d - 1
}

export function getRetreatMs(deaths: number): number {
  return JOURNEY_RETREAT_MS * Math.min(JOURNEY_RETREAT_MAX_MULT, 1 + 0.5 * Math.max(0, deaths - 1))
}

/** 0..1 through the current walk/retreat; 1 while fighting/resting. */
export function getPhaseProgress(state: GameState, totalMs?: number): number {
  const j = state.journey
  if (j.phase === 'fight' || j.phase === 'rest') return 1
  const total = totalMs ?? (j.phase === 'retreat' ? getRetreatMs(j.deaths) : JOURNEY_WALK_MS)
  const left = Math.max(0, j.phaseUntilMs - state.playedMs)
  return total <= 0 ? 1 : Math.min(1, 1 - left / total)
}

export function describeDifficulty(d: Difficulty): string {
  return DIFFICULTY_NAMES[d]
}

function pushEvent(j: JourneyState, ev: JourneyEvent): JourneyState {
  const events = j.events.length >= JOURNEY_EVENT_LIMIT ? j.events.slice(-(JOURNEY_EVENT_LIMIT - 1)) : j.events.slice()
  events.push(ev)
  return { ...j, events }
}

function healed(j: JourneyState): JourneyState {
  return { ...j, party: j.party.map((f) => ({ ...f, hp: f.maxHp })) }
}

/** Switch region/difficulty and start walking. Refuses locked regions and unopened difficulties. */
export function startRegion(state: GameState, regionId: string, difficulty: Difficulty): ActionResult {
  const region = REGION_BY_ID[regionId]
  if (!region) return { ok: false, error: 'Vùng không tồn tại' }
  if (!isRegionUnlocked(state, region)) return { ok: false, error: 'Cảnh giới chưa đủ để vào vùng này' }
  if (!isDifficultyAvailable(state, regionId, difficulty)) return { ok: false, error: `Phải quét sạch độ khó trước đã` }
  const j: JourneyState = healed({
    ...state.journey,
    regionId,
    difficulty,
    stage: 1,
    phase: 'walk',
    phaseUntilMs: state.playedMs + JOURNEY_WALK_MS,
    enemies: [],
    deaths: 0,
    runDeaths: 0,
  })
  return { ok: true, state: pushLog({ ...state, journey: j }, `Lên đường tới ${region.name} (${DIFFICULTY_NAMES[difficulty]}).`, 'info') }
}

export function setAutoAdvance(state: GameState, autoAdvance: boolean): GameState {
  return { ...state, journey: { ...state.journey, autoAdvance } }
}

function spawnEnemies(region: RegionDef, stage: number, d: Difficulty, now: number, rng: Rng): JourneyEnemy[] {
  const make = (t: RegionDef['boss'], i: number): JourneyEnemy => {
    const st = enemyStats(region, t, stage, d)
    return {
      id: t.id,
      name: t.name,
      silhouette: t.silhouette,
      imageUrl: t.imageUrl,
      hp: st.hp,
      maxHp: st.hp,
      atk: st.atk,
      def: st.def,
      boss: Boolean(t.boss),
      nextAttackAtMs: now + ENEMY_ATTACK_MS + i * 300,
    }
  }
  if (stage >= STAGES_PER_REGION) return [make(region.boss, 0)]
  const pick = () => region.enemies[Math.floor(rng() * region.enemies.length)]
  const count = stage % 5 === 0 ? 2 : 1
  return Array.from({ length: count }, (_, i) => make(pick(), i))
}

/** Relative "hardness" of a region/difficulty pair, used to pick the next step up. */
function hardness(region: RegionDef, d: Difficulty): number {
  return baselineStats(region.minRealmIndex).atk * difficultyMult(d)
}

/** Next harder option: the lowest uncleared difficulty of any unlocked region ahead, or one difficulty up here. */
function stepUp(state: GameState, j: JourneyState): JourneyState {
  const region = REGION_BY_ID[j.regionId]
  const current = hardness(region, j.difficulty)
  const options: { regionId: string; difficulty: Difficulty; h: number }[] = []
  for (let i = REGION_INDEX_BY_ID[j.regionId] + 1; i < REGIONS.length; i++) {
    const r = REGIONS[i]
    if (!isRegionUnlocked(state, r)) break
    const d = Math.min(MAX_DIFFICULTY, (j.cleared[r.id] ?? -1) + 1) as Difficulty
    options.push({ regionId: r.id, difficulty: d, h: hardness(r, d) })
  }
  if (j.difficulty < MAX_DIFFICULTY) {
    const d = (j.difficulty + 1) as Difficulty
    options.push({ regionId: j.regionId, difficulty: d, h: hardness(region, d) })
  }
  const harder = options.filter((o) => o.h > current).sort((a, b) => a.h - b.h)[0]
  if (!harder) return j
  return { ...j, regionId: harder.regionId, difficulty: harder.difficulty }
}

function stepDown(j: JourneyState): JourneyState {
  if (j.difficulty > 0) return { ...j, difficulty: (j.difficulty - 1) as Difficulty }
  const prev = REGIONS[REGION_INDEX_BY_ID[j.regionId] - 1]
  if (!prev) return j
  const d = Math.min(MAX_DIFFICULTY, j.cleared[prev.id] ?? 0) as Difficulty
  return { ...j, regionId: prev.id, difficulty: d }
}

function rollHerbs(region: RegionDef, boss: boolean, rng: Rng): Record<string, number> {
  const out: Record<string, number> = {}
  const scale = boss ? 1 : HERB_STAGE_CHANCE_SCALE
  for (const e of region.loot) {
    if (rng() >= e.chance * scale) continue
    const n = e.min + Math.floor(rng() * (e.max - e.min + 1))
    if (n > 0) out[e.itemId] = (out[e.itemId] ?? 0) + n
  }
  return out
}

function addStones(state: GameState, amount: number): GameState {
  if (amount <= 0) return state
  return { ...state, stones: state.stones + amount, stats: { ...state.stats, stonesTotal: state.stats.stonesTotal + amount } }
}

function syncPlayer(j: JourneyState, stats: CombatStats): JourneyState {
  const p = j.party[0]
  if (p.maxHp === stats.hp) return j
  const ratio = p.maxHp > 0 ? p.hp / p.maxHp : 1
  return { ...j, party: [{ ...p, maxHp: stats.hp, hp: Math.min(stats.hp, Math.round(stats.hp * ratio)) }, ...j.party.slice(1)] }
}

interface StepContext {
  stats: CombatStats
  stoneRate: number
  lootChanceMult: number
}

function fightStep(state: GameState, now: number, ctx: StepContext, rng: Rng): GameState {
  const { stats } = ctx
  const region = getRegion(state)
  let j = state.journey
  let s = state
  const player = { ...j.party[0] }
  const enemies = j.enemies.map((e) => ({ ...e }))

  // Player strikes the first living enemy.
  if (now >= player.nextAttackAtMs) {
    const idx = enemies.findIndex((e) => e.hp > 0)
    if (idx >= 0) {
      const e = enemies[idx]
      // Đòn đánh hưởng lợi từ xuyên giáp của phi kiếm bản mệnh
      const { dmg: baseDmg, crit } = rollDamage(stats.atk, e.def, rng, stats.crit, stats.critMult, stats.armorPen)
      let dmg = baseDmg

      // Thần thông trọng lực (Thiên Quân Áp Đỉnh): cộng sát thương theo máu đối thủ
      if (stats.heavyDmgPct > 0) {
        dmg += Math.round(e.maxHp * stats.heavyDmgPct * 0.05)
      }

      // Thần thông hành quyết (Tuyệt Cảnh Trảm Thần): trảm sát khi mục tiêu suy kiệt máu
      const hpRatio = e.hp / e.maxHp
      if (stats.executeThreshold > 0 && hpRatio <= stats.executeThreshold) {
        dmg = e.hp
      }

      e.hp = Math.max(0, e.hp - dmg)
      j = pushEvent(j, { atMs: now, kind: crit ? 'crit' : 'hit', amount: dmg, target: idx })

      // Hiệu ứng phát động phi kiếm bản mệnh
      if ((s.natalSwords?.length ?? 0) > 0 && rng() < 0.45) {
        const randomSword = s.natalSwords[Math.floor(rng() * s.natalSwords.length)]
        j = pushEvent(j, { atMs: now, kind: 'natal-sword', label: randomSword.name, target: idx })
      }

      if (stats.lifesteal > 0) player.hp = Math.min(player.maxHp, player.hp + Math.round(dmg * stats.lifesteal))
      if (state.cultivationPath === 'martial') {
        s = { ...s, punches: s.punches + 1 }
      }
      if (e.hp <= 0) {
        j = pushEvent(j, { atMs: now, kind: e.boss ? 'boss-kill' : 'kill', target: idx })
        const stoneGain = Math.max(1, Math.round(ctx.stoneRate * (e.boss ? BOSS_STONE_SECONDS : KILL_STONE_SECONDS)))
        s = addStones(s, stoneGain)
        j = pushEvent(j, { atMs: now, kind: 'loot-stone', amount: stoneGain, target: idx })

        // ================= ROLL CHIẾN LỢI PHẨM RƠI TỪ QUÁI / BOSS =================
        const itemsGained: Record<string, number> = {}

        if (e.boss) {
          // Boss chắc chắn rơi 1..3 Tuyết Hoa Tiền
          const tuyetHoa = 1 + Math.floor(rng() * 3)
          itemsGained['tuyet-hoa-tien'] = tuyetHoa
          j = pushEvent(j, { atMs: now, kind: 'loot-item', itemId: 'tuyet-hoa-tien', amount: tuyetHoa, target: idx })

          // Boss ải cao hoặc độ khó cao rơi Tiểu Thử Tiền
          if ((region.tier >= 4 || j.difficulty >= 2) && rng() < 0.25 * ctx.lootChanceMult) {
            itemsGained['tieu-thu-tien'] = 1
            j = pushEvent(j, { atMs: now, kind: 'loot-item', itemId: 'tieu-thu-tien', amount: 1, target: idx })
          }
          // Boss cực khó rơi Cốc Vũ Tiền
          if (region.tier >= 6 && j.difficulty >= 3 && rng() < 0.1 * ctx.lootChanceMult) {
            itemsGained['coc-vu-tien'] = 1
            j = pushEvent(j, { atMs: now, kind: 'loot-item', itemId: 'coc-vu-tien', amount: 1, target: idx })
          }

          // Boss có tỷ lệ rớt Sách Bí Tịch Thần Thông Độc Quyền
          if (region.namedManual && rng() < region.namedManual.chance * ctx.lootChanceMult * (1 + 0.25 * j.difficulty)) {
            const manualId = region.namedManual.itemId
            itemsGained[manualId] = 1
            j = pushEvent(j, { atMs: now, kind: 'loot-manual', itemId: manualId, target: idx })
            const manualName = ITEM_BY_ID[manualId]?.name ?? manualId
            s = pushLog(s, `Trấn sát ${e.name}, kinh hiện thiên cổ bí tịch: ${manualName}!`, 'success')
          }
        } else {
          // Quái thường: xác suất rơi Tuyết Hoa Tiền
          if (rng() < 0.04 * ctx.lootChanceMult) {
            itemsGained['tuyet-hoa-tien'] = 1
            j = pushEvent(j, { atMs: now, kind: 'loot-item', itemId: 'tuyet-hoa-tien', amount: 1, target: idx })
          }

          // Quái thường: xác suất rơi dược liệu / yêu đan theo vùng
          if (region.loot.length > 0 && rng() < 0.25 * ctx.lootChanceMult) {
            const picked = region.loot[Math.floor(rng() * region.loot.length)]
            if (picked) {
              itemsGained[picked.itemId] = 1
              j = pushEvent(j, { atMs: now, kind: 'loot-item', itemId: picked.itemId, amount: 1, target: idx })
            }
          }

          // Quái thường ở độ khó Tuyệt có cơ may nhỏ nhặt được tàn quyển
          if (j.difficulty === 3 && region.namedManual && rng() < 0.01 * ctx.lootChanceMult) {
            const manualId = region.namedManual.itemId
            itemsGained[manualId] = 1
            j = pushEvent(j, { atMs: now, kind: 'loot-manual', itemId: manualId, target: idx })
            s = pushLog(s, `Dã quái rơi ra tàn quyển cổ xưa: ${ITEM_BY_ID[manualId]?.name ?? manualId}!`, 'info')
          }
        }

        if (Object.keys(itemsGained).length > 0) {
          s = addItems(s, itemsGained)
        }

        const chests = { ...j.chests }
        if (e.boss) {
          chests.red = Math.min(CHEST_CAP, chests.red + 1)
          chests.normal = Math.min(CHEST_CAP, chests.normal + 1)
          j = pushEvent(j, { atMs: now, kind: 'chest', amount: 1 })
        } else if (rng() < CHEST_DROP_CHANCE * ctx.lootChanceMult) {
          chests.normal = Math.min(CHEST_CAP, chests.normal + 1)
          j = pushEvent(j, { atMs: now, kind: 'chest', amount: 0 })
        }
        j = { ...j, chests }
        s = { ...s, stats: { ...s.stats, enemiesSlain: s.stats.enemiesSlain + 1, bossesSlain: s.stats.bossesSlain + (e.boss ? 1 : 0) } }
      }
    }
    // Catch up if we fell far behind (big offline step), never more than one attack per step.
    player.nextAttackAtMs = Math.max(player.nextAttackAtMs + stats.attackMs, now + Math.round(stats.attackMs / 2))
  }

  // Enemies strike back.
  for (const e of enemies) {
    if (e.hp <= 0 || player.hp <= 0 || now < e.nextAttackAtMs) continue
    // Kiểm tra thần thông né tránh ảo ảnh (Kính Hoa Thủy Nguyệt)
    if (stats.dodgeChance > 0 && rng() < stats.dodgeChance) {
      e.nextAttackAtMs = Math.max(e.nextAttackAtMs + ENEMY_ATTACK_MS, now + ENEMY_ATTACK_MS / 2)
      continue
    }
    let { dmg } = rollDamage(e.atk, stats.def, rng)
    // Giảm sát thương nhận vào từ thần thông kết giới (Tọa Tỉnh Cấm Giới)
    if (stats.damageReduction > 0) {
      dmg = Math.max(1, Math.round(dmg * (1 - stats.damageReduction)))
    }
    player.hp = Math.max(0, player.hp - dmg)
    j = pushEvent(j, { atMs: now, kind: 'hurt', amount: dmg, target: 'player' })
    e.nextAttackAtMs = Math.max(e.nextAttackAtMs + ENEMY_ATTACK_MS, now + ENEMY_ATTACK_MS / 2)
  }

  j = { ...j, party: [player, ...j.party.slice(1)], enemies }

  if (player.hp <= 0) {
    const killer = enemies.find((e) => e.hp > 0)?.name ?? '?'
    const deaths = j.deaths + 1
    j = pushEvent({ ...j, deaths, runDeaths: j.runDeaths + 1, phase: 'retreat', phaseUntilMs: now + getRetreatMs(deaths), enemies: [] }, { atMs: now, kind: 'death', target: 'player' })
    s = pushLog({ ...s, journey: j }, `Gục ngã trước ${killer} tại ${region.name}. Lết về dưỡng thương.`, 'danger')
    if (j.autoAdvance && deaths >= AUTO_STEP_DOWN_DEATHS) {
      const down = stepDown(j)
      if (down.regionId !== j.regionId || down.difficulty !== j.difficulty) {
        j = { ...down, stage: 1, deaths: 0, runDeaths: 0 }
        s = pushLog({ ...s, journey: j }, `Lượng sức mình, lui về ${REGION_BY_ID[j.regionId].name} (${DIFFICULTY_NAMES[j.difficulty]}).`, 'info')
      }
    }
    return { ...s, journey: j }
  }

  if (enemies.every((e) => e.hp <= 0)) {
    const bossStage = j.stage >= STAGES_PER_REGION
    const herbs = rollHerbs(region, bossStage, rng)
    s = addItems(s, herbs)
    s = { ...s, stats: { ...s.stats, stagesCleared: s.stats.stagesCleared + 1 } }
    j = pushEvent(j, { atMs: now, kind: 'stage', amount: j.stage })
    const regen = bossStage ? player.maxHp : Math.round(player.maxHp * JOURNEY_STAGE_REGEN)
    j = { ...j, party: [{ ...player, hp: Math.min(player.maxHp, player.hp + regen) }, ...j.party.slice(1)], enemies: [] }

    if (bossStage) {
      const prevCleared = j.cleared[j.regionId]
      j = { ...j, cleared: { ...j.cleared, [j.regionId]: Math.max(prevCleared ?? 0, j.difficulty) } }
      j = pushEvent(j, { atMs: now, kind: 'region' })
      const summary = Object.entries(herbs).map(([id, n]) => `${n} ${ITEM_BY_ID[id]?.name ?? id}`).join(', ')
      s = pushLog({ ...s, journey: j }, `Quét sạch ${region.name} (${DIFFICULTY_NAMES[j.difficulty]})!${summary ? ` Thu được ${summary}.` : ''}`, 'success')
      if (j.autoAdvance && j.runDeaths === 0) {
        const up = stepUp(s, j)
        if (up.regionId !== j.regionId || up.difficulty !== j.difficulty) {
          j = up
          s = pushLog({ ...s, journey: j }, `Tiến lên ${REGION_BY_ID[j.regionId].name} (${DIFFICULTY_NAMES[j.difficulty]}).`, 'info')
        }
      }
      j = { ...j, stage: 1, deaths: 0, runDeaths: 0 }
    } else {
      j = { ...j, stage: j.stage + 1 }
    }
    const walk = j.stage >= STAGES_PER_REGION ? JOURNEY_BOSS_WALK_MS : JOURNEY_WALK_MS
    j = { ...j, phase: 'walk', phaseUntilMs: now + walk }
  }

  return { ...s, journey: j }
}

function autoOpen(state: GameState, rng: Rng): GameState {
  const level = state.techniques[AUTO_OPEN_TECHNIQUE] ?? 0
  if (level < AUTO_OPEN_NORMAL_LEVEL || isGearFull(state)) return state
  let s = state
  if (s.journey.chests.normal > 0) s = openChests(s, 'normal', s.journey.chests.normal, rng).state
  if (level >= AUTO_OPEN_RED_LEVEL && s.journey.chests.red > 0) s = openChests(s, 'red', s.journey.chests.red, rng).state
  return s
}

function step(state: GameState, now: number, rng: Rng): GameState {
  const region = getRegion(state)
  let j = state.journey
  // One modifier pass per step: it walks techniques, legacy and gear, so avoid repeating it.
  const mods: Modifiers = getModifiers(state)
  const realm = getRealm(state)
  const lifespanDays = (realm.lifespanYears + state.lifespanBonusYears + mods.lifespanBonusYears) * DAYS_PER_YEAR
  if (!isRegionUnlocked(state, region) || state.ageDays >= lifespanDays) {
    return j.phase === 'rest' ? state : { ...state, journey: { ...j, phase: 'rest', enemies: [] } }
  }
  const stats = getCombatStats(state)
  const ctx: StepContext = { stats, stoneRate: Math.sqrt(realm.qiRate) * STONE_RATE_FACTOR * mods.stoneRateMult, lootChanceMult: mods.lootChanceMult }
  j = syncPlayer(j, stats)
  let s: GameState = j === state.journey ? state : { ...state, journey: j }

  switch (j.phase) {
    case 'rest':
      s = { ...s, journey: healed({ ...j, phase: 'walk', phaseUntilMs: now + JOURNEY_WALK_MS }) }
      break
    case 'retreat':
      if (now >= j.phaseUntilMs) s = { ...s, journey: healed({ ...j, phase: 'walk', phaseUntilMs: now + JOURNEY_WALK_MS }) }
      break
    case 'walk':
      if (now >= j.phaseUntilMs) {
        const enemies = spawnEnemies(region, j.stage, j.difficulty, now, rng)
        const party = [{ ...j.party[0], nextAttackAtMs: now + Math.round(stats.attackMs / 2) }, ...j.party.slice(1)]
        s = { ...s, journey: { ...j, phase: 'fight', enemies, party } }
      }
      break
    case 'fight':
      s = fightStep(s, now, ctx, rng)
      break
  }
  return autoOpen(s, rng)
}

/**
 * Advance the journey by `dtMs` of played time. Call right after `tick()` (which has already
 * moved `playedMs`); steps are timestamped so that the last one lands on `state.playedMs`.
 */
export function journeyTick(state: GameState, dtMs: number, rng: Rng): GameState {
  if (dtMs <= 0) return state
  if (state.pendingEvent && state.settings.pauseOnEvent) return state
  const acc = state.journey.accMs + dtMs
  const steps = Math.floor(acc / JOURNEY_STEP_MS)
  const rest = acc - steps * JOURNEY_STEP_MS
  let s: GameState = { ...state, journey: { ...state.journey, accMs: rest } }
  for (let i = 0; i < steps; i++) {
    const now = state.playedMs - rest - (steps - 1 - i) * JOURNEY_STEP_MS
    s = step(s, Math.max(0, now), rng)
  }
  return s
}

/** Content sanity check used by tests. */
export function validateRegions(): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  REGIONS.forEach((r, i) => {
    if (ids.has(r.id)) errors.push(`duplicate region id ${r.id}`)
    ids.add(r.id)
    if (r.enemies.length === 0) errors.push(`${r.id}: no enemies`)
    if (!r.boss.boss) errors.push(`${r.id}: boss template not flagged boss`)
    for (const l of r.loot) if (!ITEM_BY_ID[l.itemId]) errors.push(`${r.id}: unknown loot ${l.itemId}`)
    if (i > 0 && r.minRealmIndex < REGIONS[i - 1].minRealmIndex) errors.push(`${r.id}: regions must be ordered by realm`)
    if (r.tier !== i + 1) errors.push(`${r.id}: tier should be ${i + 1}`)
  })
  return errors
}
