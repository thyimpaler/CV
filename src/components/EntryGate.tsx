import { useEffect, useRef, useState } from "react"
import { ArgusEye, type Eye } from "@/components/ArgusEyes"

/**
 * Argus wakes.
 *
 * The page opens its eyes before it opens. A field of them blinks awake one
 * after another across the whole screen, all tracking your cursor — you are
 * watched *before* you are let in — and on entry the outer eyes close in a
 * ripple while the centre one opens wide and the curtain lifts.
 *
 * This replaces a single closed slit and the word ENTER, which was correct in
 * structure and far too quiet to be worth the cost of a gate at all. If a gate
 * is going to make someone wait, it has to be the most striking thing on the
 * site.
 *
 * Gates are a genuine trade — they cost bounce rate and they irritate anyone
 * in a hurry — so this one is built to be impossible to get stuck behind:
 *
 *  - Shown once per session, not per page view, so returning from a project
 *    page does not re-gate.
 *  - Skipped entirely for deep links: a shared /work/<slug> URL goes straight
 *    to the content.
 *  - Skipped under prefers-reduced-motion.
 *  - Dismissable by click, Enter, Space or Escape; a real labelled <button>,
 *    focused once it exists.
 *  - Scroll lock released both on entry and on unmount.
 *
 * Positions are hand-placed in a 100x100 space and scaled to the viewport, so
 * the constellation composes at any aspect ratio rather than clustering.
 */

// x/y are percentages of the viewport; r is in px at the reference width.
const FIELD: (Eye & { open: number })[] = [
  { x: 50, y: 46, r: 74, delay: 1.15, open: 0 }, // the one that holds the centre
  { x: 21, y: 24, r: 26, delay: 0.05, open: 1 },
  { x: 78, y: 21, r: 30, delay: 0.18, open: 1 },
  { x: 12, y: 58, r: 22, delay: 0.32, open: 1 },
  { x: 88, y: 54, r: 24, delay: 0.26, open: 1 },
  { x: 33, y: 74, r: 20, delay: 0.5, open: 1 },
  { x: 67, y: 78, r: 23, delay: 0.42, open: 1 },
  { x: 50, y: 14, r: 18, delay: 0.6, open: 1 },
  { x: 6, y: 38, r: 15, delay: 0.72, open: 1 },
  { x: 94, y: 34, r: 16, delay: 0.66, open: 1 },
  { x: 27, y: 44, r: 17, delay: 0.84, open: 1 },
  { x: 73, y: 42, r: 18, delay: 0.78, open: 1 },
  { x: 41, y: 90, r: 14, delay: 0.95, open: 1 },
  { x: 59, y: 8, r: 13, delay: 0.9, open: 1 },
  { x: 16, y: 84, r: 12, delay: 1.02, open: 1 },
  { x: 85, y: 88, r: 13, delay: 0.98, open: 1 },
]

export function EntryGate() {
  const btn = useRef<HTMLButtonElement>(null)
  const [state, setState] = useState<"hidden" | "waking" | "opening">("hidden")

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const seen = sessionStorage.getItem("argus-entered") === "1"
    const deepLink = window.location.pathname !== "/"
    if (reduce || seen || deepLink) return

    setState("waking")
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [])

  // Focus has to wait for the button to exist. Running this in the mount
  // effect left focus on <body>, which is the exact trap a gate must avoid.
  useEffect(() => {
    if (state === "waking") btn.current?.focus()
  }, [state])

  const enter = () => {
    if (state !== "waking") return
    setState("opening")
    sessionStorage.setItem("argus-entered", "1")
    document.documentElement.style.overflow = ""
    window.setTimeout(() => setState("hidden"), 1400)
  }

  useEffect(() => {
    if (state !== "waking") return
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", " ", "Escape", "Spacebar"].includes(e.key)) {
        e.preventDefault()
        enter()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  if (state === "hidden") return null

  const opening = state === "opening"

  return (
    <div
      className="fixed inset-0 z-[400] overflow-hidden bg-[var(--background)]"
      style={{
        opacity: opening ? 0 : 1,
        transition: "opacity 0.6s var(--ease-core) 0.7s",
        pointerEvents: opening ? "none" : "auto",
      }}
    >
      <div className="grain-bg" aria-hidden />

      {/* The field. Each eye is its own tiny SVG placed in viewport
          percentages, so the constellation spreads at any aspect ratio
          instead of being letterboxed inside one square viewBox. */}
      {FIELD.map((eye, i) => {
        const isCentre = i === 0
        // On entry the outer eyes shut in a ripple outward from the centre
        // while the centre one opens.
        const shown = isCentre ? opening : !opening
        return (
          <div
            key={`${eye.x}-${eye.y}`}
            className="pointer-events-none absolute"
            style={{
              left: `${eye.x}%`,
              top: `${eye.y}%`,
              translate: "-50% -50%",
              width: `${eye.r * 2}px`,
              height: `${eye.r * 2}px`,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
              <ArgusEye
                eye={{
                  x: 50,
                  y: 50,
                  r: 42,
                  delay: opening ? (isCentre ? 0.1 : i * 0.02) : eye.delay,
                }}
                open={shown}
              />
            </svg>
          </div>
        )
      })}

      <button
        ref={btn}
        onClick={enter}
        aria-label="Enter the site"
        className="group absolute bottom-[clamp(48px,10vh,110px)] left-1/2 -translate-x-1/2 outline-none"
      >
        <span
          className="font-mono-ui block text-[11px] uppercase tracking-[0.32em] text-[var(--ink-mute)] transition-colors duration-500 group-hover:text-[var(--ink-strong)] group-focus-visible:text-[var(--ink-strong)]"
          style={{
            opacity: opening ? 0 : 1,
            // Arrives after the field has finished waking.
            animation: opening ? undefined : "fade-rise 0.8s var(--ease-core) 1.5s both",
            transition: "opacity 0.3s var(--ease-core)",
          }}
        >
          Enter
        </span>
      </button>
    </div>
  )
}
