import type { RoutineResult } from '../types'

interface Props {
  routine: RoutineResult
}

export default function RoutineCard({ routine }: Props) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>{routine.routine_title}</h3>
        <span className="muted">{routine.total_time_min}분</span>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>
        {routine.coaching_message}
      </p>
      <div style={{ marginTop: 8 }}>
        {routine.exercise_list.map((item) => (
          <div className="exercise-row" key={item.name}>
            <span>{item.name}</span>
            <span style={{ textAlign: 'right' }}>
              {item.sets}세트 x {item.reps_or_time}
              {item.note && <div className="note">{item.note}</div>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
