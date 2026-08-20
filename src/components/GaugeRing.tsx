interface Props {
  progress: number // 0..1
  label: string
  sublabel: string
}

export default function GaugeRing({ progress, label, sublabel }: Props) {
  const size = 96
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e8f0ff" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2f6fed"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fontSize="18" fontWeight={700} fill="#1c2333">
          {Math.round(progress * 100)}%
        </text>
      </svg>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{label}</div>
        <div className="muted">{sublabel}</div>
      </div>
    </div>
  )
}
