import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Shield, Car, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero-section" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      position: 'relative', 
      overflow: 'hidden',
      background: '#FFFFFF',
      paddingTop: '100px'
    }}>
      
      {/* Background Graphic Accents */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', background: 'rgba(230, 57, 70, 0.03)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(230, 57, 70, 0.02)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />

      <div className="container-pro" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }} className="mobile-center">
               <div className="badge-pro" style={{ background: 'rgba(230, 57, 70, 0.08)', color: 'var(--accent-red)', padding: '8px 20px' }}>
                  <Shield size={14} style={{ marginRight: 6 }} /> Powered by <span style={{ marginLeft: 4, fontWeight: 900 }}>MOIN MOTORS</span> Professionalism
               </div>
            </div>

            <h1 className="hero-title" style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.04em', fontWeight: 900 }}>
              Welcome to Moin Motors <br />
              <span style={{ color: 'var(--accent-red)' }}>Garage World.</span>
            </h1>

            <p className="hero-desc" style={{ fontSize: '1.25rem', color: '#555', marginBottom: '3.5rem', maxWidth: '550px', lineHeight: 1.6 }}>
              <span style={{ fontWeight: 800, color: 'var(--accent-red)' }}>Moin Motors</span> aur AutoBill Pro laaye hain aapke liye sabse fast aur modern car management experience. Ab har repair hoga transparent, aur har bill hoga sateek.
            </p>

            {/* Speed Lane Sticker */}
            <div className="sticker-container" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
               <div className="speed-sticker" style={{ 
                 position: 'relative', 
                 height: '65px', 
                 width: '320px', 
                 background: '#F9F9F9', 
                 borderRadius: '16px', 
                 overflow: 'hidden', 
                 display: 'flex', 
                 alignItems: 'center',
                 border: '1px solid #EEE'
               }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '1.2rem', 
                    zIndex: 5, 
                    background: '#F9F9F9', 
                    paddingRight: '0.8rem', 
                    fontWeight: 900, 
                    fontSize: '0.7rem', 
                    color: 'var(--accent-red)', 
                    textTransform: 'uppercase' 
                  }}>
                     Service Speed
                  </div>
                  <motion.div 
                    animate={{ x: ['-50%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'flex', gap: '3rem', alignItems: 'center', whiteSpace: 'nowrap' }}
                  >
                     {[...Array(4)].map((_, i) => (
                       <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-red)', opacity: 0.7 }}>
                          <Car size={24} />
                          <div style={{ width: '30px', height: '2px', background: 'var(--accent-red)', borderRadius: '2px' }} />
                       </div>
                     ))}
                  </motion.div>
               </div>
               <div className="sticker-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111' }}>Next-Gen Workshop</span>
                  <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600 }}>By Moin Motors</span>
               </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
               <Link to="/contact" className="btn-red" style={{ padding: '16px 42px', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  Book Free Demo <ArrowRight size={18} />
               </Link>
               <Link to="/about" style={{ padding: '16px 42px', fontSize: '1rem', background: '#111', color: 'white', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  Learn More
               </Link>
            </div>

            <div className="hero-stats" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '3rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 2, color: '#FFB800' }}>
                     {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FFB800" />)}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#999' }}>TOP-CLASS GARAGE STANDARD</span>
               </div>
               <div className="stat-sep" style={{ width: 1, height: '40px', background: '#EEE' }} />
               <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#111' }}>MOIN MOTORS</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#999' }}>ELITE WORKSHOP PARTNER</span>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.12)' }}>
               <img 
                 src="https://images.pexels.com/photos/372810/pexels-photo-372810.jpeg?auto=compress&cs=tinysrgb&w=1280" 
                 alt="Moin Motors Elite Experience" 
                 className="hero-img"
                 style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }} 
               />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
