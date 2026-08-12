import { useCallback, useEffect, useRef, useState } from "react"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>#*"

/**
 * Monospace text that resolves out of scrambled glyphs on hover.
 *
 * Works because the labels are already set in a mono face at a fixed
 * tracking — every substituted glyph occupies the same width, so nothing
 * reflows while it decodes. Attempting this in a proportional face makes
 * the label jitter and the surrounding layout shift.
 */
export function ScrambleText({
  text,
  className = "",
  speed = 34,
}: {
  text: string
  className?: string
  speed?: number
}) {
  const [display, setDisplay] = useState(text)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = undefined
    setDisplay(text)
  }, [text])

  const scramble = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (timer.current) clearInterval(timer.current)

    // Each character locks in after its own threshold, so the word resolves
    // left to right rather than all at once.
    let tick = 0
    timer.current = setInterval(() => {
      tick++
      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (tick > i + 3) return char
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join("")
      setDisplay(next)
      if (tick > text.length + 3) {
        clearInterval(timer.current)
        timer.current = undefined
        setDisplay(text)
      }
    }, speed)
  }, [text, speed])

  useEffect(() => {
    setDisplay(text)
    // Capture the ref object (not `.current`) so cleanup still clears
    // whichever interval is live at unmount, without reading a stale value.
    const ref = timer
    return () => {
      if (ref.current) clearInterval(ref.current)
    }
  }, [text])

  return (
    <span
      className={className}
      onPointerEnter={scramble}
      onPointerLeave={stop}
      onFocus={scramble}
      onBlur={stop}
    >
      {/* Screen readers get the stable label; the scramble is decorative. */}
      <span aria-hidden>{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
