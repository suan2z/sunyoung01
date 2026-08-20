import { useState } from 'react'
import { format } from 'date-fns'
import { useAppData, todayKey } from '../context/AppDataContext'
import WeightChart from '../components/WeightChart'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import { generateStampCardDataUrl } from '../utils/generateStampCard'
import type { BodyLogEntry } from '../types'

export default function ReportPage() {
  const { bodyLogs, addBodyLog, stampsByDate } = useAppData()
  const today = todayKey()
  const todayLog = bodyLogs.find((l) => l.date === today)

  const [weightKg, setWeightKg] = useState(todayLog?.weightKg ?? 60)
  const [waistCm, setWaistCm] = useState(todayLog?.waistCm ?? 0)
  const [cardUrl, setCardUrl] = useState<string | null>(null)

  function saveBodyLog() {
    const entry: BodyLogEntry = {
      date: today,
      weightKg,
      waistCm: waistCm || undefined,
      photoBefore: todayLog?.photoBefore,
      photoAfter: todayLog?.photoAfter,
    }
    addBodyLog(entry)
  }

  function updatePhoto(kind: 'photoBefore' | 'photoAfter', dataUrl: string) {
    const entry: BodyLogEntry = {
      date: today,
      weightKg: todayLog?.weightKg ?? weightKg,
      waistCm: todayLog?.waistCm,
      photoBefore: todayLog?.photoBefore,
      photoAfter: todayLog?.photoAfter,
      [kind]: dataUrl,
    }
    addBodyLog(entry)
  }

  function handleGenerateCard() {
    const monthLabel = format(new Date(), 'yyyy년 M월')
    const stamps = Object.values(stampsByDate)
    const url = generateStampCardDataUrl(monthLabel, stamps)
    setCardUrl(url)
  }

  const latestPhotoEntry = [...bodyLogs].reverse().find((l) => l.photoBefore || l.photoAfter) ?? todayLog

  return (
    <div className="app-main" style={{ paddingTop: 0 }}>
      <div className="app-header" style={{ margin: '0 -16px 16px' }}>
        <h1>리포트 & 눈바디</h1>
        <p style={{ opacity: 0.9, fontSize: 13 }}>변화를 눈으로 확인해보세요</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>체중 변화 추이</h3>
        <WeightChart logs={bodyLogs} />

        <label>오늘 체중 (kg)</label>
        <input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />

        <label>허리 둘레 (cm, 선택)</label>
        <input type="number" value={waistCm || ''} onChange={(e) => setWaistCm(Number(e.target.value))} />

        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={saveBodyLog}>
          기록 저장
        </button>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Before / After 눈바디</h3>
        <BeforeAfterSlider
          before={latestPhotoEntry?.photoBefore}
          after={latestPhotoEntry?.photoAfter}
          onUploadBefore={(url) => updatePhoto('photoBefore', url)}
          onUploadAfter={(url) => updatePhoto('photoAfter', url)}
        />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>이번 달 달성 카드</h3>
        <p className="muted">도장 기록을 이미지 카드로 만들어 저장할 수 있어요.</p>
        <button className="btn btn-secondary" onClick={handleGenerateCard}>
          카드 생성하기
        </button>
        {cardUrl && (
          <div style={{ marginTop: 12 }}>
            <img src={cardUrl} alt="달성 카드" style={{ width: '100%', borderRadius: 12 }} />
            <a
              className="btn btn-primary"
              style={{ display: 'block', textAlign: 'center', marginTop: 10, textDecoration: 'none' }}
              href={cardUrl}
              download="achievement-card.png"
            >
              이미지 다운로드
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
