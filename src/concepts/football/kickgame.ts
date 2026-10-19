/* Free-kick physics: gravity, quadratic drag, Magnus force from spin, bounce with
   friction and spin transfer, posts, bar, net, wall and a goalkeeper with reaction time.
   Plain TypeScript (no three.js) so the page chunk can drive it and tests can run it. */

export const R = 0.16
export const GOAL = { x: 52.5, halfW: 3.66, h: 2.44, depth: 2.3 }
export const SPOTS = [
  { x: 33.5, z: -11 },
  { x: 36.5, z: 6.5 },
  { x: 31, z: 0 },
  { x: 34.5, z: -4.5 },
  { x: 32, z: 12.5 },
]
export const ATTEMPTS = SPOTS.length

export type KickPhase = 'ready' | 'flight' | 'result'
export type KickOutcome = 'goal' | 'saved' | 'blocked' | 'post' | 'wide' | 'over'

export interface KickParams {
  yaw: number
  loft: number
  curve: number
  power: number
}

export type KickEvent =
  | { type: 'strike' }
  | { type: 'fx'; what: 'goal' | 'save' | 'block' | 'post' | 'bounce' }
  | { type: 'result'; outcome: KickOutcome; attempt: number }
  | { type: 'ready'; attempt: number }
  | { type: 'done'; score: number }

const G = 9.81
const KD = 0.012
const KM = 0.0072
const SIDE_SPIN = 46
const BACK_SPIN = -20

interface V {
  x: number
  y: number
  z: number
}

export class KickGame {
  attempt = 0
  score = 0
  phase: KickPhase = 'ready'
  params: KickParams = { yaw: 0, loft: 0.34, curve: 0, power: 0.62 }
  ball: V = { x: 0, y: R, z: 0 }
  vel: V = { x: 0, y: 0, z: 0 }
  spin: V = { x: 0, y: 0, z: 0 }
  keeper = { z: 0, y: 0.95, lean: 0 }
  wall: { x: number; z: number; jump: number }[] = []
  clock = 0
  results: KickOutcome[] = []
  /** unit vector spot -> goal centre (xz) */
  dir = { x: 1, z: 0 }
  start = { x: 0, z: 0 }
  private listeners = new Set<(e: KickEvent) => void>()
  on(fn: (e: KickEvent) => void) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private flags = { goal: false, saved: false, blocked: false, post: false, crossed: false, over: false }
  private settleAt = 0
  private dive: { tz: number; ty: number; t0: number } | null = null
  private bounced = 0

  constructor() {
    this.setSpot(0)
  }

  private emit(e: KickEvent) {
    this.listeners.forEach((fn) => fn(e))
  }

  setSpot(i: number) {
    const s = SPOTS[i % SPOTS.length]
    this.start = { x: s.x, z: s.z }
    this.ball = { x: s.x, y: R, z: s.z }
    this.vel = { x: 0, y: 0, z: 0 }
    this.spin = { x: 0, y: 0, z: 0 }
    const dx = GOAL.x - s.x
    const dz = -s.z
    const l = Math.hypot(dx, dz)
    this.dir = { x: dx / l, z: dz / l }
    const n = l < 22 ? 3 : 4
    const wx = s.x + this.dir.x * 9.15
    const wz = s.z + this.dir.z * 9.15
    this.wall = []
    for (let k = 0; k < n; k++) {
      const off = (k - (n - 1) / 2) * 0.62
      this.wall.push({ x: wx - this.dir.z * off, z: wz + this.dir.x * off, jump: 0 })
    }
    this.keeper = { z: 0, y: 0.95, lean: 0 }
    this.dive = null
    this.flags = { goal: false, saved: false, blocked: false, post: false, crossed: false, over: false }
    this.clock = 0
    this.bounced = 0
    this.phase = 'ready'
    this.suggest()
  }

  /** Pick a starting loft that clears the wall and drops into the goal. */
  private suggest() {
    const power = 0.62
    const wx = this.ball.x + this.dir.x * 9.15
    for (let loft = 0.1; loft < 0.6; loft += 0.01) {
      const { pts, cross } = this.predict({ yaw: 0, loft, curve: 0, power })
      let yw = -1
      for (let i = 0; i < pts.length; i += 3) {
        if (pts[i] >= wx) {
          yw = pts[i + 1]
          break
        }
      }
      if (yw > 2.15 && cross && cross.y < 2.1) {
        this.params = { yaw: 0, loft: Math.round(loft * 100) / 100 + 0.01, curve: 0, power }
        return
      }
    }
    this.params = { yaw: 0, loft: 0.34, curve: 0, power }
  }

  /** Start the next attempt (or restart after the last). */
  next() {
    if (this.attempt >= ATTEMPTS) {
      this.attempt = 0
      this.score = 0
      this.results = []
    }
    this.setSpot(this.attempt)
    this.emit({ type: 'ready', attempt: this.attempt })
  }

  reset() {
    this.attempt = 0
    this.score = 0
    this.results = []
    this.setSpot(0)
    this.emit({ type: 'ready', attempt: 0 })
  }

  aimDir(yaw: number) {
    const c = Math.cos(yaw)
    const s = Math.sin(yaw)
    return { x: this.dir.x * c - this.dir.z * s, z: this.dir.x * s + this.dir.z * c }
  }

  private launch(p: KickParams, d: { x: number; z: number }) {
    const v = 13 + 20 * p.power
    const vh = v * Math.cos(p.loft)
    const vel = { x: d.x * vh, y: v * Math.sin(p.loft), z: d.z * vh }
    // right = dir x up  =>  (-dz, 0, dx); backspin about right, sidespin about up
    const spin = { x: -d.z * BACK_SPIN, y: -p.curve * SIDE_SPIN, z: d.x * BACK_SPIN }
    return { vel, spin }
  }

  private integrate(b: V, v: V, w: V, dt: number) {
    const sp = Math.hypot(v.x, v.y, v.z)
    let ax = -KD * sp * v.x
    let ay = -G - KD * sp * v.y
    let az = -KD * sp * v.z
    ax += KM * (w.y * v.z - w.z * v.y)
    ay += KM * (w.z * v.x - w.x * v.z)
    az += KM * (w.x * v.y - w.y * v.x)
    v.x += ax * dt
    v.y += ay * dt
    v.z += az * dt
    b.x += v.x * dt
    b.y += v.y * dt
    b.z += v.z * dt
    const decay = Math.exp(-0.05 * dt)
    w.x *= decay
    w.y *= decay
    w.z *= decay
  }

  /** Obstacle-free path for the aim preview and the keeper's read of the shot. */
  predict(p: KickParams = this.params) {
    const d = this.aimDir(p.yaw)
    const { vel, spin } = this.launch(p, d)
    const b = { ...this.ball }
    const pts: number[] = []
    let t = 0
    let cross: { z: number; y: number; t: number } | null = null
    const dt = 1 / 120
    let step = 0
    while (t < 2.4) {
      const px = b.x
      this.integrate(b, vel, spin, dt)
      t += dt
      if (!cross && px < GOAL.x && b.x >= GOAL.x) {
        cross = { z: b.z, y: b.y, t }
      }
      if (b.y < R) break
      if (step++ % 5 === 0) pts.push(b.x, b.y, b.z)
      if (b.x > GOAL.x + 3) break
    }
    return { pts, cross }
  }

  strike(partial?: Partial<KickParams>) {
    if (this.phase !== 'ready') return false
    if (partial) this.params = { ...this.params, ...partial }
    const p = this.params
    const { vel, spin } = this.launch(p, this.aimDir(p.yaw))
    this.vel = vel
    this.spin = spin
    this.phase = 'flight'
    this.clock = 0
    this.settleAt = 4.8

    // goalkeeper: reads the shot most of the time, with some noise, and takes time to react
    const { cross } = this.predict(p)
    const react = 0.24 + Math.random() * 0.16
    if (cross && Math.abs(cross.z) < 5.4 && cross.y < 3.2) {
      if (Math.random() < 0.45) {
        const g = (Math.random() + Math.random() + Math.random() - 1.5) * 1.5
        this.dive = { tz: cross.z + g, ty: Math.min(2.1, Math.max(0.55, cross.y + g * 0.3)), t0: react }
      } else {
        const side = Math.random() < 0.5 ? -1 : 1
        this.dive = { tz: side * (1.4 + Math.random() * 2), ty: 0.7 + Math.random() * 1, t0: react }
      }
    } else {
      this.dive = { tz: (cross ? cross.z : 0) * 0.3, ty: 0.95, t0: react }
    }
    this.emit({ type: 'strike' })
    return true
  }

  private finish(outcome: KickOutcome) {
    if (this.phase === 'result') return
    this.phase = 'result'
    this.results.push(outcome)
    if (outcome === 'goal') this.score++
    this.attempt++
    this.emit({ type: 'result', outcome, attempt: this.attempt })
    if (this.attempt >= ATTEMPTS) this.emit({ type: 'done', score: this.score })
  }

  private resolveOutcome(): KickOutcome {
    const f = this.flags
    if (f.goal) return 'goal'
    if (f.saved) return 'saved'
    if (f.blocked) return 'blocked'
    if (f.post) return 'post'
    if (f.over) return 'over'
    return 'wide'
  }

  step(dtRaw: number) {
    const dt0 = Math.min(dtRaw, 0.05)
    // keeper & wall idle animation continues in every phase
    let remaining = dt0
    while (remaining > 1e-6) {
      const dt = Math.min(remaining, 1 / 240)
      remaining -= dt
      this.sub(dt)
    }
  }

  private sub(dt: number) {
    if (this.phase === 'ready') return
    this.clock += dt
    const b = this.ball
    const v = this.vel
    const w = this.spin

    // wall jumps as the ball is struck
    for (const m of this.wall) {
      const target = this.clock > 0.12 && this.clock < 0.6 ? 0.16 : 0
      m.jump += (target - m.jump) * Math.min(1, dt * 14)
    }
    // keeper
    const k = this.keeper
    if (this.dive && this.clock > this.dive.t0) {
      const dz = this.dive.tz - k.z
      const stepZ = 4.2 * dt
      k.z += Math.abs(dz) < stepZ ? dz : Math.sign(dz) * stepZ
      const dy = this.dive.ty - k.y
      const stepY = 4.2 * dt
      k.y += Math.abs(dy) < stepY ? dy : Math.sign(dy) * stepY
      k.lean += (Math.max(-1, Math.min(1, k.z / 2.5)) * 1.15 - k.lean) * Math.min(1, dt * 8)
    }

    const px = b.x
    this.integrate(b, v, w, dt)

    // ground
    if (b.y < R) {
      b.y = R
      if (v.y < -1.1) {
        const vin = -v.y
        v.y = vin * 0.64
        // contact point velocity and friction impulse (hollow sphere, I = 2/3 m R^2)
        const vcx = v.x + w.z * R
        const vcz = v.z - w.x * R
        const cap = 0.5 * (1 + 0.64) * vin
        let dvx = -0.4 * vcx
        let dvz = -0.4 * vcz
        const mag = Math.hypot(dvx, dvz)
        if (mag > cap) {
          dvx *= cap / mag
          dvz *= cap / mag
        }
        v.x += dvx
        v.z += dvz
        const f = 3 / (2 * R)
        w.x += -dvz * f
        w.z += dvx * f
        if (vin > 3 && this.bounced++ < 3) this.emit({ type: 'fx', what: 'bounce' })
      } else {
        v.y = 0
        const vcx = v.x + w.z * R
        const vcz = v.z - w.x * R
        const k2 = 1 - Math.exp(-40 * dt)
        const dvx = -0.4 * vcx * k2
        const dvz = -0.4 * vcz * k2
        v.x += dvx
        v.z += dvz
        const f = 3 / (2 * R)
        w.x += -dvz * f
        w.z += dvx * f
        const roll = Math.exp(-0.5 * dt)
        v.x *= roll
        v.z *= roll
        w.y *= Math.exp(-1.5 * dt)
      }
    }

    // wall
    for (const m of this.wall) {
      const dx = b.x - m.x
      const dz = b.z - m.z
      const d = Math.hypot(dx, dz)
      if (d < 0.3 + R && b.y < 1.8 + m.jump) {
        const nx = dx / (d || 1)
        const nz = dz / (d || 1)
        const vn = v.x * nx + v.z * nz
        if (vn < 0) {
          v.x -= 1.35 * vn * nx
          v.z -= 1.35 * vn * nz
          v.x *= 0.7
          v.z *= 0.7
          v.y = Math.abs(v.y) * 0.4 + 1
          b.x = m.x + nx * (0.3 + R + 0.01)
          b.z = m.z + nz * (0.3 + R + 0.01)
          if (!this.flags.blocked && !this.flags.goal) {
            this.flags.blocked = true
            this.emit({ type: 'fx', what: 'block' })
            this.settleAt = Math.min(this.settleAt, this.clock + 1.3)
          }
        }
      }
    }

    // posts and crossbar
    if (b.x > GOAL.x - 0.6 && b.x < GOAL.x + 0.6) {
      for (const pz of [-GOAL.halfW, GOAL.halfW]) {
        if (b.y < GOAL.h + 0.05) {
          const dx = b.x - GOAL.x
          const dz = b.z - pz
          const d = Math.hypot(dx, dz)
          if (d < 0.07 + R) {
            const nx = dx / d
            const nz = dz / d
            const vn = v.x * nx + v.z * nz
            if (vn < 0) {
              v.x -= 1.6 * vn * nx
              v.z -= 1.6 * vn * nz
              this.postHit()
            }
          }
        }
      }
      if (Math.abs(b.z) < GOAL.halfW) {
        const dx = b.x - GOAL.x
        const dy = b.y - GOAL.h
        const d = Math.hypot(dx, dy)
        if (d < 0.07 + R) {
          const nx = dx / d
          const ny = dy / d
          const vn = v.x * nx + v.y * ny
          if (vn < 0) {
            v.x -= 1.6 * vn * nx
            v.y -= 1.6 * vn * ny
            this.postHit()
          }
        }
      }
    }

    // keeper save
    if (!this.flags.saved && Math.abs(b.x - (GOAL.x - 0.45)) < 1.0) {
      const dz = b.z - k.z
      const dy = b.y - k.y
      const d = Math.hypot(dz, dy)
      if (d < 0.8 + R && v.x > 0) {
        this.flags.saved = true
        const nz = dz / (d || 1)
        v.x = -Math.abs(v.x) * 0.28
        v.z += nz * 4 + (Math.random() - 0.5) * 3
        v.y = Math.abs(v.y) * 0.3 + 1.6 + Math.random() * 1.5
        w.x = w.y = w.z = 0
        this.emit({ type: 'fx', what: 'save' })
        this.settleAt = Math.min(this.settleAt, this.clock + 1.5)
      }
    }

    // goal line
    if (!this.flags.crossed && px < GOAL.x && b.x >= GOAL.x) {
      this.flags.crossed = true
      if (Math.abs(b.z) < GOAL.halfW - 0.02 && b.y < GOAL.h - 0.02 && !this.flags.saved) {
        this.flags.goal = true
        this.emit({ type: 'fx', what: 'goal' })
        this.settleAt = this.clock + 1.6
      } else if (b.y >= GOAL.h) this.flags.over = true
    }
    // net
    if (this.flags.goal && b.x > GOAL.x) {
      const back = GOAL.x + GOAL.depth - R
      if (b.x > back) {
        b.x = back
        v.x *= -0.08
        v.y *= 0.5
        v.z *= 0.4
      }
      if (b.y > GOAL.h - R - 0.2) {
        b.y = GOAL.h - R - 0.2
        v.y *= -0.1
      }
      if (Math.abs(b.z) > GOAL.halfW - R) {
        b.z = Math.sign(b.z) * (GOAL.halfW - R)
        v.z *= -0.1
      }
      v.x *= Math.exp(-2 * dt)
    }

    if (this.phase === 'flight') {
      const rolling = b.y <= R + 0.001 && Math.hypot(v.x, v.z) < 0.4
      const out = b.x > 70 || b.x < -60 || Math.abs(b.z) > 45
      if (rolling || out || this.clock > this.settleAt) this.finish(this.resolveOutcome())
    }
  }

  private postHit() {
    if (!this.flags.post) {
      this.flags.post = true
      this.emit({ type: 'fx', what: 'post' })
    }
  }
}
