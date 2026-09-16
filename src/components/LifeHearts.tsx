interface Props {
  total: number
  remaining: number
}

export function LifeHearts({ total, remaining }: Props) {
  return (
    <div className="flex items-center gap-1" aria-label={`ライフ ${remaining}/${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`text-xl ${i < remaining ? 'opacity-100' : 'opacity-25'}`}>
          {i < remaining ? '💗' : '🤍'}
        </span>
      ))}
    </div>
  )
}
