import { useEffect, useState } from "react"
import { ScrambleText } from "@/components/ScrambleText"

/**
 * Minimal fixed header.
 *
 * It starts transparent and only acquires a background once the reader
 * leaves the hero — a nav bar that is visible from the first frame competes
 * with the headline it sits on top of.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Gradient scrim instead of a frosted bar.
          `backdrop-filter: blur()` samples a rectangular region, and on some
          GPUs the edge of that sample box renders as a hard lighter band
          across the page — a seam with no element to explain it. It also
          forces a re-composite of everything beneath it on every scroll
          frame, the same cost that caused the earlier smearing.

          A gradient that fades to transparent has no boundary to show and no
          sampling to do. It also suits the page better: a frosted bar is a
          chrome affordance, a scrim just keeps the type legible and stays
          out of the way. */}
      <div
        /* Extends past the header so the gradient has room to reach zero —
           ending it at the header's own edge would reintroduce the hard line
           this replaces. */
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-16 -z-10 transition-opacity duration-700 [transition-timing-function:var(--ease-core)]"
        style={{
          opacity: scrolled ? 1 : 0,
          background:
            "linear-gradient(to bottom, var(--background) 0%, color-mix(in oklab, var(--background), transparent 25%) 55%, transparent 100%)",
        }}
        aria-hidden
      />
      <nav className="flex items-center justify-between px-[var(--section-edge)] py-[clamp(14px,1.8vw,22px)]">
        <a
          href="#hero"
          /* py/-my pairs expand the touch area to ~44px without moving
             anything — small text links are otherwise ~17px tall, well under
             the minimum comfortable tap size on a phone. */
          className="font-[family-name:var(--font-display)] -my-3 inline-flex items-center py-3 text-[17px] leading-none text-[var(--ink-strong)] transition-colors duration-300 hover:text-[var(--brand-accent)]"
        >
          Thy<span className="italic">Impaler</span>
        </a>

        <div className="flex items-center gap-[clamp(18px,3vw,40px)]">
          {/* Labels decode out of scrambled glyphs on hover. Safe here
              because they're monospace at fixed tracking — every substituted
              character is the same width, so nothing reflows mid-animation. */}
          {[
            { href: "#about", label: "About" },
            { href: "#experience", label: "Work" },
            { href: "#projects", label: "Projects" },
            { href: "#toolkit", label: "Stack" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono-ui -my-3 hidden items-center py-3 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--ink-strong)] sm:inline-flex"
            >
              <ScrambleText text={item.label} />
            </a>
          ))}
          <a
            href="#contact"
            className="group font-mono-ui relative -my-3 inline-flex items-center py-3 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-strong)]"
          >
            <ScrambleText text="Contact" />
            <span className="absolute bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-[var(--brand-accent)] transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover:origin-left group-hover:scale-x-100" />
          </a>
        </div>
      </nav>
    </header>
  )
}
