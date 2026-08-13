import { useEffect, useState } from "react"

/**
 * Scroll progress as a boulder climbing a slope.
 *
 * This replaces two things: a generic 1px progress bar, and a rotating
 * circular badge lifted straight from the reference site. Neither belonged
 * here — the bar said nothing and the badge was someone else's idea.
 *
 * The slope rises left to right and the boulder rides the travelled portion,
 * so scrolling the page *is* the push uphill. It pays off at the very bottom,
 * where the Sisyphus coda finally shows what the marker has been doing the
 * whole way down. Drawn as SVG so the incline can't clip the viewport edge
 * the way a rotated element would.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      setProgress(p)
      frame = 0
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // viewBox units: the slope climbs from y=13 on the left to y=4 on the right.
  const x = progress * 1000
  const y = 13 - progress * 9
  // The boulder grows very slightly on the way up — it gets heavier.
  const r = 3 + progress * 1.6

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-4"
      aria-hidden
    >
      <svg
        viewBox="0 0 1000 16"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/* The road ahead, and the ground already covered. */}
        <line x1="0" y1="13" x2="1000" y2="4" stroke="var(--line-soft)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="13" x2={x} y2={y} stroke="var(--brand-blood)" strokeWidth="1" opacity="0.75" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* The boulder is drawn in a second, non-stretched SVG so it stays
          circular — preserveAspectRatio="none" above would squash it. */}
      <svg viewBox="0 0 1000 16" className="absolute inset-0 h-full w-full overflow-visible">
        <circle
          cx={`${progress * 100}%`}
          cy={y}
          r={r}
          className="fill-[var(--brand-blood)]"
          style={{ transition: "r 0.4s var(--ease-core)" }}
        />
      </svg>
    </div>
  )
}
