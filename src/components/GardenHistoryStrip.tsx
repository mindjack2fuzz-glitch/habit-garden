import { FLOWER_DEFS } from '../logic/types'
import type { CompletedFlower } from '../logic/types'

interface Props {
  history: CompletedFlower[]
  currentFlowerIndex: number
}

export function GardenHistoryStrip({ history, currentFlowerIndex }: Props) {
  const slots = Array.from({ length: 4 }, (_, i) => {
    const completed = [...history].reverse().find((h) => h.flowerIndex === i)
    const isCurrent = i === currentFlowerIndex
    return { i, completed, isCurrent }
  })

  return (
    <div className="flex justify-center gap-4">
      {slots.map(({ i, completed, isCurrent }) => {
        const flower = FLOWER_DEFS[i]
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${
                isCurrent ? 'border-[var(--color-leaf)]' : 'border-transparent'
              }`}
              style={{ background: completed ? flower.color : '#eee2d6' }}
            >
              {completed ? '🌸' : '·'}
            </div>
            <span className="text-[10px] text-[var(--color-clay-soft)]">{flower.name}</span>
          </div>
        )
      })}
    </div>
  )
}
