import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  HL,
  HW,
  ROOF_Y,
  buildBowl,
  makeBoardTexture,
  makeLampTexture,
  makeLoop,
  makeNetTexture,
  makePitchTexture,
  sampleLoop,
  strip,
} from './world'
import { FORMATIONS, OPPOSITION } from '../data'

export interface Quality {
  spacing: number
  flashes: number
  mobile: boolean
}

export function pickQuality(): Quality {
  const mobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 760 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches))
  return mobile ? { spacing: 1.5, flashes: 90, mobile } : { spacing: 0.78, flashes: 220, mobile }
}

function mulberry(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LOOP = makeLoop(HL, HW, 9, 9)

interface StadiumProps {
  q: Quality
  excite: MutableRefObject<number>
  players?: boolean
}

export default function Stadium({ q, excite, players = false }: StadiumProps) {
  const uni = useMemo(() => ({ uTime: { value: 0 }, uExcite: { value: 0.3 } }), [])
  useFrame((s) => {
    uni.uTime.value = s.clock.elapsedTime
    uni.uExcite.value = excite.current
  })
  return (
    <group>
      <hemisphereLight args={['#bcd9c6', '#0a1a10', 0.5]} />
      <Pitch />
      <Apron />
      <Bowl q={q} uni={uni} />
      <Boards />
      <Towers />
      <Skyline />
      <Goal side={1} />
      <Goal side={-1} />
      {players && <Players />}
    </group>
  )
}

/* ------------------------------------------------------------------ */

function Pitch() {
  const tex = useMemo(() => makePitchTexture(), [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
      <planeGeometry args={[105, 68]} />
      <meshStandardMaterial map={tex} roughness={0.92} metalness={0} />
    </mesh>
  )
}

function Apron() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[520, 420]} />
      <meshStandardMaterial color="#0b140f" roughness={1} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */

function Bowl({ q, uni }: { q: Quality; uni: { uTime: { value: number }; uExcite: { value: number } } }) {
  const bowl = useMemo(() => buildBowl(LOOP), [])
  const roof = useMemo(() => {
    const top = strip(LOOP, 17, ROOF_Y, 36, ROOF_Y, 10)
    const fascia = strip(LOOP, 36, ROOF_Y, 36, ROOF_Y + 1.6, 10)
    const rim = strip(LOOP, 36.05, ROOF_Y + 0.7, 36.05, ROOF_Y + 1.1, 10)
    return { top, fascia, rim }
  }, [])
  return (
    <group>
      <mesh geometry={bowl.geometry}>
        <meshStandardMaterial vertexColors roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={roof.top}>
        <meshStandardMaterial color="#1b2420" roughness={0.6} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={roof.fascia}>
        <meshStandardMaterial color="#222c27" roughness={0.5} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={roof.rim}>
        <meshBasicMaterial color={new THREE.Color(3.4, 4.2, 0.8)} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Crowd rows={bowl.rows} q={q} uni={uni} />
      <Flashes rows={bowl.rows} q={q} />
    </group>
  )
}

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function seatColour(x: number, z: number, row: number, upper: boolean, idx: number, r: () => number, out: THREE.Color) {
  const roll = hash(Math.floor(idx / 5) + row * 131) * 0.78 + r() * 0.22
  // Real Madrid (White, Gold, Charcoal)
  const K = ['#ffffff', '#f4f6ee', '#d4af37', '#ffffff', '#1a2332']
  // FC Barcelona (Blaugrana: Garnet, Deep Blue, Gold)
  const V = ['#a50044', '#004d98', '#edbb00', '#a50044', '#003366']
  const N = ['#3a4540', '#59655f', '#7b867f', '#3a4540', '#232b27', '#59655f', '#8c978f']
  if (x < -14) {
    // end behind the left goal: Real Madrid white and gold mosaic
    if (upper) {
      const band = Math.floor((x + z) * 0.55 + row * 1.2)
      out.set(band % 2 === 0 ? '#ffffff' : '#d4af37')
      if (roll > 0.96) out.set('#111827')
    } else out.set(K[Math.floor(roll * K.length)])
  } else if (x > 14) {
    // end behind right goal: FC Barcelona blaugrana mosaic
    out.set(V[Math.floor(roll * V.length)])
  } else {
    out.set(N[Math.floor(roll * N.length)])
  }
}

function Crowd({
  rows,
  q,
  uni,
}: {
  rows: { d: number; y: number; upper: boolean }[]
  q: Quality
  uni: { uTime: { value: number }; uExcite: { value: number } }
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(() => {
    const r = mulberry(21)
    const items: { x: number; y: number; z: number; rot: number; s: number; row: number; upper: boolean; idx: number }[] = []
    rows.forEach((row, ri) => {
      const pts = sampleLoop(LOOP, row.d, q.spacing)
      pts.forEach((p, idx) => {
        if (r() > 0.94) return
        items.push({
          x: p.x,
          y: row.y + 0.5,
          z: p.z,
          rot: Math.atan2(-p.nx, -p.nz),
          s: 0.9 + r() * 0.25,
          row: ri,
          upper: row.upper,
          idx,
        })
      })
    })
    return items
  }, [rows, q.spacing])

  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const r = mulberry(5)
    const dummy = new THREE.Object3D()
    const c = new THREE.Color()
    data.forEach((it, i) => {
      dummy.position.set(it.x, it.y, it.z)
      dummy.rotation.set(0, it.rot, 0)
      dummy.scale.setScalar(it.s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      seatColour(it.x, it.z, it.row, it.upper, it.idx, r, c)
      c.multiplyScalar((it.upper ? 0.5 : 0.78) * (0.8 + r() * 0.35))
      m.setColorAt(i, c)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    m.computeBoundingSphere()
  }, [data])

  const mat = useMemo(() => {
    const mt = new THREE.MeshLambertMaterial({ color: '#ffffff' })
    mt.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uni.uTime
      shader.uniforms.uExcite = uni.uExcite
      shader.vertexShader = shader.vertexShader
        .replace('void main() {', 'uniform float uTime;\nuniform float uExcite;\nvoid main() {')
        .replace(
          '#include <begin_vertex>',
          `vec3 transformed = vec3( position );
#ifdef USE_INSTANCING
  float ph = instanceMatrix[3].x * 0.83 + instanceMatrix[3].z * 1.17;
  float jump = max(0.0, sin(uTime * (2.4 + uExcite * 3.2) + ph)) * (0.04 + uExcite * 0.42);
  transformed.y += jump;
#endif`,
        )
    }
    return mt
  }, [uni])

  const geo = useMemo(() => new THREE.BoxGeometry(0.36, 0.64, 0.3), [])
  return <instancedMesh key={data.length} ref={ref} args={[geo, mat, data.length]} frustumCulled={false} />
}

function Flashes({ rows, q }: { rows: { d: number; y: number; upper: boolean }[]; q: Quality }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geo = useMemo(() => {
    const r = mulberry(99)
    const upper = rows.filter((x) => x.upper)
    const pos: number[] = []
    const ph: number[] = []
    const rate: number[] = []
    for (let i = 0; i < q.flashes; i++) {
      const row = upper[Math.floor(r() * upper.length)]
      const pts = sampleLoop(LOOP, row.d, 6)
      const p = pts[Math.floor(r() * pts.length)]
      pos.push(p.x, row.y + 1.1, p.z)
      ph.push(r() * 100)
      rate.push(0.5 + r() * 1.6)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aPhase', new THREE.Float32BufferAttribute(ph, 1))
    g.setAttribute('aRate', new THREE.Float32BufferAttribute(rate, 1))
    return g
  }, [rows, q.flashes])
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime
  })
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        uniforms={{ uTime: { value: 0 }, uScale: { value: 620 } }}
        vertexShader={`attribute float aPhase; attribute float aRate; uniform float uTime; uniform float uScale; varying float vA;
void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
float s = sin(uTime * aRate + aPhase); vA = pow(max(s,0.0), 56.0);
gl_PointSize = min(30.0, (1.5 + 14.0 * vA) * uScale / max(1.0, -mv.z)); }`}
        fragmentShader={`varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA; if (a < 0.01) discard; gl_FragColor = vec4(vec3(1.0,0.97,0.9) * 2.4, a); }`}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */

function Boards() {
  const tex = useMemo(() => makeBoardTexture(), [])
  const geo = useMemo(() => {
    const loop = makeLoop(HL, HW, 6, 8)
    return strip(loop, 2.4, 0.04, 2.4, 1.0, 38)
  }, [])
  useFrame((_, dt) => {
    tex.offset.x -= dt * 0.012
  })
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial map={tex} color={new THREE.Color(1.5, 1.5, 1.5)} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */

const MASTS: [number, number][] = [
  [-94, -72],
  [94, -72],
  [94, 72],
  [-94, 72],
]

function Towers() {
  const lamp = useMemo(() => makeLampTexture(), [])
  const beamGeo = useMemo(() => {
    const L = 135
    const g = new THREE.ConeGeometry(24, L, 28, 1, true)
    g.translate(0, -L / 2, 0)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])
  const items = useMemo(
    () =>
      MASTS.map(([x, z]) => {
        const o = new THREE.Object3D()
        o.position.set(x, 52, z)
        o.lookAt(0, 0, 0)
        return { x, z, q: o.quaternion.clone() }
      }),
    [],
  )
  return (
    <group>
      {items.map((m, i) => (
        <group key={i}>
          <mesh position={[m.x, 26, m.z]}>
            <cylinderGeometry args={[0.9, 1.5, 52, 10]} />
            <meshStandardMaterial color="#2a3430" roughness={0.6} metalness={0.7} />
          </mesh>
          <group position={[m.x, 52, m.z]} quaternion={m.q}>
            <mesh>
              <boxGeometry args={[16, 8, 1.4]} />
              <meshStandardMaterial color="#1d2522" roughness={0.5} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.75]}>
              <planeGeometry args={[15, 7.2]} />
              <meshBasicMaterial map={lamp} color={new THREE.Color(3, 3, 2.7)} toneMapped={false} />
            </mesh>
            <mesh geometry={beamGeo} position={[0, 0, 0.8]}>
              <shaderMaterial
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                toneMapped={false}
                vertexShader={`varying float vH; varying vec3 vN; varying vec3 vV;
void main(){ vH = clamp(position.z / 135.0, 0.0, 1.0); vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`}
                fragmentShader={`varying float vH; varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 1.6); float a = f * pow(1.0 - vH, 1.7) * 0.085; gl_FragColor = vec4(vec3(0.82, 1.0, 0.86) * 1.2, a); }`}
              />
            </mesh>
          </group>
          <spotLight
            position={[m.x, 52, m.z]}
            angle={0.62}
            penumbra={0.8}
            intensity={2.1}
            decay={0}
            color="#f2fff0"
          />
        </group>
      ))}
    </group>
  )
}

function Skyline() {
  const geo = useMemo(() => {
    const r = mulberry(404)
    const pos: number[] = []
    const col: number[] = []
    const c = new THREE.Color()
    for (let i = 0; i < 420; i++) {
      const a = r() * Math.PI * 2
      const rad = 190 + r() * 150
      pos.push(Math.cos(a) * rad, 1 + r() * 38, Math.sin(a) * rad * 0.8)
      const k = r()
      if (k > 0.92) c.set('#ff4a3a')
      else if (k > 0.5) c.set('#ffe2a8')
      else c.set('#bcd6ff')
      c.multiplyScalar(1.4)
      col.push(c.r, c.g, c.b)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    return g
  }, [])
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial size={2.2} sizeAttenuation={false} vertexColors transparent opacity={0.9} toneMapped={false} depthWrite={false} />
    </points>
  )
}

/* ------------------------------------------------------------------ */

function shapeGeo(pts: [number, number][]) {
  const s = new THREE.Shape()
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
  s.closePath()
  return new THREE.ShapeGeometry(s)
}

export function Goal({ side }: { side: 1 | -1 }) {
  const net = useMemo(() => makeNetTexture(), [])
  const geos = useMemo(() => {
    const D = 2.3
    const back = shapeGeo([[-3.66, 0], [3.66, 0], [3.66, 2.0], [-3.66, 2.0]])
    const top = shapeGeo([[-3.66, 0], [3.66, 0], [3.66, 2.44 - 0.0], [-3.66, 2.44]])
    const sideG = shapeGeo([[0, 0], [D, 0], [D, 2.0], [0, 2.44]])
    return { back, top, sideG, D }
  }, [])
  const D = geos.D
  const mat = (
    <meshBasicMaterial map={net} transparent alphaTest={0.08} side={THREE.DoubleSide} depthWrite={false} opacity={0.85} />
  )
  const post = (z: number) => (
    <mesh position={[0, 1.22, z]}>
      <cylinderGeometry args={[0.07, 0.07, 2.44, 10]} />
      <meshStandardMaterial color="#f4f6ee" roughness={0.35} metalness={0.2} />
    </mesh>
  )
  return (
    <group position={[side * HL, 0, 0]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
      {post(-3.66)}
      {post(3.66)}
      <mesh position={[0, 2.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 7.4, 10]} />
        <meshStandardMaterial color="#f4f6ee" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* back net: vertical plane at depth D (rotate shape from xy plane to zy plane) */}
      <mesh geometry={geos.back} position={[D, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {mat}
      </mesh>
      {/* roof net: slopes from bar down to the back */}
      <mesh geometry={geos.top} position={[0, 2.44, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, D / 2.44, 1]}>
        {mat}
      </mesh>
      <mesh geometry={geos.sideG} position={[0, 0, -3.66]}>
        {mat}
      </mesh>
      <mesh geometry={geos.sideG} position={[0, 0, 3.66]}>
        {mat}
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */

function Players() {
  const bodies = useRef<THREE.InstancedMesh>(null)
  const heads = useRef<THREE.InstancedMesh>(null)
  const base = useMemo(() => {
    const k = FORMATIONS['4-3-3'].pts.map(([x, y]) => ({ x: x - HL, z: y - HW, club: 0, ry: -Math.PI / 2 }))
    const v = OPPOSITION.map(([x, y]) => ({ x: x - HL, z: y - HW, club: 1, ry: Math.PI / 2 }))
    return [...k, ...v]
  }, [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useLayoutEffect(() => {
    const c = new THREE.Color()
    base.forEach((b, i) => {
      c.set(b.club ? '#a50044' : '#f8f9fa')
      if (i === 0 || i === 11) c.set('#d4ff3c')
      bodies.current?.setColorAt(i, c)
    })
    if (bodies.current?.instanceColor) bodies.current.instanceColor.needsUpdate = true
  }, [base])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    base.forEach((b, i) => {
      const sx = Math.sin(t * 0.55 + i * 1.7) * 0.9
      const sz = Math.cos(t * 0.47 + i * 2.3) * 0.7
      dummy.position.set(b.x + sx, 0.95, b.z + sz)
      dummy.rotation.set(0, b.ry + Math.sin(t * 0.3 + i) * 0.4, Math.sin(t * 3 + i) * 0.03)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      bodies.current?.setMatrixAt(i, dummy.matrix)
      dummy.position.y = 1.78
      dummy.updateMatrix()
      heads.current?.setMatrixAt(i, dummy.matrix)
    })
    if (bodies.current) bodies.current.instanceMatrix.needsUpdate = true
    if (heads.current) heads.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group>
      <instancedMesh ref={bodies} args={[undefined, undefined, base.length]} frustumCulled={false}>
        <capsuleGeometry args={[0.3, 1.0, 4, 8]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, base.length]} frustumCulled={false}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color="#c9b8a4" roughness={0.8} />
      </instancedMesh>
    </group>
  )
}

