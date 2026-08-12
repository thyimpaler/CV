import { useEffect, useRef, useState } from "react"

/**
 * Interaction hooks that make the page respond to the reader.
 *
 * The distinction that matters: ambient motion (drifting orbs, pulsing dots)
 * runs whether or not anyone is there, and reads as decoration. Reactive
 * motion only happens because of something the reader did, which is what
 * makes a page feel alive rather than busy.
 *
 * All of these no-op under prefers-reduced-motion.
 */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Element drifts toward the cursor while it is nearby, and springs back on
 * leave. Applied to a single primary action, it makes that action feel
 * physical; applied to everything it becomes noise.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32, radius = 90) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let frame = 0
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)

      // Only pull once the cursor is within the element plus a margin.
      const reach = Math.max(rect.width, rect.height) / 2 + radius
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (dist < reach) {
          const falloff = 1 - dist / reach
          el.style.translate = `${dx * strength * falloff}px ${dy * strength * falloff}px`
        } else {
          el.style.translate = "0px 0px"
        }
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.translate = "0px 0px"
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
    }
  }, [strength, radius])

  return ref
}

/**
 * Scroll velocity, smoothed and clamped.
 *
 * Feeding this into the marquee makes the band surge when the reader flicks
 * the page and settle when they stop — the page acknowledges the scroll
 * instead of ignoring it.
 */
export function useScrollVelocity(max = 3) {
  const [velocity, setVelocity] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let lastY = window.scrollY
    let current = 0
    let frame = 0
    let running = false

    const tick = () => {
      const y = window.scrollY
      const delta = y - lastY
      lastY = y
      // Ease toward the new delta, then decay toward rest.
      current += (delta - current) * 0.18
      current *= 0.92
      const clamped = Math.max(-max, Math.min(max, current / 12))

      if (Math.abs(clamped) < 0.008) {
        // Settled — park at exactly rest and stop the loop entirely rather
        // than burning a frame callback for the life of the page.
        current = 0
        setVelocity(0)
        running = false
        return
      }

      setVelocity(clamped)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      lastY = window.scrollY
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener("scroll", start, { passive: true })
    return () => {
      window.removeEventListener("scroll", start)
      cancelAnimationFrame(frame)
    }
  }, [max])

  return velocity
}

/**
 * Normalised pointer position (-0.5 … 0.5 on each axis), smoothed.
 * Used for slow parallax on large background type.
 */
export function usePointerOffset() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (prefersReducedMotion()) return

    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }
    let frame = 0
    let running = false

    const tick = () => {
      current = {
        x: current.x + (target.x - current.x) * 0.055,
        y: current.y + (target.y - current.y) * 0.055,
      }
      setOffset({ x: current.x, y: current.y })

      // Stop once the eased value has effectively caught up to the pointer.
      // Without this the loop would run every frame forever, re-rendering
      // the hero on each one even with the cursor parked.
      if (
        Math.abs(target.x - current.x) < 0.0006 &&
        Math.abs(target.y - current.y) < 0.0006
      ) {
        running = false
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      target = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      }
      if (!running) {
        running = true
        frame = requestAnimationFrame(tick)
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return offset
}
