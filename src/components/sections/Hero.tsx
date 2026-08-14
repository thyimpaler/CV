import { LineReveal } from "@/components/LineReveal"
import { ProgressiveText } from "@/components/ProgressiveText"
import { useMagnetic, usePointerOffset } from "@/lib/interactions"

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
  const pointer = usePointerOffset()

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[clamp(120px,16vh,190px)]"
    >
      <div className="grain-field" aria-hidden />

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
        <span
          className="block whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[26vw] leading-[0.8] tracking-[-0.055em] text-[var(--ink-strong)] opacity-[0.11] sm:text-[19.5vw]"
          style={{
            translate: `${pointer.x * -26}px calc(26% + ${pointer.y * -10}px)`,
          }}
        >
          ThyImpaler
        </span>
      </div>
    </section>
  )
}
