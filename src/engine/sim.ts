import { DUNGEONS } from '@/content/dungeons'
import { RECIPES } from '@/content/recipes'
import { REALMS } from '@/content/realms'
import { TECHNIQUES } from '@/content/techniques'
import { canStartAlchemy, collectAlchemy, isAlchemyReady, startAlchemy } from './alchemy'
import { attemptBreakthrough, canBreakthrough, getBreakthroughChance, isLifespanExceeded, meditate } from './cultivation'
import { getPendingEvent, isChoiceAvailable, resolveEvent, rollEvent, shouldRollEvent } from './events'
import { canStartExpedition, completeExpedition, isExpeditionReady, startExpedition } from './expedition'
import { canGather, gather } from './gather'
import { getItemCount } from './inventory'
import { usePill } from './pills'
import { createSeededRng } from './rng'
import { createInitialState } from './state'
import { canUpgradeTechnique, upgradeTechnique } from './techniques'
import { tick } from './tick'
import { canUseTribulationPill, resolveBolt } from './tribulation'
import type { GameState } from './types'

export interface SimOptions {
  seed?: number
  /** Simulated real seconds. */
  seconds: number
  /** Simulation step in seconds. */
  stepSec?: number
  /** Meditate taps per second while "active" (first `activeSeconds`). */
  tapsPerSec?: number
  activeSeconds?: number
  /** Resolve random events automatically (first available choice). */
  events?: boolean
}

export interface SimResult {
  final: GameState
  /** Real seconds at which each realm index was first reached. */
  reachedAt: Record<number, number>
  breakthroughFails: number
  tribulationFails: number
}

/** Greedy bot: a reasonable active player with no cheese. Deterministic per seed. */
export function simulate(opts: SimOptions): SimResult {
  const rng = createSeededRng(opts.seed ?? 1)
  const step = opts.stepSec ?? 1
  const taps = opts.tapsPerSec ?? 0
  const activeSec = opts.activeSeconds ?? 0
  let s = createInitialState(0)
  const reachedAt: Record<number, number> = { 0: 0 }
  let t = 0

  while (t < opts.seconds && !isLifespanExceeded(s)) {
    s = tick(s, step * 1000)
    t += step

    if (opts.events && shouldRollEvent(s)) s = rollEvent(s, rng)
    if (opts.events && s.pendingEvent) {
      const ev = getPendingEvent(s)
      const choice = ev?.choices.find((c) => isChoiceAvailable(s, c))
      if (ev && choice) {
        const r = resolveEvent(s, choice.id, rng)
        if (r.ok) s = r.state.state
      }
    }

    if (t <= activeSec && taps > 0) for (let i = 0; i < taps * step; i++) s = meditate(s)

    // Tribulation in progress: pill if available, else tank.
    while (s.tribulation) {
      const r = resolveBolt(s, canUseTribulationPill(s) ? 'pill' : 'tank', rng)
      if (!r.ok) break
      s = r.state.state
    }

    if (canBreakthrough(s)) {
      // Pop a breakthrough pill when the odds are poor.
      if (getBreakthroughChance(s) < 0.8 && s.pendingBreakthroughBonus === 0) {
        for (const id of ['kim-nguyen-dan', 'pha-canh-dan']) {
          if (getItemCount(s, id) > 0) {
            const r = usePill(s, id)
            if (r.ok) s = r.state
            break
          }
        }
      }
      s = attemptBreakthrough(s, rng).state
      while (s.tribulation) {
        const r = resolveBolt(s, canUseTribulationPill(s) ? 'pill' : 'tank', rng)
        if (!r.ok) break
        s = r.state.state
      }
      if (reachedAt[s.realmIndex] === undefined) reachedAt[s.realmIndex] = t
    }

    // Techniques: qi rate first, then breakthrough, then the rest.
    for (const def of [...TECHNIQUES].sort((a, b) => rank(a.effect) - rank(b.effect))) {
      if (canUpgradeTechnique(s, def.id)) {
        const r = upgradeTechnique(s, def.id)
        if (r.ok) s = r.state
      }
    }

    if (canGather(s)) {
      const r = gather(s, rng)
      if (r.ok) s = r.state.state
    }

    if (isAlchemyReady(s)) {
      const r = collectAlchemy(s, rng)
      if (r.ok) s = r.state.state
    }
    if (!s.alchemy) {
      for (const recipe of [...RECIPES].reverse()) {
        if (canStartAlchemy(s, recipe.id)) {
          const r = startAlchemy(s, recipe.id)
          if (r.ok) s = r.state
          break
        }
      }
    }
    if (getItemCount(s, 'ngung-than-dan') > 0 && !s.buffs.some((b) => b.id === 'ngung-than-dan')) {
      const r = usePill(s, 'ngung-than-dan')
      if (r.ok) s = r.state
    }

    if (isExpeditionReady(s)) {
      const r = completeExpedition(s, rng)
      if (r.ok) s = r.state.state
    }
    if (!s.expedition) {
      for (const d of [...DUNGEONS].reverse()) {
        if (canStartExpedition(s, d.id)) {
          const r = startExpedition(s, d.id)
          if (r.ok) s = r.state
          break
        }
      }
    }
  }

  return {
    final: s,
    reachedAt,
    breakthroughFails: s.stats.breakthroughFailures,
    tribulationFails: s.stats.tribulationsFailed,
  }
}

function rank(effect: string): number {
  return ['qiRateMult', 'breakthroughBonus', 'meditateSeconds', 'stoneRateMult', 'failPenaltyMult', 'offlineCapHours'].indexOf(effect)
}

export function formatReachedTable(r: SimResult): string {
  return Object.entries(r.reachedAt)
    .map(([idx, sec]) => `${REALMS[Number(idx)].name.padEnd(22)} ${fmt(sec)}`)
    .join('\n')
}

function fmt(sec: number): string {
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${(sec / 60).toFixed(1)} phút`
  if (sec < 86400) return `${(sec / 3600).toFixed(1)} giờ`
  return `${(sec / 86400).toFixed(1)} ngày`
}
