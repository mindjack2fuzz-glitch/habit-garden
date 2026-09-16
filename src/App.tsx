import { useState } from 'react'
import { useAppData } from './hooks/useAppData'
import { growthProgress, graceHoursLeft, hasRecordedToday } from './logic/lifeCycle'
import { computeSavings } from './logic/savings'
import { GardenView } from './components/GardenView'
import { LifeHearts } from './components/LifeHearts'
import { GraceBanner } from './components/GraceBanner'
import { RecordButton } from './components/RecordButton'
import { StatsPanel } from './components/StatsPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { HistoryList } from './components/HistoryList'
import { GardenHistoryStrip } from './components/GardenHistoryStrip'

function App() {
  const { data, record, updateSettings, resetAll, lastEvents, clearLastEvents } = useAppData()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')

  const now = new Date()
  const progress = growthProgress(data, now)
  const hoursLeft = graceHoursLeft(data, now)
  const done = hasRecordedToday(data, now)
  const inGrace = !!data.life.graceDeadline
  const savings = computeSavings(data, now)

  const showGameOverToast = lastEvents.includes('game_over')
  const showBloomToast = lastEvents.includes('flower_bloomed')

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-10">
      <header className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
        <h1 className="text-lg font-bold">🌷 そだてぐらし</h1>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="text-[var(--color-clay-soft)] text-sm border border-[var(--color-cream-dark)] rounded-full px-3 py-1"
        >
          設定
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 flex flex-col gap-4">
        {(showGameOverToast || showBloomToast) && (
          <div
            className="bg-white border border-[var(--color-cream-dark)] rounded-2xl px-4 py-3 text-sm flex justify-between items-start gap-2"
          >
            <p>
              {showGameOverToast &&
                '救済期間が過ぎてしまい、今育てていた花は種からやり直しになりました。でも積み重ねた庭はそのまま残っています。また今日から始めましょう。'}
              {showBloomToast && !showGameOverToast && '🎉 花が咲きました!次の季節の花を育てましょう。'}
            </p>
            <button type="button" onClick={clearLastEvents} className="text-[var(--color-clay-soft)] shrink-0">
              ✕
            </button>
          </div>
        )}

        {inGrace && <GraceBanner hoursLeft={hoursLeft} />}

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[var(--color-cream-dark)] flex flex-col items-center gap-3">
          <LifeHearts total={data.settings.monthlyLives} remaining={data.life.livesRemaining} />
          <GardenView flowerIndex={data.cycle.flowerIndex} progress={progress} />
          <GardenHistoryStrip history={data.gardenHistory} currentFlowerIndex={data.cycle.flowerIndex} />
        </div>

        <div className="flex flex-col items-center gap-3 bg-white rounded-3xl p-5 shadow-sm border border-[var(--color-cream-dark)]">
          <RecordButton done={done} onComplete={() => record(noteDraft || undefined)} />
          {!done && (
            <input
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="今日の気分・ひとことメモ(任意)"
              className="w-full rounded-xl border border-[var(--color-cream-dark)] px-3 py-2 text-sm"
            />
          )}
        </div>

        <StatsPanel savings={savings} targetName={data.settings.targetName} />

        <div>
          <h3 className="font-bold text-[var(--color-clay)] mb-2 text-sm">最近の記録</h3>
          <HistoryList records={data.records} />
        </div>
      </main>

      {settingsOpen && (
        <SettingsPanel
          settings={data.settings}
          onSave={updateSettings}
          onResetAll={() => {
            resetAll()
            setSettingsOpen(false)
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default App
