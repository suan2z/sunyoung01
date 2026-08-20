import type { Weather } from '../types'

const WEATHER_OPTIONS: Weather[] = ['맑음', '비', '눈', '무더움']

interface Props {
  briefingText: string
  weather: Weather
  sleepShort: boolean
  onWeatherChange: (w: Weather) => void
  onSleepShortChange: (v: boolean) => void
  onAccept: () => void
  onDismiss: () => void
}

export default function MorningBriefingModal({
  briefingText,
  weather,
  sleepShort,
  onWeatherChange,
  onSleepShortChange,
  onAccept,
  onDismiss,
}: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <h2>오늘 아침 브리핑 ☀️</h2>
        <p>{briefingText}</p>

        <label>오늘 날씨</label>
        <div className="chip-group">
          {WEATHER_OPTIONS.map((w) => (
            <div key={w} className={`chip ${weather === w ? 'selected' : ''}`} onClick={() => onWeatherChange(w)}>
              {w}
            </div>
          ))}
        </div>

        <label>수면</label>
        <div className="chip-group">
          <div className={`chip ${sleepShort ? 'selected' : ''}`} onClick={() => onSleepShortChange(!sleepShort)}>
            잠을 충분히 못 잤어요
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-secondary" onClick={onDismiss}>
            원래대로
          </button>
          <button className="btn btn-primary" onClick={onAccept}>
            AI 추천안 수락
          </button>
        </div>
      </div>
    </div>
  )
}
