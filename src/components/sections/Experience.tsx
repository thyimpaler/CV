import { useEffect, useRef, useState } from "react"
import { experiences } from "@/data/cv"
import { SectionHeader } from "@/components/SectionHeader"
import { RevealOnScroll } from "@/components/LineReveal"
import { WatchingEye } from "@/components/ArgusEyes"

/**
 * Experience as a vertical focus table.
 *
 * The row nearest the centre of the viewport takes focus as you scroll — it
 * sharpens, grows and reveals its testimonial, while the rows above and below
 * blur and recede. Focus follows the reader; no clicking, no sideways scroll.
 *
 * ## Why this is built the way it is
 *
 * The first version of this effect was the worst performance problem on the
 * site: p95 frame 800ms, worst 1.6s. Four separate **layout**-triggering
 * transitions (`padding`, two `font-size`, `grid-template-rows`) were nested
 * *inside* an element carrying an animated `filter: blur()`. Because a layout
 * change invalidates a blur's raster cache, the costs multiplied — every
 * layout frame forced a full re-blur of a 1250px-wide row, 700ms at a time.
 *
 * So the rules here are:
 *
 *  - **Size changes use `transform: scale()`, never `font-size`.** The type is
 *    set at its focused size and scaled *down* when inactive; scaling down
 *    keeps text crisp where scaling up would soften it.
 *  - **Padding is constant.** Nothing transitions a box-model property.
 *  - **Blur lives on its own wrapper with `contain: layout paint`,** which
 *    stops a repaint inside one row invalidating anything else, and is capped
 *    low — blur cost scales with radius.
 *  - **The blurred wrapper holds no layout transitions.** The testimonial's
 *    `grid-template-rows` animation sits outside it.
 *  - Rows use `blur(0px)` rather than `none` when focused, so the value
 *    interpolates instead of snapping.
 *
 * ## The measurement feedback loop
 *
 * The old version measured with `getBoundingClientRect()` every frame while
 * simultaneously animating row heights. Growing the active row moved every row
 * below it, so the next frame measured different centres and `active` could
 * hunt back and forth at a boundary — the measurement's input was changed by
 * its own output. Row offsets are now cached on mount and on resize, and the
 * active row is derived from `scrollY` arithmetic against those fixed offsets.
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
  const offsets = useRef<number[]>([])
  const [active, setActive] = useState(0)
  const [distances, setDistances] = useState<number[]>(() =>
    experiences.map((_, i) => (i === 0 ? 0 : 1)),
  )

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Cached once, and only re-read when the viewport actually changes. This
    // is the only place layout is read.
    const remeasure = () => {
      offsets.current = rowRefs.current.map((el) => {
        if (!el) return 0
        const r = el.getBoundingClientRect()
        return r.top + window.scrollY + r.height / 2
      })
    }

    let frame = 0
    const measure = () => {
      frame = 0
      const mid = window.scrollY + window.innerHeight / 2
      let best = 0
      let bestDist = Infinity

      const next = offsets.current.map((centre, i) => {
        const raw = Math.abs(centre - mid)
        if (raw < bestDist) {
          bestDist = raw
          best = i
        }
        // Snapped to sixths. Six discrete blur values across the section is
        // indistinguishable from a continuous ramp once the CSS transition
        // smooths between them, and costs a fraction of the rasterisation.
        return Math.round(Math.min(1, raw / (window.innerHeight * 0.5)) * 6) / 6
      })

      const quantised = reduce ? next.map((_, i) => (i === best ? 0 : 0.5)) : next
      setDistances((prev) =>
        prev.length === quantised.length && prev.every((v, i) => v === quantised[i])
          ? prev
          : quantised,
      )
      setActive((prev) => (prev === best ? prev : best))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    const onResize = () => {
      remeasure()
      onScroll()
    }

    remeasure()
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="experience" className="section-shell relative">
      {/* Watching the run of roles from the margin. */}
      <WatchingEye
        className="absolute left-[calc(var(--section-edge)/3)] top-[42%] hidden xl:block"
        size={26}
      />
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
              className="border-b border-[var(--line-soft)]"
            >
              {/* Blur wrapper. `contain: layout paint` bounds the repaint to
                  this row, and nothing inside it changes layout. */}
              <div
                className="transition-[filter,opacity] duration-500 [transition-timing-function:var(--ease-core)]"
                style={{
                  filter: `blur(${(d * 1.6).toFixed(2)}px)`,
                  opacity: 1 - d * 0.62,
                  contain: "layout paint",
                }}
              >
                <div className="grid gap-x-[clamp(20px,4vw,56px)] gap-y-4 py-[clamp(26px,3.4vw,44px)] md:grid-cols-[minmax(120px,0.55fr)_1.45fr_minmax(150px,0.85fr)]">
                  {/* Period + status */}
                  <div className="order-2 md:order-none">
                    <span className="font-mono-ui block text-[12px] tabular-nums text-[var(--ink-mute)]">
                      {exp.period}
                    </span>
                    <span
                      className={`font-mono-ui mt-2 inline-block text-[10px] uppercase tracking-[0.14em] ${
                        exp.status === "Active"
                          ? "text-[var(--brand-accent)]"
                          : "text-[var(--ink-mute)] opacity-60"
                      }`}
                    >
                      {exp.status}
                      {exp.dev ? " · Dev" : ""}
                    </span>
                  </div>

                  {/* Impact */}
                  <div className="order-3 md:order-none">
                    {/* Set at the focused size and scaled down when inactive —
                        transform only, so no layout and no text re-shaping. */}
                    <p
                      className="origin-left text-[clamp(18px,1.9vw,25px)] leading-snug text-[var(--ink-strong)] transition-transform duration-700 [transition-timing-function:var(--ease-core)]"
                      style={{ transform: isActive ? "scale(1)" : "scale(0.78)" }}
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
                  </div>

                  {/* Project */}
                  <div className="order-1 md:order-none md:text-right">
                    <span className="inline-flex items-baseline gap-2">
                      <span
                        className="block origin-left font-[family-name:var(--font-display)] text-[clamp(26px,2.8vw,42px)] leading-none transition-[transform,color] duration-700 [transition-timing-function:var(--ease-core)] md:origin-right"
                        style={{
                          transform: isActive ? "scale(1)" : "scale(0.72)",
                          color: isActive ? "var(--brand-accent)" : "var(--ink-strong)",
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
                          className="font-mono-ui -my-2.5 mt-1.5 inline-flex min-h-[44px] items-center py-2.5 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] transition-colors duration-300 hover:text-[var(--brand-accent)]"
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
                        className="group/link font-mono-ui -my-2.5 mt-2 inline-flex min-h-[44px] items-center gap-2 py-2.5 text-[10px] uppercase tracking-[0.12em] text-[var(--brand-accent)] transition-opacity duration-500"
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

              {/* Testimonial, deliberately OUTSIDE the blurred wrapper. Its
                  height animation is a layout change, and inside the blur it
                  would invalidate the row's raster on every frame of the
                  700ms transition. */}
              {exp.lead?.quote ? (
                <div
                  className="grid px-0 transition-[grid-template-rows,opacity] duration-700 [transition-timing-function:var(--ease-core)] md:grid-cols-1"
                  style={{
                    gridTemplateRows: isActive ? "1fr" : "0fr",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <figure className="mb-[clamp(26px,3.4vw,44px)] border-l border-[var(--brand-accent)]/35 pl-5 md:ml-[calc(((100%-2*clamp(20px,4vw,56px))*0.22)+clamp(20px,4vw,56px))]">
                      <blockquote className="font-[family-name:var(--font-display)] text-[clamp(17px,1.8vw,23px)] italic leading-snug text-[var(--ink-strong)]">
                        “{exp.lead.quote}”
                      </blockquote>
                      <figcaption className="mt-4 flex items-center gap-3">
                        {/* Round, name-captioned — a person, not a token mark. */}
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
