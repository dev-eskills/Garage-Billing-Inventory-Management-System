 import { useEffect, useRef } from 'react'

export default function Cursor() {
  const mainRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const main = mainRef.current
    const ring = ringRef.current
    if (!main || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      main.style.left = mx + 'px'
      main.style.top = my + 'px'
    }

    const tick = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      raf = requestAnimationFrame(tick)
    }

    const onEnter = () => { main.classList.add('hovered'); ring.classList.add('hovered') }
    const onLeave = () => { main.classList.remove('hovered'); ring.classList.remove('hovered') }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    tick()
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={mainRef} className="cursor-main" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
