import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DPR } from '../../shared/webgl'
import { accentHex, onAccentChange } from '../../shared/accent'
import { LOCKUP_STACKED, LOCKUP_WIDE, type Lockup } from './glyphs'

/** Pointer in stage-normalised coordinates (-1..1), and whether it is over the hero. */
export type Ptr = { x: number; y: number; on: boolean }
/** Smoothed scroll speed, 0..1, written by the hero. */
export type Scroll = { v: number }

const UP = new THREE.Color('#f3f6ec')
/** The visitor's accent. Read from --k-accent and refreshed live by `Lights` when the picker changes it. */
const PEAK = new THREE.Color(typeof document === 'undefined' ? '#e8a317' : accentHex())
const FLOOR_LOW = new THREE.Color('#2b3036')
const TMPC = new THREE.Color()

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

type Shared = { pointer: MutableRefObject<Ptr>; scroll: MutableRefObject<Scroll>; live: boolean }
type RigState = MutableRefObject<{ s: number; y: number }>

/**
 * The name, as a bar sculpture that behaves like an equaliser. Each bar has an energy:
 * a ticker pulse travelling through the word, the cursor nearby, and scroll speed.
 * Energy lifts the bar from its baseline and tints it with the accent at the peak.
 */
function Word({ lockup, pointer, scroll, live, rig, onLive }: Shared & { lockup: Lockup; rig: RigState; onLive?: () => void }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const t0 = useRef<number | null>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const viewport = useThree((s) => s.viewport)
  const invalidate = useThree((s) => s.invalidate)
  const count = lockup.bars.length
  const rest = useMemo(
    () =>
      lockup.bars.map((b, i) => ({
        ...b,
        seed: (i * 2.399) % (Math.PI * 2),
        stem: Math.abs(b.rz) < 0.001 && b.h > b.w * 2.2,
        flat: Math.abs(b.rz) < 0.001 && b.w >= b.h * 2.2,
      })),
    [lockup],
  )

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < count; i++) {
      const b = rest[i]
      dummy.position.set(b.x, b.y - 1.6, b.z)
      dummy.rotation.set(0, 0, b.rz)
      dummy.scale.set(0, 0, 0) // hidden until the first live frame; the static name stands in
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      m.setColorAt(i, UP)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    invalidate()
  }, [dummy, rest, count, invalidate])

  useFrame((state) => {
    const m = mesh.current
    if (!m || !live) return
    if (t0.current === null) {
      t0.current = state.clock.elapsedTime
      onLive?.()
    }
    const t = state.clock.elapsedTime
    const { s, y: gy } = rig.current
    const p = pointer.current
    const sv = scroll.current.v
    // pointer in the lockup's local space
    const lx = (p.x * viewport.width) / 2 / s
    const ly = ((p.y * viewport.height) / 2 - gy) / s
    const assemble = Math.min(1, (t - t0.current) / 1.1)
    const eased = 1 - Math.pow(1 - assemble, 3)

    for (let i = 0; i < count; i++) {
      const b = rest[i]
      const dx = b.x - lx
      const dy = b.y - ly
      const near = p.on ? 1 - smooth(0.0, 1.15, Math.sqrt(dx * dx + dy * dy)) : 0
      const tick = Math.pow(0.5 + 0.5 * Math.sin(t * 1.45 - b.x * 1.35), 7) * 0.5
      const scrolled = sv * (0.55 + 0.45 * Math.sin(t * 9 + b.x * 3.1 + b.seed))
      const e = Math.min(1, near + tick + scrolled)

      const fromY = b.y - 1.6 - (i % 6) * 0.05
      const baseY = fromY + (b.y - fromY) * eased

      let sy = 1
      let y = baseY
      let z = b.z
      if (b.stem) {
        sy = 1 + e * 0.2
        y = baseY + (b.h * (sy - 1)) / 2 // grow from the baseline
      } else if (b.flat) {
        y = baseY + e * 0.07
      } else {
        z = b.z + e * 0.22
      }
      dummy.position.set(b.x, y, z + near * 0.18)
      dummy.rotation.set(near * 0.12, near * 0.3, b.rz)
      dummy.scale.set(b.w, b.h * sy, b.d)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      TMPC.copy(UP).lerp(PEAK, smooth(0.28, 0.75, e))
      m.setColorAt(i, TMPC)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial metalness={0.12} roughness={0.5} color="#f7f9f2" emissive="#363a31" />
    </instancedMesh>
  )
}

/** The equaliser floor: thin bars across the stage, driven by the same three inputs. */
function Spectrum({ n, pointer, scroll, live }: Shared & { n: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const viewport = useThree((s) => s.viewport)
  const invalidate = useThree((s) => s.invalidate)
  const seeds = useMemo(() => Array.from({ length: n }, (_, i) => ({ a: (i * 1.618) % 1, b: (i * 0.377) % 1 })), [n])

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < n; i++) m.setColorAt(i, FLOOR_LOW)
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    invalidate()
  }, [n, invalidate])

  useFrame((state) => {
    const m = mesh.current
    if (!m || !live) return
    const t = state.clock.elapsedTime
    const vw = viewport.width
    const vh = viewport.height
    const p = pointer.current
    const sv = scroll.current.v
    const px = (p.x * vw) / 2
    const pitch = (vw * 0.94) / n
    const baseY = -vh / 2 + vh * 0.05
    const maxH = vh * 0.2
    for (let i = 0; i < n; i++) {
      const sd = seeds[i]
      const x = (i - (n - 1) / 2) * pitch
      const idle = 0.1 + 0.07 * (0.5 + 0.5 * Math.sin(t * (0.9 + sd.a) + sd.b * 9))
      const tick = Math.pow(0.5 + 0.5 * Math.sin(t * 1.45 - x * 0.5), 7) * 0.45
      const near = p.on ? Math.exp(-Math.pow((x - px) / (vw * 0.07), 2)) * (0.45 + 0.4 * Math.abs(Math.sin(t * 6 + sd.b * 20))) : 0
      const scrolled = sv * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 8 + sd.a * 12)))
      const e = Math.min(1, idle + tick + near + scrolled)
      const h = Math.max(0.03, e * maxH)
      dummy.position.set(x, baseY + h / 2, -0.4)
      dummy.scale.set(pitch * 0.46, h, 0.08)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      TMPC.copy(FLOOR_LOW).lerp(PEAK, smooth(0.5, 0.95, e))
      m.setColorAt(i, TMPC)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, n]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function Rig({ lockup, pointer, scroll, live, spectrumN, onLive }: Shared & { lockup: Lockup; spectrumN: number; onLive?: () => void }) {
  const g = useRef<THREE.Group>(null)
  const rig: RigState = useRef({ s: 1, y: 0 })
  const viewport = useThree((s) => s.viewport)
  // Fit the lockup into the part of the stage above the equaliser floor.
  const sFit = Math.min((viewport.width * 0.86) / lockup.width, (viewport.height * 0.6) / lockup.height)
  const gy = viewport.height * 0.08 - lockup.cy * sFit
  rig.current.s = sFit
  rig.current.y = gy

  useFrame((state) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    const idle = live ? Math.sin(t * 0.28) * 0.05 : 0
    const tx = pointer.current.x * 0.3 + idle
    const ty = -pointer.current.y * 0.14
    g.current.rotation.y += (tx - g.current.rotation.y) * 0.07
    g.current.rotation.x += (ty - g.current.rotation.x) * 0.07
  })

  return (
    <>
      <group ref={g} scale={sFit} position={[0, gy, 0]}>
        <Word lockup={lockup} pointer={pointer} scroll={scroll} live={live} rig={rig} onLive={onLive} />
      </group>
      <Spectrum n={spectrumN} pointer={pointer} scroll={scroll} live={live} />
    </>
  )
}

function Lights({ pointer }: { pointer: MutableRefObject<Ptr> }) {
  const lamp = useRef<THREE.PointLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  const invalidate = useThree((s) => s.invalidate)
  // Follow the accent picker: recolour the peak tint and the rim light, and draw a frame if the loop is idle.
  useEffect(() => {
    const sync = () => {
      const hex = accentHex()
      PEAK.set(hex)
      rim.current?.color.set(hex)
      invalidate()
    }
    sync()
    return onAccentChange(sync)
  }, [invalidate])
  useFrame(() => {
    if (!lamp.current) return
    lamp.current.position.x += (pointer.current.x * 4.2 - lamp.current.position.x) * 0.08
    lamp.current.position.y += (pointer.current.y * 2.2 + 1.4 - lamp.current.position.y) * 0.08
  })
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4.2, 6, 5]} intensity={2.1} color="#f4f6ef" />
      <directionalLight ref={rim} position={[-5, 1.4, -2]} intensity={0.55} color={PEAK} />
      <pointLight ref={lamp} position={[0, 1.4, 4]} intensity={1.1} color="#ffffff" distance={14} />
    </>
  )
}

export default function NameScene({
  active,
  pointer,
  scroll,
  compact,
  onLive,
}: {
  active: boolean
  pointer: MutableRefObject<Ptr>
  scroll: MutableRefObject<Scroll>
  /** Phone layout: stacked name, fewer floor bars, lower DPR. */
  compact: boolean
  onLive?: () => void
}) {
  const lockup = compact ? LOCKUP_STACKED : LOCKUP_WIDE
  return (
    <Canvas
      dpr={compact ? [1, 1.25] : DPR}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.2, 8.6], fov: 26, near: 0.1, far: 40 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
        invalidate()
      }}
    >
      <Lights pointer={pointer} />
      <Rig lockup={lockup} pointer={pointer} scroll={scroll} live={active} spectrumN={compact ? 26 : 56} onLive={onLive} />
    </Canvas>
  )
}
