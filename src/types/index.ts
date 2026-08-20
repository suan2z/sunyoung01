export type Space = 'home' | 'gym'
export type BodyPart = '팔뚝' | '복부' | '허벅지' | '등' | '엉덩이' | '전신'
export type PainArea = '무릎' | '어깨' | '허리' | '손목' | '발목'
export type Weather = '맑음' | '비' | '눈' | '무더움'

export interface UserProfile {
  heightCm: number
  weightKg: number
  targetParts: BodyPart[]
  space: Space
  equipment: string[]
  weeklyAvailableMin: number
  goalDays: number
  createdAt: string
  waistCm?: number
  hipCm?: number
}

export interface Exercise {
  id: string
  name: string
  bodyParts: BodyPart[]
  painTags: PainArea[]
  intensity: 'low' | 'medium' | 'high'
  space: Space[]
  defaultSets: number
  defaultRepsOrTime: string
  secondsPerSet: number
  isRecovery?: boolean
}

export interface RoutineExerciseItem {
  name: string
  sets: number
  reps_or_time: string
  note: string
}

export interface RoutineResult {
  coaching_message: string
  routine_title: string
  total_time_min: number
  exercise_list: RoutineExerciseItem[]
}

export type DayStatus = 'planned' | 'completed' | 'smart_recovery' | 'skipped'

export interface DailyCondition {
  date: string
  conditionScore: number
  weather: Weather
  painAreas: PainArea[]
  sleepShort: boolean
}

export interface RoutineDay {
  date: string
  routine: RoutineResult
  status: DayStatus
}

export interface StampLog {
  date: string
  exercise: boolean
  walk: boolean
  meal: boolean
  sleep: boolean
}

export interface StreakState {
  currentStreak: number
  streakShields: number
  lastUpdatedDate: string | null
}

export interface BodyLogEntry {
  date: string
  weightKg: number
  waistCm?: number
  photoBefore?: string
  photoAfter?: string
}
