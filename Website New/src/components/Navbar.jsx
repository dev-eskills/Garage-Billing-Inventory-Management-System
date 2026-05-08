import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Car, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 999,
        padding: scrolled ? '14px 0' : '20px 0',
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #EEE' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div className="container-pro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ background: 'var(--accent-red)', width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Car size={18} />
            </div>
            <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', fontWeight: 900, color: '#111', textTransform: 'uppercase' }}>
              Moin Motors <span style={{ color: 'var(--accent-red)' }}>Garage World</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="nav-desktop-links">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} style={{
                textDecoration: 'none',
                color: location.pathname === link.path ? 'var(--accent-red)' : '#111',
                fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>{link.name}</Link>
            ))}
            <Link to="/contact" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              textDecoration: 'none', 
              background: 'rgba(230,57,70,0.06)', 
              padding: '10px 20px', 
              borderRadius: '100px',
              border: '1px solid rgba(230,57,70,0.1)',
              transition: 'all 0.3s'
            }} className="nav-action-badge">
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-red)', letterSpacing: '0.05em' }}>BOOK SERVICE</span>
              <div style={{ background: 'var(--accent-red)', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <Car size={14} />
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', padding: '4px', display: 'none' }}
            className="nav-mobile-btn"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.55)',
                zIndex: 9998,
              }}
            />

            {/* Sidebar Drawer */}
            <motion.aside
              key="sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '75%', maxWidth: '300px',
                background: '#fff',
                zIndex: 9999,
                display: 'flex', flexDirection: 'column',
                boxShadow: '-4px 0 30px rgba(0,0,0,0.15)',
                overflowY: 'auto'
              }}
            >
              {/* Sidebar Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ background: 'var(--accent-red)', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Car size={16} />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#111', textTransform: 'uppercase' }}>Menu</span>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: '#F5F5F5', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={20} color="#111" />
                </button>
              </div>

              {/* Nav Links */}
              <div style={{ padding: '1rem', flex: 1 }}>
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1rem 1.2rem',
                      marginBottom: '0.4rem',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: location.pathname === link.path ? 'var(--accent-red)' : '#111',
                      background: location.pathname === link.path ? 'rgba(230,57,70,0.06)' : 'transparent',
                    }}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={16} color="#CCC" />
                  </Link>
                ))}
              </div>

              {/* Bottom CTA */}
              <div style={{ padding: '1.5rem', borderTop: '1px solid #F0F0F0' }}>
                <Link to="/contact" className="btn-red" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px', width: '100%', fontSize: '0.95rem', borderRadius: '16px', textDecoration: 'none' }}>
                  Book Service Now <Car size={18} />
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
