 import { useEffect, useRef } from 'react'

export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true }) // Optimize context

    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    const isMobile = W < 768
    const count = isMobile ? 30 : 60 // Fewer particles on mobile
    
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      alpha: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.7 ? '#FF3B30' : '#ffffff',
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < count; i++) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => { 
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize) 
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.4 }}
    />
  )
}
