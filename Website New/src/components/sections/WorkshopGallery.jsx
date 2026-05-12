import { motion } from 'framer-motion'
import { Wrench, CheckCircle2, Star } from 'lucide-react'

const images = [
  { url: "https://srqautorepair.com/wp-content/uploads/2018/09/frankie_inspection.jpg", title: "Professional Inspection", desc: "Har gadi ki deep checking, Moin Motors standard ke saath." },
  { url: "https://images.unsplash.com/photo-1504222490345-c075b6008014?q=80&w=1000", title: "Precision Tuning", desc: "Expert haathon se mechanical precision, har bar sateek kaam." },
  { url: "https://www.shutterstock.com/image-photo/premium-automotive-service-center-concept-260nw-2719684713.jpg", title: "Digital Diagnostics", desc: "Modern scanning tools jo aapki gadi ki health batayein digital tarike se." }
]

export default function WorkshopGallery() {
  return (
    <section style={{ padding: '5rem 0', background: '#FBFBFB' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .wg-top { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-bottom: 4rem; }
        .wg-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .wg-card { position: relative; border-radius: 24px; overflow: hidden; height: 380px; }
        @media (max-width: 768px) {
          .wg-top { grid-template-columns: 1fr !important; gap: 2rem !important; margin-bottom: 2.5rem !important; }
          .wg-cards { grid-template-columns: 1fr !important; gap: 1.2rem !important; }
          .wg-card { height: 260px !important; }
        }
      `}} />
      <div className="container-pro">
        
        <div className="wg-top">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="badge-pro"><Wrench size={12} /> Workshop Vibe</div>
            <h2 style={{ marginBottom: '1.2rem', lineHeight: 1.1 }}>
              Where Technology Meets <br />
              <span style={{ color: 'var(--accent-red)' }}>Real Mechanics.</span>
            </h2>
            <p style={{ maxWidth: '480px', fontSize: '1rem', color: '#444', marginBottom: '2rem' }}>
              AutoBill Pro sirf ek software nahi hai, ye aapke garage ki dharkan hai. Hum samajhte hain ki ek mechanic ki mehnat kitni keemti hoti hai.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Indian workshop standard design', 'Simple billing jo har koi chala sake', 'Aapki kamai ka poora hisab, ek jagah'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <CheckCircle2 size={18} color="var(--accent-red)" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{ background: 'white', padding: '2.5rem', borderRadius: '28px', boxShadow: '0 30px 60px rgba(0,0,0,0.04)', border: '1px solid #F0F0F0' }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', color: '#FFB800' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#FFB800" />)}
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, fontStyle: 'italic', marginBottom: '1.8rem', color: '#111', lineHeight: 1.5 }}>
              "AutoBill Pro ne mere garage ka pura kaam asaan kar diya hai. Ab bill banana aur WhatsApp share karna bohot fast hai!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Customer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1rem' }}>Rajesh Kumar</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 800 }}>OWNER, SAI MOTORS</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="wg-cards">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="wg-card">
              <img src={img.url} alt={img.title} style={{ width: '100%', height: '90%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)', padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{ color: 'white', marginBottom: '0.4rem', fontSize: '1.2rem' }}>{img.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.4 }}>{img.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
