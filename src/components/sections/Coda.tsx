import { useEffect, useRef, useState } from "react"
import { LineReveal } from "@/components/LineReveal"

/**
 * Closing scene. The last thing on the page, after contact.
 *
 * Bookends the hero: the hero states "The market never closes", this answers
 * it with "Neither do I." Vlad the Impaler is where the handle comes from, so
 * the closing image is Dracula rather than the Sisyphus boulder that was here
 * before — the myth now matches the name instead of being borrowed.
 *
 * Two details do the heavy lifting:
 *
 *  1. `mix-blend-mode: screen` — the artwork's background is near-black, and
 *     screen blending makes black contribute nothing. The pasted square
 *     disappears and only the lit parts survive, sitting *in* the page rather
 *     than on top of it.
 *  2. A radial mask on top of that, so even the lit edges fall off instead of
 *     ending at a hard boundary.
 *
 * The artwork is only requested as the reader approaches the bottom.
 *
 * If /dracula.gif is missing the section still composes — the line and the
 * footer carry it, and the scene simply stays empty. No placeholder art.
 */
export function Coda() {
  const ref = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const [hasArt, setHasArt] = useState(true)

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
          {nearViewport && hasArt ? (
            <img
              src="/dracula.gif"
              alt="Illustrated Dracula"
              onError={() => setHasArt(false)}
              className="h-full w-full object-contain opacity-0 mix-blend-screen"
              style={{ animation: "fade-rise 2s var(--ease-core) 0.2s forwards" }}
            />
          ) : null}
        </div>

        {/* Bloom behind the scene, tied to the accent so the light in the
            artwork reads blood rather than neutral white. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(closest-side at 50% 42%, rgba(230,57,70,0.12), transparent 70%)",
          }}
          aria-hidden
        />
      </div>

      {/* The line that answers the hero */}
      <div className="relative z-10 mt-[clamp(20px,4vw,48px)] text-center">
        <LineReveal
          as="p"
          text="Neither do I."
          className="block font-[family-name:var(--font-display)] text-[clamp(26px,4vw,58px)] italic leading-tight text-[var(--ink-strong)]"
          stagger={0.07}
        />
      </div>

      <div className="relative z-10 mt-[clamp(40px,7vw,90px)] flex w-full flex-wrap items-center justify-between gap-4">
        <span className="font-mono-ui text-[11px] text-[var(--ink-mute)]">
          © {new Date().getFullYear()} ThyImpaler
        </span>
        <a
          href="#hero"
          className="font-mono-ui group -my-3 inline-flex items-center gap-2 py-3 text-[11px] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
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
