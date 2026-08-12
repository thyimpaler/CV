import { useEffect, useRef, useState } from "react"
import { LineReveal } from "@/components/LineReveal"

/**
 * Closing scene. The last thing on the page, after contact.
 *
 * pxnz3r ends with feathers and an Icarus line that answers the hero; this
 * is the same idea with Sisyphus — the boulder is a better fit for work that
 * is fundamentally about holding a room steady, over and over, while the
 * chart does whatever it does.
 *
 * Two details do the heavy lifting:
 *
 *  1. `mix-blend-mode: screen` — the artwork's background is near-black, and
 *     screen blending makes black contribute nothing. The pasted square
 *     disappears and only the moon, the light beam and the silhouettes
 *     survive, sitting *in* the page rather than on top of it.
 *  2. A radial mask on top of that, so even the lit edges fall off instead
 *     of ending at a hard boundary.
 *
 * The file is ~1.6MB, so it is not requested until the reader is actually
 * approaching the bottom of the page.
 */
export function Coda() {
  const ref = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true)
          io.disconnect()
        }
      },
      // Generous margin: start the download before it is on screen so it has
      // loaded by the time it matters, without costing anything up front.
      { rootMargin: "700px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[var(--section-edge)] pb-[clamp(32px,5vw,64px)] pt-[clamp(60px,10vw,140px)]"
    >
      {/* Scene */}
      <div className="relative flex w-full flex-1 items-center justify-center">
        <div
          className="relative aspect-square w-[min(88vw,620px)]"
          style={{
            // Edges dissolve rather than cut off.
            maskImage:
              "radial-gradient(circle at 50% 50%, #000 34%, rgba(0,0,0,0.55) 58%, transparent 76%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, #000 34%, rgba(0,0,0,0.55) 58%, transparent 76%)",
          }}
        >
          {nearViewport ? (
            <img
              src="/sisyphus.gif"
              alt="An illustrated figure pushing a boulder up a moonlit slope"
              className="h-full w-full object-contain opacity-0 mix-blend-screen"
              style={{ animation: "fade-rise 2s var(--ease-core) 0.2s forwards" }}
            />
          ) : null}
        </div>

        {/* Warm bloom behind the scene, tied to the brand accent so the moon
            reads gold rather than neutral white. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(closest-side at 50% 42%, rgba(255,196,0,0.10), transparent 70%)",
          }}
          aria-hidden
        />
      </div>

      {/* The line that answers the hero */}
      <div className="relative z-10 mt-[clamp(20px,4vw,48px)] text-center">
        <LineReveal
          as="p"
          text="One must imagine Sisyphus happy."
          className="block font-[family-name:var(--font-display)] text-[clamp(22px,3.2vw,44px)] italic leading-tight text-[var(--ink-strong)]"
          stagger={0.06}
        />
        <p className="t-eyebrow mt-5">Albert Camus</p>
      </div>

      <div className="relative z-10 mt-[clamp(40px,7vw,90px)] flex w-full flex-wrap items-center justify-between gap-4">
        <span className="font-mono-ui text-[11px] text-[var(--ink-mute)]">
          © {new Date().getFullYear()} ThyImpaler
        </span>
        {/* Credit for the artwork — it is Doze Studio's, not mine. */}
        <a
          href="https://giphy.com/gifs/loop-infinite-xT0BKumCMrUb0dCypa"
          target="_blank"
          rel="noreferrer"
          className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] opacity-70 transition-opacity duration-300 hover:opacity-100"
        >
          Artwork — Doze Studio
        </a>
        <a
          href="#hero"
          className="font-mono-ui group inline-flex items-center gap-2 text-[11px] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
        >
          <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:-translate-y-0.5">
            ↑
          </span>
          Back to top
        </a>
      </div>
    </section>
  )
}
