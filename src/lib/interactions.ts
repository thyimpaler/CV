import { useEffect, useRef } from "react"

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

    // Give the element its own compositing layer up front. Without this the
    // browser re-rasterises it (and anything blended beneath it) on every
    // frame of movement, which shows up as smearing/ghost trails on some
    // GPUs. translate3d rather than the `translate` property for the same
    // reason — and because `translate` collides with Tailwind's
    // hover:-translate-y utility, where transform composes with it.
    el.style.willChange = "transform"
    el.style.backfaceVisibility = "hidden"

    // Cached: reading the rect inside the pointermove handler forced a layout
    // on every event, up to 120/sec on a high-poll-rate mouse.
    let rect = el.getBoundingClientRect()
    const refreshRect = () => {
      rect = el.getBoundingClientRect()
    }
    window.addEventListener("resize", refreshRect, { passive: true })
    window.addEventListener("scroll", refreshRect, { passive: true })

    let frame = 0
    const onMove = (e: PointerEvent) => {
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
          const x = dx * strength * falloff
          const y = dy * strength * falloff
          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
        } else {
          el.style.transform = "translate3d(0,0,0)"
        }
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.transform = "translate3d(0,0,0)"
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("resize", refreshRect)
      window.removeEventListener("scroll", refreshRect)
    }
  }, [strength, radius])

  return ref
}

