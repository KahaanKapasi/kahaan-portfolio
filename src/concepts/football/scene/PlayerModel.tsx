import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CLUBS, type ClubId, type Player } from '../data'

export function makeJerseyTexture(clubId: ClubId, player: Player, side: 'front' | 'back'): THREE.CanvasTexture {
  const W = 512
  const H = 512
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const g = canvas.getContext('2d')!
  const club = CLUBS[clubId]

  // Base background in club primary colour
  g.fillStyle = club.primary
  g.fillRect(0, 0, W, H)

  // Pattern overlays
  if (clubId === 'barcelona') {
    // Vertical Blaugrana stripes
    g.fillStyle = '#004d98'
    g.fillRect(0, 0, W, H)
    g.fillStyle = '#a50044'
    const barW = W / 6
    g.fillRect(barW * 1, 0, barW, H)
    g.fillRect(barW * 3, 0, barW, H)
    g.fillRect(barW * 5, 0, barW, H)
  } else if (clubId === 'psg') {
    // Red band with white pin margins
    g.fillStyle = '#ffffff'
    g.fillRect(W * 0.38, 0, W * 0.24, H)
    g.fillStyle = '#da291c'
    g.fillRect(W * 0.41, 0, W * 0.18, H)
  } else if (clubId === 'arsenal') {
    // Highbury red body with subtle vertical jacquard
    g.fillStyle = 'rgba(255,255,255,0.06)'
    for (let x = 0; x < W; x += 32) {
      g.fillRect(x, 0, 16, H)
    }
  } else if (clubId === 'real-madrid') {
    // Subtle houndstooth / herringbone fabric texture
    g.fillStyle = 'rgba(212,175,55,0.12)'
    g.fillRect(0, 0, W, 24)
    g.fillRect(0, H - 24, W, 24)
  } else if (clubId === 'man-city') {
    // Sky blue with subtle tonal circles
    g.strokeStyle = 'rgba(255,255,255,0.1)'
    g.lineWidth = 3
    g.beginPath()
    g.arc(W / 2, H / 2, 120, 0, Math.PI * 2)
    g.stroke()
  } else if (clubId === 'bayern') {
    // Subtle Bavarian diamond pattern
    g.strokeStyle = 'rgba(255,255,255,0.08)'
    g.lineWidth = 2
    for (let y = -H; y < H * 2; y += 48) {
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(W, y + W * 0.6)
      g.moveTo(W, y)
      g.lineTo(0, y + W * 0.6)
      g.stroke()
    }
  }

  const textColor = club.textDark ? '#111827' : '#f8f9fa'
  const strokeColor = club.textDark ? '#ffffff' : '#050c08'

  if (side === 'back') {
    // Player Name across upper back
    g.save()
    g.font = '900 48px "Anybody Variable", "Arial Black", sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = textColor
    g.shadowColor = strokeColor
    g.shadowBlur = 6
    g.lineWidth = 4
    g.strokeStyle = strokeColor
    g.strokeText(player.displayName, W / 2, 110)
    g.fillText(player.displayName, W / 2, 110)
    g.restore()

    // Squad Number large at centre
    g.save()
    g.font = '900 170px "Anybody Variable", "Arial Black", sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.lineWidth = 10
    g.strokeStyle = strokeColor
    g.strokeText(String(player.n), W / 2, 290)
    g.fillStyle = textColor
    g.fillText(String(player.n), W / 2, 290)
    g.restore()
  } else {
    // Front side: Crest badge on upper left chest (viewer right in UV)
    g.save()
    g.translate(W * 0.72, 120)
    g.fillStyle = club.secondary
    g.beginPath()
    g.arc(0, 0, 38, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = club.primary
    g.beginPath()
    g.arc(0, 0, 32, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = club.accent
    g.font = '900 24px "Anybody Variable", sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(club.short, 0, 2)
    g.restore()

    // Small squad number on right chest
    g.save()
    g.font = '800 38px "Anybody Variable", sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = textColor
    g.fillText(String(player.n), W * 0.28, 120)
    g.restore()

    // Subtle sponsor / Footonomy chest wordmark
    g.save()
    g.font = '800 28px "Anybody Variable", sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.letterSpacing = '0.2em'
    g.fillStyle = textColor
    g.globalAlpha = 0.8
    g.fillText('FOOTONOMY', W / 2, 280)
    g.restore()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function PlayerModel({ clubId, player }: { clubId: ClubId; player: Player }) {
  const club = CLUBS[clubId]
  const groupRef = useRef<THREE.Group>(null)
  const armLRef = useRef<THREE.Group>(null)
  const armRRef = useRef<THREE.Group>(null)

  // Generate dynamic canvas textures for front & back of jersey
  const frontTex = useMemo(() => makeJerseyTexture(clubId, player, 'front'), [clubId, player])
  const backTex = useMemo(() => makeJerseyTexture(clubId, player, 'back'), [clubId, player])

  useEffect(() => {
    return () => {
      frontTex.dispose()
      backTex.dispose()
    }
  }, [frontTex, backTex])

  // Subtle breathing & stance sway animation
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.015
    }
    if (armLRef.current) {
      armLRef.current.rotation.z = 0.12 + Math.sin(t * 1.8) * 0.03
    }
    if (armRRef.current) {
      armRRef.current.rotation.z = -0.12 - Math.sin(t * 1.8) * 0.03
    }
  })

  const skinColor = '#d2a786'
  const hairColor = '#1f2421'
  const bootColor = '#111827'
  const bootTrim = club.accent

  // Kit sleeve color (Arsenal has white sleeves on red body)
  const sleeveColor = clubId === 'arsenal' ? '#ffffff' : club.primary

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ----------------- HEAD & NECK ----------------- */}
      <group position={[0, 1.86, 0]}>
        {/* Head */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.13, 0.12, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Hair / athletic crop */}
        <mesh position={[0, 0.06, -0.02]} scale={[1.04, 1.02, 1.04]}>
          <sphereGeometry args={[0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Athletic headband in club accent */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.134, 0.134, 0.024, 20]} />
          <meshStandardMaterial color={club.accent} roughness={0.5} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, -0.13, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* ----------------- TORSO & JERSEY ----------------- */}
      <group position={[0, 1.36, 0]}>
        {/* Main upper jersey torso */}
        {/* Front half of shirt */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.44, 0.62, 0.14]} />
          <meshStandardMaterial map={frontTex} roughness={0.65} metalness={0.05} />
        </mesh>
        {/* Back half of shirt */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.44, 0.62, 0.14]} />
          <meshStandardMaterial map={backTex} roughness={0.65} metalness={0.05} />
        </mesh>
        {/* Collar trim */}
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.11, 0.13, 0.03, 16]} />
          <meshStandardMaterial color={club.secondary} roughness={0.6} />
        </mesh>
      </group>

      {/* ----------------- ARMS & SHOULDERS ----------------- */}
      {/* Left Arm (Viewer's left) */}
      <group ref={armLRef} position={[-0.27, 1.62, 0]}>
        {/* Shoulder sleeve in kit sleeve color */}
        <mesh position={[-0.04, -0.08, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.075, 0.14, 6, 12]} />
          <meshStandardMaterial color={sleeveColor} roughness={0.65} />
        </mesh>
        {/* Sleeve cuff trim */}
        <mesh position={[-0.065, -0.17, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.077, 0.077, 0.02, 12]} />
          <meshStandardMaterial color={club.secondary} roughness={0.6} />
        </mesh>
        {/* Forearm (Skin tone) */}
        <mesh position={[-0.09, -0.32, 0]} rotation={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.055, 0.05, 0.26, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Wrist tape / sweatband */}
        <mesh position={[-0.105, -0.44, 0]}>
          <cylinderGeometry args={[0.054, 0.054, 0.03, 10]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.11, -0.5, 0]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm (Viewer's right) */}
      <group ref={armRRef} position={[0.27, 1.62, 0]}>
        {/* Shoulder sleeve in kit sleeve color */}
        <mesh position={[0.04, -0.08, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.075, 0.14, 6, 12]} />
          <meshStandardMaterial color={sleeveColor} roughness={0.65} />
        </mesh>
        {/* Sleeve cuff trim */}
        <mesh position={[0.065, -0.17, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.077, 0.077, 0.02, 12]} />
          <meshStandardMaterial color={club.secondary} roughness={0.6} />
        </mesh>
        {/* Forearm (Skin tone) */}
        <mesh position={[0.09, -0.32, 0]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.055, 0.05, 0.26, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.11, -0.5, 0]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* ----------------- SHORTS ----------------- */}
      <group position={[0, 0.95, 0]}>
        {/* Waistband */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
          <meshStandardMaterial color={club.shorts} roughness={0.7} />
        </mesh>
        {/* Left shorts leg */}
        <mesh position={[-0.11, -0.08, 0]}>
          <cylinderGeometry args={[0.125, 0.13, 0.24, 14]} />
          <meshStandardMaterial color={club.shorts} roughness={0.7} />
        </mesh>
        {/* Right shorts leg */}
        <mesh position={[0.11, -0.08, 0]}>
          <cylinderGeometry args={[0.125, 0.13, 0.24, 14]} />
          <meshStandardMaterial color={club.shorts} roughness={0.7} />
        </mesh>
        {/* Club accent stripe down side of shorts */}
        <mesh position={[-0.23, -0.08, 0]}>
          <boxGeometry args={[0.015, 0.24, 0.06]} />
          <meshStandardMaterial color={club.accent} roughness={0.5} />
        </mesh>
        <mesh position={[0.23, -0.08, 0]}>
          <boxGeometry args={[0.015, 0.24, 0.06]} />
          <meshStandardMaterial color={club.accent} roughness={0.5} />
        </mesh>
      </group>

      {/* ----------------- LEGS & BOOTS ----------------- */}
      {/* Left Leg */}
      <group position={[-0.11, 0, 0]}>
        {/* Thigh (Skin tone) */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.09, 0.078, 0.24, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, 0.58, 0.01]}>
          <sphereGeometry args={[0.076, 12, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Knee-high Sock (Club sock color) */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.078, 0.068, 0.44, 14]} />
          <meshStandardMaterial color={club.socks} roughness={0.8} />
        </mesh>
        {/* Sock top cuff stripe */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.081, 0.081, 0.04, 14]} />
          <meshStandardMaterial color={club.secondary} roughness={0.6} />
        </mesh>
        {/* Boot */}
        <group position={[0, 0.05, 0.04]}>
          {/* Boot foot */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.11, 0.09, 0.25]} />
            <meshStandardMaterial color={bootColor} roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Boot toe curve */}
          <mesh position={[0, -0.01, 0.15]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial color={bootTrim} roughness={0.4} />
          </mesh>
          {/* Sole plate */}
          <mesh position={[0, -0.045, 0.04]}>
            <boxGeometry args={[0.112, 0.012, 0.26]} />
            <meshStandardMaterial color={bootTrim} roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[0.11, 0, 0]}>
        {/* Thigh (Skin tone) */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.09, 0.078, 0.24, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, 0.58, 0.01]}>
          <sphereGeometry args={[0.076, 12, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Knee-high Sock (Club sock color) */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.078, 0.068, 0.44, 14]} />
          <meshStandardMaterial color={club.socks} roughness={0.8} />
        </mesh>
        {/* Sock top cuff stripe */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.081, 0.081, 0.04, 14]} />
          <meshStandardMaterial color={club.secondary} roughness={0.6} />
        </mesh>
        {/* Boot */}
        <group position={[0, 0.05, 0.04]}>
          {/* Boot foot */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.11, 0.09, 0.25]} />
            <meshStandardMaterial color={bootColor} roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Boot toe curve */}
          <mesh position={[0, -0.01, 0.15]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial color={bootTrim} roughness={0.4} />
          </mesh>
          {/* Sole plate */}
          <mesh position={[0, -0.045, 0.04]}>
            <boxGeometry args={[0.112, 0.012, 0.26]} />
            <meshStandardMaterial color={bootTrim} roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
