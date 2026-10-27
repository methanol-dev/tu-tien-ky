import { EVENTS, type EventEffect } from '@/content/events'
import { ITEM_BY_ID } from '@/content/items'
import { TECHNIQUES } from '@/content/techniques'
import { getRealm } from './cultivation'
import { getStoneRate } from './economy'
import { addItems, removeItems } from './inventory'
import { pushLog } from './log'
import { isTechniqueUnlocked } from './techniques'
import type { GameState, Rng } from './types'

function addStonesSigned(state: GameState, delta: number): GameState {
  const stones = Math.max(0, state.stones + delta)
  const earned = Math.max(0, delta)
  return { ...state, stones, stats: { ...state.stats, stonesTotal: state.stats.stonesTotal + earned } }
}

export function applyEffect(state: GameState, fx: EventEffect, rng: Rng): GameState {
  switch (fx.type) {
    case 'qi': {
      const delta = getRealm(state).qiRequired * fx.fraction
      const qi = Math.max(0, state.qi + delta)
      return { ...state, qi, stats: { ...state.stats, qiTotal: state.stats.qiTotal + Math.max(0, delta) } }
    }
    case 'qiLoss':
      return { ...state, qi: state.qi * (1 - Math.min(1, Math.max(0, fx.fraction))) }
    case 'stones':
      return addStonesSigned(state, getStoneRate(state) * fx.seconds)
    case 'stonesFraction':
      return addStonesSigned(state, state.stones * fx.fraction)
    case 'item':
      if (fx.count >= 0) return addItems(state, { [fx.id]: fx.count })
      return removeItems(state, { [fx.id]: Math.min(-fx.count, state.inventory[fx.id] ?? 0) })
    case 'buff': {
      const others = state.buffs.filter((b) => b.id !== fx.id && b.expiresAtMs > state.playedMs)
      const buff = { id: fx.id, name: fx.name, qiRateMult: fx.mult, expiresAtMs: state.playedMs + fx.durationMs }
      return { ...state, buffs: [...others, buff] }
    }
    case 'breakthroughBonus':
      return { ...state, pendingBreakthroughBonus: Math.max(state.pendingBreakthroughBonus, fx.bonus) }
    case 'lifespan':
      return { ...state, lifespanBonusYears: state.lifespanBonusYears + fx.years }
    case 'technique': {
      const candidates = fx.id
        ? TECHNIQUES.filter((t) => t.id === fx.id)
        : TECHNIQUES.filter((t) => isTechniqueUnlocked(state, t) && (state.techniques[t.id] ?? 0) < t.maxLevel)
      // Nothing to learn: fall back to a consolation purse so the outcome is never empty.
      if (candidates.length === 0) return addStonesSigned(state, getStoneRate(state) * 300)
      const t = candidates[Math.floor(rng() * candidates.length)]
      const level = Math.min(t.maxLevel, (state.techniques[t.id] ?? 0) + fx.levels)
      const next = { ...state, techniques: { ...state.techniques, [t.id]: level } }
      return pushLog(next, `${t.name} đạt tầng ${level}.`, 'success')
    }
    case 'flag':
      return { ...state, flags: { ...state.flags, [fx.key]: fx.value } }
  }
}

/** Content sanity check used by tests. Returns a list of problems (empty = ok). */
export function validateEvents(): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const e of EVENTS) {
    if (ids.has(e.id)) errors.push(`duplicate event id ${e.id}`)
    ids.add(e.id)
    if (e.weight <= 0) errors.push(`${e.id}: weight must be > 0`)
    if (e.choices.length === 0) errors.push(`${e.id}: no choices`)
    for (const c of e.choices) {
      if (c.outcomes.length === 0) errors.push(`${e.id}/${c.id}: no outcomes`)
      for (const o of c.outcomes) {
        if (o.weight <= 0) errors.push(`${e.id}/${c.id}: outcome weight must be > 0`)
        for (const fx of o.effects) {
          if (fx.type === 'item' && !ITEM_BY_ID[fx.id]) errors.push(`${e.id}/${c.id}: unknown item ${fx.id}`)
          if (fx.type === 'technique' && fx.id && !TECHNIQUES.some((t) => t.id === fx.id)) {
            errors.push(`${e.id}/${c.id}: unknown technique ${fx.id}`)
          }
        }
      }
      for (const id of Object.keys(c.requires?.items ?? {})) {
        if (!ITEM_BY_ID[id]) errors.push(`${e.id}/${c.id}: requires unknown item ${id}`)
      }
    }
  }
  return errors
}
