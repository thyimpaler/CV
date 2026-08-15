import { useEffect, useRef, useState } from "react"

/**
 * The pointer, replaced with an iris.
 *
 * The last piece of the Argus idea: the eyes watch you, and the thing you
 * point with is itself an eye. It dilates over anything interactive, so the
 * cursor doubles as the hover affordance the page would otherwise need.
 *
 * Three things this must not get wrong:
 *
 *  1. **Never on touch.** Gated behind `hover: hover` and `pointer: fine`.
 *     A phone has no cursor to replace and would just paint a dot that
 *     lags behind taps.
 *  2. **Never leave a reader with no pointer.** `cursor: none` is applied
 *     from JS, only after this component has mounted and seen a real mouse
 *     move. If the script fails or never runs, the native cursor is
 *     untouched — the failure mode is "no custom cursor", not "no cursor".
 *  3. **Never re-render on move.** Position is written straight to the
 *     element's transform inside a rAF. Routing 60fps of pointer data
 *     through React state would re-render the whole page on every frame.
 */
export function IrisCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hot, setHot] = useState(false)
  const [down, setDown] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || reduce.matches) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y
    let frame = 0
    let running = false

    const tick = () => {
      // Slight lag: the iris eases toward the pointer rather than pinning to
      // it. Pinned exactly, a custom cursor just looks like a broken native
      // one; a little trail is what reads as deliberate.
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      const el = dot.current
      if (el) el.style.transform = `translate3d(${cx - 14}px, ${cy - 14}px, 0)`

      if (Math.abs(x - cx) < 0.1 && Math.abs(y - cy) < 0.1) {
        running = false
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!enabled) setEnabled(true)
      start()

      // Dilate over anything the reader can act on.
      const t = e.target as Element | null
      setHot(Boolean(t?.closest?.("a, button, [role=button], input, textarea, select")))
    }

    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => setEnabled(false)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      document.removeEventListener("pointerleave", onLeave)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  // Hide the native cursor only once ours is actually on screen.
  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add("iris-cursor-active")
    return () => document.documentElement.classList.remove("iris-cursor-active")
  }, [enabled])

  if (!enabled) return null

  const scale = down ? 0.82 : hot ? 1.55 : 1

  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[300] h-7 w-7"
      aria-hidden
    >
      <svg
        viewBox="0 0 28 28"
        className="h-full w-full overflow-visible"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "14px 14px",
          transition: "transform 0.34s var(--ease-core)",
        }}
      >
        {/* Iris ring */}
        <circle
          cx="14"
          cy="14"
          r="9"
          fill="none"
          stroke="var(--brand-accent)"
          strokeWidth="1.25"
          opacity={hot ? 0.95 : 0.65}
          style={{ transition: "opacity 0.34s var(--ease-core)" }}
        />
        {/* Pupil — contracts as the ring opens, the way a real iris does */}
        <circle
          cx="14"
          cy="14"
          r={hot ? 2.4 : 3.6}
          fill="var(--brand-accent)"
          style={{ transition: "r 0.34s var(--ease-core)" }}
        />
      </svg>
    </div>
  )
}
