interface Props {
  hoursLeft: number
}

export function GraceBanner({ hoursLeft }: Props) {
  const h = Math.floor(hoursLeft)
  const m = Math.floor((hoursLeft - h) * 60)
  return (
    <div className="bg-[var(--color-petal-red)]/20 border border-[var(--color-petal-red)] text-[var(--color-clay)] rounded-2xl px-4 py-3 text-sm leading-relaxed">
      <p className="font-bold mb-0.5">🌱 庭がしおれかけています</p>
      <p>
        あと <span className="font-bold">{h}時間{m}分</span> 以内に記録すると、ライフが1つ戻って庭は元気になります。
        今すぐ「みずやり」してみましょう。
      </p>
    </div>
  )
}
