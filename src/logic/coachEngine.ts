import { recoveryPool, seedExercises } from '../data/seedExercises'
import type {
  DailyCondition,
  Exercise,
  RoutineDay,
  RoutineExerciseItem,
  RoutineResult,
  UserProfile,
} from '../types'

const REST_SECONDS_PER_SET = 30

function toRoutineItem(ex: Exercise, sets: number, note: string): RoutineExerciseItem {
  return {
    name: ex.name,
    sets,
    reps_or_time: ex.defaultRepsOrTime,
    note,
  }
}

function estimateMinutes(ex: Exercise, sets: number): number {
  return ((ex.secondsPerSet + REST_SECONDS_PER_SET) * sets) / 60
}

/** 컨디션 저하(1~2점) 또는 수면 부족: 세트/중량 30~50% 축소, 고강도 운동 -> 폼롤러 스트레칭/회복요가 전환 */
function adjustForCondition(
  pool: Exercise[],
  conditionScore: number,
  sleepShort: boolean,
): { pool: Exercise[]; setMultiplier: number; note: string | null } {
  if (conditionScore > 2 && !sleepShort) {
    return { pool, setMultiplier: 1, note: null }
  }
  return {
    pool: recoveryPool,
    setMultiplier: 0.6,
    note: sleepShort
      ? '수면이 부족해 보여 고강도 운동 대신 회복 스트레칭으로 준비했어요.'
      : '몸이 피곤한 날이네요. 오늘은 근육을 풀어주는 회복 스트레칭으로 가볍게 움직여볼까요?',
  }
}

const INDOOR_CARDIO_IDS = ['squat', 'burpee', 'jumping-jack', 'lunge']

/** 악천후: 야외 운동 -> 맨몸 실내 유산소(스쿼트, 슬로우 버피 등)로 전환 */
function adjustForWeather(pool: Exercise[], weather: DailyCondition['weather']): { pool: Exercise[]; note: string | null } {
  if (weather !== '비' && weather !== '눈') {
    return { pool, note: null }
  }
  // 기구가 필요한 종목(헬스장 전용)은 제외하고 맨몸 실내 유산소 위주로 재배치
  const bodyweightOnly = pool.filter((e) => e.space.includes('home'))
  const reordered = [...bodyweightOnly].sort((a, b) => {
    const aPreferred = INDOOR_CARDIO_IDS.includes(a.id) ? 1 : 0
    const bPreferred = INDOOR_CARDIO_IDS.includes(b.id) ? 1 : 0
    return bPreferred - aPreferred
  })
  return {
    pool: reordered.length > 0 ? reordered : pool,
    note:
      weather === '비'
        ? '비가 오네요! 야외 대신 집에서 층간소음 없는 스쿼트, 슬로우 버피 위주의 실내 루틴으로 변경했어요.'
        : '눈이 오는 날이에요, 실내 맨몸 유산소 위주로 안전하게 준비했어요.',
  }
}

/** Safety Guardrail: 통증 부위 자극 운동 100% 제외 */
function filterByPain(pool: Exercise[], painAreas: DailyCondition['painAreas']): { pool: Exercise[]; note: string | null } {
  if (painAreas.length === 0) {
    return { pool, note: null }
  }
  const filtered = pool.filter((e) => !e.painTags.some((tag) => painAreas.includes(tag)))
  const safePool = filtered.length > 0 ? filtered : recoveryPool
  return {
    pool: safePool,
    note: `${painAreas.join(', ')} 부위에 무리가 가지 않도록 관련 동작을 제외했어요.`,
  }
}

/** 3일 연속 skip 감지 -> '5분 습관 되살리기' 최소 루틴 */
function checkSkipStreak(recentStatuses: RoutineDay['status'][]): boolean {
  const lastThree = recentStatuses.slice(-3)
  return lastThree.length === 3 && lastThree.every((s) => s === 'skipped')
}

/** 세트당 휴식 30초를 포함해 available_time을 넘지 않도록 클리핑 */
function buildTimeBoundRoutine(
  pool: Exercise[],
  availableTimeMin: number,
  setMultiplier: number,
): { items: RoutineExerciseItem[]; totalMin: number } {
  const items: RoutineExerciseItem[] = []
  let totalMin = 0
  for (const ex of pool) {
    const sets = Math.max(1, Math.round(ex.defaultSets * setMultiplier))
    const min = estimateMinutes(ex, sets)
    if (totalMin + min > availableTimeMin && items.length > 0) break
    items.push(toRoutineItem(ex, sets, ex.isRecovery ? '천천히, 무리하지 않게' : ''))
    totalMin += min
    if (totalMin >= availableTimeMin) break
  }
  return { items, totalMin: Math.round(totalMin) }
}

export function buildMinimalRoutine(): RoutineResult {
  const items = recoveryPool.slice(0, 1).map((ex) => toRoutineItem(ex, 1, '부담 없이 가볍게'))
  return {
    coaching_message: '다시 시작하면 됩니다! 부담 없이 5분 스트레칭으로 기분 전환부터 해볼까요?',
    routine_title: '5분 습관 되살리기',
    total_time_min: 5,
    exercise_list: items,
  }
}

export interface GenerateRoutineInput {
  profile: UserProfile
  condition: DailyCondition
  recentStatuses?: RoutineDay['status'][]
  /** 재조정 옵션에서 사용: 기본 가용 시간에 곱해 루틴 길이를 줄임 (예: 0.5 = 절반) */
  timeMultiplier?: number
}

export function generateRoutine({
  profile,
  condition,
  recentStatuses = [],
  timeMultiplier = 1,
}: GenerateRoutineInput): RoutineResult {
  const notes: string[] = []

  if (checkSkipStreak(recentStatuses)) {
    return buildMinimalRoutine()
  }

  let pool = seedExercises.filter(
    (e) =>
      e.space.includes(profile.space) &&
      (e.bodyParts.some((p) => profile.targetParts.includes(p)) || e.bodyParts.includes('전신')),
  )
  if (pool.length === 0) pool = seedExercises.filter((e) => e.space.includes(profile.space))

  const painResult = filterByPain(pool, condition.painAreas)
  pool = painResult.pool
  if (painResult.note) notes.push(painResult.note)

  const weatherResult = adjustForWeather(pool, condition.weather)
  pool = weatherResult.pool
  if (weatherResult.note) notes.push(weatherResult.note)

  const conditionResult = adjustForCondition(pool, condition.conditionScore, condition.sleepShort)
  pool = conditionResult.pool
  if (conditionResult.note) notes.push(conditionResult.note)

  const dailyAvailableMin = Math.max(10, Math.round((profile.weeklyAvailableMin / 7) * timeMultiplier))
  const { items, totalMin } = buildTimeBoundRoutine(pool, dailyAvailableMin, conditionResult.setMultiplier)

  const coachingMessage =
    notes.length > 0
      ? notes.join(' ')
      : '오늘도 목표를 향해 한 걸음! 준비된 루틴으로 시작해볼까요?'

  const isRecoveryFocused = condition.conditionScore <= 2 || condition.sleepShort
  const routineTitle = isRecoveryFocused ? '오늘의 회복 루틴' : `오늘의 ${profile.targetParts[0] ?? '전신'} 루틴`

  return {
    coaching_message: coachingMessage,
    routine_title: routineTitle,
    total_time_min: totalMin || dailyAvailableMin,
    exercise_list: items,
  }
}

export function buildMorningBriefing(condition: DailyCondition): string {
  const parts: string[] = []
  if (condition.weather === '비') parts.push('비가 오네요! 야외 대신 실내 루틴으로 준비했어요.')
  else if (condition.weather === '눈') parts.push('눈이 오는 날이에요, 실내에서 안전하게 움직여봐요.')
  else if (condition.weather === '무더움') parts.push('오늘은 더워요, 무리하지 않는 강도로 준비했어요.')
  else parts.push('오늘 날씨는 맑아요, 컨디션에 맞춰 루틴을 준비했어요.')

  if (condition.sleepShort) parts.push('수면이 부족해 보여 고강도 운동은 오늘 쉬어가요.')
  else if (condition.conditionScore <= 2) parts.push('컨디션이 낮아 보여 가볍게 조정했어요.')
  else if (condition.conditionScore >= 4) parts.push('컨디션이 좋아 보이네요, 오늘 제대로 움직여볼까요?')

  return parts.join(' ')
}
