import { FLOWER_DEFS } from '../logic/types'

interface Props {
  flowerIndex: number
  progress: number // 0..1
}

function stageLabel(progress: number): string {
  if (progress < 0.12) return '種'
  if (progress < 0.4) return '芽'
  if (progress < 0.75) return 'つぼみ'
  if (progress < 1) return '開花'
  return '満開'
}

function lighten(hex: string, amount: number): string {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.min(255, ((n >> 16) & 255) + amount)
  const g = Math.min(255, ((n >> 8) & 255) + amount)
  const b = Math.min(255, (n & 255) + amount)
  return `rgb(${r}, ${g}, ${b})`
}

const SPARKLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const RAY_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30)

export function GardenView({ flowerIndex, progress }: Props) {
  const flower = FLOWER_DEFS[flowerIndex]
  const stemHeight = 20 + progress * 90
  const showLeaves = progress >= 0.12
  const showBud = progress >= 0.4
  const bloomAmount = Math.max(0, Math.min(1, (progress - 0.75) / 0.25))
  const isFullBloom = progress >= 1

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 190" className="w-64 h-56 sway overflow-visible">
        {/* pot */}
        <path d="M60 160 L140 160 L132 180 L68 180 Z" fill="#c98a5e" />
        <rect x="55" y="150" width="90" height="14" rx="4" fill="#e0a877" />
        {/* soil */}
        <ellipse cx="100" cy="154" rx="38" ry="6" fill="#8a6a4d" />

        {progress < 0.05 ? (
          <ellipse cx="100" cy="150" rx="4" ry="3" fill="#6b5b4d" />
        ) : (
          <g>
            {/* stem */}
            <line
              x1="100"
              y1="153"
              x2="100"
              y2={153 - stemHeight}
              stroke="var(--color-leaf)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* leaves */}
            {showLeaves && (
              <>
                <path
                  d={`M100 ${153 - stemHeight * 0.4} C 80 ${153 - stemHeight * 0.4 - 6}, 75 ${153 - stemHeight * 0.4 - 20}, 92 ${153 - stemHeight * 0.4 - 18} Z`}
                  fill="var(--color-leaf-light)"
                />
                <path
                  d={`M100 ${153 - stemHeight * 0.65} C 120 ${153 - stemHeight * 0.65 - 6}, 125 ${153 - stemHeight * 0.65 - 20}, 108 ${153 - stemHeight * 0.65 - 18} Z`}
                  fill="var(--color-leaf-light)"
                />
              </>
            )}
            {/* bud / flower */}
            {showBud && (
              <g transform={`translate(100 ${153 - stemHeight})`}>
                {bloomAmount < 0.05 ? (
                  <circle r="8" fill={flower.accent} />
                ) : isFullBloom ? (
                  <g>
                    {/* radiant glow behind the flower */}
                    <circle r="34" fill={flower.color} opacity="0.25" className="pulse-glow" />
                    <circle r="24" fill="#fff6d6" opacity="0.45" className="pulse-glow" />

                    {/* starburst rays */}
                    <g className="spin-slow" opacity="0.55">
                      {RAY_ANGLES.map((angle) => (
                        <rect
                          key={angle}
                          x={-1}
                          y={-30}
                          width="2"
                          height="14"
                          fill="#ffe9a8"
                          transform={`rotate(${angle})`}
                        />
                      ))}
                    </g>

                    {/* outer petal layer, large */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <ellipse
                        key={`outer-${angle}`}
                        cx={0}
                        cy={-15}
                        rx={7}
                        ry={13}
                        fill={lighten(flower.color, 18)}
                        transform={`rotate(${angle})`}
                        opacity={0.95}
                      />
                    ))}
                    {/* middle petal layer, offset rotation */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
                      <ellipse
                        key={`mid-${angle}`}
                        cx={0}
                        cy={-11}
                        rx={5.5}
                        ry={10}
                        fill={flower.color}
                        transform={`rotate(${angle})`}
                      />
                    ))}
                    {/* inner petal layer, small and bright */}
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <ellipse
                        key={`inner-${angle}`}
                        cx={0}
                        cy={-6}
                        rx={3.5}
                        ry={6}
                        fill={lighten(flower.color, 35)}
                        transform={`rotate(${angle})`}
                        opacity={0.95}
                      />
                    ))}
                    {/* stamen center */}
                    <circle r="5.5" fill={flower.accent} />
                    <circle r="2.5" fill="#fff6d6" />

                    {/* sparkles */}
                    {SPARKLE_ANGLES.map((angle, i) => {
                      const rad = (angle * Math.PI) / 180
                      const dist = 26 + (i % 2) * 6
                      const x = Math.cos(rad) * dist
                      const y = Math.sin(rad) * dist - 14
                      return (
                        <g key={`spark-${angle}`} transform={`translate(${x} ${y})`} className="twinkle" style={{ animationDelay: `${i * 0.22}s` }}>
                          <path d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z" fill="#fff2b8" />
                        </g>
                      )
                    })}
                  </g>
                ) : (
                  <>
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <ellipse
                        key={angle}
                        cx={0}
                        cy={-10 * bloomAmount}
                        rx={4 + 5 * bloomAmount}
                        ry={3 + 8 * bloomAmount}
                        fill={flower.color}
                        transform={`rotate(${angle})`}
                        opacity={0.95}
                      />
                    ))}
                    <circle r={4 + 3 * bloomAmount} fill={flower.accent} />
                  </>
                )}
              </g>
            )}
          </g>
        )}
      </svg>
      <div className="text-sm text-[var(--color-clay-soft)] mt-1">
        {flower.name} ・ {stageLabel(progress)} ・ {Math.round(progress * 100)}%
      </div>
    </div>
  )
}
