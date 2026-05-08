import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float, MeshReflectorMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Premium Materials (Original High-Effect) ─── */
function useMats() {
  return useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({ 
      color: '#E63946', 
      metalness: 0.9, 
      roughness: 0.1, 
      clearcoat: 1, 
      clearcoatRoughness: 0.05,
      reflectivity: 1 
    }),
    glass: new THREE.MeshPhysicalMaterial({ 
      color: '#111', 
      metalness: 0.2, 
      roughness: 0, 
      transmission: 0.95, 
      transparent: true, 
      opacity: 0.4 
    }),
    rim: new THREE.MeshPhysicalMaterial({ 
      color: '#FFFFFF', 
      metalness: 1, 
      roughness: 0.1 
    }),
    tire: new THREE.MeshStandardMaterial({ 
      color: '#111111', 
      roughness: 0.8 
    }),
    lights: new THREE.MeshStandardMaterial({ 
      color: '#FFFFFF', 
      emissive: '#FFFFFF', 
      emissiveIntensity: 2 
    }),
    tail: new THREE.MeshStandardMaterial({ 
      color: '#FF0000', 
      emissive: '#FF0000', 
      emissiveIntensity: 3 
    }),
  }), [])
}

/* ─── Sleek Sedan Structure ─── */
function CarModel() {
  const group = useRef()
  const mats = useMats()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = t * 0.2 // Original smooth rotation
    }
  })

  const wheels = [
    [1, 0, 0.6], [1, 0, -0.6],   // Front
    [-1, 0, 0.6], [-1, 0, -0.6]  // Rear
  ]

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      
      {/* Lower Body (Chassis) */}
      <mesh material={mats.body} position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[2.8, 0.3, 1.3]} />
      </mesh>

      {/* Upper Body (Cabin) */}
      <mesh material={mats.body} position={[-0.2, 0.5, 0]} castShadow>
        <boxGeometry args={[1.6, 0.45, 1.25]} />
      </mesh>

      {/* Slanted Glass (Windshields) */}
      <mesh material={mats.glass} position={[0.7, 0.48, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.7, 0.4, 1.2]} />
      </mesh>
      <mesh material={mats.glass} position={[-1.1, 0.48, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.6, 0.4, 1.2]} />
      </mesh>

      {/* Hood (Bonnet) */}
      <mesh material={mats.body} position={[1, 0.3, 0]} rotation={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[0.8, 0.1, 1.3]} />
      </mesh>

      {/* Trunk (Boot) */}
      <mesh material={mats.body} position={[-1.2, 0.3, 0]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.6, 0.1, 1.3]} />
      </mesh>

      {/* Headlights */}
      <mesh material={mats.lights} position={[1.4, 0.25, 0.45]}>
        <boxGeometry args={[0.02, 0.1, 0.3]} />
      </mesh>
      <mesh material={mats.lights} position={[1.4, 0.25, -0.45]}>
        <boxGeometry args={[0.02, 0.1, 0.3]} />
      </mesh>

      {/* Taillights */}
      <mesh material={mats.tail} position={[-1.4, 0.28, 0]}>
        <boxGeometry args={[0.02, 0.08, 1.2]} />
      </mesh>

      {/* Wheels */}
      {wheels.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tire */}
          <mesh material={mats.tire} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.25, 32]} />
          </mesh>
          {/* Rim (Shiny Metal) */}
          <mesh material={mats.rim} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, pos[2] > 0 ? 0.05 : -0.05]}>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
          </mesh>
        </group>
      ))}

    </group>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={15}
        roughness={1}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#F5F5F5"
        metalness={0.05}
      />
    </mesh>
  )
}

export default function CarScene() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 2, 4], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#E63946" />
        
        <Suspense fallback={null}>
          <CarModel />
          <Floor />
          <Environment preset="studio" />
          <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Suspense>

        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1} 
          autoRotate={false}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
