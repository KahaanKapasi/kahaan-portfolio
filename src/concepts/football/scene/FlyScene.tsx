import { useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ChromaticAberrationEffect } from 'postprocessing'
import { DPR } from '../../../shared/webgl'
import Stadium, { pickQuality } from './Stadium'
import Effects from './Effects'
import { BallMesh, BALL_R } from './BallMesh'
import { flyPath } from './flypath'

function Rig({ progress, ca }: { progress: MutableRefObject<number>; ca: MutableRefObject<ChromaticAberrationEffect | null> }) {
  const sm = useRef(0)
  const vel = useRef(0)
  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const prev = sm.current
    sm.current += (progress.current - sm.current) * Math.min(1, dt * 3.6)
    const v = (sm.current - prev) / Math.max(dtRaw, 1 / 60)
    vel.current += (v - vel.current) * Math.min(1, dt * 8)
    const { pos, look } = flyPath(sm.current)
    const t = state.clock.elapsedTime
    const idle = Math.max(0, 1 - sm.current * 8)
    const cam = state.camera as THREE.PerspectiveCamera
    cam.position.set(
      pos[0] + Math.sin(t * 0.12) * 9 * idle + state.pointer.x * 0.9,
      pos[1] + Math.cos(t * 0.1) * 3 * idle + state.pointer.y * 0.4,
      pos[2] + Math.cos(t * 0.12) * 6 * idle,
    )
    cam.lookAt(look[0], look[1], look[2])
    const speed = Math.abs(vel.current)
    cam.rotateZ(Math.sin(t * 7) * Math.min(0.008, speed * 0.02) + state.pointer.x * -0.006)
    const fov = 50 + Math.min(16, speed * 70)
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
    if (ca.current) {
      const k = 0.0004 + Math.min(0.0018, speed * 0.012)
      ca.current.offset.set(k, k * 0.7)
    }
  })
  return null
}

function SpotBall() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.9
  })
  return (
    <group>
      <BallMesh ref={ref} position={[HL_SPOT, BALL_R, 0]} />
    </group>
  )
}
const HL_SPOT = 52.5 - 11

export default function FlyScene({ active, progress }: { active: boolean; progress: MutableRefObject<number> }) {
  const q = useMemo(() => pickQuality(), [])
  const excite = useRef(0.35)
  const ca = useRef<ChromaticAberrationEffect | null>(null)
  return (
    <Canvas
      dpr={DPR}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 50, near: 0.1, far: 900, position: [-98, 96, 112] }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      role="img"
      aria-label="Animated 3D fly-through of Northquay Arena, a fictional floodlit football stadium, ending behind the ball on the penalty spot"
    >
      <color attach="background" args={['#050b08']} />
      <fogExp2 attach="fog" args={['#07130d', 0.0036]} />
      <Stadium q={q} excite={excite} players />
      <SpotBall />
      <Rig progress={progress} ca={ca} />
      <Effects ca={ca} />
    </Canvas>
  )
}
