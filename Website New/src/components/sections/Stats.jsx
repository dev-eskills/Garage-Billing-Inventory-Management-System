import { motion } from 'framer-motion'
import { TrendingUp, Users, CheckCircle, Activity } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '1.2M+', label: 'Bills Generated', desc: 'Processing 10K+ daily', color: 'var(--accent-red)' },
  { icon: Users, value: '500+', label: 'Workshops', desc: 'Trust our industrial core', color: 'var(--text-main)' },
  { icon: CheckCircle, value: '99.9%', label: 'Precision Rate', desc: 'Zero margin for error', color: 'var(--accent-red)' },
  { icon: Activity, value: 'Neural Sync', label: 'Real-Time', desc: 'Zero latency operations', color: 'var(--text-main)' },
]

export default function Stats() {
  return (
    <section id="stats" style={{ padding: '5rem 0', background: 'var(--bg-subtle)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
      `}} />
      <div className="container-pro">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="pro-card"
              style={{ textAlign: 'center', padding: '3rem 2rem' }}
            >
              <div style={{ 
                width: 50, height: 50, borderRadius: 14, 
                background: 'rgba(230, 57, 70, 0.08)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 1.5rem', color: 'var(--accent-red)' 
              }}>
                <s.icon size={22} />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{s.value}</div>
              <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{s.label}</div>
              <p style={{ fontSize: '0.85rem' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Brand Bar */}
        <div style={{ marginTop: '5rem', padding: '2rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.3 }}>
          {['WHATSAPP', 'GST PORTAL', 'PAYTM', 'RAZORPAY', 'TALLY', 'EXCEL'].map(brand => (
            <span key={brand} style={{ fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.2em' }}>{brand}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
