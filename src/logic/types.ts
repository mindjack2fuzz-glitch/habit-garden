export interface Settings {
  /** 依存対象の名前(例: スマホ、ゲーム、SNS、ギャンブル) */
  targetName: string
  /** 月あたりのライフ数 */
  monthlyLives: number
  /** 以前は月に何日くらい行っていたか(毎日型の依存なら30、月数回型のギャンブルなどはそれ未満) */
  pastFrequencyPerMonth: number
  /** 依存行動 1回あたりに使っていた金額(円) */
  costPerOccurrence: number
  /** 依存行動 1回あたりに費やしていた時間(時間) */
  hoursPerOccurrence: number
}

export interface RecordEntry {
  /** YYYY-MM-DD */
  date: string
  note?: string
  /** ISO timestamp, for ordering same-day edits */
  recordedAt: string
}

export interface LifeState {
  /** YYYY-MM, the month this life pool applies to */
  monthKey: string
  livesRemaining: number
  /** YYYY-MM-DD of the last day the user recorded, or null if never */
  lastRecordDate: string | null
  /** ISO timestamp deadline for the revival grace period, or null if not in grace */
  graceDeadline: string | null
}

export const FLOWER_DEFS = [
  { key: 'spring', name: '桜', color: '#f7b6c2', accent: '#e88ba0' },
  { key: 'summer', name: 'ひまわり', color: '#ffd76b', accent: '#f5a623' },
  { key: 'autumn', name: 'コスモス', color: '#d9a8f0', accent: '#b57edc' },
  { key: 'winter', name: '寒椿', color: '#ff9aa2', accent: '#e0555f' },
] as const

export const DAYS_PER_FLOWER = 90

export interface CycleState {
  /** index into FLOWER_DEFS, 0-3 */
  flowerIndex: number
  /** YYYY-MM-DD when the current flower started growing */
  flowerStartDate: string
  /** how many full gardens (4 flowers) have been completed */
  gardensCompleted: number
}

export interface CompletedFlower {
  flowerIndex: number
  startDate: string
  endDate: string
  recordedDays: number
}

export interface AppData {
  version: 1
  createdAt: string
  settings: Settings
  records: RecordEntry[]
  life: LifeState
  cycle: CycleState
  gardenHistory: CompletedFlower[]
}

export type LifeEvent = 'month_reset' | 'life_lost' | 'life_zero' | 'game_over' | 'revived' | 'flower_bloomed' | 'garden_completed'

export interface EvaluateResult {
  data: AppData
  events: LifeEvent[]
}
