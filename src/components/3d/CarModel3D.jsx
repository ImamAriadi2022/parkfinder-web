import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'

// URL publik – GLB di /public/models/ agar bisa di-preload lewat <link rel="preload">
const MODEL_URL = '/models/mclaren_600lt.glb'

// Mulai fetch GLB SEGERA saat modul ini di-load (paralel dengan render pertama)
useGLTF.preload(MODEL_URL)

function CarMesh({ scale = 2.5 }) {
  const { scene } = useGLTF(MODEL_URL)
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.7) * 0.03
  })

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={scale}
        position={[0, -0.03, 0]}
        rotation={[0, -Math.PI / 6, 0]}
      />
    </group>
  )
}

function LoadingFallback({ height }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div className="spinner-3d" />
      <span style={{ fontSize: 12, color: 'var(--pf-text3)' }}>Memuat…</span>
    </div>
  )
}

export default function CarModel3D({
  height = 360,
  scale = 2.5,
  autoRotate = true,
  interactive = false,
  fov = 35,
  cameraPos = [3, 0.8, 3],
}) {
  return (
    <div style={{ width: '100%', height }}>
      <Suspense fallback={<LoadingFallback height={height} />}>
        <Canvas
          camera={{ position: cameraPos, fov }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          {/* Lights saja – tanpa Environment (menghilangkan fetch HDR dari CDN) */}
          <ambientLight intensity={2.0} />
          <directionalLight position={[8, 10, 6]} intensity={3} />
          <directionalLight position={[-6, 5, -4]} intensity={1} color="#93C5FD" />
          <pointLight position={[0, 5, 3]} intensity={1.5} color="#00D2FF" />
          <hemisphereLight args={['#b9dff5', '#1a2d47', 1.0]} />

          <CarMesh scale={scale} />

          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={1.8}
            enableZoom={interactive}
            enablePan={false}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2.2}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
