import { useCallback, useRef } from "react"
import { useScrollWriter } from "@/lib/scrollStore"

/**
 * Fixed atmosphere layer: film grain, and a descent.
 *
 * Sections at uniform brightness read as a list; a page that darkens as you go
 * reads as going *down* into something, so arriving at Argus at the bottom
 * feels like the end of a descent rather than one more block.
 *
 * Opacity is written straight to these two elements from the shared scroll
 * tick. This component renders **once**.
 *
 * It deliberately does not read a `--scroll-depth` custom property in CSS:
 * setting that property on :root each frame invalidates computed style for the
 * whole document, which measured as a 160x increase in style recalculation.
 * Two direct style writes invalidate two elements.
 *
 * Both layers sit at z-0 with content at z-10, so text contrast is untouched
 * top to bottom. What fades is the warm cast, not the ink.
 */
export function Backdrop() {
  const warm = useRef<HTMLDivElement>(null)
  const dark = useRef<HTMLDivElement>(null)

  useScrollWriter(
    useCallback(({ depth }) => {
      if (warm.current) warm.current.style.opacity = String(1 - depth * 0.92)
      // Capped so near-black does not bottom out into flat nothing.
      if (dark.current) dark.current.style.opacity = String(depth * 0.55)
    }, []),
  )

  return (
    <>
      <div className="grain-bg" />

      <div
        ref={warm}
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(255,196,0,0.045), transparent 55%)",
          transform: "translateZ(0)",
        }}
        aria-hidden
      />

      <div
        ref={dark}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "#000", opacity: 0, transform: "translateZ(0)" }}
        aria-hidden
      />
    </>
  )
}
