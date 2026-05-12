 import { Link } from 'react-router-dom'
import { Car, MapPin, Phone, Mail, Globe, Send, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#FDFDFD', borderTop: '1px solid #F0F0F0' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .f-link { color: #555; text-decoration: none; font-size: 0.88rem; font-weight: 600; display: block; padding: 0.25rem 0; transition: color 0.2s; }
        .f-link:hover { color: var(--accent-red); }
        .f-social { width: 36px; height: 36px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; border: 1px solid #EEE; transition: all 0.3s; color: #555; text-decoration: none; }
        .f-social:hover { background: var(--accent-red) !important; color: white !important; border-color: var(--accent-red) !important; }

        /* Desktop layout */
        .footer-top { padding: 5rem 0 3rem; }
        .footer-desktop-grid { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1.4fr; gap: 4rem; }
        .footer-mobile-grid { display: none; }
        .footer-bottom { padding: 1.8rem 0; border-top: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; }

        /* Mobile layout */
        @media (max-width: 768px) {
          .footer-top { padding: 2.5rem 0 1.5rem; }
          .footer-desktop-grid { display: none !important; }
          .footer-mobile-grid { display: block !important; }

          /* Brand row */
          .fm-brand { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #F0F0F0; }
          
          /* 2-column box grid */
          .fm-boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem; }
          .fm-box { background: white; border: 1px solid #F0F0F0; border-radius: 16px; padding: 1.2rem; }
          .fm-box-title { font-size: 0.72rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-red); margin-bottom: 0.8rem; }

          /* Connect full-width box */
          .fm-connect { background: white; border: 1px solid #F0F0F0; border-radius: 16px; padding: 1.2rem; }

          .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; padding: 1.2rem 0; }
        }
      `}} />

      <div className="container-pro">
        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="footer-top">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: '4rem', marginBottom: '4rem' }} className="footer-desktop-grid">
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                AutoBill<span style={{ color: 'var(--accent-red)' }}>Pro.</span>
              </div>
              <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '280px' }}>
                <span style={{ fontWeight: 800, color: '#111' }}>INDORE'S BEST GARAGE</span> — Moin Motors aur AutoBill Pro ka bharosa.
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Links</h4>
              <Link to="/" className="f-link">Home</Link>
              <Link to="/about" className="f-link">About Moin Motors</Link>
              <Link to="/services" className="f-link">Our Services</Link>
              <Link to="/contact" className="f-link">Book Now</Link>
            </div>

            <div>
              <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Services</h4>
              <span className="f-link">Digital Billing</span>
              <span className="f-link">Smart Inventory</span>
              <span className="f-link">Job Cards</span>
              <span className="f-link">Indore Elite Support</span>
            </div>

            <div>
              <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Connect</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Moin+Motors+Indore+Nemawar+Road" 
                  target="_blank" 
                  rel="noreferrer"
                  className="footer-loc"
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', textDecoration: 'none', transition: 'color 0.3s ease' }}
                >
                  <MapPin size={16} color="var(--accent-red)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.87rem', color: '#555', fontWeight: 600, lineHeight: 1.5 }}>
                    <b style={{ color: 'var(--accent-red)', fontSize: '0.95rem' }}>INDORE</b> — Nemawar Road, Near Shivani Multi Venture, Khudel (452016)
                  </span>
                </a>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Phone size={15} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.87rem', color: '#555', fontWeight: 600 }}>+91 91794 44342</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Mail size={15} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.87rem', color: '#555', fontWeight: 600 }}>moin@moinmotors.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MOBILE LAYOUT (Box Style) ===== */}
        <div className="footer-mobile-grid">
          {/* Brand Row */}
          <div className="fm-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '0.8rem' }}>
              <div style={{ background: 'var(--accent-red)', width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Car size={17} />
              </div>
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#111', textTransform: 'uppercase' }}>
                Moin Motors <span style={{ color: 'var(--accent-red)' }}>Garage World</span>
              </span>
            </Link>
            <p style={{ color: '#777', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Moin Motors standard ki reliability — ab har Indian garage mein.
            </p>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              {[Globe, MessageCircle, Send].map((Icon, i) => (
                <a key={i} href="#" className="f-social"><Icon size={15} /></a>
              ))}
            </div>
          </div>

          {/* 2x2 Box Grid */}
          <div className="fm-boxes">
            {/* Explore Box */}
            <div className="fm-box">
              <div className="fm-box-title">Explore</div>
              {[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'About Us', path: '/about' }, { name: 'Contact', path: '/contact' }].map(l => (
                <Link key={l.name} to={l.path} className="f-link">{l.name}</Link>
              ))}
            </div>
            {/* Standards Box */}
            <div className="fm-box">
              <div className="fm-box-title">Standards</div>
              {['Digital Billing', 'Inventory', 'Job Cards', 'Staff Track'].map(item => (
                <span key={item} className="f-link" style={{ cursor: 'default' }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Connect Full Width Box */}
          <div className="fm-connect">
            <div className="fm-box-title">Connect</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <MapPin size={14} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#555', fontWeight: 600 }}>Moin Motors Hub, Dewas (MP)</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Phone size={14} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#555', fontWeight: 600 }}>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Mail size={14} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#555', fontWeight: 600 }}>moin@garageworld.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p style={{ fontSize: '0.75rem', color: '#AAA', fontWeight: 700, margin: 0 }}>© 2026 MOIN MOTORS. ALL RIGHTS RESERVED.</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Elite Workshop Partner</p>
        </div>
      </div>
    </footer>
  )
}
