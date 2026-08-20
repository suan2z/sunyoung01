import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type {
  BodyLogEntry,
  DailyCondition,
  DayStatus,
  RoutineDay,
  RoutineResult,
  StampLog,
  StreakState,
  UserProfile,
} from '../types'

function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

interface AppDataValue {
  profile: UserProfile | null
  setProfile: (p: UserProfile) => void

  conditionsByDate: Record<string, DailyCondition>
  getCondition: (date: string) => DailyCondition
  setCondition: (date: string, condition: DailyCondition) => void

  routinesByDate: Record<string, RoutineDay>
  setRoutine: (date: string, routine: RoutineResult, status?: DayStatus) => void
  setRoutineStatus: (date: string, status: DayStatus) => void
  recentStatuses: (beforeDate: string, count: number) => DayStatus[]

  stampsByDate: Record<string, StampLog>
  toggleStamp: (date: string, key: keyof Omit<StampLog, 'date'>) => void

  streak: StreakState
  useStreakShield: (date: string) => void

  bodyLogs: BodyLogEntry[]
  addBodyLog: (entry: BodyLogEntry) => void
}

const AppDataContext = createContext<AppDataValue | null>(null)

function emptyCondition(date: string): DailyCondition {
  return { date, conditionScore: 3, weather: '맑음', painAreas: [], sleepShort: false }
}

function emptyStamp(date: string): StampLog {
  return { date, exercise: false, walk: false, meal: false, sleep: false }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('profile', null)
  const [conditionsByDate, setConditionsByDate] = useLocalStorage<Record<string, DailyCondition>>('conditions', {})
  const [routinesByDate, setRoutinesByDate] = useLocalStorage<Record<string, RoutineDay>>('routines', {})
  const [stampsByDate, setStampsByDate] = useLocalStorage<Record<string, StampLog>>('stamps', {})
  const [streak, setStreak] = useLocalStorage<StreakState>('streak', {
    currentStreak: 0,
    streakShields: 1,
    lastUpdatedDate: null,
  })
  const [bodyLogs, setBodyLogs] = useLocalStorage<BodyLogEntry[]>('bodyLogs', [])

  // 마지막으로 스트릭이 갱신된 날짜가 어제도 오늘도 아니면(즉, 하루를 통째로 건너뛰었으면) 스트릭이 끊긴 것으로 처리
  useEffect(() => {
    const today = todayKey()
    const yesterday = todayKey(new Date(Date.now() - 86400000))
    if (
      streak.currentStreak > 0 &&
      streak.lastUpdatedDate &&
      streak.lastUpdatedDate !== today &&
      streak.lastUpdatedDate !== yesterday
    ) {
      setStreak((s) => ({ ...s, currentStreak: 0 }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<AppDataValue>(
    () => ({
      profile,
      setProfile,

      conditionsByDate,
      getCondition: (date) => conditionsByDate[date] ?? emptyCondition(date),
      setCondition: (date, condition) =>
        setConditionsByDate((prev) => ({ ...prev, [date]: condition })),

      routinesByDate,
      setRoutine: (date, routine, status = 'planned') =>
        setRoutinesByDate((prev) => ({ ...prev, [date]: { date, routine, status } })),
      setRoutineStatus: (date, status) =>
        setRoutinesByDate((prev) => {
          const existing = prev[date]
          if (!existing) return prev
          const updated = { ...prev, [date]: { ...existing, status } }
          if (status === 'completed') {
            setStreak((s) => {
              if (s.lastUpdatedDate === date) return s
              const nextStreak = s.currentStreak + 1
              // 7일 연속 달성마다 스트릭 실드 1개 지급
              const earnedShield = nextStreak % 7 === 0 ? 1 : 0
              return {
                currentStreak: nextStreak,
                streakShields: s.streakShields + earnedShield,
                lastUpdatedDate: date,
              }
            })
          }
          return updated
        }),
      recentStatuses: (beforeDate, count) => {
        const dates = Object.keys(routinesByDate)
          .filter((d) => d < beforeDate)
          .sort()
        const lastN = dates.slice(-count)
        return lastN.map((d) => routinesByDate[d].status)
      },

      stampsByDate,
      toggleStamp: (date, key) =>
        setStampsByDate((prev) => {
          const existing = prev[date] ?? emptyStamp(date)
          return { ...prev, [date]: { ...existing, [key]: !existing[key] } }
        }),

      streak,
      useStreakShield: (date) =>
        setStreak((s) => ({
          currentStreak: s.currentStreak,
          streakShields: Math.max(0, s.streakShields - 1),
          lastUpdatedDate: date,
        })),

      bodyLogs,
      addBodyLog: (entry) => setBodyLogs((prev) => [...prev.filter((e) => e.date !== entry.date), entry]),
    }),
    [profile, conditionsByDate, routinesByDate, stampsByDate, streak, bodyLogs, setProfile, setConditionsByDate, setRoutinesByDate, setStampsByDate, setStreak, setBodyLogs],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}

export { todayKey }
