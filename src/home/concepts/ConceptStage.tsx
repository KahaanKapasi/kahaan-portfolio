import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { DPR } from '../../shared/webgl'
import { CONCEPTS } from '../data'
import { ART_H, ART_W, artFontsReady, paintConcept } from './art'

const CARD_W = 1.9
const CARD_H = (CARD_W * ART_H) / ART_W
const GAP = 0.3
const TOTAL = CONCEPTS.length * CARD_W + (CONCEPTS.length - 1) * GAP

const VERT = /* glsl */ `
  uniform float uBend;
  uniform float uHover;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float y = uv.y * 2.0 - 1.0;
    float bow = 1.0 - y * y;
    p.z += uBend * bow * 0.95 + uHover * 0.14;
    p.x *= 1.0 - abs(uBend) * 0.05 * bow;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHover;
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    vec2 q = abs(vUv - 0.5) * uSize - (uSize * 0.5 - 0.09);
    float d = length(max(q, 0.0)) - 0.09;
    float a = 1.0 - smoothstep(-0.012, 0.008, d);
    vec3 col = t.rgb * (0.82 + 0.18 * uHover);
    gl_FragColor = vec4(col, a);
  }
`

type CardProps = {
  index: number
  tex: THREE.Texture
  bend: { current: number }
  hovered: { current: number }
  onOpen: (href: string) => void
}

function Card({ index, tex, bend, hovered, onOpen }: CardProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(
    () => ({
      uMap: { value: tex },
      uBend: { value: 0 },
      uHover: { value: 0 },
      uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
    }),
    [tex],
  )
  const x = -TOTAL / 2 + CARD_W / 2 + index * (CARD_W + GAP)

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const target = hovered.current === index ? 1 : 0
    uniforms.uHover.value += (target - uniforms.uHover.value) * 0.14
    uniforms.uBend.value = bend.current
    const t = state.clock.elapsedTime
    m.position.y = Math.sin(t * 0.6 + index * 1.7) * 0.05
    m.rotation.y = (state.pointer.x * 0.12 + (hovered.current === index ? state.pointer.x * 0.1 : 0)) * 0.6
    m.rotation.x = -state.pointer.y * 0.05
  })

  return (
    <mesh
      ref={mesh}
      position={[x, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        hovered.current = index
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        if (hovered.current === index) hovered.current = -1
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onOpen(CONCEPTS[index].href)
      }}
    >
      <planeGeometry args={[CARD_W, CARD_H, 1, 28]} />
      <shaderMaterial uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} transparent />
    </mesh>
  )
}

function Strip({ textures, onOpen }: { textures: THREE.Texture[]; onOpen: (href: string) => void }) {
  const group = useRef<THREE.Group>(null)
  const viewport = useThree((s) => s.viewport)
  const gl = useThree((s) => s.gl)
  const bend = useRef(0)
  const hovered = useRef(-1)
  const last = useRef({ y: typeof window !== 'undefined' ? window.scrollY : 0, t: performance.now() })

  const scale = Math.min(1, (viewport.height * 0.88) / CARD_H)
  const overflow = Math.max(0, TOTAL * scale - viewport.width * 0.92)

  useFrame(() => {
    const g = group.current
    if (!g) return
    // one effect: scroll velocity bends the cards along their height
    const now = performance.now()
    const dy = window.scrollY - last.current.y
    const dt = Math.max(8, now - last.current.t)
    last.current = { y: window.scrollY, t: now }
    const v = Math.max(-1, Math.min(1, (dy / dt) * 0.42))
    bend.current += (v - bend.current) * 0.1

    // the strip drifts sideways as the section scrolls through the viewport
    const r = gl.domElement.getBoundingClientRect()
    const vh = window.innerHeight
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
    const targetX = overflow / 2 - p * overflow
    g.position.x += (targetX - g.position.x) * 0.1
  })

  return (
    <group ref={group} scale={scale}>
      {textures.map((tex, i) => (
        <Card key={CONCEPTS[i].key} index={i} tex={tex} bend={bend} hovered={hovered} onOpen={onOpen} />
      ))}
    </group>
  )
}

export default function ConceptStage({ active }: { active: boolean }) {
  const navigate = useNavigate()
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null)

  useEffect(() => {
    let dead = false
    const made: THREE.Texture[] = []
    artFontsReady().then(() => {
      if (dead) return
      for (const c of CONCEPTS) {
        const cv = document.createElement('canvas')
        cv.width = ART_W
        cv.height = ART_H
        const ctx = cv.getContext('2d')
        if (!ctx) continue
        paintConcept(ctx, c.key)
        const tex = new THREE.CanvasTexture(cv)
        tex.anisotropy = 4
        tex.needsUpdate = true
        made.push(tex)
      }
      setTextures(made)
    })
    return () => {
      dead = true
      made.forEach((t) => t.dispose())
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <Canvas
      dpr={DPR}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.4], fov: 34, near: 0.1, far: 30 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {textures ? <Strip textures={textures} onOpen={(href) => navigate(href)} /> : null}
    </Canvas>
  )
}
