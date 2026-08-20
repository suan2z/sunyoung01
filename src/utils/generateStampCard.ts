import type { StampLog } from '../types'

export function generateStampCardDataUrl(monthLabel: string, stamps: StampLog[]): string {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 800
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#2f6fed')
  gradient.addColorStop(1, '#4b8bff')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'white'
  ctx.font = 'bold 32px sans-serif'
  ctx.fillText(`${monthLabel} 달성 카드`, 40, 70)

  const completedDays = stamps.filter((s) => s.exercise || s.walk || s.meal || s.sleep).length
  ctx.font = '20px sans-serif'
  ctx.fillText(`이번 달 ${completedDays}일 달성!`, 40, 110)

  const cols = 7
  const cellSize = 70
  const startX = 40
  const startY = 160

  stamps.forEach((stamp, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = startX + col * cellSize
    const y = startY + row * cellSize

    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fillRect(x, y, cellSize - 8, cellSize - 8)

    const icons: string[] = []
    if (stamp.exercise) icons.push('🏋️')
    if (stamp.walk) icons.push('🚶')
    if (stamp.meal) icons.push('🍎')
    if (stamp.sleep) icons.push('🌙')

    ctx.font = '18px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText(icons.join(''), x + 6, y + 40)
  })

  return canvas.toDataURL('image/png')
}
