import type { AppData } from './types'
import { dateStr, daysBetween, monthKey } from './date'

export interface SavingsSummary {
  totalDaysRecorded: number
  moneySavedTotal: number
  hoursSavedTotal: number
  last7DaysRecorded: number
  moneySavedLast7Days: number
  hoursSavedLast7Days: number
  /** 今月すでに記録できた日数 */
  thisMonthRecorded: number
  /** 設定されている「以前は月に何日行っていたか」との比較用 */
  pastFrequencyPerMonth: number
}

export function computeSavings(data: AppData, now: Date = new Date()): SavingsSummary {
  const today = dateStr(now)
  const currentMonthKey = monthKey(now)
  const { pastFrequencyPerMonth, costPerOccurrence, hoursPerOccurrence } = data.settings

  // A "resisted day" only avoided a real occurrence with probability
  // pastFrequencyPerMonth/30 — e.g. a gambling habit that used to happen
  // 8 days/month shouldn't be credited as if every resisted day was a save.
  const occurrenceRate = pastFrequencyPerMonth / 30

  const totalDaysRecorded = data.records.length
  const last7DaysRecorded = data.records.filter((r) => {
    const diff = daysBetween(r.date, today)
    return diff >= 0 && diff < 7
  }).length
  const thisMonthRecorded = data.records.filter((r) => r.date.slice(0, 7) === currentMonthKey).length

  const occurrencesAvoidedTotal = totalDaysRecorded * occurrenceRate
  const occurrencesAvoidedLast7Days = last7DaysRecorded * occurrenceRate

  return {
    totalDaysRecorded,
    moneySavedTotal: occurrencesAvoidedTotal * costPerOccurrence,
    hoursSavedTotal: occurrencesAvoidedTotal * hoursPerOccurrence,
    last7DaysRecorded,
    moneySavedLast7Days: occurrencesAvoidedLast7Days * costPerOccurrence,
    hoursSavedLast7Days: occurrencesAvoidedLast7Days * hoursPerOccurrence,
    thisMonthRecorded,
    pastFrequencyPerMonth,
  }
}
