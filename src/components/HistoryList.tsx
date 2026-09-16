import type { RecordEntry } from '../logic/types'
import { formatJP } from '../logic/date'

interface Props {
  records: RecordEntry[]
}

export function HistoryList({ records }: Props) {
  const recent = [...records].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7)
  if (recent.length === 0) {
    return <p className="text-sm text-[var(--color-clay-soft)]">まだ記録がありません。今日から始めてみましょう。</p>
  }
  return (
    <ul className="space-y-2">
      {recent.map((r) => (
        <li key={r.date} className="flex items-start gap-2 text-sm bg-white rounded-xl px-3 py-2 border border-[var(--color-cream-dark)]">
          <span className="font-semibold whitespace-nowrap">{formatJP(r.date)}</span>
          <span className="text-[var(--color-clay-soft)]">{r.note || '記録済み'}</span>
        </li>
      ))}
    </ul>
  )
}
