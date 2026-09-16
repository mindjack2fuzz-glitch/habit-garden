// Pure date helpers. No framework/browser dependency beyond the built-in Date object,
// so this module can be reused as-is in a future React Native port.

export function dateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function monthKey(d: Date): string {
  return dateStr(d).slice(0, 7)
}

export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Whole calendar days between two YYYY-MM-DD strings (b - a), ignoring time of day. */
export function daysBetween(a: string, b: string): number {
  const da = parseDateStr(a)
  const db = parseDateStr(b)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((db.getTime() - da.getTime()) / msPerDay)
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + days)
  return copy
}

export function formatJP(s: string): string {
  const d = parseDateStr(s)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
