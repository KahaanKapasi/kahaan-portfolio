import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ChromaticAberrationEffect } from 'postprocessing'
import { DPR } from '../../../shared/webgl'
import Stadium, { pickQuality } from './Stadium'
import Effects from './Effects'
import { BallMesh } from './BallMesh'
import { GOAL, type KickGame } from '../kickgame'
import { CLUBS, type ClubId } from '../data'

function Figure({ color, skin = '#c9b8a4', sock = '#f1f5e9' }: { color: string; skin?: string; sock?: string }) {
  return (
    <group scale={0.9}>
      <mesh position={[-0.12, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.8, 8]} />
        <meshStandardMaterial color={sock} roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.8, 8]} />
        <meshStandardMaterial color={sock} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <capsuleGeometry args={[0.26, 0.5, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.96, 0]}>
        <sphereGeometry args={[0.17, 14, 12]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>
    </group>
  )
}

function KickWorld({
  game,
  excite,
  caRef,
  kickerClub = 'real-madrid',
  wallClub = 'barcelona',
}: {
  game: KickGame
  excite: React.MutableRefObject<number>
  caRef: React.MutableRefObject<ChromaticAberrationEffect | null>
  kickerClub?: ClubId
  wallClub?: ClubId
}) {
  const ballRef = useRef<THREE.Mesh>(null)
  const wallRefs = useRef<(THREE.Group | null)[]>([])
  const keeperRef = useRef<THREE.Group>(null)
  const keeperInner = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const preview = useRef<THREE.Points>(null)
  const burst = useRef<THREE.Points>(null)
  const flashLight = useRef<THREE.AmbientLight>(null)

  const kClub = CLUBS[kickerClub]
  const wClub = CLUBS[wallClub]

  const state = useMemo(
    () => ({
      q: new THREE.Quaternion(),
      tq: new THREE.Quaternion(),
      axis: new THREE.Vector3(),
      cam: new THREE.Vector3(),
      look: new THREE.Vector3(),
      shake: 0,
      flash: 0,
      hash: '',
      vel: new Float32Array(260 * 3),
      life: new Float32Array(260),
      col: new Float32Array(260 * 3),
      base: new Float32Array(260 * 3),
      wallN: 0,
      first: true,
    }),
    [],
  )

  const prevGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(60 * 3), 3))
    g.setDrawRange(0, 0)
    return g
  }, [])

  const burstGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(260 * 3).fill(-999), 3))
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(260 * 3), 3))
    return g
  }, [])

  useEffect(() => {
    const off = game.on((e) => {
      if (e.type === 'fx' && e.what === 'goal') {
        state.shake = 1
        state.flash = 1
        excite.current = 1
        const pos = burstGeo.getAttribute('position') as THREE.BufferAttribute
        const colA = new THREE.Color(kClub.accent)
        const colB = new THREE.Color(kClub.primary)
        const colC = new THREE.Color('#d4ff3c')
        for (let i = 0; i < 260; i++) {
          pos.setXYZ(i, GOAL.x + 0.6, 1.2, game.ball.z)
          const a = Math.random() * Math.PI * 2
          const u = Math.random() * 2 - 1
          const sp = 3 + Math.random() * 9
          const s = Math.sqrt(1 - u * u)
          state.vel[i * 3] = Math.abs(Math.cos(a) * s) * sp * 0.6 - 1
          state.vel[i * 3 + 1] = Math.abs(u) * sp + 2
          state.vel[i * 3 + 2] = Math.sin(a) * s * sp
          state.life[i] = 1.3 + Math.random() * 1.1
          const c = [colA, colB, colC, colA][i % 4]
          state.base.set([c.r, c.g, c.b], i * 3)
        }
        pos.needsUpdate = true
      } else if (e.type === 'fx' && (e.what === 'save' || e.what === 'post')) {
        state.shake = Math.max(state.shake, 0.35)
      } else if (e.type === 'ready') {
        state.first = false
      }
    })
    return off
  }, [game, state, excite, burstGeo, kClub])

  useFrame((s, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    game.step(dt)
    const b = game.ball
    const d = game.dir
    // ball
    const bm = ballRef.current
    if (bm) {
      bm.position.set(b.x, b.y, b.z)
      const w = game.spin
      const mag = Math.hypot(w.x, w.y, w.z)
      if (mag > 1e-3) {
        state.axis.set(w.x / mag, w.y / mag, w.z / mag)
        state.tq.setFromAxisAngle(state.axis, mag * dt)
        state.q.premultiply(state.tq)
      }
      bm.quaternion.copy(state.q)
    }
    // wall
    game.wall.forEach((m, i) => {
      const g = wallRefs.current[i]
      if (g) {
        g.visible = true
        g.position.set(m.x, m.jump, m.z)
        g.rotation.y = Math.atan2(-d.x, -d.z)
      }
    })
    for (let i = game.wall.length; i < wallRefs.current.length; i++) {
      const g = wallRefs.current[i]
      if (g) g.visible = false
    }
    // keeper
    const k = game.keeper
    if (keeperRef.current && keeperInner.current) {
      keeperRef.current.position.set(GOAL.x - 0.45, Math.max(0, (k.y - 0.95) * 0.7), k.z)
      keeperInner.current.rotation.z = -k.lean
      const up = THREE.MathUtils.clamp(0.32 + Math.abs(k.y - 0.95) * 0.5 + Math.abs(k.lean) * 0.35, 0.32, 1)
      if (armL.current) armL.current.rotation.z = (Math.PI / 2) * (1 - 2 * up)
      if (armR.current) armR.current.rotation.z = -(Math.PI / 2) * (1 - 2 * up)
    }
    // aim preview
    const pv = preview.current
    if (pv) {
      pv.visible = game.phase === 'ready'
      const p = game.params
      const h = `${game.attempt}|${p.yaw.toFixed(3)}|${p.loft.toFixed(3)}|${p.curve.toFixed(2)}|${p.power.toFixed(2)}`
      if (pv.visible && h !== state.hash) {
        state.hash = h
        const { pts } = game.predict()
        const n = Math.min(60, Math.floor(pts.length / 3))
        const attr = prevGeo.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < n * 3; i++) attr.array[i] = pts[i]
        attr.needsUpdate = true
        prevGeo.setDrawRange(0, n)
      }
    }
    // burst particles
    const pos = burstGeo.getAttribute('position') as THREE.BufferAttribute
    const col = burstGeo.getAttribute('color') as THREE.BufferAttribute
    let alive = false
    for (let i = 0; i < 260; i++) {
      if (state.life[i] > 0) {
        alive = true
        state.life[i] -= dt
        state.vel[i * 3 + 1] -= 9.81 * dt
        pos.setXYZ(
          i,
          pos.getX(i) + state.vel[i * 3] * dt,
          Math.max(0.05, pos.getY(i) + state.vel[i * 3 + 1] * dt),
          pos.getZ(i) + state.vel[i * 3 + 2] * dt,
        )
        const f = Math.max(0, Math.min(1, state.life[i] * 1.2)) * 2.2
        col.setXYZ(i, state.base[i * 3] * f, state.base[i * 3 + 1] * f, state.base[i * 3 + 2] * f)
      }
    }
    if (alive) {
      pos.needsUpdate = true
      col.needsUpdate = true
    }
    // camera
    const cam = s.camera as THREE.PerspectiveCamera
    const sx = game.start.x
    const sz = game.start.z
    const follow = game.phase === 'ready' ? 0 : Math.min(1, game.clock / 1.1)
    const e = follow * follow * (3 - 2 * follow)
    const tx = sx - d.x * (6.9 - e * 3.2)
    const ty = 1.85 - e * 0.35
    const tz = sz - d.z * (6.9 - e * 3.2)
    state.cam.set(tx, ty, tz)
    const lx = THREE.MathUtils.lerp(sx + d.x * 18, b.x, e * 0.62)
    const ly = THREE.MathUtils.lerp(1.1, Math.max(0.6, b.y), e * 0.5)
    const lz = THREE.MathUtils.lerp(sz + d.z * 18, b.z, e * 0.62)
    state.look.set(lx, ly, lz)
    if (state.first) {
      cam.position.copy(state.cam)
    } else {
      cam.position.lerp(state.cam, Math.min(1, dt * 3.2))
    }
    state.shake = Math.max(0, state.shake - dt * 1.7)
    const sh = state.shake * state.shake
    cam.position.x += (Math.random() - 0.5) * 0.32 * sh
    cam.position.y += (Math.random() - 0.5) * 0.28 * sh
    cam.position.z += (Math.random() - 0.5) * 0.32 * sh
    cam.lookAt(state.look)
    const fov = 46 + sh * 7 - e * 3
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
    // flash and crowd
    state.flash = Math.max(0, state.flash - dt * 2.2)
    if (flashLight.current) flashLight.current.intensity = state.flash * state.flash * 2.4
    excite.current += (0.25 - excite.current) * Math.min(1, dt * 0.45)
    if (caRef.current) {
      const c = 0.0004 + sh * 0.004
      caRef.current.offset.set(c, c * 0.7)
    }
  })

  return (
    <group>
      <ambientLight ref={flashLight} intensity={0} color="#eaffd8" />
      <BallMesh ref={ballRef} position={[game.ball.x, game.ball.y, game.ball.z]} />
      {[0, 1, 2, 3].map((i) => (
        <group key={i} ref={(el) => void (wallRefs.current[i] = el)}>
          <Figure color={wClub.primary} sock={wClub.socks} />
        </group>
      ))}
      <group ref={keeperRef} rotation={[0, -Math.PI / 2, 0]} scale={1.12}>
        <group ref={keeperInner}>
          <Figure color="#d4ff3c" skin="#c9b8a4" sock="#d4ff3c" />
          <group ref={armL} position={[-0.27, 1.55, 0]}>
            <mesh position={[-0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
              <meshStandardMaterial color="#d4ff3c" roughness={0.6} />
            </mesh>
            <mesh position={[-0.7, 0, 0]}>
              <sphereGeometry args={[0.1, 10, 8]} />
              <meshStandardMaterial color="#f1f5e9" roughness={0.5} />
            </mesh>
          </group>
          <group ref={armR} position={[0.27, 1.55, 0]}>
            <mesh position={[0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
              <meshStandardMaterial color="#d4ff3c" roughness={0.6} />
            </mesh>
            <mesh position={[0.7, 0, 0]}>
              <sphereGeometry args={[0.1, 10, 8]} />
              <meshStandardMaterial color="#f1f5e9" roughness={0.5} />
            </mesh>
          </group>
        </group>
      </group>
      <points ref={preview} geometry={prevGeo} frustumCulled={false}>
        <pointsMaterial
          color={new THREE.Color(2.4, 3.2, 0.5)}
          size={0.24}
          sizeAttenuation
          transparent
          opacity={0.95}
          toneMapped={false}
          depthWrite={false}
        />
      </points>
      <points ref={burst} geometry={burstGeo} frustumCulled={false}>
        <pointsMaterial
          size={0.2}
          sizeAttenuation
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  )
}

export default function KickScene({
  active,
  game,
  kickerClub = 'real-madrid',
  wallClub = 'barcelona',
}: {
  active: boolean
  game: KickGame
  kickerClub?: ClubId
  wallClub?: ClubId
}) {
  const q = useMemo(() => pickQuality(), [])
  const excite = useRef(0.25)
  const ca = useRef<ChromaticAberrationEffect | null>(null)
  return (
    <Canvas
      dpr={DPR}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 46, near: 0.1, far: 700, position: [20, 1.9, -4] }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      role="img"
      aria-label="3D free-kick range: a football on the turf in front of a wall of four defenders and a goalkeeper"
    >
      <color attach="background" args={['#050b08']} />
      <fogExp2 attach="fog" args={['#07130d', 0.0032]} />
      <Stadium q={q} excite={excite} />
      <KickWorld game={game} excite={excite} caRef={ca} kickerClub={kickerClub} wallClub={wallClub} />
      <Effects ca={ca} bloom={0.8} />
    </Canvas>
  )
}
