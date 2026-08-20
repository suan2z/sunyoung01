import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData, todayKey } from '../context/AppDataContext'
import { generateRoutine } from '../logic/coachEngine'
import type { BodyPart, Space, UserProfile } from '../types'

const BODY_PARTS: BodyPart[] = ['팔뚝', '복부', '허벅지', '등', '엉덩이', '전신']
const EQUIPMENT_OPTIONS = ['맨몸', '덤벨', '밴드', '요가매트', '헬스머신']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { setProfile, setCondition, setRoutine, getCondition } = useAppData()

  const [heightCm, setHeightCm] = useState(165)
  const [weightKg, setWeightKg] = useState(60)
  const [targetParts, setTargetParts] = useState<BodyPart[]>([])
  const [space, setSpace] = useState<Space>('home')
  const [equipment, setEquipment] = useState<string[]>(['맨몸'])
  const [weeklyAvailableMin, setWeeklyAvailableMin] = useState(90)
  const [goalDays, setGoalDays] = useState(30)

  function toggle<T>(list: T[], value: T, setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function handleSubmit() {
    const profile: UserProfile = {
      heightCm,
      weightKg,
      targetParts: targetParts.length > 0 ? targetParts : ['전신'],
      space,
      equipment,
      weeklyAvailableMin,
      goalDays,
      createdAt: new Date().toISOString(),
    }
    setProfile(profile)

    const date = todayKey()
    const condition = getCondition(date)
    setCondition(date, condition)
    const routine = generateRoutine({ profile, condition })
    setRoutine(date, routine, 'planned')

    navigate('/')
  }

  return (
    <div className="app-main" style={{ paddingTop: 24 }}>
      <div className="app-header" style={{ margin: '-16px -16px 16px' }}>
        <h1>1분이면 시작할 수 있어요</h1>
        <p style={{ opacity: 0.9, fontSize: 13 }}>필수 정보만 입력하면 바로 오늘의 루틴을 만들어드려요.</p>
      </div>

      <div className="card">
        <label>키 (cm)</label>
        <input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />

        <label>체중 (kg)</label>
        <input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />

        <label>목표 부위 (다중 선택)</label>
        <div className="chip-group">
          {BODY_PARTS.map((part) => (
            <div
              key={part}
              className={`chip ${targetParts.includes(part) ? 'selected' : ''}`}
              onClick={() => toggle(targetParts, part, setTargetParts)}
            >
              {part}
            </div>
          ))}
        </div>

        <label>운동 공간</label>
        <div className="chip-group">
          {(['home', 'gym'] as Space[]).map((s) => (
            <div key={s} className={`chip ${space === s ? 'selected' : ''}`} onClick={() => setSpace(s)}>
              {s === 'home' ? '홈' : '헬스장'}
            </div>
          ))}
        </div>

        <label>보유 기구</label>
        <div className="chip-group">
          {EQUIPMENT_OPTIONS.map((eq) => (
            <div
              key={eq}
              className={`chip ${equipment.includes(eq) ? 'selected' : ''}`}
              onClick={() => toggle(equipment, eq, setEquipment)}
            >
              {eq}
            </div>
          ))}
        </div>

        <label>주당 가용 시간 (분)</label>
        <input
          type="number"
          value={weeklyAvailableMin}
          onChange={(e) => setWeeklyAvailableMin(Number(e.target.value))}
        />

        <label>목표 기간 (일)</label>
        <input type="number" value={goalDays} onChange={(e) => setGoalDays(Number(e.target.value))} />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        플랜 발행하기
      </button>
    </div>
  )
}
