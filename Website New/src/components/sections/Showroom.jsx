import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Car, ChevronRight, LayoutGrid } from 'lucide-react'
import CarScene from '../three/CarScene'

export default function Showroom() {
  return (
    <section id="showroom" style={{ padding: '5rem 0', background: '#FFFFFF', overflow: 'hidden' }}>
      <div className="container-pro">
        
        <div className="showroom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ zIndex: 10 }}
            className="showroom-content"
          >
            <div className="badge-pro">
              <LayoutGrid size={12} /> The <span style={{ color: 'var(--accent-red)', marginLeft: 4 }}>MOIN MOTORS</span> Standard
            </div>
            <h2 className="section-title" style={{ marginBottom: '1.2rem', lineHeight: 1.1, fontSize: '2.5rem' }}>
              Aapka Garage, <br />
              <span style={{ color: 'var(--accent-red)' }}>Nayi Pehchan.</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: '2rem', maxWidth: '450px', fontSize: '1rem', color: '#555' }}>
              AutoBill Pro ke saath aapka workshop ek premium brand ban jayega, bilkul <span style={{ fontWeight: 800, color: 'var(--accent-red)' }}>Moin Motors</span> ki tarah.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
               {[
                 { title: 'भरोसा (Trust)', desc: 'Moin Motors ki tarah transparent billing.' },
                 { title: 'रफ़्तार (Speed)', desc: 'Inventory aur jobs manage karein super fast.' }
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <div style={{ color: 'var(--accent-red)', marginTop: '4px' }}><ChevronRight size={18} /></div>
                    <div>
                       <h4 style={{ fontSize: '1rem', marginBottom: '0.1rem', fontWeight: 800 }}>{item.title}</h4>
                       <p style={{ fontSize: '0.85rem', color: '#666' }}>{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <Link to="/contact" className="btn-red">
              Join <span style={{ marginLeft: 4, fontWeight: 900 }}>MOIN MOTORS</span> Network
            </Link>
          </motion.div>

          {/* 3D Scene Container */}
          <div 
            className="showroom-visual"
            style={{ 
              position: 'relative', 
              height: '500px', 
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)', 
              borderRadius: '48px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}
          >
             <motion.div 
               animate={{ y: [0, -8, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
               style={{ position: 'absolute', top: '15%', left: '10%', zIndex: 10, background: 'white', padding: '6px 12px', borderRadius: '100px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-red)', border: '1px solid #F0F0F0', pointerEvents: 'none' }}
             >
                MOIN MOTORS
             </motion.div>
             <CarScene />
          </div>

        </div>
      </div>
    </section>
  )
}
