import { useEffect, useRef, useState } from "react"

/**
 * The page opens its eye before it opens.
 *
 * A closed lid, a line, and one word. Clicking opens the eye, the iris pulls
 * focus, and the curtain lifts to reveal the site. It is the first beat of the
 * Argus idea: the watchman wakes because you arrived.
 *
 * Gates are a real trade. They cost bounce rate and they annoy anyone in a
 * hurry, so this one is built to be cheap to pass and impossible to get stuck
 * behind:
 *
 *  - Shown once per session (sessionStorage), not once per page view. Coming
 *    back from a project page does not re-gate you.
 *  - Skipped entirely for deep links. Landing on /work/<slug> from a shared
 *    URL goes straight to the content.
 *  - Skipped under prefers-reduced-motion.
 *  - Dismissable by click, Enter, Escape or Space — and it is a real <button>,
 *    focused on mount, so keyboard and screen-reader users get a labelled
 *    control rather than a mystery div.
 *  - Scroll is locked only while it is up, and always released on unmount.
 *    A gate that leaves the body locked is far worse than no gate.
 */
export function EntryGate() {
  const btn = useRef<HTMLButtonElement>(null)
  const [state, setState] = useState<"hidden" | "closed" | "opening">("hidden")

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const seen = sessionStorage.getItem("argus-entered") === "1"
    const deepLink = window.location.pathname !== "/"
    if (reduce || seen || deepLink) return

    setState("closed")
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [])

  const enter = () => {
    if (state !== "closed") return
    setState("opening")
    sessionStorage.setItem("argus-entered", "1")
    document.documentElement.style.overflow = ""
    // Long enough for the lid to finish opening before the curtain clears.
    window.setTimeout(() => setState("hidden"), 1500)
  }

  // Focus has to wait for the button to exist. Doing it in the mount effect
  // ran while state was still "hidden", so there was nothing to focus and
  // the gate silently left focus on <body> — the exact trap it is meant to
  // avoid for keyboard users.
  useEffect(() => {
    if (state === "closed") btn.current?.focus()
  }, [state])

  useEffect(() => {
    if (state !== "closed") return
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
      className="fixed inset-0 z-[400] flex items-center justify-center bg-[var(--background)]"
      style={{
        opacity: opening ? 0 : 1,
        transition: "opacity 0.7s var(--ease-core) 0.75s",
        pointerEvents: opening ? "none" : "auto",
      }}
    >
      <div className="grain-bg" aria-hidden />

      <button
        ref={btn}
        onClick={enter}
        aria-label="Enter the site"
        className="group relative flex flex-col items-center outline-none"
      >
        <svg viewBox="0 0 240 240" className="w-[min(62vw,340px)] overflow-visible" aria-hidden>
          <defs>
            <clipPath id="gate-lid">
              <path d="M 40 120 Q 120 58 200 120 Q 120 182 40 120 Z" />
            </clipPath>
          </defs>

          {/* Sclera opens from a slit */}
          <path
            d="M 40 120 Q 120 58 200 120 Q 120 182 40 120 Z"
            className="fill-[var(--ink-strong)]"
            style={{
              transformOrigin: "120px 120px",
              transform: opening ? "scaleY(1)" : "scaleY(0.02)",
              transition: "transform 1.1s var(--ease-core)",
            }}
          />

          <g
            clipPath="url(#gate-lid)"
            style={{
              opacity: opening ? 1 : 0,
              transition: "opacity 0.6s var(--ease-core) 0.35s",
            }}
          >
            <circle cx="120" cy="120" r="38" className="fill-[var(--brand-accent)]" />
            <circle
              cx="120"
              cy="120"
              r={opening ? 14 : 22}
              fill="#0A0708"
              style={{ transition: "r 0.9s var(--ease-core) 0.4s" }}
            />
            <circle cx="107" cy="107" r="6" fill="#fff" opacity="0.9" />
          </g>

          {/* The closed lid line — all there is before the click */}
          <path
            d="M 40 120 Q 120 58 200 120 Q 120 182 40 120 Z"
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="1.5"
            style={{
              transformOrigin: "120px 120px",
              transform: opening ? "scaleY(1)" : "scaleY(0.02)",
              opacity: opening ? 0.5 : 1,
              transition: "transform 1.1s var(--ease-core), opacity 1.1s var(--ease-core)",
            }}
          />
        </svg>

        <span
          className="font-mono-ui mt-[clamp(28px,5vw,56px)] text-[11px] uppercase tracking-[0.28em] text-[var(--ink-mute)] transition-colors duration-500 group-hover:text-[var(--ink-strong)] group-focus-visible:text-[var(--ink-strong)]"
          style={{
            opacity: opening ? 0 : 1,
            transition: "opacity 0.4s var(--ease-core)",
          }}
        >
          Enter
        </span>
      </button>
    </div>
  )
}
