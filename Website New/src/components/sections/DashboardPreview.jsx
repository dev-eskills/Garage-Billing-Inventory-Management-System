import { motion } from 'framer-motion'
import { Database, Settings, BarChart3 } from 'lucide-react'

export default function DashboardPreview() {
  return (
    <section style={{ padding: '5rem 0', background: '#FFFFFF', position: 'relative' }}>
      <div className="container-pro">
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="badge-pro"><BarChart3 size={12} /> The <span style={{ color: 'var(--accent-red)', marginLeft: 4 }}>MOIN MOTORS</span> Intelligence</div>
            <h2 className="dash-title" style={{ marginBottom: '1.2rem', lineHeight: 1.05, fontSize: '2.8rem' }}>
              Hamari Power, Aapki <br /><span style={{ color: 'var(--accent-red)' }}>Digital Taqat.</span>
            </h2>
            <p style={{ marginBottom: '2.5rem', maxWidth: '500px', fontSize: '1rem', color: '#555' }}>
              Humne ise <span style={{ fontWeight: 800, color: 'var(--accent-red)' }}>Moin Motors</span> jaise professional workshops ke liye design kiya hai.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { icon: Database, title: 'Centralized Records', desc: 'Moin Motors ke har customer ka record safe hai.' },
                { icon: Settings, title: 'Smart Automation', desc: 'Auto-billing jo Moin Motors standard par kaam karti hai.' }
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(230,57,70,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)', flexShrink: 0 }}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: 700 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="image-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ gridColumn: 'span 2', borderRadius: '24px', overflow: 'hidden', height: '300px' }}>
              <img src="https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1280" alt="Workshop" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ borderRadius: '20px', overflow: 'hidden', height: '180px' }}>
              <img src="https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Diagnostics" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} style={{ borderRadius: '20px', overflow: 'hidden', height: '180px' }}>
              <img src="https://images.pexels.com/photos/4489737/pexels-photo-4489737.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Engine" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
