import { useEffect, useRef, useState } from "react"
import { experiences } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"

/**
 * Experience as a horizontal board — one role in focus at a time.
 *
 * A vertical list gives every role equal weight and the reader skims all five
 * at once. Advancing sideways forces them to arrive one at a time, which is
 * the "drumroll": the card in focus sits at full contrast and scale while its
 * neighbours dim and shrink, so attention has somewhere to be.
 *
 * Built on CSS scroll-snap rather than a carousel library — native momentum
 * on touch, real keyboard and scrollbar behaviour, and it degrades to a plain
 * scrollable row if anything about the JS fails.
 */

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function Experience() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // Track which card is nearest the centre of the viewport.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const measure = () => {
      frame = 0
      const mid = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement
        const c = el.offsetLeft + el.offsetWidth / 2
        const d = Math.abs(c - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    track.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const el = track.children[i] as HTMLElement | undefined
    if (!el) return
    track.scrollTo({
      left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    })
  }

  return (
    <section id="experience" className="section-shell !px-0">
      <div className="px-[var(--section-edge)]">
        <SectionHeader
          index="01"
          label="Experience"
          title="Where I've operated"
          className="heading-gap"
        />
      </div>

      {/* Track. Padding on the inline edges lets the first and last card
          reach the centre of the viewport when snapped. */}
      <div
        ref={trackRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-[clamp(16px,2vw,28px)] overflow-x-auto scroll-smooth px-[max(var(--section-edge),calc(50vw-var(--card-w)/2))] pb-4"
        style={{ "--card-w": "clamp(280px, 34vw, 460px)" } as React.CSSProperties}
        role="group"
        aria-label="Experience, scroll sideways"
      >
        {experiences.map((exp, i) => {
          const isActive = i === active
          const linked = Boolean(exp.href)

          return (
            <article
              key={`${exp.project}-${i}`}
              className="group/card relative flex w-[var(--card-w)] shrink-0 snap-center flex-col justify-between rounded-[4px] border p-[clamp(20px,2.2vw,32px)] transition-all duration-700 [transition-timing-function:var(--ease-core)]"
              style={{
                // The focused card is brighter, larger and lifted; the rest
                // recede rather than disappear, so the run stays legible.
                borderColor: isActive ? "var(--line)" : "var(--line-soft)",
                background: isActive ? "#0c0c0f" : "transparent",
                opacity: isActive ? 1 : 0.38,
                scale: isActive ? "1" : "0.94",
                minHeight: "clamp(320px, 38vw, 420px)",
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono-ui text-[11px] tabular-nums text-[var(--ink-mute)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-mono-ui text-[10px] uppercase tracking-[0.14em] ${
                      exp.status === "Active"
                        ? "text-[var(--brand-gold)]"
                        : "text-[var(--ink-mute)] opacity-60"
                    }`}
                  >
                    {exp.status}
                    {exp.dev ? " · Dev" : ""}
                  </span>
                </div>

                <div className="mt-[clamp(24px,3vw,40px)] flex items-center gap-4">
                  {exp.art ? (
                    <img
                      src={exp.art}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-[3px] object-cover grayscale transition-all duration-700 [transition-timing-function:var(--ease-core)] group-hover/card:grayscale-0"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <h3 className="font-[family-name:var(--font-display)] text-[clamp(24px,2.4vw,36px)] leading-none text-[var(--ink-strong)]">
                      {exp.project}
                    </h3>
                    <p className="mt-2 text-[13px] text-[var(--ink-mute)]">{exp.role}</p>
                  </div>
                </div>

                <p className="mt-[clamp(20px,2.4vw,30px)] text-[clamp(15px,1.4vw,19px)] leading-snug text-[var(--ink-strong)]">
                  {exp.impact}
                </p>
              </div>

              <div className="mt-6">
                {exp.tags?.length ? (
                  <ul className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-2">
                    {exp.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-mono-ui rounded-full border border-[var(--line-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[var(--ink-mute)]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="flex items-end justify-between gap-4 border-t border-[var(--line-soft)] pt-4">
                  <div className="min-w-0">
                    <span className="font-mono-ui block text-[11px] tabular-nums text-[var(--ink-mute)]">
                      {exp.period}
                    </span>
                    {exp.sub ? (
                      exp.subHref ? (
                        <a
                          href={exp.subHref}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono-ui mt-1.5 inline-block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--brand-gold)]"
                        >
                          {exp.sub} ↗
                        </a>
                      ) : (
                        <span className="font-mono-ui mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                          {exp.sub}
                        </span>
                      )
                    ) : null}
                  </div>

                  {linked ? (
                    <a
                      href={exp.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link font-mono-ui inline-flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--brand-gold)]"
                    >
                      {host(exp.href!)}
                      <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Position indicator — segments, not dots, so the run reads as a
          timeline with length rather than a slideshow. */}
      <div className="mt-[clamp(24px,3vw,44px)] flex items-center justify-center gap-2 px-[var(--section-edge)]">
        {experiences.map((exp, i) => (
          <button
            key={exp.project}
            onClick={() => goTo(i)}
            aria-label={`Go to ${exp.project}`}
            aria-current={i === active}
            className="group/seg -my-3 py-3 outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)]/50"
          >
            <span
              className="block h-px transition-all duration-500 [transition-timing-function:var(--ease-core)]"
              style={{
                width: i === active ? "clamp(34px,4vw,56px)" : "clamp(16px,2vw,24px)",
                background: i === active ? "var(--brand-gold)" : "var(--line)",
              }}
            />
          </button>
        ))}
      </div>

      <RevealOnScroll className="mt-6 px-[var(--section-edge)] text-center">
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)] opacity-60">
          Scroll sideways
        </span>
      </RevealOnScroll>
    </section>
  )
}
