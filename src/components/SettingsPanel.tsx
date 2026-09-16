import { useState } from 'react'
import type { Settings } from '../logic/types'

interface Props {
  settings: Settings
  onSave: (patch: Partial<Settings>) => void
  onResetAll: () => void
  onClose: () => void
}

export function SettingsPanel({ settings, onSave, onResetAll, onClose }: Props) {
  const [form, setForm] = useState(settings)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const submit = () => {
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">設定</h2>

        <label className="block mb-3">
          <span className="text-sm text-[var(--color-clay-soft)]">依存対象の名前</span>
          <input
            className="mt-1 w-full rounded-xl border border-[var(--color-cream-dark)] px-3 py-2"
            value={form.targetName}
            onChange={(e) => setForm({ ...form, targetName: e.target.value })}
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-[var(--color-clay-soft)]">月のライフ数</span>
          <input
            type="number"
            min={1}
            max={31}
            className="mt-1 w-full rounded-xl border border-[var(--color-cream-dark)] px-3 py-2"
            value={form.monthlyLives}
            onChange={(e) => setForm({ ...form, monthlyLives: Number(e.target.value) || 1 })}
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-[var(--color-clay-soft)]">以前は月に何日くらい行っていたか(日)</span>
          <input
            type="number"
            min={1}
            max={31}
            className="mt-1 w-full rounded-xl border border-[var(--color-cream-dark)] px-3 py-2"
            value={form.pastFrequencyPerMonth}
            onChange={(e) => setForm({ ...form, pastFrequencyPerMonth: Number(e.target.value) || 1 })}
          />
          <span className="text-xs text-[var(--color-clay-soft)]">
            毎日のスマホ・SNSなら30、月数回のギャンブルなどはその日数を入力してください
          </span>
        </label>

        <label className="block mb-3">
          <span className="text-sm text-[var(--color-clay-soft)]">1回あたりに使っていた金額(円)</span>
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-xl border border-[var(--color-cream-dark)] px-3 py-2"
            value={form.costPerOccurrence}
            onChange={(e) => setForm({ ...form, costPerOccurrence: Number(e.target.value) || 0 })}
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm text-[var(--color-clay-soft)]">1回あたりに費やしていた時間(時間)</span>
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-xl border border-[var(--color-cream-dark)] px-3 py-2"
            value={form.hoursPerOccurrence}
            onChange={(e) => setForm({ ...form, hoursPerOccurrence: Number(e.target.value) || 0 })}
          />
        </label>

        <button
          type="button"
          onClick={submit}
          className="w-full bg-[var(--color-leaf)] text-white rounded-xl py-2.5 font-bold mb-3"
        >
          保存する
        </button>

        <button type="button" onClick={onClose} className="w-full text-[var(--color-clay-soft)] py-2 mb-4">
          キャンセル
        </button>

        <div className="border-t border-[var(--color-cream-dark)] pt-4">
          {!confirmingReset ? (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="text-sm text-[var(--color-petal-red)] underline"
            >
              すべてのデータをリセットする
            </button>
          ) : (
            <div className="text-sm">
              <p className="mb-2">本当にすべてリセットしますか?この操作は取り消せません。</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onResetAll}
                  className="bg-[var(--color-petal-red)] text-white rounded-lg px-3 py-1.5"
                >
                  リセットする
                </button>
                <button type="button" onClick={() => setConfirmingReset(false)} className="px-3 py-1.5">
                  やめる
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
