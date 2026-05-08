import { motion } from 'framer-motion'
import { LayoutDashboard, Package, Receipt, DollarSign, BarChart2, Users } from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Smart Dashboard',
    desc: 'Real-time KPI tracking with live revenue, inventory status, and billing summaries — all in one cinematic command center.',
    tags: ['Live Data', 'KPIs'],
  },
  {
    icon: Package,
    title: 'Inventory Management',
    desc: 'Auto-track parts, consumables, and stock levels. Get low-stock alerts before they cost you a job.',
    tags: ['Auto-Alert', 'Multi-Warehouse'],
  },
  {
    icon: Receipt,
    title: 'Billing System',
    desc: 'Generate GST-compliant invoices in seconds. Professional, branded PDF bills shared instantly via WhatsApp or email.',
    tags: ['GST Ready', 'WhatsApp'],
  },
  {
    icon: DollarSign,
    title: 'Expense Tracking',
    desc: 'Monitor every rupee spent on operations, labour, and procurement. Know your margins with pinpoint precision.',
    tags: ['Profit/Loss', 'Analytics'],
  },
  {
    icon: BarChart2,
    title: 'Reports & Analytics',
    desc: 'Deep-dive visual analytics with monthly trends, top-selling services, mechanic performance, and custom date ranges.',
    tags: ['Visual Charts', 'Export'],
  },
  {
    icon: Users,
    title: 'Customer Management',
    desc: 'Build rich customer profiles with vehicle history, service records, loyalty tracking, and automated service reminders.',
    tags: ['CRM', 'Reminders'],
  },
]

export default function Features() {
  return (
    <section id="features" style={{ padding: '7rem 4rem', position: 'relative', zIndex: 2 }} className="max-md:px-6">
      <div className="glow-blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,59,48,0.07), transparent 70%)', top: '20%', right: '-100px', animation: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>Platform Features</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Everything your garage needs
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', fontSize: '1rem' }}>
            A complete operational stack built for modern auto workshops — no duct-tape integrations, no bloat.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="max-md:grid-cols-1 max-lg:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <div className="icon-wrap">
                <f.icon size={22} />
              </div>

              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.65rem', letterSpacing: '-0.01em' }}>
                {f.title}
              </h3>

              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                {f.desc}
              </p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {f.tags.map(t => (
                  <span key={t} style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', fontSize: '0.72rem', fontWeight: 600, color: '#FF5F1F', letterSpacing: '0.04em' }}>{t}</span>
                ))}
              </div>

              {/* Accent corner */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'radial-gradient(circle at top right, rgba(255,59,48,0.08), transparent 70%)', borderRadius: '0 20px 0 0', pointerEvents: 'none' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
