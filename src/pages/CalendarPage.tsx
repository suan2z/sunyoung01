import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { useAppData, todayKey } from '../context/AppDataContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { StampLog } from '../types'

const STAMP_ICONS: { key: keyof Omit<StampLog, 'date'>; icon: string }[] = [
  { key: 'exercise', icon: '🏋️' },
  { key: 'walk', icon: '🚶' },
  { key: 'meal', icon: '🍎' },
  { key: 'sleep', icon: '🌙' },
]

const STATUS_ICON: Record<string, string> = {
  completed: '✅',
  smart_recovery: '🛡️',
  skipped: '💤',
}

export default function CalendarPage() {
  const { stampsByDate, toggleStamp, streak, routinesByDate } = useAppData()
  const [cursor, setCursor] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [memos, setMemos] = useLocalStorage<Record<string, string>>('memos', {})

  const today = todayKey()

  const days = useMemo(() => {
    const start = startOfMonth(cursor)
    const end = endOfMonth(cursor)
    return eachDayOfInterval({ start, end })
  }, [cursor])

  const leadingBlanks = getDay(startOfMonth(cursor))

  return (
    <div className="app-main" style={{ paddingTop: 0 }}>
      <div className="app-header" style={{ margin: '0 -16px 16px' }}>
        <h1>월간 캘린더</h1>
        <p style={{ opacity: 0.9, fontSize: 13 }}>
          🔥 연속 달성 {streak.currentStreak}일 · 🛡️ 스트릭 실드 {streak.streakShields}개
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button className="chip" onClick={() => setCursor((c) => subMonths(c, 1))}>
            ◀
          </button>
          <strong>{format(cursor, 'yyyy년 M월')}</strong>
          <button className="chip" onClick={() => setCursor((c) => addMonths(c, 1))}>
            ▶
          </button>
        </div>

        <div className="calendar-grid">
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
            <div key={d} className="muted">
              {d}
            </div>
          ))}
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const stamps = stampsByDate[key]
            const isToday = key === today
            const status = routinesByDate[key]?.status
            return (
              <div
                key={key}
                className={`calendar-day ${isToday ? 'today' : ''} ${status ? `status-${status}` : ''}`}
                onClick={() => setSelectedDate(key)}
              >
                <span>{format(day, 'd')}</span>
                <span className="status-icon">{status && status !== 'planned' ? STATUS_ICON[status] : ''}</span>
                <span className="stamps">
                  {stamps
                    ? STAMP_ICONS.filter((s) => stamps[s.key])
                        .map((s) => s.icon)
                        .join('')
                    : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedDate}</h2>

            <div className="chip-group" style={{ marginBottom: 12 }}>
              {STAMP_ICONS.map(({ key, icon }) => {
                const stamps = stampsByDate[selectedDate]
                const active = stamps?.[key] ?? false
                return (
                  <div
                    key={key}
                    className={`chip ${active ? 'selected' : ''}`}
                    onClick={() => toggleStamp(selectedDate, key)}
                  >
                    {icon}
                  </div>
                )
              })}
            </div>

            <label>메모 / 식단 기록</label>
            <textarea
              style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 10, border: '1px solid #dde2ee' }}
              value={memos[selectedDate] ?? ''}
              onChange={(e) => setMemos((prev) => ({ ...prev, [selectedDate]: e.target.value }))}
            />

            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setSelectedDate(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
