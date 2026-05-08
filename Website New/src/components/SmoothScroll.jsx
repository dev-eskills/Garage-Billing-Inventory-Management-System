import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useLocation } from 'react-router-dom'

export default function SmoothScroll({ children }) {
  const location = useLocation()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    window.lenis = lenis // Expose for manual scrolling if needed

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Handle initial hash or hash changes
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        setTimeout(() => {
          lenis.scrollTo(el, { offset: -80, duration: 1.5 })
        }, 300)
      }
    }

    return () => {
      lenis.destroy()
    }
  }, [location])

  return <>{children}</>
}
