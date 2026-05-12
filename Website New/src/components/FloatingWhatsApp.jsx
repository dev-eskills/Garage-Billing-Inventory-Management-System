import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp() {
  const whatsappNumber = '919826012345' // Example number for Indore
  const message = 'Hello Moin Bhai! I want to book a service for my vehicle in Indore.'
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 9999,
        background: '#25D366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)',
        textDecoration: 'none',
        border: '4px solid white'
      }}
    >
      <MessageCircle size={30} fill="white" />
      <span style={{
        position: 'absolute',
        right: '-10px',
        top: '-5px',
        background: '#FF3B30',
        color: 'white',
        fontSize: '10px',
        fontWeight: 900,
        padding: '2px 6px',
        borderRadius: '10px',
        border: '2px solid white'
      }}>1</span>
      
      {/* Tooltip */}
      <div style={{
        position: 'absolute',
        right: '75px',
        background: 'white',
        padding: '8px 15px',
        borderRadius: '12px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap',
        color: '#111',
        fontSize: '0.85rem',
        fontWeight: 800,
        pointerEvents: 'none',
        border: '1px solid #EEE'
      }}>
        Chat with Moin Bhai
      </div>
    </motion.a>
  )
}
