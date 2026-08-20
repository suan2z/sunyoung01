const LABELS = ['많이 피곤', '피곤', '보통', '좋음', '최상']

interface Props {
  value: number
  onChange: (value: number) => void
}

export default function ConditionSlider({ value, onChange }: Props) {
  return (
    <div>
      <label style={{ marginTop: 0 }}>오늘 컨디션</label>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7385' }}>
        {LABELS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  )
}
