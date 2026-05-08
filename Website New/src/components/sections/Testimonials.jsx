import { motion } from 'framer-motion'
import { Quote, Star, CheckCircle2 } from 'lucide-react'

const testimonials = [
  {
    name: "Arjun Singh",
    role: "Regular Customer",
    content: "Moin Motors ka kaam ek dum sateek hai! Unka nature itna accha hai ki woh har chiz detail mein samjhate hain. Payments hamesha transparent hoti hain.",
    rating: 5
  },
  {
    name: "Ravi Verma",
    role: "Fleet Owner",
    content: "Maine bohot garages dekhe hain par Moin Motors jaisa professional setup nahi dekha. Unka payment system itna digital hai ki koi tension hi nahi rehti.",
    rating: 5
  },
  {
    name: "Ismail Khan",
    role: "Transporter",
    content: "Moin Bhai ki garage management bohot sateek hai. Har ek part ka sahi rate aur digital billing hamesha mobile par on-time milti hai.",
    rating: 5
  },
  {
    name: "Moin Motors Team",
    role: "The Digital Visionary",
    content: "Humne AutoBill Pro isliye chuna taaki hum apne customers ko wahi digital experience de sakein jo ek premium showroom deta hai.",
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section style={{ padding: '5rem 0', background: '#FDFDFD' }}>
      <div className="container-pro">
        
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
           <div className="badge-pro" style={{ margin: '0 auto 1rem' }}>Customer Ki Zubani</div>
           <h2 style={{ fontSize: '2.8rem', marginBottom: '1.2rem', lineHeight: 1.1 }}>
             Moin Motors Par <br />
             <span style={{ color: 'var(--accent-red)' }}>Logon Ka Bharosa.</span>
           </h2>
           <p style={{ color: '#555', fontSize: '1.05rem' }}>
             Moin Motors ke customers unke digital tarike aur imaandaari ki tarif karte hain.
           </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem' 
        }}>
           {testimonials.map((t, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               style={{ background: 'white', padding: '2.5rem', borderRadius: '28px', border: '1px solid #F0F0F0', position: 'relative' }}
             >
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'rgba(230, 57, 70, 0.1)' }}>
                   <Quote size={32} />
                </div>
                <div style={{ display: 'flex', gap: 4, color: '#FFB800', marginBottom: '1.2rem' }}>
                   {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="#FFB800" />)}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.6, marginBottom: '2rem', fontWeight: 600, fontStyle: 'italic' }}>
                   "{t.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(230, 57, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)', fontWeight: 900, fontSize: '0.9rem' }}>
                      {t.name[0]}
                   </div>
                   <div>
                      <h4 style={{ fontWeight: 800, color: '#111', fontSize: '0.95rem' }}>{t.name} <CheckCircle2 size={12} style={{ display: 'inline', color: 'var(--accent-red)', marginLeft: 4 }} /></h4>
                      <p style={{ fontSize: '0.75rem', color: '#999', fontWeight: 800, textTransform: 'uppercase' }}>{t.role}</p>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </section>
  )
}
