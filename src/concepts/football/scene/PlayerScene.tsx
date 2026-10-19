import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { DPR } from '../../../shared/webgl'
import { PlayerModel } from './PlayerModel'
import { CLUBS, type ClubId, type Player } from '../data'

function Pedestal({ clubId }: { clubId: ClubId }) {
  const club = CLUBS[clubId]
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group position={[0, -0.01, 0]}>
      {/* Main grass turf pedestal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.12, 48]} />
        <meshStandardMaterial color="#1a5e2f" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Chalk boundary line circle on turf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.062, 0]}>
        <ringGeometry args={[1.34, 1.39, 48]} />
        <meshBasicMaterial color="#f4f6ee" opacity={0.9} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Glowing club accent boundary ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.064, 0]}>
        <ringGeometry args={[1.42, 1.45, 48]} />
        <meshBasicMaterial color={club.accent} opacity={0.65} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Dark stadium foundation base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.65, 1.75, 0.14, 48]} />
        <meshStandardMaterial color="#08120b" roughness={0.9} />
      </mesh>

      {/* Contact shadow plane under player boots */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.063, 0.04]}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial color="#030805" opacity={0.5} transparent />
      </mesh>
    </group>
  )
}

function Lighting({ clubId }: { clubId: ClubId }) {
  const club = CLUBS[clubId]

  return (
    <>
      <ambientLight intensity={0.6} color="#d4e8dc" />

      {/* Main key light: floodlight from top-front-right */}
      <directionalLight position={[3, 5, 4]} intensity={2.2} castShadow shadow-mapSize={1024} color="#f4fbf0" />

      {/* Back rim light: highlights player contours and back of shirt */}
      <directionalLight position={[-2.5, 3.5, -4]} intensity={2.0} color={club.accent} />

      {/* Left fill light: illuminates club details and arms */}
      <directionalLight position={[-4, 2, 2]} intensity={1.1} color="#608b74" />

      {/* Overhead stage spotlight */}
      <spotLight
        position={[0, 5, 0]}
        angle={0.55}
        penumbra={0.7}
        intensity={2.4}
        color="#ffffff"
        target-position={[0, 1, 0]}
      />
    </>
  )
}

export interface PlayerSceneProps {
  active: boolean
  clubId: ClubId
  player: Player
  autoRotate?: boolean
  viewAngle?: 'front' | 'back' | 'free'
}

export default function PlayerScene({
  active,
  clubId,
  player,
  autoRotate = false,
  viewAngle = 'free',
}: PlayerSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  useEffect(() => {
    if (!controlsRef.current) return
    if (viewAngle === 'front') {
      controlsRef.current.setAzimuthalAngle(0)
      controlsRef.current.setPolarAngle(Math.PI / 2 - 0.05)
      controlsRef.current.update()
    } else if (viewAngle === 'back') {
      controlsRef.current.setAzimuthalAngle(Math.PI)
      controlsRef.current.setPolarAngle(Math.PI / 2 - 0.05)
      controlsRef.current.update()
    }
  }, [viewAngle])

  return (
    <Canvas
      dpr={DPR}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 42, position: [0, 1.4, 3.4], near: 0.1, far: 50 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      role="img"
      aria-label={`Interactive 3D model of ${player.name} (${player.displayName} #${player.n}) wearing ${CLUBS[clubId].name} kit. Drag to rotate 360 degrees.`}
      className="cf-player-canvas"
    >
      <color attach="background" args={['#040a06']} />
      <fogExp2 attach="fog" args={['#050e09', 0.05]} />

      <Lighting clubId={clubId} />
      <Pedestal clubId={clubId} />
      <PlayerModel clubId={clubId} player={player} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={2.0}
        maxDistance={5.2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2 + 0.04}
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={2.5}
        target={[0, 1.15, 0]}
      />
    </Canvas>
  )
}
