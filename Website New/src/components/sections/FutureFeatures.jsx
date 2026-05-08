import { motion } from 'framer-motion'
import { MessageSquare, CreditCard, Smartphone, UserCheck, Calendar } from 'lucide-react'

const items = [
  { icon: MessageSquare, title: 'WhatsApp API', desc: 'Auto-send reminders and updates via WhatsApp Business.', badge: 'Q2 2025' },
  { icon: CreditCard, title: 'UPI Payments', desc: 'Accept direct payments via invoices instantly.', badge: 'Q3 2025' },
  { icon: Smartphone, title: 'Mobile App', desc: 'Full-featured iOS & Android app for workshop owners.', badge: 'Q4 2025' },
  { icon: UserCheck, title: 'Job Assignment', desc: 'Real-time progress and per-technician analytics.', badge: '2026' },
]

export default function FutureFeatures() {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-subtle)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .ff-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        @media (max-width: 768px) { .ff-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .ff-grid { grid-template-columns: 1fr !important; } }
      `}} />
      <div className="container-pro">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:'4rem' }}>
          <div className="badge-pro" style={{ margin: '0 auto 1.5rem' }}><Calendar size={12} /> Roadmap</div>
          <h2>Our Future Innovation.</h2>
        </motion.div>

        <div className="ff-grid">
          {items.map((f, i) => (
            <motion.div key={f.title} 
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.08 }}
              className="pro-card"
              style={{ padding: '2rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:'rgba(230, 57, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color:'var(--accent-red)' }}>
                  <f.icon size={20}/>
                </div>
                <span style={{ fontSize:'.6rem', fontWeight:800, padding:'4px 10px', borderRadius:100, border:'1px solid var(--accent-red)', color:'var(--accent-red)', letterSpacing:'.05em' }}>{f.badge}</span>
              </div>
              <h3 style={{ fontSize:'.95rem', marginBottom:'.5rem' }}>{f.title}</h3>
              <p style={{ fontSize:'.8rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
