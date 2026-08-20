import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppData, todayKey } from '../context/AppDataContext'
import { buildMinimalRoutine, buildMorningBriefing, generateRoutine } from '../logic/coachEngine'
import ConditionSlider from '../components/ConditionSlider'
import RoutineCard from '../components/RoutineCard'
import MorningBriefingModal from '../components/MorningBriefingModal'
import CoachingModal from '../components/CoachingModal'
import GaugeRing from '../components/GaugeRing'
import type { RoutineResult, StampLog, Weather } from '../types'

const STAMP_LABELS: { key: keyof Omit<StampLog, 'date'>; icon: string; label: string }[] = [
  { key: 'exercise', icon: '🏋️', label: '운동' },
  { key: 'walk', icon: '🚶', label: '걷기' },
  { key: 'meal', icon: '🍎', label: '식단' },
  { key: 'sleep', icon: '🌙', label: '수면' },
]

export default function DashboardPage() {
  const date = todayKey()
  const {
    profile,
    getCondition,
    setCondition,
    routinesByDate,
    setRoutine,
    setRoutineStatus,
    recentStatuses,
    stampsByDate,
    toggleStamp,
    streak,
    useStreakShield,
  } = useAppData()

  const condition = getCondition(date)
  const routineDay = routinesByDate[date]
  const stamps = stampsByDate[date] ?? { date, exercise: false, walk: false, meal: false, sleep: false }

  const [showBriefing, setShowBriefing] = useState(true)
  const [showCoaching, setShowCoaching] = useState(false)
  const [coachingHandled, setCoachingHandled] = useState(false)

  useEffect(() => {
    if (!profile) return
    if ((condition.conditionScore <= 2 || condition.sleepShort) && !coachingHandled) {
      setShowCoaching(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.conditionScore, condition.sleepShort])

  if (!profile) return null

  function regenerate(nextCondition = condition) {
    if (!profile) return
    const statuses = recentStatuses(date, 3)
    const routine = generateRoutine({ profile, condition: nextCondition, recentStatuses: statuses })
    setRoutine(date, routine, routineDay?.status ?? 'planned')
  }

  function handleConditionChange(score: number) {
    const next = { ...condition, conditionScore: score }
    setCondition(date, next)
    setCoachingHandled(false)
    regenerate(next)
  }

  function handleWeatherChange(weather: Weather) {
    setCondition(date, { ...condition, weather })
  }

  function handleSleepShortChange(sleepShort: boolean) {
    setCondition(date, { ...condition, sleepShort })
  }

  function handleAcceptBriefing() {
    regenerate(condition)
    setShowBriefing(false)
  }

  function handleToggleExerciseDone() {
    const willComplete = !stamps.exercise
    toggleStamp(date, 'exercise')
    setRoutineStatus(date, willComplete ? 'completed' : 'planned')
  }

  function handleAcceptRecovery() {
    setRoutineStatus(date, 'smart_recovery')
    useStreakShield(date)
    setShowCoaching(false)
    setCoachingHandled(true)
  }

  function handleApplyOption(routine: RoutineResult) {
    setRoutine(date, routine, 'smart_recovery')
    useStreakShield(date)
    setShowCoaching(false)
    setCoachingHandled(true)
  }

  const adjustOptions = profile
    ? [
        { label: '시간 절반으로', routine: generateRoutine({ profile, condition, recentStatuses: recentStatuses(date, 3), timeMultiplier: 0.5 }) },
        { label: '5분만 가볍게', routine: buildMinimalRoutine() },
      ]
    : []

  const daysSinceStart = profile.createdAt
    ? Math.max(1, Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 86400000) + 1)
    : 1
  const dDay = Math.max(0, profile.goalDays - daysSinceStart)
  const stampCount = STAMP_LABELS.filter((s) => stamps[s.key]).length
  const progress = stampCount / STAMP_LABELS.length

  return (
    <div className="app-main" style={{ paddingTop: 0 }}>
      <div className="app-header" style={{ margin: '0 -16px 16px', position: 'relative' }}>
        <Link
          to="/profile"
          style={{ position: 'absolute', top: 16, right: 16, fontSize: 20, textDecoration: 'none' }}
          aria-label="프로필 수정"
        >
          ⚙️
        </Link>
        <h1>D-{dDay}</h1>
        <p style={{ opacity: 0.9, fontSize: 13 }}>
          오늘도 좋은 하루 보내세요 🔥 연속 {streak.currentStreak}일째 · 🛡️ 실드 {streak.streakShields}개
        </p>
      </div>

      <div className="card">
        <GaugeRing progress={progress} label="오늘 목표 달성률" sublabel={`${stampCount}/${STAMP_LABELS.length} 완료`} />
      </div>

      <div className="card">
        <ConditionSlider value={condition.conditionScore} onChange={handleConditionChange} />
      </div>

      {routineDay && <RoutineCard routine={routineDay.routine} />}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>오늘의 투두</h3>
        {STAMP_LABELS.map(({ key, icon, label }) => (
          <label key={key} className="todo-item" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={stamps[key]}
              onChange={() => (key === 'exercise' ? handleToggleExerciseDone() : toggleStamp(date, key))}
            />
            <span>
              {icon} {label}
            </span>
          </label>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handleToggleExerciseDone}>
        {stamps.exercise ? '오늘 루틴 완료! ✅ (취소하려면 다시 탭)' : '오늘 루틴 시작'}
      </button>
      <button
        className="btn btn-secondary"
        style={{ marginTop: 10 }}
        onClick={() => setRoutineStatus(date, 'skipped')}
      >
        오늘은 쉬어갈게요
      </button>

      {showBriefing && (
        <MorningBriefingModal
          briefingText={buildMorningBriefing(condition)}
          weather={condition.weather}
          sleepShort={condition.sleepShort}
          onWeatherChange={handleWeatherChange}
          onSleepShortChange={handleSleepShortChange}
          onAccept={handleAcceptBriefing}
          onDismiss={() => setShowBriefing(false)}
        />
      )}

      {showCoaching && !showBriefing && (
        <CoachingModal
          onAcceptRecovery={handleAcceptRecovery}
          onApplyOption={handleApplyOption}
          options={adjustOptions}
          onClose={() => {
            setShowCoaching(false)
            setCoachingHandled(true)
          }}
        />
      )}
    </div>
  )
}
