import { useState } from 'react'
import type { RoutineResult } from '../types'

interface AdjustOption {
  label: string
  routine: RoutineResult
}

interface Props {
  onAcceptRecovery: () => void
  onApplyOption: (routine: RoutineResult) => void
  onClose: () => void
  options: AdjustOption[]
}

export default function CoachingModal({ onAcceptRecovery, onApplyOption, onClose, options }: Props) {
  const [view, setView] = useState<'main' | 'options'>('main')
  const [selected, setSelected] = useState(0)

  if (view === 'options') {
    const option = options[selected]
    return (
      <div className="modal-overlay">
        <div className="modal-sheet">
          <h2>재조정 옵션</h2>
          <div className="chip-group">
            {options.map((o, i) => (
              <div key={o.label} className={`chip ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(i)}>
                {o.label}
              </div>
            ))}
          </div>
          {option && (
            <div className="card" style={{ marginTop: 12 }}>
              <strong>{option.routine.routine_title}</strong>
              <p className="muted" style={{ fontSize: 13 }}>
                {option.routine.total_time_min}분 · {option.routine.exercise_list.length}개 동작
              </p>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {option.routine.exercise_list.map((ex) => (
                  <li key={ex.name} style={{ fontSize: 13 }}>
                    {ex.name} {ex.sets}세트 x {ex.reps_or_time}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={() => setView('main')}>
              뒤로
            </button>
            <button className="btn btn-primary" onClick={() => option && onApplyOption(option.routine)}>
              이 루틴 적용하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <h2>휴식도 성장의 일부예요 🌙</h2>
        <p className="muted">
          오늘 컨디션이 평소보다 낮아 보여요. 실패로 기록하는 대신 '스마트 회복일'로 전환하고, 무리 없는
          루틴으로 재조정해 드릴게요.
        </p>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-secondary" onClick={() => setView('options')}>
            재조정 옵션 보기
          </button>
          <button className="btn btn-primary" onClick={onAcceptRecovery}>
            스마트 회복일로 전환
          </button>
        </div>
        <button
          className="btn"
          style={{ marginTop: 10, width: '100%', background: 'transparent', color: '#6b7385' }}
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  )
}
