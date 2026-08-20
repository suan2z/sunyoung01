import { useState } from 'react'

interface Props {
  before?: string
  after?: string
  onUploadBefore: (dataUrl: string) => void
  onUploadAfter: (dataUrl: string) => void
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function BeforeAfterSlider({ before, after, onUploadBefore, onUploadAfter }: Props) {
  const [split, setSplit] = useState(50)

  return (
    <div>
      <div className="btn-row" style={{ marginBottom: 12 }}>
        <label className="btn btn-secondary" style={{ textAlign: 'center' }}>
          Before 사진
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) onUploadBefore(await readAsDataUrl(file))
            }}
          />
        </label>
        <label className="btn btn-secondary" style={{ textAlign: 'center' }}>
          After 사진
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) onUploadAfter(await readAsDataUrl(file))
            }}
          />
        </label>
      </div>

      {before && after ? (
        <>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: 12 }}>
            <img src={after} alt="after" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${split}%`,
                overflow: 'hidden',
              }}
            >
              <img src={before} alt="before" style={{ width: `${10000 / split}%`, height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${split}%`, width: 2, background: 'white' }} />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            style={{ width: '100%', marginTop: 8 }}
          />
        </>
      ) : (
        <p className="muted">Before/After 사진을 모두 올리면 비교 슬라이더가 표시돼요.</p>
      )}
    </div>
  )
}
