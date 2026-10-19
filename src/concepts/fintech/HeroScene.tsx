import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DPR } from '../../shared/webgl'
import { PORTS, ROUTES, height, sampleRoute } from './terrain'

const SCALE = 1.7
const RISE = 0.4

const TERRAIN_VERT = /* glsl */ `
varying float vH;
varying vec3 vWorld;
varying float vDepth;
void main() {
  vH = position.y / ${RISE.toFixed(2)};
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vec4 mv = viewMatrix * w;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`

const TERRAIN_FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3 uPointer;
varying float vH;
varying vec3 vWorld;
varying float vDepth;
void main() {
  float lv = vH * 15.0 - uTime * 0.12;
  float w = max(fwidth(lv), 1e-4);
  float d = abs(fract(lv - 0.5) - 0.5) / w;
  float line = 1.0 - clamp(d - 0.2, 0.0, 1.0);
  float lm = vH * 3.0 - uTime * 0.024;
  float wm = max(fwidth(lm), 1e-4);
  float dm = abs(fract(lm - 0.5) - 0.5) / wm;
  float major = 1.0 - clamp(dm * 0.6 - 0.2, 0.0, 1.0);

  vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  float lit = clamp(dot(n, normalize(vec3(-0.5, 0.8, 0.35))) * 0.5 + 0.5, 0.0, 1.0);

  vec3 deep = vec3(0.03, 0.07, 0.42);
  vec3 mid = vec3(0.09, 0.20, 0.86);
  vec3 high = vec3(0.45, 0.58, 1.0);
  float hh = smoothstep(-0.9, 1.4, vH);
  vec3 base = mix(deep, mid, smoothstep(0.0, 0.5, hh));
  base = mix(base, high, smoothstep(0.5, 1.0, hh));
  base *= 0.6 + 0.6 * lit;

  vec2 dp = vWorld.xz - uPointer.xz;
  float glow = exp(-dot(dp, dp) * 1.3);
  vec3 lineCol = vec3(0.82, 0.87, 1.0);
  vec3 col = base + lineCol * (line * (0.15 + 0.24 * glow) + major * (0.32 + 0.3 * glow));
  col += vec3(1.0, 0.42, 0.17) * glow * 0.06;

  float fog = smoothstep(3.2, 8.0, vDepth);
  gl_FragColor = vec4(col, 1.0 - fog);
}
`

const FLOW_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aT;
attribute float aSeed;
attribute float aSpeed;
varying float vI;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float head = fract(uTime * aSpeed + aSeed);
  float ph = fract(head - aT);
  float I = exp(-ph * 7.0);
  vI = I;
  gl_PointSize = (2.4 + 12.0 * I) * uPx * (3.6 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const FLOW_FRAG = /* glsl */ `
precision highp float;
varying float vI;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  vec3 col = mix(vec3(1.0, 0.42, 0.17), vec3(1.0, 0.94, 0.82), smoothstep(0.45, 1.0, vI));
  gl_FragColor = vec4(col, a * (0.22 + 0.78 * vI));
}
`

const PORT_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSeed;
varying float vPulse;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vPulse = 0.5 + 0.5 * sin(uTime * 1.6 + aSeed * 6.28);
  gl_PointSize = (26.0 + 8.0 * vPulse) * uPx * (3.6 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const PORT_FRAG = /* glsl */ `
precision highp float;
varying float vPulse;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float ring = smoothstep(0.5, 0.45, d) - smoothstep(0.37, 0.32, d);
  float core = smoothstep(0.1, 0.06, d);
  float a = ring * (0.55 + 0.4 * vPulse) + core;
  gl_FragColor = vec4(vec3(1.0), a);
}
`

const toWorld = (x: number, y: number, lift = 0): [number, number, number] => [x * SCALE, height(x, y) * RISE + lift, y * SCALE]

function Terrain({ segments }: { segments: number }) {
  const geo = useMemo(() => {
    const n = segments
    const span = 2.3
    const pos = new Float32Array((n + 1) * (n + 1) * 3)
    const idx: number[] = []
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= n; i++) {
        const x = (i / n) * 2 * span - span
        const y = (j / n) * 2 * span - span
        const o = (j * (n + 1) + i) * 3
        const [X, Y, Z] = toWorld(x, y)
        pos[o] = X
        pos[o + 1] = Y
        pos[o + 2] = Z
      }
    }
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const a = j * (n + 1) + i
        idx.push(a, a + n + 1, a + 1, a + 1, a + n + 1, a + n + 2)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setIndex(idx)
    return g
  }, [segments])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: TERRAIN_VERT,
        fragmentShader: TERRAIN_FRAG,
        transparent: true,
        toneMapped: false,
        uniforms: { uTime: { value: 0 }, uPointer: { value: new THREE.Vector3() } },
      }),
    [],
  )
  const flow = useMemo(() => {
    const per = 90
    const total = ROUTES.length * (per + 1)
    const pos = new Float32Array(total * 3)
    const t = new Float32Array(total)
    const seed = new Float32Array(total)
    const speed = new Float32Array(total)
    let k = 0
    ROUTES.forEach(([a, b, bend], r) => {
      const pts = sampleRoute(PORTS[a], PORTS[b], bend, per)
      pts.forEach((p) => {
        const w = toWorld(p.x, p.y, p.lift)
        pos.set(w, k * 3)
        t[k] = p.t
        seed[k] = (r * 0.31) % 1
        speed[k] = 0.075 + (r % 3) * 0.02
        k++
      })
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aT', new THREE.BufferAttribute(t, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
    const m = new THREE.ShaderMaterial({
      vertexShader: FLOW_VERT,
      fragmentShader: FLOW_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
    })
    return { g, m }
  }, [])
  const ports = useMemo(() => {
    const pos = new Float32Array(PORTS.length * 3)
    const seed = new Float32Array(PORTS.length)
    PORTS.forEach((p, i) => {
      pos.set(toWorld(p.x, p.y, 0.035), i * 3)
      seed[i] = i / PORTS.length
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    const m = new THREE.ShaderMaterial({
      vertexShader: PORT_VERT,
      fragmentShader: PORT_FRAG,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
    })
    return { g, m }
  }, [])

  const group = useRef<THREE.Group>(null)
  const { gl, camera, size } = useThree()
  const cur = useRef({ x: 0, y: 0 })

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const px = state.pointer.x
    const py = state.pointer.y
    cur.current.x += (px - cur.current.x) * (1 - Math.exp(-dt * 3))
    cur.current.y += (py - cur.current.y) * (1 - Math.exp(-dt * 3))
    const aspect = size.width / size.height
    const back = Math.max(0, 1.25 - aspect) * 2.6
    camera.position.set(cur.current.x * 0.35, 1.7 + cur.current.y * 0.18 + back * 0.25, 3.5 + back)
    camera.lookAt(0, 0, 0.3)
    if (group.current) group.current.rotation.y = Math.sin(t * 0.1) * 0.14 + cur.current.x * 0.09
    mat.uniforms.uTime.value = t
    mat.uniforms.uPointer.value.set(cur.current.x * 2.2, 0, 0.5 - cur.current.y * 1.4)
    const px2 = gl.getPixelRatio()
    flow.m.uniforms.uTime.value = t
    flow.m.uniforms.uPx.value = px2
    ports.m.uniforms.uTime.value = t
    ports.m.uniforms.uPx.value = px2
  })

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <mesh geometry={geo} material={mat} frustumCulled={false} />
      <points geometry={flow.g} material={flow.m} frustumCulled={false} />
      <points geometry={ports.g} material={ports.m} frustumCulled={false} />
    </group>
  )
}

export default function HeroScene({ active }: { active: boolean }) {
  const segments = typeof window !== 'undefined' && window.innerWidth < 760 ? 84 : 124
  return (
    <Canvas
      camera={{ fov: 40, near: 0.1, far: 30, position: [0, 1.7, 3.5] }}
      dpr={DPR}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Terrain segments={segments} />
    </Canvas>
  )
}
