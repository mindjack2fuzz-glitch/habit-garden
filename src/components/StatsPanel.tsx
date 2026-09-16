import type { SavingsSummary } from '../logic/savings'

interface Props {
  savings: SavingsSummary
  targetName: string
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString('ja-JP')}`
}

function formatHours(n: number): string {
  if (n < 1) return `${Math.round(n * 60)}分`
  const h = Math.floor(n)
  const m = Math.round((n - h) * 60)
  return m > 0 ? `${h}時間${m}分` : `${h}時間`
}

export function StatsPanel({ savings, targetName }: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--color-cream-dark)]">
      <h3 className="font-bold text-[var(--color-clay)] mb-3">{targetName}を我慢して得たもの</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--color-cream)] rounded-xl p-3">
          <p className="text-xs text-[var(--color-clay-soft)]">累計 節約金額</p>
          <p className="text-lg font-bold text-[var(--color-leaf-dark)]">{formatYen(savings.moneySavedTotal)}</p>
        </div>
        <div className="bg-[var(--color-cream)] rounded-xl p-3">
          <p className="text-xs text-[var(--color-clay-soft)]">累計 取り戻した時間</p>
          <p className="text-lg font-bold text-[var(--color-leaf-dark)]">{formatHours(savings.hoursSavedTotal)}</p>
        </div>
        <div className="bg-[var(--color-cream)] rounded-xl p-3">
          <p className="text-xs text-[var(--color-clay-soft)]">今週の節約金額</p>
          <p className="text-base font-semibold">{formatYen(savings.moneySavedLast7Days)}</p>
        </div>
        <div className="bg-[var(--color-cream)] rounded-xl p-3">
          <p className="text-xs text-[var(--color-clay-soft)]">今週の節約時間</p>
          <p className="text-base font-semibold">{formatHours(savings.hoursSavedLast7Days)}</p>
        </div>
      </div>

      <div className="mt-3 bg-[var(--color-leaf-light)]/25 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--color-clay-soft)]">今月の実績</p>
          <p className="text-base font-semibold">
            {savings.thisMonthRecorded}日 <span className="text-xs text-[var(--color-clay-soft)]">記録できた</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-clay-soft)]">以前は月に</p>
          <p className="text-base font-semibold">{savings.pastFrequencyPerMonth}日</p>
        </div>
      </div>

      <p className="text-xs text-[var(--color-clay-soft)] mt-3">
        設定した「1回あたりの金額・時間」と「以前は月に何日行っていたか」をもとに、記録した日数({savings.totalDaysRecorded}日)から自動計算しています。
      </p>
    </div>
  )
}
