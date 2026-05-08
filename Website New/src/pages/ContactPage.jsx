import { motion } from 'framer-motion'
import { Phone, MapPin, MessageCircle, Heart, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-container { 
          max-width: 650px; 
          margin: 0 auto; 
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .contact-card {
          background: #FFFFFF;
          border-radius: 32px;
          padding: 2.5rem;
          width: 100%;
          box-shadow: 0 30px 80px rgba(0,0,0,0.04);
          border: 1px solid rgba(230, 57, 70, 0.04);
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .contact-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          padding: 1.5rem;
          border-radius: 20px;
          transition: all 0.3s ease;
          background: #FFF;
        }
        .contact-item:hover {
          background: rgba(230, 57, 70, 0.02);
          transform: translateY(-5px);
        }
        .icon-box {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(230, 57, 70, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-red);
          margin-bottom: 0.2rem;
        }
        .btn-whatsapp {
          background: #25D366;
          color: white;
          padding: 14px 32px;
          border-radius: 100px;
          font-weight: 800;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          box-shadow: 0 15px 30px rgba(37, 211, 102, 0.15);
          transition: all 0.3s ease;
        }
        .btn-whatsapp:hover {
          transform: scale(1.05);
          box-shadow: 0 25px 50px rgba(37, 211, 102, 0.3);
        }
        @media (max-width: 768px) {
          .contact-card { padding: 2.5rem 1.5rem; border-radius: 30px; }
          .grid-info { grid-template-columns: 1fr !important; }
        }
      `}} />

      <div className="contact-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div className="badge-pro" style={{ margin: '0 auto 1.5rem', background: 'rgba(230, 57, 70, 0.08)', color: 'var(--accent-red)' }}>
            <Heart size={14} style={{ marginRight: 6 }} /> We're here for you
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Aaiye, <span style={{ color: 'var(--accent-red)' }}>Milkar</span> Baat Karein.
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Dewas ka sabse trusted garage ab bas ek call ki doori par. Koi bhi sawal ho, beshijhak connect karein.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="contact-card"
        >
          {/* Animated Background Accents */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(230, 57, 70, 0.03)', borderRadius: '50%', filter: 'blur(60px)' }}
          />

          <div className="grid-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Address Card */}
            <div className="contact-item">
              <div className="icon-box">
                <MapPin size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>Humara Pata</h3>
              <p style={{ color: '#666', lineHeight: 1.5, fontSize: '0.9rem' }}>
                Moin Motors Hub, <br />
                Dewas, MP (455001)
              </p>
            </div>

            {/* Phone Card */}
            <div className="contact-item">
              <div className="icon-box">
                <Phone size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>Direct Call</h3>
              <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.85rem' }}>10 AM — 8 PM</p>
              <a href="tel:+919876543210" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-red)', textDecoration: 'none' }}>
                +91 98765 43210
              </a>
            </div>

          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.8rem', background: '#FAFAFA', borderRadius: '20px', position: 'relative', zIndex: 1 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111' }}>Moin Bhai Direct WhatsApp</h4>
            <p style={{ color: '#777', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.2rem', lineHeight: 1.5 }}>
              Service ya billing ke liye niche click karein.
            </p>
            <a href="https://wa.me/919876543211" target="_blank" rel="noreferrer" className="btn-whatsapp">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#AAA', fontSize: '0.85rem', fontWeight: 600 }}>
             <Send size={14} /> Hum aapse jaldi hi connect karenge!
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginTop: '3rem', color: '#AAA', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}
        >
          MADE WITH ❤️ FOR DEWAS BY MOIN MOTORS
        </motion.p>
      </div>
    </div>
  )
}
