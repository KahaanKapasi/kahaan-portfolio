import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { DPR } from '../../shared/webgl'
import { PROJECTS, renderProject } from './render/scenes'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uMix;
uniform float uTime;
uniform float uHover;
uniform float uPulse;
uniform vec2 uMouse;
uniform vec2 uRes;
uniform vec2 uTex;
varying vec2 vUv;

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

vec2 cover(vec2 uv) {
  float r = uRes.x / uRes.y;
  float t = uTex.x / uTex.y;
  vec2 s = r > t ? vec2(1.0, t / r) : vec2(r / t, 1.0);
  return (uv - 0.5) * s + 0.5;
}

vec3 sampleSplit(sampler2D tex, vec2 uv, float k) {
  vec2 o = vec2(k, k * 0.35);
  return vec3(texture2D(tex, uv + o).r, texture2D(tex, uv).g, texture2D(tex, uv - o).b);
}

void main() {
  vec2 uv = cover(vUv);

  // hover ripple, centred on the pointer
  vec2 d = vUv - uMouse;
  d.x *= uRes.x / uRes.y;
  float dist = length(d);
  float amp = uHover + uPulse;
  float ring = sin(dist * 42.0 - uTime * 3.4) * exp(-dist * 4.2);
  float ripple = ring * amp;
  vec2 dir = d / (dist + 1e-4);
  vec2 off = dir * ripple * 0.011;

  // transition: vertical slices that lift away, with a colour split at the seam
  float slices = 12.0;
  float id = floor(vUv.x * slices);
  float delay = hash(id) * 0.42;
  float t = clamp((uMix - delay) / 0.58, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  float seam = sin(t * 3.14159265);
  float split = seam * 0.018 + abs(ripple) * 0.006;

  vec2 uvA = uv + off + vec2(0.0, t * 0.07);
  vec2 uvB = uv + off - vec2(0.0, (1.0 - t) * 0.07);
  vec3 a = sampleSplit(uA, uvA, split);
  vec3 b = sampleSplit(uB, uvB, split);
  vec3 col = mix(a, b, smoothstep(0.3, 0.7, t));

  // light catch along the ripple crest
  col += vec3(1.0, 0.93, 0.78) * max(ring, 0.0) * amp * 0.05;
  // slice edge hairlines while moving
  float edge = smoothstep(0.0, 0.004, abs(fract(vUv.x * slices) - 0.5) - 0.497);
  col = mix(col, col * 0.82, seam * edge * 0.5);

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`

type Props = { active: boolean; index: number; texSize: [number, number] }

/** Rendered source canvases are shared between scenes, so the hero and the scroll reel paint each project once. */
const sources = new Map<string, HTMLCanvasElement>()
function source(i: number, w: number, h: number) {
  const key = `${i}:${w}x${h}`
  let c = sources.get(key)
  if (!c) {
    c = document.createElement('canvas')
    renderProject(i, c, w, h)
    sources.set(key, c)
  }
  return c
}

function Plane({ index, texSize }: { index: number; texSize: [number, number] }) {
  const { viewport, size, gl } = useThree()
  const texs = useRef<(THREE.CanvasTexture | null)[]>(PROJECTS.map(() => null))
  const hoverTarget = useRef(0)
  const state = useRef({ cur: 0, target: 0, t: 1, running: false, hover: 0, pulse: 0, mouse: new THREE.Vector2(0.5, 0.5), mtarget: new THREE.Vector2(0.5, 0.5) })

  const ensure = (i: number) => {
    if (texs.current[i]) return texs.current[i]!
    const t = new THREE.CanvasTexture(source(i, texSize[0], texSize[1]))
    t.colorSpace = THREE.SRGBColorSpace
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    t.generateMipmaps = false
    t.needsUpdate = true
    texs.current[i] = t
    return t
  }

  const material = useMemo(() => {
    const first = ensure(0)
    return new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uA: { value: first },
        uB: { value: first },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uPulse: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTex: { value: new THREE.Vector2(texSize[0], texSize[1]) },
      },
      toneMapped: false,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // warm the remaining textures one at a time while idle
  useEffect(() => {
    let i = 1
    let id = 0
    const step = () => {
      if (i >= PROJECTS.length) return
      ensure(i++)
      id = window.setTimeout(step, 350)
    }
    id = window.setTimeout(step, 900)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const s = state.current
    if (index === s.target) return
    const u = material.uniforms
    // if mid-transition, snap to the destination so the next one starts clean
    if (s.running) u.uA.value = ensure(s.target)
    else u.uA.value = ensure(s.cur)
    u.uB.value = ensure(index)
    s.cur = s.running ? s.target : s.cur
    s.target = index
    s.t = 0
    s.running = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'pan-y'
    return () => {
      texs.current.forEach((t) => t?.dispose())
      material.dispose()
    }
  }, [gl, material])

  useFrame((_, dt) => {
    const s = state.current
    const u = material.uniforms
    const d = Math.min(dt, 0.05)
    u.uTime.value += d
    if (s.running) {
      s.t += d / 1.25
      if (s.t >= 1) {
        s.t = 1
        s.running = false
        s.cur = s.target
        u.uA.value = ensure(s.cur)
        u.uB.value = ensure(s.cur)
        u.uMix.value = 0
      } else {
        u.uMix.value = s.t
      }
    }
    s.mouse.lerp(s.mtarget, 1 - Math.exp(-d * 9))
    u.uMouse.value.copy(s.mouse)
    s.hover += (hoverTarget.current - s.hover) * (1 - Math.exp(-d * 6))
    u.uHover.value = s.hover
    u.uPulse.value = s.pulse = Math.max(0, s.pulse - d * 0.9)
    u.uRes.value.set(size.width, size.height)
  })

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) state.current.mtarget.set(e.uv.x, e.uv.y)
  }

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerEnter={(e) => {
        hoverTarget.current = 1
        if (e.uv) {
          state.current.mtarget.set(e.uv.x, e.uv.y)
          state.current.mouse.set(e.uv.x, e.uv.y)
        }
      }}
      onPointerLeave={() => {
        hoverTarget.current = 0
      }}
      onPointerMove={onMove}
      onPointerDown={(e) => {
        if (e.uv) state.current.mtarget.set(e.uv.x, e.uv.y)
        state.current.pulse = 1
      }}
    >
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

export default function ProjectScene({ active, index, texSize }: Props) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5], zoom: 1, near: 0.1, far: 20 }}
      dpr={DPR}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: false, powerPreference: 'default' }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Plane index={index} texSize={texSize} />
    </Canvas>
  )
}
