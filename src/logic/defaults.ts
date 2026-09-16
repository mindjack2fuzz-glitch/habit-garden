import type { AppData } from './types'
import { dateStr, monthKey } from './date'

export function createDefaultData(now: Date = new Date()): AppData {
  const today = dateStr(now)
  return {
    version: 1,
    createdAt: now.toISOString(),
    settings: {
      targetName: 'スマホ',
      monthlyLives: 5,
      pastFrequencyPerMonth: 30,
      costPerOccurrence: 500,
      hoursPerOccurrence: 2,
    },
    records: [],
    life: {
      monthKey: monthKey(now),
      livesRemaining: 5,
      lastRecordDate: null,
      graceDeadline: null,
    },
    cycle: {
      flowerIndex: 0,
      flowerStartDate: today,
      gardensCompleted: 0,
    },
    gardenHistory: [],
  }
}
