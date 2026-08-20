import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData, todayKey } from '../context/AppDataContext'
import { generateRoutine } from '../logic/coachEngine'
import type { BodyPart, Space, UserProfile } from '../types'

const BODY_PARTS: BodyPart[] = ['팔뚝', '복부', '허벅지', '등', '엉덩이', '전신']
const EQUIPMENT_OPTIONS = ['맨몸', '덤벨', '밴드', '요가매트', '헬스머신']

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile, setProfile, getCondition, setRoutine, recentStatuses } = useAppData()

  const [heightCm, setHeightCm] = useState(profile?.heightCm ?? 170)
  const [weightKg, setWeightKg] = useState(profile?.weightKg ?? 60)
  const [targetParts, setTargetParts] = useState<BodyPart[]>(profile?.targetParts ?? [])
  const [space, setSpace] = useState<Space>(profile?.space ?? 'home')
  const [equipment, setEquipment] = useState<string[]>(profile?.equipment ?? [])
  const [weeklyAvailableMin, setWeeklyAvailableMin] = useState(profile?.weeklyAvailableMin ?? 150)
  const [goalDays, setGoalDays] = useState(profile?.goalDays ?? 30)
  const [waistCm, setWaistCm] = useState(profile?.waistCm ?? 0)
  const [hipCm, setHipCm] = useState(profile?.hipCm ?? 0)

  if (!profile) {
    navigate('/onboarding')
    return null
  }

  function toggle<T>(list: T[], value: T, setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function handleSave() {
    if (!profile) return
    const updated: UserProfile = {
      ...profile,
      heightCm,
      weightKg,
      targetParts: targetParts.length > 0 ? targetParts : ['전신'],
      space,
      equipment,
      weeklyAvailableMin,
      goalDays,
      waistCm: waistCm || undefined,
      hipCm: hipCm || undefined,
    }
    setProfile(updated)

    const date = todayKey()
    const condition = getCondition(date)
    const statuses = recentStatuses(date, 3)
    const routine = generateRoutine({ profile: updated, condition, recentStatuses: statuses })
    setRoutine(date, routine)

    navigate('/')
  }

  return (
    <div className="app-main" style={{ paddingTop: 0 }}>
      <div className="app-header" style={{ margin: '0 -16px 16px' }}>
        <h1>프로필 수정</h1>
        <p style={{ opacity: 0.9, fontSize: 13 }}>체형 정보와 목표를 업데이트하면 오늘 루틴에 바로 반영돼요.</p>
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

      <div className="card">
        <h3 style={{ marginTop: 0 }}>상세 치수 (선택)</h3>
        <p className="muted" style={{ marginTop: 0 }}>온보딩에서는 건너뛴 항목이에요. 있으면 눈바디 리포트가 더 정확해져요.</p>

        <label>허리 둘레 (cm)</label>
        <input type="number" value={waistCm || ''} onChange={(e) => setWaistCm(Number(e.target.value))} />

        <label>엉덩이 둘레 (cm)</label>
        <input type="number" value={hipCm || ''} onChange={(e) => setHipCm(Number(e.target.value))} />
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        저장하기
      </button>
    </div>
  )
}
