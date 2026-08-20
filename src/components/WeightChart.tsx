import type { BodyLogEntry } from '../types'

interface Props {
  logs: BodyLogEntry[]
}

export default function WeightChart({ logs }: Props) {
  if (logs.length < 2) {
    return <p className="muted">체중 기록이 2개 이상 쌓이면 변화 추이 그래프가 표시돼요.</p>
  }

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date))
  const weights = sorted.map((l) => l.weightKg)
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const range = max - min || 1

  const width = 300
  const height = 120
  const padding = 16

  const points = sorted.map((log, i) => {
    const x = padding + (i / (sorted.length - 1)) * (width - padding * 2)
    const y = height - padding - ((log.weightKg - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <polyline points={points.join(' ')} fill="none" stroke="#2f6fed" strokeWidth={2.5} />
      {sorted.map((log, i) => {
        const [x, y] = points[i].split(',').map(Number)
        return <circle key={log.date} cx={x} cy={y} r={3} fill="#2f6fed" />
      })}
    </svg>
  )
}
