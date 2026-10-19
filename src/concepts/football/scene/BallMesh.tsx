import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'
import { makeBallTexture } from './world'

export const BALL_R = 0.16

export const BallMesh = forwardRef<THREE.Mesh, { position?: [number, number, number] }>(function BallMesh({ position }, ref) {
  const map = useMemo(() => makeBallTexture(), [])
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[BALL_R, 40, 28]} />
      <meshStandardMaterial map={map} roughness={0.38} metalness={0.05} />
    </mesh>
  )
})
