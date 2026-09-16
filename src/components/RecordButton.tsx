import { useRef, useState } from 'react'

const HOLD_MS = 900

interface Props {
  done: boolean
  onComplete: () => void
}

export function RecordButton({ done, onComplete }: Props) {
  const [pressing, setPressing] = useState(false)
  const [justWatered, setJustWatered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = () => {
    if (done) return
    setPressing(true)
    timerRef.current = setTimeout(() => {
      setPressing(false)
      setJustWatered(true)
      onComplete()
      setTimeout(() => setJustWatered(false), 900)
    }, HOLD_MS)
  }

  const cancel = () => {
    setPressing(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={done}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative w-32 h-32 rounded-full flex items-center justify-center text-4xl select-none overflow-hidden
          border-4 transition-colors
          ${done ? 'bg-[var(--color-leaf-light)] border-[var(--color-leaf)] cursor-default' : 'bg-white border-[var(--color-leaf-light)] active:border-[var(--color-leaf)]'}`}
        style={{ touchAction: 'none' }}
        aria-label={done ? '今日は記録済みです' : '長押しでみずやり'}
      >
        <span
          className="absolute inset-0 bg-[var(--color-leaf-light)] origin-bottom"
          style={{
            transform: pressing ? 'scaleY(1)' : 'scaleY(0)',
            transition: pressing ? `transform ${HOLD_MS}ms linear` : 'transform 150ms ease-out',
          }}
        />
        <span className="relative z-10">{done ? '✅' : justWatered ? '💧' : '🪴'}</span>
      </button>
      <p className="text-sm text-[var(--color-clay-soft)]">
        {done ? '今日はもう記録したよ' : '長押しして「みずやり」'}
      </p>
    </div>
  )
}
