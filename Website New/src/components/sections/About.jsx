import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Target, Star, CheckCircle2 } from 'lucide-react'

export default function About() {
  return (
    <section id="about" style={{ padding: '5rem 0', background: '#FFFFFF' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .about-main-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 4rem; align-items: center; }
        .about-checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .about-cta-row { margin-top: 2.5rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .about-main-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .about-checklist { grid-template-columns: 1fr !important; }
          .about-img { height: 300px !important; }
          .about-cta-row { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}} />
      <div className="container-pro">
        <div className="about-main-grid">

          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.08)', position: 'relative' }}>
              <img src="https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Our Mission" className="about-img" style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.95)', padding: '1.2rem', borderRadius: '18px', backdropFilter: 'blur(10px)', border: '1px solid white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <Heart size={18} fill="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Dil se, Indian Garages ke liye.</div>
                    <div style={{ fontSize: '0.72rem', color: '#666' }}>Trusted by Moin Motors & 500+ Workshops</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="badge-pro"><Target size={12} /> Hamari Kahani</div>
            <h2 style={{ marginBottom: '1rem', lineHeight: 1.1 }}>
              Moin Motors —{' '}
              <span style={{ color: 'var(--accent-red)' }}>Indore ka Sabse Trusted Garage.</span>
            </h2>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.7 }}>
                Indore mein ab car repair ka andaz badal gaya hai. <strong style={{ color: '#111' }}>Moin Motors</strong> laya hai 
                transparency aur world-class service, ab aapke apne shehar mein.
              </p>
            </div>

            <div className="about-checklist">
              {['Har Indian workshop ke liye fit', 'Simple language jo sabko samajh aaye', 'Aapka data, hamesha safe aur secure', 'Customer ka trust, digital billing se'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-red)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#222' }}>{item}</span>
                </div>
              ))}
            </div>

            <div className="about-cta-row">
              <Link to="/contact" className="btn-red" style={{ padding: '14px 36px', textDecoration: 'none' }}>Humse Judein</Link>
              <div style={{ display: 'flex', gap: 4, color: '#FFB800', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#FFB800" />)}
                <span style={{ color: '#111', fontSize: '0.82rem', fontWeight: 800, marginLeft: 8 }}>Top Rated</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
