import { motion } from 'framer-motion'
import { ClipboardList, FileCheck, Share2, TrendingUp, MousePointer2 } from 'lucide-react'

const GrowthGraph = () => (
  <div style={{ width: '100%', height: '220px', background: '#FFF', borderRadius: '20px', border: '1px solid #EEE', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#111' }}>WORKSHOP REVENUE GROWTH</div>
      <div style={{ color: '#22C55E', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
        <TrendingUp size={13} /> +45%
      </div>
    </div>
    <svg width="100%" height="110" viewBox="0 0 400 110" fill="none">
      <motion.path d="M0 100 L50 90 L100 95 L150 70 L200 75 L250 40 L300 45 L350 10 L400 15" stroke="var(--accent-red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
      <motion.path d="M0 100 L50 90 L100 95 L150 70 L200 75 L250 40 L300 45 L350 10 L400 15 V110 H0 Z" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }} style={{ fill: 'rgba(230,57,70,0.05)' }} />
    </svg>
    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: '0.6rem', fontWeight: 700 }}>
      <span>WK 1</span><span>WK 2</span><span>WK 3</span><span>WK 4</span>
    </div>
  </div>
)

const steps = [
  { icon: ClipboardList, num: '01', title: 'Gadi ki Entry', desc: 'Customer ki car details 10 seconds mein add karein.' },
  { icon: FileCheck, num: '02', title: 'Digital Bill Banao', desc: 'GST aur total system apne aap calculate karega.' },
  { icon: Share2, num: '03', title: 'WhatsApp Share', desc: 'Bill direct customer ke WhatsApp par bhejein.' },
  { icon: TrendingUp, num: '04', title: 'Workshop Progress', desc: 'Din mein kamai aur mechanic performance dekhein.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '5rem 0', background: 'var(--bg-pure)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hiw-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: center; }
        .hiw-steps { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        @media (max-width: 768px) {
          .hiw-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .hiw-steps { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}} />
      <div className="container-pro">
        <div className="hiw-grid">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="badge-pro"><MousePointer2 size={12} /> Workshop Success</div>
            <h2 style={{ marginBottom: '1.2rem', lineHeight: 1.1 }}>
              Apne Garage ko<br /><span style={{ color: 'var(--accent-red)' }}>Smart Banao.</span>
            </h2>
            <p style={{ marginBottom: '2rem', maxWidth: '480px', fontSize: '0.95rem', color: '#555' }}>
              AutoBill Pro use karna bohot simple hai. Humne ise Indian workshop owners ke liye banaya hai.
            </p>
            <GrowthGraph />
          </motion.div>

          <div className="hiw-steps">
            {steps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="pro-card" style={{ padding: '1.8rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 16, fontSize: '2.2rem', fontWeight: 900, color: 'rgba(230,57,70,0.05)' }}>{step.num}</div>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(230,57,70,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: 'var(--accent-red)' }}>
                  <step.icon size={20} />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 800 }}>{step.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.5 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
