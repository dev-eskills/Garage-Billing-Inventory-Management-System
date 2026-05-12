 import { useRef, Suspense, useState, useEffect, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Center, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'

/* ─── Error Boundary ─── */
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) return <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>3D Load Error: {this.state.error?.message}</div>
    return this.props.children
  }
}

function CarModel({ color }) {
  const { scene } = useGLTF('/models/suzuki_swift.glb')
  const bodyMaterials = useRef([])

  // Cache materials once on load
  useEffect(() => {
    const materials = []
    scene.traverse((child) => {
      if (child.isMesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach(mat => {
          if (!mat) return
          const name = (mat.name || child.name || '').toLowerCase()
          const isExcluded = 
            name.includes('glass') || name.includes('tire') || name.includes('wheel') || 
            name.includes('rubber') || name.includes('rim') || name.includes('light') || 
            name.includes('window') || name.includes('mirror') || name.includes('interior') || 
            name.includes('seat') || name.includes('dashboard') || name.includes('black') || 
            name.includes('chrome') || name.includes('grille') || name.includes('plastic') ||
            name.includes('metal_dark') || name.includes('undercarriage')

          if (!isExcluded) {
            materials.push(mat)
          }
        })
      }
    })
    bodyMaterials.current = materials
  }, [scene])

  // Update color efficiently without re-traversing
  useEffect(() => {
    bodyMaterials.current.forEach(mat => {
      mat.color.set(color)
    })
  }, [color])

  return <primitive object={scene} scale={0.85} />
}

export default function CarScene() {
  const [isVisible, setIsVisible] = useState(false)
  const [carColor, setCarColor] = useState('#ffffff')
  const containerRef = useRef(null)

  const colors = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Silver', hex: '#cccccc' },
    { name: 'Dark Gray', hex: '#333333' },
    { name: 'Red', hex: '#e63946' },
    { name: 'Blue', hex: '#1d3557' },
    { name: 'Gold', hex: '#d4af37' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => { if (containerRef.current) observer.unobserve(containerRef.current) }
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: 'transparent', borderRadius: '40px', overflow: 'hidden', position: 'relative' }}>
      {isVisible && (
        <ErrorBoundary>
          <Canvas 
            shadows 
            camera={{ position: [6, 4, 6], fov: 45 }} 
            dpr={[1, 1.5]} // Limit DPR for performance on high-res screens
            gl={{ antialias: true, powerPreference: "high-performance" }}
            performance={{ min: 0.5 }}
          >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow shadow-mapSize={512} />
            <directionalLight position={[-5, 5, 5]} intensity={1} />
            
            <Suspense fallback={null}>
              <Center top>
                <CarModel color={carColor} />
              </Center>
              <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={1} resolution={256} />
              <Environment preset="city" intensity={1} />
            </Suspense>

            <OrbitControls 
               autoRotate 
               autoRotateSpeed={1.5}
               enableZoom={true} 
               enablePan={false}
               minPolarAngle={Math.PI / 4} 
               maxPolarAngle={Math.PI / 2.1} 
            />
          </Canvas>

          {/* Color Picker UI */}
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.95)', padding: '12px 24px', borderRadius: '100px', backdropFilter: 'blur(15px)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            {colors.map(c => (
              <button
                key={c.hex}
                onClick={() => setCarColor(c.hex)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: c.hex,
                  border: carColor === c.hex ? '3px solid var(--accent-red)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: carColor === c.hex ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                title={c.name}
              />
            ))}
          </div>

          <div style={{ position: 'absolute', top: '30px', width: '100%', textAlign: 'center', pointerEvents: 'none' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.5em', textTransform: 'uppercase' }}>Drag to Rotate • Scroll to Zoom</p>
          </div>
        </ErrorBoundary>
      )}
    </div>
  )
}

useGLTF.preload('/models/suzuki_swift.glb')
