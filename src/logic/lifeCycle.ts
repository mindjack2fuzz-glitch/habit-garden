// Core game rules: lives, grace period, and flower growth/reset.
// Pure functions only (no I/O, no browser APIs) so this logic can be reused
// verbatim in a future React Native app — only the storage/UI layers differ.

import { daysBetween, dateStr, monthKey } from './date'
import { DAYS_PER_FLOWER, FLOWER_DEFS, type AppData, type LifeEvent } from './types'

const GRACE_PERIOD_HOURS = 24

/**
 * Re-derives life/cycle state as of `now`, given time may have passed since
 * the app was last opened. Should be called once whenever the app loads
 * (and optionally on an interval while it stays open).
 */
export function evaluate(data: AppData, now: Date = new Date()): { data: AppData; events: LifeEvent[] } {
  const events: LifeEvent[] = []
  let life = { ...data.life }
  let cycle = { ...data.cycle }
  const today = dateStr(now)
  const currentMonthKey = monthKey(now)

  // 1. A grace period is pending: check whether it has expired.
  if (life.graceDeadline) {
    if (now.getTime() > new Date(life.graceDeadline).getTime()) {
      // Missed the 24h revival window: this month's flower resets, but
      // completed flowers/history are never touched.
      events.push('game_over')
      cycle = { ...cycle, flowerStartDate: today }
      life = {
        monthKey: currentMonthKey,
        livesRemaining: data.settings.monthlyLives,
        lastRecordDate: null,
        graceDeadline: null,
      }
    }
    // Still within grace: don't deduct further lives, just wait for a record.
    return { data: { ...data, life, cycle }, events }
  }

  // 2. New month with no pending crisis: refill the life pool.
  if (life.monthKey !== currentMonthKey) {
    life = { ...life, monthKey: currentMonthKey, livesRemaining: data.settings.monthlyLives }
    events.push('month_reset')
  }

  // 3. Deduct a life for every full day that passed with no record.
  if (life.lastRecordDate) {
    const missedDays = daysBetween(life.lastRecordDate, today) - 1
    for (let i = 0; i < missedDays; i++) {
      if (life.livesRemaining <= 0) break
      life.livesRemaining -= 1
      events.push('life_lost')
      if (life.livesRemaining <= 0) {
        life.graceDeadline = new Date(now.getTime() + GRACE_PERIOD_HOURS * 60 * 60 * 1000).toISOString()
        events.push('life_zero')
        break
      }
    }
  }

  return { data: { ...data, life, cycle }, events }
}

/** Records "today" as done: waters the plant, restores life if reviving from 0. */
export function recordToday(data: AppData, now: Date = new Date(), note?: string): { data: AppData; events: LifeEvent[] } {
  const today = dateStr(now)
  const events: LifeEvent[] = []

  if (data.records.some((r) => r.date === today)) {
    // Already recorded today — allow updating the note only.
    const records = data.records.map((r) => (r.date === today ? { ...r, note } : r))
    return { data: { ...data, records }, events }
  }

  let life = { ...data.life }
  const wasInGrace = !!life.graceDeadline
  life.lastRecordDate = today
  if (wasInGrace) {
    life.livesRemaining = 1
    life.graceDeadline = null
    events.push('revived')
  }

  const records = [...data.records, { date: today, note, recordedAt: now.toISOString() }]

  let cycle = { ...data.cycle }
  let gardenHistory = data.gardenHistory
  const elapsedDays = daysBetween(cycle.flowerStartDate, today) + 1
  if (elapsedDays >= DAYS_PER_FLOWER) {
    const recordedDays = records.filter(
      (r) => daysBetween(cycle.flowerStartDate, r.date) >= 0 && daysBetween(r.date, today) >= 0
    ).length
    gardenHistory = [
      ...gardenHistory,
      { flowerIndex: cycle.flowerIndex, startDate: cycle.flowerStartDate, endDate: today, recordedDays },
    ]
    events.push('flower_bloomed')
    const nextIndex = (cycle.flowerIndex + 1) % FLOWER_DEFS.length
    const gardensCompleted = nextIndex === 0 ? cycle.gardensCompleted + 1 : cycle.gardensCompleted
    if (nextIndex === 0) events.push('garden_completed')
    cycle = { flowerIndex: nextIndex, flowerStartDate: today, gardensCompleted }
  }

  return { data: { ...data, records, life, cycle, gardenHistory }, events }
}

export function hasRecordedToday(data: AppData, now: Date = new Date()): boolean {
  return data.records.some((r) => r.date === dateStr(now))
}

export function growthProgress(data: AppData, now: Date = new Date()): number {
  const elapsed = daysBetween(data.cycle.flowerStartDate, dateStr(now))
  return Math.max(0, Math.min(1, elapsed / DAYS_PER_FLOWER))
}

export function graceHoursLeft(data: AppData, now: Date = new Date()): number {
  if (!data.life.graceDeadline) return 0
  const ms = new Date(data.life.graceDeadline).getTime() - now.getTime()
  return Math.max(0, ms / (60 * 60 * 1000))
}
