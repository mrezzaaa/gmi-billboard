import * as THREE from 'three'

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}
function toTexture(c) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function scooter(ctx, x, y, s, b) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // speed lines
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 10
  for (const [ly, lx, len] of [[-120, -520, 160], [-40, -600, 240], [40, -540, 180], [120, -620, 260]]) {
    ctx.beginPath()
    ctx.moveTo(lx, ly)
    ctx.lineTo(lx + len, ly)
    ctx.stroke()
  }

  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'
  ctx.lineWidth = 18
  for (const wx of [-170, 190]) {
    ctx.beginPath()
    ctx.arc(wx, 140, 62, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(wx, 140, 16, 0, Math.PI * 2)
    ctx.fill()
  }
  // body
  ctx.beginPath()
  ctx.moveTo(-235, 95)
  ctx.quadraticCurveTo(-205, 10, -60, 18)
  ctx.lineTo(80, 18)
  ctx.quadraticCurveTo(140, 40, 172, 118)
  ctx.lineTo(60, 118)
  ctx.quadraticCurveTo(-40, 140, -235, 95)
  ctx.fill()
  // fork + handlebar
  ctx.beginPath()
  ctx.moveTo(185, 120)
  ctx.lineTo(118, -90)
  ctx.lineTo(70, -100)
  ctx.stroke()
  // delivery box
  ctx.beginPath()
  ctx.roundRect(-330, -175, 200, 180, 24)
  ctx.fill()
  ctx.fillStyle = b.color
  ctx.font = `900 46px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(b.wordmark, -230, -85)
  // rider torso + arm
  ctx.fillStyle = b.deep
  ctx.lineWidth = 12
  ctx.beginPath()
  ctx.moveTo(-90, 15)
  ctx.lineTo(-60, -170)
  ctx.quadraticCurveTo(-10, -200, 30, -160)
  ctx.lineTo(90, -95)
  ctx.lineTo(60, -70)
  ctx.lineTo(10, -110)
  ctx.lineTo(20, 15)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // leg
  ctx.beginPath()
  ctx.moveTo(-10, 10)
  ctx.lineTo(50, 90)
  ctx.stroke()
  // helmet
  ctx.fillStyle = b.color
  ctx.beginPath()
  ctx.arc(-30, -245, 64, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#0b1a10'
  ctx.beginPath()
  ctx.ellipse(5, -240, 34, 22, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function makeAdTexture(b) {
  const W = 2048
  const H = 880
  const [c, ctx] = canvas(W, H)
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, b.color)
  g.addColorStop(1, b.deep)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  for (const r of [560, 420, 280]) {
    ctx.beginPath()
    ctx.arc(1640, 430, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // wordmark pill
  ctx.font = `900 96px ${FONT}`
  const ww = ctx.measureText(b.wordmark).width
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.roundRect(90, 70, ww + 100, 130, 65)
  ctx.fill()
  ctx.fillStyle = b.color
  ctx.textBaseline = 'middle'
  ctx.fillText(b.wordmark, 140, 138)

  // headline
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'
  ctx.font = `900 150px ${FONT}`
  ctx.fillText(b.headline[0], 90, 390)
  ctx.fillStyle = '#FFE45C'
  ctx.fillText(b.headline[1], 90, 550)

  ctx.font = `700 54px ${FONT}`
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillText(b.products, 96, 670)

  scooter(ctx, 1640, 470, 1.0, b)

  // footer strip
  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  ctx.fillRect(0, H - 86, W, 86)
  ctx.font = `700 34px ${FONT}`
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.fillText(b.tagline, 96, H - 43)
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText('Media by GMI Billboard  ·  gmibillboard.co.id', W - 70, H - 43)
  return toTexture(c)
}

export function makeLogoTexture(b) {
  const S = 1024
  const [c, ctx] = canvas(S, S)
  ctx.fillStyle = b.color
  ctx.fillRect(0, 0, S, S)
  const g = ctx.createRadialGradient(S * 0.35, S * 0.3, 10, S / 2, S / 2, S * 0.7)
  g.addColorStop(0, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(0,0,0,0.25)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `900 240px ${FONT}`
  ctx.fillText(b.wordmark, S / 2, S / 2 - 20)
  ctx.font = `700 46px ${FONT}`
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText('×  GMI BILLBOARD', S / 2, S / 2 + 150)
  return toTexture(c)
}

export function makePlateTexture() {
  const [c, ctx] = canvas(1024, 64)
  ctx.fillStyle = '#0b0d12'
  ctx.fillRect(0, 0, 1024, 64)
  ctx.fillStyle = '#ffc94a'
  ctx.font = `800 34px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('GMI BILLBOARD  ·  0811-9522-122', 512, 34)
  return toTexture(c)
}

export function makeWindowTexture() {
  const [c, ctx] = canvas(128, 256)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 128, 256)
  const colors = ['#ffd38a', '#ffe9c2', '#9fd1ff', '#ffb46b']
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 6; x++) {
      if (Math.random() > 0.38) continue
      ctx.fillStyle = colors[(Math.random() * colors.length) | 0]
      ctx.globalAlpha = 0.4 + Math.random() * 0.6
      ctx.fillRect(x * 21 + 4, y * 16 + 4, 13, 9)
    }
  }
  const t = toTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 6)
  return t
}
