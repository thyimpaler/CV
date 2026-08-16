import { LineReveal } from "@/components/LineReveal"
import { ProgressiveText } from "@/components/ProgressiveText"
import { useCallback, useEffect, useRef } from "react"
import { useMagnetic } from "@/lib/interactions"
import { usePointerWriter } from "@/lib/pointerVars"
import { useScrollWriter } from "@/lib/scrollStore"

/**
 * Hero built on Kaos's structure rather than pxnz3r's.
 *
 * pxnz3r opens with a commissioned Icarus illustration; there is no CSS
 * substitute for that. Kaos gets the same presence from a heavy-grain
 * luminance ramp plus its wordmark set enormous and bleeding off the bottom
 * edge — all type and gradient, no art assets. That is the version we can
 * actually execute.
 *
 * Layout follows theirs too: statement left, supporting copy right, one
 * small CTA. The bleeding wordmark anchors the bottom.
 */
export function Hero() {
  const cta = useMagnetic<HTMLAnchorElement>(0.28, 80)
  const wordmark = useRef<HTMLSpanElement>(null)
  const lamp = useRef<HTMLDivElement>(null)
  const drift = useRef<HTMLDivElement>(null)

  // Direct write rather than a root custom property — see lib/pointerVars.
  usePointerWriter(
    useCallback(({ x, y }) => {
      const el = wordmark.current
      if (el) el.style.translate = `${x * -26}px calc(26% + ${y * -10}px)`
      // Travel is in viewport units, not a percentage of the lamp's own box.
      // The percentage version moved it +/-365px inside a ~1900px viewport, so
      // the light stayed near the middle no matter where the cursor went and
      // read as not following at all. Scaled to the viewport it tracks the hand
      // across the whole hero; 0.92 keeps it just behind, which is what makes
      // it read as a light in the room rather than a cursor decoration.
      const l = lamp.current
      if (l) {
        const { w, h } = view.current
        l.style.transform = `translate3d(${(x * w * 0.92).toFixed(1)}px, ${(y * h * 0.92).toFixed(1)}px, 0)`
      }
    }, []),
  )

  // Cached so the pointer loop never touches `window` per frame.
  const view = useRef({ w: 1440, h: 900 })
  useEffect(() => {
    const measure = () => {
      view.current = { w: window.innerWidth, h: window.innerHeight }
    }
    measure()
    window.addEventListener("resize", measure, { passive: true })
    return () => window.removeEventListener("resize", measure)
  }, [])

  // The wordmark lifts as the hero leaves. Parallax on the one element that is
  // already decorative, so the section has depth on the way out as well as
  // under the cursor. Transform only — no layout, no paint.
  useScrollWriter(
    useCallback(({ scrollY }) => {
      const el = drift.current
      if (el) el.style.transform = `translate3d(0, ${(-scrollY * 0.16).toFixed(1)}px, 0)`
    }, []),
  )

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[clamp(120px,16vh,190px)]"
    >
      <div className="grain-field" aria-hidden />

      {/* The lamp.
          The hero was flat black behind the type: correct restraint, no depth.
          This is a single soft radial that drifts with the cursor, so the black
          reads as a lit room rather than a flat backdrop.

          Deliberately not a `filter: blur()` — a blurred element this large is
          one of the most expensive things you can put on a page, and a radial
          gradient with soft stops is already the shape a blur would produce, at
          zero raster cost. It moves by transform alone, so it composites and
          never repaints, and it sits behind the content layer so no text is
          drawn on top of a moving surface.

          Alpha is capped low on purpose. This lifts the background luminance
          under white type, which *reduces* contrast — the peak is set where the
          lead paragraph, the palest small text in the hero, still clears
          4.5:1.

          Size is a performance budget, not a taste call, and it trades against
          travel: the further this thing moves per frame, the more of the hero
          it dirties. Measured by interleaving three ON/OFF pairs at 4x CPU
          throttle while scrolling and sweeping the pointer at once, comparing
          against the same page with this element detached:

            1250px, short travel     p95 50.0 vs 33.4 removed   too expensive
             760px, viewport travel  p95 50.0 vs 33.4 removed   too expensive
             540px, viewport travel  indistinguishable from removed

          At 540px both conditions read 33.4 on the first run of a fresh
          browser and ~50 on later ones — an order effect from the machine, not
          this element. Interleaving matters: a first attempt ran the conditions
          in sequence and the drift across runs was larger than the effect being
          measured, which made "removed" look slower than "present". */}
      <div
        /* Centred, not top-42%: the pointer offset is measured from the centre
           of the viewport, so any other rest position adds a constant skew and
           the light never lines up with the hand. */
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[min(62vh,540px)] w-[min(62vw,540px)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div
          ref={lamp}
          className="h-full w-full will-change-transform"
          style={{
            /* Falls off all the way to zero at the edge of the box. The first
               version hit `transparent` at 72%, which puts a real boundary in
               the middle of a solid-black page — it read as a disc with an
               edge, not as light. The extra stops shape the curve so the
               falloff is gradual rather than linear. */
            background:
              "radial-gradient(closest-side, rgba(255,196,0,0.10), rgba(255,193,10,0.058) 28%, rgba(255,186,20,0.026) 52%, rgba(255,180,30,0.009) 76%, rgba(255,176,36,0) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-[var(--section-edge)]">
        <div className="grid gap-[clamp(28px,5vw,80px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* Statement */}
          <div>
            <LineReveal
              as="p"
              text="Web3 Community Architect — Head of Development"
              className="t-eyebrow t-eyebrow--bright block"
              immediate
              stagger={0.018}
              delay={0.15}
            />
            <h1 className="t-h1 mt-[clamp(22px,3vw,40px)] text-[var(--ink-strong)]">
              <LineReveal
                as="span"
                text="Order held under"
                className="block"
                immediate
                stagger={0.055}
                delay={0.32}
              />
              <LineReveal
                as="span"
                text="pressure."
                className="block italic text-[var(--brand-accent)]"
                immediate
                stagger={0.055}
                delay={0.44}
              />
            </h1>

            <div
              className="mt-[clamp(28px,4vw,44px)] flex flex-wrap items-center gap-x-8 gap-y-4"
              style={{ animation: "fade-rise 0.9s var(--ease-core) 0.95s both" }}
            >
              {/* Magnetic: drifts toward the cursor as it approaches. One
                  element on the page gets this — it marks the primary action
                  as the thing worth reaching for. */}
              <a
                ref={cta}
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--ink-strong)] px-6 py-3 text-[14px] font-medium text-[#08080a] [transition:translate_0.45s_var(--ease-core)]"
              >
                Start a conversation
                <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#experience"
                className="group relative -my-3 inline-flex items-center py-3 text-[14px] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)]"
              >
                Selected work
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </div>
          </div>

          {/* Supporting copy, brightening as it resolves */}
          <div className="lg:pt-[clamp(6px,2vw,28px)]">
            <ProgressiveText
              text="I keep fast-moving crypto communities calm, secure and shipping. Five ecosystems across Ethereum, Solana, Base and BESC — plus the bots and role structures that hold them together, and a trading desk that never really closes."
              className="t-lead measure text-[var(--ink)]"
              stagger={0.016}
              delay={0.7}
            />
            {/* The availability/channels strip lived here and is gone — the
                hero says more by saying less, and "available for work" still
                appears once, at the contact section, where it is actionable.

                In its place, the setup half of the page's bookend. The coda
                at the very bottom answers this with "Neither do I." — the
                opening states a fact about the work, the closing makes it
                personal, and the Dracula scene sits between the two. */}
            <p
              className="mt-[clamp(28px,4vw,44px)] font-[family-name:var(--font-display)] text-[clamp(19px,2vw,28px)] italic leading-tight text-[var(--ink-mute)]"
              style={{ animation: "fade-rise 0.9s var(--ease-core) 1.15s both" }}
            >
              The market never closes.
            </p>
          </div>
        </div>
      </div>

      {/* Wordmark bleeding off the bottom edge. Clipped by the section's
          overflow-hidden, which is the whole point — an image or word that
          runs past the frame implies the composition continues. */}
      <div
        className="pointer-events-none relative z-0 mt-auto select-none"
        style={{ animation: "fade-rise 1.4s var(--ease-core) 0.55s both" }}
        aria-hidden
      >
        {/* Drifts a few pixels against the cursor. Far too small to notice
            directly — it registers as the page having depth rather than as
            an effect, which is the point. */}
        {/* 19.5vw is ~250px on desktop but only ~76px on a phone, where it
            read as a small clipped word rather than a deliberate bleed. Phones
            get a much larger ratio so the wordmark still fills the base of the
            composition and absorbs the vertical space short copy leaves. */}
        {/* Own layer for the scroll parallax. It cannot share an element with
            the fade-rise entrance: that animation drives `transform` with
            fill-mode `both`, so its final `translateY(0)` keeps winning over
            an inline transform long after the animation has finished, and the
            parallax would silently never apply. */}
        <div ref={drift} className="will-change-transform">
          <span
            ref={wordmark}
            className="block whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[26vw] leading-[0.8] tracking-[-0.055em] text-[var(--ink-strong)] opacity-[0.11] sm:text-[19.5vw]"
            style={{ translate: "0 26%" }}
          >
            ThyImpaler
          </span>
        </div>
      </div>
    </section>
  )
}
