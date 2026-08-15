import { useEffect } from "react"

/**
 * One pointer loop for the whole page, published as CSS custom properties.
 *
 * Every eye used to call usePointerOffset independently: six components, six
 * rAF loops, and six React state streams all firing on the same pointer move.
 * Each one re-rendered its subtree ~60 times a second while the mouse moved.
 *
 * This publishes `--px` / `--py` (normalised -0.5…0.5) on the root element
 * from a single loop. Consumers read them in CSS transforms, so pointer
 * movement causes zero React renders — the compositor moves the elements and
 * React never hears about it.
 *
 * Mount once, near the root.
 */
export function usePointerVars() {
  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.setProperty("--px", "0")
      root.style.setProperty("--py", "0")
      return
    }

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let frame = 0
    let running = false

    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      root.style.setProperty("--px", cx.toFixed(4))
      root.style.setProperty("--py", cy.toFixed(4))

      // Park once the eased value has caught up, rather than burning a frame
      // callback for the life of the page.
      if (Math.abs(tx - cx) < 0.0008 && Math.abs(ty - cy) < 0.0008) {
        running = false
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
      if (!running) {
        running = true
        frame = requestAnimationFrame(tick)
      }
    }

    root.style.setProperty("--px", "0")
    root.style.setProperty("--py", "0")
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
}
