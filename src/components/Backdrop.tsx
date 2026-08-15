import { useEffect, useState } from "react"

/**
 * Fixed atmosphere layer.
 *
 * Two jobs, both deliberately quiet: film grain, and a descent.
 *
 * The descent is the point. Sections at uniform brightness read as a list; a
 * page that darkens as you go reads as going *down* into something, so
 * arriving at Argus at the bottom feels like the end of a descent rather than
 * one more block. It is one interpolated pair of overlays across the whole
 * document, not per-section backgrounds — the continuity is what makes it
 * felt rather than noticed.
 *
 * Both layers sit at z-0 with content at z-10, so nothing here touches text
 * contrast: copy is exactly as legible at the bottom as at the top. What
 * fades is the warm cast, not the ink.
 *
 * The previous version stacked glowing neon edges, three drifting colour orbs
 * and a cursor-tracking light. Each effect is fine alone; together they read
 * as decoration applied to a page rather than a page that was designed.
 */
export function Backdrop() {
  const [depth, setDepth] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const measure = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setDepth(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div className="grain-bg" />

      {/* Warm light at the top of the page, burning off as you descend. */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: 1 - depth * 0.92,
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(255,196,0,0.045), transparent 55%)",
        }}
        aria-hidden
      />

      {/* And the dark coming up to meet it. Capped at 0.55 — enough to feel
          the floor approaching, not so much that near-black bottoms out into
          flat nothing. */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: depth * 0.55, background: "#000" }}
        aria-hidden
      />
    </>
  )
}
