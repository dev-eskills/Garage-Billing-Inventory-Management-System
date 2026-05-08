import { motion } from 'framer-motion'
import { TrendingUp, Zap, Target, Award, PieChart } from 'lucide-react'

const lineData = [30, 45, 38, 62, 55, 78, 65, 88, 75, 92, 85, 100]
const kpis = [
  { icon: TrendingUp, value: '₹14.2L', label: 'Revenue', change: '+28%' },
  { icon: Zap, value: '1,240', label: 'Invoices', change: '+15%' },
  { icon: Target, value: '68%', label: 'Margin', change: '+4pp' },
  { icon: Award, value: '4.9★', label: 'Rating', change: '+0.3' },
]

export default function Analytics() {
  const maxVal = Math.max(...lineData)
  const points = lineData.map((v, i) => `${(i / (lineData.length - 1)) * 100},${100 - (v / maxVal) * 80}`).join(' ')
  const fillPoints = `0,100 ${points} 100,100`

  return (
    <section id="analytics" style={{ padding: '5rem 0', background: 'var(--bg-pure)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .an-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .an-detail-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 2rem; }
        @media (max-width: 768px) {
          .an-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
          .an-detail-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}} />
      <div className="container-pro">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <div className="badge-pro" style={{ margin: '0 auto 1.5rem' }}><PieChart size={12} /> Analytics Engine</div>
          <h2>Precision at Scale.</h2>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#555' }}>
            Aapke garage ka har data point ab aapke control mein hai. Live revenue aur mechanic performance track karein with 100% accuracy.
          </p>
        </motion.div>

        {/* KPI Row (Sharper Design) */}
        <div className="an-kpi-grid">
          {kpis.map((k, i) => (
            <motion.div key={k.label} className="pro-card"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{ padding: '2rem', textAlign: 'center', border: '1px solid #F0F0F0' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(230, 57, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)', margin: '0 auto 1.5rem' }}>
                <k.icon size={22} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>{k.value}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k.label}</div>
              <div style={{ fontSize: '0.7rem', color: '#22C55E', fontWeight: 800, marginTop: '1rem' }}>{k.change} vs last month</div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Detail Layout */}
        <div className="an-detail-grid">
          
          {/* Main Chart Card */}
          <div className="pro-card" style={{ padding: '3rem', borderRadius: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
               <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Revenue Velocity</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Monthly growth and transaction efficiency index.</p>
               </div>
               <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#22C55E', background: 'rgba(34, 197, 94, 0.1)', padding: '6px 14px', borderRadius: 100 }}>↑ 28.4% YoY</div>
             </div>
             
             <div style={{ height: 220, position: 'relative' }}>
               <svg viewBox="0 0 100 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                 <defs>
                   <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.2" />
                     <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 <motion.polygon 
                   points={fillPoints} 
                   fill="url(#anGrad)" 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   transition={{ duration: 1 }}
                 />
                 <motion.polyline 
                   points={points} 
                   fill="none" 
                   stroke="var(--accent-red)" 
                   strokeWidth="2" 
                   strokeLinecap="round" 
                   strokeLinejoin="round" 
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   transition={{ duration: 2 }}
                 />
               </svg>
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 25, borderTop: '1px solid #F5F5F5', paddingTop: 15 }}>
               {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map(m => (
                 <span key={m} style={{ fontSize: '0.6rem', color: '#999', fontWeight: 800 }}>{m}</span>
               ))}
             </div>
          </div>

          {/* Mechanic Leaderboard */}
          <div className="pro-card" style={{ padding: '3rem', borderRadius: '24px' }}>
             <h3 style={{ fontSize: '1.4rem', marginBottom: '2.5rem' }}>Top Performers</h3>
             {[
               { name: 'Rajesh Kumar', jobs: 142, rating: 4.9, color: 'var(--accent-red)' },
               { name: 'Amir Sheikh', jobs: 118, rating: 4.8, color: '#222' },
               { name: 'Vikram Singh', jobs: 97, rating: 4.7, color: '#555' },
               { name: 'Sanjay Maurya', jobs: 84, rating: 4.6, color: '#888' },
             ].map((m, i) => (
               <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i === 3 ? 0 : 25 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ 
                      width: 42, height: 42, borderRadius: 12, 
                      background: i === 0 ? 'var(--accent-red)' : '#F5F5F5', 
                      color: i === 0 ? 'white' : '#111',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: '0.85rem', fontWeight: 900 
                    }}>{m.name.split(' ')[0][0]}</div>
                    <div>
                       <div style={{ fontSize: '1rem', fontWeight: 800 }}>{m.name}</div>
                       <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700 }}>{m.jobs} SERVICES COMPLETED</div>
                    </div>
                 </div>
                 <div style={{ fontSize: '0.9rem', fontWeight: 900, color: i === 0 ? 'var(--accent-red)' : '#111' }}>{m.rating} ★</div>
               </div>
             ))}
          </div>

        </div>
      </div>
    </section>
  )
}
