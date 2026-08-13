import { useEffect, useRef, useState } from "react"
import { experiences } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"

/**
 * Experience as a vertical focus table.
 *
 * One continuous rectangle of rows. The row nearest the centre of the
 * viewport takes focus as you scroll normally — it expands to reveal its
 * detail and testimonial, sits sharp and at full contrast, while the rows
 * above and below blur and compress. No sideways scrolling, no clicking: the
 * focus follows the reader down the page.
 *
 * Blur scales with distance from centre rather than switching on and off, so
 * neighbours soften gradually instead of snapping between two states.
 */

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function Experience() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  // Distance of each row from viewport centre, 0 (centred) to 1 (far).
  const [distances, setDistances] = useState<number[]>(() =>
    experiences.map((_, i) => (i === 0 ? 0 : 1)),
  )

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0

    const measure = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity

      const next = rowRefs.current.map((el, i) => {
        if (!el) return 1
        const r = el.getBoundingClientRect()
        const centre = r.top + r.height / 2
        const raw = Math.abs(centre - mid)
        if (raw < bestDist) {
          bestDist = raw
          best = i
        }
        // Normalise against half the viewport — a row a full half-screen away
        // is fully receded.
        return Math.min(1, raw / (window.innerHeight * 0.5))
      })

      setDistances(reduce ? next.map((_, i) => (i === best ? 0 : 0.4)) : next)
      setActive(best)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="experience" className="section-shell">
      <SectionHeader
        index="01"
        label="Experience"
        title="Where I've operated"
        className="heading-gap"
      />

      <div className="border-t border-[var(--line-soft)]">
        {experiences.map((exp, i) => {
          const isActive = i === active
          const d = distances[i] ?? 1

          return (
            <div
              key={`${exp.project}-${i}`}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              className="border-b border-[var(--line-soft)] transition-[filter,opacity] duration-500 [transition-timing-function:var(--ease-core)]"
              style={{
                // Softens with distance instead of toggling — the whole point
                // of the effect is the gradient between states.
                filter: `blur(${(d * 3.2).toFixed(2)}px)`,
                opacity: 1 - d * 0.62,
              }}
            >
              <div
                className="grid gap-x-[clamp(20px,4vw,56px)] gap-y-4 transition-[padding] duration-700 [transition-timing-function:var(--ease-core)] md:grid-cols-[minmax(120px,0.55fr)_1.45fr_minmax(150px,0.85fr)]"
                style={{
                  // The focused row stretches top and bottom.
                  paddingBlock: isActive
                    ? "clamp(38px, 5vw, 68px)"
                    : "clamp(18px, 2.2vw, 26px)",
                }}
              >
                {/* Period + status */}
                <div className="order-2 md:order-none">
                  <span className="font-mono-ui block text-[12px] tabular-nums text-[var(--ink-mute)]">
                    {exp.period}
                  </span>
                  <span
                    className={`font-mono-ui mt-2 inline-block text-[10px] uppercase tracking-[0.14em] ${
                      exp.status === "Active"
                        ? "text-[var(--brand-blood-text)]"
                        : "text-[var(--ink-mute)] opacity-60"
                    }`}
                  >
                    {exp.status}
                    {exp.dev ? " · Dev" : ""}
                  </span>
                </div>

                {/* Impact, then the testimonial once focused */}
                <div className="order-3 md:order-none">
                  <p
                    className="leading-snug text-[var(--ink-strong)] transition-[font-size] duration-700 [transition-timing-function:var(--ease-core)]"
                    style={{
                      fontSize: isActive
                        ? "clamp(18px, 1.9vw, 25px)"
                        : "clamp(15px, 1.4vw, 18px)",
                    }}
                  >
                    {exp.impact}
                  </p>

                  {exp.tags?.length ? (
                    <ul className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2">
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

                  {/* Testimonial expands with the row. grid-rows 0fr→1fr
                      animates to auto height without measuring. */}
                  {exp.lead?.quote ? (
                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-700 [transition-timing-function:var(--ease-core)]"
                      style={{
                        gridTemplateRows: isActive ? "1fr" : "0fr",
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <figure className="mt-7 border-l border-[var(--brand-blood)]/35 pl-5">
                          <blockquote className="font-[family-name:var(--font-display)] text-[clamp(17px,1.8vw,23px)] italic leading-snug text-[var(--ink-strong)]">
                            “{exp.lead.quote}”
                          </blockquote>
                          <figcaption className="mt-4 flex items-center gap-3">
                            {/* Round, name-captioned — a person, not a token
                                mark. Square art beside the project title read
                                as the coin's logo, which it never was. */}
                            {exp.lead.avatar ? (
                              <img
                                src={exp.lead.avatar}
                                alt=""
                                loading="lazy"
                                className="h-8 w-8 shrink-0 rounded-full object-cover"
                              />
                            ) : null}
                            <span className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                              {exp.lead.name}
                              {exp.lead.role ? (
                                <span className="opacity-60"> · {exp.lead.role}</span>
                              ) : null}
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Project */}
                <div className="order-1 md:order-none md:text-right">
                  <span className="inline-flex items-baseline gap-2">
                    <span
                      className="font-[family-name:var(--font-display)] leading-none transition-[font-size,color] duration-700 [transition-timing-function:var(--ease-core)]"
                      style={{
                        fontSize: isActive
                          ? "clamp(26px, 2.8vw, 42px)"
                          : "clamp(20px, 2vw, 28px)",
                        color: isActive ? "var(--brand-blood)" : "var(--ink-strong)",
                      }}
                    >
                      {exp.project}
                    </span>
                  </span>

                  <span className="mt-2.5 block text-[13px] text-[var(--ink-mute)]">
                    {exp.role}
                  </span>

                  {exp.sub ? (
                    exp.subHref ? (
                      <a
                        href={exp.subHref}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono-ui mt-1.5 inline-block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--brand-blood)]"
                      >
                        {exp.sub} ↗
                      </a>
                    ) : (
                      <span className="font-mono-ui mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                        {exp.sub}
                      </span>
                    )
                  ) : null}

                  {exp.href ? (
                    <a
                      href={exp.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link font-mono-ui mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--brand-blood-text)] transition-opacity duration-500"
                      style={{ opacity: isActive ? 0.85 : 0 }}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {host(exp.href)}
                      <span className="transition-transform duration-500 [transition-timing-function:var(--ease-core)] group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <RevealOnScroll className="mt-8 text-center">
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)] opacity-50">
          Keep scrolling
        </span>
      </RevealOnScroll>
    </section>
  )
}
