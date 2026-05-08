import { motion } from 'framer-motion'
import { MessageSquare, CreditCard, Smartphone, UserCheck, Star } from 'lucide-react'

const future = [
  { icon: MessageSquare, title: 'WhatsApp Billing', desc: 'Send invoices, payment reminders, and service updates directly via WhatsApp Business API.', badge: 'Q2 2025' },
  { icon: CreditCard, title: 'Online Payments', desc: 'Accept UPI, card, and net banking payments directly from your invoices with one-click collection.', badge: 'Q3 2025' },
  { icon: Smartphone, title: 'Mobile App', desc: 'Full-featured iOS and Android app for on-the-go management, approvals, and customer interactions.', badge: 'Q4 2025' },
  { icon: UserCheck, title: 'Mechanic Tracking', desc: 'Real-time job assignment, progress tracking, and performance analytics per technician.', badge: '2026' },
]

export function FutureFeatures() {
  return (
    <section style={{ padding: '7rem 4rem', position: 'relative', zIndex: 2 }} className="max-md:px-6">
      <div className="glow-blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,59,48,0.06), transparent 70%)', top: '-100px', left: '-100px' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Coming Soon</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            The roadmap is ambitious
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 460, margin: '0 auto', fontSize: '0.95rem' }}>
            We're building the future of garage management. Here's what's coming next.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="max-md:grid-cols-1 max-lg:grid-cols-2">
          {future.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5F1F' }}>
                  <f.icon size={22} />
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'rgba(255,95,31,0.12)', border: '1px solid rgba(255,95,31,0.25)', color: '#FF5F1F', letterSpacing: '0.06em' }}>{f.badge}</span>
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</p>

              {/* Coming soon overlay shimmer */}
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'linear-gradient(135deg, transparent 60%, rgba(255,59,48,0.04))', pointerEvents: 'none', borderRadius: 20 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  { name: 'Arvind Sharma', role: 'Owner, Sharma Motors', location: 'Pune, MH', text: 'AutoBill Pro transformed how I run my garage. Billing used to take 20 minutes per customer — now it\'s under 90 seconds. The inventory tracking alone paid for itself in the first month.', rating: 5 },
  { name: 'Priya Nair', role: 'Manager, Speed Garage', location: 'Kochi, KL', text: 'The dashboard is something else. I can see exactly which services make money and which ones drain us. Never had this visibility before. My accountant loves the GST reports.', rating: 5 },
  { name: 'Mohammed Ismail', role: 'Director, AutoZone Workshop', location: 'Hyderabad, TS', text: 'Scaled from 1 bay to 4 in 8 months. AutoBill Pro handled the growth seamlessly. Customer data, job history, invoices — all in one place. The team productivity went up 40%.', rating: 5 },
]

export function Testimonials() {
  return (
    <section style={{ padding: '7rem 4rem', background: 'rgba(11,11,15,0.4)', position: 'relative', zIndex: 2 }} className="max-md:px-6">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Testimonials</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Workshops that made the switch
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="max-md:grid-cols-1">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} className="testimonial-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: '1.25rem' }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#FF5F1F" color="#FF5F1F" />
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '1.5rem' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #FF3B30, #FF5F1F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t.role} · {t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" style={{ padding: '7rem 4rem', position: 'relative', zIndex: 2 }} className="max-md:px-6">
      <div className="glow-blob" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,59,48,0.1), transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ready to upgrade your workshop?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
            Get a free demo tailored to your workshop size. No credit card required.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="max-md:grid-cols-1">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Full Name</label>
                <input className="form-input" type="text" placeholder="Arvind Sharma" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Email Address</label>
                <input className="form-input" type="email" placeholder="arvind@workshop.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Workshop Name</label>
                <input className="form-input" type="text" placeholder="Sharma Auto Works" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Phone Number</label>
                <input className="form-input" type="tel" placeholder="+91 98765 43210" />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Message (optional)</label>
              <textarea className="form-input" rows="4" placeholder="Tell us about your workshop and what you're looking for..." style={{ resize: 'vertical' }} />
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', padding: '0.9rem 2rem' }}>
              Book Free Demo →
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '1rem' }}>
              We'll respond within 24 hours. No spam, ever.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{ background: 'rgba(5,5,5,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '4rem 4rem 2rem', position: 'relative', zIndex: 2 }} className="max-md:px-6">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }} className="max-md:grid-cols-1 max-lg:grid-cols-2">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#FF3B30,#FF5F1F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>AutoBill<span style={{ color: '#FF3B30' }}>Pro</span></span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 280, marginBottom: '1.5rem' }}>
              The intelligent garage management platform for modern automotive workshops across India.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Twitter', 'LinkedIn', 'YouTube', 'Instagram'].map(s => (
                <div key={s} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }} title={s}>
                  {s.charAt(0)}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Features', 'Dashboard', 'Analytics', 'Pricing', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
            { title: 'Support', links: ['Documentation', 'API Reference', 'Status', 'Community', 'Help Center'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem', color: 'white' }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: '0.7rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div className="neon-line" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>© 2025 AutoBill Pro. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
